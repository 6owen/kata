<!--
[INPUT]: `vendor/vercel-agent-skills/skills/react-best-practices` 的上游 skill 结构、规则分类与本地 starter-react 集成边界。
[OUTPUT]: 供 `starter-react` skill 复用的 React companion 使用说明、选读顺序与适用范围。
[POS]: 位于 /plugins/kata-code/skills/starter-react/references，作为 vendored React companion 的本地集成说明。

[PROTOCOL]:
1. 一旦上游 `react-best-practices` skill 结构、规则分类或本地集成边界变化，必须同步更新此 Header。
2. 更新后必须上浮检查本目录 `.folder.md`、`README.md` 与上层 `SKILL.md` 的描述是否依然准确。
-->

# react-best-practices companion

这个文件描述 `starter-react` 如何引用 vendored `react-best-practices`，而不是复写它的内容。

## Source

- Vendored repo: `vendor/vercel-agent-skills`
- Upstream skill root: `vendor/vercel-agent-skills/skills/react-best-practices`
- Upstream entry: `vendor/vercel-agent-skills/skills/react-best-practices/SKILL.md`

## Read Order

1. 先读本目录的 `template-contract.md`
2. 再读上游 `SKILL.md` 了解规则分组与优先级
3. 根据当前任务只加载相关的 `rules/*.md`
4. 不要默认整份加载上游 `AGENTS.md`

上游 `AGENTS.md` 是编译产物，适合在明确需要完整展开指南时再看。

## Priority For starter-react

对 `starter-react` 这类 `pnpm + Vite + React` 单应用，优先关注这些规则族：

- `rerender-*`：组件重渲染与状态订阅优化
- `bundle-*`：打包体积与导入边界
- `async-*`：客户端或同构异步 waterfall 消除
- `rendering-*`：渲染性能与 hydration 细节
- `client-*`：客户端数据获取与事件监听
- `advanced-*`：React 新模式和少数高阶写法

## Conditional Rules

这些规则不是 `starter-react` 默认强约束，只在目标项目确实进入对应模式时再启用：

- `server-*`：服务端缓存、RSC、SSR、序列化等
- 明显依赖 Next.js 运行时的规则
- 面向 API route / server action 的规则

## Kata Boundary

`react-best-practices` 提供的是 React/Next 性能与实现建议。
`starter-react` 仍然拥有这些本地约束的最终解释权：

- `src/pages/*.tsx` 与 `src/pages/**/page.tsx` 的路由结构
- `src/pages/**/components` 作为页面私有组件目录
- `src/components` 只承载跨页面稳定复用组件
- `Tailwind + theme token` 优先的样式策略
- `src/styles` 只承载全局样式层

如果上游某条规则和本地目录/样式所有权冲突，优先保留 Kata 的结构约束，再吸收不冲突的性能建议。
