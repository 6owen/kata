#!/usr/bin/env node

/*
[INPUT]: 目标目录、模板来源、本地 pnpm / git 环境、可选项目名与执行参数。
[OUTPUT]: 对目标目录应用 `starter-react` 模板基线，并补齐包名与可选依赖安装。
[POS]: 位于 /plugins/kata-code/skills/starter-react/scripts，作为 starter-react skill 的初始化执行入口。

[PROTOCOL]:
1. 一旦本文件逻辑、模板来源优先级或复制规则变化，必须同步更新此 Header。
2. 更新后必须上浮检查所属目录 `.folder.md`、上层 `SKILL.md` 与 `README.md` 的描述是否依然准确。
*/

import { spawnSync } from 'node:child_process'
import { constants } from 'node:fs'
import { access, cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'

/* ==========================================================================
 * Constants
 * ========================================================================== */

const DEFAULT_LOCAL_TEMPLATE = '/Users/wangwenbo/Documents/wangwenbo/Mine/starter-react'
const DEFAULT_REMOTE_TEMPLATE = 'https://github.com/6owen/starter-react.git'

const COPY_EXCLUDES = new Set([
  '.git',
  'node_modules',
  'dist',
])

const SAFE_SCAFFOLD_ENTRIES = new Set([
  '.DS_Store',
  '.editorconfig',
  '.git',
  '.gitattributes',
  '.github',
  '.gitignore',
  '.idea',
  '.npmrc',
  '.nvmrc',
  '.vscode',
  'LICENSE',
  'LICENSE.md',
  'README.md',
])

const PRESERVE_WHEN_EXISTS = new Set([
  '.git',
  '.github',
  '.idea',
  '.vscode',
  'LICENSE',
  'LICENSE.md',
])

const EXISTING_APP_MARKERS = [
  'package.json',
  'src',
  'app',
  'pages',
  'vite.config.ts',
  'vite.config.js',
  'vite.config.mjs',
]

/* ==========================================================================
 * Cli Helpers
 * ========================================================================== */

function getArgValue(key) {
  const args = process.argv.slice(2)

  const exact = args.find(arg => arg.startsWith(`${key}=`))
  if (exact)
    return exact.slice(key.length + 1)

  const index = args.indexOf(key)
  if (index >= 0)
    return args[index + 1]

  return null
}

function hasFlag(flag) {
  return process.argv.slice(2).includes(flag)
}

function shouldInstallDependencies() {
  return !hasFlag('--skip-install') && !hasFlag('--no-install')
}

function shouldForceOverwrite() {
  return hasFlag('--force')
}

function getTargetDir() {
  const dirArg = getArgValue('--dir') || getArgValue('--target')
  return path.resolve(dirArg || process.cwd())
}

/* ==========================================================================
 * Shell And Fs Helpers
 * ========================================================================== */

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    ...options,
  })

  if (result.error)
    throw result.error

  if (result.status !== 0)
    throw new Error(`Command failed: ${command} ${args.join(' ')}`)
}

function hasCommand(command) {
  const result = spawnSync(command, ['--version'], {
    stdio: 'ignore',
  })
  return result.status === 0
}

async function exists(file) {
  try {
    await access(file, constants.F_OK)
    return true
  }
  catch {
    return false
  }
}

async function readJson(file) {
  const raw = await readFile(file, 'utf8')
  return JSON.parse(raw)
}

async function writeJson(file, value) {
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

/* ==========================================================================
 * Template Resolution
 * ========================================================================== */

function isRemoteTemplate(input) {
  return /^(https?:\/\/|git@)/.test(input) || input.endsWith('.git')
}

async function cloneRemoteTemplate(remote) {
  if (!hasCommand('git'))
    throw new Error(`git is required to clone template: ${remote}`)

  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'kata-starter-react-'))
  run('git', ['clone', '--depth', '1', remote, tempDir])

  return {
    root: tempDir,
    async cleanup() {
      await rm(tempDir, { recursive: true, force: true })
    },
  }
}

async function resolveTemplateSource() {
  const templateArg = getArgValue('--template')

  if (templateArg) {
    if (isRemoteTemplate(templateArg))
      return cloneRemoteTemplate(templateArg)

    const resolvedPath = path.resolve(templateArg)
    if (!await exists(resolvedPath))
      throw new Error(`Template path does not exist: ${resolvedPath}`)

    return {
      root: resolvedPath,
      async cleanup() {},
    }
  }

  if (await exists(DEFAULT_LOCAL_TEMPLATE)) {
    return {
      root: DEFAULT_LOCAL_TEMPLATE,
      async cleanup() {},
    }
  }

  return cloneRemoteTemplate(DEFAULT_REMOTE_TEMPLATE)
}

/* ==========================================================================
 * Target Validation
 * ========================================================================== */

async function ensureTargetDir(targetDir) {
  await mkdir(targetDir, { recursive: true })
}

async function readTargetEntries(targetDir) {
  return (await readdir(targetDir)).filter(name => name !== '.DS_Store')
}

async function ensureTargetLooksFresh(targetDir) {
  const entries = await readTargetEntries(targetDir)

  const existingAppMarkers = entries.filter(entry => EXISTING_APP_MARKERS.includes(entry))
  if (existingAppMarkers.length > 0) {
    throw new Error(`Target already looks like an app (${existingAppMarkers.join(', ')}). Use migrate mode instead of init.`)
  }

  const unsafeEntries = entries.filter(entry => !SAFE_SCAFFOLD_ENTRIES.has(entry))
  if (unsafeEntries.length > 0) {
    throw new Error(`Target is not empty enough for init mode: ${unsafeEntries.join(', ')}`)
  }
}

/* ==========================================================================
 * Copy Flow
 * ========================================================================== */

async function copyTemplate(templateRoot, targetDir, force) {
  const entries = await readdir(templateRoot, { withFileTypes: true })

  for (const entry of entries) {
    if (COPY_EXCLUDES.has(entry.name))
      continue

    const src = path.join(templateRoot, entry.name)
    const dest = path.join(targetDir, entry.name)

    if (await exists(dest)) {
      if (PRESERVE_WHEN_EXISTS.has(entry.name) && !force)
        continue

      if (!force)
        throw new Error(`Target already contains ${entry.name}. Remove it or rerun with --force.`)

      await rm(dest, { recursive: true, force: true })
    }

    await cp(src, dest, { recursive: true, force: true })
  }
}

/* ==========================================================================
 * Package Metadata
 * ========================================================================== */

function sanitizePackageSegment(value) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^[._-]+|[._-]+$/g, '')

  return normalized || 'starter-react-app'
}

function toPackageName(input) {
  const trimmed = input.trim()

  if (trimmed.startsWith('@') && trimmed.includes('/')) {
    const [scope, name] = trimmed.slice(1).split('/', 2)
    return `@${sanitizePackageSegment(scope)}/${sanitizePackageSegment(name)}`
  }

  return sanitizePackageSegment(trimmed)
}

async function updatePackageJson(targetDir) {
  const packagePath = path.join(targetDir, 'package.json')
  const pkg = await readJson(packagePath)
  const providedName = getArgValue('--name')
  const resolvedName = toPackageName(providedName || path.basename(targetDir))

  pkg.name = resolvedName
  pkg.private = true

  await writeJson(packagePath, pkg)

  return resolvedName
}

async function updateReadmeTitle(targetDir) {
  const titleArg = getArgValue('--title')
  if (!titleArg)
    return

  const readmePath = path.join(targetDir, 'README.md')
  if (!await exists(readmePath))
    return

  const current = await readFile(readmePath, 'utf8')
  const next = current.replace(/^#\s+Starter React$/m, `# ${titleArg}`)

  if (next !== current)
    await writeFile(readmePath, next, 'utf8')
}

/* ==========================================================================
 * Install And Entry
 * ========================================================================== */

function ensurePnpmIfNeeded() {
  if (shouldInstallDependencies() && !hasCommand('pnpm'))
    throw new Error('pnpm is required but was not found in PATH')
}

async function main() {
  ensurePnpmIfNeeded()

  const targetDir = getTargetDir()
  const force = shouldForceOverwrite()
  const template = await resolveTemplateSource()

  try {
    await ensureTargetDir(targetDir)
    await ensureTargetLooksFresh(targetDir)
    await copyTemplate(template.root, targetDir, force)

    const packageName = await updatePackageJson(targetDir)
    await updateReadmeTitle(targetDir)

    if (shouldInstallDependencies())
      run('pnpm', ['install'], { cwd: targetDir })

    console.log(`starter-react initialized at ${targetDir}`)
    console.log(`package name: ${packageName}`)

    if (!shouldInstallDependencies())
      console.log('Dependencies were not installed because --skip-install was used.')
  }
  finally {
    await template.cleanup()
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
