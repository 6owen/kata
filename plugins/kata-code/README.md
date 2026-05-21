<!--
[INPUT]: `kata-code` plugin 的定位、skill 清单与工程边界。
[OUTPUT]: 面向人类的 `kata-code` plugin 总览说明。
[POS]: 位于 /plugins/kata-code，作为代码工程 plugin 的入口文档。

[PROTOCOL]:
1. 一旦 plugin 定位、skill 清单或边界变化，必须同步更新此 Header。
2. 更新后必须上浮检查 /plugins/kata-code/.folder.md、/plugins/.folder.md 与 /README.md 的描述是否依然准确。
-->

# kata-code

`kata-code` 承载代码工程相关 skill，包括工具链接入、monorepo 结构、后端模块化骨架，以及前端实现层依赖偏好。

这里不会镜像或内置你已经独立维护的配置仓库。像 `@arvinn/eslint-config`、`@arvinn/prettier-config` 这类能力继续从外部仓库和包源消费。

## Skills

- `project-toolchain`
- `pnpm-monorepo`
- `express-modular`
- `tailwind-iconify`
