<!--
[INPUT]: 第三方 skill 来源、submodule 引用方式、vendor 工作流说明。
[OUTPUT]: vendor 目录用途、默认状态与初始化/回退操作指南。
[POS]: 位于 /vendor，作为外部来源接入方式的人类说明文档。

[PROTOCOL]:
1. 一旦 vendor 接入方式或上游来源变化，必须同步更新此 Header。
2. 更新后必须上浮检查 /vendor/.folder.md、/README.md 与 /meta.ts 的描述是否依然准确。
-->

# Vendor Sources

This directory tracks third-party skills as git submodules.

- `vendor/impeccable`: external companion skill source used by `kata-design`
- `vendor/vercel-agent-skills`: Vercel Labs skill source used by `kata-code/starter-react` as a React best-practices companion reference

Vendored repositories remain upstream-owned. Kata only defines integration, routing, and local workflow constraints around them.

## Default State

Submodules in `vendor/` are recorded as references by default. They may appear as empty directories in the working tree because the upstream repository is not automatically checked out.

This matches the intended workflow for Kata:

- keep the upstream dependency visible
- avoid polluting the local workspace with third-party source code unless needed
- only initialize a vendor repository when you actually want to inspect or update it

## View Vendor Source Code

If you want to inspect the code for a vendored repository, initialize it explicitly:

```bash
git submodule update --init vendor/impeccable
git submodule update --init vendor/vercel-agent-skills
```

If you want to initialize every vendored repository:

```bash
git submodule update --init --recursive
```

## Return To Reference-Only State

If you no longer want the vendored source checked out locally, deinitialize it and return to the reference-only state:

```bash
git submodule deinit -f vendor/impeccable
git submodule deinit -f vendor/vercel-agent-skills
```
