import type {} from 'hono';
//ここで第二引数を定義してる
type Head = {
  title?: string;
};
declare module 'hono' {
  interface Env {
    Variables: {};
    Bindings: {};
  }
  interface ContextRenderer {
    (contnt: string | Promise<string>, head?: Head):
      | Response
      | Promise<Response>;
  }
}
