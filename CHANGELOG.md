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

## [0.7.0] — 2026-05-07

### ⚠️ BREAKING — Skill 重命名

**`dev-commit-review` 重命名为 `dev-code-review`**。

理由:原名暗示「只在 commit 时跑」,实际职责是「代码评审」(可在 commit / PR / hotfix 任何时候触发,不绑定 commit 节点)。新名更准确反映 skill 职责。

### Migration(已装 0.6.x 的用户必看)

升级路径取决于安装方式:

**Claude Code(`/plugin install`)**:

```
/plugin update dev-skills
```

如果不生效,卸载重装兜底:

```
/plugin uninstall dev-skills
/plugin install dev-skills
```

**`npx skills`**:

```bash
# 删旧名 skill
npx skills remove dev-commit-review

# 重装(会拿到新名 dev-code-review)
npx skills add Jason-chen-coder/dev-skills@v0.7.0 --force
```

**git clone**:

```bash
cd <install-path>/dev-skills
git pull
git checkout v0.7.0
# 旧 dev-commit-review 目录可能残留,手动 rm -rf 即可
```

### 用户行为变化

- 触发短语**不变**:「准备 commit / 提交前检查 / review my changes」等仍能触发,因为 description 里关键词没改,只 skill name 变了
- 但 chat / commit message footer / artifact 里**显示文本变了**:
  - 原 `━━━ Dev Commit Review ━━━` → `━━━ Dev Code Review ━━━`
  - 原 `Refs: <type>/<slug>` 不变(因为 type 是 `spec`/`plan`/`fix`,不含 review)
- 原仓库的 `Refs:` 历史 commit 不受影响,因为 dev-code-review 不产 artifact 不在 Refs type 中

### Changed
- 仓库内 **103 处 `dev-commit-review` 引用全部替换为 `dev-code-review`**(含 SKILL.md 频道、README、CONTRIBUTING、CHANGELOG 历史 entry、所有 examples、calibration cases、validate.yml、marketplace.json、plugin.json、docs/onboarding 等)
- **9 处显示标题** `Dev Commit Review` → `Dev Code Review`(SKILL.md `# title` + 报告分隔线 `━━━ ... ━━━` + onboarding example)
- 目录 `skills/dev-commit-review/` 改名为 `skills/dev-code-review/`

### Notes
- baseline 7 副本 md5 同步更新(canonical + 6 skills)
- CI 期望 skill 列表更新到 `dev-code-review`
- CHANGELOG 历史 entry(0.1.0 ~ 0.6.3)的 `dev-commit-review` 也一并替换为 `dev-code-review`(取「内部一致」优于「历史精确」),想看真实历史可看 git log 各 tag 时点的状态

---

## [0.6.3] — 2026-05-06

**LLM 行为偏差矫正层**。Path B 自测(设计层对抗性 review)发现 8 个 gap —— SKILL.md 指令读起来 OK 但实操可能被 LLM 已知行为偏差(礼貌 / 自洽 / 模板化 / 凑数 / 假装跑过)绕过。本版本把这些用**硬性可量化判据**修死。无 skill 数量变化,无 artifact 路径变化,只是各 SKILL.md 的硬约束加严。

### Fixed(HIGH severity — 不修会让 skill 输出与设计意图发生质性偏差)
- **G1 — `dev-plan` Critic 软通过 risk**:Critic 和 Planner 是同一 LLM 不同身份,LLM 训练倾向自洽 → Critic 不会真心 REJECT 自己 30 秒前写的 plan。**修法**:Step 5 加硬约束「**至少 1 条 RESERVATION**」,即使 verdict = APPROVED 也要列出对 plan 某 section 的具体保留意见。拿不出 ≥ 1 条 → verdict 强制改为 REVISE。
- **G2 — `dev-code-review` 闭环轴 `git grep` 不真跑**:LLM 倾向默念检查后报告结果(违反 baseline「Evidence before claims」)。**修法**:Step 1 闭环段加显式要求「**必须真正 invoke bash 跑 git grep,在报告里展示 command + output**」,不能只说「grep 验证通过」。
- **G3 — `dev-spec` ambiguity 评分往阈值收敛**:LLM 在用户施压「够了快点」时倾向 rationalize 调高分数让 ambiguity 假性达标。**修法**:Step 1.2 评分加 anchor 要求 —— 每维度的分数必须列出具体证据;拿不出 anchor 列表评分上限 0.6;用户施压时不调高分数,走 STUCK 路径。

### Fixed(MEDIUM severity)
- **G4 — `dev-fix --deep` hypothesis 凑数**:为了凑「跨多维度」LLM 会列 3-5 个,但其中 2-3 个是 prior < 10% 的弱假设。**修法**:Step 3 hypothesis 模板加 `prior probability` 字段(区分 confidence vs prior),`--deep` 后自查若 ≥ 3 个 prior < 20% 则**回 Step 3 重列**(假设池质量不够)。
- **G5 — `dev-commit-writer` Refs 自动加可能错配**:用户做 feature 期间顺手修了 unrelated bug,自动追加错误 Refs 比没 Refs 更糟糕。**修法**:Step 4b 加语义匹配检查 —— 看 commit subject 与 slug 是否关键词重叠 / 文件路径相关 / commit type 一致。任一 signal 不匹配 → **不擅自加,回问用户**。
- **G6 — `dev-fix` Defense-in-depth 塞 refactor**:LLM 写完 fix 后兴奋,容易把整个调用链加 logging 等说成 defense。**修法**:Step 6b 加客观行数门 —— **defense 加的代码 ≤ root cause fix × 2 行**,超过强制拒绝丢 Follow-up。DB constraint / type schema 这类单行声明性配置例外。
- **G7 — `dev-spec` STUCK 触发概率低**:类似 G1,LLM 倾向降低判断标准凑出 ALIGNED。**修法**:Step 1.2 加 STUCK 客观判据 —— 4 条硬条件任一满足强制标 STUCK(Goal anchor 缺失 / Open questions 含外部决策项 / Scope 未对齐 / Ontology 未收敛)。Open questions 写空话(「需要更多信息」)视为 STUCK 不通过。

### Fixed(LOW severity — 边界 case)
- **G8 — `dev-workflow` slug 命名空间冲突**:同 slug 同时出现在 `designs/` 和 `fixes/` 时 phase 推断混乱。**修法**:Step 3 加冲突检测,要求用户改名,绝不擅自合并 / 假设语义。

### Notes
- 7 个 baseline 副本 md5 不变(本次只改 4 个 SKILL.md 的硬约束章节,baseline 未触)。
- **不破坏现有行为**,仅加严约束。已经在用 0.6.2 的用户**升级后会更挑剔**(Critic 不再软通过 / grep 真跑 / Refs 不乱加),这是设计意图。
- 这一层修复主要针对**真实 LLM 行为**(我作为 LLM 自己识别的偏差),Path A(用户真任务自验证)是下一步,可能再发现一层不同维度的 gap。

---

## [0.6.2] — 2026-05-06

全项目第二轮 audit 修复 + 新增 commit↔artifact 追溯 + dev-spec STUCK 终止状态。5 项改动(应改 2 + 建议 3)。无 skill 数量变化,但加了 2 个新行为(Refs footer / STUCK status)和 3 处 governance 文档收敛。

### Added
- **G1 — commit message footer 自动追溯 artifact**(在 `dev-commit-writer` 加 Step 4b,在 `dev-code-review` READY verdict 加规则 11):commit message 末尾自动加 `Refs: <type>/<slug>` 行(type ∈ {spec, plan, fix})。决策表:
  - 0 个 in-flight → 不加
  - 1 个 → 自动加
  - 同 slug spec + plan → 两条都加
  - 多 slug → 询问用户而非擅自选
  - `.claude/artifacts/` 不存在 → 跳过(用户没用 dev-skills 流程)
  - 后续可用 `git log --grep="Refs:"` 检索 commit ↔ artifact 关联
- **G2 — `dev-spec` 加 STUCK 终止状态**(对齐 dev-plan 的 BELOW_CONSENSUS_THRESHOLD / dev-fix 的 BELOW_CONFIDENCE_THRESHOLD 同形):达 wave 上限仍 ambiguity > 阈值时,spec status 标 `STUCK`,要求 Open questions 段写**具体阻塞了什么**(不是泛泛「需要更多信息」)。`dev-workflow` Step 3 phase 表加 `designs/<slug>.md status STUCK → Phase 1-blocked`,`--recover` 决策表加 STUCK 恢复路径(去拿外部信息后回来跑 `dev-spec --deep <slug>` 续 wave)。

### Changed
- **G3 — `CONTRIBUTING.md` 「新 skill 提议模板」拆为两类**:
  - 类型 A:**原子工作步骤 skill**(默认,绝大多数)—— 沿用 7 问模板
  - 类型 B:**Orchestrator / Recommender skill**(特殊例外,目前只有 dev-workflow)—— 准入标准对照表 + 4 条硬约束(不调起其他 skill / 不持久化 state / 不产 artifact / 不深读其他 skill 的 artifact 内容);不满足 4 条就**应改成 README 文档而非 skill**
- **G4 — `CLAUDE.md.template` 给关键 placeholder 加「取舍参考」短注**:
  - `§3 错误处理`:异常 / Result type / 混合 三选一的 tradeoff(开发速度 vs 类型安全 vs boilerplate)
  - `§3 配置 / Feature flag`:LaunchDarkly / 自研 / env vars 三选一的 tradeoff(成本 vs 控制力 vs 实时性)
  - `§2 测试`:覆盖率底线 / E2E 触发的合理范围
  - 帮助新 leader 做选择,而不是只给空 placeholder
- **G5 — `dev-workflow` examples 加显式 `[slug]` 参数演示**:例 3 (`--next`) 和例 4 (`--recover`) 都显式带 slug,避免新用户不知道这个用法

### Notes
- `references/dev-baseline.md` 7 副本 md5 不变(本次只改 dev-spec / dev-code-review / dev-commit-writer / dev-workflow 的 SKILL.md,baseline 未触)。
- 不破坏现有 skill 行为,**仅添加新行为**:
  - dev-commit-writer / dev-code-review 的 Refs footer 是**自动行为**,但 0 个 artifact 时不加,完全 backward-compatible
  - dev-spec STUCK 是**新 status 值**,只在达 wave 上限仍 ambiguity 高时设置;之前不会触发
- README Status 0.6.1 → 0.6.2,marketplace.json + plugin.json 同步。

---

## [0.6.1] — 2026-05-06

dev-workflow 第一轮 audit 修复 + 跨 skill 一致性收敛。10 项改动(必修 4 + 应改 6)。无 skill 行为质变,但消除了 dev-workflow phase 推断的 bug,统一了 Status 命名,补齐了 governance 文档同步。

### Fixed(必修,影响功能正确性)
- **A1**:`dev-fix` Step 8 artifact template Status enum 缺 `NEEDS_DESIGN_CHANGE`(Step 6 stop & handoff 段已用此 status,但 template 只列 2 个 → 自相矛盾)。补上。
- **A2**:`dev-spec` Status 用小写(`draft / aligned / implemented`)与其他 skill 大写不一致 → **统一为大写**(`DRAFT / ALIGNED / IMPLEMENTED`)。SKILL.md template + examples 同步。
- **A3**:`dev-spec` 没有自动 `DRAFT → ALIGNED` 转换机制,导致 dev-workflow 原 Phase 1 vs Phase 2 推断永远卡 Phase 1(用户不会主动改 status)→ **简化 dev-workflow phase 推断**:**只看文件存在性 + terminal status 信号**(BELOW / NEEDS_DESIGN_CHANGE 等阻塞信号)。spec lifecycle status 留给用户手动管理,不影响 dev-workflow。
- **W1**:`dev-workflow` Step 3 自动推断 slug 但不让用户确认。Phase 0 新需求时容易选错(「用户自助导出」可能 → user-export / user-self-export / gdpr-export 等)→ **加 Phase 0 propose-then-confirm 流程**,绝不跳过用户确认。

### Changed(应改,提升用户体验)
- **W2**:`dev-workflow --recover` 输入太模糊时(用户只说「失败了」)无 fallback,会硬猜失败信号 → 加 **Step 7.0 输入清晰度检查**,缺 skill 名 + 失败信号时回问。
- **W3**:`dev-workflow` Hotfix 升级警告太模糊(只说「警告并建议升级」)→ 给具体话术示例,明确 hotfix 路径会让 commit-review 抓 P0 阻塞。
- **W4**:`dev-workflow` `--status` / `--next` / `--recover` 加 `[slug]` 参数支持,description 同步声明。多 in-flight 项目时可显式指定。
- **W5**:`dev-workflow` Step 4 推荐链表 hotfix 行 cell 内容怪(「升 moderate feature/bug」语法上不通顺)→ 改为 `n/a — 升 feature/bug moderate` 等清晰表述。
- **A4**:`references/calibration-cases.md` 加 4 个 case:Cases 11-12(dev-fix:escalation 决策 + Defense-in-depth 边界),Cases 13-14(dev-workflow:path/complexity 分类 + `--recover` 决策)。Calibration session 流程加两个 15 分钟 slot。
- **A5**:`CLAUDE.md.template` §2 Workflow 段补 dev-fix(bug 路径)+ dev-workflow(入口推荐器)+ 中间产物路径表。原本 0.5.0 / 0.6.0 加 skill 时漏了 governance doc 同步。

### Notes
- `references/dev-baseline.md` 7 个副本 md5 不变(本次只改 dev-workflow 内部 + dev-spec/dev-fix template 的 status enum,baseline 未触)。
- README 同步更新 calibration-cases 描述(10 → 14 个 case)+ Status 段(0.6.0 → 0.6.1)。
- `docs/onboarding.md` calibration 推荐数同步(10 → 14)。
- 不破坏现有 skill 行为,仅:
  - dev-spec / dev-fix 的 Status enum 字符串值变(用户已写过的 artifact 不强制升级,但新写的会用新值)
  - dev-workflow phase 推断逻辑简化(Phase 1 / 2 含义微调,但用户体验更顺)

---

## [0.6.0] — 2026-05-06

### Added
- **新 skill `dev-workflow`** —— 松耦合入口推荐器。**不调起其他 skill**(保留 dev-skills 松耦合原则),只读 `.claude/artifacts/{designs,plans,fixes}/` 推断当前 phase,然后输出三段:
   - **完整推荐链**:对应 path(feature / bug / hotfix)+ 复杂度(simple / moderate / complex)的 skill 序列 + 模式参数
   - **当前位置**:你在 phase N(只读存在性 + frontmatter Status 字段,不深读)
   - **下一步**:精确命令(可复制粘贴)+ 一句 rationale
- 4 种模式:**默认**(完整推荐)/ **`--status`**(只定位)/ **`--next`**(只下一步,极简)/ **`--recover`**(失败恢复表 8 种场景:dev-spec / dev-plan / dev-fix / dev-code-review 各自的失败信号 → 推荐回到哪 + 为什么 + 操作建议)
- 路径覆盖:**feature** + **bug** + **hotfix** 三条主路径,unclear 时列选项问用户(不假设)
- 推荐链对照表(path × complexity 9 种组合)
- 严格触发条件:description 锁定为「用户显式要 workflow / 串起来 / 完整跑」,避免和具体 skill 抢触发
- 不产 artifact(每次调用从仓库现状重扫,无 state file)
- `skills/dev-workflow/SKILL.md`(7 步 + 10 条 Hard rules)
- `skills/dev-workflow/examples.md`(5 个完整样例:complex feature 完整链 / `--status` 中途定位 / `--next` 极简 / `--recover` 处理 FIX P1 / unclear 路径列选项)
- `skills/dev-workflow/references/dev-baseline.md`(自包含副本)

### Changed
- README skills 表新增 `dev-workflow` 行(放最前,作为可选入口)。
- README 工作流图加入 `dev-workflow` 头部分支,标注「可选入口,不调起任何 skill」,保持原有 feature/bug 双入口结构不变。
- README Status:版本 0.5.1 → 0.6.0,skill 数 5 → 6。
- `.claude-plugin/marketplace.json` + `plugin.json` 版本 0.5.1 → 0.6.0,description 加 dev-workflow,keywords 加 `workflow` / `orchestration`,tags 加 `workflow` / `guide`。
- `CONTRIBUTING.md` baseline 同步副本清单从「五处」改为「六处」,新增 `skills/dev-workflow/references/dev-baseline.md`。
- `references/dev-baseline.md`(canonical)同上。
- `.github/workflows/validate.yml` 期望 skill 列表加入 `dev-workflow`(从 5 → 6),success log 同步。
- `docs/onboarding.md` 「五个 skill 怎么选」表 → 六个,加 `dev-workflow` 行作为入口推荐器。

### Notes
- 7 个 baseline 副本(canonical + 6 skills)md5 对齐到 `28ca783e...`。
- 不破坏现有 5 个 skill —— dev-workflow 只指路,不实际调用任何 skill,松耦合原则保留。
- `dev-workflow` 是**可选**入口,用户也可继续直接跑 `dev-spec` / `dev-fix` / 等等,不强制走 workflow。
- 没有「skill orchestrator」,因此其他 skill 的「不要主动调起其他 skill」Hard rule 仍 100% 有效。

---

## [0.5.1] — 2026-04-30

dev-fix 第二轮审计修复。无 skill 行为变更,只提升 SKILL.md 和 examples 的清晰度、一致性、准确性。

### Fixed
- **M1**:Step 1 line 49 引用了不存在的「Step 1.5」(死链)。改为「直接向用户追问补全,不要自己猜」。
- **M2**:Step 1 模式表过时的「完整 6 阶段」措辞(实际是 0-8 共 9 phase)。重写为按 phase 描述差异,不用步数。
- **M3**:Step 1 模式表只描述 Hypothesis 差异,缺 Instrument / Defense-in-depth / RCA 列。补全 4 列 + 任何模式都不能跳的硬门槛说明。
- **M4**:Step 5 escalation 规则与默认模式 hypothesis 上限(2 个)不兼容(默认根本到不了「3 个证伪」的状态)。改为**累计跨模式跨轮**的双计数器(`hypothesis_busted_count` 仅计 H 高置信 + `fix_attempt_failed_count` Step 6+7 完整跑过仍 RED),阶梯式触发(2 触发升模式建议、3 触发架构升级)。
- **M5**:Step 4 / 7d 的 instrumentation tag 用 `# #region DEBUG  -- bug-<slug>`(双空格依赖,易踩坑)。改为单一锚点 `bug-<slug>` 字符串作为 grep 凭据,不依赖空格 / 注释风格 / region 关键字。Step 4 / Step 7d / examples 例 3 同步更新。

### Changed
- **S1**:Step 3 hypothesis 模板加 `预测观察` 字段(可证伪锚点)—— 每个假设必须能预测「如果 H 成立,test/log 应当呈现什么」。examples 例 3 的 5 个 hypothesis 全部按新格式改写。
- **S2**:Step 3 评分单位统一 —— 删除「概率 60%」措辞,统一为「**置信度 H/M/L + 优先级序号**」。
- **S3**:Step 6 加「Stop & handoff to dev-plan」段。fix 涉及结构性改动(≥ 2 文件公共接口 / DB schema / 跨服务消息格式 / 类继承层级)时,**立刻 STOP** dev-fix,artifact 标 `Status: NEEDS_DESIGN_CHANGE`,把决策权交回用户;不要勉强写小补丁。
- **S4**:Step 7c「wider suite」原本只写「同模块全测试」太模糊。补 5 种语言具体命令(pytest / pnpm / go test / cargo test / gradle)。
- **S5**:artifact 中 `AC-1 / AC-2 / AC-3 / AC-4` 改为 `V-1 / V-2 / V-3 / V-4`(verification log,避免与 dev-spec 的 acceptance criteria 混淆)。examples 例 1 同步。
- **S6**:小数序号 `Step 6.5` 改为 `Step 6b`(整数序号 + 子段语义,避免被误读为「6.5 = Step 7 之前可省一半」)。SKILL.md 全文 + examples 例 3 + Hard rules 引用全部同步。

### Added
- **P2 模式自动升级建议**:Step 1 加新段。如果用户输入 `--quick` 但 Capture 阶段出现以下任一信号,主动建议升 `--deep`(等用户确认):
  - Severity 是 blocker / 财务影响 / 数据破坏
  - First seen 含「间歇性 / 偶发 / ~N% 概率 / heisenbug」
  - Symptom 跨服务 / 跨进程 / 跨线程 / 跨 host
  - Step 2c repro flaky(< 3/3 失败)

### Notes
- SKILL.md 行数:379 → 440(主要因 4 列模式表 + Escalation 阶梯表 + 7c 多语言示例 + Stop & handoff 段)。
- examples.md 行数:432(基本不变,只重写例 3 hypothesis 格式)。
- Hard rules 数量保持 13 条,内容微调对齐新 Step 编号 / escalation 规则。
- 6 个 baseline 副本 md5 不变(本次只改 dev-fix 本身,baseline 未触)。
- 不破坏其他 4 个 skill,无版本冲突。

---

## [0.5.0] — 2026-04-29

### Added
- **新 skill `dev-fix`** —— Hypothesis-driven 调试 + 修复工作流。借鉴 oh-my-claudecode 的 `/debug`、社区 `systematic-debugging` / `claude-code-debug-mode`,以及 **obra/superpowers 的 5 个 debug 子 skill**(systematic-debugging / root-cause-tracing / defense-in-depth / condition-based-waiting / verification-before-completion),融合为单一 dev-skills 风格 skill:
   - 三档模式:`--quick`(简单 bug 跳形式化但仍 verify 三步)/ 默认(完整 8 阶段,1-2 hypothesis)/ `--deep`(强制 3-5 hypothesis 跨多维度 + tagged debug instrument + defense-in-depth + pattern analysis + 完整 RCA artifact)
   - 8 步硬流程:Triage → Reproduce(failing test + condition-based-waiting)→ Hypothesize → Instrument(deep)→ Diagnose(**含反向 call-stack 追溯**)→ Fix(只动 root cause)→ **Step 6.5 Defense-in-depth(deep 可选)** → Verify(red→green→red 三步循环)→ Write artifact(含 **Pattern analysis 必填段**)
   - 铁律 **No fixes without root cause**:confirm 不了根因就标 `BELOW_CONFIDENCE_THRESHOLD` 让用户决策,禁止 symptom-patch
   - **3 次失败 = 架构问题升级**(借自 superpowers):3 个高置信 hypothesis 全证伪,或 3 次 fix attempt 后仍 RED → 停止假设循环,升级到用户决策 / `dev-plan`,不硬猜
   - **反向 call-stack 追溯**(借自 superpowers `root-cause-tracing`):不在第一个可疑帧修,反向追到 bad value 被首次引入的那一帧
   - **Defense-in-depth**(借自 superpowers `defense-in-depth`,`--deep` 可选):root cause 修完后**有针对性地**在多层边界加 validation;严格区分 defense vs refactor
   - **Condition-based-waiting**(借自 superpowers):时序 / race repro 用 `waitFor(predicate)` 替代固定 sleep,解决 flaky
   - **Evidence before claims**(借自 superpowers `verification-before-completion`):artifact 任何 passed / fixed / verified 声明必须**本轮真跑过命令读过 output**,没跑别声称
   - **「找不到 root cause」≠ 没有 root cause**(superpowers 口号):95% 是 investigation 不完整,升 `--deep` 多列假设、反向追溯,比放弃更可能找到
   - **Pattern analysis**:artifact 必填段,grep 仓库找同类隐患(本次不修,作为 follow-up)
   - **强制 regression test** + **强制 stash 反向证明**(fix 后 stash 一次 test 必须重新 RED)
   - 输出至 `.claude/artifacts/fixes/<bug-slug>.md`
- `skills/dev-fix/SKILL.md`(8 步流程 + 13 条 Hard rules)
- `skills/dev-fix/examples.md`(4 个完整样例:`--quick` off-by-one / 默认 session TTL / `--deep` race + **反向追溯 + Defense-in-depth + Pattern analysis** 完整演示 / 反例 Verify 7b 失败)
- `skills/dev-fix/references/dev-baseline.md`(自包含副本)

### Changed
- README skills 表新增 `dev-fix` 行(放 dev-plan 之后、dev-code-review 之前,反映工作流位置)。
- README 工作流图重做为**双入口分支**:`[新需求] → dev-spec/plan` 和 `[bug 报告] → dev-fix` 两条平行路径,在「写代码」节点合流后共用 commit-review/writer。
- README 工作流图下方说明新增「间歇性 / 跨系统 / 生产事故 bug 建议 `dev-fix --deep`」一条。
- README Status 段:版本 0.4.0 → 0.5.0,skill 数 4 → 5。
- `.claude-plugin/marketplace.json` + `plugin.json` 版本 0.4.0 → 0.5.0,description 加 dev-fix + 提及反向追溯 / defense-in-depth / pattern analysis,keywords / tags 加 `debug` / `bug-fix` / `rca` / `regression-test`。
- `CONTRIBUTING.md` baseline 同步副本清单从「四处」改为「五处」,新增 `skills/dev-fix/references/dev-baseline.md`。
- `references/dev-baseline.md`(canonical)同上。
- `.github/workflows/validate.yml` 期望 skill 列表加入 `dev-fix`(从 4 → 5)。

### Notes
- 6 个 baseline 副本(canonical + 5 skills)md5 对齐到 `447b314f...`。
- 不破坏现有 4 个 skill 行为,仅新增。
- dev-fix 与 dev-spec 是**平行入口**(新需求 vs bug 报告),不调用其他 skill,松耦合保留。
- skill 名 `dev-fix`(而非 `dev-bug`)强调输出是「fix」工作流;artifact 路径 `.claude/artifacts/fixes/` 与名一致。

---

## [0.4.0] — 2026-04-29

发布就绪版本。修复 4 类阻塞性问题让仓库能被 `npx skills add` / Claude Code 正常安装,并补齐 marketplace 清单 / GitHub Actions 验证。

### Changed (BREAKING — 仓库结构变更)
- **4 个 skill 全部移到 `skills/` 子目录**(`dev-code-review` / `dev-commit-writer` / `dev-spec` / `dev-plan`)。
   - 原:`./<skill-name>/SKILL.md`
   - 现:`./skills/<skill-name>/SKILL.md`
   - 这与 vercel-labs/skills CLI 的 canonical layout 一致(`discoverSkills()` 优先扫 `skills/` 子目录)。
   - 仓库根目录现在只放 docs / governance / metadata,不混 skill。
- **`CLAUDE.md` 重命名为 `CLAUDE.md.template`**。原文件是模板,但放在 repo 根会让用户误以为已经生效。重命名 + README 醒目说明:**消费方需手动复制到自己项目根并改名为 `CLAUDE.md`** 才会被 Claude Code / Cursor 自动加入上下文。
- **README 安装命令完整重写**:
   - 修语法错误:`npx skills add <user>/dev-skills@dev-code-review` → `npx skills add <user>/dev-skills --skill dev-code-review`(`@<skill>` 后缀不被 `npx skills` 识别)。
   - 占位符 `<your-username>` 替换为真实 owner `Jason-chen-coder`,加一句「fork 到别处时替换」说明。
   - 新增「项目级 vs 全局」对比、`--list` 用法、CLAUDE.md.template post-install 说明。
- **4 个 SKILL.md frontmatter 移除非标准字段** `user-invocable: true` 和 `argument-hint: "..."`(oh-my-claudecode 自定义,Claude Code / `npx skills` 都不识别)。参数说明从 frontmatter 移到 description 文末作为可读 hint。
- **CONTRIBUTING.md baseline 同步副本路径**全部更新为 `skills/<skill>/references/dev-baseline.md`。
- **`references/dev-baseline.md` (canonical)** 内的副本路径说明更新为 `skills/<skill>/`。
- **`docs/onboarding.md`** 安装命令同步更新,2 处 lang-conventions.md 路径更新为 `skills/dev-code-review/references/lang-conventions.md`。

### Added
- **`.claude-plugin/marketplace.json`** —— Claude Code 原生 marketplace manifest。声明本仓库提供 1 个 plugin(`dev-skills`),plugin 内含 4 个 skill。owner / plugins[] 结构对齐 Claude Code 官方 schema,支持 `/plugin marketplace add` + `/plugin install` 流程。
- **`.claude-plugin/plugin.json`** —— Claude Code plugin manifest。声明 plugin metadata(name / version / description / skills 路径),配合 marketplace.json 让 `/plugin install dev-skills` 能拿到完整 plugin 描述。
- **`.github/workflows/validate.yml`** —— GitHub Actions CI,推 PR / push 主分支时自动验证:
   - 每个 SKILL.md 有 `name` + `description` 必填项
   - 5 处 dev-baseline.md 副本 md5 一致(防漂移)
   - `.claude-plugin/marketplace.json` 和 `plugin.json` 结构合法(top-level `name` / `owner.name` / `plugins[]`,plugin 必有 `name` + `source`)
   - 4 个预期 skill 目录都存在(skills/dev-code-review 等)
   - 仓库根没有 live `CLAUDE.md` 污染(必须是 `.template`)
- **README 安装段重写为 A/B/C 三种方式**:
   - A — Claude Code 原生 `/plugin marketplace add` + `/plugin install dev-skills`(推荐 Claude Code 用户)
   - B — `npx skills add Jason-chen-coder/dev-skills`(跨 agent CLI 通用,Cursor / Codex / Gemini 等)
   - C — 手动 `git clone` 到 `.claude/skills/`(无 npx / 内网场景兜底)

### Promoted from draft to stable
- `dev-commit-writer` / `dev-spec` / `dev-plan` 三个 skill 在 0.2.0–0.3.0 期间标记为 draft。**0.4.0 起统一去掉 draft 标签**,4 个 skill 全部以 stable 状态发布。原因:
   - SKILL.md 已完整(Step 0-N 定义清晰)
   - 每个 skill 都有 examples.md(2-5 个真实样例)
   - calibration-cases.md 覆盖 4 个 skill 的判定边界
   - 共享 baseline + 团队治理文档完整
- 仍欢迎在真实工作流中提 issue —— stable 不意味着「不会再改」,而是「可以放心装来用」。

### Notes
- 5 个 baseline 副本 md5 重新对齐到 `487fb5f8...`。
- skill 内容、行为逻辑无变化 —— 只是结构和 metadata 调整 + 状态标签从 draft → stable。
- 升级用户(从 0.3.x 到 0.4.0)需要重新跑一次 `npx skills add`,因为 skill 路径变了。

---

## [0.3.1] — 2026-04-29

仓库全量审计后的 stale / broken / 缺漏修复。无功能变更,只对齐文档。

### Fixed
- 9 处「三处 / 三个 skill」stale references 全部改为「四处 / 四个」并补 `dev-plan`(`README.md` / `CONTRIBUTING.md` / `CHANGELOG.md` 0.3.0 entry / `docs/onboarding.md` / 5 处 `dev-baseline.md` 副本)。
- `CONTRIBUTING.md` 第 57-62 行 baseline 同步副本清单补 `dev-plan/references/dev-baseline.md`(原本只列 3 处)。
- `docs/onboarding.md` 修两处 broken path:`references/lang-conventions.md` → `dev-code-review/references/lang-conventions.md`(该文件只在 dev-code-review 子目录,不在仓库根)。
- `docs/onboarding.md` 「三个 skill 怎么选」表格补 `dev-plan` 行,标题改为「四个 skill 怎么选」。
- `dev-code-review/SKILL.md` description 过时排除条款改为反映当前 skill landscape(指向 dev-commit-writer / dev-spec / dev-plan)。
- `references/dev-baseline.md` line 58 措辞改为「在 `Step 0 — Load baseline` 段引用」(原写「在 Step 1 之前」与 SKILL.md 实际的 Step 0 名称不一致)。

### Added
- `dev-commit-writer/examples.md` 新增。5 个样例覆盖单一意图、意图歧义多候选、scope creep + Incidental 段、风格采样不足退回 conventional commits、中文项目跟随仓库语言。补齐唯一缺 examples.md 的 skill。
- `references/calibration-cases.md` 新增 4 个 case:7-8 是 dev-spec ambiguity 评分校准(完整需求低分 / 模糊需求高分 + Goal 最弱),9-10 是 dev-plan Critic verdict 校准(应 APPROVED 的好 plan / 应 REJECT 的典型坏 plan)。Calibration session 流程同步改为分 skill 计时(commit-review 30min / spec 15min / plan 15min)。
- `CLAUDE.md` §2 Workflow 新增「设计前置(skill 工具链)」段:复杂改动必须过 dev-spec + dev-plan --deliberate;常规改动建议过 dev-spec;一句话改动跳过但必须过 dev-code-review。

### Changed
- `dev-code-review/SKILL.md` argument-hint 改为 `--flag` 风格:`[--staged] [--path=<glob>]`(原 positional `[optional: 'staged' or path]`)。Step 1 Scope rules 同步识别 `--staged` 和 `--path=<glob>`。
- `dev-commit-writer/SKILL.md` argument-hint 同上改为 `[--staged] [--path=<glob>]`。Step 1 Scope rules 同步。
- 4 个 SKILL.md 的 argument-hint 风格现已统一为 `--flag` 格式。
- `README.md` 更新:
  - tagline 从「review、PR 描述、需求对齐」改为反映当前 4 skill 全链路覆盖。
  - 顶部加入新成员 / 团队 leader 双指引。
  - Skills 段标题加「(当前 4 个)」明示数量。
  - 设计原则段补充反向标准条目(链 CONTRIBUTING.md)。
  - 团队治理表加入 `dev-code-review/references/lang-conventions.md` 行(原本只在 SKILL.md 内引用)。
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
- 不修改 `dev-code-review` / `dev-commit-writer`(保持紧凑 scope)。dev-code-review 评审时若发现仓库存在相关 plan,**用户**可手动指给它作为意图参考;skill 本身不自动加载 plan。
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
- 不涉及 dev-code-review / dev-commit-writer。
- 用户安装的 `dev-spec` 副本要求重新拉取或同步 `references/dev-baseline.md` 不变。

---

## [0.1.0] — 2026-04-29

### Added
- 初始 scaffold,3 个 skill:
  - `dev-code-review`(commit 前 5 轴评审 + commit message 生成)
  - `dev-commit-writer` *(draft)*(只生成 commit message,不评审)
  - `dev-spec` *(draft)*(模糊需求 → 结构化设计文档)
- 共享行为基线 `references/dev-baseline.md`(Karpathy 四原则本地化:不假设 / 最小代码 / 外科手术式改动 / 可验证成功标准)。
- 每个 skill 携带 baseline 副本,保证单独安装时自包含。
- `dev-code-review/examples.md`(5 个真实场景报告样例)。
- `dev-spec/examples.md`(3 个 fuzzy → spec 样例)。
- `dev-code-review/references/lang-conventions.md`(10 种语言的规范检查点)。

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
