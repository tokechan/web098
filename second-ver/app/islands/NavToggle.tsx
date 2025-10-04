'use client';

import { css } from 'hono/css';
import { useEffect, useState } from 'hono/jsx';

const btn = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  &:hover {
    background-color: rgb(35, 253, 104);
  }
  /* PCでは隠す */
  @media (min-width: 768px) {
    display: none;
  }
`;

const srOnly = css`
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const icon = css`
  font-size: 1.125rem;
  line-height: 1;
  color: rgb(22, 194, 19);
`;

export default function NavToggle(props: {
  target: string;
  backdropId?: string;
}) {
  const [open, setOpen] = useState(false);

  // ターゲットnavの open 属性を同期
  useEffect(() => {
    const nav = document.getElementById(props.target);
    if (nav) nav.setAttribute('data-open', String(open));
    const bd = props.backdropId
      ? document.getElementById(props.backdropId)
      : null;
    if (bd) bd.setAttribute('data-open', String(open));
  }, [open, props.target, props.backdropId]);

  //オーバレイクリックで閉じる
  useEffect(() => {
    if (!props.backdropId) return;
    const bd = document.getElementById(props.backdropId);
    if (!bd) return;
    const onClick = () => setOpen(false);
    bd.addEventListener('click', onClick);
    return () => bd.removeEventListener('click', onClick);
  }, [props.backdropId]);

  // Escで閉じる
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  //背景スクロール固定（開いてる間）
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // 追加: メニュー内リンクをクリックしたら閉じる
  useEffect(() => {
    const nav = document.getElementById(props.target);
    if (!nav) return;

    const onClick = (e: Event) => {
      // aタグか a内の子要素をクリックしたら閉じる
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      // 中クリック/新規タブ(⌘/Ctrl)だけは閉じない…にするなら下を有効化
      // const me = e as MouseEvent;
      // if (me.button === 1 || me.metaKey || me.ctrlKey) return;

      setOpen(false);
    };

    nav.addEventListener('click', onClick);
    return () => nav.removeEventListener('click', onClick);
  }, [props.target]);

  return (
    <button
      type="button"
      class={btn}
      aria-expanded={open}
      aria-controls={props.target}
      onClick={() => setOpen((o) => !o)}
    >
      <span aria-hidden="true" class={icon}>
        ☰
      </span>
      <span class={srOnly}>メニュー</span>
    </button>
  );
}
