# Onboarding — dev-skills

新加入团队?这一页带你 30 分钟内跑起来。

---

## 60 秒了解这是什么

dev-skills 是团队的工程规范载体。它有两层:

- **行为基线**(`references/dev-baseline.md` + `CLAUDE.md`):你写代码时**永远在背景**生效的规则。
- **场景 skill**(`dev-commit-review` / `dev-commit-writer` / `dev-spec`):特定时机用 Claude 跑的检查工具。

不是替代你思考的工具,是**让你不用每次都重新想团队约定**的工具。

---

## 安装(5 分钟)

### Claude Code 用户

```bash
# 项目级全量安装(推荐 — 进版本控制,团队共享)
npx skills add Jason-chen-coder/dev-skills

# 或全局安装(个人偏好,所有项目都生效)
npx skills add Jason-chen-coder/dev-skills --global

# 验证
ls .claude/skills/    # 项目级
# 应看到 dev-commit-review / dev-commit-writer / dev-spec / dev-plan 四个目录
```

如果团队 fork 到了别的 owner,把 `Jason-chen-coder` 替换成实际 owner。

**别忘了 CLAUDE.md** —— skill 不会自动把团队级 always-on 文件复制到你项目根。第一次装完跑一次:

```bash
curl -O https://raw.githubusercontent.com/Jason-chen-coder/dev-skills/main/CLAUDE.md.template
mv CLAUDE.md.template CLAUDE.md   # 重命名后按 <!-- team:fill --> 填团队约定
```

### 其他 agent CLI(Cursor / Codex / Gemini CLI)

skill 是纯 Markdown,可以手动复制 SKILL.md 内容到对应工具的 system prompt 或 rules 区。具体路径问 leader。

---

## 第一次跑(15 分钟)

跑通一遍最常用的 `dev-commit-review`:

1. 在任何项目里**故意做一个改动**(比如新增一个函数)。
2. 别 commit,先在 Claude Code 里说:

   > 准备 commit,review 一下

3. Claude 会调用 dev-commit-review,产出一份结构化报告:

   ```
   ━━━ Dev Commit Review ━━━
   Verdict   : ✅ READY  /  ⚠ FIX P1  /  ❌ BLOCK
   ...
   ```

4. **照报告改**(如果有 P0/P1)。
5. 改完再跑一次,直到 `✅ READY`,然后照报告里的 commit message commit。

**第一次完整跑下来你就懂了。**

---

## 四个 skill 怎么选

| 我想… | 用哪个 |
|---|---|
| 写代码前对模糊需求做对齐 | `dev-spec` |
| 需求已对齐,要把 spec 转成 Critic-approved 的实施 plan(尤其复杂功能 / 高风险改动) | `dev-plan` |
| 写完代码,commit 前要严格把关 | `dev-commit-review` |
| 改动很简单 / 已自审过,只想要个 commit message | `dev-commit-writer` |

`dev-commit-review` 和 `dev-commit-writer` 是**二选一**,不要都跑。
`dev-spec → dev-plan` 是松耦合衔接 —— spec 写完后用户决定要不要进 plan,简单功能可直接进编码,不强制。

---

## 必读文档(按顺序看,~20 分钟)

1. [`README.md`](../README.md) —— 整体结构 5 分钟。
2. [`references/dev-baseline.md`](../references/dev-baseline.md) —— 四条基线原则 5 分钟。
3. [`CLAUDE.md.template`](../CLAUDE.md.template) —— 团队特有约定 5 分钟(注意:需复制到项目根并改名为 `CLAUDE.md` 才生效)。
4. 你日常会用的 skill 的 SKILL.md(选你感兴趣的一个先读) —— 5 分钟。

后续按需查阅:
- `references/team-conventions.md` —— 写到具体语言时查。
- `skills/dev-commit-review/references/lang-conventions.md` —— 跨语言通用规范(dev-commit-review 专属)。
- `references/calibration-cases.md` —— 想理解 P0 / P1 / P2 边界 / dev-spec ambiguity 评分 / dev-plan Critic verdict 边界时看。

---

## 常见 pitfall(踩坑预警)

**「Claude 报了一堆 P2,我都要修吗?」**
不。P2 是可选的,**你可以选择不修但要在 PR 里一句话解释**(例如「P2 注释问题暂不处理,本 commit 仅修 bug」)。P0 / P1 必须处理。

**「Claude 说 `❌ BLOCK` 但我觉得没问题」**
两步走:(1) 确认你不是漏看了 baseline / CLAUDE.md 的某条硬规则(尤其 secret / 闭环);(2) 如果你确信 skill 判错了,在 PR 里覆盖判定 + 解释,然后开 issue 反馈这个 case。

**「skill 没识别出我用的语言怎么办?」**
`skills/dev-commit-review/references/lang-conventions.md` 里有「其他语言」段落兜底。如果你常用某语言但 conventions 不全,提 PR 补。

**「我的改动跨了 5 个文件,review 报告太长」**
拆 commit。如果一个 commit 跨太多文件,基本说明 scope creep —— 这本身就是 dev-commit-review 想拦的。

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

- 至少跑 3 次 `dev-commit-review`,熟悉报告格式。
- 至少跑 1 次 `dev-spec`,体验 Step 1 的歧义清单(很多人这一步会「啊原来我没想清楚」)。
- 把 [`references/calibration-cases.md`](../references/calibration-cases.md) 的 10 个 case 自己跑一遍(dev-commit-review × 6 / dev-spec × 2 / dev-plan × 2),对照 canonical answer,**这是最快内化 baseline 的方式**。

---

> 卡住超过 30 分钟一定要问。规范是为了减少摩擦,不是制造摩擦。
