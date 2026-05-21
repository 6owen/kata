---
name: repo-governance-bootstrap
description: Install Kata's repository governance protocol into a target repository by compiling shared rules into AGENTS.md, then writing CLAUDE.md, ai-docs, README governance sections, per-folder .folder.md files, and INPUT/OUTPUT/POS file headers where syntax allows.
---

<!--
[INPUT]: AI 任务上下文、目标仓库根目录、现有 README / 目录结构 / 可注释文件状态。
[OUTPUT]: 给 AI 的运行协议，以及对目标仓库安装治理规则的明确步骤。
[POS]: 位于 /plugins/kata-governance/skills/repo-governance-bootstrap，作为该 skill 的机器可读入口。

[PROTOCOL]:
1. 一旦 skill 工作流、安装范围或写入策略变化，必须同步更新此 Header。
2. 更新后必须上浮检查本目录 `.folder.md`、`README.md` 与 `scripts/apply-repo-governance-bootstrap.mjs` 的描述是否依然准确。
-->

# Repo Governance Bootstrap

Install Kata's repository governance protocol into the current repository.

## Workflow

1. Run `node scripts/apply-repo-governance-bootstrap.mjs` in the target repository root.
2. The script reads shared rule sources from `plugins/kata-governance/rules/`.
3. The script compiles those rule files into the target repository's `AGENTS.md`.
4. The script ensures `CLAUDE.md` and `ai-docs/.folder.md`.
5. The script updates root `README.md` with governance sections when they are missing.
6. The script creates `.folder.md` for managed directories when they are missing.
7. The script prepends file headers for commentable files when they are missing.
8. The script skips strict JSON files and records their ownership through directory docs and README governance sections.

## What the script changes

- Ensures root governance files:
  - `AGENTS.md` compiled from shared rules
  - `CLAUDE.md`
  - `ai-docs/.folder.md`
- Reads rule sources from:
  - `rules/general.md`
  - `rules/frontend.md`
  - `rules/repo-docs.md`
- Ensures root `README.md` exists and contains:
  - governance protocol
  - AI governance entry points
  - root-level index
  - documentation output path rule
- Ensures `.folder.md` exists for:
  - root-level managed directories except ignored/system directories
  - one-level and deeper directories unless ignored
- Adds `INPUT / OUTPUT / POS / PROTOCOL` headers to:
  - Markdown files
  - TypeScript / JavaScript / MJS / CJS files
  - YAML files
- Skips:
  - `.git`
  - `node_modules`
  - build outputs
  - vendored third-party directories
  - strict JSON files

## Notes

- The script is intentionally conservative and does not overwrite existing governance files by default.
- Existing headers are kept when a file already declares `INPUT`.
- Existing `.folder.md` files are kept unchanged.
- The skill is for installing the governance baseline, not for continuously reconciling every future drift.
