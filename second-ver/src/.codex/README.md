# .codex — Codex CLI Project Guide

Project: **second-ver**  
Owner: **Yuta Tokeshi**

This `.codex/` directory provides the configuration and operational guidelines  
that Codex CLI must follow when working within the **second-ver** project.

Codex reads this directory first before performing any code generation or modifications.

---

## 1. Directory Structure

```txt
.codex/
├── AGENTS.md        # Project-specific rules and boundaries for Codex
├── PLANS/           # ExecPlan (task plans) used to control Codex execution
│   ├── TEMPLATE_PLAN.md
│   └── <task>.md
└── README.md        # This guide
```
