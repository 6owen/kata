<!--
[INPUT]: `website-to-design-md` skill 的定位、安装示例与输出说明。
[OUTPUT]: 面向人类的 `website-to-design-md` skill 简介。
[POS]: 位于 `/plugins/kata-design/skills/website-to-design-md`，作为该 skill 的人类入口文档。

[PROTOCOL]:
1. 一旦本文件被更新，务必同步更新 Header 与所属目录 `.folder.md`。
2. 若 skill 名称、安装方式或交付物变化，需同步更新 SKILL.md、agents 与上层目录说明。
-->

# website-to-design-md

把实时网站抽取为可复用的 `design.md` / `DESIGN.md`，并生成一个用于审阅设计系统的 HTML 预览。

这个目录已经按可安装 AI skill 的结构打包完成。你可以把 GitHub URL 提供给支持的 skill installer，或直接把这个文件夹复制到本地 skills 目录。

## 能力说明

- 使用 `agent-browser` 读取实时网站。
- 通过 `agent-browser eval` 提取 DOM 结构、computed styles、CSS variables、stylesheet rules、可见文本与交互状态。
- 生成细致的 Stitch 风格 `DESIGN.md`。
- 基于 markdown 中记录的同一套 design tokens 生成同目录 HTML 预览。
- 当网站支持主题切换时，覆盖 light mode 与 dark mode。
- 避免以截图为主的抽取流程。截图仅在用户明确要求，或 DOM 证据不足时，作为最后的校验手段。

## 从 GitHub 安装

发布到 GitHub 后，用户可以通过支持 GitHub 来源的 skill installer 直接安装。

对于 Codex 风格的 skill installer，仓库根目录已经包含 `SKILL.md`，因此安装路径就是仓库根目录：

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py --repo Paidax01/website-to-design-md --path .
```

如果你的 installer 支持直接传入 GitHub URL，可使用仓库地址：

```text
https://github.com/Paidax01/website-to-design-md
```

安装完成后，重启 AI coding app，让新 skill 被重新发现。

## 依赖要求

这个 skill 默认使用 `agent-browser` 完成所有网站读取工作。

如果本机缺少 `agent-browser`，skill 应先帮助安装，或把它暴露到 `PATH`，然后再开始抽取。除非用户明确要求降级方案，否则不应静默切换到 Playwright、Chrome CLI 或以截图为主的提取方式。

## 目录结构

```text
.
├── SKILL.md
├── agents/
│   └── openai.yaml
├── assets/
│   ├── DESIGN.template.md
│   └── design-preview-shell.template.html
├── references/
│   ├── browser-tooling-bootstrap.md
│   └── website-reading-checklist.md
└── scripts/
    ├── check-browser-tooling.mjs
    ├── extract-browser-evidence.mjs
    └── render-design-preview.mjs
```

## 使用方式

你可以这样请求 AI coding agent：

```text
Use the website-to-design-md skill to extract https://example.com into design.md and design-preview.html.
```

输出通常应包含：

- `design.md` 或 `DESIGN.md`
- `design-preview.html`

## 发布说明

在公开发布前，请补充与你预期一致的开源许可证，例如 MIT、Apache-2.0 或其他合适的 license。
