<!--
[INPUT]: `impeccable-integration` skill 的定位、companion plugin 关系与降级边界。
[OUTPUT]: 面向人类的 `impeccable-integration` skill 简介。
[POS]: 位于 /plugins/kata-design/skills/impeccable-integration，作为该 skill 的人类入口文档。

[PROTOCOL]:
1. 一旦 skill 边界、路由策略或外部依赖关系变化，必须同步更新此 Header。
2. 更新后必须上浮检查本目录 `.folder.md`、`SKILL.md` 与 `references/` 说明是否依然准确。
-->

# impeccable-integration

Bridge Kata's design workflow to the external `impeccable` plugin without vendoring its source.

Main entry: `SKILL.md`
