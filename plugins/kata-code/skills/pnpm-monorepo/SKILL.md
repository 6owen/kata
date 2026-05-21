---
name: pnpm-monorepo
description: Set up or migrate a frontend project to a pnpm monorepo structure with apps/* and packages/*, including apps/web as the default app location. Use when initializing a new monorepo or converting a single frontend project into this structure.
---

<!--
[INPUT]: AI 任务上下文、目标项目根目录、pnpm 环境、可选迁移模式参数。
[OUTPUT]: 给 AI 的运行协议，以及对目标项目建立或迁移 monorepo 结构的明确步骤。
[POS]: 位于 /plugins/kata-code/skills/pnpm-monorepo，作为该 skill 的机器可读入口。

[PROTOCOL]:
1. 一旦 skill 工作流、迁移策略或生成结构变化，必须同步更新此 Header。
2. 更新后必须上浮检查本目录 `.folder.md`、`README.md` 与 `scripts/apply-pnpm-monorepo.mjs` 的描述是否依然准确。
-->

# PNPM Monorepo

Standardize project structure to a pnpm monorepo (postly-style baseline).

## Workflow

1. Ensure target project root has `package.json` and `pnpm` available.
2. Run `node scripts/apply-pnpm-monorepo.mjs` at project root.
3. Script auto-detects mode:
   - `init`: create/ensure monorepo skeleton
   - `migrate`: move single frontend project files into `apps/web`
4. For migrate mode, confirm prompt before file moves.

## What the script changes

- Ensures `pnpm-workspace.yaml` with:
  - `apps/*`
  - `packages/*`
- Ensures directories:
  - `apps/`
  - `packages/`
- In init mode:
  - ensures root `package.json` has basic monorepo scripts (`dev:web`, `build:web`, `start:web`)
  - creates `apps/web/package.json` placeholder when missing
- In migrate mode:
  - creates `apps/web/package.json` from original root app package
  - moves project app files into `apps/web`
  - rewrites root `package.json` to workspace-style root
  - preserves repo-level directories like `.git`, `.github`, `.vscode`

## Notes

- This skill is intentionally `pnpm`-only.
- Migrate mode is interactive by default and asks for confirmation.
- You can force non-interactive migrate by setting `PNPM_MONOREPO_ASSUME_YES=1`.
- Re-running is idempotent for init operations.
