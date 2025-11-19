import { createRoute } from 'honox/factory';
import { css, cx } from 'hono/css';
import AudioBlogRecorder from '../../../components/organisms/$AudioBlogRecorder';
import {
  container,
  sectionStack,
  serifHeading,
  mutedCopy,
  metaText,
} from '../../../styles/tokens';

const pageWrapper = css`
  padding-block: var(--page-padding-top) var(--page-padding-bottom);
  min-height: 100vh;
`;

const hero = css`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  text-align: center;
  align-items: center;
`;

const badge = css`
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const title = css`
  font-size: clamp(2.25rem, 5vw, 3rem);
`;

const recorderCard = css`
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: var(--radius-lg);
  padding: clamp(1.5rem, 4vw, 2.5rem);
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
`;

export default createRoute((c) =>
  c.render(
    <section class={cx(container, sectionStack, pageWrapper)}>
      <header class={cx(hero)}>
        <p class={cx(metaText, badge)}>Audio → MDX</p>
        <h1 class={cx(serifHeading, title)}>音声からブログ記事をつくる</h1>
        <p class={mutedCopy}>
          ブラウザで録音し、そのまま MDX ブログ記事を生成・ダウンロードできます。
        </p>
      </header>

      <div class={recorderCard}>
        <AudioBlogRecorder />
      </div>
    </section>
  )
);
