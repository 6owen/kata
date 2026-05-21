<!--
[INPUT]: `kata-governance` plugin 的定位、skill 清单与治理边界。
[OUTPUT]: 面向人类的 `kata-governance` plugin 总览说明。
[POS]: 位于 /plugins/kata-governance，作为仓库治理 plugin 的入口文档。

[PROTOCOL]:
1. 一旦 plugin 定位、skill 清单或治理边界变化，必须同步更新此 Header。
2. 更新后必须上浮检查 /plugins/kata-governance/.folder.md、/plugins/.folder.md 与 /README.md 的描述是否依然准确。
-->

# kata-governance

`kata-governance` 承载“把仓库治理规则安装到新仓库里”的能力。

它不负责具体业务代码生成，而是负责维护可复用的规则源码，并把这些规则安装到目标仓库。

## Rules

通用规则源码位于 `rules/`：

- `general.md`：跨项目通用的 AI 工作规则
- `frontend.md`：前端样式与 token 复用相关规则
- `repo-docs.md`：仓库文档同步、Header 协议与输出路径规则

## Bootstrap Output

`repo-governance-bootstrap` 会读取 `rules/`，并把它们落地到目标仓库：

- `AGENTS.md`
- `CLAUDE.md`
- `ai-docs/`
- 根 `README.md` 的治理段落
- 目录级 `.folder.md`
- 可注释文件的 `INPUT / OUTPUT / POS / PROTOCOL` Header

## Skills

- `repo-governance-bootstrap`
