<!--
[INPUT]: 仓库三层文档结构、文档同步协议、回环工作流、违规分级、文件 Header 协议与文档输出路径规则。
[OUTPUT]: 可被 governance bootstrap 复用的仓库治理规则源码片段。
[POS]: 位于 /plugins/kata-governance/rules，作为仓库文档与结构同步规则集。

[PROTOCOL]:
1. 一旦规则内容、适用边界或排序变化，必须同步更新此 Header。
2. 更新后必须上浮检查 `/plugins/kata-governance/rules/.folder.md`、plugin README 与 bootstrap 脚本说明是否依然准确。
-->

# Repository Documentation Rules

## 三层文档结构 (Three-Layer Map)

代码是实体的机器相，文档是实体的语义相，两相必须同构：任何一相变化，必须在另一相显现，否则视为未完成。

| 层级 | 位置 | 职责 | 触发更新 |
|------|------|------|----------|
| L1 | `/AGENTS.md` + `/README.md` 治理段 | 全局规约·根目录索引 | 架构变更 / 顶级目录增删 |
| L2 | `各目录/.folder.md` | 局部架构·成员清单 | 文件增删 / 重命名 / 职责变更 |
| L3 | 文件 Header | `INPUT / OUTPUT / POS` 契约 | 依赖变更 / 导出变更 / 职责变更 |

L1 是 L2 的折叠，L2 是 L3 的折叠，L3 是代码逻辑的折叠。

## 文档同步协议 (Mandatory)

1. 任何功能、架构、写法更新完成后，必须立刻执行同步链路：文件实现 -> 文件 Header -> 所属目录 `.folder.md` -> 若影响全局则 `/README.md`
2. 每个受管目录都必须有一个 `.folder.md`，用 3 行内概括局部架构，并列出当前文件或直属子目录的名字、地位、功能。
3. 每个可注释文件都必须在开头声明：`INPUT`、`OUTPUT`、`POS`
4. 每个文件 Header 还必须声明：一旦本文件被更新，务必同步更新 Header 与所属目录 `.folder.md`
5. 每个 `.folder.md` 还必须声明：一旦所属文件夹变化，请更新我

## 回环工作流 (Loop Workflow)

正向流（代码 → 文档），代码修改完成后按序回环：

1. L3：更新被改文件的 Header。
2. L2：更新所属目录 `.folder.md`。
3. L1：若影响全局结构，更新 `/README.md` 与 `/AGENTS.md`。

三层检查完毕，任务才算完成。

逆向流（进入目录），动手之前先读地图：

1. 准备进入新目录时，先读该目录的 `.folder.md`。
2. 修改文件前，先读目标文件的 Header。
3. 然后才开始实际工作。

范围约束：回环只覆盖本次变更触及的链路。对未触及文件的批量补齐属于 bootstrap 脚本的职责，不要在日常任务中即兴扩散大 diff。

## 违规分级 (Violation Levels)

阻塞级（发现即停下，补齐后才能宣布任务完成）：

- FATAL-001 孤立代码变更：改了代码但未回环检查文档。停下补文档，禁止回滚已完成的代码。
- FATAL-002 缺失 Header 却继续：本次任务触及的可注释文件缺少 Header，必须先补齐再继续。
- FATAL-003 删文件不更新清单：删除或重命名文件后，`.folder.md` 中残留旧成员。
- FATAL-004 新目录无锚点：新建目录却不创建 `.folder.md`。

警告级（发现后修复，不阻塞当前任务，但必须在结果中披露）：

- SEVERE-001 Header 过时：Header 描述与代码现实不符。
- SEVERE-002 清单不完整：目录中存在未列入 `.folder.md` 的文件。
- SEVERE-003 全局索引过时：目录结构变化未反映到 `/README.md`。

## 固定句式 (Fixed Protocol Sentences)

协议句子必须写进文档自身，让每份文档自带同步提醒：

- 每个 `.folder.md` 正文必须包含：`一旦我所属的文件夹有所变化，请更新我。`
- 每个文件 Header 必须包含 `[PROTOCOL]:` 段，声明一旦本文件变化必须同步更新 Header，并上浮检查所属目录 `.folder.md`。

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
