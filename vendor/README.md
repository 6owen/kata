<!--
[INPUT]: 第三方 skill 来源、submodule 引用方式、vendor 默认引用态与工作流说明。
[OUTPUT]: vendor 目录用途、默认状态、`git submodule status` 判读方式与初始化/回退操作指南。
[POS]: 位于 /vendor，作为外部来源接入方式的人类说明文档。

[PROTOCOL]:
1. 一旦 vendor 接入方式或上游来源变化，必须同步更新此 Header。
2. 更新后必须上浮检查 /vendor/.folder.md、/README.md 与 /meta.ts 的描述是否依然准确。
-->

# Vendor 说明

`vendor/` 用来登记第三方 skill 来源，但不默认把上游仓库真实内容 checkout 到本地工作树。

- `vendor/impeccable`：提供给 `kata-design` 使用的外部 companion skill 来源
- `vendor/vercel-agent-skills`：提供给 `kata-code/starter-react` 使用的 Vercel Labs React companion reference

这些 vendored 仓库仍然归上游维护，Kata 只负责它们的接入方式、引用边界和本地工作流约束。

## 默认状态

`vendor/` 下的 submodule 默认应该处于“只登记引用、未初始化工作树”的状态。也就是说：

- 本地可以看到目录入口
- 但不应默认 checkout 出完整上游源码
- 只有在确实要查看或维护上游内容时，才临时初始化

这就是 `vendor/impeccable` 现在采用的模式，`vendor/vercel-agent-skills` 也必须保持一致。

## 如何判断当前是不是正确状态

执行：

```bash
git submodule status
```

如果某条记录前面是 `-`，例如：

```bash
-e1d3ea0b6f79ebccb80b9e4b0d2b2ad62a13205b vendor/impeccable
-f8a72b9603728bb92a217a879b7e62e43ad76c81 vendor/vercel-agent-skills
```

就表示这个 submodule 只是登记了引用，但还没有初始化工作树，本地没有真实上游内容被 checkout 出来。这是 `vendor/*` 的预期默认状态。

如果没有前缀 `-`，通常说明它已经被初始化，真实内容已经落到本地工作树里。除非当前任务明确需要这样做，否则应回退到引用态。

## 临时查看上游源码

如果确实需要查看某个 vendored 仓库的真实内容，再显式初始化：

```bash
git submodule update --init vendor/impeccable
git submodule update --init vendor/vercel-agent-skills
```

如果要一次性初始化全部 `vendor/` submodule：

```bash
git submodule update --init --recursive
```

## 回退到默认引用态

不再需要上游源码落地在本地时，必须反初始化，恢复成默认引用态：

```bash
git submodule deinit -f vendor/impeccable
git submodule deinit -f vendor/vercel-agent-skills
```

如果以后新增了新的 `vendor/*` submodule，也应该在 `git submodule add` 完成后尽快执行同样的 `deinit`，不要把真实上游内容长期留在本地工作树。
