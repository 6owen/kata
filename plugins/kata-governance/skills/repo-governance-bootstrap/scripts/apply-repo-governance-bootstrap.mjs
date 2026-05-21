#!/usr/bin/env node

/*
[INPUT]: 目标仓库根目录、现有 README / 目录结构 / 文件列表、可注释文件类型边界。
[OUTPUT]: 向目标仓库写入治理文档、目录 `.folder.md` 与文件 Header 的最小可执行基线。
[POS]: 位于 /plugins/kata-governance/skills/repo-governance-bootstrap/scripts，作为 repo-governance-bootstrap skill 的执行入口。

[PROTOCOL]:
1. 一旦本文件逻辑、扫描范围或写入策略变化，必须同步更新此 Header。
2. 更新后必须上浮检查所属目录 `.folder.md`、上层 `SKILL.md` 与 `README.md` 的描述是否依然准确。
*/

import { constants } from 'node:fs'
import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import process from 'node:process'

/* ==========================================================================
 * Constants
 * ========================================================================== */

const DIR_IGNORE = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  '.next',
  '.turbo',
  '.vercel',
  'coverage',
  '.DS_Store',
])

const VENDORED_DIR_NAMES = new Set([
  'vendor',
])

const JSON_EXCEPTIONS = new Set([
  'package.json',
  'plugin.json',
  'turbo.json',
  'settings.json',
])

const RULE_FILE_ORDER = [
  'general.md',
  'frontend.md',
  'repo-docs.md',
]

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const RULES_DIR = path.resolve(SCRIPT_DIR, '../../../rules')

/* ==========================================================================
 * Fs Helpers
 * ========================================================================== */

async function exists(target) {
  try {
    await access(target, constants.F_OK)
    return true
  }
  catch {
    return false
  }
}

async function ensureDir(target) {
  await mkdir(target, { recursive: true })
}

async function ensureFileIfMissing(target, content) {
  if (!await exists(target))
    await writeFile(target, content, 'utf8')
}

async function readTextIfExists(target) {
  if (!await exists(target))
    return null

  return readFile(target, 'utf8')
}

function normalizePosix(filePath) {
  return filePath.split(path.sep).join('/')
}

function stripLeadingHeaderComment(markdown) {
  return markdown.replace(/^<!--[\s\S]*?-->\s*/u, '').trim()
}

/* ==========================================================================
 * Governance Templates
 * ========================================================================== */

async function loadRuleSections() {
  const sections = []

  for (const fileName of RULE_FILE_ORDER) {
    const fullPath = path.join(RULES_DIR, fileName)
    const raw = await readFile(fullPath, 'utf8')
    sections.push(stripLeadingHeaderComment(raw))
  }

  return sections.join('\n\n')
}

function buildAgentsMd(ruleSections) {
  return `<!--
[INPUT]: 仓库全局约束、目录级说明、文件头协议、实现与文档同步要求。
[OUTPUT]: 面向 AI 代理的统一执行规约与同步检查清单。
[POS]: 位于仓库根目录，作为 Codex / Claude / 其他代理的权威操作手册。

[PROTOCOL]:
1. 一旦仓库协作规则、目录结构或文档协议变化，必须同步更新我。
2. 我的内容若与某个目录 .folder.md 或文件 Header 冲突，以“更严格且不破坏运行时”的规则为准，并回写冲突处。
-->

# AGENTS.md

本文件是仓库内 AI 代理工作的唯一权威规约。Claude 或其他代理兼容入口应指向我，而不是维护另一套平行规则。

以下规则由共享规则源码编译而来；如果要长期修改行为规则，优先回到 \`kata-governance/rules/\` 修改源文件，再重新安装到新项目。

${ruleSections}
`
}

function buildClaudeMd() {
  return `<!--
[INPUT]: /AGENTS.md 中定义的全局 AI 规约。
[OUTPUT]: 给 Claude 兼容读取的治理入口与跳转说明。
[POS]: 位于仓库根目录，作为 Claude 侧的兼容入口文件。

[PROTOCOL]:
1. 一旦 /AGENTS.md 的权威规则变化，必须同步更新我。
2. 我只做入口与指针，不应复制出第二套相互独立的仓库规则。
-->

# CLAUDE.md

本仓库的 AI 规约以 \`/AGENTS.md\` 为唯一权威来源。

- Claude 在本仓库工作时，先遵守 \`/AGENTS.md\`。
- 进入任意子目录后，继续遵守该目录的 \`.folder.md\`。
- 修改任意可注释文件后，继续遵守该文件 Header 的同步要求。
`
}

function buildAiDocsFolderMd() {
  return `<!--
[INPUT]: 运行中生成的计划、总结、修复记录、架构稿与分析文档。
[OUTPUT]: \`ai-docs/\` 的用途说明与文档落盘边界。
[POS]: 位于 \`/ai-docs\`，作为根目录之外唯一允许承接新增 Markdown 文档的区域。

[PROTOCOL]:
1. 一旦 \`ai-docs/\` 内新增、删除或调整文档分类，必须同步更新我。
2. 若根目录文档输出规则变化，需同时更新 /README.md 与 /AGENTS.md 中的路径约束。
-->

一旦我所属的文件夹有所变化，请更新我。

# /ai-docs

这里承接 AI 生成的附属文档，不承接代码实现本身。
根目录之外的新增 Markdown 说明、计划、总结都应落在这里。
如果这里开始分子类目录，必须继续为子目录创建 \`.folder.md\`。

- \`.folder.md\`：本目录的用途说明与输出边界锚点。
`
}

function describeRootEntry(name) {
  if (name === 'README.md')
    return '根目录主控文档；定义全局同步协议与仓库总览。'
  if (name === 'AGENTS.md')
    return 'AI 权威操作规约；约束文档同步、Header 协议与目录治理方式。'
  if (name === 'CLAUDE.md')
    return 'Claude 兼容入口；将规则指向 AGENTS.md。'
  if (name === 'package.json')
    return 'JSON 例外文件；声明仓库包身份、包管理器版本与根级脚本入口。'
  if (name === 'pnpm-workspace.yaml')
    return 'workspace 边界声明；定义包管理器识别哪些子包路径。'
  if (name === 'turbo.json')
    return 'JSON 例外文件；预留或声明任务编排配置入口。'
  if (name === 'meta.ts')
    return '代码化元数据源；维护映射关系与仓库索引。'
  if (name === 'ai-docs')
    return '附属文档输出目录；承接计划、总结、修复记录等新增 Markdown。'
  if (name.startsWith('.'))
    return '根级隐藏配置目录或文件；请根据真实职责补充其地位与功能。'
  return '根级文件或目录；请根据真实职责补充其地位与功能。'
}

function buildRootIndexSection(rootEntries) {
  const bullets = rootEntries
    .map(name => `- \`${name}\`：${describeRootEntry(name)}`)
    .join('\n')

  return `
## 根目录索引

根目录没有单独 \`.folder.md\`，因此本 README 同时承担根层目录说明职责。
这里列出根层文件与目录的名字、地位、功能。
根层严格 JSON 例外文件也在这里完成补充说明。

${bullets}
`
}

function buildReadmeSection(rootEntries) {
  return `
## 核心同步协议 (Mandatory)

1. 任何功能、架构、写法更新，代码改完后必须立即同步更新对应文件 Header 与所属目录 \`.folder.md\`。
2. 递归链路固定为：文件变更 -> 更新文件 Header -> 更新所属目录 \`.folder.md\` -> 若影响全局则更新 \`/README.md\`。
3. 每个受管目录都必须能仅凭本目录 \`.folder.md\` 重建局部世界观；每个可注释文件都必须暴露 \`INPUT / OUTPUT / POS\`。
4. 根目录只允许存在 \`README.md\`、\`AGENTS.md\`、\`CLAUDE.md\` 这 3 个治理文档；其他新增说明、计划、总结必须写入 \`ai-docs/\`。

## AI 治理入口

- \`/AGENTS.md\`：仓库内 AI 代理的权威操作规约。
- \`/CLAUDE.md\`：给 Claude 兼容加载的入口，指向同一套规约。
- \`各目录/.folder.md\`：目录级极简架构说明与文件职责索引。
- \`各可注释文件 Header\`：文件级 \`INPUT / OUTPUT / POS\` 协议。

## 文档输出路径

- 严禁在项目根目录新增其他 \`.md\` 文件。
- 新增计划、总结、指南、分析文档统一写入 \`ai-docs/\`。

${buildRootIndexSection(rootEntries).trimEnd()}
`
}

function buildRootReadme(rootName, rootEntries) {
  return `# ${rootName}

这是一个已接入 Kata 治理协议的仓库。
请根据真实业务补充项目介绍，但保留以下治理规则。
${buildReadmeSection(rootEntries)}
`
}

function buildFolderMd(relativeDir, entries) {
  const displayDir = relativeDir === '.' ? '/' : `/${relativeDir}`
  const bullets = entries.length > 0
    ? entries.map(entry => `- \`${entry}\`：待补充该文件或子目录的名字、地位、功能。`).join('\n')
    : '- `（空）`：当前目录暂无受管文件，但后续一旦新增内容必须更新我。'

  return `<!--
[INPUT]: \`${displayDir}\` 内文件、子目录与局部职责变更。
[OUTPUT]: \`${displayDir}\` 的局部架构摘要与文件职责索引。
[POS]: 位于 \`${displayDir}\`，作为该局部区域的目录锚点。

[PROTOCOL]:
1. 一旦本目录文件或子目录变化，必须同步更新我。
2. 若本目录下文件职责、结构或边界变化，需同步检查相关文件 Header 与上层目录说明。
-->

一旦我所属的文件夹有所变化，请更新我。

# ${displayDir}

这里是 \`${displayDir}\` 的局部说明入口。
请用不超过 3 行的描述持续维护这一层的局部世界观。
任何文件或子目录增删改后，都要先回写我。

${bullets}
`
}

function buildHeader(relativeFile) {
  return {
    markdown: `<!--
[INPUT]: 与 \`${relativeFile}\` 相关的外部依赖、输入上下文或上游数据。
[OUTPUT]: \`${relativeFile}\` 对外提供的内容、约束或行为说明。
[POS]: 位于 \`/${relativeFile}\`，作为当前文件在系统局部中的职责声明。

[PROTOCOL]:
1. 一旦本文件逻辑或内容变化，必须同步更新此 Header。
2. 更新后必须上浮检查所属目录 \`.folder.md\` 的描述是否依然准确。
-->

`,
    script: `/*
[INPUT]: 与 \`${relativeFile}\` 相关的外部依赖、输入上下文或上游数据。
[OUTPUT]: \`${relativeFile}\` 对外提供的内容、约束或行为结果。
[POS]: 位于 \`/${relativeFile}\`，作为当前文件在系统局部中的职责声明。

[PROTOCOL]:
1. 一旦本文件逻辑变化，必须同步更新此 Header。
2. 更新后必须上浮检查所属目录 \`.folder.md\` 的描述是否依然准确。
*/

`,
    yaml: `# [INPUT]: 与 \`${relativeFile}\` 相关的外部依赖、输入上下文或上游数据。
# [OUTPUT]: \`${relativeFile}\` 对外提供的内容、约束或行为结果。
# [POS]: 位于 \`/${relativeFile}\`，作为当前文件在系统局部中的职责声明。
#
# [PROTOCOL]:
# 1. 一旦本文件逻辑变化，必须同步更新此 Header。
# 2. 更新后必须上浮检查所属目录 \`.folder.md\` 的描述是否依然准确。

`,
  }
}

/* ==========================================================================
 * File Classification
 * ========================================================================== */

function isIgnoredDir(name) {
  return DIR_IGNORE.has(name)
}

function isJsonException(filePath) {
  return JSON_EXCEPTIONS.has(path.basename(filePath))
}

function isCommentableMarkdown(filePath) {
  return filePath.endsWith('.md')
}

function isCommentableScript(filePath) {
  return ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'].includes(path.extname(filePath))
}

function isCommentableYaml(filePath) {
  return ['.yml', '.yaml'].includes(path.extname(filePath))
}

/* ==========================================================================
 * Root Governance
 * ========================================================================== */

async function ensureRootGovernance() {
  const ruleSections = await loadRuleSections()
  await ensureFileIfMissing('AGENTS.md', buildAgentsMd(ruleSections))
  await ensureFileIfMissing('CLAUDE.md', buildClaudeMd())
  await ensureDir('ai-docs')
  await ensureFileIfMissing(path.join('ai-docs', '.folder.md'), buildAiDocsFolderMd())

  const rootEntries = (await readdir('.'))
    .filter(name => !isIgnoredDir(name))
    .filter(name => name !== '.git')
    .sort((a, b) => a.localeCompare(b))

  const rootName = path.basename(process.cwd()) || 'Project'
  const readmePath = 'README.md'
  const current = await readTextIfExists(readmePath)

  if (!current) {
    await writeFile(readmePath, buildRootReadme(rootName, rootEntries), 'utf8')
    return
  }

  if (!current.includes('## 核心同步协议 (Mandatory)')) {
    const next = `${current.trimEnd()}\n\n${buildReadmeSection(rootEntries).trim()}\n`
    await writeFile(readmePath, next, 'utf8')
  }
}

/* ==========================================================================
 * Folder Docs
 * ========================================================================== */

async function collectManagedEntries(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  return entries
    .map(entry => entry.name)
    .filter(name => name !== '.folder.md')
    .filter(name => !isIgnoredDir(name))
    .filter(name => !(dir === '.' && name === 'vendor'))
    .sort((a, b) => a.localeCompare(b))
}

async function ensureFolderDoc(dir) {
  if (dir === '.')
    return

  const folderPath = path.join(dir, '.folder.md')
  if (await exists(folderPath))
    return

  const entries = await collectManagedEntries(dir)
  const relativeDir = normalizePosix(dir)
  await writeFile(folderPath, buildFolderMd(relativeDir, entries), 'utf8')
}

async function walkDirectories(dir = '.') {
  await ensureFolderDoc(dir)

  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isDirectory())
      continue

    if (isIgnoredDir(entry.name))
      continue

    if (VENDORED_DIR_NAMES.has(entry.name))
      continue

    const child = path.join(dir, entry.name)
    await walkDirectories(child)
  }
}

/* ==========================================================================
 * File Headers
 * ========================================================================== */

async function prependHeaderIfMissing(filePath) {
  if (isJsonException(filePath))
    return

  const raw = await readFile(filePath, 'utf8')
  if (raw.includes('[INPUT]:'))
    return

  const relativeFile = normalizePosix(filePath)
  const header = buildHeader(relativeFile)

  if (isCommentableMarkdown(filePath)) {
    if (raw.startsWith('---\n')) {
      const end = raw.indexOf('\n---\n', 4)
      if (end !== -1) {
        const frontmatter = raw.slice(0, end + 5)
        const rest = raw.slice(end + 5)
        await writeFile(filePath, `${frontmatter}\n${header.markdown}${rest}`, 'utf8')
        return
      }
    }

    await writeFile(filePath, `${header.markdown}${raw}`, 'utf8')
    return
  }

  if (isCommentableScript(filePath)) {
    if (raw.startsWith('#!')) {
      const newline = raw.indexOf('\n')
      const shebang = raw.slice(0, newline + 1)
      const rest = raw.slice(newline + 1)
      await writeFile(filePath, `${shebang}\n${header.script}${rest}`, 'utf8')
      return
    }

    await writeFile(filePath, `${header.script}${raw}`, 'utf8')
    return
  }

  if (isCommentableYaml(filePath)) {
    await writeFile(filePath, `${header.yaml}${raw}`, 'utf8')
  }
}

async function walkFiles(dir = '.') {
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (isIgnoredDir(entry.name))
      continue

    if (VENDORED_DIR_NAMES.has(entry.name) && dir === '.')
      continue

    const target = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      await walkFiles(target)
      continue
    }

    if (entry.name === '.folder.md')
      continue

    if (!entry.isFile())
      continue

    await prependHeaderIfMissing(target)
  }
}

/* ==========================================================================
 * Entry
 * ========================================================================== */

async function main() {
  await ensureRootGovernance()
  await walkDirectories('.')
  await walkFiles('.')
  console.log('Repository governance bootstrap completed')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
