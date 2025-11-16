import type {} from 'hono';
//ここで第二引数を定義してる
type Head = {
  title?: string;
};
declare module 'hono' {
  interface Env {
    Variables: Record<string, unknown>;
    Bindings: Record<string, unknown>;
  }
  interface ContextRenderer {
    (contnt: string | Promise<string>, head?: Head):
      | Response
      | Promise<Response>;
  }
}
