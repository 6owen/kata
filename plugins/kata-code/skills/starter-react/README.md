<!--
[INPUT]: `starter-react` skill 的定位、适用场景、模板来源、TanStack Start 路由约定、`shadcn/ui` 设计系统工作流、React companion reference 与初始化命令说明。
[OUTPUT]: 面向人类的 `starter-react` skill 简介。
[POS]: 位于 /plugins/kata-code/skills/starter-react，作为该 skill 的人类入口文档。

[PROTOCOL]:
1. 一旦 skill 行为、模板来源、TanStack Start 路由约定、`shadcn/ui` 设计系统约定、React companion reference、脚本参数或迁移边界变化，必须同步更新此 Header。
2. 更新后必须上浮检查本目录 `.folder.md`、`SKILL.md`、`scripts/` 与 `references/` 说明是否依然准确。
-->

# starter-react

Use `6owen/starter-react` as the baseline for new TanStack Start + React single-app projects, or as the target structure when normalizing an existing single-package frontend, including `src/pages` route groups, `route.tsx` and `index.tsx` file routing, page-private `-components`, `services` / `stores` / `setups` ownership, token-first Tailwind styling, a `shadcn/ui` design-system workflow, and a vendored `react-best-practices` companion reference.

Quick init entry: `scripts/apply-starter-react.mjs`

Main entry: `SKILL.md`

## Design System

`starter-react` treats `shadcn/ui` as the default design system for page UI work.
**一切设计必须来自设计系统的颜色和组件。**
If a task includes landing pages, app chrome, showcase screens, or page polish, initialize or align the design system before writing custom layout code.

### Setup

1. Initialize `shadcn/ui`:

   ```bash
   npx shadcn@latest init
   ```

   Configuration:
   - Style: `Default`
   - Base color: choose per project
   - CSS variables: `Yes`
   - Reuse the existing `jsconfig.json` / `tsconfig.json` alias configuration

2. Install the shared theme:

   ```bash
   npx shadcn@latest add https://tweakcn.com/r/themes/amethyst-haze.json
   ```

3. Install components in batches to avoid CLI timeout:

   - Core interaction: `npx shadcn@latest add button input label card dialog sheet`
   - Forms: `npx shadcn@latest add form select checkbox radio-group switch textarea`
   - Feedback: `npx shadcn@latest add alert sonner badge skeleton progress`
   - Navigation: `npx shadcn@latest add tabs accordion dropdown-menu navigation-menu`
   - Display: `npx shadcn@latest add avatar table popover tooltip hover-card`
   - Utilities: `npx shadcn@latest add scroll-area separator command collapsible`
   - On demand only: `npx shadcn@latest add slider toggle toggle-group menubar context-menu aspect-ratio`

### Baseline Mapping

Generic Vite examples often use `src/index.css` and `App.jsx`. In this skill, keep the equivalent design-system entry in `src/styles/tailwind.css` and make sure it contains:

```css
@import "tailwindcss";
```

Recommended structure inside this baseline:

```text
src/
├── components/
│   └── ui/
├── lib/
│   └── utils.ts
├── pages/
│   └── _app/
│       └── design-system/
│           └── index.tsx
├── styles/
│   └── tailwind.css
└── router.tsx
```

### Delivery Rules

- Build `header`, `hero`, and `footer` with design-system colors, tokens, and `shadcn/ui` components instead of ad hoc primitives.
- Put a router-driven `DesignSystem` showcase entry in the header, typically via TanStack Router `Link`.
- If the current design system is insufficient, extend its tokens or component composition first, then use the extension consistently.
