<!--
[INPUT]: `repo-governance-bootstrap` skill 的定位、使用方式与安装范围说明。
[OUTPUT]: 面向人类的 repo-governance-bootstrap skill 简介。
[POS]: 位于 /plugins/kata-governance/skills/repo-governance-bootstrap，作为该 skill 的人类入口文档。

[PROTOCOL]:
1. 一旦 skill 行为、安装范围或输出结构变化，必须同步更新此 Header。
2. 更新后必须上浮检查本目录 `.folder.md`、`SKILL.md` 与 `scripts/` 下脚本 Header 是否依然准确。
-->

# repo-governance-bootstrap

Install Kata's repository governance protocol into a target repository.

This skill reads governance rule sources from `plugins/kata-governance/rules/` and compiles them into the target repository's `AGENTS.md`.

The bootstrap writes:

- `AGENTS.md`
- `CLAUDE.md`
- `ai-docs/.folder.md`
- root `README.md` governance block when missing
- directory `.folder.md` files for managed directories
- file header comments for managed, commentable files

Main entry: `SKILL.md`
