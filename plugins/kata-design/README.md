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
