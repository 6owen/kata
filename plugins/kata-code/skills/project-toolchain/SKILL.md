---
name: project-toolchain
description: Set up a pnpm JavaScript/TypeScript project with Arvinn's external prettier, eslint, and VS Code conventions, including package.json scripts, lint-staged, simple-git-hooks, and an eslint.config.ts starter. Use when initializing a new project or aligning an existing project to this toolchain.
---

# Project Toolchain

Apply Arvinn's default frontend tooling to the current project.

## Workflow

1. Ensure the target project root has `package.json` and uses `pnpm`.
2. Run `node scripts/apply-project-toolchain.mjs` with the target project as working directory.
3. If `eslint.config.ts` exists but does not reference `@arvinn/eslint-config`, ask for confirmation before overwrite.
4. Let `npx arvinn-vscode-settings` complete (it may prompt before overwriting files in `.vscode`).

## What the script changes

- Installs dev dependencies:
  - `eslint`
  - `@arvinn/eslint-config`
  - `@arvinn/prettier-config`
  - `@arvinn/vscode-settings`
  - `lint-staged`
  - `simple-git-hooks`
- These config packages stay in their own repositories:
  - `@arvinn/eslint-config`: `https://github.com/6owen/eslint-config.git`
  - `@arvinn/prettier-config`: `https://github.com/6owen/prettier-config.git`
- Merges `package.json` with:
  - `scripts.setup-arvin`
  - `scripts.prepare` including `simple-git-hooks`
  - `prettier: "@arvinn/prettier-config"`
  - `simple-git-hooks.pre-commit`
  - `lint-staged["*"]`
- Creates or updates `eslint.config.ts` based on the Arvinn template.
- Activates hooks with `pnpm exec simple-git-hooks`.
- Syncs VSCode settings via `npx arvinn-vscode-settings`.

## Notes

- This skill is intentionally `pnpm`-only.
- The script is idempotent for repeated runs.
- If overwrite is declined for `eslint.config.ts`, existing file is kept unchanged.
- Kata consumes these packages as external dependencies rather than vendoring their source.
