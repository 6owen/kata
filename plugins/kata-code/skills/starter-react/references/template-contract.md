<!--
[INPUT]: `6owen/starter-react` 上游 README、`package.json`、TanStack Start 路由配置、目录结构与依赖清单。
[OUTPUT]: 供 AI 复用的模板契约快照、技术栈摘要与迁移对齐规则。
[POS]: 位于 /plugins/kata-code/skills/starter-react/references，作为该 skill 的结构参考主文档。

[PROTOCOL]:
1. 一旦上游模板 README、`package.json`、目录结构、TanStack Start 路由约定或依赖基线变化，必须同步更新此 Header。
2. 更新后必须上浮检查本目录 `.folder.md`、`README.md` 与上层 `SKILL.md` 的描述是否依然准确。
-->

# starter-react template contract

这个文件不是上游 README 的逐字镜像，只保留 skill 需要的结构契约。

## Source Priority

1. 本机模板仓库：`/Users/wangwenbo/Documents/wangwenbo/Mine/starter-react`
2. 模板源码本身的关键文件：`package.json`、`tsr.config.json`、`vite.config.ts`、`src/pages/**`
3. 上游仓库：`https://github.com/6owen/starter-react`
4. 本文档：当上游源码不可直接读取时，作为最小决策快照

## Supported Scope

- 单应用 `pnpm + TanStack Start + Vite + React` 项目
- 当前模板 `package.json` 的运行时下限是 `Node >= 22.12.0`
- `React 19`
- `Vite 8`
- `TypeScript 6`
- 不覆盖 `Next.js`、`Remix`、`Expo`、SSR-first framework

## Baseline Stack

- 路由：`@tanstack/react-start` + `@tanstack/react-router` + `@tanstack/router-cli`
- 服务端数据：`@tanstack/react-query` + `@tanstack/react-router-ssr-query`
- 状态：`Zustand`
- 请求：`Axios`
- Hooks：`react-use` + `src/composables`
- UI：`shadcn/ui` + `Tailwind CSS v4` + `Iconify` + `lucide-react`
- Tailwind 集成：`@tailwindcss/vite`
- 工具链：`@arvinn/eslint-config`、`@arvinn/prettier-config`、`@arvinn/vscode-settings`
- 图标能力：`@egoist/tailwindcss-icons`
- 校验：`zod`
- Git 规范：`lint-staged` + `simple-git-hooks`

## Root File Contract

初始化或迁移后，根层通常应具备这些关键文件：

- `package.json`
- `index.html`
- `vite.config.ts`
- `tsr.config.json`
- `tailwind.config.ts`
- `tsconfig.json`
- `tsconfig.app.json`
- `tsconfig.node.json`
- `eslint.config.js`
- `components.json`
- `README.md`

常见还会存在这些目录或产物：

- `public/`
- `docs/`
- `.tanstack/`

`.vscode/` 在上游模板中存在，但迁移已有项目时不要盲目覆盖团队自己的编辑器配置。

## Source Directory Ownership

`src/` 采用明确分层，避免把职责揉在一起：

- `components/`：确认需要跨页面复用的组件与 UI 组件
- `composables/`：共享 hooks
- `lib/`：当前推荐的纯工具目录
- `libs/`：兼容目录，当前只做 re-export
- `pages/`：TanStack 文件路由根目录，承载 `__root.tsx`、`route.tsx`、`index.tsx` 与页面私有共置文件
- `routers/`：路由辅助能力，如 auth snapshot、权限守卫和重定向逻辑
- `services/`：请求实例、QueryClient、API 模块导出与后续远端 client
- `setups/`：应用启动时的一次性初始化逻辑
- `stores/`：Zustand 本地状态
- `styles/`：全局样式文件，不承载组件私有样式
- `typings/`：手写声明与生成声明

本模板当前明确不使用：

- `src/features`
- 独立的 `src/layouts`

页面壳、守卫边界和分组共享外壳应直接写在各自的 `src/pages/**/route.tsx` 中。

## Route Generation Rules

- `src/pages` 是 TanStack Router 的 `routesDirectory`
- `src/pages/__root.tsx`：根文档结构、全局 Provider、错误页和根级 `beforeLoad`
- `src/pages/**/route.tsx`：路由分组边界、共享壳子、守卫与 `Outlet`
- `src/pages/**/index.tsx`：具体叶子页面入口
- `_app`、`_auth`、`_immersive`、`_authed`、`_admin` 这类 `_` 前缀目录主要表示路由分组边界，而不是 URL 片段
- `routeFileIgnorePrefix` 固定为 `-`
- `src/pages/**/-components/*`、`-navigation.ts`、`-schema.ts`、`-queries.ts`、`-form.ts`、`-columns.tsx`、`-utils.ts` 都不会参与路由生成
- 页面应优先就地拆分，只有跨页面稳定复用后才提升到 `src/components`
- `src/routeTree.gen.ts` 是自动生成文件，不要手改

## Important File Semantics

- `vite.config.ts`：Vite + TanStack Start 插件入口，必须与 `tsr.config.json` 保持同一套路由配置
- `tsr.config.json`：固定 `routesDirectory: ./src/pages`、`generatedRouteTree: ./src/routeTree.gen.ts`、`routeFileIgnorePrefix: -`
- `src/router.tsx`：Router 创建与 Query 集成入口
- `src/styles/tailwind.css`：Tailwind、shadcn、Iconify、主题变量入口
- `src/styles/global.css`：全局样式总入口
- `src/styles/scrollbar.css`：滚动条样式
- `src/styles/view-transition-api.css`：主题切换动效样式
- `src/services/http.ts`：Axios 实例与拦截器
- `src/services/query-client.ts`：TanStack QueryClient 工厂
- `src/services/api/app.ts`：示例 server function
- `src/routers/auth.ts`：auth snapshot、角色工具
- `src/routers/guards.ts`：`requireAuth` / `requireRole`
- `src/lib/utils.ts`：当前推荐的 `cn` 工具入口
- `src/libs/utils.ts`：兼容 re-export
- `src/setups/theme.ts`：首屏主题初始化

## Styling Rules

- 组件样式优先使用 `Tailwind CSS`
- 优先使用主题 token，例如 `bg-background`、`text-muted-foreground`、`border-border`
- 尽量不要写死颜色、阴影、边框等视觉值
- 尽量不写自定义 CSS，也不要把组件私有样式堆进 `src/styles`
- 如果组件确实需要独立 CSS，优先和组件同目录共置

## State And Data Rules

- `services/` 负责所有远端通信相关能力，包括 `http.ts`、`query-client.ts`、REST API 封装和后续远端 client
- `stores/` 只放客户端本地状态、交互状态和轻量 UI 状态
- 服务端数据获取、缓存、重试、失效和同步统一交给 `TanStack Query`
- 不要把列表数据、详情数据、用户资料这类服务端数据缓存转移到 Zustand

## Migration Rules

把已有单体项目改造成这套结构时，优先做职责归位，而不是仅做目录重命名：

- 根文档和全局 Provider 归到 `src/pages/__root.tsx`
- 路由分组壳子、守卫边界归到 `src/pages/**/route.tsx`
- 叶子页面归到 `src/pages/**/index.tsx`
- 页面私有子组件移入 `src/pages/**/-components`
- 页面私有 schema / query / form / table 配置优先使用 `-schema.ts`、`-queries.ts`、`-form.ts`、`-columns.tsx`
- 自定义路由辅助逻辑、守卫与 auth snapshot 移入 `src/routers`
- 不要再额外创建 `src/layouts`
- 不要再引入 `src/features`
- store 留在 `src/stores/*`，并继续只承载客户端本地状态
- Axios 与 API 层拆到 `src/services/http.ts`、`src/services/query-client.ts` 和 `src/services/api/*`
- 启动初始化逻辑移入 `src/setups`
- 纯工具优先落到 `src/lib`
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
- `generate-routes`
- `start`
- `build`
- `lint`
- `format`
- `typecheck`
- `preview`
- `format:check`
- `lint:fix`
- `fix`

如果目标项目已经接入 `project-toolchain`，以现有 Arvinn 配置为主，不要重复造第二套 lint / format / hooks 体系。
