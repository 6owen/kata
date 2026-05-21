---
name: impeccable-integration
description: Route visual design, page polish, critique, and audit tasks to the external impeccable plugin when available, then resume Kata's implementation constraints for component structure, frontend code organization, and engineering consistency.
---

<!--
[INPUT]: AI 任务上下文、外部 `impeccable` plugin 可用性、Kata 工程约束。
[OUTPUT]: 给 AI 的路由协议、降级策略与回流 Kata 约束的明确步骤。
[POS]: 位于 /plugins/kata-design/skills/impeccable-integration，作为该 skill 的机器可读入口。

[PROTOCOL]:
1. 一旦 skill 路由策略、降级规则或集成边界变化，必须同步更新此 Header。
2. 更新后必须上浮检查本目录 `.folder.md`、`README.md` 与 `references/` 说明是否依然准确。
-->

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
- the upstream repository may be tracked locally as `vendor/impeccable` for integration/reference only
- `impeccable` remains an external companion plugin with its own release cycle
- design quality decisions should be delegated outward when the external plugin is available
- codebase integration decisions remain owned by Kata

## Recommended Install

```bash
npx plugins add pbakaus/impeccable
```
