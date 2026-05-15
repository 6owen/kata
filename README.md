# Kata

一个面向 AI 辅助开发的插件仓库，按工作流拆成 3 个独立 plugin：

- `kata-code`：代码工程、工具链、目录结构、前后端实现偏好
- `kata-design`：设计流程编排，推荐与外部 `impeccable` plugin 搭配使用
- `kata-test`：测试能力预留骨架，后续补充 skill

## 安装

安装整个插件仓库：

```bash
npx plugins add pinky-pig/kata
```

安装单个 plugin：

```bash
npx plugins add /Users/wangwenbo/Desktop/demo/dev-bootstrap/plugins/kata-code
```

安装单个 skill：

```bash
npx skills add /Users/wangwenbo/Desktop/demo/dev-bootstrap/plugins/kata-code/skills/project-toolchain
```

推荐的设计组合安装：

```bash
npx plugins add /Users/wangwenbo/Desktop/demo/dev-bootstrap/plugins/kata-design
npx plugins add pbakaus/impeccable
```

## 当前插件

### `kata-code`

- `project-toolchain`
  - 为 `pnpm` JavaScript/TypeScript 项目接入：
    - `@arvinn/eslint-config`
    - `@arvinn/prettier-config`
    - `@arvinn/vscode-settings`
    - `lint-staged`
    - `simple-git-hooks`
- `pnpm-monorepo`
  - 初始化或迁移为 `pnpm` monorepo：
    - `pnpm-workspace.yaml`
    - `apps/*`
    - `packages/*`
    - `apps/web` 默认前端应用目录
- `express-modular`
  - 生成 Express + TypeScript 的模块化后端结构：
    - `src/modules/<name>/<name>.controller.ts`
    - `src/modules/<name>/<name>.service.ts`
    - `src/modules/<name>/<name>.model.ts`
    - `src/modules/<name>/<name>.routes.ts`
- `tailwind-iconify`
  - 接入 Tailwind CSS v4 + Iconify 图标工作流：
    - `@egoist/tailwindcss-icons`
    - `@iconify-json/carbon`
    - `@iconify-json/solar`

### `kata-design`

- `impeccable-integration`
  - 作为 `kata` 的设计流程入口
  - 推荐将视觉设计、页面 polish、critique、audit 任务交给外部 `impeccable`
  - `kata-design` 只定义集成方式与落地约束，不维护 `impeccable` 副本

### `kata-test`

- 仅保留 plugin 骨架
- 后续补充单测、集成测试、E2E 相关 skill

## 仓库结构

```text
kata/
  apps/
    browser-extension/
    web/
  packages/
    eslint-config/
    prettier-config/
    shared/
    tsconfig/
    vscode-settings/
  plugins/
    kata-code/
    kata-design/
    kata-test/
```
