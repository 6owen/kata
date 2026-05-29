<!--
[INPUT]: `project-toolchain` skill 的定位、使用方式与依赖注入边界说明。
[OUTPUT]: 面向人类的 project-toolchain skill 简介。
[POS]: 位于 /plugins/kata-code/skills/project-toolchain，作为该 skill 的人类入口文档。

[PROTOCOL]:
1. 一旦 skill 行为、依赖清单或输出配置变化，必须同步更新此 Header。
2. 更新后必须上浮检查本目录 `.folder.md`、`SKILL.md` 与 `scripts/` 下脚本 Header 是否依然准确。
-->

# project-toolchain

Set up a pnpm JavaScript/TypeScript project with Arvinn's lint, format, editor, and dependency-maintenance conventions from external config packages, including default `lint`, `format`, `fix`, and `up` scripts added to `package.json` when they are missing.

Main entry: `SKILL.md`
