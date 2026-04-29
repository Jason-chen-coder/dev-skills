# dev-skills

> 一套用于团队日常开发的 Claude Code skills,覆盖 **需求对齐 → 实施方案 → 提交评审 → commit message** 整条 git 工作流。
>
> 灵感来自 [forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills)(行为基线)和 [oh-my-claudecode](https://github.com/yeachan-heo/oh-my-claudecode) 的 deep-interview / omc-plan(访谈与共识机制)。本仓库做团队场景的轻量本地化。

每个 skill 都做一件事,可单独安装,也可全量安装。skill 之间通过约定的产物路径(`.claude/artifacts/`)松耦合,**不互相调用**,你可以只用一个,也可以串起来用。

> **新成员**:先看 [`docs/onboarding.md`](./docs/onboarding.md),30 分钟跑通第一次。
> **团队 leader**:本仓库是团队规范载体,定制方式见 [`CLAUDE.md.template`](./CLAUDE.md.template)(团队 always-on 约定模板,需复制到项目根并填写)和 [`references/team-conventions.md`](./references/team-conventions.md)(语言偏好)。

---

## Skills(当前 4 个)

| Skill | 作用 | 触发时机 |
|---|---|---|
| [`dev-commit-review`](./skills/dev-commit-review/) | 提交前对当前 git working tree 做 5 轴评审(规范/功能/闭环/注释/废码),按严重度报告并产出 commit message | 准备 commit / 提交前检查 |
| [`dev-commit-writer`](./skills/dev-commit-writer/) *(draft)* | 基于分支 commits 针对当前 git 修改生成 commit message,不评审代码 | 改动已过审、只需要写 message |
| [`dev-spec`](./skills/dev-spec/) *(draft)* | 把模糊需求转成结构化设计文档(范围、方案、边界、风险、可验证验收条件)。支持多 wave 渐进访谈 + 数学化清晰度评分(`--quick` / 默认 / `--deep`) | 写代码前对齐需求 |
| [`dev-plan`](./skills/dev-plan/) *(draft)* | 把 spec 或清晰请求转成 Critic-approved 的实施 plan,内置 Planner → Architect → Critic 共识循环 + RALPLAN-DR 结构(`--quick` / 默认 / `--deliberate`) | 需求已对齐、写代码前定方案 |

> *draft* 表示已落 SKILL.md 但尚未在生产工作流里反复打磨;欢迎试用并提 issue。

---

## 共享行为基线

所有 skill 在执行前都会先加载 [`references/dev-baseline.md`](./references/dev-baseline.md),四条贯穿所有 skill 的准则 —— **不假设、最小代码、外科手术式改动、可验证成功标准** —— 源自 Andrej Karpathy 对 LLM 编码 pitfall 的观察(参考 [forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills))。

> 每个 skill 的 `references/dev-baseline.md` 是根目录版本的副本,以保证 skill 单独安装时仍自包含。**修改时改根目录版本,然后同步到四处 skill 副本**(dev-commit-review / dev-commit-writer / dev-spec / dev-plan)。

---

## 安装

> 默认假设你 fork 到 `Jason-chen-coder/dev-skills`。如果你团队 fork 到别的位置,把下方命令里的 `Jason-chen-coder` 替换成你团队 GitHub `<owner>`。

### 方式 1:全量安装(推荐)

```bash
# 装到当前项目(.claude/skills/)— 项目级,提交版本控制,团队共享
npx skills add Jason-chen-coder/dev-skills

# 或装到全局(~/.claude/skills/)— 个人开发机所有项目都能用
npx skills add Jason-chen-coder/dev-skills --global
```

会把仓库里所有 skill 都安装到本地。

### 方式 2:按需安装

只装你当前需要的 skill(可以多个 `--skill` 叠加):

```bash
npx skills add Jason-chen-coder/dev-skills --skill dev-commit-review
npx skills add Jason-chen-coder/dev-skills --skill dev-spec --skill dev-plan
```

### 方式 3:列出仓库可装的 skill(不实际安装)

```bash
npx skills add Jason-chen-coder/dev-skills --list
```

### 安装 CLAUDE.md 模板(强烈建议)

skill 不会自动复制 [`CLAUDE.md`](./CLAUDE.md.template) 到你的项目根。装完 skill 后,**手动复制一次**(只需做一次):

```bash
curl -O https://raw.githubusercontent.com/Jason-chen-coder/dev-skills/main/CLAUDE.md.template
mv CLAUDE.md.template CLAUDE.md
# 然后按文件里 <!-- team:fill --> 标记填团队特有约定
```

### 验证安装

```bash
# 项目级安装看这里
ls .claude/skills/

# 全局安装看这里
ls ~/.claude/skills/

# 应看到:dev-commit-review / dev-commit-writer / dev-spec / dev-plan
```

---

## 设计原则

这套 skill 不是越多越好,每一个都满足 4 项准入标准:

1. **触发时机能用一句话讲清** —— 避免和其他 skill 抢触发。
2. **流程标准化** —— 至少 5 步以上的可复现步骤。
3. **高频复用** —— 每周至少用一次。
4. **输出格式固定** —— 团队多人使用时报告风格一致。

**反向标准**(不该做成 skill):一次性 chore / 个人偏好 / 不在 git 工作流里的事 / 没有 standardized 流程的开放性头脑风暴 / lint 已自动化的事 / 频次 < 每月 1 次。详见 [`CONTRIBUTING.md`](./CONTRIBUTING.md)。

不满足上述标准的事项放进 [`CLAUDE.md`](./CLAUDE.md.template)(模板,使用时复制到项目根)或个人记事本,而不是做成 skill。

---

## 推荐工作流(可选)

skill 可独立使用,但组合起来效果更好:

```
[模糊需求]
    │
    ▼  dev-spec                  ← 多 wave 访谈 + 清晰度评分,直到达阈值
[设计文档] (.claude/artifacts/designs/<feature>.md)
    │
    ▼  dev-plan(可选,复杂功能推荐)  ← Planner→Architect→Critic 共识循环
[实施 plan] (.claude/artifacts/plans/<feature>.md)
    │
    ▼  写代码
[代码改动]
    │
    ├──▶  dev-commit-review     ← 走完整评审,READY 时附带 commit message
    │     [评审报告 + commit message]
    │
    └──▶  dev-commit-writer     ← 改动已过审 / 自信无问题,只要 message
          [Commit Message]
    │
    ▼  git commit + push
```

各环节的关系:

- **`dev-spec` → `dev-plan` 是松耦合衔接**。spec 能直接进入编码,但**复杂功能 / 高风险改动**强烈建议过 dev-plan(尤其 `--deliberate` 模式 = pre-mortem + expanded test plan)。
- **`dev-commit-review` 与 `dev-commit-writer` 是二选一**。前者做完整 review 后顺便给 commit message;后者跳过 review 直接出 message。
- **skill 之间不互调**。任何衔接由用户主动触发,中间产物落 `.claude/artifacts/`。

中间产物统一放 `<project-root>/.claude/artifacts/`,可加进 `.gitignore` 也可 commit,看团队偏好。

---

## 兼容性

- **Claude Code** —— 主要测试环境
- **其他 agent CLI**(Codex / Cursor / Gemini CLI)—— skill 本身是纯 Markdown,理论兼容,但触发逻辑可能略有差异

---

## 团队治理 / 文档

| 文件 | 用途 |
|---|---|
| [`CLAUDE.md.template`](./CLAUDE.md.template) | 团队级 always-on 工程约定**模板**(消费方需复制到项目根并改名为 `CLAUDE.md`)。skill 是场景检查点,本文件是永久背景。 |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | 怎么提议新 skill / 改 baseline / 改现有 skill,以及**不该做成 skill 的反向标准**。 |
| [`CHANGELOG.md`](./CHANGELOG.md) | 实质性变更记录,尤其 baseline / CLAUDE.md 改动。 |
| [`docs/onboarding.md`](./docs/onboarding.md) | 新成员上手一页纸,30 分钟跑通第一次。 |
| [`references/team-conventions.md`](./references/team-conventions.md) | 团队对具体语言 / 工具的偏好(在 lang-conventions 之上覆盖)。 |
| [`references/calibration-cases.md`](./references/calibration-cases.md) | 季度 calibration 用例(10 个,覆盖 dev-commit-review × 6 / dev-spec × 2 / dev-plan × 2),防止判定漂移。 |
| [`skills/dev-commit-review/references/lang-conventions.md`](./skills/dev-commit-review/references/lang-conventions.md) | 跨语言通用规范(10 种语言),dev-commit-review 专属 references。 |

**规范加载顺序**(skill 在做规范检查时遵循):**项目本地 lint config > team-conventions > lang-conventions > dev-baseline**(局部覆盖通用)。

**行为优先级**(skill 输出与文档冲突时):**skill 局部规则 > CLAUDE.md > dev-baseline**(详见 [`CLAUDE.md.template`](./CLAUDE.md.template) §6)。

---

## Status

- **当前版本**: 0.4.0 — 发布就绪(详见 [`CHANGELOG.md`](./CHANGELOG.md))
- **已发布**:`dev-commit-review`
- **Draft**(已落 SKILL.md,生产工作流尚需打磨):`dev-commit-writer` / `dev-spec` / `dev-plan`
- **CI**:GitHub Actions 自动验证每个 PR 的 frontmatter / baseline 同步 / marketplace 清单完整性,详见 [`.github/workflows/validate.yml`](./.github/workflows/validate.yml)。

欢迎试用并提 issue。

---

## 贡献

任何修改走 PR + issue 讨论流程,详见 [`CONTRIBUTING.md`](./CONTRIBUTING.md)。

---

## License

MIT
