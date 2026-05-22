# Onboarding — dev-skills

新加入团队?这一页带你 30 分钟内跑起来。

---

## 60 秒了解这是什么

dev-skills 是团队的工程规范载体。它有三层:

- **行为基线**(`references/dev-baseline.md` + `docs/why-dev-baseline.md`):所有 skill 共享的四条原则,以及每条原则关闭的失败模式。
- **Always-on 模板**(`CLAUDE.md.template` / `AGENTS.md.template`):复制到消费项目根目录后,成为 agent 永远在背景读取的短规则。
- **场景 skill**(`dev-auto` / `dev-design-context` / `dev-spec` / `dev-plan` / `dev-tdd` / `dev-fix` / `dev-verify` / `dev-code-review` / `dev-commit-writer` / `dev-finish`):特定时机用 Claude / Codex 跑的检查工具。

不是替代你思考的工具,是**让你不用每次都重新想团队约定**的工具。

---

## 安装(5 分钟)

### Claude Code 用户

在 Claude Code 里逐行执行:

```bash
/plugin marketplace add https://github.com/Jason-chen-coder/dev-skills
/plugin install dev-skills
```

如果团队 fork 到了别的 owner,把 `Jason-chen-coder` 替换成实际 owner。

**别忘了 CLAUDE.md** —— skill 不会自动把团队级 always-on 文件复制到你项目根。第一次装完跑一次:

```bash
curl -O https://raw.githubusercontent.com/Jason-chen-coder/dev-skills/master/CLAUDE.md.template
mv CLAUDE.md.template CLAUDE.md   # 重命名后按 <!-- team:fill --> 填团队约定
```

`CLAUDE.md.template` 是短版常驻规则。更细的分支、PR、测试、错误处理、日志、feature flag 取舍参考见 [`docs/team-policy.md`](./team-policy.md)。

### Codex 用户

当前 Codex 兼容方式是复制 `skills/*` 到 `$CODEX_HOME/skills`:

```bash
git clone https://github.com/Jason-chen-coder/dev-skills.git
cd dev-skills
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"
cp -R skills/* "${CODEX_HOME:-$HOME/.codex}/skills/"
```

如果需要团队级 always-on 规则,复制 Codex 模板到项目根:

```bash
curl -O https://raw.githubusercontent.com/Jason-chen-coder/dev-skills/master/AGENTS.md.template
mv AGENTS.md.template AGENTS.md   # 重命名后按 <!-- team:fill --> 填团队约定
```

`AGENTS.md.template` 与 `CLAUDE.md.template` 保持同一套短规则,只是面向 Codex / OpenCode 的文件名。

### npx skills 用户

跨 agent CLI 安装方式:

```bash
npx skills add Jason-chen-coder/dev-skills              # 项目级
npx skills add Jason-chen-coder/dev-skills --global     # 全局
```

验证项目级安装:

```bash
ls .claude/skills/
# 应看到 dev-auto / dev-design-context / dev-spec / dev-plan / dev-tdd / dev-fix / dev-verify / dev-code-review / dev-commit-writer / dev-finish
```

### 其他 agent CLI(Cursor / Gemini CLI)

skill 是纯 Markdown,可以手动复制 SKILL.md 内容到对应工具的 system prompt 或 rules 区。具体路径问 leader。

---

## 第一次跑(15 分钟)

跑通一遍最常用的 `dev-code-review`:

1. 在任何项目里**故意做一个改动**(比如新增一个函数)。
2. 别 commit,先在 Claude Code / Codex 里说:

   > 准备 commit,review 一下

3. Claude 会调用 dev-code-review,产出一份结构化报告:

   ```
   ━━━ Dev Code Review ━━━
   Verdict   : ✅ READY  /  ⚠ FIX P1  /  ❌ BLOCK
   ...
   ```

4. **照报告改**(如果有 P0/P1)。
5. 改完再跑一次,直到 `✅ READY`,然后照报告里的 commit message commit。

**第一次完整跑下来你就懂了。**

---

## 十个 skill 怎么选

先记用户入口,再理解流程门禁。你不需要主动点名每个 skill。

### 用户入口

| 我想… | 用哪个 |
|---|---|
| 不知道下一步该跑哪个 / 失败了想恢复 | `dev-auto`(入口推荐器,只指路) |
| 写代码前对模糊需求做对齐 | `dev-spec` |
| 需求已对齐,要把 spec 转成 Critic-approved 的实施 plan(尤其复杂功能 / 高风险改动) | `dev-plan` |
| 修 bug:复现 + 假设 + 反向追溯 + 修 root cause + defense-in-depth + regression test + pattern analysis | `dev-fix` |
| 写完代码,commit 前要严格把关 | `dev-code-review` |

### 流程门禁和特殊入口

| 类型 | Skill | 什么时候出现 |
|---|---|---|
| 流程门禁 | `dev-tdd` | feature / hotfix / refactor 写生产代码前,由 agent 提醒走红绿重构。 |
| 流程门禁 | `dev-verify` | 声称完成 / fixed / ready 前,由 agent 要求 fresh evidence。 |
| 流程门禁 | `dev-finish` | 验证和 review 通过后,用于 merge / PR / keep / discard。 |
| 一次性设置 | `dev-design-context` | UI / landing page / 产品界面首次进入项目前,让 agent 先理解设计方向。 |
| 显式旁路 | `dev-commit-writer` | 只有改动很简单 / 已自审过,并且明确只想要 commit message 时使用。 |

`dev-code-review` 和 `dev-commit-writer` 是**二选一**,不要都跑。
`dev-design-context` 是设计类工作的**一次性前置步骤**,会写 `.design-context.md`;普通后端任务可以跳过。
`dev-spec → dev-plan` 是松耦合衔接 —— spec 写完后用户决定要不要进 plan,简单功能可直接进编码,不强制。
`dev-fix` 与 `dev-spec` 是**平行入口** —— 新需求走 dev-spec,bug 报告走 dev-fix。feature / hotfix / refactor 的直接编码路径用 `dev-tdd`;bug 路径由 `dev-fix` 内置 failing test + red→green→red,之后在 `dev-verify → dev-code-review` 合流。
`dev-auto` 是**可选入口推荐器**,不调起任何 skill,只读 `.claude/artifacts/` 推断当前 phase 并建议下一步。也支持 `--status` / `--next` / `--recover`。

---

## 必读文档(按顺序看,~25 分钟)

1. [`README.md`](../README.md) —— 整体结构 5 分钟。
2. [`references/dev-baseline.md`](../references/dev-baseline.md) —— 四条基线原则 5 分钟。
3. [`docs/why-dev-baseline.md`](./why-dev-baseline.md) —— 每条原则背后的失败模式 5 分钟。
4. [`CLAUDE.md.template`](../CLAUDE.md.template) 或 [`AGENTS.md.template`](../AGENTS.md.template) —— 短版 always-on 规则 5 分钟(注意:需复制到项目根并改名才生效)。
5. 你日常会用的 skill 的 SKILL.md(选你感兴趣的一个先读) —— 5 分钟。

后续按需查阅:
- `docs/team-policy.md` —— 分支 / PR / 测试 / 错误处理 / 日志等详细团队治理参考。
- `references/team-conventions.md` —— 写到具体语言时查。
- `skills/dev-code-review/references/lang-conventions.md` —— 跨语言通用规范(dev-code-review 专属)。
- `references/calibration-cases.md` —— 想理解 P0 / P1 / P2 边界 / dev-spec ambiguity 评分 / dev-plan Critic verdict 边界时看。

---

## 常见 pitfall(踩坑预警)

**「Claude 报了一堆 P2,我都要修吗?」**
不。P2 是可选的,**你可以选择不修但要在 PR 里一句话解释**(例如「P2 注释问题暂不处理,本 commit 仅修 bug」)。P0 / P1 必须处理。

**「Claude 说 `❌ BLOCK` 但我觉得没问题」**
两步走:(1) 确认你不是漏看了 baseline / `CLAUDE.md` / `AGENTS.md` 的某条硬规则(尤其 secret / 闭环);(2) 如果你确信 skill 判错了,在 PR 里覆盖判定 + 解释,然后开 issue 反馈这个 case。

**「skill 没识别出我用的语言怎么办?」**
`skills/dev-code-review/references/lang-conventions.md` 里有「其他语言」段落兜底。如果你常用某语言但 conventions 不全,提 PR 补。

**「我的改动跨了 5 个文件,review 报告太长」**
拆 commit。如果一个 commit 跨太多文件,基本说明 scope creep —— 这本身就是 dev-code-review 想拦的。

**「我上传到团队仓库的 skill 设置,别人看不到」**
确认你 commit 的是 skill 仓库本身,而不是消费 skill 的项目。skill 安装路径在 `~/.claude/skills/`,**不**进版本控制。

---

## 出问题找谁

| 问题类型 | 找谁 |
|---|---|
| 安装 / 工具相关 | 团队群提问 |
| 规则有 bug / 误判 | 开 issue |
| 想加新 skill | 先看 [`CONTRIBUTING.md`](../CONTRIBUTING.md),然后开 issue |
| 紧急(线上事故牵涉到 skill 输出) | 直接联系 leader,事后再走流程 |

---

## 第一周建议

- 至少跑 3 次 `dev-code-review`,熟悉报告格式。
- 至少跑 1 次 `dev-spec`,体验 Step 1 的歧义清单(很多人这一步会「啊原来我没想清楚」)。
- 把 [`references/calibration-cases.md`](../references/calibration-cases.md) 的 case 自己跑一遍,对照 canonical answer,**这是最快内化 baseline 的方式**。

---

> 卡住超过 30 分钟一定要问。规范是为了减少摩擦,不是制造摩擦。
