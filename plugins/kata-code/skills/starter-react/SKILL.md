---
name: starter-react
description: Scaffold a new pnpm + Vite + React single-app project from the `6owen/starter-react` baseline, or refactor an existing single-package frontend to match its directory structure, routing, Zustand stores, services, styles, typings, and Arvinn toolchain conventions. Use when the target is a Vite React app rather than Next.js, Remix, Expo, or SSR frameworks.
---

<!--
[INPUT]: AI 任务上下文、目标项目根目录、`starter-react` 模板可用性、初始化或迁移模式、可选脚本参数、页面路由与样式约定、可选 vendored React companion source。
[OUTPUT]: 给 AI 的运行协议，以及对目标项目应用 `starter-react` 基线的明确步骤。
[POS]: 位于 /plugins/kata-code/skills/starter-react，作为该 skill 的机器可读入口。

[PROTOCOL]:
1. 一旦 skill 工作流、模板来源、脚本参数、页面路由约定、React companion reference 或结构契约变化，必须同步更新此 Header。
2. 更新后必须上浮检查本目录 `.folder.md`、`README.md`、`scripts/` 与 `references/` 说明是否依然准确。
-->

# Starter React

Apply the `6owen/starter-react` baseline to a single-app frontend project.

## Workflow

1. Decide mode before changing files:
   - `init`: the target repo is empty or only has minimal repo scaffolding
   - `migrate`: the target already has a single-package frontend that should be normalized to this structure
2. Read `references/template-contract.md` before changing any structure-sensitive files.
3. If `vendor/vercel-agent-skills` is initialized, also read `references/react-best-practices.md`.
   - then load `vendor/vercel-agent-skills/skills/react-best-practices/SKILL.md` for high-level rule selection
   - load targeted upstream `rules/*.md` files only when they match the work at hand
   - do not load the compiled upstream `AGENTS.md` by default unless the task explicitly needs the full expanded guide
4. If the target repo is already a monorepo:
   - keep the app inside its existing workspace package
   - apply this skill inside that app directory
   - only use `pnpm-monorepo` first when the repo still needs monorepo scaffolding
5. In `init` mode, prefer the script entry instead of manual copy:
   - run `node scripts/apply-starter-react.mjs --dir my-app --name my-app` from the parent directory
   - or run `node scripts/apply-starter-react.mjs --name my-app` when the current working directory is already the target root
   - the script prefers `/Users/wangwenbo/Documents/wangwenbo/Mine/starter-react`, falls back to `https://github.com/6owen/starter-react`, skips `.git/`, `node_modules/`, and `dist/`, and can auto-run `pnpm install`
   - use `--skip-install` for a dry copy, `--title "My App"` to rewrite the README heading, `--template /custom/path` to override source, and `--force` only when you explicitly want to overwrite scaffold-level conflicts
6. In `migrate` mode:
   - keep business logic and page behavior intact
   - reorganize files into the template ownership model instead of doing a cosmetic rename only
   - backfill missing baseline files from the template where needed
   - align route pages to the template pattern: root-level `src/pages/*.tsx` for direct entries, directory pages via `src/pages/**/page.tsx`
   - avoid wholesale overwrite when the existing app already contains real product logic
7. Do not use the init script on an existing app:
   - if the target already contains `package.json`, `src/`, or Vite app markers, treat it as migrate mode
   - for migrate work, use the script only as a source of baseline files, not as a blind overwrite tool
8. Use the structure contract consistently:
   - `src/pages`: route pages only; root-level `.tsx` files generate routes directly, directory pages use `page.tsx`
   - `src/pages/**/components`: page-private components; do not promote to global reuse by default
   - `src/routers`: route assembly, guards, route meta, layout wiring, not-found, custom routes
   - `src/layouts`: page shells
   - `src/stores/modules`: Zustand modules
   - `src/services`: Axios instance, request helpers, API exports
   - `src/setups`: boot-time one-shot initialization
   - `src/styles`: global CSS layers only; do not dump component-private styles here
   - `src/typings`: generated declarations and hand-written app declarations
   - `src/composables`: shared hooks
   - `src/components`: cross-page reusable components and UI primitives only
   - `src/libs`: low-level utilities such as `cn`
9. Keep the baseline stack aligned:
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
10. After scaffolding or migration, verify with:
   - `pnpm install`
   - `pnpm lint`
   - `pnpm typecheck`
   - `pnpm build`

## Notes

- This skill is intentionally `pnpm`-only.
- This skill targets single-app Vite React projects, not Next.js, Remix, Expo, Electron, or SSR-first stacks.
- The bundled script is optimized for `init` mode. Migration remains a guided refactor because existing product code should not be flattened by an automatic copy step.
- The vendored Vercel companion is a reference source, not a replacement for Kata's own directory, route, and styling conventions.
- For `starter-react`, prioritize upstream React rules from `rerender-*`, `bundle-*`, `async-*`, `rendering-*`, `client-*`, and `advanced-*` when they fit the task.
- Treat upstream `server-*` and Next.js-specific guidance as conditional; only apply it when the target project actually introduces those runtime patterns.
- Route generation follows two patterns only: `src/pages/*.tsx` for direct pages, and `src/pages/**/page.tsx` for directory pages.
- Prefer page-local decomposition first: use `src/pages/**/components` for page-private pieces, and only promote stable cross-page reuse into `src/components`.
- Prefer Tailwind utility styling for components.
- Prefer theme tokens such as `bg-background`, `text-muted-foreground`, and `border-border` over hard-coded visual values.
- Avoid custom CSS for component-private styling; if CSS is truly necessary, colocate it with the component instead of pushing it into `src/styles`.
- Keep standalone CSS files in `src/styles` for global layers such as theme variables, scrollbar styling, and cross-page transitions.
- `src/typings/auto-imports.d.ts` is generated output; regenerate it rather than hand-maintaining it unless there is a concrete reason.
- If the repo already uses the Arvinn toolchain, keep that configuration consistent instead of duplicating competing lint or format setups.
