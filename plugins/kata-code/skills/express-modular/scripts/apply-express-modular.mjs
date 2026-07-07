#!/usr/bin/env node

/*
[INPUT]: 目标项目根目录、pnpm 环境、现有 package.json、可选模块名参数。
[OUTPUT]: 对目标项目安装 Express TypeScript 依赖，并生成模块化后端骨架与样板文件；
         内置约定：归一化响应 envelope（含分页 PageResult）、GET 读 / POST 写（禁用 PUT/DELETE）、
         非 RESTful 的小驼峰全名接口路径（如 getUserList、deleteUserById）。
[POS]: 位于 /plugins/kata-code/skills/express-modular/scripts，作为 express-modular skill 的执行入口。

[PROTOCOL]:
1. 一旦本文件逻辑、生成结构或依赖策略变化，必须同步更新此 Header。
2. 更新后必须上浮检查所属目录 `.folder.md`、上层 `SKILL.md` 与 `README.md` 的描述是否依然准确。
*/

import { spawnSync } from 'node:child_process'
import { constants } from 'node:fs'
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import process from 'node:process'

/* ==========================================================================
 * Constants
 * ========================================================================== */

const BASE_DIRS = [
  'src/common/errors',
  'src/common/handler',
  'src/common/middleware',
  'src/common/utils',
  'src/config',
  'src/docs',
  'src/infrastructure/db',
  'src/infrastructure/queue',
  'src/modules',
  'src/tests/unit',
  'src/tests/integration',
  'src/tests/manual',
]

const RUNTIME_DEPS = ['express', 'cors', 'zod']
const DEV_DEPS = ['typescript', 'tsx', '@types/node', '@types/express', '@types/cors']

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

function hasPnpm() {
  const result = spawnSync('pnpm', ['--version'], { stdio: 'ignore' })
  return result.status === 0
}

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

async function exists(file) {
  try {
    await access(file, constants.F_OK)
    return true
  }
  catch {
    return false
  }
}

async function ensureFile(path, content) {
  if (!await exists(path))
    await writeFile(path, `${content.trimEnd()}\n`, 'utf8')
}

async function readJson(path) {
  const raw = await readFile(path, 'utf8')
  return JSON.parse(raw)
}

async function writeJson(path, value) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

/* ==========================================================================
 * Package And Tsconfig
 * ========================================================================== */

function ensureScripts(pkg) {
  pkg.scripts = pkg.scripts && typeof pkg.scripts === 'object' && !Array.isArray(pkg.scripts)
    ? pkg.scripts
    : {}

  const defaults = {
    dev: 'tsx watch src/index.ts',
    build: 'tsc -p tsconfig.json',
    start: 'node dist/index.js',
    typecheck: 'tsc --noEmit',
  }

  for (const [key, value] of Object.entries(defaults)) {
    pkg.scripts[key] = value
  }
}

async function ensurePackageJson() {
  const pkg = await readJson('package.json')

  pkg.type = 'module'
  pkg.private = true
  if (!pkg.packageManager)
    pkg.packageManager = 'pnpm@10.33.0'
  pkg.main = 'dist/index.js'
  pkg.types = 'dist/index.d.ts'

  ensureScripts(pkg)

  await writeJson('package.json', pkg)
}

async function ensureTsconfig() {
  const content = `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*.ts"]
}
`

  await ensureFile('tsconfig.json', content)
}

/* ==========================================================================
 * Base File Generation
 * ========================================================================== */

async function ensureBaseFiles() {
  const files = {
    'src/app.ts': `import express, { type Express } from 'express'
import cors from 'cors'
import { errorHandler, notFoundHandler } from './common/middleware/index.js'

const app: Express = express()

app.use(cors({ origin: '*' }))
app.use(express.json({ limit: '2mb' }))

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

// module routes example:
// import userRouter from './modules/user/user.routes.js'
// app.use('/api/user', userRouter)
// endpoints are named actions, e.g. POST /api/user/getUserList, POST /api/user/deleteUserById

app.use(notFoundHandler)
app.use(errorHandler)

export default app
`,
    'src/index.ts': `import app from './app.js'

const PORT = Number(process.env.PORT || 3000)

app.listen(PORT, () => {
  console.log(\`Server running at http://localhost:\${PORT}\`)
})
`,
    'src/common/errors/app-error.ts': `export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode = 500,
    public readonly code = 'APP_ERROR',
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400, 'BAD_REQUEST')
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not Found') {
    super(message, 404, 'NOT_FOUND')
  }
}
`,
    'src/common/errors/index.ts': `export * from './app-error.js'
`,
    'src/common/handler/handle.ts': `import type { Request, Response, NextFunction } from 'express'
import { createSuccessResponse } from '../utils/index.js'

type Handler<T = unknown> = (req: Request) => Promise<T> | T

type HandleOptions = {
  status?: number
  message?: string
}

// Wrap a handler so its return value becomes a standard success envelope.
// Return a PageResult (via toPageResult / okPage in the service) for paginated data.
export function handle<T>(handler: Handler<T>, options: HandleOptions = {}) {
  const { status = 200, message = '' } = options

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await handler(req)
      res.status(status).json(createSuccessResponse(data, { message }))
    } catch (error) {
      next(error)
    }
  }
}
`,
    'src/common/handler/index.ts': `export * from './handle.js'
`,
    'src/common/middleware/auth.ts': `import type { NextFunction, Request, Response } from 'express'

export type AuthenticatedRequest = Request & {
  user?: {
    userId: string
  }
}

export function authMiddleware(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  // TODO: implement auth
  req.user = { userId: 'demo-user-id' }
  next()
}
`,
    'src/common/middleware/error-handler.ts': `import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../errors/index.js'
import { createErrorResponse } from '../utils/index.js'

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction) {
  next(new AppError('Route not found', 404, 'NOT_FOUND'))
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    res.status(error.statusCode).json(createErrorResponse({
      code: error.code,
      message: error.message,
    }))
    return
  }

  res.status(500).json(createErrorResponse({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Internal server error',
  }))
}
`,
    'src/common/middleware/index.ts': `export * from './auth.js'
export * from './error-handler.js'
`,
    'src/common/utils/response.ts': `/*
[INPUT]: 任意 JSON 响应业务数据、HTTP 状态码、消息文本与错误码。
[OUTPUT]: 标准响应 envelope 构造、分页构造、识别与归一化工具。
[POS]: 位于 src/common/utils，作为基础响应工具函数定义文件。
[PROTOCOL]: 一旦我被更新，务必更新我的开头注释，以及所属文件夹的 md。
*/

type SuccessResponseOptions = {
  code?: number
  message?: string
  timestamp?: number
}

type ErrorResponseOptions = {
  code: string
  message: string
  timestamp?: number
}

type JsonRecord = Record<string, unknown>

export type PageResult<T> = {
  current: number
  pages: number
  records: T[]
  size: number
  total: number
}

export type PageMeta = {
  current: number
  size: number
  total: number
}

export function createSuccessResponse<T>(
  result: T,
  options: SuccessResponseOptions = {},
) {
  const { code = 200, message = '', timestamp = Date.now() } = options

  return {
    code,
    message,
    result,
    success: true,
    timestamp,
  }
}

export function createErrorResponse(options: ErrorResponseOptions) {
  const { code, message, timestamp = Date.now() } = options

  return {
    code,
    message,
    success: false,
    timestamp,
  }
}

export function toPageResult<T>(records: T[], meta: PageMeta): PageResult<T> {
  const { current, size, total } = meta

  return {
    current,
    pages: size > 0 ? Math.ceil(total / size) : 0,
    records,
    size,
    total,
  }
}

function isJsonRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function hasOwn(value: JsonRecord, key: string) {
  return Object.prototype.hasOwnProperty.call(value, key)
}

function resolveMessage(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function resolveSuccessCode(value: unknown, fallback: number) {
  return typeof value === 'number' ? value : fallback
}

function resolveErrorCode(value: unknown, fallback: number) {
  return typeof value === 'string' ? value : String(fallback)
}

export function normalizeJsonResponse(body: unknown, statusCode = 200) {
  if (!isJsonRecord(body)) {
    return createSuccessResponse(body, { code: statusCode })
  }

  if (body.success === false) {
    return createErrorResponse({
      code: resolveErrorCode(body.code, statusCode),
      message: resolveMessage(body.message),
      timestamp:
        typeof body.timestamp === 'number' ? body.timestamp : undefined,
    })
  }

  if (body.success === true && hasOwn(body, 'result')) {
    return createSuccessResponse(body.result, {
      code: resolveSuccessCode(body.code, statusCode),
      message: resolveMessage(body.message),
      timestamp:
        typeof body.timestamp === 'number' ? body.timestamp : undefined,
    })
  }

  if (body.success === true && hasOwn(body, 'data')) {
    return createSuccessResponse(body.data, {
      code: resolveSuccessCode(body.code, statusCode),
      message: resolveMessage(body.message),
      timestamp:
        typeof body.timestamp === 'number' ? body.timestamp : undefined,
    })
  }

  return createSuccessResponse(body, { code: statusCode })
}

export function ok<T>(
  result: T,
  messageOrOptions: string | SuccessResponseOptions = {},
) {
  const options =
    typeof messageOrOptions === 'string'
      ? { message: messageOrOptions }
      : messageOrOptions

  return createSuccessResponse(result, options)
}

export function okPage<T>(
  records: T[],
  meta: PageMeta,
  messageOrOptions: string | SuccessResponseOptions = {},
) {
  const options =
    typeof messageOrOptions === 'string'
      ? { message: messageOrOptions }
      : messageOrOptions

  return createSuccessResponse(toPageResult(records, meta), options)
}
`,
    'src/common/utils/index.ts': `export * from './response.js'
`,
    'src/config/env.ts': `export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 3000),
}
`,
    'src/config/index.ts': `export * from './env.js'
`,
    'src/docs/index.ts': `import type { Express } from 'express'

export function registerDocs(_app: Express) {
  // TODO: wire openapi docs if needed
}
`,
    'src/infrastructure/db/client.ts': `export async function initDatabase() {
  // TODO: initialize db client
}
`,
    'src/infrastructure/db/index.ts': `export * from './client.js'
`,
    'src/infrastructure/queue/qstash.ts': `export async function enqueueTask() {
  // TODO: implement queue producer
}
`,
    'src/infrastructure/index.ts': `export * from './db/index.js'
export * from './queue/qstash.js'
`,
    'src/modules/README.md': `# modules

Feature modules live here. Each module follows:
- <name>.model.ts
- <name>.service.ts
- <name>.controller.ts
- <name>.routes.ts
`,
  }

  for (const [file, content] of Object.entries(files)) {
    await ensureFile(file, content)
  }
}

async function ensureReadmeForDirs() {
  const docs = {
    'src/common/README.md': '# common\n\nShared utilities and cross-cutting concerns.\n',
    'src/config/README.md': '# config\n\nEnvironment and app configuration.\n',
    'src/docs/README.md': '# docs\n\nOpenAPI/docs registration.\n',
    'src/infrastructure/README.md': '# infrastructure\n\nDatabase, queue, and external infrastructure adapters.\n',
    'src/tests/README.md': '# tests\n\nServer test suites.\n',
  }

  for (const [file, content] of Object.entries(docs)) {
    await ensureFile(file, content)
  }
}

async function ensureDirs() {
  for (const dir of BASE_DIRS) {
    await mkdir(dir, { recursive: true })
  }
}

function safeModuleName(input) {
  if (!input)
    return null

  const normalized = input.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
  if (!normalized)
    return null

  return normalized
}

function toClassName(name) {
  return name
    .split('-')
    .filter(Boolean)
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join('')
}

async function scaffoldModule(moduleName) {
  const module = safeModuleName(moduleName)
  if (!module)
    throw new Error('Invalid module name. Use letters, numbers, and hyphens only.')

  const moduleDir = `src/modules/${module}`
  await mkdir(moduleDir, { recursive: true })

  const pascal = toClassName(module)

  const modelContent = `import { z } from 'zod'

export const ${module}ListQuerySchema = z.object({
  current: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(10),
})

export const ${module}IdSchema = z.object({
  id: z.string().min(1),
})

export const create${pascal}Schema = z.object({
  name: z.string().min(1),
})

export const update${pascal}Schema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).optional(),
})

export type ${pascal}ListQuery = z.infer<typeof ${module}ListQuerySchema>
export type ${pascal}IdInput = z.infer<typeof ${module}IdSchema>
export type Create${pascal}Input = z.infer<typeof create${pascal}Schema>
export type Update${pascal}Input = z.infer<typeof update${pascal}Schema>
`

  const serviceContent = `import { toPageResult, type PageResult } from '../../common/utils/index.js'
import type {
  ${pascal}ListQuery,
  Create${pascal}Input,
  Update${pascal}Input,
} from './${module}.model.js'

export type ${pascal} = {
  id: string
  name: string
}

const items: ${pascal}[] = []

export async function get${pascal}List(query: ${pascal}ListQuery): Promise<PageResult<${pascal}>> {
  const { current, size } = query
  const start = (current - 1) * size
  const records = items.slice(start, start + size)
  return toPageResult(records, { current, size, total: items.length })
}

export async function get${pascal}ById(id: string): Promise<${pascal} | null> {
  return items.find(item => item.id === id) ?? null
}

export async function create${pascal}(input: Create${pascal}Input): Promise<${pascal}> {
  const item: ${pascal} = { id: crypto.randomUUID(), ...input }
  items.push(item)
  return item
}

export async function update${pascal}ById(input: Update${pascal}Input): Promise<${pascal} | null> {
  const item = items.find(entry => entry.id === input.id)
  if (!item)
    return null
  Object.assign(item, input)
  return item
}

export async function delete${pascal}ById(id: string): Promise<{ id: string }> {
  const index = items.findIndex(item => item.id === id)
  if (index >= 0)
    items.splice(index, 1)
  return { id }
}
`

  const controllerContent = `import { Router } from 'express'
import { z } from 'zod'
import { handle } from '../../common/handler/index.js'
import { BadRequestError, NotFoundError } from '../../common/errors/index.js'
import {
  ${module}ListQuerySchema,
  ${module}IdSchema,
  create${pascal}Schema,
  update${pascal}Schema,
} from './${module}.model.js'
import {
  get${pascal}List,
  get${pascal}ById,
  create${pascal},
  update${pascal}ById,
  delete${pascal}ById,
} from './${module}.service.js'

const router = Router()

function parse<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success)
    throw new BadRequestError(result.error.issues[0]?.message || 'Validation failed')
  return result.data
}

// Convention: reads use GET, mutations use POST. PUT and DELETE are never used.
// Each endpoint's last path segment is a full camelCase action name (e.g.
// get${pascal}List, delete${pascal}ById) so it stays unique and readable in devtools.
router.get('/get${pascal}List', handle(async (req) => {
  const query = parse(${module}ListQuerySchema, req.query)
  return get${pascal}List(query)
}))

router.get('/get${pascal}ById', handle(async (req) => {
  const { id } = parse(${module}IdSchema, req.query)
  const found = await get${pascal}ById(id)
  if (!found)
    throw new NotFoundError('${module} not found')
  return found
}))

router.post('/create${pascal}', handle(async (req) => {
  const input = parse(create${pascal}Schema, req.body)
  return create${pascal}(input)
}, { status: 201, message: '${module} created' }))

router.post('/update${pascal}ById', handle(async (req) => {
  const input = parse(update${pascal}Schema, req.body)
  const updated = await update${pascal}ById(input)
  if (!updated)
    throw new NotFoundError('${module} not found')
  return updated
}, { message: '${module} updated' }))

router.post('/delete${pascal}ById', handle(async (req) => {
  const { id } = parse(${module}IdSchema, req.body)
  return delete${pascal}ById(id)
}, { message: '${module} deleted' }))

export default router
`

  const readmeContent = `# ${module}

${module} feature module.

## Endpoints (GET reads / POST writes, no PUT/DELETE)

| Method | Path | Action |
|--------|------|--------|
| GET | /api/${module}/get${pascal}List | paginated list |
| GET | /api/${module}/get${pascal}ById | single record |
| POST | /api/${module}/create${pascal} | create |
| POST | /api/${module}/update${pascal}ById | update |
| POST | /api/${module}/delete${pascal}ById | delete |
`

  const files = {
    [`${moduleDir}/README.md`]: readmeContent,
    [`${moduleDir}/${module}.model.ts`]: modelContent,
    [`${moduleDir}/${module}.service.ts`]: serviceContent,
    [`${moduleDir}/${module}.controller.ts`]: controllerContent,
    [`${moduleDir}/${module}.routes.ts`]: `import router from './${module}.controller.js'\n\nexport default router\n`,
  }

  for (const [file, content] of Object.entries(files)) {
    await ensureFile(file, content)
  }

  console.log(`Module scaffolded: ${moduleDir}`)
  console.log(`Remember to register routes in src/app.ts, e.g. app.use('/api/${module}', ${module}Router)`)
}

async function ensurePreconditions() {
  if (!hasPnpm())
    throw new Error('pnpm is required but was not found in PATH')

  if (!await exists('package.json'))
    throw new Error('package.json was not found. Run this script at a project root.')
}

async function warnIfJavaScriptSourcesPresent() {
  const jsCandidates = [
    'src/index.js',
    'src/app.js',
    'src/server.js',
  ]

  const found = []
  for (const file of jsCandidates) {
    if (await exists(file))
      found.push(file)
  }

  if (found.length > 0) {
    console.warn(`Detected JavaScript entry files: ${found.join(', ')}`)
    console.warn('This skill enforces TypeScript project setup and does not auto-convert JS source files.')
  }
}

async function main() {
  await ensurePreconditions()
  await warnIfJavaScriptSourcesPresent()

  run('pnpm', ['add', ...RUNTIME_DEPS])
  run('pnpm', ['add', '-D', ...DEV_DEPS])

  await ensurePackageJson()
  await ensureTsconfig()
  await ensureDirs()
  await ensureReadmeForDirs()
  await ensureBaseFiles()

  const moduleName = getArgValue('--module')
  if (moduleName)
    await scaffoldModule(moduleName)

  console.log('Express modular setup completed')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
