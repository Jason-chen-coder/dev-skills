# Contributing to dev-skills

本仓库是团队工程规范的载体。修改流程比代码仓库**严一些**,因为规范一变,所有依赖它的工作都会被影响。

---

## 决策树:你想做什么?

| 场景 | 走哪条路径 |
|---|---|
| 修 typo / 格式 / 链接 | 直接 PR,不需要 issue |
| 改某个 skill 的 SKILL.md(规则、流程、报告模板) | 先开 issue 讨论,再 PR |
| 改 `references/dev-baseline.md`(贯穿所有 skill) | 先开 issue,需要 ≥ 2 人讨论达成一致后再 PR |
| 改 `CLAUDE.md`(团队约定) | 先开 issue,leader approval |
| 新增 skill | 先开 issue,讨论触发时机和与现有 skill 的边界,再 PR |
| 删除 skill | 先开 issue,说明替代方案 |
| 改 examples / calibration cases | 直接 PR |

---

## 新增 skill 的提议模板

在 issue 里回答以下 7 个问题。**任何一项答不上来就不该做这个 skill。**

1. **触发时机一句话** —— 用户说什么 / 处于什么状态时应该用这个 skill?
2. **和现有 skill 的边界** —— 会不会和 `dev-commit-review` / `dev-commit-writer` / `dev-spec` 抢触发?
3. **频次** —— 团队成员每周用几次?低于 1 次就不该做。
4. **流程步骤** —— 至少 5 步,每步是什么。低于 5 步说明这件事不够 standardized,直接放 CLAUDE.md 即可。
5. **输出格式** —— 报告 / 文档 / message?固定模板长什么样?
6. **可验证的成功标准** —— skill 跑完怎么算「做对了」?
7. **反向边界** —— 哪些情况**不该**用这个 skill?

---

## 不该做成 skill 的事

是的,有反向标准。下面这些**直接放 CLAUDE.md 或个人记事本**,不要做 skill:

- 一次性 chore(给某个文件加 license header、批量改一次命名)
- 个人偏好(用 vim 还是 vscode、tab 还是 space —— editorconfig 解决)
- 不在 git 工作流里的事(主持站会、写周报、整理需求会议纪要)
- 「让 Claude 帮我想一下」类的开放性头脑风暴 —— 没有 standardized 流程
- 已经被 lint / formatter / CI 自动化解决的事(skill 不要重复 lint 的工作)
- 频次 < 每月 1 次的低频任务
- 跨团队、不同场景下流程不一样的事(每个团队都不一样的不该是 skill)

> 黄金问题:**「能不能写下来一个固定流程,任何团队成员对任何输入跑都得到风格一致的产出?」** 答不上来就不该做 skill。

---

## 修改 baseline 的特殊流程

`references/dev-baseline.md` 一改,所有 skill 行为都跟着变。流程:

1. **issue 必填**:为什么要改、改了之后所有 skill 的行为变化预期、是否需要同步改 SKILL.md。
2. **PR 描述必含**:before / after 对比、影响哪些 skill、是否需要 calibration session 重做。
3. **同步副本**:改根目录 `/references/dev-baseline.md` 后,**必须**同步到四处 skill 副本:
   - `skills/dev-commit-review/references/dev-baseline.md`
   - `skills/dev-commit-writer/references/dev-baseline.md`
   - `skills/dev-spec/references/dev-baseline.md`
   - `skills/dev-plan/references/dev-baseline.md`
4. **CHANGELOG 必填**:在 `CHANGELOG.md` 加 entry。
5. **通知**:merge 后在团队群通知,并附 PR 链接。

---

## 评审流程

| 改动类型 | Approval 数 | 评审人 |
|---|---|---|
| typo / 格式 | 1 | 任何团队成员 |
| skill 内部规则 | 1 | 该 skill 的 maintainer 或 leader |
| baseline | 2 | leader + 1 个高频用户 |
| CLAUDE.md | 2 | leader 必须在内 |
| 新 skill | 2 | leader + 1 |

---

## 与 skill 输出有分歧时

skill 是工具,不是判官。如果你认为 skill 的判定有问题:

1. **当下不一致**:在 PR 里覆盖 skill 的判定,**附一句解释为什么**。reviewer 看到这条解释来判断。
2. **反复出现**:可能是 skill 规则有 bug 或团队约定漂移了。开 issue 讨论。
3. **不要在沉默中无视 skill** —— 这会让规范快速失效。

---

## 维护节奏

- **每月**:leader 扫一遍 issue,关掉 stale,把高优 PR 合掉。
- **每季度**:跑一次 calibration(参见 `references/calibration-cases.md`),对照团队判定一致性。漂移 > 30% 的 case 需要重新讨论 baseline。
- **每年**:整体 retro —— 哪些 skill 用得多 / 没人用 / 该删该改。
