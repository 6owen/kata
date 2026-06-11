---
name: starter-react
description: Scaffold a new pnpm + Vite + React single-app project from the `6owen/starter-react` baseline, or refactor an existing single-package frontend to match its directory structure, routing, Zustand stores, services, styles, typings, and Arvinn toolchain conventions. Use when the target is a Vite React app rather than Next.js, Remix, Expo, or SSR frameworks.
---

<!--
[INPUT]: AI 任务上下文、目标项目根目录、`starter-react` 模板可用性、初始化或迁移模式、可选脚本参数。
[OUTPUT]: 给 AI 的运行协议，以及对目标项目应用 `starter-react` 基线的明确步骤。
[POS]: 位于 /plugins/kata-code/skills/starter-react，作为该 skill 的机器可读入口。

[PROTOCOL]:
1. 一旦 skill 工作流、模板来源、脚本参数或结构契约变化，必须同步更新此 Header。
2. 更新后必须上浮检查本目录 `.folder.md`、`README.md`、`scripts/` 与 `references/` 说明是否依然准确。
-->

# Starter React

Apply the `6owen/starter-react` baseline to a single-app frontend project.

## Workflow

1. Decide mode before changing files:
   - `init`: the target repo is empty or only has minimal repo scaffolding
   - `migrate`: the target already has a single-package frontend that should be normalized to this structure
2. Read `references/template-contract.md` before changing any structure-sensitive files.
3. If the target repo is already a monorepo:
   - keep the app inside its existing workspace package
   - apply this skill inside that app directory
   - only use `pnpm-monorepo` first when the repo still needs monorepo scaffolding
4. In `init` mode, prefer the script entry instead of manual copy:
   - run `node scripts/apply-starter-react.mjs --dir my-app --name my-app` from the parent directory
   - or run `node scripts/apply-starter-react.mjs --name my-app` when the current working directory is already the target root
   - the script prefers `/Users/wangwenbo/Documents/wangwenbo/Mine/starter-react`, falls back to `https://github.com/6owen/starter-react`, skips `.git/`, `node_modules/`, and `dist/`, and can auto-run `pnpm install`
   - use `--skip-install` for a dry copy, `--title "My App"` to rewrite the README heading, `--template /custom/path` to override source, and `--force` only when you explicitly want to overwrite scaffold-level conflicts
5. In `migrate` mode:
   - keep business logic and page behavior intact
   - reorganize files into the template ownership model instead of doing a cosmetic rename only
   - backfill missing baseline files from the template where needed
   - avoid wholesale overwrite when the existing app already contains real product logic
6. Do not use the init script on an existing app:
   - if the target already contains `package.json`, `src/`, or Vite app markers, treat it as migrate mode
   - for migrate work, use the script only as a source of baseline files, not as a blind overwrite tool
7. Use the structure contract consistently:
   - `src/pages`: file-based page entries only
   - `src/routers`: route assembly, guards, route meta, layout wiring, not-found, custom routes
   - `src/layouts`: page shells
   - `src/stores/modules`: Zustand modules
   - `src/services`: Axios instance, request helpers, API exports
   - `src/setups`: boot-time one-shot initialization
   - `src/styles`: global CSS layers only
   - `src/typings`: generated declarations and hand-written app declarations
   - `src/composables`: shared hooks
   - `src/components`: business components and UI primitives
   - `src/libs`: low-level utilities such as `cn`
8. Keep the baseline stack aligned:
   - `pnpm`
   - `Node >= 20`
   - `React 19`
   - `Vite 8`
   - `TypeScript`
   - `React Router DOM 6`
   - `vite-plugin-pages`
   - `unplugin-auto-import`
   - `Zustand`
   - `Axios`
   - `react-use`
   - `shadcn/ui`
   - `Tailwind CSS v4`
   - `Iconify`
   - `lucide-react`
   - `@arvinn/eslint-config`
   - `@arvinn/prettier-config`
   - `@arvinn/vscode-settings`
   - `lint-staged`
   - `simple-git-hooks`
9. After scaffolding or migration, verify with:
   - `pnpm install`
   - `pnpm lint`
   - `pnpm typecheck`
   - `pnpm build`

## Notes

- This skill is intentionally `pnpm`-only.
- This skill targets single-app Vite React projects, not Next.js, Remix, Expo, Electron, or SSR-first stacks.
- The bundled script is optimized for `init` mode. Migration remains a guided refactor because existing product code should not be flattened by an automatic copy step.
- Prefer Tailwind utility styling for components; keep standalone CSS files for global layers such as theme variables, scrollbar styling, and cross-page transitions.
- `src/typings/auto-imports.d.ts` is generated output; regenerate it rather than hand-maintaining it unless there is a concrete reason.
- If the repo already uses the Arvinn toolchain, keep that configuration consistent instead of duplicating competing lint or format setups.
