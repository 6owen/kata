<!--
[INPUT]: `kata-code` plugin 的定位、skill 清单、设计系统约定与工程边界。
[OUTPUT]: 面向人类的 `kata-code` plugin 总览说明。
[POS]: 位于 /plugins/kata-code，作为代码工程 plugin 的入口文档。

[PROTOCOL]:
1. 一旦 plugin 定位、skill 清单、设计系统约定或边界变化，必须同步更新此 Header。
2. 更新后必须上浮检查 /plugins/kata-code/.folder.md、/plugins/.folder.md 与 /README.md 的描述是否依然准确。
-->

# kata-code

`kata-code` 承载代码工程相关 skill，包括工具链接入、monorepo 结构、后端模块化骨架，以及 Vite React 单应用的 starter 基线与实现层依赖偏好。
其中 `starter-react` 当前对齐的是 `6owen/starter-react` 的 TanStack Start 基线：`src/pages` 文件路由、`route.tsx` 路由分组壳子、`index.tsx` 叶子页面、`services` / `stores` / `setups` 的职责分层，以及 `shadcn/ui` 设计系统初始化、组件分批安装与 router 驱动的 `DesignSystem` 展示页约定。

这里不会镜像或内置你已经独立维护的配置仓库。像 `@arvinn/eslint-config`、`@arvinn/prettier-config` 这类能力继续从外部仓库和包源消费。
对于 React 实现细节与性能约束，`starter-react` 还会引用 vendored `vendor/vercel-agent-skills/skills/react-best-practices` 作为 companion reference，但不会把上游规则内容直接并入 Kata 本体。

## Skills

- `project-toolchain`
- `pnpm-monorepo`
- `express-modular`
- `starter-react`
- `tailwind-iconify`
