<!--
[INPUT]: 仓库全局约束、目录级说明、文件头协议、插件与 skill 结构。
[OUTPUT]: 面向 AI 代理的统一执行规约与同步检查清单。
[POS]: 位于仓库根目录，作为 Codex / Claude / 其他代理的权威操作手册。

[PROTOCOL]:
1. 一旦仓库协作规则、目录结构或文档协议变化，必须同步更新我。
2. 我的内容若与某个目录 .folder.md 或文件 Header 冲突，以“更严格且不破坏运行时”的规则为准，并回写冲突处。
-->

# AGENTS.md

本文件是仓库内 AI 代理工作的唯一权威规约。`CLAUDE.md` 只做兼容入口，不重复维护另一套规则。

## Mandatory

1. 任何功能、架构、写法更新完成后，必须立刻执行同步链路：
   文件实现 -> 文件 Header -> 所属目录 `.folder.md` -> 若影响全局则 `/README.md`
2. 每个受管目录都必须有一个 `.folder.md`，用 3 行内概括局部架构，并列出当前文件或直属子目录的名字、地位、功能。
3. 每个可注释文件都必须在开头声明：
   `INPUT`、`OUTPUT`、`POS`
4. 每个文件 Header 还必须声明：
   一旦本文件被更新，务必同步更新 Header 与所属目录 `.folder.md`
5. 每个 `.folder.md` 还必须声明：
   一旦所属文件夹变化，请更新我

## Header Rules

- Markdown 文件使用 HTML 注释作为 Header。
- JavaScript / TypeScript / MJS 文件使用块注释作为 Header。
- YAML 文件使用 `#` 注释作为 Header。
- 带 frontmatter 的 Markdown 文件，Header 放在 frontmatter 之后，避免破坏解析。
- 带 shebang 的脚本，Header 放在 shebang 之后，避免破坏执行。

## Non-Commentable Files

以下严格数据文件不能为了写 Header 而破坏语法：

- `package.json`
- `plugin.json`
- `turbo.json`
- 其他要求严格 JSON 的机器读取文件

这些文件的 `INPUT / OUTPUT / POS` 说明必须写入它们所属目录的 `.folder.md`，并在 `.folder.md` 中明确这是“JSON 例外文件”。

## Comment Style

当代码进入新的大模块时，使用固定宽度的块注释：

```ts
/* ==========================================================================
 * Module Name
 * ========================================================================== */
```

当大模块内部需要细分逻辑组时，使用：

```ts
// --- Logic Group ---
```

间距规则：

- 大模块分割线前保留 2 行空行
- 次级分割线前保留 1 行空行
- 注释符号与文字之间保留 1 个空格

## Documentation Output Path

- 严禁在项目根目录新建任意其他 `.md` 文件。
- 根目录允许的文档只有：`README.md`、`AGENTS.md`、`CLAUDE.md`。
- 计划、总结、架构稿、修复记录、分析文档统一放到 `ai-docs/`。

## Plugin Inheritance

- 以后新增 plugin、skill、脚本或模板时，默认继承本文件规则。
- 新增目录时必须同时创建对应 `.folder.md`。
- 新增可注释文件时必须从创建当下就带上 Header，而不是事后补。

## Safety

- 不要修改 `vendor/impeccable` 这类上游拥有的 submodule 内容，除非任务明确要求维护其上游副本。
- `vendor/` 下的第三方仓库默认必须保持“只登记引用、未初始化工作树”的 submodule 状态，不应把上游真实内容长期 checkout 在本地。
- `git submodule status` 前缀为 `-` 时，表示该 submodule 仅登记引用、尚未初始化工作树；这正是 `vendor/impeccable`、`vendor/vercel-agent-skills` 这类目录的预期默认状态。
- 如果新增了 `vendor/*` submodule，完成登记后应立即执行 `git submodule deinit -f <path>`，恢复为引用态；除非当前任务明确要求临时查看或维护其上游源码。
- 如果目录说明与真实代码不符，优先修正文档，但不要用文档掩盖实现偏差；需要同时指出或修复偏差。
