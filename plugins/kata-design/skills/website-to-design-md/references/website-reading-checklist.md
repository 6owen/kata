<!--
[INPUT]: 网站设计抽取前的检查项、观察维度与浏览器评估片段。
[OUTPUT]: 面向 AI 代理的网站阅读检查清单。
[POS]: 位于 `/plugins/kata-design/skills/website-to-design-md/references`，作为网站深读参考文档。

[PROTOCOL]:
1. 一旦本文件被更新，务必同步更新 Header 与所属目录 `.folder.md`。
2. 若检查维度、证据标准或示例代码变化，需同步更新上层 SKILL.md 与 references 目录说明。
-->

# 网站阅读检查清单

当一个网站在编写 `DESIGN.md` 前需要更深入的检查时，使用这份清单。

## 1. 浏览器优先准备

- 在浏览器自动化工具中打开实时页面。
- 优先使用 `agent-browser eval` 或宿主环境原生支持的等价 page-eval 流程。
- 至少检查 desktop 与 mobile 两个视口。
- 先从上到下滚动一遍，不做记录，只建立对页面节奏的整体认识。
- 再慢速滚动第二遍，同时收集证据。
- 在第二遍中，从浏览器里提取 rendered HTML、关键节点 `outerHTML`、computed styles、CSS variables、可读 stylesheet rules 与运行时状态差异。
- 当 page evaluation 可用时，不要把截图当作主证据来源。
- 只有在用户明确要求，或 DOM 证据确实不足时，才把截图作为最后的交叉校验。

### 推荐的 Eval 顺序

当浏览器工具支持 JS evaluation 时，按这个顺序执行：

1. open page
2. wait for load and hydration
3. scroll once to trigger lazy and sticky states
4. extract root CSS variables
5. extract readable stylesheet rules
6. extract representative rendered HTML
7. extract computed styles for key elements
8. extract visible text and CTA content
9. extract hover, sticky, or expanded state changes through DOM or style diffs

## 2. 页面拓扑

按从上到下的顺序记录页面结构：

- global header or announcement layer
- hero 区块
- feature sections
- social proof
- pricing 或 plans
- FAQ
- footer

标出哪些部分是 sticky、overlayed 或会响应滚动。

## 3. 需要提取的 Design Tokens

重点记录可重复的系统，而不是一次性的孤立异常：

- 主色与次级色
- surface colors
- border colors
- text colors
- accent colors
- font families
- type scale
- radius scale
- spacing rhythm
- shadow styles
- background motifs
- focus ring treatment
- hover-state color deltas
- 边框到底是真实 border、ring，还是基于 shadow 的 outline
- 系统是否采用一致的 radius 阶梯，例如 `6px`、`8px`、`12px`、`9999px`
- 字体是否使用有辨识度的 tracking、ligatures、uppercase 或 monospace 搭配
- 网站是否在 `:root` 或 `body` 上暴露了可复用的 CSS variables 或 token naming patterns

## 4. 需要检查的组件

至少检查以下组件：

- nav items
- CTA buttons
- cards
- badges
- inputs
- tabs
- accordions
- footer links

对每个组件，记录：

- 默认外观
- 关键状态
- 内容密度
- 图标处理方式
- 动效或过渡的整体感觉
- 在可行时记录精确 padding
- 当 radius 与 shadow 属于签名特征时，记录其具体公式
- 组件更偏 structural、decorative 还是 utility-focused
- 记录有代表性的 rendered HTML，避免只靠视觉推断组件结构

## 5. 交互扫描

检查以下三类行为：

- scroll-driven
- hover-driven
- click-driven

重点观察：

- sticky headers
- reveal-on-scroll blocks
- tab switches
- accordion expansion
- animated counters
- carousel timing
- hover elevation
- 下划线或颜色过渡

## 6. 响应式扫描

在条件允许时，至少检查几个有代表性的宽度：

- desktop 约 `1440px`
- tablet 约 `768px`
- mobile 约 `390px`

记录：

- 由 breakpoint 驱动的堆叠变化
- typography compression
- nav behavior changes
- button sizing changes
- 哪些内容被隐藏，哪些内容被保留
- spacing 是按比例缩小，还是会被更激进地重组
- pills 与 cards 在更小尺寸下是否保持相同 radius

## 7. 内容与语气

提取内容呈现风格：

- headline length
- verb choice
- CTA tone
- sentence cadence
- copy 是偏稀疏还是偏密集
- brand voice 更偏 premium、playful、technical、calm、urgent 还是 editorial

## 8. 证据记录

明确区分哪些是观察所得，哪些是推断所得。

示例：

- Observed: "Primary CTA buttons use a saturated emerald fill on very dark backgrounds."
- Inferred: "The product prefers one strong accent color per section rather than multi-accent clustering."

对于有代表性的签名细节，尽量记录实际可落地的实现级数值：

- headline 层级上的 line height 与 tracking
- buttons、cards、images、badges 的 border radius
- 多层 box-shadow 叠加
- border 与 shadow-as-border 的处理差异
- focus ring 的颜色与厚度
- 反复出现的 spacing 数值
- root CSS variables 与可复用 token 名称
- 关键节点的 `outerHTML` 与代表性模块可访问的 stylesheet rules

## 9. 信息充分性检查

在开始写最终 `DESIGN.md` 前，先问自己：

- 我能否用设计哲学层面的语言描述这个网站，而不只是罗列 tokens？
- 我是否已经掌握足够信息，能写出完整的 hierarchy table，而不只是“large / medium / small”？
- 我是否清楚 cards 和 buttons 实际是如何构建出来的？
- 我是否能给另一个 agent 3 条足够具体的 build prompt，复现这套系统？

如果这些问题还答不上来，就先回到页面继续检查，再开始写。

## 10. 实用浏览器代码片段

仅在你的浏览器工具支持在页面上执行 JavaScript 时使用这些片段。

### Root CSS variables

```js
Object.fromEntries(
  [...getComputedStyle(document.documentElement)]
    .filter((name) => name.startsWith("--"))
    .map((name) => [name, getComputedStyle(document.documentElement).getPropertyValue(name).trim()])
)
```

### Readable stylesheet rules

```js
[...document.styleSheets].map((sheet) => {
  try {
    return {
      href: sheet.href,
      rules: [...sheet.cssRules].slice(0, 40).map((rule) => rule.cssText)
    };
  } catch {
    return {
      href: sheet.href,
      inaccessible: true
    };
  }
})
```

### Representative component HTML

```js
[...document.querySelectorAll("header, h1, button, a, section, article")]
  .slice(0, 20)
  .map((el) => el.outerHTML.slice(0, 1000))
```

### Unique font families

```js
[...new Set(
  [...document.querySelectorAll("body, body *")]
    .slice(0, 250)
    .map((el) => getComputedStyle(el).fontFamily)
    .filter(Boolean)
)].sort()
```

### Visible color sample

```js
[...new Set(
  [...document.querySelectorAll("body, body *")]
    .slice(0, 250)
    .flatMap((el) => {
      const style = getComputedStyle(el);
      return [style.color, style.backgroundColor, style.borderColor];
    })
    .filter((value) => value && value !== "rgba(0, 0, 0, 0)" && value !== "transparent")
)].sort()
```

### Images and background images

```js
JSON.stringify({
  images: [...document.querySelectorAll("img")].map((img) => img.currentSrc || img.src).filter(Boolean),
  backgrounds: [...document.querySelectorAll("body *")]
    .map((el) => getComputedStyle(el).backgroundImage)
    .filter((bg) => bg && bg !== "none")
}, null, 2)
```
