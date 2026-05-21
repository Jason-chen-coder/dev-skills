const LANGUAGE_STORAGE_KEY = "dev-skills-language";
const SUPPORTED_LANGUAGES = ["zh", "en"];

const translations = {
  zh: {
    "page.lang": "zh-CN",
    "page.title": "dev-skills - AI 开发工作流 Skill 库",
    "page.description": "9 个 AI 开发 skill,加上短版 always-on 规则、baseline rationale 和 team policy guide,串起需求对齐、实施方案、TDD、Bug 修复、验证、代码评审和分支收尾。",
    "brand.aria": "dev-skills 首页",
    "nav.aria": "主导航",
    "nav.skills": "Skills",
    "nav.rules": "Rules",
    "nav.preview": "Preview",
    "nav.workflow": "Workflow",
    "nav.install": "Install",
    "nav.github": "GitHub",
    "nav.open": "打开导航菜单",
    "nav.close": "关闭导航菜单",
    "language.label": "语言切换",
    "language.zh": "中文",
    "language.en": "EN",
    "hero.eyebrow": "AI development workflow skills",
    "hero.title": "从需求到提交,<br>每步可验证。",
    "hero.text": "dev-skills 为 Claude Code 与 Codex 提供 9 个工程流程 skill 和精简 always-on 团队规则,让需求、实现、验证、评审与收尾都有清晰边界和可复核结果。",
    "hero.actions.label": "主要操作",
    "hero.install": "Install",
    "hero.preview": "Preview",
    "hero.github": "GitHub",
    "hero.install.aria": "查看安装方式",
    "hero.preview.aria": "查看 skill 运行预览",
    "hero.github.aria": "打开 GitHub 仓库",
    "hero.preview.ariaLabel": "dev-skills 工作流预览",
    "hero.terminal": "$ codex\n> 用 dev-auto 帮我串起来,下一步该做什么?\n\n━━━ Dev Auto ━━━\n路径   : feature\n复杂度 : moderate\n下一步 : dev-spec --default user-export",
    "skills.eyebrow": "Skill library",
    "skills.title": "9 个 skill,每个只做一件事。",
    "skills.text": "把它当成开发导航:不确定下一步就问 dev-auto。做新功能从 dev-spec 开始,再到 plan、TDD、verify、review、finish;修 bug 从 dev-fix 开始,同样经过 verify 和 review 收尾;只需要提交信息时用 dev-commit-writer。",
    "skills.list.aria": "dev-skills 列表",
    "skill.auto.kicker": "入口推荐",
    "skill.auto.desc": "不知道下一步该跑哪个时,扫描 artifacts 并推荐下一条命令。",
    "skill.spec.kicker": "需求对齐",
    "skill.spec.desc": "先暴露歧义,再把模糊需求整理成 scope、风险和验收标准。",
    "skill.plan.kicker": "实施方案",
    "skill.plan.desc": "把 spec 转成 RALPLAN-DR 方案,包含选项、ADR 和 Critic 验证。",
    "skill.tdd.kicker": "红绿重构",
    "skill.tdd.desc": "写生产代码前先定义行为测试,按 red -> green -> refactor 收敛。",
    "skill.fix.kicker": "Bug 修复",
    "skill.fix.desc": "以 failing test 和 root cause 为核心,避免猜测式 symptom patch。",
    "skill.verify.kicker": "完成门禁",
    "skill.verify.desc": "声称完成前补齐 fresh evidence,把“应该可以”变成可验证结果。",
    "skill.review.kicker": "提交前 review",
    "skill.review.desc": "按规范、功能、闭环、注释、废码 5 轴检查当前 diff。",
    "skill.commit.kicker": "提交信息",
    "skill.commit.desc": "只在明确跳过 review 且只要 message 时,生成符合仓库风格的提交信息。",
    "skill.finish.kicker": "分支收尾",
    "skill.finish.desc": "验证和 review 后处理 PR、merge、keep 或 discard,避免口头收尾。",
    "skill.artifact.none": "Artifact: none",
    "skill.artifact.design": "Artifact: designs/<slug>.md",
    "skill.artifact.plan": "Artifact: plans/<slug>.md",
    "skill.artifact.fix": "Artifact: fixes/<slug>.md",
    "rules.eyebrow": "Rules layer",
    "rules.title": "常驻规则变短,解释和政策各归其位。",
    "rules.text": "这次更新把模板从团队治理手册压回 agent 必须常驻读取的短规则,同时新增 rationale 和 policy 文档,让规则可解释、可传播、可维护。",
    "rules.list.aria": "dev-skills 规则层",
    "rules.always.label": "Always-on",
    "rules.always.desc": "短版团队规则,只保留 baseline、硬规则、agent 工作方式、skill 路由和少量 team-specific placeholder。",
    "rules.why.label": "Why",
    "rules.why.desc": "逐条解释“不假设、最小代码、外科手术式、可验证成功标准”关闭的失败模式。",
    "rules.policy.label": "Policy",
    "rules.policy.desc": "承接分支、PR、测试、错误处理、日志、feature flag 和 AI 协作护栏等详细治理说明。",
    "preview.eyebrow": "Runtime preview",
    "preview.title": "像真实 Codex CLI 一样看 skill 怎么跑。",
    "preview.text": "切换 tab 查看用户输入和代表性输出。左侧输入会播放打字机效果;开启减少动效时直接显示完整文本。",
    "preview.tabs.aria": "Skill 运行预览",
    "preview.input.aria": "Codex CLI 输入预览",
    "workflow.eyebrow": "Workflow",
    "workflow.title": "纵向流程图,三条分支最后汇合到验证、评审和提交。",
    "workflow.feature.heading": "功能需求路径",
    "workflow.feature.1": "模糊需求变成 spec",
    "workflow.feature.2": "复杂 / 高风险改动先出实施方案",
    "workflow.feature.3": "red -> green -> refactor",
    "workflow.feature.4": "完成前证据门禁",
    "workflow.feature.5": "提交前 5 轴检查",
    "workflow.feature.6": "需要时生成 commit message",
    "workflow.feature.7": "READY 后提交",
    "workflow.feature.8": "分支 / PR / 收尾决策",
    "workflow.bug.heading": "问题修复路径",
    "workflow.bug.1": "复现、假设、定位 root cause",
    "workflow.bug.2": "完成前证据门禁",
    "workflow.bug.3": "确认无回归和夹带改动",
    "workflow.bug.4": "需要时生成 commit message",
    "workflow.bug.5": "记录修复上下文",
    "workflow.bug.6": "分支 / PR / 收尾决策",
    "workflow.hotfix.heading": "快速小改路径",
    "workflow.hotfix.1": "直接用测试锁住小改动",
    "workflow.hotfix.2": "完成前证据门禁",
    "workflow.hotfix.3": "提交前检查风险",
    "workflow.hotfix.4": "READY 后提交",
    "workflow.hotfix.5": "需要分支收尾时执行",
    "workflow.strong.planOptional": "dev-plan 可选",
    "workflow.strong.commitOptional": "dev-commit-writer 可选",
    "workflow.strong.finishOptional": "dev-finish 可选",
    "workflow.diagram.aria": "dev-skills 简化工作流图,展示 feature、hotfix 和 bug 三条分支如何汇合到验证、评审、提交和收尾",
    "workflow.graph.aria": "Feature、Simple hotfix 和 Bug 三条工作流分支最终汇合到验证、评审、提交和收尾",
    "workflow.fallback": "Feature、Simple hotfix 和 Bug 三条路径最终都会汇合到 dev-verify、dev-code-review、git commit 和 dev-finish。",
    "workflow.node.start.phase": "Start",
    "workflow.node.start.title": "需求进入",
    "workflow.node.start.desc": "feature / hotfix / bug",
    "workflow.node.feature.phase": "Feature",
    "workflow.node.feature.title": "功能需求路径",
    "workflow.node.feature.desc": "dev-spec -> dev-plan -> dev-tdd",
    "workflow.node.hotfix.phase": "Hotfix",
    "workflow.node.hotfix.title": "快速小改路径",
    "workflow.node.hotfix.desc": "dev-tdd",
    "workflow.node.bug.phase": "Bug",
    "workflow.node.bug.title": "问题修复路径",
    "workflow.node.bug.desc": "dev-fix",
    "workflow.node.quality.phase": "Quality",
    "workflow.node.quality.title": "验证与评审",
    "workflow.node.quality.desc": "dev-verify -> dev-code-review",
    "workflow.node.ship.phase": "Ship",
    "workflow.node.ship.title": "提交与收尾",
    "workflow.node.ship.desc": "git commit -> dev-finish",
    "install.eyebrow": "Install and upgrade",
    "install.title": "Claude Code 和 Codex 分开安装。",
    "install.text": "选择你的入口,复制对应命令。升级 skill 不会自动覆盖项目里的短版团队规则模板;详细政策可参考或复制 docs/team-policy.md。",
    "install.tabs.aria": "安装选项",
    "install.copy": "Copy",
    "install.copied": "Copied",
    "install.select": "Select text",
    "install.copy.aria": "复制安装命令",
    "install.claude.notes": "升级: /plugin update dev-skills。短版团队规则复制 CLAUDE.md.template 到项目根 CLAUDE.md;详细政策参考 docs/team-policy.md。",
    "install.codex.notes": "升级: git pull --ff-only 后重新同步 skills/*。短版团队规则复制 AGENTS.md.template 到项目根 AGENTS.md;详细政策参考 docs/team-policy.md。",
    "install.npx.notes": "升级优先使用 npx skills update;如果版本不支持 update,使用 add --force 重新安装。团队规则模板仍需人工同步。",
    "faq.eyebrow": "FAQ",
    "faq.title": "常见问题。",
    "faq.1.summary": "Claude Code 和 Codex 为什么安装方式不一样?",
    "faq.1.answer": "Claude Code 使用 .claude-plugin/ manifest;Codex 当前兼容方式是复制 skills/* 到 $CODEX_HOME/skills。",
    "faq.2.summary": "升级会覆盖我的 CLAUDE.md 或 AGENTS.md 吗?",
    "faq.2.answer": "不会。skill 升级只更新 skill 文件,短版团队规则模板需要人工对比后同步;详细 policy 文档也建议按团队实际情况复制或改写。",
    "faq.3.summary": "docs/why-dev-baseline.md 和 docs/team-policy.md 分别解决什么?",
    "faq.3.answer": "前者解释四条 baseline 背后的失败模式,防止规则变口号;后者放详细团队治理,避免把 always-on 模板写得过长。",
    "faq.4.summary": "什么时候用 dev-auto?",
    "faq.4.answer": "当你不知道下一步跑哪个 skill,或者需要从失败状态恢复时使用。它只建议,不调起其他 skill。",
    "faq.5.summary": "准备 commit 时为什么默认走 dev-code-review?",
    "faq.5.answer": "团队策略是 commit 前先 review。dev-commit-writer 只用于用户明确表示跳过 review 且只要 message 的场景。"
  },
  en: {
    "page.lang": "en",
    "page.title": "dev-skills - AI development workflow skills",
    "page.description": "Nine AI development workflow skills plus concise always-on rules, baseline rationale, and a team policy guide for specs, planning, TDD, bug fixes, verification, review, and branch closure.",
    "brand.aria": "dev-skills home",
    "nav.aria": "Primary navigation",
    "nav.skills": "Skills",
    "nav.rules": "Rules",
    "nav.preview": "Preview",
    "nav.workflow": "Workflow",
    "nav.install": "Install",
    "nav.github": "GitHub",
    "nav.open": "Open navigation menu",
    "nav.close": "Close navigation menu",
    "language.label": "Language",
    "language.zh": "中文",
    "language.en": "EN",
    "hero.eyebrow": "AI development workflow skills",
    "hero.title": "From request to commit,<br>every step verified.",
    "hero.text": "dev-skills gives Claude Code and Codex nine engineering workflow skills plus concise always-on team rules, so requirements, implementation, verification, review, and closure each have clear boundaries and checkable evidence.",
    "hero.actions.label": "Primary actions",
    "hero.install": "Install",
    "hero.preview": "Preview",
    "hero.github": "GitHub",
    "hero.install.aria": "View install options",
    "hero.preview.aria": "View skill runtime previews",
    "hero.github.aria": "Open the GitHub repository",
    "hero.preview.ariaLabel": "dev-skills workflow preview",
    "hero.terminal": "$ codex\n> Use dev-auto to connect the workflow. What should I do next?\n\n━━━ Dev Auto ━━━\nPath       : feature\nComplexity : moderate\nNext       : dev-spec --default user-export",
    "skills.eyebrow": "Skill library",
    "skills.title": "Nine skills, one job each.",
    "skills.text": "Treat it as development navigation: ask dev-auto when the next step is unclear. New features start with dev-spec, then move through plan, TDD, verify, review, and finish. Bugs start with dev-fix, then also pass through verify and review. Use dev-commit-writer only when you just need a commit message.",
    "skills.list.aria": "dev-skills list",
    "skill.auto.kicker": "Entry routing",
    "skill.auto.desc": "Scans artifacts and recommends the next command when you are unsure which skill to run.",
    "skill.spec.kicker": "Requirement alignment",
    "skill.spec.desc": "Surfaces ambiguity first, then turns fuzzy requests into scope, risks, and acceptance criteria.",
    "skill.plan.kicker": "Implementation plan",
    "skill.plan.desc": "Turns a spec into a RALPLAN-DR plan with options, an ADR, and Critic validation.",
    "skill.tdd.kicker": "Red-green-refactor",
    "skill.tdd.desc": "Defines behavior tests before production code and drives work through red -> green -> refactor.",
    "skill.fix.kicker": "Bug fixing",
    "skill.fix.desc": "Centers the work on a failing test and root cause, avoiding guessed symptom patches.",
    "skill.verify.kicker": "Completion gate",
    "skill.verify.desc": "Requires fresh evidence before claiming done, turning “should work” into checkable results.",
    "skill.review.kicker": "Pre-commit review",
    "skill.review.desc": "Reviews the current diff across conventions, behavior, closure, comments, and dead code.",
    "skill.commit.kicker": "Commit message",
    "skill.commit.desc": "Writes a repo-style commit message only when review is explicitly skipped and only a message is requested.",
    "skill.finish.kicker": "Branch closure",
    "skill.finish.desc": "Handles PR, merge, keep, or discard decisions after verification and review.",
    "skill.artifact.none": "Artifact: none",
    "skill.artifact.design": "Artifact: designs/<slug>.md",
    "skill.artifact.plan": "Artifact: plans/<slug>.md",
    "skill.artifact.fix": "Artifact: fixes/<slug>.md",
    "rules.eyebrow": "Rules layer",
    "rules.title": "Short always-on rules, with rationale and policy separated.",
    "rules.text": "The templates are reduced back to the rules agents must always read, while rationale and policy documents explain and carry the broader governance details.",
    "rules.list.aria": "dev-skills rules layer",
    "rules.always.label": "Always-on",
    "rules.always.desc": "Short team rules covering the baseline, hard rules, agent working style, skill routing, and a few team-specific placeholders.",
    "rules.why.label": "Why",
    "rules.why.desc": "Explains the failure modes closed by “do not assume,” minimal code, surgical changes, and verifiable success criteria.",
    "rules.policy.label": "Policy",
    "rules.policy.desc": "Holds detailed governance for branches, PRs, tests, errors, logging, feature flags, and AI collaboration guardrails.",
    "preview.eyebrow": "Runtime preview",
    "preview.title": "See how each skill runs in a Codex CLI-like flow.",
    "preview.text": "Switch tabs to view representative user input and output. The left side uses a typewriter effect; reduced motion shows the full text immediately.",
    "preview.tabs.aria": "Skill runtime previews",
    "preview.input.aria": "Codex CLI input preview",
    "workflow.eyebrow": "Workflow",
    "workflow.title": "A top-down flow where three paths converge into verification, review, and commit.",
    "workflow.feature.heading": "Feature path",
    "workflow.feature.1": "Turn a fuzzy request into a spec",
    "workflow.feature.2": "Plan first for complex or risky changes",
    "workflow.feature.3": "red -> green -> refactor",
    "workflow.feature.4": "Evidence gate before completion",
    "workflow.feature.5": "Five-axis pre-commit review",
    "workflow.feature.6": "Generate a commit message when needed",
    "workflow.feature.7": "Commit once READY",
    "workflow.feature.8": "Decide branch / PR / closure",
    "workflow.bug.heading": "Bug path",
    "workflow.bug.1": "Reproduce, form hypotheses, locate root cause",
    "workflow.bug.2": "Evidence gate before completion",
    "workflow.bug.3": "Confirm no regression or unrelated changes",
    "workflow.bug.4": "Generate a commit message when needed",
    "workflow.bug.5": "Record the fix context",
    "workflow.bug.6": "Decide branch / PR / closure",
    "workflow.hotfix.heading": "Simple hotfix",
    "workflow.hotfix.1": "Lock a small change with tests immediately",
    "workflow.hotfix.2": "Evidence gate before completion",
    "workflow.hotfix.3": "Check risk before commit",
    "workflow.hotfix.4": "Commit once READY",
    "workflow.hotfix.5": "Run closure when branch cleanup is needed",
    "workflow.strong.planOptional": "dev-plan optional",
    "workflow.strong.commitOptional": "dev-commit-writer optional",
    "workflow.strong.finishOptional": "dev-finish optional",
    "workflow.diagram.aria": "Simplified dev-skills workflow diagram showing feature, hotfix, and bug paths converging into verification, review, commit, and closure",
    "workflow.graph.aria": "Feature, simple hotfix, and bug paths converge into verification, review, commit, and closure",
    "workflow.fallback": "Feature, simple hotfix, and bug paths all converge into dev-verify, dev-code-review, git commit, and dev-finish.",
    "workflow.node.start.phase": "Start",
    "workflow.node.start.title": "Request intake",
    "workflow.node.start.desc": "feature / hotfix / bug",
    "workflow.node.feature.phase": "Feature",
    "workflow.node.feature.title": "Feature path",
    "workflow.node.feature.desc": "dev-spec -> dev-plan -> dev-tdd",
    "workflow.node.hotfix.phase": "Hotfix",
    "workflow.node.hotfix.title": "Simple hotfix",
    "workflow.node.hotfix.desc": "dev-tdd",
    "workflow.node.bug.phase": "Bug",
    "workflow.node.bug.title": "Bug path",
    "workflow.node.bug.desc": "dev-fix",
    "workflow.node.quality.phase": "Quality",
    "workflow.node.quality.title": "Verify & Review",
    "workflow.node.quality.desc": "dev-verify -> dev-code-review",
    "workflow.node.ship.phase": "Ship",
    "workflow.node.ship.title": "Commit & Finish",
    "workflow.node.ship.desc": "git commit -> dev-finish",
    "install.eyebrow": "Install and upgrade",
    "install.title": "Claude Code and Codex install separately.",
    "install.text": "Choose your entry point and copy the command. Upgrading skills does not automatically overwrite the short team-rule templates in your project; use docs/team-policy.md for the detailed policy.",
    "install.tabs.aria": "Install options",
    "install.copy": "Copy",
    "install.copied": "Copied",
    "install.select": "Select text",
    "install.copy.aria": "Copy install command",
    "install.claude.notes": "Upgrade with /plugin update dev-skills. Copy CLAUDE.md.template to CLAUDE.md at your project root; use docs/team-policy.md for the detailed policy.",
    "install.codex.notes": "Upgrade by running git pull --ff-only and syncing skills/* again. Copy AGENTS.md.template to AGENTS.md at your project root; use docs/team-policy.md for the detailed policy.",
    "install.npx.notes": "Prefer npx skills update for upgrades. If your version does not support update, reinstall with add --force. Team-rule templates still need manual sync.",
    "faq.eyebrow": "FAQ",
    "faq.title": "Common questions.",
    "faq.1.summary": "Why are Claude Code and Codex installed differently?",
    "faq.1.answer": "Claude Code uses the .claude-plugin/ manifest. Codex currently works by copying skills/* into $CODEX_HOME/skills.",
    "faq.2.summary": "Will upgrading overwrite my CLAUDE.md or AGENTS.md?",
    "faq.2.answer": "No. Skill upgrades only update skill files. Short team-rule templates should be compared and synced manually; the detailed policy doc should also be copied or adapted to your team.",
    "faq.3.summary": "What do docs/why-dev-baseline.md and docs/team-policy.md do?",
    "faq.3.answer": "The first explains the failure modes behind the four baseline rules, so they do not become slogans. The second holds detailed governance that would make always-on templates too long.",
    "faq.4.summary": "When should I use dev-auto?",
    "faq.4.answer": "Use it when you are unsure which skill comes next, or when you need to recover from a failed state. It recommends only; it does not invoke other skills.",
    "faq.5.summary": "Why does commit preparation default to dev-code-review?",
    "faq.5.answer": "The team policy is to review before committing. dev-commit-writer is only for cases where the user explicitly skips review and asks only for a message."
  }
};

let currentLanguage = getInitialLanguage();

const localizedTargets = [
  { selector: ".brand", key: "brand.aria", attr: "aria-label" },
  { selector: ".nav-links", key: "nav.aria", attr: "aria-label" },
  { selector: ".nav-links a[href='#skills']", key: "nav.skills" },
  { selector: ".nav-links a[href='#rules']", key: "nav.rules" },
  { selector: ".nav-links a[href='#preview']", key: "nav.preview" },
  { selector: ".nav-links a[href='#workflow']", key: "nav.workflow" },
  { selector: ".nav-links a[href='#install']", key: "nav.install" },
  { selector: ".nav-links a[href^='https://github.com']", key: "nav.github" },
  { selector: ".language-switch", key: "language.label", attr: "aria-label" },
  { selector: ".hero .eyebrow", key: "hero.eyebrow" },
  { selector: ".hero h1", key: "hero.title", html: true },
  { selector: ".hero-text", key: "hero.text" },
  { selector: ".hero-actions", key: "hero.actions.label", attr: "aria-label" },
  { selector: ".hero-actions .primary", key: "hero.install" },
  { selector: ".hero-actions .primary", key: "hero.install.aria", attr: "aria-label" },
  { selector: ".hero-actions .secondary", key: "hero.preview" },
  { selector: ".hero-actions .secondary", key: "hero.preview.aria", attr: "aria-label" },
  { selector: ".hero-actions .ghost", key: "hero.github" },
  { selector: ".hero-actions .ghost", key: "hero.github.aria", attr: "aria-label" },
  { selector: ".hero-preview", key: "hero.preview.ariaLabel", attr: "aria-label" },
  { selector: ".hero-terminal code", key: "hero.terminal" },
  { selector: "#skills .section-heading .eyebrow", key: "skills.eyebrow" },
  { selector: "#skills .section-heading h2", key: "skills.title" },
  { selector: "#skills .section-heading p:last-child", key: "skills.text" },
  { selector: ".skill-grid", key: "skills.list.aria", attr: "aria-label" },
  { selector: ".skill-card:nth-child(1) .skill-kicker", key: "skill.auto.kicker" },
  { selector: ".skill-card:nth-child(1) p", key: "skill.auto.desc" },
  { selector: ".skill-card:nth-child(1) small", key: "skill.artifact.none" },
  { selector: ".skill-card:nth-child(2) .skill-kicker", key: "skill.spec.kicker" },
  { selector: ".skill-card:nth-child(2) p", key: "skill.spec.desc" },
  { selector: ".skill-card:nth-child(2) small", key: "skill.artifact.design" },
  { selector: ".skill-card:nth-child(3) .skill-kicker", key: "skill.plan.kicker" },
  { selector: ".skill-card:nth-child(3) p", key: "skill.plan.desc" },
  { selector: ".skill-card:nth-child(3) small", key: "skill.artifact.plan" },
  { selector: ".skill-card:nth-child(4) .skill-kicker", key: "skill.tdd.kicker" },
  { selector: ".skill-card:nth-child(4) p", key: "skill.tdd.desc" },
  { selector: ".skill-card:nth-child(4) small", key: "skill.artifact.none" },
  { selector: ".skill-card:nth-child(5) .skill-kicker", key: "skill.fix.kicker" },
  { selector: ".skill-card:nth-child(5) p", key: "skill.fix.desc" },
  { selector: ".skill-card:nth-child(5) small", key: "skill.artifact.fix" },
  { selector: ".skill-card:nth-child(6) .skill-kicker", key: "skill.verify.kicker" },
  { selector: ".skill-card:nth-child(6) p", key: "skill.verify.desc" },
  { selector: ".skill-card:nth-child(6) small", key: "skill.artifact.none" },
  { selector: ".skill-card:nth-child(7) .skill-kicker", key: "skill.review.kicker" },
  { selector: ".skill-card:nth-child(7) p", key: "skill.review.desc" },
  { selector: ".skill-card:nth-child(7) small", key: "skill.artifact.none" },
  { selector: ".skill-card:nth-child(8) .skill-kicker", key: "skill.commit.kicker" },
  { selector: ".skill-card:nth-child(8) p", key: "skill.commit.desc" },
  { selector: ".skill-card:nth-child(8) small", key: "skill.artifact.none" },
  { selector: ".skill-card:nth-child(9) .skill-kicker", key: "skill.finish.kicker" },
  { selector: ".skill-card:nth-child(9) p", key: "skill.finish.desc" },
  { selector: ".skill-card:nth-child(9) small", key: "skill.artifact.none" },
  { selector: "#rules .section-heading .eyebrow", key: "rules.eyebrow" },
  { selector: "#rules .section-heading h2", key: "rules.title" },
  { selector: "#rules .section-heading p:last-child", key: "rules.text" },
  { selector: ".rules-grid", key: "rules.list.aria", attr: "aria-label" },
  { selector: ".rule-card:nth-child(1) span", key: "rules.always.label" },
  { selector: ".rule-card:nth-child(1) p", key: "rules.always.desc" },
  { selector: ".rule-card:nth-child(2) span", key: "rules.why.label" },
  { selector: ".rule-card:nth-child(2) p", key: "rules.why.desc" },
  { selector: ".rule-card:nth-child(3) span", key: "rules.policy.label" },
  { selector: ".rule-card:nth-child(3) p", key: "rules.policy.desc" },
  { selector: "#preview .section-heading .eyebrow", key: "preview.eyebrow" },
  { selector: "#preview .section-heading h2", key: "preview.title" },
  { selector: "#preview .section-heading p:last-child", key: "preview.text" },
  { selector: ".skill-tabs", key: "preview.tabs.aria", attr: "aria-label" },
  { selector: ".terminal-panel", key: "preview.input.aria", attr: "aria-label" },
  { selector: "#workflow .section-heading .eyebrow", key: "workflow.eyebrow" },
  { selector: "#workflow .section-heading h2", key: "workflow.title" },
  { selector: ".workflow-path:nth-child(1) h3", key: "workflow.feature.heading" },
  { selector: ".workflow-path:nth-child(1) li:nth-child(1) span", key: "workflow.feature.1" },
  { selector: ".workflow-path:nth-child(1) li:nth-child(2) strong", key: "workflow.strong.planOptional" },
  { selector: ".workflow-path:nth-child(1) li:nth-child(2) span", key: "workflow.feature.2" },
  { selector: ".workflow-path:nth-child(1) li:nth-child(3) span", key: "workflow.feature.3" },
  { selector: ".workflow-path:nth-child(1) li:nth-child(4) span", key: "workflow.feature.4" },
  { selector: ".workflow-path:nth-child(1) li:nth-child(5) span", key: "workflow.feature.5" },
  { selector: ".workflow-path:nth-child(1) li:nth-child(6) strong", key: "workflow.strong.commitOptional" },
  { selector: ".workflow-path:nth-child(1) li:nth-child(6) span", key: "workflow.feature.6" },
  { selector: ".workflow-path:nth-child(1) li:nth-child(7) span", key: "workflow.feature.7" },
  { selector: ".workflow-path:nth-child(1) li:nth-child(8) span", key: "workflow.feature.8" },
  { selector: ".workflow-path:nth-child(2) h3", key: "workflow.bug.heading" },
  { selector: ".workflow-path:nth-child(2) li:nth-child(1) span", key: "workflow.bug.1" },
  { selector: ".workflow-path:nth-child(2) li:nth-child(2) span", key: "workflow.bug.2" },
  { selector: ".workflow-path:nth-child(2) li:nth-child(3) span", key: "workflow.bug.3" },
  { selector: ".workflow-path:nth-child(2) li:nth-child(4) strong", key: "workflow.strong.commitOptional" },
  { selector: ".workflow-path:nth-child(2) li:nth-child(4) span", key: "workflow.bug.4" },
  { selector: ".workflow-path:nth-child(2) li:nth-child(5) span", key: "workflow.bug.5" },
  { selector: ".workflow-path:nth-child(2) li:nth-child(6) span", key: "workflow.bug.6" },
  { selector: ".workflow-path:nth-child(3) h3", key: "workflow.hotfix.heading" },
  { selector: ".workflow-path:nth-child(3) li:nth-child(1) span", key: "workflow.hotfix.1" },
  { selector: ".workflow-path:nth-child(3) li:nth-child(2) span", key: "workflow.hotfix.2" },
  { selector: ".workflow-path:nth-child(3) li:nth-child(3) span", key: "workflow.hotfix.3" },
  { selector: ".workflow-path:nth-child(3) li:nth-child(4) span", key: "workflow.hotfix.4" },
  { selector: ".workflow-path:nth-child(3) li:nth-child(5) strong", key: "workflow.strong.finishOptional" },
  { selector: ".workflow-path:nth-child(3) li:nth-child(5) span", key: "workflow.hotfix.5" },
  { selector: ".workflow-diagram", key: "workflow.diagram.aria", attr: "aria-label" },
  { selector: "#workflow-graph", key: "workflow.graph.aria", attr: "aria-label" },
  { selector: ".workflow-graph-fallback", key: "workflow.fallback" },
  { selector: "#install .section-heading .eyebrow", key: "install.eyebrow" },
  { selector: "#install .section-heading h2", key: "install.title" },
  { selector: "#install .section-heading p:last-child", key: "install.text" },
  { selector: ".install-tabs", key: "install.tabs.aria", attr: "aria-label" },
  { selector: ".copy-button", key: "install.copy" },
  { selector: ".copy-button", key: "install.copy.aria", attr: "aria-label" },
  { selector: "#faq .section-heading .eyebrow", key: "faq.eyebrow" },
  { selector: "#faq .section-heading h2", key: "faq.title" },
  { selector: ".faq-list details:nth-child(1) summary", key: "faq.1.summary" },
  { selector: ".faq-list details:nth-child(1) p", key: "faq.1.answer" },
  { selector: ".faq-list details:nth-child(2) summary", key: "faq.2.summary" },
  { selector: ".faq-list details:nth-child(2) p", key: "faq.2.answer" },
  { selector: ".faq-list details:nth-child(3) summary", key: "faq.3.summary" },
  { selector: ".faq-list details:nth-child(3) p", key: "faq.3.answer" },
  { selector: ".faq-list details:nth-child(4) summary", key: "faq.4.summary" },
  { selector: ".faq-list details:nth-child(4) p", key: "faq.4.answer" },
  { selector: ".faq-list details:nth-child(5) summary", key: "faq.5.summary" },
  { selector: ".faq-list details:nth-child(5) p", key: "faq.5.answer" }
];

const skillPreviews = {
  zh: {
    "dev-auto": {
      title: "Dev Auto",
      input: "$ codex\n> 用 dev-auto 帮我串起来,下一步该做什么?",
      output: "━━━ Dev Auto ━━━\n路径   : feature\n复杂度 : moderate\n下一步\n  $ dev-spec --default user-export\n为什么:先把模糊需求拆成可验证 spec。"
    },
    "dev-spec": {
      title: "Dev Spec",
      input: "$ codex\n> 用 dev-spec 帮我设计用户导出功能",
      output: "执行 dev-spec 前,我需要确认:\n1. 导出谁的数据?\n2. CSV 还是 JSON?\n3. 同步还是异步?\n回答后生成:\n.claude/artifacts/designs/user-export.md"
    },
    "dev-plan": {
      title: "Dev Plan",
      input: "$ codex\n> 用 dev-plan 基于 user-export spec 出实施方案",
      output: "Status: APPROVED\nOption A: 复用现有 worker\nDecision: 选 A\nRisks: 队列隔离 / S3 权限\nVerification: API + worker + notification tests"
    },
    "dev-tdd": {
      title: "Dev TDD",
      input: "$ codex\n> 用 dev-tdd 实现用户导出接口",
      output: "RED\n  写失败测试: export creates a job\nGREEN\n  最小实现: enqueue export worker\nREFACTOR\n  保持行为不变,整理命名\nVerify: targeted test green"
    },
    "dev-fix": {
      title: "Dev Fix",
      input: "$ codex\n> 用 dev-fix 排查登录 30 分钟后被踢出的问题",
      output: "Reproduce: failing test RED\nHypothesis: Redis session TTL 被覆盖\nRoot cause: refresh path 写入 30m TTL\nFix: 统一使用 24h TTL\nVerify: red -> green -> red"
    },
    "dev-verify": {
      title: "Dev Verify",
      input: "$ codex\n> 用 dev-verify 检查这次改动是否真的完成",
      output: "Evidence\n  bash scripts/validate-repo.sh ✓\n  node --check site/app.js ✓\n  HTML parse ✓\nResult: ready to review"
    },
    "dev-code-review": {
      title: "Dev Code Review",
      input: "$ codex\n> 用 dev-code-review 看下这次修改,准备 commit",
      output: "━━━ Dev Code Review ━━━\nVerdict   : READY\nAxis Check\n  规范   ✓\n  功能   ✓\n  闭环   ✓\nCommit\n  docs: update install flow"
    },
    "dev-commit-writer": {
      title: "Dev Commit Writer",
      input: "$ codex\n> 我自审过了,只要 commit message",
      output: "docs: update Codex install instructions\n\nClarify manual skill sync and AGENTS.md template setup for Codex users."
    },
    "dev-finish": {
      title: "Dev Finish",
      input: "$ codex\n> 用 dev-finish 收尾这个分支",
      output: "Branch state: clean\nRemote: origin/master checked\nAction: merge / push / keep branch\nResult: work closed with verification evidence"
    }
  },
  en: {
    "dev-auto": {
      title: "Dev Auto",
      input: "$ codex\n> Use dev-auto to connect the workflow. What should I do next?",
      output: "━━━ Dev Auto ━━━\nPath       : feature\nComplexity : moderate\nNext\n  $ dev-spec --default user-export\nWhy: turn a fuzzy request into a verifiable spec first."
    },
    "dev-spec": {
      title: "Dev Spec",
      input: "$ codex\n> Use dev-spec to design a user export feature",
      output: "Before running dev-spec, I need to confirm:\n1. Whose data is exported?\n2. CSV or JSON?\n3. Sync or async?\nThen generate:\n.claude/artifacts/designs/user-export.md"
    },
    "dev-plan": {
      title: "Dev Plan",
      input: "$ codex\n> Use dev-plan to create an implementation plan from the user-export spec",
      output: "Status: APPROVED\nOption A: reuse the existing worker\nDecision: choose A\nRisks: queue isolation / S3 permissions\nVerification: API + worker + notification tests"
    },
    "dev-tdd": {
      title: "Dev TDD",
      input: "$ codex\n> Use dev-tdd to implement the user export API",
      output: "RED\n  Write failing test: export creates a job\nGREEN\n  Minimal implementation: enqueue export worker\nREFACTOR\n  Preserve behavior, clean names\nVerify: targeted test green"
    },
    "dev-fix": {
      title: "Dev Fix",
      input: "$ codex\n> Use dev-fix to debug users being logged out after 30 minutes",
      output: "Reproduce: failing test RED\nHypothesis: Redis session TTL is overwritten\nRoot cause: refresh path writes 30m TTL\nFix: use 24h TTL consistently\nVerify: red -> green -> red"
    },
    "dev-verify": {
      title: "Dev Verify",
      input: "$ codex\n> Use dev-verify to check whether this change is really done",
      output: "Evidence\n  bash scripts/validate-repo.sh ✓\n  node --check site/app.js ✓\n  HTML parse ✓\nResult: ready to review"
    },
    "dev-code-review": {
      title: "Dev Code Review",
      input: "$ codex\n> Use dev-code-review to inspect this change before commit",
      output: "━━━ Dev Code Review ━━━\nVerdict   : READY\nAxis Check\n  Conventions ✓\n  Behavior    ✓\n  Closure     ✓\nCommit\n  docs: update install flow"
    },
    "dev-commit-writer": {
      title: "Dev Commit Writer",
      input: "$ codex\n> I already reviewed it. Just write the commit message.",
      output: "docs: update Codex install instructions\n\nClarify manual skill sync and AGENTS.md template setup for Codex users."
    },
    "dev-finish": {
      title: "Dev Finish",
      input: "$ codex\n> Use dev-finish to close this branch",
      output: "Branch state: clean\nRemote: origin/master checked\nAction: merge / push / keep branch\nResult: work closed with verification evidence"
    }
  }
};

const installOptions = {
  claude: {
    title: "Claude Code",
    command: "/plugin marketplace add https://github.com/Jason-chen-coder/dev-skills\n/plugin install dev-skills",
    notesKey: "install.claude.notes"
  },
  codex: {
    title: "Codex",
    command: "git clone https://github.com/Jason-chen-coder/dev-skills.git\ncd dev-skills\nmkdir -p \"${CODEX_HOME:-$HOME/.codex}/skills\"\ncp -R skills/* \"${CODEX_HOME:-$HOME/.codex}/skills/\"",
    notesKey: "install.codex.notes"
  },
  npx: {
    title: "npx skills",
    command: "npx skills add Jason-chen-coder/dev-skills\nnpx skills add Jason-chen-coder/dev-skills --global",
    notesKey: "install.npx.notes"
  }
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const PREVIEW_AUTO_CYCLE_MS = 10000;
let previewRunId = 0;
let heroTypingRunId = 0;
let headerFrame = 0;
let previewAutoCycleTimer = 0;
let previewCountdownFrame = 0;
let previewAutoCycling = false;
let previewUserInteracted = false;
const mobileNavMedia = window.matchMedia("(max-width: 860px)");
let workflowGraph = null;
let workflowRenderFrame = 0;
let workflowObservedWidth = 0;

const workflowPalette = {
  shared: { color: "#1f5f78", soft: "#e8f4f6" },
  feature: { color: "#1465d9", soft: "#e9f0ff" },
  hotfix: { color: "#16835f", soft: "#e6f5ee" },
  bug: { color: "#ef5b12", soft: "#fff0e8" },
  decision: { color: "#a46a16", soft: "#fff5dc" },
  review: { color: "#6733b8", soft: "#f1ebff" },
  dark: { color: "#202d45", soft: "#eef1f6" }
};

const workflowNodeSpecs = [
  { id: "start", branch: "shared", tone: "shared", icon: "in", phaseKey: "workflow.node.start.phase", titleKey: "workflow.node.start.title", descKey: "workflow.node.start.desc", column: "center", y: "start", size: "wide" },
  { id: "feature", branch: "feature", tone: "feature", icon: "1", phaseKey: "workflow.node.feature.phase", titleKey: "workflow.node.feature.title", descKey: "workflow.node.feature.desc", column: "left", y: "feature", size: "branch" },
  { id: "hotfix", branch: "hotfix", tone: "hotfix", icon: "2", phaseKey: "workflow.node.hotfix.phase", titleKey: "workflow.node.hotfix.title", descKey: "workflow.node.hotfix.desc", column: "center", y: "hotfix", size: "branch" },
  { id: "bug", branch: "bug", tone: "bug", icon: "3", phaseKey: "workflow.node.bug.phase", titleKey: "workflow.node.bug.title", descKey: "workflow.node.bug.desc", column: "right", y: "bug", size: "branch" },
  { id: "quality", branch: "shared", tone: "review", icon: "Q", phaseKey: "workflow.node.quality.phase", titleKey: "workflow.node.quality.title", descKey: "workflow.node.quality.desc", column: "center", y: "quality", size: "wide" },
  { id: "ship", branch: "shared", tone: "dark", icon: "S", phaseKey: "workflow.node.ship.phase", titleKey: "workflow.node.ship.title", descKey: "workflow.node.ship.desc", column: "center", y: "ship", size: "wide" }
];

const workflowEdgeSpecs = [
  { id: "start-feature", source: "start", target: "feature", branch: "feature" },
  { id: "start-hotfix", source: "start", target: "hotfix", branch: "hotfix" },
  { id: "start-bug", source: "start", target: "bug", branch: "bug" },
  { id: "feature-quality", source: "feature", target: "quality", branch: "feature" },
  { id: "hotfix-quality", source: "hotfix", target: "quality", branch: "hotfix" },
  { id: "bug-quality", source: "bug", target: "quality", branch: "bug" },
  { id: "quality-ship", source: "quality", target: "ship", branch: "shared" }
];

function getInitialLanguage() {
  try {
    const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (SUPPORTED_LANGUAGES.includes(savedLanguage)) return savedLanguage;
  } catch {
    // Ignore storage failures; the switch still works for the current page.
  }

  return navigator.language?.toLowerCase().startsWith("en") ? "en" : "zh";
}

function translate(key, language = currentLanguage) {
  return translations[language]?.[key] ?? translations.zh[key] ?? key;
}

function activeSkillPreviewData() {
  return skillPreviews[currentLanguage] || skillPreviews.zh;
}

function applyLocalizedTarget(target) {
  const element = document.querySelector(target.selector);
  if (!element) return;

  const value = translate(target.key);
  if (target.attr) {
    element.setAttribute(target.attr, value);
    return;
  }

  if (target.html) {
    element.innerHTML = value;
  } else {
    element.textContent = value;
  }

  if (target.selector === ".hero-terminal code") {
    delete element.dataset.sourceText;
  }
}

function renderActiveInstallOption() {
  const activeButton = document.querySelector(".install-tab.is-active") || document.querySelector(".install-tab");
  const option = installOptions[activeButton?.dataset.install];
  const title = document.querySelector("#install-title");
  const command = document.querySelector("#install-command");
  const notes = document.querySelector("#install-notes");
  if (!option || !title || !command || !notes) return;

  title.textContent = option.title;
  command.textContent = option.command;
  notes.replaceChildren(Object.assign(document.createElement("p"), {
    textContent: translate(option.notesKey)
  }));
}

function updateLanguageSwitch() {
  const switcher = document.querySelector("[data-language-switch]");
  if (switcher) {
    switcher.setAttribute("aria-label", translate("language.label"));
  }

  document.querySelectorAll("[data-language-option]").forEach((button) => {
    const language = button.dataset.languageOption;
    const isActive = language === currentLanguage;
    button.textContent = translate(`language.${language}`);
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function applyLanguage() {
  document.documentElement.lang = translate("page.lang");
  document.title = translate("page.title");
  document.querySelector("meta[name='description']")?.setAttribute("content", translate("page.description"));
  localizedTargets.forEach(applyLocalizedTarget);
  updateLanguageSwitch();
  renderActiveInstallOption();

  const toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-label", translate(isOpen ? "nav.close" : "nav.open"));
  }
}

function setLanguage(language, persist = true) {
  if (!SUPPORTED_LANGUAGES.includes(language) || language === currentLanguage) return;

  currentLanguage = language;
  if (persist) {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Ignore storage failures; the language still changes in memory.
    }
  }

  applyLanguage();
  renderHeroTerminal();
  renderWorkflowGraph();
  const activePreview = document.querySelector(".skill-tab.is-active") || document.querySelector(".skill-tab");
  renderPreview(activePreview?.dataset.skill || "dev-auto");
}

function sleep(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function typeText(target, text, delay, isCurrent = () => true) {
  if (!target) return false;
  if (reduceMotion) {
    target.textContent = text;
    return isCurrent();
  }

  target.textContent = "";
  for (let index = 0; index < text.length; index += 1) {
    if (!isCurrent()) return false;
    target.textContent += text[index];
    await sleep(delay);
  }

  return isCurrent();
}

async function renderHeroTerminal() {
  const terminal = document.querySelector(".hero-terminal");
  const pre = terminal?.querySelector("pre");
  const code = terminal?.querySelector("code");
  if (!terminal || !pre || !code) return;

  const text = code.dataset.sourceText || code.textContent;
  const runId = heroTypingRunId + 1;
  code.dataset.sourceText = text;
  heroTypingRunId = runId;

  if (!pre.querySelector(".hero-cursor")) {
    const cursor = document.createElement("span");
    cursor.className = "cursor hero-cursor";
    cursor.setAttribute("aria-hidden", "true");
    pre.append(cursor);
  }

  terminal.classList.add("is-typing");
  const typed = await typeText(code, text, 17, () => runId === heroTypingRunId);
  if (!typed) return;
  terminal.classList.remove("is-typing");
  terminal.classList.add("is-typed");
}

async function renderPreview(skill) {
  const data = activeSkillPreviewData()[skill];
  const title = document.querySelector("#preview-title");
  const input = document.querySelector("#preview-input");
  const output = document.querySelector("#preview-output");
  const panel = document.querySelector(".output-panel");
  const runId = previewRunId + 1;

  previewRunId = runId;
  if (!data || !title || !input || !output || !panel) return;

  title.textContent = data.title;
  output.textContent = "";
  panel.classList.add("is-waiting");
  panel.classList.remove("is-typing");
  panel.setAttribute("aria-busy", "true");

  const inputDone = await typeText(input, data.input, 18, () => runId === previewRunId);
  if (!inputDone) return;

  if (!reduceMotion) await sleep(180);
  if (runId !== previewRunId) return;

  panel.classList.remove("is-waiting");
  panel.classList.add("is-typing");

  const outputDone = await typeText(output, data.output, 12, () => runId === previewRunId);
  if (!outputDone) return;

  panel.classList.remove("is-typing");
  panel.setAttribute("aria-busy", "false");
}

function setActiveButton(buttons, activeButton) {
  buttons.forEach((button) => {
    const isActive = button === activeButton;
    button.classList.toggle("is-active", isActive);
    button.classList.remove("is-auto-counting");
    button.style.removeProperty("--preview-progress-angle");
    button.setAttribute("aria-selected", String(isActive));
  });
}

function previewButtons() {
  return [...document.querySelectorAll(".skill-tab")];
}

function stopPreviewAutoCycle() {
  if (previewAutoCycleTimer) {
    window.clearTimeout(previewAutoCycleTimer);
    previewAutoCycleTimer = 0;
  }

  if (previewCountdownFrame) {
    window.cancelAnimationFrame(previewCountdownFrame);
    previewCountdownFrame = 0;
  }

  previewButtons().forEach((button) => {
    button.classList.remove("is-auto-counting");
    button.style.removeProperty("--preview-progress-angle");
  });
}

function nextPreviewButton() {
  const buttons = previewButtons();
  const activeIndex = buttons.findIndex((button) => button.classList.contains("is-active"));
  return buttons[(activeIndex + 1) % buttons.length] || buttons[0];
}

function schedulePreviewAutoCycle(button) {
  if (previewUserInteracted || !button) return;

  if (previewAutoCycleTimer) {
    window.clearTimeout(previewAutoCycleTimer);
  }

  if (previewCountdownFrame) {
    window.cancelAnimationFrame(previewCountdownFrame);
    previewCountdownFrame = 0;
  }

  button.classList.add("is-auto-counting");
  button.style.setProperty("--preview-progress-angle", "0turn");

  if (!reduceMotion) {
    const startedAt = window.performance.now();
    const renderCountdown = (now) => {
      if (previewUserInteracted || !button.classList.contains("is-active")) {
        previewCountdownFrame = 0;
        return;
      }

      const progress = Math.max(0, Math.min((now - startedAt) / PREVIEW_AUTO_CYCLE_MS, 1));
      button.style.setProperty("--preview-progress-angle", `${progress}turn`);

      if (progress < 1) {
        previewCountdownFrame = window.requestAnimationFrame(renderCountdown);
      } else {
        previewCountdownFrame = 0;
      }
    };

    previewCountdownFrame = window.requestAnimationFrame(renderCountdown);
  }

  previewAutoCycleTimer = window.setTimeout(() => {
    previewAutoCycleTimer = 0;
    if (previewUserInteracted) return;

    const nextButton = nextPreviewButton();
    if (!nextButton) return;

    previewAutoCycling = true;
    nextButton.click();
    previewAutoCycling = false;
  }, PREVIEW_AUTO_CYCLE_MS);
}

function activatePreview(button, userInitiated = false) {
  if (!button) return;

  if (userInitiated) {
    previewUserInteracted = true;
    stopPreviewAutoCycle();
  }

  setActiveButton(previewButtons(), button);
  renderPreview(button.dataset.skill);

  if (!userInitiated) {
    schedulePreviewAutoCycle(button);
  }
}

function startPreviewAutoCycle() {
  const buttons = previewButtons();
  if (buttons.length < 2 || previewAutoCycleTimer) return;

  const activeButton = buttons.find((button) => button.classList.contains("is-active")) || buttons[0];
  schedulePreviewAutoCycle(activeButton);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function workflowNodeMarkup(node) {
  const tone = workflowPalette[node.tone] || workflowPalette.shared;
  return `
    <div class="workflow-g6-node workflow-g6-node-${escapeHtml(node.tone)}" data-node-id="${escapeHtml(node.id)}" data-branch="${escapeHtml(node.branch)}" style="--node-color:${tone.color};--node-soft:${tone.soft};">
      <span class="workflow-g6-icon" aria-hidden="true">${escapeHtml(node.icon)}</span>
      <span class="workflow-g6-meta">${escapeHtml(translate(node.phaseKey))}</span>
      <strong>${escapeHtml(translate(node.titleKey))}</strong>
      <span class="workflow-g6-desc">${escapeHtml(translate(node.descKey))}</span>
    </div>
  `;
}

function workflowLayout(width) {
  const compact = width < 760;
  const center = width * 0.5;
  const sideInset = compact ? Math.max(105, width * 0.28) : Math.max(126, width * 0.2);
  const oppositeSide = width - sideInset;
  const height = compact ? 660 : 540;
  return {
    compact,
    height,
    columns: {
      left: sideInset,
      center,
      right: oppositeSide
    },
    rows: compact
      ? { start: 58, feature: 176, hotfix: 286, bug: 396, quality: 510, ship: 610 }
      : { start: 64, feature: 230, hotfix: 230, bug: 230, quality: 386, ship: 486 },
    sizes: {
      branch: compact ? [190, 84] : [214, 86],
      wide: compact ? [224, 82] : [292, 78]
    }
  };
}

function buildWorkflowGraphData(width) {
  const layout = workflowLayout(width);
  const nodes = workflowNodeSpecs.map((node) => {
    const [nodeWidth, nodeHeight] = layout.sizes[node.size];
    return {
      ...node,
      style: {
        x: layout.columns[node.column],
        y: layout.rows[node.y],
        size: [nodeWidth, nodeHeight],
        dx: -nodeWidth / 2,
        dy: -nodeHeight / 2,
        innerHTML: workflowNodeMarkup(node)
      }
    };
  });

  const edges = workflowEdgeSpecs.map((edge) => {
    const tone = workflowPalette[edge.branch] || workflowPalette.shared;
    const isShared = edge.branch === "shared";
    return {
      ...edge,
      type: "cubic-vertical",
      style: {
        stroke: tone.color,
        lineWidth: isShared ? 3.8 : 3.4,
        opacity: isShared ? 0.82 : 0.9,
        endArrow: true
      }
    };
  });

  return { height: layout.height, nodes, edges };
}

function applyWorkflowEdgeState(branch) {
  if (!workflowGraph) return;

  workflowEdgeSpecs.forEach((edge) => {
    const state = !branch || edge.branch === "shared"
      ? []
      : edge.branch === branch
        ? ["active"]
        : ["inactive"];
    workflowGraph.setElementState(edge.id, state);
  });
}

function clearWorkflowBranchFocus() {
  const graphContainer = document.querySelector("#workflow-graph");
  if (!graphContainer) return;

  graphContainer.classList.remove("is-focusing-branch");
  graphContainer.querySelectorAll(".workflow-g6-node").forEach((node) => {
    node.classList.remove("is-active", "is-muted");
  });
  applyWorkflowEdgeState(null);
}

function focusWorkflowBranch(branch) {
  const graphContainer = document.querySelector("#workflow-graph");
  if (!graphContainer || !branch || branch === "shared") return;

  graphContainer.classList.add("is-focusing-branch");
  graphContainer.querySelectorAll(".workflow-g6-node").forEach((node) => {
    const nodeBranch = node.dataset.branch;
    const isCurrentBranch = nodeBranch === branch;
    node.classList.toggle("is-active", isCurrentBranch);
    node.classList.toggle("is-muted", nodeBranch !== "shared" && !isCurrentBranch);
  });
  applyWorkflowEdgeState(branch);
}

function setupWorkflowGraphFocus() {
  const graphContainer = document.querySelector("#workflow-graph");
  if (!graphContainer) return;

  graphContainer.querySelectorAll(".workflow-g6-node[data-branch]").forEach((node) => {
    if (node.dataset.branch === "shared") return;
    node.addEventListener("mouseenter", () => focusWorkflowBranch(node.dataset.branch));
    node.addEventListener("mouseleave", (event) => {
      if (event.relatedTarget?.closest?.(".workflow-g6-node[data-branch]")) return;
      clearWorkflowBranchFocus();
    });
  });

  graphContainer.onmouseleave = clearWorkflowBranchFocus;
}

function renderWorkflowGraph() {
  const graphContainer = document.querySelector("#workflow-graph");
  const G6 = window.G6;
  if (!graphContainer) return;

  if (!G6?.Graph) {
    graphContainer.classList.add("is-fallback");
    return;
  }

  const width = Math.max(320, Math.floor(graphContainer.getBoundingClientRect().width || graphContainer.clientWidth));
  const data = buildWorkflowGraphData(width);
  graphContainer.style.height = `${data.height}px`;
  graphContainer.classList.remove("is-fallback");
  graphContainer.innerHTML = "";

  if (workflowGraph) {
    workflowGraph.destroy();
  }

  workflowGraph = new G6.Graph({
    container: graphContainer,
    width,
    height: data.height,
    data,
    behaviors: [],
    node: {
      type: "html"
    },
    edge: {
      type: "cubic-vertical",
      state: {
        active: { opacity: 1, lineWidth: 5 },
        inactive: { opacity: 0.14, lineWidth: 2.2 }
      }
    }
  });

  workflowGraph.render();
  window.requestAnimationFrame(() => {
    setupWorkflowGraphFocus();
  });
}

function scheduleWorkflowGraphRender() {
  if (workflowRenderFrame) return;
  workflowRenderFrame = window.requestAnimationFrame(() => {
    workflowRenderFrame = 0;
    renderWorkflowGraph();
  });
}

function setupWorkflowGraphResizeObserver() {
  const graphContainer = document.querySelector("#workflow-graph");
  if (!graphContainer || !("ResizeObserver" in window)) return;

  workflowObservedWidth = Math.floor(graphContainer.getBoundingClientRect().width);
  const observer = new ResizeObserver((entries) => {
    const width = Math.floor(entries[0]?.contentRect.width || 0);
    if (!width || Math.abs(width - workflowObservedWidth) < 2) return;

    workflowObservedWidth = width;
    scheduleWorkflowGraphRender();
  });
  observer.observe(graphContainer);
}

document.querySelectorAll(".skill-tab").forEach((button) => {
  button.addEventListener("click", () => {
    activatePreview(button, !previewAutoCycling);
  });
});

document.querySelectorAll(".install-tab").forEach((button) => {
  button.addEventListener("click", () => {
    if (!installOptions[button.dataset.install]) return;

    setActiveButton(document.querySelectorAll(".install-tab"), button);
    renderActiveInstallOption();
  });
});

document.querySelectorAll("[data-language-option]").forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.languageOption);
  });
});

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.querySelector(button.dataset.copyTarget);
    if (!target) return;

    try {
      await navigator.clipboard.writeText(target.textContent.trim());
      button.textContent = translate("install.copied");
      window.setTimeout(() => {
        button.textContent = translate("install.copy");
      }, 1200);
    } catch {
      button.textContent = translate("install.select");
      window.setTimeout(() => {
        button.textContent = translate("install.copy");
      }, 1200);
    }
  });
});

function updateHeaderState() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  header.classList.toggle("is-condensed", window.scrollY > 24);
}

function setNavMenuOpen(isOpen) {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  if (!header || !toggle) return;

  const shouldOpen = isOpen && mobileNavMedia.matches;
  header.classList.toggle("is-menu-open", shouldOpen);
  toggle.setAttribute("aria-expanded", String(shouldOpen));
  toggle.setAttribute("aria-label", translate(shouldOpen ? "nav.close" : "nav.open"));
}

function setupMobileNav() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav-links");
  if (!header || !toggle || !nav) return;

  toggle.addEventListener("click", () => {
    if (!mobileNavMedia.matches) {
      setNavMenuOpen(false);
      return;
    }

    const nextState = toggle.getAttribute("aria-expanded") !== "true";
    setNavMenuOpen(nextState);
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setNavMenuOpen(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) {
      setNavMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setNavMenuOpen(false);
      toggle.focus();
    }
  });
}

function scheduleHeaderStateUpdate() {
  if (headerFrame) return;

  headerFrame = window.requestAnimationFrame(() => {
    headerFrame = 0;
    updateHeaderState();
  });
}

applyLanguage();
setupMobileNav();
updateHeaderState();
window.addEventListener("load", updateHeaderState);
window.addEventListener("resize", () => {
  updateHeaderState();
  if (!mobileNavMedia.matches) {
    setNavMenuOpen(false);
  }
});
window.addEventListener("scroll", scheduleHeaderStateUpdate, { passive: true });

renderWorkflowGraph();
setupWorkflowGraphResizeObserver();
window.addEventListener("load", renderWorkflowGraph);
window.addEventListener("resize", scheduleWorkflowGraphRender);
renderHeroTerminal();
renderPreview("dev-auto");
startPreviewAutoCycle();
