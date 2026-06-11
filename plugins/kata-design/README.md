<!--
[INPUT]: `kata-design` plugin 的定位、companion plugin 集成边界与 skill 清单。
[OUTPUT]: 面向人类的 `kata-design` plugin 总览说明。
[POS]: 位于 /plugins/kata-design，作为设计编排 plugin 的入口文档。

[PROTOCOL]:
1. 一旦 plugin 定位、集成边界或 skill 清单变化，必须同步更新此 Header。
2. 更新后必须上浮检查 /plugins/kata-design/.folder.md、/plugins/.folder.md 与 /README.md 的描述是否依然准确。
-->

# kata-design

`kata-design` 负责设计流程编排，不维护视觉设计 skill 的上游副本。

## Companion Plugin

推荐与外部 `impeccable` plugin 搭配安装：

```bash
npx plugins add pbakaus/impeccable
```

`kata-design` 的职责：

- 规定何时优先使用 `impeccable`
- 规定设计完成后如何回到 `kata` 的工程与落地约束
- 提供未安装 `impeccable` 时的基础降级规则

上游源码通过 `vendor/impeccable` submodule 跟踪，仅用于集成和参考，不在本仓库内维护其实现。

## Skills

- `impeccable-integration`
- `website-to-design-md`
