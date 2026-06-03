# Team Policy Guide

`CLAUDE.md.template` / `AGENTS.md.template` 只放 agent 必须常驻读取的短规则。本文件保存更完整的团队治理说明,供 leader 填规则、评审 PR、培训新人时参考。

使用方式:

- 项目根的 `CLAUDE.md` / `AGENTS.md` 保持短,只写硬规则和本项目真实命令。
- 详细解释、取舍参考、团队流程可以放到消费项目自己的 `docs/team-policy.md`、wiki 或本文件的 fork。
- 如果某条规则不是“违反就会让 PR 退回”,不要放进 always-on 文件。

---

## Workflow 约定

### SDD artifact contract

- 复杂或中等复杂度 feature 默认把 `.claude/artifacts/designs/<slug>.md` 当作 intent contract,后续 plan / implementation / verify / review 都要对齐它。
- 高风险或跨模块改动把 `.claude/artifacts/plans/<slug>.md` 当作 implementation contract;如果实现偏离 ADR,先更新 plan 或在 review 里显式说明 drift。
- bug 路径把 `.claude/artifacts/fixes/<slug>.md` 当作 failure contract;它记录 symptom、root cause、regression test 和 verification evidence。
- artifact 不是形式文档。它们存在时,`dev-verify` 和 `dev-code-review` 应对照检查;发现过期就报告 drift,不要静默忽略。

### 设计前置

- 复杂改动(跨 ≥ 3 模块 / 鉴权 / 支付 / 数据迁移 / 公开 API breakage / PII 处理)先过 `dev-grill-docs` 和 `dev-plan --deliberate`。
- 常规单模块改动建议先过 `dev-grill-docs`,plan 可省略。旧提示里的 `dev-spec` 等价于 `dev-grill-docs --spec-only`。
- 一句话改动 / hotfix 可以跳过 spec 和 plan,但行为改动仍建议走 `dev-tdd`,commit 前过 `dev-verify` + `dev-code-review`。

### 编码 / 完成门禁

- feature / refactor / direct hotfix 写生产代码前默认走 `dev-tdd`。
- bug 报告走 `dev-fix`;它内置 failing regression test、root-cause fix 和 red→green→red。
- 任何“完成 / fixed / ready / 可以 commit”声明前必须有 fresh verification evidence。
- 分支实现完成且验证、review 通过后,用 `dev-finish` 处理 merge / PR / keep / discard。

### Bug 路径

- 生产事故 / 间歇性 / 跨系统 bug 走 `dev-fix --deep`。
- 常规 bug 走 `dev-fix --default`。
- 简单 off-by-one / typo 可走 `dev-fix --quick`。
- bug 修复必须留下 regression test;没有可执行测试入口时,要在输出里解释替代验证。

### Clean-tree worktree checkpoint

- 第一次写文件前,如果 `git status --short` 为空,且任务预计会修改代码 / 多文件规则 / 配置 / 测试,建议创建独立 worktree。
- 可跳过的场景:纯 typo / 单文件小文档 / 用户明确说直接在当前目录改 / 当前已经在专用 worktree 或任务分支内。
- 当前分支是 `main` / `master` / `release/*` 时,默认推荐 worktree。
- 当前 working tree 已经 dirty 时,不要从脏目录直接建 worktree;先说明已有改动,避免混入用户改动。

推荐命令:

```bash
git worktree add -b codex/<short-slug> ../<repo>-<short-slug>
```

命名约定:

- 分支:`codex/<short-slug>` for AI work,或团队定义的 `<type>/<short-desc>`。
- 目录:`../<repo>-<short-slug>`,lowercase kebab-case,不加空格。
- 清理:`git worktree remove ../<repo>-<short-slug>`;若分支废弃,再删对应分支。

### 中间产物路径

消费项目根目录下:

- `.claude/artifacts/designs/<slug>.md` — `dev-grill-docs` / `dev-spec` 兼容入口
- `.claude/artifacts/plans/<slug>.md` — `dev-plan`
- `.claude/artifacts/fixes/<slug>.md` — `dev-fix`
- `dev-design-context` 默认写 `.design-context.md`
- `dev-tdd` / `dev-verify` / `dev-code-review` / `dev-commit-writer` / `dev-finish` 默认只输出到 chat

这些 artifact 是否提交进仓库由团队决定;如果不提交,加入 `.gitignore`。

---

## 分支 / Commit / PR

### 分支

- 默认分支:`main`(或 `master`)。
- 功能分支:`<type>/<short-desc>`,例如 `feat/user-export`、`fix/cart-overflow`。
- AI 默认分支前缀:`codex/`。
- 长期分支只保留 `main`、`release/*`;其他都是 short-lived。

### Commit

- 单 commit 单一意图。
- 风格跟随 `git log --oneline -20`;无明显风格时退回 conventional commits。
- subject ≤ 72 chars,祈使语气,不加句号。
- 如果 commit 对应 dev-skills artifact,优先加 `Refs: <type>/<slug>` footer。

### PR

PR 至少包含:

- 背景 / 问题
- 改动摘要
- 测试说明
- 关联 issue 或 artifact
- 风险 / blast radius

建议门槛:

- 任何修改业务逻辑的 PR 必须有单测;仅文档 / 配置 / 重命名可豁免。
- PR 新增/删除 < 500 行为佳;超过先沟通拆分。
- Reviewer ≥ 1 人 approval;核心模块(鉴权、支付、PII、迁移)≥ 2 人。
- 不允许 self-merge,除非 hotfix 流程明确允许。

---

## 测试策略

建议默认:

- 新增公共 API 至少覆盖 1 个 happy path + 1 个边界 case。
- Critical path(鉴权 / 支付 / 数据迁移 / 权限)应有单测和集成测试。
- E2E 不一定每次 push 都跑;可限制在 release branch 或改动核心模块时跑。

取舍参考:

- 全局覆盖率 60-70% 是常见起点;< 50% 通常意味着 P0 bug 漏网风险高。
- > 90% 全局覆盖率容易诱导凑数测试;“关键路径 100% + 全局 70%”通常更实用。
- 慢而 flaky 的 E2E 应少跑但跑在关键节点,不要用它替代单测。

---

## Code Patterns

### 错误处理

团队要选一种主风格,不要在同一边界混用:

- **异常风格**:开发快、stack trace 直观,但容易漏 catch。
- **Result type**:错误传播显式、类型安全,但 boilerplate 多。
- **混合**:boundary 强制 Result 或 typed error,内部允许 throw;中大型 JS/Python 项目常用。

建议在项目规则里写清:

- 对外 API 返回什么 error shape。
- 是否透传内部 stack。
- 哪些错误可重试,哪些必须 fail fast。

### 日志

- 统一 logger,例如 `pino` / `structlog` / `slog` / 项目 wrapper。
- 禁止 `console.log` / `print` / `fmt.Println` / `debugPrint` 进入主分支。
- 日志不要包含 secret、token、PII、完整请求体。
- partial failure 必须可观测,不能只吞掉错误。

### 配置 / Feature Flag

选项取舍:

- **LaunchDarkly / Optimizely**:rollout / segment / experiment 能力强,但有成本和 vendor lock-in。
- **自研 config-service**:控制力强,但初期成本高。
- **env vars + 重启**:简单低成本,但不适合实时切流。

新功能是否默认 feature flag,由团队按风险决定。涉及支付、鉴权、PII 或大流量路径时,建议默认 flag。

### 命名

- 跟随同文件 / 同模块邻居。
- 禁止单字母变量,`i / j / k` 在短 loop 内例外。
- 核心实体命名必须稳定;同一概念不要在 request、model、event、UI 中换多个名字。

---

## Forbidden Patterns

这些是常见可直接拦的反模式:

- 在 render / build 路径里做副作用(网络请求、状态修改、日志写入)。
- 在循环里串行 `await`,但每次迭代没有依赖关系。
- `JSON.parse` / 用户输入解析没有错误处理。
- 用魔法字符串作为 ID / 状态枚举,且没有集中常量。
- 静默吞错:`catch {}`、`except: pass`、`_ = err`。
- 新增 public symbol 但没有 caller / route / export / test 证明闭环。
- 新增依赖只为解决标准库或现有 helper 已经能解决的问题。

---

## AI 协作护栏

- LLM 生成的代码进入 PR 前,作者要能解释每一行。
- 不接受不能解释的 API / 库 / 模式;先查清楚再合。
- PR 描述里标注 LLM 协作程度,例如 `[AI-assisted]`。
- 大段 LLM 生成代码必须有测试。
- 如果 agent 输出和项目规则冲突,不要沉默接受;以项目规则为准并反馈 skill / prompt gap。

---

## 维护规则

- `CLAUDE.md` / `AGENTS.md` 只放短硬规则。
- 详细解释放本文档或团队 wiki。
- 新增规则前回答:“违反这条时,我会让 PR 退回吗?” 如果不会,就别加。
- 规则变更走 PR,并在 `CHANGELOG.md` 记录。
