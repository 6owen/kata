<!--
[INPUT]: `agent-browser` 的检测、安装与降级边界说明。
[OUTPUT]: 面向 AI 代理的浏览器工具准备指南。
[POS]: 位于 `/plugins/kata-design/skills/website-to-design-md/references`，作为 `agent-browser` 引导参考文档。

[PROTOCOL]:
1. 一旦本文件被更新，务必同步更新 Header 与所属目录 `.folder.md`。
2. 若工具检测命令、安装流程或降级策略变化，需同步更新上层 SKILL.md 与 references 目录说明。
-->

# 浏览器工具引导

当 `website-to-design-md` 运行在一个可能尚未完成 `agent-browser` 配置的环境中时，使用这份指南。

## 目标

在开始分析网站之前，先确认 `agent-browser` 可用。

如果暂时不可用，默认动作是帮助安装 `agent-browser`，或将其暴露到 `PATH` 中。

## 推荐检测流程

先运行随 skill 附带的检测脚本：

```bash
node /path/to/website-to-design-md/scripts/check-browser-tooling.mjs /target/workspace
```

如果无法运行脚本，就手动执行同一组检测：

```bash
node -v
npm -v
which agent-browser
agent-browser --help
```

## 默认安装流程

当 `agent-browser` 不可用时：

1. 安装 `agent-browser`，或把它暴露到 `PATH`。
2. 验证命令可调用：

```bash
agent-browser --help
```

3. 验证所需工作流可用：

```bash
agent-browser eval 'document.title'
```

如果第 3 步是因为还没有打开浏览器会话而失败，这是可以接受的。关键要求是命令本身存在，并且能够运行。

## 决策规则

- 始终优先使用 `agent-browser`。
- 除非用户明确要求降级方案，否则不要切换到 Playwright 或 Chrome CLI。
- 保持提取流程一致：`agent-browser open`、`agent-browser wait`、`agent-browser eval`。

## 应如何告知用户

用一行简短说明让用户知道当前进度：

- 正在检查 `agent-browser` 是否已经存在
- 如果不存在，正在安装或暴露 `agent-browser`
- 这一步是为了后续能借助 `agent-browser eval` 准确检查实时渲染后的网站

## 常见失败场景

### 缺少 `agent-browser`

安装它，或把它暴露到 `PATH`。不要静默切换浏览器栈。

### 网络或 registry 访问受阻

使用正确的权限或网络访问方式重试。不要在第一次网络相关失败后就停止。

### 命令存在但无法正常启动

这通常是运行时权限或 sandbox 问题，而不是安装问题。用真实命令做一次 smoke check，必要时再升级处理。

### 用户拒绝安装

明确告知用户：这个 skill 默认设计为运行在 `agent-browser` 上；除非用户明确批准其他 fallback，否则这里应停止。
