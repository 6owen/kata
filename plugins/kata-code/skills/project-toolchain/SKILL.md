---
name: project-toolchain
description: Set up a pnpm JavaScript/TypeScript project with Arvinn's external prettier, eslint, and VS Code conventions, including package.json scripts, lint-staged, simple-git-hooks, and an eslint.config.ts starter. Use when initializing a new project or aligning an existing project to this toolchain.
---

<!--
[INPUT]: AI 任务上下文、目标项目根目录、pnpm 环境、外部配置包可用性。
[OUTPUT]: 给 AI 的运行协议，以及对目标项目注入 Arvinn 工具链的明确步骤。
[POS]: 位于 /plugins/kata-code/skills/project-toolchain，作为该 skill 的机器可读入口。

[PROTOCOL]:
1. 一旦 skill 工作流、依赖清单或写入策略变化，必须同步更新此 Header。
2. 更新后必须上浮检查本目录 `.folder.md`、`README.md` 与 `scripts/apply-project-toolchain.mjs` 的描述是否依然准确。
-->

# Project Toolchain

Apply Arvinn's default frontend tooling to the current project.

## Workflow

1. Ensure the target project root has `package.json` and uses `pnpm`.
2. Run `node scripts/apply-project-toolchain.mjs` with the target project as working directory.
3. If `eslint.config.ts` exists but does not reference `@arvinn/eslint-config`, ask for confirmation before overwrite.
4. Let `npx arvinn-vscode-settings` complete (it may prompt before overwriting files in `.vscode`).

## What the script changes

- Installs dev dependencies:
  - `eslint`
  - `taze@^19.9.2`
  - `@arvinn/eslint-config`
  - `@arvinn/prettier-config`
  - `@arvinn/vscode-settings`
  - `lint-staged`
  - `simple-git-hooks`
- These config packages stay in their own repositories:
  - `@arvinn/eslint-config`: `https://github.com/6owen/eslint-config.git`
  - `@arvinn/prettier-config`: `https://github.com/6owen/prettier-config.git`
- Merges `package.json` with:
  - `scripts.format`
  - `scripts.format:check`
  - `scripts.lint`
  - `scripts.lint:fix`
  - `scripts.fix`
  - `scripts.up`
  - `scripts.setup-arvin`
  - `scripts.prepare` including `simple-git-hooks`
  - `prettier: "@arvinn/prettier-config"`
  - `simple-git-hooks.pre-commit`
  - `lint-staged["*"]`
- Creates or updates `eslint.config.ts` based on the Arvinn template.
- Activates hooks with `pnpm exec simple-git-hooks`.
- Syncs VSCode settings via `npx arvinn-vscode-settings`.

## Notes

- This skill is intentionally `pnpm`-only.
- The script is idempotent for repeated runs.
- Existing `format` / `lint` / `fix` / `up` scripts are preserved; the script only fills in these defaults when they are missing.
- If overwrite is declined for `eslint.config.ts`, existing file is kept unchanged.
- Kata consumes these packages as external dependencies rather than vendoring their source.
