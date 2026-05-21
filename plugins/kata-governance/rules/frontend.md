<!--
[INPUT]: 前端样式复用、设计 token 选择与颜色表达边界相关规则。
[OUTPUT]: 可被 governance bootstrap 复用的前端规则源码片段。
[POS]: 位于 /plugins/kata-governance/rules，作为跨项目前端行为规则集。

[PROTOCOL]:
1. 一旦规则内容、适用边界或排序变化，必须同步更新此 Header。
2. 更新后必须上浮检查 `/plugins/kata-governance/rules/.folder.md`、plugin README 与 bootstrap 脚本说明是否依然准确。
-->

# Frontend Rules

## 前端样式优先复用全局变量 (Prefer global.css)

- 前端样式修改时，优先复用项目现有的全局颜色变量与语义类。
- 如果项目存在类似 `globals.css` 的全局 token 源，应先检查并复用它。
- 优先采用现有语义表达，而不是新建平行颜色体系。

## 避免新增颜色函数表达式 (Avoid new color-function styling)

- 除非用户明确要求，否则不要主动新增 `color-mix()`、`oklch()`、`light-dark()`。
- 不要为了颜色表达引入新的复杂 arbitrary value。
- 优先复用现有全局变量、语义 token 与现有颜色系统。
