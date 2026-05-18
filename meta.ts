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

/**
 * Third-party skill repositories tracked as submodules.
 */
export const vendors: Record<string, VendorSkillMeta> = {
  impeccable: {
    source: 'https://github.com/pbakaus/impeccable',
    plugin: 'kata-design',
    skills: {
      impeccable: 'impeccable',
    },
  },
}

/**
 * External package repositories consumed by Kata skills.
 * These stay in their own dedicated repositories and are not vendored here.
 */
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

/**
 * Hand-written first-party plugins maintained in this repository.
 */
export const manualPlugins = [
  'kata-code',
  'kata-design',
  'kata-test',
]
