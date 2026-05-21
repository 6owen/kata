---
name: tailwind-iconify
description: Set up Tailwind CSS v4 icon workflow using @egoist/tailwindcss-icons with Iconify JSON collections (carbon and solar). Use when configuring React or Vue projects that should use class-based icons like i-solar-*.
---

<!--
[INPUT]: AI 任务上下文、目标项目根目录、pnpm 环境、Tailwind v4 配置前提。
[OUTPUT]: 给 AI 的运行协议，以及对目标项目注入 Tailwind Iconify 工作流的明确步骤。
[POS]: 位于 /plugins/kata-code/skills/tailwind-iconify，作为该 skill 的机器可读入口。

[PROTOCOL]:
1. 一旦 skill 工作流、依赖清单或配置写入策略变化，必须同步更新此 Header。
2. 更新后必须上浮检查本目录 `.folder.md`、`README.md` 与 `scripts/apply-tailwind-iconify.mjs` 的描述是否依然准确。
-->

# Tailwind Iconify

Standardize Tailwind v4 + Iconify setup for Arvinn projects.

## Workflow

1. Ensure the target project root has `package.json` and uses `pnpm`.
2. Ensure the project already uses Tailwind CSS v4+.
3. Run `node scripts/apply-tailwind-iconify.mjs` from the target project root.
4. Verify icon class usage, for example: `<div class="i-solar-gallery-add-outline w-6 h-6"></div>`.

## What the script changes

- Installs dependencies:
  - `@egoist/tailwindcss-icons`
  - `@iconify-json/carbon`
  - `@iconify-json/solar`
- Updates `tailwind.config.*`:
  - adds import from `@egoist/tailwindcss-icons`
  - ensures plugin registration with `getIconCollections(['carbon', 'solar'])`
- Updates global css entry (auto-detected):
  - ensures `@import 'tailwindcss';`
  - ensures `@plugin '@egoist/tailwindcss-icons';`
  - ensures `@config '<relative-tailwind-config-path>';`

## Notes

- This skill is intentionally `pnpm`-only.
- Tailwind CSS major version must be 4 or above.
- The script is idempotent for repeated runs.
- Supported tailwind config format is ESM object export (`export default { ... }`).
