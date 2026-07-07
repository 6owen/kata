<!--
[INPUT]: `express-modular` skill 的定位、使用方式与输出结构说明。
[OUTPUT]: 面向人类的 Express 模块化 skill 简介。
[POS]: 位于 /plugins/kata-code/skills/express-modular，作为该 skill 的人类入口文档。

[PROTOCOL]:
1. 一旦 skill 行为、依赖或输出结构变化，必须同步更新此 Header。
2. 更新后必须上浮检查本目录 `.folder.md`、`SKILL.md` 与 `scripts/` 下脚本 Header 是否依然准确。
-->

# express-modular

Set up an Express + TypeScript server with modules-first architecture:
`controller + service + model + routes`.

Opinionated API conventions baked into the scaffold:

- Normalized response envelope (`{ code, message, result, success, timestamp }`), with a
  paginated `PageResult` variant — see `src/common/utils/response.ts`.
- GET for reads, POST for writes; PUT and DELETE are never used.
- Non-RESTful endpoint names: the last path segment is a full camelCase action
  (`getUserList`, `deleteUserById`), so calls stay distinguishable in devtools.

Main entry: `SKILL.md`
