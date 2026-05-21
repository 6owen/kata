/*
[INPUT]: 仓库内第三方来源映射、外部包依赖关系、手写 plugin 清单。
[OUTPUT]: 可被脚本或文档消费的 vendor / external package / manual plugin 元数据。
[POS]: 位于仓库根目录，作为外部依赖治理与插件索引的代码化单一来源。

[PROTOCOL]:
1. 一旦本文件的结构、字段或元数据更新，必须同步更新此 Header。
2. 更新后必须上浮检查 /README.md、/AGENTS.md 与相关目录 `.folder.md` 是否依然准确。
*/

/* ==========================================================================
 * Type Definitions
 * ========================================================================== */

export interface VendorSkillMeta {
  official?: boolean
  source: string
  plugin: string
  skills: Record<string, string> // sourceSkillName -> outputSkillName
}

export interface ExternalPackageMeta {
  source: string
  packages: string[]
  usedBy: string[]
}

/* ==========================================================================
 * Vendor Sources
 * ========================================================================== */

export const vendors: Record<string, VendorSkillMeta> = {
  impeccable: {
    source: 'https://github.com/pbakaus/impeccable',
    plugin: 'kata-design',
    skills: {
      impeccable: 'impeccable',
    },
  },
}

/* ==========================================================================
 * External Packages
 * ========================================================================== */

export const externalPackages: Record<string, ExternalPackageMeta> = {
  'eslint-config': {
    source: 'https://github.com/6owen/eslint-config.git',
    packages: ['@arvinn/eslint-config'],
    usedBy: ['kata-code/project-toolchain'],
  },
  'prettier-config': {
    source: 'https://github.com/6owen/prettier-config.git',
    packages: ['@arvinn/prettier-config'],
    usedBy: ['kata-code/project-toolchain'],
  },
}

/* ==========================================================================
 * Manual Plugins
 * ========================================================================== */

export const manualPlugins = [
  'kata-code',
  'kata-design',
  'kata-test',
]
