<!--
[INPUT]: `6owen/starter-react` 上游 README、目录结构、页面路由约定与依赖清单。
[OUTPUT]: 供 AI 复用的模板契约快照、技术栈摘要与迁移对齐规则。
[POS]: 位于 /plugins/kata-code/skills/starter-react/references，作为该 skill 的结构参考主文档。

[PROTOCOL]:
1. 一旦上游模板 README、目录结构、页面路由约定或依赖基线变化，必须同步更新此 Header。
2. 更新后必须上浮检查本目录 `.folder.md`、`README.md` 与上层 `SKILL.md` 的描述是否依然准确。
-->

# starter-react template contract

这个文件不是上游 README 的逐字镜像，只保留 skill 需要的结构契约。

## Source Priority

1. 本机模板仓库：`/Users/wangwenbo/Documents/wangwenbo/Mine/starter-react`
2. 上游仓库：`https://github.com/6owen/starter-react`
3. 本文档：当上游源码不可直接读取时，作为最小决策快照

## Supported Scope

- 单应用 `pnpm + Vite + React` 项目
- `Node >= 20`
- `React 19`
- `Vite 8`
- `TypeScript`
- 不覆盖 `Next.js`、`Remix`、`Expo`、SSR-first framework

## Baseline Stack

- 路由：`react-router-dom` + `vite-plugin-pages`
- 状态：`Zustand`
- 请求：`Axios`
- Hooks：`react-use` + `src/composables`
- UI：`shadcn/ui` + `Tailwind CSS v4` + `Iconify` + `lucide-react`
- 工具链：`@arvinn/eslint-config`、`@arvinn/prettier-config`、`@arvinn/vscode-settings`
- 自动导入：`unplugin-auto-import`
- Git 规范：`lint-staged` + `simple-git-hooks`

## Root File Contract

初始化或迁移后，根层通常应具备这些关键文件：

- `package.json`
- `index.html`
- `vite.config.ts`
- `tailwind.config.ts`
- `tsconfig.json`
- `tsconfig.app.json`
- `tsconfig.node.json`
- `eslint.config.js`
- `components.json`
- `README.md`

`.vscode/` 在上游模板中存在，但迁移已有项目时不要盲目覆盖团队自己的编辑器配置。

## Source Directory Ownership

`src/` 采用明确分层，避免把职责揉在一起：

- `components/`：确认需要跨页面复用的组件与 UI 组件
- `composables/`：共享 hooks
- `layouts/`：页面布局壳
- `libs/`：基础工具函数
- `pages/`：约定式路由页面；一级 `.tsx` 文件直出，目录页使用 `page.tsx`
- `routers/`：自定义路由、守卫、layout/meta 装配、404、route types
- `services/`：请求实例、request helper、API 模块导出
- `setups/`：应用启动时的一次性初始化逻辑
- `stores/`：Zustand 状态与 `modules/*`
- `styles/`：全局样式文件，不承载组件私有样式
- `typings/`：自动生成与手写声明

## Route Generation Rules

- `src/pages/*.tsx`：一级页面文件，直接参与路由生成
- `src/pages/**/page.tsx`：目录式页面入口，参与路由生成
- `src/pages/**/components/*`：页面私有组件目录，默认不做全局复用
- 页面应优先就地拆分，只有跨页面稳定复用后才提升到 `src/components`

## Important File Semantics

- `src/styles/tailwind.css`：Tailwind、shadcn、Iconify、主题变量入口
- `src/styles/global.css`：全局样式总入口
- `src/styles/scrollbar.css`：滚动条样式
- `src/styles/view-transition-api.css`：主题切换动效样式
- `src/typings/auto-imports.d.ts`：`unplugin-auto-import` 生成文件
- `src/services/request/request.ts`：Axios 实例工厂
- `src/routers/page-routes.tsx`：约定式路由加工
- `src/setups/theme.ts`：首屏主题初始化

## Styling Rules

- 组件样式优先使用 `Tailwind CSS`
- 优先使用主题 token，例如 `bg-background`、`text-muted-foreground`、`border-border`
- 尽量不要写死颜色、阴影、边框等视觉值
- 尽量不写自定义 CSS，也不要把组件私有样式堆进 `src/styles`
- 如果组件确实需要独立 CSS，优先和组件同目录共置

## Migration Rules

把已有单体项目改造成这套结构时，优先做职责归位，而不是仅做目录重命名：

- 一级页面移入 `src/pages/*.tsx`
- 目录式页面入口使用 `src/pages/**/page.tsx`
- 页面私有子组件移入 `src/pages/**/components`
- 自定义路由声明、守卫、layout 装配移入 `src/routers`
- 页面壳移入 `src/layouts`
- store 拆到 `src/stores/modules/*`
- Axios 与 API 层拆到 `src/services/request` 和 `src/services/api`
- 启动初始化逻辑移入 `src/setups`
- 全局样式沉到 `src/styles`
- 组件私有 CSS 与组件同目录共置，不要塞进 `src/styles`
- 类型声明收敛到 `src/typings`

如果已有项目存在真实业务模块：

- 保留行为与导出接口
- 优先迁移目录归属，再逐步替换底层基础设施
- 不要为了贴模板而一次性覆盖业务代码

## Copy Exclusions

从上游模板直接起项目时，不要复制这些产物：

- `.git/`
- `node_modules/`
- `dist/`

## Tooling Alignment

`package.json` 应至少具备这些常用脚本：

- `dev`
- `build`
- `lint`
- `format`
- `typecheck`
- `preview`
- `format:check`
- `lint:fix`
- `fix`

如果目标项目已经接入 `project-toolchain`，以现有 Arvinn 配置为主，不要重复造第二套 lint / format / hooks 体系。
