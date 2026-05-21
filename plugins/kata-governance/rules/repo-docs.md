<!--
[INPUT]: 仓库文档同步协议、目录级说明协议、文件 Header 协议与文档输出路径规则。
[OUTPUT]: 可被 governance bootstrap 复用的仓库治理规则源码片段。
[POS]: 位于 /plugins/kata-governance/rules，作为仓库文档与结构同步规则集。

[PROTOCOL]:
1. 一旦规则内容、适用边界或排序变化，必须同步更新此 Header。
2. 更新后必须上浮检查 `/plugins/kata-governance/rules/.folder.md`、plugin README 与 bootstrap 脚本说明是否依然准确。
-->

# Repository Documentation Rules

## 文档同步协议 (Mandatory)

1. 任何功能、架构、写法更新完成后，必须立刻执行同步链路：文件实现 -> 文件 Header -> 所属目录 `.folder.md` -> 若影响全局则 `/README.md`
2. 每个受管目录都必须有一个 `.folder.md`，用 3 行内概括局部架构，并列出当前文件或直属子目录的名字、地位、功能。
3. 每个可注释文件都必须在开头声明：`INPUT`、`OUTPUT`、`POS`
4. 每个文件 Header 还必须声明：一旦本文件被更新，务必同步更新 Header 与所属目录 `.folder.md`
5. 每个 `.folder.md` 还必须声明：一旦所属文件夹变化，请更新我

## 文件头规则 (Header Rules)

- Markdown 文件使用 HTML 注释作为 Header。
- JavaScript / TypeScript / MJS / CJS 文件使用块注释作为 Header。
- YAML 文件使用 `#` 注释作为 Header。
- 带 frontmatter 的 Markdown 文件，Header 放在 frontmatter 之后。
- 带 shebang 的脚本，Header 放在 shebang 之后。

## 严格数据文件例外 (Non-Commentable Files)

- `package.json`
- `plugin.json`
- `turbo.json`
- 其他要求严格 JSON 的机器读取文件

这些文件的 `INPUT / OUTPUT / POS` 说明必须写入它们所属目录的 `.folder.md`，并在 `.folder.md` 中明确这是 “JSON 例外文件”。

## 注释风格 (Comment Style)

大模块：

```ts
/* ==========================================================================
 * Module Name
 * ========================================================================== */
```

次级逻辑组：

```ts
// --- Logic Group ---
```

## 文档输出路径 (Documentation Output Path)

- 严禁在项目根目录新建任意其他 `.md` 文件。
- 根目录允许的文档只有：`README.md`、`AGENTS.md`、`CLAUDE.md`、`.folder.md`。
- 计划、总结、架构稿、修复记录、分析文档统一放到 `ai-docs/`。
