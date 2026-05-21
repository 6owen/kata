---
name: express-modular
description: Set up an Express + TypeScript backend with modules-first architecture (controller, service, model, routes) inspired by oopus-flow server structure. Use for new server initialization or when refactoring a flat server into src/modules style.
---

<!--
[INPUT]: AI 任务上下文、目标项目根目录、pnpm 环境、可选模块名参数。
[OUTPUT]: 给 AI 的运行协议，以及对目标项目注入 Express 模块化骨架的明确步骤。
[POS]: 位于 /plugins/kata-code/skills/express-modular，作为该 skill 的机器可读入口。

[PROTOCOL]:
1. 一旦 skill 工作流、依赖或生成结构变化，必须同步更新此 Header。
2. 更新后必须上浮检查本目录 `.folder.md`、`README.md` 与 `scripts/apply-express-modular.mjs` 的描述是否依然准确。
-->

# Express Modular

Apply a modules-first Express + TypeScript server structure.

## Workflow

1. Run `node scripts/apply-express-modular.mjs` in the server project root.
2. Script ensures dependencies, scripts, tsconfig, and `src` architecture.
3. Optionally scaffold module files in one command:
   - `node scripts/apply-express-modular.mjs --module user`

## Generated architecture

- `src/app.ts`, `src/index.ts`
- `src/common/{errors,handler,middleware,utils}`
- `src/config`, `src/docs`
- `src/infrastructure/{db,queue}`
- `src/modules/*` (controller/service/model/routes per module)
- `src/tests/{unit,integration,manual}`

## Notes

- This skill is intentionally `pnpm`-only.
- This skill is TypeScript-only and enforces TS scripts/package fields.
- Re-running is idempotent: existing files are kept unless missing.
- Existing JavaScript source files are not auto-converted to TypeScript.
- New modules follow `<name>.controller.ts / <name>.service.ts / <name>.model.ts / <name>.routes.ts`.
