# AGENTS.md — Project Rules for Codex CLI

Project: **second-ver**
Maintained by: **Yuta Tokeshi**

This file defines **project-level rules, boundaries, allowed edits, and directory constraints**
for Codex CLI when working on **./second-ver**, which is the _main production codebase_.

Global rules from `~/.codex/AGENTS.md` also apply.
Project rules override global rules when conflicted.

---

# 1. Target Project Scope

Codex must operate **only inside** the following path:

```
./second-ver/
```

Codex must **NOT** modify or interact with:

- `./my-hono/**`
- `./realtime.demo/**`
- `./app/**`
- Any other directories at repo-root

These are considered **non-target projects** inside this repository.

---

# 2. Technology Stack (second-ver)

Codex must strictly follow this stack:

### Core Runtime

- Honox
- Hono
- Cloudflare Workers (Wrangler)

### Build System

- Vite 6.x
- TypeScript
- PostCSS
- Tailwind CSS
- Autoprefixer

### Content / Markdown

- MDX via @mdx-js/mdx
- @mdx-js/rollup
- remark-frontmatter
- remark-mdx-frontmatter
- rehype-pretty-code
- shiki

### Tooling

- ESLint (Flat config)
- Prettier (via eslint-config-prettier)
- Wrangler 4.x

Codex must **not** introduce alternative stacks (Next.js, Astro, Remix, webpack, etc.).

---

# 3. Directory Structure (second-ver)

Codex must understand and respect the structure:

```
./second-ver/
├── app/                   # Honox app (routes, components, islands)
│   ├── components/
│   ├── routes/
│   ├── styles/
│   └── mdx/               # MDX content
├── public/                # Static assets
├── src/                   # Utility modules, client logic
├── docs/                  # Documentation
├── vite.config.ts
├── wrangler.jsonc
├── tsconfig.json
├── tailwind.config.cjs
├── postcss.config.cjs
└── package.json
```

Codex must **never** reorganize this structure unless explicitly instructed.

---

# 4. Editing Rules

## 4.1 Allowed to Edit (safe areas)

Codex may modify files under:

- `./second-ver/app/**/*`
- `./second-ver/src/**/*`
- `./second-ver/app/components/**/*`
- `./second-ver/app/routes/**/*`
- `./second-ver/app/mdx/**/*`
- `./second-ver/app/styles/**/*`
- Markdown/MDX inside `./second-ver/app/mdx/**`
- Documentation inside `./second-ver/docs/**`
- `README.md` (minor updates)

---

## 4.2 Forbidden to Edit (critical protection)

### Infrastructure / Deployment

Codex must **never** modify:

- `./second-ver/wrangler.jsonc`
- Cloudflare bindings
- KV / R2 / Durable Objects definitions
- Any `.env` files

### Build Config (approval required)

Codex must **not** modify these unless user explicitly approves:

- `vite.config.ts`
- `tailwind.config.cjs`
- `postcss.config.cjs`
- `tsconfig.json`
- `eslint.config.mjs`
- `prettier` configs

### Project Isolation

Codex must never touch:

- `./my-hono/**`
- `./realtime.demo/**`
- `./app/**`

---

# 5. App Architecture Rules

### Routing (Honox)

- All routes must live in `app/routes/**`
- File-based routing must follow Honox conventions
- Dynamic routes use `[param].tsx`

### Components

- Islands follow `"use client"` when needed
- Tailwind is the primary styling method
- No introduction of new CSS frameworks

### MDX

Codex must follow the established MDX pipeline:

- Compiled via @mdx-js/rollup
- remark-frontmatter + remark-mdx-frontmatter
- rehype-pretty-code + shiki for syntax highlighting

No new MDX plugins without approval.

---

# 6. ExecPlan / PLANS Rules

- `plans/` directory must exist at repo-root
- Each task requires a corresponding ExecPlan (`plans/<task>.md`)
- Codex must follow steps in order
- Codex must update:

  - Progress
  - Discoveries
  - Decisions

- Codex must not extend scope beyond the plan

---

# 7. Command Rules

## Allowed

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run lint --fix`
- `npm run preview`

## Forbidden

- `npm run deploy`
- Any `wrangler publish*`
- Cloudflare deploy commands
- D1 migration commands
- Destructive operations (`rm`, `mv`, etc.) without approval

---

# 8. Dependency Rules

## Allowed

- Add devDependencies for linting/testing
- Patch/minor updates (approval required)

## Forbidden

- Major version upgrades
- Adding new frameworks
- Editing `scripts` in package.json without approval

---

# 9. Git Rules

- Branches under `codex/<task>`
- Conventional Commits required
- No force-push
- No Git history rewrite unless approved
- PR must pass lint & type-check

---

# 10. Behavior Expectations

Codex must:

- Make small, isolated changes
- Follow existing project patterns
- Preserve consistency in the codebase
- Prefer minimal, predictable implementations
- Ask questions when unclear

Codex must NOT:

- Introduce new architecture
- Break Vite/Honox conventions
- Modify config files without approval
- Add bonus features
- Refactor large areas unless requested

---

# 11. When in Doubt

1. Stop
2. Ask
3. Wait for explicit approval

Never assume.

---

_Last updated: 2025-11-16_
