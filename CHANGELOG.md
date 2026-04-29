# Changelog

记录本仓库的实质性变更,尤其是 `references/dev-baseline.md` / `CLAUDE.md` / 任何 skill 的 SKILL.md 改动。
格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/),版本号采用 [SemVer](https://semver.org/lang/zh-CN/):

- **MAJOR**:baseline 的某条原则改了 / 删了 / 加了,或 skill 的 verdict 三档发生重定义。
- **MINOR**:新增 skill / 新增 axis / 新增 references 文件。
- **PATCH**:bug 修复、文档润色、calibration 用例增删、typo。

---

## [Unreleased]

### Added
- *(占位:下一版要发的东西先记在这里。)*

---

## [0.4.0] — 2026-04-29

发布就绪版本。修复 4 类阻塞性问题让仓库能被 `npx skills add` / Claude Code 正常安装,并补齐 marketplace 清单 / GitHub Actions 验证。

### Changed (BREAKING — 仓库结构变更)
- **4 个 skill 全部移到 `skills/` 子目录**(`dev-commit-review` / `dev-commit-writer` / `dev-spec` / `dev-plan`)。
   - 原:`./<skill-name>/SKILL.md`
   - 现:`./skills/<skill-name>/SKILL.md`
   - 这与 vercel-labs/skills CLI 的 canonical layout 一致(`discoverSkills()` 优先扫 `skills/` 子目录)。
   - 仓库根目录现在只放 docs / governance / metadata,不混 skill。
- **`CLAUDE.md` 重命名为 `CLAUDE.md.template`**。原文件是模板,但放在 repo 根会让用户误以为已经生效。重命名 + README 醒目说明:**消费方需手动复制到自己项目根并改名为 `CLAUDE.md`** 才会被 Claude Code / Cursor 自动加入上下文。
- **README 安装命令完整重写**:
   - 修语法错误:`npx skills add <user>/dev-skills@dev-commit-review` → `npx skills add <user>/dev-skills --skill dev-commit-review`(`@<skill>` 后缀不被 `npx skills` 识别)。
   - 占位符 `<your-username>` 替换为真实 owner `Jason-chen-coder`,加一句「fork 到别处时替换」说明。
   - 新增「项目级 vs 全局」对比、`--list` 用法、CLAUDE.md.template post-install 说明。
- **4 个 SKILL.md frontmatter 移除非标准字段** `user-invocable: true` 和 `argument-hint: "..."`(oh-my-claudecode 自定义,Claude Code / `npx skills` 都不识别)。参数说明从 frontmatter 移到 description 文末作为可读 hint。
- **CONTRIBUTING.md baseline 同步副本路径**全部更新为 `skills/<skill>/references/dev-baseline.md`。
- **`references/dev-baseline.md` (canonical)** 内的副本路径说明更新为 `skills/<skill>/`。
- **`docs/onboarding.md`** 安装命令同步更新,2 处 lang-conventions.md 路径更新为 `skills/dev-commit-review/references/lang-conventions.md`。

### Added
- **`.claude-plugin/marketplace.json`** —— Claude Code 原生 marketplace manifest。声明本仓库提供 1 个 plugin(`dev-skills`),plugin 内含 4 个 skill。owner / plugins[] 结构对齐 Claude Code 官方 schema,支持 `/plugin marketplace add` + `/plugin install` 流程。
- **`.claude-plugin/plugin.json`** —— Claude Code plugin manifest。声明 plugin metadata(name / version / description / skills 路径),配合 marketplace.json 让 `/plugin install dev-skills` 能拿到完整 plugin 描述。
- **`.github/workflows/validate.yml`** —— GitHub Actions CI,推 PR / push 主分支时自动验证:
   - 每个 SKILL.md 有 `name` + `description` 必填项
   - 5 处 dev-baseline.md 副本 md5 一致(防漂移)
   - `.claude-plugin/marketplace.json` 和 `plugin.json` 结构合法(top-level `name` / `owner.name` / `plugins[]`,plugin 必有 `name` + `source`)
   - 4 个预期 skill 目录都存在(skills/dev-commit-review 等)
   - 仓库根没有 live `CLAUDE.md` 污染(必须是 `.template`)
- **README 安装段重写为 A/B/C 三种方式**:
   - A — Claude Code 原生 `/plugin marketplace add` + `/plugin install dev-skills`(推荐 Claude Code 用户)
   - B — `npx skills add Jason-chen-coder/dev-skills`(跨 agent CLI 通用,Cursor / Codex / Gemini 等)
   - C — 手动 `git clone` 到 `.claude/skills/`(无 npx / 内网场景兜底)

### Notes
- 5 个 baseline 副本 md5 重新对齐到 `487fb5f8...`。
- skill 内容、行为逻辑无变化 —— 只是结构和 metadata 调整。
- 升级用户(从 0.3.x 到 0.4.0)需要重新跑一次 `npx skills add`,因为 skill 路径变了。

---

## [0.3.1] — 2026-04-29

仓库全量审计后的 stale / broken / 缺漏修复。无功能变更,只对齐文档。

### Fixed
- 9 处「三处 / 三个 skill」stale references 全部改为「四处 / 四个」并补 `dev-plan`(`README.md` / `CONTRIBUTING.md` / `CHANGELOG.md` 0.3.0 entry / `docs/onboarding.md` / 5 处 `dev-baseline.md` 副本)。
- `CONTRIBUTING.md` 第 57-62 行 baseline 同步副本清单补 `dev-plan/references/dev-baseline.md`(原本只列 3 处)。
- `docs/onboarding.md` 修两处 broken path:`references/lang-conventions.md` → `dev-commit-review/references/lang-conventions.md`(该文件只在 dev-commit-review 子目录,不在仓库根)。
- `docs/onboarding.md` 「三个 skill 怎么选」表格补 `dev-plan` 行,标题改为「四个 skill 怎么选」。
- `dev-commit-review/SKILL.md` description 过时排除条款改为反映当前 skill landscape(指向 dev-commit-writer / dev-spec / dev-plan)。
- `references/dev-baseline.md` line 58 措辞改为「在 `Step 0 — Load baseline` 段引用」(原写「在 Step 1 之前」与 SKILL.md 实际的 Step 0 名称不一致)。

### Added
- `dev-commit-writer/examples.md` 新增。5 个样例覆盖单一意图、意图歧义多候选、scope creep + Incidental 段、风格采样不足退回 conventional commits、中文项目跟随仓库语言。补齐唯一缺 examples.md 的 skill。
- `references/calibration-cases.md` 新增 4 个 case:7-8 是 dev-spec ambiguity 评分校准(完整需求低分 / 模糊需求高分 + Goal 最弱),9-10 是 dev-plan Critic verdict 校准(应 APPROVED 的好 plan / 应 REJECT 的典型坏 plan)。Calibration session 流程同步改为分 skill 计时(commit-review 30min / spec 15min / plan 15min)。
- `CLAUDE.md` §2 Workflow 新增「设计前置(skill 工具链)」段:复杂改动必须过 dev-spec + dev-plan --deliberate;常规改动建议过 dev-spec;一句话改动跳过但必须过 dev-commit-review。

### Changed
- `dev-commit-review/SKILL.md` argument-hint 改为 `--flag` 风格:`[--staged] [--path=<glob>]`(原 positional `[optional: 'staged' or path]`)。Step 1 Scope rules 同步识别 `--staged` 和 `--path=<glob>`。
- `dev-commit-writer/SKILL.md` argument-hint 同上改为 `[--staged] [--path=<glob>]`。Step 1 Scope rules 同步。
- 4 个 SKILL.md 的 argument-hint 风格现已统一为 `--flag` 格式。
- `README.md` 更新:
  - tagline 从「review、PR 描述、需求对齐」改为反映当前 4 skill 全链路覆盖。
  - 顶部加入新成员 / 团队 leader 双指引。
  - Skills 段标题加「(当前 4 个)」明示数量。
  - 设计原则段补充反向标准条目(链 CONTRIBUTING.md)。
  - 团队治理表加入 `dev-commit-review/references/lang-conventions.md` 行(原本只在 SKILL.md 内引用)。
  - 加载顺序拆为「规范加载顺序」 + 「行为优先级」两条,后者新增对接 CLAUDE.md §6。
  - 文末新增 `## Status` 段(版本 / 发布状态 / draft 列表),置于 License 之前。

### Notes
- 5 个 baseline 副本 md5 在改动后重新对齐(`d98955c4...`)。
- 不破坏功能,无 skill 行为变更,只补文档 / 校准用例 / examples。

---

## [0.3.0] — 2026-04-29

### Added
- **新 skill `dev-plan`**(draft)—— 把 spec 或清晰请求转成 Critic-approved 实施 plan。灵感来自 [oh-my-claudecode](https://github.com/yeachan-heo/oh-my-claudecode) 的 `omc-plan`,本地化精简版:
  - 三档模式:`--quick`(单 pass,小改动)/ 默认(完整 Planner → Architect → Critic 循环,最多 3 次迭代)/ `--deliberate`(默认 + Pre-mortem 3 场景 + Expanded test plan unit/integration/e2e/observability)
  - **RALPLAN-DR 强约束**:Principles(3-5)/ Decision drivers(top 3)/ Viable options(≥2,或显式 invalidation rationale)
  - **Architect 必须 steelman + 找 ≥ 1 条 tradeoff tension**,不许走形式
  - **Critic 7 维度逐项打分**:Principle-option consistency / Alternative exploration / Risk mitigation clarity / AC testability / Verification concreteness / File/line coverage(≥80%)/ Pre-mortem & Expanded test plan(deliberate)
  - **ADR**(Decision / Drivers / Alternatives / Why chosen / Consequences / Follow-ups)作为最终决定的单一入口
  - 高风险信号(鉴权 / 支付 / 数据迁移 / 公开 API breakage / PII)自动升 deliberate 模式建议
  - 输出至 `.claude/artifacts/plans/<feature>.md`
- `dev-plan/SKILL.md` + `dev-plan/examples.md`(3 个完整样例覆盖 quick / 默认 / deliberate)
- `dev-plan/references/dev-baseline.md`(自包含副本)

### Changed
- `dev-spec/SKILL.md` Step 6 spec 模板新增 `Spec footer` 段,**提示但不强制**下一步可跑 `dev-plan`(skill 间松耦合,不主动调起)。
- `README.md` skill 表加入 `dev-plan` 行;workflow 图增加 `dev-spec → dev-plan → 写代码` 节点;新增「各环节关系」说明段。

### Notes
- 不破坏 baseline,baseline 文件未改。
- 不修改 `dev-commit-review` / `dev-commit-writer`(保持紧凑 scope)。dev-commit-review 评审时若发现仓库存在相关 plan,**用户**可手动指给它作为意图参考;skill 本身不自动加载 plan。
- 四个 skill 之间仍然松耦合,中间产物落 `.claude/artifacts/`,任何衔接由用户主动触发。

---

## [0.2.0] — 2026-04-29

### Changed
- **`dev-spec` Step 1 大改**:从「单 shot 列歧义」升级为 **多 wave 渐进式访谈 + 数学化清晰度评分**(灵感来自 [oh-my-claudecode](https://github.com/yeachan-heo/oh-my-claudecode) 的 `deep-interview`)。
  - 引入三档模式:`--quick`(单轮,旧行为)/ `--default`(2–3 wave + 打分)/ `--deep`(至多 6 wave + Challenge modes + Ontology 跟踪)。
  - 每 wave 必做:打 4 维度分(Goal / Scope / AC / Context,greenfield 与 brownfield 权重不同)→ 找最弱维度 → 一句 rationale + 单题 → 用户回答后输出 round report。
  - 退出阈值:`--default` ambiguity ≤ 0.30,`--deep` ≤ 0.20;或 ontology 连续 2 轮 stability ≥ 90%;或用户在 Wave 3+ 显式退出(给 warning)。
  - Brownfield pre-flight:Wave 1 之前先 grep / 列结构,问题必须引用 repo evidence,不许问代码自答的事。
  - Challenge modes(`--deep` only):Wave 3 Contrarian / Wave 5 Simplifier,各用一次。
  - Assumption ledger:全程维护 Verified / Assumed / Open 三态,Open 项进 spec 的 `## Open questions`。
- **`dev-spec` Step 6 spec 模板** 增加 `## Core entities (ontology)` / `## Interview metadata` / `### Clarity breakdown` / `### Ontology convergence` 段(`--quick` 模式省略)。
- **`dev-spec` Hard rules** 新增 6 条针对新 interview 协议的硬约束(不批量问、必出 round report、brownfield 不许跳 pre-flight 等)。

### Added
- `dev-spec/examples.md` 新增 2 个样例:
  - 例 4:`--default` 模式完整 3 wave 访谈(简单需求 — 后台禁用账号)。
  - 例 5:`--deep` 模式完整 6 wave 访谈(复杂需求 — 智能任务系统),展示 Contrarian / Simplifier 激活和 Ontology 漂移到收敛的全过程。

### Notes
- 本次改动不破坏 baseline,baseline 文件未改。
- 不涉及 dev-commit-review / dev-commit-writer。
- 用户安装的 `dev-spec` 副本要求重新拉取或同步 `references/dev-baseline.md` 不变。

---

## [0.1.0] — 2026-04-29

### Added
- 初始 scaffold,3 个 skill:
  - `dev-commit-review`(commit 前 5 轴评审 + commit message 生成)
  - `dev-commit-writer` *(draft)*(只生成 commit message,不评审)
  - `dev-spec` *(draft)*(模糊需求 → 结构化设计文档)
- 共享行为基线 `references/dev-baseline.md`(Karpathy 四原则本地化:不假设 / 最小代码 / 外科手术式改动 / 可验证成功标准)。
- 每个 skill 携带 baseline 副本,保证单独安装时自包含。
- `dev-commit-review/examples.md`(5 个真实场景报告样例)。
- `dev-spec/examples.md`(3 个 fuzzy → spec 样例)。
- `dev-commit-review/references/lang-conventions.md`(10 种语言的规范检查点)。

### Governance
- `CLAUDE.md`(团队级 always-on 工程约定模板)。
- `CONTRIBUTING.md`(贡献流程、新 skill 提议模板、不该做成 skill 的反向标准)。
- `references/team-conventions.md`(团队特有约定模板)。
- `references/calibration-cases.md`(季度 calibration 样例)。
- `docs/onboarding.md`(新成员上手一页纸)。

---

## 模板:写新 entry 时这样填

```
## [x.y.z] — YYYY-MM-DD

### Added
- 新功能 / 新 skill / 新文档。

### Changed
- 修改了已有行为。**baseline / CLAUDE.md 改动必须填这里。**

### Deprecated
- 仍可用但即将移除。

### Removed
- 已删除。

### Fixed
- bug 修复。

### Security
- 安全相关修复(secret 处理、权限收紧等)。
```
