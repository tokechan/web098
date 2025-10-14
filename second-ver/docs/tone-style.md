# 🎨 Tone & Style Guide — “toke travelers” Edition

> 「クラフトと思想をデザインに落とす。」

このドキュメントは、toke ブランドのトーン・デザイン・文章表現を統一するための指針。
デザインもコードも、“思想の一部” として扱うこと。

---

## 🧭 1. Core Tone（核となるトーン）

| 軸            | 内容                                    |
| ------------ | ------------------------------------- |
| **基本トーン**    | Calm（静けさ） × Honest（誠実） × Curious（探究心） |
| **雰囲気**      | 職人のような落ち着きと、構造を愛でる知性。<br>派手ではなく、品がある。 |
| **感情のレンジ**   | 喜びよりも「納得」と「余韻」を重視。                    |
| **メッセージの温度** | 温かく、しかし輪郭がシャープ。                       |

💬 *Analogy:*

> 「ウイスキーの香りのように、静かに残るデザイン。」

---

## 🪶 2. Writing Style（文章スタイル）

| 要素             | 指針                               |
| -------------- | -------------------------------- |
| **文体**         | 一人称「僕」。フランクだが、思想がにじむ。            |
| **テンポ**        | 1文1呼吸。無理に詰めず、間で語る。               |
| **構造**         | 抽象 → 具体 → 比喩 → 結論。               |
| **語彙**         | 技術 × 感性。「構造」「手触り」「輪郭」「静けさ」など。    |
| **Avoid（避ける）** | 情報過多・断定・誇張。「結論を押し付けない」姿勢。        |
| **Tagline例**   | “思想を実装で確かめる。” / “静かなコードに、強い意志を。” |

💡 *Voiceの基準:*

> 「語る」というより、「滲ませる」。

---

## 🎨 3. Visual Style（ビジュアルスタイル）

| 項目        | 指針                                      |
| --------- | --------------------------------------- |
| **全体トーン** | クラフト × シンプル × 呼吸。<br>余白に意味を持たせる。        |
| **世界観**   | 誠実なクラフトマンシップ。<br>人工的ではなく“手仕事の痕跡”を感じる温度。 |
| **フォント**  | Playfair Display（思想）＋ Inter（構造）。        |
| **行間・余白** | 「沈黙もデザイン」。詰めない。呼吸をデザインする。               |
| **装飾**    | シンプルでありながら、印象に残る細部（線・陰影・書体）。            |

---

## 🧱 4. Updated Color Palette — “Whiskey & Thought”

Jack Daniel’s “Bold & Spicy” の誠実さ × toke思想の静けさを融合。

> **テーマ:** Calm Base × Traveler Green × Proof Copper

```css
:root {
  /* === Base Layer === */
  --color-bg: #F8F8F6;          /* Whiskey White - 温かみあるオフホワイト */
  --color-text: #0F0F0F;        /* Charcoal Black - 誠実なメイン文字色 */
  --color-muted: #555555;       /* Muted Grey - 補足・サブテキスト */

  /* === Accent Layer === */
  --color-accent: #3F704D;      /* Traveler Green - 探究と信頼のシンボル */
  --color-accent-hover: #4B8E5A;/* Hover時にわずかに明るく */
  --color-secondary: #B67A4F;   /* Proof Copper - 温かみとクラフト感 */
  --color-secondary-hover: rgba(182, 122, 79 0.08);

  /* === Structure === */
  --color-border: #D8D8D3;      /* 優しい明るめの境界線 */
  --color-bg-card: #FFFFFF;     /* カード背景用（ほんのり浮かせる） */

  /* === Typography === */
  --font-sans: 'Inter', 'Noto Sans JP', sans-serif;
  --font-serif: 'Playfair Display', serif;
  --line-height-base: 1.75;
  --letter-spacing-wide: 0.03em;
}
```

---

## 🌿 5. Use Example — Minimal Blog Layout

```html
<header>
  <h1>toke travelers</h1>
  <p>思想を実装で確かめる。</p>
</header>

<article class="post">
  <h2><a href="#">Signalsはレンダーを超える</a></h2>
  <p class="meta">2025-10-10 / React, Signals</p>
  <p>再レンダーから解放されるための思想。それは“静かに速い”フロントエンドへの旅。</p>
</article>
```

```css
body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  line-height: var(--line-height-base);
}

a {
  color: var(--color-accent);
  text-decoration: none;
  border-bottom: 1px solid var(--color-accent);
}

a:hover {
  color: var(--color-secondary);
  border-color: var(--color-secondary);
}

h1, h2 {
  font-family: var(--font-serif);
  letter-spacing: var(--letter-spacing-wide);
}
```

---

## ✨ 6. Mood Keywords（世界観キーワード）

> “静寂の中に、芯のある温度を。”
> “クラフトの呼吸。”
> “ロジックの奥に、詩を置く。”

---

このガイドをベースに、
次のステップでは **`theme.css` と UIコンポーネント（Header / Card / Tag）** をこの思想で具現化していく。
