# dev-skills H5 正式站点设计

> Status: APPROVED FOR PLANNING
> Date: 2026-05-15
> Scope: 静态 H5 正式站点 + GitHub Pages 发布设计

## 背景

`dev-skills` 当前主要通过 README 展示能力、安装方式和工作流。README 对已有开发者足够直接,但对首次访问用户来说,安装路径、6 个 skill 的关系、Claude Code 与 Codex 的差异需要更清晰的入口。

本设计新增一个对外 H5 介绍页。页面用于正式站点发布,不做分支或 PR preview。

## 目标

- 让新用户在首屏理解 `dev-skills` 的价值:6 个 AI 开发 skill 串起需求、方案、修复、review、提交信息。
- 明确区分 Claude Code、Codex、`npx skills` 三种安装 / 升级方式。
- 用可视化工作流解释什么时候使用哪个 skill。
- 用运行预览展示“用户如何在 Codex CLI 里触发 skill,以及 Codex 会输出什么”。
- 给出质量信号:metadata 校验、baseline 同步、manifest 校验、GitHub Pages 自动发布。
- 保持实现简单、稳定、可维护。

## 非目标

- 不做 PR / branch preview 链接。
- 不做多页面文档站。
- 不引入重型前端框架或运行时依赖。
- 不替代 README 和 `docs/onboarding.md`;H5 只做对外入口和路径导览。

## 选择的方向

采用 **单页产品落地页 + 可信产品页视觉风格 + GitHub Pages 正式站点**。

已比较过的方向:

- 产品落地页:首屏讲价值和安装,中段讲 skill / workflow。最终选择。
- 工作流说明页:更适合已知用户,但首屏转化弱。
- 文档门户:信息完整,但维护成本高,不适合当前阶段。

视觉风格采用可信产品页:

- 白底、克制色彩、清晰命令块。
- 技术感来自信息结构、代码块和工作流,不是大面积暗色终端风。
- 不做重营销视觉,避免削弱安装命令和工作流可读性。

## 页面结构

### 1. Hero

首屏内容:

- 标题:围绕“6 个 AI 开发 skill”和“可验证工作流”。
- 副标题:说明从需求对齐到 commit review 的完整路径。
- CTA:
  - Install for Claude Code
  - Install for Codex
  - View on GitHub

首屏应展示一部分下一段内容,避免页面像单屏海报。

### 2. Skill Library

展示 6 个 skill 卡片:

- `dev-workflow`:入口推荐器,只指路。
- `dev-spec`:模糊需求到结构化 spec。
- `dev-plan`:spec 到 Critic-approved 实施 plan。
- `dev-fix`:root-cause-driven bug 修复。
- `dev-code-review`:提交前 5 轴评审。
- `dev-commit-writer`:已过审时生成 commit message。

每张卡包含:

- 一句话职责。
- 典型触发场景。
- 是否产出 `.claude/artifacts/` 文件。

### 3. Skill Runtime Preview

新增一个多 tab 运行预览 section,用于展示每个 skill 的实际使用方式。

结构:

- 顶部 tabs:6 个 skill 各一个 tab。
- 左侧:模拟 Codex CLI 终端输入。
- 右侧:用户提交后 Codex CLI 的代表性输出。

左侧终端要求:

- 展示命令上下文,例如仓库路径、`codex` prompt、用户输入。
- 用户输入包含“使用 skill + 用户实际会说的话”的组合。
- 输入文本使用打字机效果,让用户理解这是交互输入场景。
- 光标闪烁只作为轻量提示,不能干扰阅读。

右侧输出要求:

- 展示该 skill 的代表性结果,不是完整长报告。
- 输出必须压缩到适合官网阅读的摘要形态。
- 明确体现每个 skill 的差异:
  - `dev-workflow`:推荐下一步和命令。
  - `dev-spec`:先列歧义问题,再产出 spec。
  - `dev-plan`:输出方案、风险、ADR 摘要。
  - `dev-fix`:展示 reproduce -> root cause -> verification。
  - `dev-code-review`:展示 READY / FIX P1 / BLOCK 结构。
  - `dev-commit-writer`:展示最终 commit message。

示例内容:

```text
左侧:
$ codex
> 用 dev-code-review 帮我看下这次修改,准备 commit

右侧:
━━━ Dev Code Review ━━━
Verdict   : ✅ READY
Scope     : 3 files · +84 / −12
Axis Check
  规范   ✓
  功能   ✓
  闭环   ✓
Commit
  docs: update install flow
```

交互行为:

- 切换 tab 时,左侧输入重新播放打字机效果。
- 右侧输出在输入完成后出现;如果实现复杂,也可以在 tab 切换后直接显示右侧输出。
- 不自动轮播,避免用户阅读时内容变化。
- 动画必须尊重 `prefers-reduced-motion`;用户偏好减少动画时直接显示完整文本。

视觉要求:

- 左侧终端为深色代码窗口,但 section 整体仍保持可信产品页的白底风格。
- 右侧输出使用浅色面板,像 Codex 输出摘要或报告卡片。
- 桌面端左右并排;移动端上下堆叠,tab 横向滚动。
- 不使用截图作为主要内容;终端和输出面板用 HTML/CSS 构建,保证文本可复制和可访问。

### 4. Workflow

展示两条路径:

- Feature path:`dev-spec -> dev-plan -> code -> dev-code-review -> commit`
- Bug path:`dev-fix -> code/fix -> dev-code-review -> commit`

同时说明:

- `dev-workflow` 是推荐器,不调用其他 skill。
- `dev-code-review` 是 commit 前默认安全路径。
- `dev-commit-writer` 只用于用户明确跳过 review 且只要 commit message 的场景。

### 5. Install / Upgrade

使用分段控件或 tabs 区分:

- Claude Code
- Codex
- `npx skills`

每个 tab 包含:

- 安装命令。
- 升级命令。
- 团队模板同步提醒。

Codex 区域必须明确:

- 当前兼容方式是复制 `skills/*` 到 `$CODEX_HOME/skills`。
- 团队规则模板使用 `AGENTS.md.template`。

Claude Code 区域必须明确:

- 使用 `.claude-plugin/` manifest。
- 安装命令为 `/plugin marketplace add` 和 `/plugin install`。
- 团队规则模板使用 `CLAUDE.md.template`。

### 6. Quality Proof

展示当前仓库校验能力:

- `SKILL.md` frontmatter 必填字段。
- Codex `description <= 1024`。
- 每个 skill 有 `Trigger routing` 段。
- baseline 副本 md5 同步。
- `.claude-plugin` manifest JSON 可解析。
- GitHub Actions 发布 GitHub Pages。

### 7. FAQ

首版 FAQ 覆盖:

- Claude Code 和 Codex 安装方式为什么不一样?
- 升级 skill 会不会覆盖 `CLAUDE.md` / `AGENTS.md`?
- 什么时候用 `dev-workflow`?
- 准备 commit 时为什么默认走 `dev-code-review`?

## 技术设计

### 文件布局

建议新增:

```text
site/
  index.html
  styles.css
  app.js
```

说明:

- `index.html`:页面结构和内容。
- `styles.css`:可信产品页风格、响应式布局、tabs、命令块。
- `app.js`:安装方式 tab 切换、skill preview tab 切换、打字机效果、复制命令按钮。

不使用构建工具时,GitHub Pages workflow 直接上传 `site/`。

Skill Runtime Preview 的数据建议集中在 `app.js` 的常量中,避免 HTML 中重复大段输出:

```js
const skillPreviews = {
  "dev-code-review": {
    prompt: "用 dev-code-review 帮我看下这次修改,准备 commit",
    output: "..."
  }
}
```

如果后续内容变多,再拆成 `site/previews.js`;首版不需要额外 JSON fetch。

### GitHub Actions

新增独立 workflow:

```text
.github/workflows/deploy-pages.yml
```

触发:

- `push` 到 `master`
- 可选 `workflow_dispatch`

行为:

- checkout 仓库。
- 上传 `site/` 作为 Pages artifact。
- deploy 到 GitHub Pages。

不生成分支 preview。

### README 入口

README 顶部或安装区域增加正式站点链接:

```text
Website: https://jason-chen-coder.github.io/dev-skills/
```

如果 Pages 地址未开启,先在 README 写“Site”链接占位会误导用户;实现时应等 workflow 可用后再加入稳定链接。

## 交互设计

- 安装 tabs 默认选 Claude Code。
- Skill Runtime Preview tabs 默认选 `dev-workflow`,因为它是入口推荐器。
- Codex tab 明确展示 `$CODEX_HOME` fallback。
- 命令块提供复制按钮。
- 移动端 tabs 可横向滚动或堆叠为 segmented controls。
- CTA 不跳到外部未知页面;GitHub CTA 指向仓库。

## 响应式设计

- 桌面端:Hero 左侧价值说明,右侧命令/工作流预览。
- 平板端:Hero 上下堆叠,skill 卡片 2 列。
- Skill Runtime Preview 桌面端左右并排;移动端上下堆叠。
- 手机端:单列布局,命令块和终端输出可横向滚动,按钮不换行溢出。

## 可访问性

- 所有按钮使用真实 `<button>` 或 `<a>`。
- 复制按钮有 `aria-label`。
- tabs 使用可键盘操作的按钮组。
- 颜色对比不依赖单一色相表达状态。
- 图片需要 alt 文本;若使用现有 logo / 流程图,必须提供描述性 alt。
- 打字机动画尊重 `prefers-reduced-motion`。
- 终端预览和输出预览必须是真实文本,不能只用图片。

## 测试和验收

本功能完成后需要验证:

- 本地打开 `site/index.html` 可正常展示。
- GitHub Actions workflow YAML 可解析。
- `master` push 后 GitHub Pages 发布成功。
- 页面在桌面和手机宽度下无明显溢出。
- Skill Runtime Preview 的 6 个 tab 都可切换。
- 打字机效果在默认动效下可播放,在 `prefers-reduced-motion` 下直接显示完整输入。
- Claude Code / Codex / `npx skills` 安装命令和 README 保持一致。
- 复制按钮可用;禁用 JS 时页面仍可阅读命令。

## 风险

- GitHub Pages 仓库设置未开启时,workflow 可能失败。实现时需要在 README 或 PR 说明中提示开启 Pages。
- 安装命令未来变化时,H5、README、`docs/onboarding.md` 可能产生漂移。应在 CI 或后续维护中尽量减少重复文本。
- 若后续补 `.codex-plugin/`,Codex 安装 tab 需要更新。
- Skill Runtime Preview 如果输出写得过长,会变成文档墙。首版每个输出控制在 8-14 行,突出代表性结构。
- 打字机效果如果过强会降低效率。默认只播放左侧用户输入,右侧输出保持稳定可读。

## 待实现清单

- 新增 `site/` 静态页面。
- 新增 Skill Runtime Preview section,覆盖 6 个 skill tab。
- 新增 GitHub Pages deploy workflow。
- 更新 README 站点入口。
- 本地和 Actions 双向验证。
