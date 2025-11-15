# Project Development Principles (instructions.md)

## Purpose

These are the shared principles guiding all contributors—human and AI—  
within this project maintained by **Yuta Tokeshi**.

They define the **philosophy, quality standards, and development culture**.

---

# 1. Core Principles

## Safety First

- No destructive operations without explicit approval.
- Never change secrets or environment variables.

## Code Quality > Speed

- Prioritize readability and maintainability.
- Lint, type-check, and test must pass before merge.

## Consistency Matters

- Follow architecture and naming conventions.
- Prefer convention over invention.

## Explicit Over Implicit

- Always explain “why,” not only “what.”
- Ask when uncertain—never guess silently.

---

# 2. Testing Philosophy (TDD)

- Follow Red → Green → Refactor.
- Tests live next to implementation files.
- Keep tests deterministic by isolating external boundaries.

---

# 3. Architecture Expectations

- TypeScript-first.
- Monorepo structure (`apps/`, `packages/`).
- Shared configs in the root.
- Documentation lives in `docs/`.

---

# 4. Collaboration Rules

- Use PRs for all modifications.
- Follow Conventional Commits.
- Keep PRs small and focused.
- Update documentation when required.

---

_Last updated: 2025-11-15_
