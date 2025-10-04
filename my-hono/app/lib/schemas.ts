import { z } from 'zod';

export const PostRowSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  title: z.string().min(1),
  content: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type PostRow = z.infer<typeof PostRowSchema>;
