import { css } from "hono/css";
import { createRoute } from "honox/factory";
import type { FC } from "hono/jsx";
import { z }  from "zod";
import { zValidator } from "@hono/zod-validator";

const titleClass = css`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const formClass = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const labelClass = css`
  display: flex;
  flex-direction: column;
  font-weight: bold;
  gap: 0.5rem;
`;

const inputClass = css`
  width: 100%;
  padding: 0.5rem 0.25em;
  border-radius: 3px;
  border: 2px solid #ddd;
`;

const textareaClass = css`
  width: 100%;
  border: 2px solid #ddd;
  border-radius: 3px;
  padding: 0.5rem;
  min-height: 10rem;
  resize: vertical;
`;

const buttonClass = css`
  padding: 0.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 999px;
`;

const errorClass = css`
  color: red;
  font-size: 0.75rem;
`;


type Data = {
  title: {
    value: string;
    error: string[] | undefined;
  };

  content: {
    value: string;
    error: string[] | undefined;
  };
};

type Props = {
  data?: Data;
};


const Page: FC<Props> = ({ data }) => {
  return (
    <div>
      <h1 class={titleClass}>Create an post</h1>
      <form class={formClass} method="post">
        <label class={labelClass}>
          Title
          <input 
            name="title" 
            class={inputClass} 
            type="text" 
            vlue={data?.title.value}  
          />
        </label>
        {data?.title.error && data.title.error.map((error) => <p class={errorClass}>{error}</p>)}

        <label class={labelClass}>
          Content
          <textarea 
            name="content" 
            class={textareaClass} 
            value={data?.content.value}  
          />
        </label>
        {data?.content.error && data.content.error.map((error) => <p class={errorClass}>{error}</p>)}
        
        <button class={buttonClass} type="submit">
          Create
        </button>
      </form>
    </div>
  );
};


export default createRoute((c) => {
  return c.render(<Page />);
});

const Post = z.object({
  title: z.string().min(1,"Title is required").max(255),
  content: z.string().min(1,"Content is required"),
});

export const POST = createRoute(
    zValidator("form", Post, async(result, c) => {
      if (!result.success) {
        
        const body = await c.req.parseBody();
        const { fieldErrors } = result.error.flatten();
        
  
      const data: Data = {
        title: {
          value: (body.title as string) ?? "", error: fieldErrors.title },
        content: { 
          value: (body.content as string) ?? "", error: fieldErrors.content },
        };
      return c.render(<Page data={data} />);
      };
    }),

      async (c) => {
        const { title, content } = c.req.valid("form");
        console.log({ title, content });
        return c.redirect("/blogs", 303);
      }
);
