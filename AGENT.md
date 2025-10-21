# 🧱 AGENT.md — Global Agent Rules (v1.1)

## 🌏 Purpose

These are the **global operating principles** for all projects maintained by **Yuta Tokeshi**.  
They define how Codex (or any AI agent) should behave across environments and repositories.

---

## 🧭 Core Principles

1. **Safety first.**

   - Never deploy, delete, or migrate databases without explicit human approval.
   - Avoid modifying API keys, secrets, or Cloudflare credentials.
   - Always verify before running commands that affect external services.

2. **Code quality over speed.**

   - Prioritize clarity, maintainability, and readability over short-term results.
   - Run linting, formatting, and type checks before proposing merges.
   - Avoid quick fixes that compromise consistency.

3. **Consistency matters.**

   - Follow established architecture, naming conventions, and folder structures.
   - Match project-specific style defined in local `AGENT.md` or config files (`eslint`, `prettier`, etc.).
   - Use shared `tsconfig.base.json` in monorepo environments when present.

4. **Explicit is better than implicit.**

   - Always explain reasoning behind code changes or architectural decisions.
   - If uncertain, request clarification rather than guessing.

5. **Immutable logs.**

   - Never rewrite or delete Git history without human approval.
   - Avoid `--force` pushes unless explicitly permitted.

6. **Git hygiene.**
   - Always branch off from `main` or `develop`.
   - Never commit directly to protected branches.
   - Use **Conventional Commits** for clear and searchable history.

---

## 🧩 Automation Rules

### ✅ Auto-run Allowed

- `npm run lint:fix`
- `npm run format:fix`
- `npm run type-check`
- `npm run test`

### ⚠️ Ask-first (requires human approval)

- `npm run build`
- `npm run deploy:*`
- `npm run db:migrate:*`
- Any workflow touching Cloudflare, Supabase, or AWS infra.

### ❌ Forbidden

- Direct modifications to `.env*`, `.github/`, `.vscode/`, or deployment secrets.

---

## 🧱 Structural Assumptions

Most repositories follow a **TypeScript-first monorepo** architecture:

```plaintext
apps/
  web/
  api/
packages/
  shared/
docs/
  reference/
  architecture/

```

Codex should:

- Detect the correct workspace context from `package.json`.
- Reference docs from `/docs` for design and technical rationale.
- Respect environment-specific configs (`.env.local`, `.env.staging`, `.env.production`).
- Avoid modifying any CI/CD pipeline files unless explicitly asked.

---

## 🧠 Collaboration Rules

- All code changes should go through a **Pull Request**.
- Tag PRs appropriately: `feature`, `fix`, `chore`, `refactor`, `docs`, etc.
- Provide concise, context-aware commit messages.
- Keep discussions constructive and transparent.

---

## ☁️ Environment Awareness

| Platform                 | Guideline                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| **Cloudflare**           | Use Workers, Pages, D1, and R2 responsibly. Never alter production configs without review. |
| **Supabase**             | Treat the database schema as source-controlled. Migrations require approval.               |
| **GitHub Actions**       | Don’t modify workflows or secrets. Use PR-based changes for CI/CD adjustments.             |
| **Render / AWS / Other** | All deploy or infra edits must be human-triggered.                                         |

---

## 🪐 AI Agent Behavior Summary

| Action        | Permission      | Notes                            |
| ------------- | --------------- | -------------------------------- |
| Lint / Format | ✅ Auto         | Safe to auto-run                 |
| Test          | ✅ Auto         | Unit & integration tests only    |
| Build         | ⚠️ Ask-first    | Confirm environment first        |
| Deploy        | ⚠️ Ask-first    | Requires explicit approval       |
| DB Migration  | ⚠️ Ask-first    | Requires human trigger           |
| Edit Docs     | ✅ With context | Must reference related code/docs |
| Edit Infra    | ❌ Never        | Manual operation only            |

---

## 🧾 Version & Meta

- **Version:** 1.1
- **Author:** Yuta Tokeshi (toke)
- **Last Updated:** 2025-10-21
- **Applicable Scope:** All local and cloud projects (Cloudflare, Supabase, etc.)
- **Overrides:** Project-level `AGENT.md` takes precedence when present.

---

## 🔗 Integration Example (`.codex/config.json`)

```json
{
  "agentPath": ["./AGENT.md", "~/AGENT.md"]
}
```

---

💬 Philosophy

“Build slow to move fast.”
The goal is not just working code, but comprehensible, traceable, and improvable systems.
Agents exist to assist human creativity — never to override it

---
