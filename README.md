<p align="center">
  <img src="images/logo.png" alt="dev-skills logo" width="280" />
</p>

# dev-skills

> 团队 git 工作流 skill 套件,覆盖 **需求对齐 → 实施方案 → 提交评审 → commit message** 整条链路。

灵感来自 [karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills) 和 [oh-my-claudecode](https://github.com/yeachan-heo/oh-my-claudecode)(访谈与共识机制),团队场景的轻量本地化。

---

## Skills

| Skill | 作用 | 触发 |
|---|---|---|
| [`dev-workflow`](./skills/dev-workflow/) | 入口推荐器:接需求 / 失败,扫 artifacts 推断当前 phase,**只输出下一步建议,不调起其他 skill** | 走完整流程 / 下一步该做什么 / 失败后恢复 |
| [`dev-spec`](./skills/dev-spec/) | 多 wave 渐进访谈 + 数学化清晰度评分,把模糊需求转成结构化 spec | 写代码前对齐需求 |
| [`dev-plan`](./skills/dev-plan/) | Planner → Architect → Critic 共识循环 + RALPLAN-DR,把 spec 转成 Critic-approved 实施 plan | 需求已对齐、写代码前 |
| [`dev-fix`](./skills/dev-fix/) | Hypothesis-driven 调试 + 修复:复现 → 假设 → 反向追溯 → 修 root cause → defense-in-depth → red→green→red 验证 + 强制 regression test + pattern analysis | 修 bug / 排查 / RCA |
| [`dev-commit-review`](./skills/dev-commit-review/) | 提交前 5 轴评审(规范/功能/闭环/注释/废码),P0/P1/P2 分级,READY 时附带 commit message + 自动 `Refs:` 追溯 artifact | 准备 commit |
| [`dev-commit-writer`](./skills/dev-commit-writer/) | 跟随仓库 git log 风格生成 commit message,意图歧义时输出多候选,自动 `Refs:` 追溯 artifact | 改动已过审、只要 message |

每个 skill 只做一件事,通过 `.claude/artifacts/` 松耦合,**不互相调用**。可单装可全装。

---

## 安装

**Claude Code(推荐)** — 在 Claude Code 里逐行执行:

```
/plugin marketplace add https://github.com/Jason-chen-coder/dev-skills
/plugin install dev-skills
```

**其他 agent CLI**(Cursor / Codex / Gemini 等):

```bash
npx skills add Jason-chen-coder/dev-skills              # 项目级
npx skills add Jason-chen-coder/dev-skills --global     # 全局
```

**装完别忘了 CLAUDE.md** —— skill 不会自动复制团队约定文件,在你项目根跑一次:

```bash
curl -O https://raw.githubusercontent.com/Jason-chen-coder/dev-skills/main/CLAUDE.md.template
mv CLAUDE.md.template CLAUDE.md   # 按 <!-- team:fill --> 标记填团队约定
```

按需安装 / 内网兜底 / 完整指引见 [`docs/onboarding.md`](./docs/onboarding.md)。

---

## 6 个 skill 的关系

```
                    dev-workflow(可选入口推荐器,不调起任何 skill)
                                  │
                ┌─────────────────┴─────────────────┐
            [新需求]                              [bug 报告]
                ▼  dev-spec                          ▼  dev-fix
                ▼  dev-plan(可选,complex 推荐)         (锁定 root cause 后,大改动可选过 dev-plan)
                ▼  写代码                              ▼  修代码 + regression test
                └────────────────┬─────────────────────┘
                                 ▼  二选一
                                 ├─ dev-commit-review   评审 + commit message
                                 └─ dev-commit-writer   只要 commit message
                                 ▼
                              git commit + push
```

**关键设计**:`dev-workflow` 是**纯建议器**,不调起任何 skill。所有其他 skill 的「不要主动调起其他 skill」Hard rule **100% 仍有效**,松耦合架构原则没有破坏。

**中间产物路径**(都在用户当前项目根的 `.claude/artifacts/` 下):

| Skill | Artifact |
|---|---|
| `dev-spec` | `.claude/artifacts/designs/<feature>.md` |
| `dev-plan` | `.claude/artifacts/plans/<feature>.md` |
| `dev-fix`  | `.claude/artifacts/fixes/<slug>.md` |
| `dev-workflow` / `dev-commit-review` / `dev-commit-writer` | 无 artifact(纯输出到 chat) |

**模式建议**:

- **复杂新功能**(跨多模块 / 鉴权 / 支付 / 数据迁移 / 公开 API)→ `dev-spec` + `dev-plan --deliberate`(自带 pre-mortem + expanded test plan)
- **间歇性 / 跨系统 / 生产事故 bug** → `dev-fix --deep`(强制 3-5 hypothesis + 反向 call-stack 追溯 + tagged instrument + defense-in-depth + pattern analysis + 完整 RCA)
- **一句话 hotfix** → 跳过 spec/plan,但 commit 前必须过 `dev-commit-review`
- **不知道该跑哪个 / 卡住 / 失败恢复** → `dev-workflow`(默认 / `--status` / `--next` / `--recover`)

**Commit ↔ artifact 自动追溯**:`dev-commit-writer` 和 `dev-commit-review`(READY verdict)会扫 `.claude/artifacts/`,在 commit message footer 自动加 `Refs: <type>/<slug>` 行(type ∈ {spec, plan, fix})。后续可用 `git log --grep="Refs:"` 检索 commit 与 artifact 的关联。

**Terminal 阻塞 status**:每个工作 skill 都有至少一个 terminal blocked status(spec → `STUCK`,plan → `BELOW_CONSENSUS_THRESHOLD`,fix → `BELOW_CONFIDENCE_THRESHOLD` / `NEEDS_DESIGN_CHANGE`),`dev-workflow --recover` 决策表完整覆盖各类阻塞的恢复路径。

---

## 配置 / 治理

| 文件 | 用途 |
|---|---|
| [`references/dev-baseline.md`](./references/dev-baseline.md) | 4 条行为准则:不假设 / 最小代码 / 外科手术式 / 可验证成功标准(贯穿所有 skill) |
| [`CLAUDE.md.template`](./CLAUDE.md.template) | 团队 always-on 约定模板,消费方复制到项目根改名为 `CLAUDE.md` |
| [`references/team-conventions.md`](./references/team-conventions.md) | 团队语言 / 工具偏好 |
| [`references/calibration-cases.md`](./references/calibration-cases.md) | 14 个季度 calibration 用例(commit-review × 6 / spec × 2 / plan × 2 / fix × 2 / workflow × 2),防判定漂移 |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | 怎么提议新 skill / 改 baseline,以及**不该做成 skill 的反向标准** |

**规范优先级**:项目 lint config > team-conventions > lang-conventions > dev-baseline
**行为优先级**:skill 局部 > CLAUDE.md > dev-baseline(详见 [CLAUDE.md.template §6](./CLAUDE.md.template))

---

## 设计原则

skill 准入分两类:

- **类型 A — 原子工作步骤 skill**(默认,绝大多数):4 标准 —— **一句话讲清触发** / **流程标准化(≥ 5 步)** / **每周用 ≥ 1 次** / **输出格式固定**。
- **类型 B — Orchestrator / Recommender skill**(特殊例外,目前只有 `dev-workflow`):**不调起其他 skill** / **不持久化 state** / **不产 artifact** / **不深读其他 skill 的 artifact 内容**(4 条硬约束),否则应改为 README 文档而非 skill。

反向标准(不该做成 skill):一次性 chore / 个人偏好 / 不在 git 工作流里 / 频次 < 每月 1 次 / lint 已自动化。两类的完整准入流程详见 [`CONTRIBUTING.md`](./CONTRIBUTING.md)。

---

## Status

**0.6.2** · 6 个 skill 全部已发布 · GitHub Actions CI 自动验证 frontmatter / baseline 同步 / manifest(详见 [`.github/workflows/validate.yml`](./.github/workflows/validate.yml))

---

[CHANGELOG](./CHANGELOG.md) · [Contributing](./CONTRIBUTING.md) · MIT License
