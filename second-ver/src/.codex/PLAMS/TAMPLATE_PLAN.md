# TEMPLATE EXECUTION PLAN (SELF-CONTAINED / OUT-OF-SCOPE SAFE)

This document is an Execution Plan template.
Any new ExecPlan must be created by copying this file and filling each section.
ExecPlans must be fully self-contained, written in plain language, and readable by a novice with zero prior knowledge of the repository.
ExecPlans are living documents and must be updated continuously as work proceeds.

---

## PURPOSE / BIG PICTURE

Describe in several sentences what new user-visible ability this plan enables.
Explain what a human can observe after the feature is implemented and how they can verify it locally.
Avoid jargon unless defined immediately in plain language.

---

## SCOPE AND OUT-OF-SCOPE RESPONSIBILITIES

This ExecPlan covers only modifications inside the repository working tree, including:
・ UI components
・ Local application logic
・ Worker or serverless functions
・ Local validation
・ File creation, updates, refactors
・ Adjustments to project-level code (non-secret, non-infra)

The following items are strictly OUT OF SCOPE and MUST NOT be attempted by the agent under any circumstances:

・ Any authentication or authorization
・ Cloudflare login (wrangler login)
・ Deployment steps (wrangler deploy, etc.)
・ Adding, modifying, or reading secrets
・ Creating or modifying .env or environment variable files
・ Handling or modifying API keys
・ Using remote dashboards (Cloudflare, GitHub, etc.)
・ Changes outside the repository’s working directory
・ Destructive system-level commands or privileged operations
・ Remote database or production system modifications

If a step normally requires authentication or deployment, the agent must instead write clear instructions for the human operator and continue with the next safe step.

---

## PROGRESS

Maintain a chronological log of all completed or pending tasks.
Every pause or milestone must be recorded here.
Include timestamps such as (2025-11-16 11:32 JST).

Example format:

[ ] (timestamp) Setup initial directory
[x] (timestamp) Verified existing file structure
[ ] (timestamp) Implement feature module (partial: X done, Y remaining)

This section must always reflect the actual current state.

---

## SURPRISES AND DISCOVERIES

Record unexpected behaviors, bugs, or insights discovered during implementation.
Include short evidence when applicable.

Example:
Observation: Worker rejected large audio payload.
Evidence: wrangler dev log displayed “body exceeded limit”.

---

## DECISION LOG

Record each decision made during the plan.

Format:
Decision:
Rationale:
Date / Author:

---

## OUTCOMES AND RETROSPECTIVE

Summarize outcomes after major milestones or after full completion:
・ What was achieved
・ What remains
・ Lessons learned
・ Alignment with the original Purpose

---

## CONTEXT AND ORIENTATION

Describe the repository layout as if the reader knows nothing.
List relevant folders, important modules, and how they relate.
Define any unfamiliar terms in plain language.

Do not assume any previous ExecPlan or documentation has been read.

---

## PLAN OF WORK

Describe the workflow as a narrative (“a story of the implementation”).
Use prose, not lists.

For each step, specify:
・ The exact file path
・ What will be created or modified
・ Why the change matters
・ How files interact within the feature

Before executing any step, the agent must verify that the step does not require authentication, secrets, or deployment.
If it does, the agent must describe human instructions and then continue with the next safe coding task.

---

## CONCRETE STEPS

Provide exact local-only commands required for development, never deployment.

Allowed examples:
npm install
npm run dev

Expected output example (keep short):
Local dev server running at [http://localhost:5173/](http://localhost:5173/)

Do not include authentication or deployment commands.

---

## VALIDATION AND ACCEPTANCE

Describe how a human verifies the feature locally.
Define expected behaviors, not internal implementation details.

Examples:
・ Start the dev server
・ Navigate to the new page
・ Trigger the new UI action
・ Observe expected result

If deployment would normally be required, use a local simulation such as wrangler dev and describe expected results.

Acceptance criteria must be user-visible and directly testable.

---

## IDEMPOTENCE AND RECOVERY

Explain how steps can be safely retried.
Ensure instructions do not create broken intermediate states.
If a step can partially fail, describe how to recover or reset.

---

## ARTIFACTS AND NOTES

Include minimal examples such as:
・ Log excerpts
・ Short code snippets (inline only)
・ Small diffs

All examples must appear inline or in brackets.
Do not use Markdown code fences.
Example: [example: function returns expected string on success]

---

## INTERFACES AND DEPENDENCIES

Describe the expected modules, types, or functions that must exist after implementation.
Include final file paths and function signatures in plain text.

Example:
In app/lib/api.ts, the following function must exist:
[example: export async function submitAudio(blobFile): returns a Markdown string]

Explain why each dependency or module is necessary.

---

## END OF TEMPLATE
