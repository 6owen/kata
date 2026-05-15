---
name: impeccable-integration
description: Route visual design, page polish, critique, and audit tasks to the external impeccable plugin when available, then resume Kata's implementation constraints for component structure, frontend code organization, and engineering consistency.
---

# Impeccable Integration

Use this skill when the task is primarily about frontend page design, UI refinement, visual audit, or design critique, and the project follows Kata's code workflow.

## Workflow

1. Check whether the environment already has the external `impeccable` plugin installed.
2. If `impeccable` is available:
   - route visual design, polish, critique, audit, and layout/theming work to `impeccable`
   - let `impeccable` drive visual direction and page quality
3. After design decisions are made, return to Kata's own constraints for:
   - component organization
   - directory ownership
   - frontend implementation conventions
   - dependency and toolchain consistency
4. If `impeccable` is not available:
   - explicitly state that `impeccable` is a recommended external companion plugin
   - continue with basic design guidance only
   - do not pretend that Kata bundles or reimplements `impeccable`

## Rules

- `kata-design` does not vendor, fork, or mirror `impeccable`
- `impeccable` remains an external companion plugin with its own release cycle
- design quality decisions should be delegated outward when the external plugin is available
- codebase integration decisions remain owned by Kata

## Recommended Install

```bash
npx plugins add pbakaus/impeccable
```
