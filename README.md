# dev-skills

> 团队 git 工作流 skill 套件,覆盖 **需求对齐 → 实施方案 → 提交评审 → commit message** 整条链路。

灵感来自 [karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills) 和 [oh-my-claudecode](https://github.com/yeachan-heo/oh-my-claudecode)(访谈与共识机制),团队场景的轻量本地化。

---

## Skills

| Skill | 作用 | 触发 |
|---|---|---|
| [`dev-spec`](./skills/dev-spec/) | 多 wave 渐进访谈 + 数学化清晰度评分,把模糊需求转成结构化 spec | 写代码前对齐需求 |
| [`dev-plan`](./skills/dev-plan/) | Planner → Architect → Critic 共识循环 + RALPLAN-DR,把 spec 转成 Critic-approved 实施 plan | 需求已对齐、写代码前 |
| [`dev-commit-review`](./skills/dev-commit-review/) | 提交前 5 轴评审(规范/功能/闭环/注释/废码),P0/P1/P2 分级,READY 时附带 commit message | 准备 commit |
| [`dev-commit-writer`](./skills/dev-commit-writer/) | 跟随仓库 git log 风格生成 commit message,意图歧义时输出多候选 | 改动已过审、只要 message |

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

## 工作流

```
[模糊需求]
    ▼  dev-spec        → .claude/artifacts/designs/<feature>.md
    ▼  dev-plan(可选,复杂功能推荐)→ .claude/artifacts/plans/<feature>.md
    ▼  写代码
    ▼  二选一:
       ├─ dev-commit-review   评审 + commit message
       └─ dev-commit-writer   只要 commit message
    ▼  git commit + push
```

**复杂改动**(跨多模块 / 鉴权 / 支付 / 数据迁移 / 公开 API)建议 `dev-spec` + `dev-plan --deliberate`(自带 pre-mortem + expanded test plan)。**一句话 hotfix** 跳过 spec/plan,但 commit 前必须过 `dev-commit-review`。

---

## 配置 / 治理

| 文件 | 用途 |
|---|---|
| [`references/dev-baseline.md`](./references/dev-baseline.md) | 4 条行为准则:不假设 / 最小代码 / 外科手术式 / 可验证成功标准(贯穿所有 skill) |
| [`CLAUDE.md.template`](./CLAUDE.md.template) | 团队 always-on 约定模板,消费方复制到项目根改名为 `CLAUDE.md` |
| [`references/team-conventions.md`](./references/team-conventions.md) | 团队语言 / 工具偏好 |
| [`references/calibration-cases.md`](./references/calibration-cases.md) | 10 个季度 calibration 用例,防判定漂移 |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | 怎么提议新 skill / 改 baseline,以及**不该做成 skill 的反向标准** |

**规范优先级**:项目 lint config > team-conventions > lang-conventions > dev-baseline
**行为优先级**:skill 局部 > CLAUDE.md > dev-baseline(详见 [CLAUDE.md.template §6](./CLAUDE.md.template))

---

## 设计原则

skill 准入 4 标准:**一句话讲清触发** / **流程标准化(≥ 5 步)** / **每周用 ≥ 1 次** / **输出格式固定**。
反向标准(不该做成 skill):一次性 chore / 个人偏好 / 不在 git 工作流里 / 频次 < 每月 1 次 / lint 已自动化。详见 [`CONTRIBUTING.md`](./CONTRIBUTING.md)。

---

## Status

**0.4.0** · 4 个 skill 全部已发布 · GitHub Actions CI 自动验证 frontmatter / baseline 同步 / manifest(详见 [`.github/workflows/validate.yml`](./.github/workflows/validate.yml))

---

[CHANGELOG](./CHANGELOG.md) · [Contributing](./CONTRIBUTING.md) · MIT License
