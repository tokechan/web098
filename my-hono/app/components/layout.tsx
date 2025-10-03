import { css, cx } from "hono/css";
import type { FC } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";

const className = css``;

const headerClass = css`
  boorder-bottom: 1px solid #ddd;
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.5rem 1rem;
  justify-content: space-between;
`;

const titleClass = css`
  font-size: 1.5rem;
  margin: 0;
`;

const navClass = css `
  font-size: 1.5rem;
  gap: 1rem;
`;

// & nesting selector https://developer.mozilla.org/en-US/docs/Web/CSS/Nesting_selector
// を使って疑似クラスをそ指定する
const linkClass = css`
  &:hover {
  background-color:rgb(35, 253, 104);
  }
  text-decoration: none;
  padding: 0.5rem 1rem;
  color:rgb(0, 47, 123);
  border-radius: 3px;
`;


const activeLinkClass = css`
  backgroud-color:rgb(255, 132, 0);
`;

const containerClass =css`
  max-widht: 800px;
  magin: 0 auto;
  padding: 1rem;
`;

const links = [
  { href: "/posts", text: "Posts" },
  { href: "/posts/create", text: "Create" },
];

export const Layout: FC = ({ children }) => {
  const c = useRequestContext();
  const current = c.req.path;
  return (
    <div class={className}>
      <header class={headerClass}>
        <h1 class={titleClass}>
          <a href="/" class={linkClass}>
          HonoX blogh🔥🔥🔥
          </a>
        </h1>
        <nav class={navClass}>
          {links.map((link) => (
            <a
              href={link.href}
              // cx は　clsxのように複数のクラスを結合する関数
              class={cx(linkClass, current == link.href && activeLinkClass)}
            >
              {link.text}
            </a>
          ))}
        </nav>
      </header>
      <main class={containerClass}>{children}</main>
    </div>
  );
};