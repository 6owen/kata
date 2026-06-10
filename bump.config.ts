/*
[INPUT]: 仓库根 package 版本、各 plugin 的 plugin.json 版本字段、bumpp 执行选项。
[OUTPUT]: 供 bumpp 读取的统一版本升级配置，约束本仓库需要同步 bump 的文件集合与发布行为。
[POS]: 位于仓库根目录，作为 Kata 仓库版本升级流程的单一配置入口。

[PROTOCOL]:
1. 一旦本文件的 bump 目标文件、发布策略或执行方式变化，必须同步更新此 Header。
2. 更新后必须上浮检查 /README.md 与相关目录说明，确认根级版本流程描述依然准确。
*/

import { defineConfig } from 'bumpp'

export default defineConfig({
  files: [
    'package.json',
    'plugins/kata-code/plugin.json',
    'plugins/kata-design/plugin.json',
    'plugins/kata-governance/plugin.json',
    'plugins/kata-test/plugin.json',
  ],
  commit: 'chore: release v%s',
  tag: 'v%s',
  push: true,
})
