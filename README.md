<!--
[INPUT]: 仓库目录结构、插件元数据、外部依赖关系、AI 协作治理规则。
[OUTPUT]: 仓库总览、强制同步协议、安装方式、插件结构与文档约束。
[POS]: 位于仓库根目录，作为系统主控文档与全局法典。

[PROTOCOL]:
1. 一旦功能、架构、写法或治理规则变化，必须先更新相关文件 Header 与所属目录 .folder.md，再回写我。
2. 新增 plugin、skill、目录或文档输出规则时，必须同步检查 /AGENTS.md、/CLAUDE.md 与受影响目录说明。
-->

# Kata

一个面向 AI 辅助开发的插件仓库，按工作流拆成独立 plugin，并强制要求目录文档与文件头注释同步演进。

## 核心同步协议 (Mandatory)

1. 任何功能、架构、写法更新，代码改完后必须立即同步更新对应文件 Header 与所属目录 `.folder.md`。
2. 递归链路固定为：文件变更 -> 更新文件 Header -> 更新所属目录 `.folder.md` -> 若影响全局则更新 `/README.md`。
3. 每个受管目录都必须能仅凭本目录 `.folder.md` 重建局部世界观；每个可注释文件都必须暴露 `INPUT / OUTPUT / POS`。
4. 根目录只允许存在 `README.md`、`AGENTS.md`、`CLAUDE.md` 这 3 个治理文档；其他新增说明、计划、总结必须写入 `ai-docs/`。

## AI 治理入口

- `/AGENTS.md`：仓库内 AI 代理的权威操作规约。
- `/CLAUDE.md`：给 Claude 兼容加载的入口，指向同一套规约。
- `各目录/.folder.md`：目录级极简架构说明与文件职责索引。
- `各可注释文件 Header`：文件级 `INPUT / OUTPUT / POS` 协议。

## 根目录索引

根目录没有单独 `.folder.md`，因此本 README 同时承担根层目录说明职责。
这里列出根层文件与目录的名字、地位、功能。
根层严格 JSON 例外文件也在这里完成补充说明。

- `README.md`：根目录主控文档；定义全局同步协议、根层索引与仓库总览。
- `AGENTS.md`：AI 权威操作规约；约束文档同步、Header 协议与目录治理方式。
- `CLAUDE.md`：Claude 兼容入口；将规则指向 `AGENTS.md`，避免双份治理。
- `.gitignore`：根级忽略规则；过滤本地安装产物，避免把 `node_modules/` 纳入版本控制。
- `package.json`：JSON 例外文件；声明仓库包身份、包管理器版本、根级脚本入口与根开发依赖。
- `bump.config.ts`：仓库版本升级配置；统一定义根包与各 plugin `plugin.json` 的版本同步 bump 目标。
- `pnpm-lock.yaml`：依赖锁定文件；固定根开发依赖及其传递依赖解析结果。
- `pnpm-workspace.yaml`：workspace 边界声明；定义 `pnpm` 识别哪些子包路径。
- `turbo.json`：JSON 例外文件；预留 Turborepo 任务编排配置入口。
- `meta.ts`：代码化元数据源；维护 vendor、外部包与手写 plugin 的映射关系。
- `.github/`：平台自动化目录；承载 CI、发布与仓库工作流配置。
- `.vscode/`：编辑器配置目录；承载本仓库的工作区协作设置。
- `ai-docs/`：附属文档输出目录；承接计划、总结、修复记录等新增 Markdown。
- `apps/`：宿主应用目录；放浏览器扩展与 Web 应用等示例或承载应用。
- `interaction/`：交互资产预留目录；当前为空但受统一治理协议管理。
- `plugins/`：一方 plugin 集合目录；承载 `kata-*` 插件实现与骨架。
- `vendor/`：三方来源目录；通过 submodule 或引用方式接入上游资产，默认保持“只登记引用、未初始化工作树”的引用态。

## 文档输出路径

禁止在项目根目录创建新的 `.md` 文件。

- 错误：`/FIX_SUMMARY.md`
- 正确：`/ai-docs/fix-summary.md`

## 仓库定位

- `kata-code`：代码工程、工具链、目录结构、前后端实现偏好，以及 Vite React 单应用 starter 基线。
- `kata-design`：设计流程编排，推荐与外部 `impeccable` plugin 搭配使用。
- `kata-governance`：把 AI 治理规则安装到新仓库里的 bootstrap plugin。
- `kata-test`：测试能力预留骨架，后续补充 skill。

仓库不内置所有配置包。已有独立维护的配置仓库继续作为外部依赖使用，例如 [6owen/eslint-config](https://github.com/6owen/eslint-config) 与 [6owen/prettier-config](https://github.com/6owen/prettier-config)。第三方 skill 则通过 `vendor/ + .gitmodules + meta.ts` 接入，例如 `vendor/impeccable` 与 `vendor/vercel-agent-skills`。

对 `vendor/*` submodule，仓库约定的默认状态是“只登记引用、未初始化工作树”。执行 `git submodule status` 时，记录前面的 `-` 就表示该目录仍处于这种正确默认状态，本地没有真实上游内容被 checkout 出来。

根级开发工具额外使用 [@clack/prompts](https://github.com/bombshell-dev/clack) 作为 CLI 交互组件，使用 [picocolors](https://github.com/alexeyraspopov/picocolors) 与 [sisteransi](https://github.com/terkelg/sisteransi) 处理终端颜色和 ANSI 输出，并用 [bumpp](https://github.com/antfu-collective/bumpp) 统一维护根包与各 plugin 的版本号。

## 安装

安装整个插件仓库：

```bash
npx plugins add 6owen/kata
```

安装单个 plugin：

```bash
npx plugins add /Users/wangwenbo/Desktop/demo/dev-bootstrap/plugins/kata-code
```

安装单个 skill：

```bash
npx skills add /Users/wangwenbo/Desktop/demo/dev-bootstrap/plugins/kata-code/skills/project-toolchain
```

推荐的设计组合安装：

```bash
npx plugins add /Users/wangwenbo/Desktop/demo/dev-bootstrap/plugins/kata-design
npx plugins add pbakaus/impeccable
```

## 更新与排查

`skills` 与 `plugins` 是两套不同的安装体系，不要混用它们的命令来判断状态。

- `npx skills list` 只列出通过 `npx skills add ...` 安装的独立 skills，不会列出 `kata-design` 这类 plugin 名称。
- `npx skills update` 只更新通过 `skills` CLI 安装的 skill 源，不负责更新通过 `npx plugins add ...` 安装的 plugin。
- `kata-design` 应通过 `npx plugins discover <repo-or-path>` 或目标 agent 的 plugin 缓存元数据来确认是否被识别。

对 plugin 安装而言，实际更新通常由 source snapshot 或 git commit 驱动，而不是只看 `plugin.json` 的 `version` 字段。

- 如果你是从 `6owen/kata` 这类 GitHub repo 安装，只有当远端仓库出现新的 commit，重新执行 `npx plugins add 6owen/kata` 才会拉到新快照。
- 如果你只是修改了本地工作区文件或只 bump 了 `plugin.json.version`，但没有形成新的安装 source，`skills update` 不会感知到这些变更。
- 本地开发调试时，优先直接安装本地 plugin 路径，例如 `npx plugins add /absolute/path/to/plugins/kata-design`，这样更容易验证当前工作区内容。

排查顺序建议固定为：

1. 用 `npx plugins discover <repo-or-path>` 确认 plugin 能被识别。
2. 检查目标 agent 的 plugin 安装元数据，确认当前安装记录对应的 source 或 commit。
3. 如果安装来源是远端 repo，先确认变更已经 commit 并 push。
4. 重新执行 `npx plugins add <repo-or-path>`，不要用 `npx skills update` 代替 plugin 刷新。

rm -rf ~/.claude/plugins/cache/6owen-kata/kata-design
rm -rf ~/.codex/plugins/cache/6owen-kata/kata-design
npx plugins add 6owen/kata -y

## 版本发布

仓库根提供统一版本升级入口：

```bash
pnpm bump
```

它会读取根目录的 `bump.config.ts`，同步更新：

- 根 `package.json`
- `plugins/kata-code/plugin.json`
- `plugins/kata-design/plugin.json`
- `plugins/kata-governance/plugin.json`
- `plugins/kata-test/plugin.json`

只在本地更新版本文件、不 commit/tag/push 时：

```bash
pnpm bump:local
```

## 当前插件

### `kata-code`

- `project-toolchain`：为 `pnpm` JavaScript/TypeScript 项目接入 `@arvinn/eslint-config`、`@arvinn/prettier-config`、`@arvinn/vscode-settings`、`lint-staged`、`simple-git-hooks`。
- `pnpm-monorepo`：初始化或迁移为 `pnpm` monorepo，建立 `apps/*`、`packages/*` 与 `apps/web` 默认前端应用目录。
- `express-modular`：生成 Express + TypeScript 的模块化后端骨架，采用 `controller / service / model / routes` 结构。
- `starter-react`：以 `6owen/starter-react` 为基线初始化新的 Vite React 单应用，内置一条 init 命令，也可把现有单体前端收敛到同一套目录、路由、状态与请求层结构，并引用 vendored `react-best-practices` 作为 React 性能 companion。
- `tailwind-iconify`：接入 Tailwind CSS v4 + Iconify 图标工作流。

### `kata-design`

- `impeccable-integration`：作为 `kata` 的设计流程入口，推荐把视觉设计、polish、critique、audit 交给外部 `impeccable`，本仓库只维护集成约束。
- `website-to-design-md`：使用浏览器自动化深读实时网站，输出可复用的 `DESIGN.md` 与配套 HTML 预览。

### `kata-governance`

- `repo-governance-bootstrap`：向目标仓库写入 `AGENTS.md`、`CLAUDE.md`、`ai-docs/`、根 README 治理段、目录 `.folder.md` 与文件 Header 基线。

### `kata-test`

- 当前仅保留 plugin 骨架。
- 后续补充单测、集成测试、E2E 相关 skill。

## 仓库结构

```text
kata/
  ai-docs/
  apps/
    browser-extension/
    web/
  vendor/
    impeccable/
    vercel-agent-skills/
  meta.ts
  plugins/
    kata-code/
    kata-design/
    kata-governance/
    kata-test/
```
