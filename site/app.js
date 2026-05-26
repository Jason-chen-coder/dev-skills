const LANGUAGE_STORAGE_KEY = "dev-skills-language";
const SUPPORTED_LANGUAGES = ["zh", "en"];

const translations = {
  zh: {
    "page.lang": "zh-CN",
    "page.title": "dev-skills - AI 开发工作流 Skill 库",
    "page.description": "10 个 AI 开发 skill,用轻量 SDD 串起 spec、plan、实现、验证和 review,再配上短版 always-on 规则、multi-agent 分工协议和团队治理文档。",
    "brand.aria": "dev-skills 首页",
    "nav.aria": "主导航",
    "nav.skills": "Skills",
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
    "hero.text": "dev-skills 为 Claude Code 与 Codex 提供 10 个工程流程 skill 和精简 always-on 团队规则,用轻量 SDD 让设计上下文、spec、plan、实现、验证、评审与收尾都有清晰边界和可复核结果。",
    "hero.actions.label": "主要操作",
    "hero.install": "Install",
    "hero.preview": "Preview",
    "hero.github": "GitHub",
    "hero.install.aria": "查看安装方式",
    "hero.preview.aria": "查看 skill 运行预览",
    "hero.github.aria": "打开 GitHub 仓库",
    "hero.preview.ariaLabel": "dev-skills workflow 和 multi-agent 预览",
    "hero.terminal.workflow.label": "Workflow",
    "hero.terminal.workflow": "$ codex\n> 帮我设计一个登录页面\n\n可以。我会先确认这个登录页服务谁、出现在什么产品场景里,以及需要支持哪些登录方式。\n\n如果项目里还没有设计上下文,我会先补齐它;然后把页面范围收敛成一份 spec,复杂时再补 plan。实现、验证和 review 都会对照这些 artifact 交付证据。",
    "hero.terminal.agents.label": "Multi-agent",
    "hero.terminal.agents": "$ codex\n> 帮我设计一个登录页面\n\n可以。我会由主 agent 先确认目标、边界和验收标准,把 spec / plan 作为 source artifact,再把任务拆给设计、实现和验证三条线。\n\n子 agent 只处理范围明确、能交付证据的任务。最后由主 agent 对照 artifact 汇总结果、处理 drift 并收尾。",
    "skills.eyebrow": "Skill library",
    "skills.title": "按你现在要做的事，选择对应的 skill。",
    "skills.text": "日常只要回答“现在卡在哪一步”。dev-skills 会把需求、方案、实现、修复、验证和提交收进同一条 SDD 工程流程。",
    "skills.guide.aria": "dev-skills 使用入口",
    "skills.guide.related.aria": "相关 skills",
    "skills.guide.auto.label": "不确定下一步",
    "skills.guide.auto.title": "让 agent 先判断路径",
    "skills.guide.auto.text": "当你只知道目标,但不知道该先写需求、计划还是直接修复时,从这里开始。",
    "skills.guide.scope.label": "需求和方案",
    "skills.guide.scope.title": "先把要做什么说清",
    "skills.guide.scope.text": "模糊需求先收敛成 spec;复杂或高风险改动再补 plan。UI 工作先沉淀设计上下文。",
    "skills.guide.build.label": "实现和修复",
    "skills.guide.build.title": "写代码前先锁住行为",
    "skills.guide.build.text": "新功能走 TDD;问题修复从复现和 root cause 开始,避免只修表面症状。",
    "skills.guide.ship.label": "完成和提交",
    "skills.guide.ship.title": "先验证,再 review",
    "skills.guide.ship.text": "完成声明必须有证据;提交前检查 diff。只需要 message 时再单独使用 commit writer。",
    "experience.tabs.aria": "Workflow 和 Multi-agent 内容模式",
    "experience.workflow": "Workflow",
    "experience.agents": "Multi-agent",
    "workflow.agentNote.aria": "Workflow 模式下的 agent 说明",
    "workflow.agentNote.label": "Agent mode",
    "workflow.agentNote.title": "Workflow 模式下,主 agent 负责推进。",
    "workflow.agentNote.text": "普通 workflow 会由主 agent 根据当前阶段选择合适的 skill,按 spec、plan、实现、验证和评审顺序推进。它不会自动分派子 agent;需要并行探索、实现或独立验证时,再切到 Multi-agent。",
    "agent.aria": "Multi-agent 模式下的 agent 说明",
    "agent.eyebrow": "Agent mode",
    "agent.title": "Multi-agent 模式下,主 agent 负责分派和整合。",
    "agent.text": "主 agent 先确认目标、边界、source artifact 和不可修改范围,再把探索、实现、验证或 review 分派给子 agent。子 agent 只处理范围明确、能交付证据的任务;最终判断、git 操作和用户沟通仍然回到主 agent。",
    "agent.lanes.aria": "multi-agent 分工方式",
    "agent.main.label": "Main agent",
    "agent.main.title": "主控",
    "agent.main.text": "确认目标、选择 source artifact,整合所有子 agent 结果。",
    "agent.explorer.label": "Explorer",
    "agent.explorer.title": "探索",
    "agent.explorer.text": "只读查调用链、相似实现、设计系统和已有约定。",
    "agent.worker.label": "Worker",
    "agent.worker.title": "实现",
    "agent.worker.text": "只改分配范围内的页面、模块或测试,并引用对应 AC 或 plan step。",
    "agent.check.label": "Verifier / Reviewer",
    "agent.check.title": "独立把关",
    "agent.check.text": "独立对照 artifact 检查命令证据、响应式、可访问性和 diff 风险。",
    "preview.eyebrow": "Runtime preview",
    "preview.title": "像真实 Codex CLI 一样看 skill 怎么跑。",
    "preview.text": "切换 tab 查看用户输入和代表性输出。左侧输入会播放打字机效果;开启减少动效时直接显示完整文本。",
    "preview.mode.aria": "Runtime preview 模式",
    "preview.mode.skills": "Skill workflow",
    "preview.mode.agents": "Multi-agent",
    "preview.tabs.aria": "Skill 运行预览",
    "preview.tabs.agents.aria": "Agent 运行预览",
    "preview.input.aria": "Codex CLI 输入预览",
    "workflow.eyebrow": "Workflow",
    "workflow.title": "纵向流程图,三条分支最后汇合到验证、评审和提交。",
    "workflow.mode.aria": "Workflow 图模式",
    "workflow.mode.skills": "Skill workflow",
    "workflow.mode.agents": "Multi-agent",
    "workflow.feature.heading": "功能需求路径",
    "workflow.feature.0": "UI 工作先沉淀设计上下文",
    "workflow.feature.1": "模糊需求变成 spec contract",
    "workflow.feature.2": "复杂 / 高风险改动先出 plan / ADR",
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
    "workflow.strong.designContextOptional": "dev-design-context 可选",
    "workflow.strong.planOptional": "dev-plan 可选",
    "workflow.strong.commitOptional": "dev-commit-writer 可选",
    "workflow.strong.finishOptional": "dev-finish 可选",
    "workflow.agent.main.heading": "Main agent lane",
    "workflow.agent.main.0.strong": "Intake",
    "workflow.agent.main.0": "确认目标、风险和是否值得分派",
    "workflow.agent.main.1.strong": "Scope",
    "workflow.agent.main.1": "写清 source artifact、write scope、do-not-edit",
    "workflow.agent.main.2.strong": "Integrate",
    "workflow.agent.main.2": "合并子 agent 结果并处理冲突",
    "workflow.agent.main.3.strong": "Ship",
    "workflow.agent.main.3": "最终验证、commit、PR 或收尾",
    "workflow.agent.parallel.heading": "Parallel lanes",
    "workflow.agent.parallel.0.strong": "Explorer",
    "workflow.agent.parallel.0": "查调用链、类似实现和设计约定",
    "workflow.agent.parallel.1.strong": "Planner",
    "workflow.agent.parallel.1": "复杂任务先做方案取舍和风险检查",
    "workflow.agent.parallel.2.strong": "Worker",
    "workflow.agent.parallel.2": "只改明确分配的文件或模块",
    "workflow.agent.parallel.3.strong": "Verifier",
    "workflow.agent.parallel.3": "独立跑命令,对照 artifact 验证完成声明",
    "workflow.agent.guard.heading": "Guardrails",
    "workflow.agent.guard.0.strong": "No overlap",
    "workflow.agent.guard.0": "多个 worker 不改同一批文件",
    "workflow.agent.guard.1.strong": "No hidden chain",
    "workflow.agent.guard.1": "dev-auto 只推荐,不自动调起其他 skill",
    "workflow.agent.guard.2.strong": "No risky git",
    "workflow.agent.guard.2": "merge、push、discard 留给主 agent 和用户",
    "workflow.agent.guard.3.strong": "Evidence",
    "workflow.agent.guard.3": "每个子 agent 都要输出证据、风险和 artifact drift",
    "workflow.diagram.aria": "dev-skills 简化工作流图,展示 feature、hotfix 和 bug 三条分支如何汇合到验证、评审、提交和收尾",
    "workflow.graph.aria": "Feature、Simple hotfix 和 Bug 三条工作流分支最终汇合到验证、评审、提交和收尾",
    "workflow.fallback": "Feature、Simple hotfix 和 Bug 三条路径最终都会汇合到 dev-verify、dev-code-review、git commit 和 dev-finish。",
    "workflow.agent.diagram.aria": "dev-skills multi-agent 分工流程图,展示主 agent 如何分派探索、实现、验证和评审并最终整合收尾",
    "workflow.agent.graph.aria": "主 agent 定界任务后并行分派 Explorer、Worker、Verifier 和 Reviewer,最后整合到验证、commit 和 PR 收尾",
    "workflow.agent.fallback": "主 agent 先定界任务,再把探索、实现、验证和评审分派给边界明确的子 agent,最后回到主 agent 整合与收尾。",
    "workflow.node.start.phase": "Start",
    "workflow.node.start.title": "需求进入",
    "workflow.node.start.desc": "feature / hotfix / bug",
    "workflow.node.feature.phase": "Feature",
    "workflow.node.feature.title": "功能需求路径",
    "workflow.node.feature.desc": "设计上下文 -> spec -> plan -> TDD",
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
    "workflow.agent.node.request.phase": "Start",
    "workflow.agent.node.request.title": "任务进入",
    "workflow.agent.node.request.desc": "目标 / 风险 / 边界",
    "workflow.agent.node.main.phase": "Main",
    "workflow.agent.node.main.title": "主 agent 定界",
    "workflow.agent.node.main.desc": "source artifact / 所有权",
    "workflow.agent.node.explorer.phase": "Explore",
    "workflow.agent.node.explorer.title": "Explorer",
    "workflow.agent.node.explorer.desc": "调用链 / 约定 / 参考",
    "workflow.agent.node.worker.phase": "Work",
    "workflow.agent.node.worker.title": "Worker",
    "workflow.agent.node.worker.desc": "按限定范围和 AC 实现",
    "workflow.agent.node.verifier.phase": "Verify",
    "workflow.agent.node.verifier.title": "Verifier",
    "workflow.agent.node.verifier.desc": "命令 / AC / drift 证据",
    "workflow.agent.node.reviewer.phase": "Review",
    "workflow.agent.node.reviewer.title": "Reviewer",
    "workflow.agent.node.reviewer.desc": "diff 风险和测试缺口",
    "workflow.agent.node.integrate.phase": "Integrate",
    "workflow.agent.node.integrate.title": "结果整合",
    "workflow.agent.node.integrate.desc": "冲突 / 缺口 / 下一步",
    "workflow.agent.node.ship.phase": "Ship",
    "workflow.agent.node.ship.title": "收尾",
    "workflow.agent.node.ship.desc": "验证 / commit / PR",
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
    "page.description": "Ten AI development workflow skills that use lightweight SDD to connect specs, plans, implementation, verification, and review, plus concise always-on rules, multi-agent policy, and team governance docs.",
    "brand.aria": "dev-skills home",
    "nav.aria": "Primary navigation",
    "nav.skills": "Skills",
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
    "hero.text": "dev-skills gives Claude Code and Codex ten engineering workflow skills plus concise always-on team rules, using lightweight SDD so design context, specs, plans, implementation, verification, review, and closure each have clear boundaries and checkable evidence.",
    "hero.actions.label": "Primary actions",
    "hero.install": "Install",
    "hero.preview": "Preview",
    "hero.github": "GitHub",
    "hero.install.aria": "View install options",
    "hero.preview.aria": "View skill runtime previews",
    "hero.github.aria": "Open the GitHub repository",
    "hero.preview.ariaLabel": "dev-skills workflow and multi-agent preview",
    "hero.terminal.workflow.label": "Workflow",
    "hero.terminal.workflow": "$ codex\n> Design a login page for me\n\nSure. I’ll first clarify who the login page serves, where it appears in the product, and which sign-in methods it needs.\n\nIf the project has no design context yet, I’ll capture it first. Then I’ll turn the page scope into a spec and add a plan when the work is complex. Implementation, verification, and review will all cite those artifacts.",
    "hero.terminal.agents.label": "Multi-agent",
    "hero.terminal.agents": "$ codex\n> Design a login page for me\n\nSure. The main agent would confirm the goal, boundaries, and acceptance criteria first, use the spec / plan as source artifacts, then split the work across design, implementation, and verification lanes.\n\nSub-agents only take bounded tasks that can return evidence. The main agent integrates results, handles drift, and keeps final judgment.",
    "skills.eyebrow": "Skill library",
    "skills.title": "Choose the skill for the job in front of you.",
    "skills.text": "Most days, you only need to answer where the work is stuck. dev-skills keeps requirements, plans, implementation, fixes, verification, and commits in one SDD engineering flow.",
    "skills.guide.aria": "dev-skills usage entries",
    "skills.guide.related.aria": "Related skills",
    "skills.guide.auto.label": "Unsure what is next",
    "skills.guide.auto.title": "Let the agent pick the path",
    "skills.guide.auto.text": "Start here when you know the goal but not whether to write a spec, plan, or fix first.",
    "skills.guide.scope.label": "Requirements and plans",
    "skills.guide.scope.title": "Clarify what to build",
    "skills.guide.scope.text": "Turn fuzzy requests into specs, add a plan for complex or risky work, and capture design context before UI work.",
    "skills.guide.build.label": "Build and fix",
    "skills.guide.build.title": "Lock behavior before coding",
    "skills.guide.build.text": "Use TDD for new work; debug from reproduction and root cause instead of patching symptoms.",
    "skills.guide.ship.label": "Finish and commit",
    "skills.guide.ship.title": "Verify, then review",
    "skills.guide.ship.text": "Completion needs evidence; review the diff before commit. Use the commit writer only when you need just a message.",
    "experience.tabs.aria": "Workflow and multi-agent content mode",
    "experience.workflow": "Workflow",
    "experience.agents": "Multi-agent",
    "workflow.agentNote.aria": "Agent mode note in Workflow mode",
    "workflow.agentNote.label": "Agent mode",
    "workflow.agentNote.title": "In Workflow mode, the main agent drives the work.",
    "workflow.agentNote.text": "The standard workflow lets the main agent choose the right skill for the current phase and move through specs, plans, implementation, verification, and review in order. It does not automatically delegate to sub-agents; switch to Multi-agent when exploration, implementation, or independent verification should run in parallel.",
    "agent.aria": "Agent mode note in Multi-agent mode",
    "agent.eyebrow": "Agent mode",
    "agent.title": "In Multi-agent mode, the main agent delegates and integrates.",
    "agent.text": "The main agent confirms the goal, boundaries, source artifact, and do-not-edit scope, then delegates exploration, implementation, verification, or review to sub-agents. Sub-agents only take bounded tasks that can return evidence; final judgment, git operations, and user communication stay with the main agent.",
    "agent.lanes.aria": "multi-agent delegation model",
    "agent.main.label": "Main agent",
    "agent.main.title": "Control",
    "agent.main.text": "Confirms the goal, selects the source artifact, and integrates sub-agent results.",
    "agent.explorer.label": "Explorer",
    "agent.explorer.title": "Explore",
    "agent.explorer.text": "Reads call chains, similar code, design systems, and conventions.",
    "agent.worker.label": "Worker",
    "agent.worker.title": "Implement",
    "agent.worker.text": "Edits only the assigned page, module, or test scope, citing the matching AC or plan step.",
    "agent.check.label": "Verifier / Reviewer",
    "agent.check.title": "Check",
    "agent.check.text": "Checks command evidence, responsive behavior, accessibility, and diff risk against the artifact.",
    "preview.eyebrow": "Runtime preview",
    "preview.title": "See how each skill runs in a Codex CLI-like flow.",
    "preview.text": "Switch tabs to view representative user input and output. The left side uses a typewriter effect; reduced motion shows the full text immediately.",
    "preview.mode.aria": "Runtime preview mode",
    "preview.mode.skills": "Skill workflow",
    "preview.mode.agents": "Multi-agent",
    "preview.tabs.aria": "Skill runtime previews",
    "preview.tabs.agents.aria": "Agent runtime previews",
    "preview.input.aria": "Codex CLI input preview",
    "workflow.eyebrow": "Workflow",
    "workflow.title": "A top-down flow where three paths converge into verification, review, and commit.",
    "workflow.mode.aria": "Workflow diagram mode",
    "workflow.mode.skills": "Skill workflow",
    "workflow.mode.agents": "Multi-agent",
    "workflow.feature.heading": "Feature path",
    "workflow.feature.0": "Capture design context first for UI work",
    "workflow.feature.1": "Turn a fuzzy request into a spec contract",
    "workflow.feature.2": "Create a plan / ADR for complex or risky changes",
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
    "workflow.strong.designContextOptional": "dev-design-context optional",
    "workflow.strong.planOptional": "dev-plan optional",
    "workflow.strong.commitOptional": "dev-commit-writer optional",
    "workflow.strong.finishOptional": "dev-finish optional",
    "workflow.agent.main.heading": "Main agent lane",
    "workflow.agent.main.0.strong": "Intake",
    "workflow.agent.main.0": "Confirm the goal, risks, and whether delegation is worth it",
    "workflow.agent.main.1.strong": "Scope",
    "workflow.agent.main.1": "Write the source artifact, write scope, and do-not-edit boundaries",
    "workflow.agent.main.2.strong": "Integrate",
    "workflow.agent.main.2": "Merge sub-agent results and resolve conflicts",
    "workflow.agent.main.3.strong": "Ship",
    "workflow.agent.main.3": "Run final verification, commit, PR, or closure",
    "workflow.agent.parallel.heading": "Parallel lanes",
    "workflow.agent.parallel.0.strong": "Explorer",
    "workflow.agent.parallel.0": "Inspect call chains, similar code, and design conventions",
    "workflow.agent.parallel.1.strong": "Planner",
    "workflow.agent.parallel.1": "Evaluate options and risks for complex tasks",
    "workflow.agent.parallel.2.strong": "Worker",
    "workflow.agent.parallel.2": "Edit only the assigned files or modules",
    "workflow.agent.parallel.3.strong": "Verifier",
    "workflow.agent.parallel.3": "Run commands independently and verify the done claim against the artifact",
    "workflow.agent.guard.heading": "Guardrails",
    "workflow.agent.guard.0.strong": "No overlap",
    "workflow.agent.guard.0": "Do not let multiple workers edit the same files",
    "workflow.agent.guard.1.strong": "No hidden chain",
    "workflow.agent.guard.1": "dev-auto recommends only; it does not invoke other skills",
    "workflow.agent.guard.2.strong": "No risky git",
    "workflow.agent.guard.2": "Keep merge, push, and discard with the main agent and user",
    "workflow.agent.guard.3.strong": "Evidence",
    "workflow.agent.guard.3": "Every sub-agent returns evidence, risks, and artifact drift",
    "workflow.diagram.aria": "Simplified dev-skills workflow diagram showing feature, hotfix, and bug paths converging into verification, review, commit, and closure",
    "workflow.graph.aria": "Feature, simple hotfix, and bug paths converge into verification, review, commit, and closure",
    "workflow.fallback": "Feature, simple hotfix, and bug paths all converge into dev-verify, dev-code-review, git commit, and dev-finish.",
    "workflow.agent.diagram.aria": "dev-skills multi-agent delegation diagram showing the main agent delegating exploration, implementation, verification, and review before integration and closure",
    "workflow.agent.graph.aria": "The main agent scopes the task, delegates Explorer, Worker, Verifier, and Reviewer lanes in parallel, then integrates results for verification, commit, and PR closure",
    "workflow.agent.fallback": "The main agent scopes the task, delegates bounded exploration, implementation, verification, and review, then integrates the evidence and closes the work.",
    "workflow.node.start.phase": "Start",
    "workflow.node.start.title": "Request intake",
    "workflow.node.start.desc": "feature / hotfix / bug",
    "workflow.node.feature.phase": "Feature",
    "workflow.node.feature.title": "Feature path",
    "workflow.node.feature.desc": "design -> spec -> plan -> TDD",
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
    "workflow.agent.node.request.phase": "Start",
    "workflow.agent.node.request.title": "Task intake",
    "workflow.agent.node.request.desc": "goal / risk / boundary",
    "workflow.agent.node.main.phase": "Main",
    "workflow.agent.node.main.title": "Scope delegation",
    "workflow.agent.node.main.desc": "source artifact / ownership",
    "workflow.agent.node.explorer.phase": "Explore",
    "workflow.agent.node.explorer.title": "Explorer",
    "workflow.agent.node.explorer.desc": "call chains / conventions",
    "workflow.agent.node.worker.phase": "Work",
    "workflow.agent.node.worker.title": "Worker",
    "workflow.agent.node.worker.desc": "scope and AC only",
    "workflow.agent.node.verifier.phase": "Verify",
    "workflow.agent.node.verifier.title": "Verifier",
    "workflow.agent.node.verifier.desc": "commands / AC / drift evidence",
    "workflow.agent.node.reviewer.phase": "Review",
    "workflow.agent.node.reviewer.title": "Reviewer",
    "workflow.agent.node.reviewer.desc": "diff risks and test gaps",
    "workflow.agent.node.integrate.phase": "Integrate",
    "workflow.agent.node.integrate.title": "Integrate",
    "workflow.agent.node.integrate.desc": "conflicts / gaps / next step",
    "workflow.agent.node.ship.phase": "Ship",
    "workflow.agent.node.ship.title": "Close",
    "workflow.agent.node.ship.desc": "verify / commit / PR",
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
let currentExperienceMode = "skills";
let currentPreviewMode = "skills";

const localizedTargets = [
  { selector: ".brand", key: "brand.aria", attr: "aria-label" },
  { selector: ".nav-links", key: "nav.aria", attr: "aria-label" },
  { selector: ".nav-links a[href='#skills']", key: "nav.skills" },
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
  { selector: "#skills .section-heading .eyebrow", key: "skills.eyebrow" },
  { selector: "#skills .section-heading h2", key: "skills.title" },
  { selector: "#skills .section-heading p:last-child", key: "skills.text" },
  { selector: ".skill-guide", key: "skills.guide.aria", attr: "aria-label" },
  { selector: ".skill-guide-card:nth-child(1) span", key: "skills.guide.auto.label" },
  { selector: ".skill-guide-card:nth-child(1) h3", key: "skills.guide.auto.title" },
  { selector: ".skill-guide-card:nth-child(1) p", key: "skills.guide.auto.text" },
  { selector: ".skill-guide-card:nth-child(1) ul", key: "skills.guide.related.aria", attr: "aria-label" },
  { selector: ".skill-guide-card:nth-child(2) span", key: "skills.guide.scope.label" },
  { selector: ".skill-guide-card:nth-child(2) h3", key: "skills.guide.scope.title" },
  { selector: ".skill-guide-card:nth-child(2) p", key: "skills.guide.scope.text" },
  { selector: ".skill-guide-card:nth-child(2) ul", key: "skills.guide.related.aria", attr: "aria-label" },
  { selector: ".skill-guide-card:nth-child(3) span", key: "skills.guide.build.label" },
  { selector: ".skill-guide-card:nth-child(3) h3", key: "skills.guide.build.title" },
  { selector: ".skill-guide-card:nth-child(3) p", key: "skills.guide.build.text" },
  { selector: ".skill-guide-card:nth-child(3) ul", key: "skills.guide.related.aria", attr: "aria-label" },
  { selector: ".skill-guide-card:nth-child(4) span", key: "skills.guide.ship.label" },
  { selector: ".skill-guide-card:nth-child(4) h3", key: "skills.guide.ship.title" },
  { selector: ".skill-guide-card:nth-child(4) p", key: "skills.guide.ship.text" },
  { selector: ".skill-guide-card:nth-child(4) ul", key: "skills.guide.related.aria", attr: "aria-label" },
  { selector: ".experience-mode-switch", key: "experience.tabs.aria", attr: "aria-label" },
  { selector: "[data-experience-mode='skills']", key: "experience.workflow" },
  { selector: "[data-experience-mode='agents']", key: "experience.agents" },
  { selector: ".workflow-agent-note", key: "workflow.agentNote.aria", attr: "aria-label" },
  { selector: ".workflow-agent-note span", key: "workflow.agentNote.label" },
  { selector: ".workflow-agent-note h3", key: "workflow.agentNote.title" },
  { selector: ".workflow-agent-note p", key: "workflow.agentNote.text" },
  { selector: ".agent-mode-note", key: "agent.aria", attr: "aria-label" },
  { selector: ".agent-mode-note span", key: "agent.eyebrow" },
  { selector: ".agent-mode-note h3", key: "agent.title" },
  { selector: ".agent-mode-note p", key: "agent.text" },
  { selector: ".agent-lanes", key: "agent.lanes.aria", attr: "aria-label" },
  { selector: ".agent-lanes article:nth-child(1) span", key: "agent.main.label" },
  { selector: ".agent-lanes article:nth-child(1) h3", key: "agent.main.title" },
  { selector: ".agent-lanes article:nth-child(1) p", key: "agent.main.text" },
  { selector: ".agent-lanes article:nth-child(2) span", key: "agent.explorer.label" },
  { selector: ".agent-lanes article:nth-child(2) h3", key: "agent.explorer.title" },
  { selector: ".agent-lanes article:nth-child(2) p", key: "agent.explorer.text" },
  { selector: ".agent-lanes article:nth-child(3) span", key: "agent.worker.label" },
  { selector: ".agent-lanes article:nth-child(3) h3", key: "agent.worker.title" },
  { selector: ".agent-lanes article:nth-child(3) p", key: "agent.worker.text" },
  { selector: ".agent-lanes article:nth-child(4) span", key: "agent.check.label" },
  { selector: ".agent-lanes article:nth-child(4) h3", key: "agent.check.title" },
  { selector: ".agent-lanes article:nth-child(4) p", key: "agent.check.text" },
  { selector: "#preview .section-heading .eyebrow", key: "preview.eyebrow" },
  { selector: "#preview .section-heading h2", key: "preview.title" },
  { selector: "#preview .section-heading p:last-child", key: "preview.text" },
  { selector: "[data-preview-tabs='skills']", key: "preview.tabs.aria", attr: "aria-label" },
  { selector: "[data-preview-tabs='agents']", key: "preview.tabs.agents.aria", attr: "aria-label" },
  { selector: ".terminal-panel", key: "preview.input.aria", attr: "aria-label" },
  { selector: ".workflow-section .section-heading .eyebrow", key: "workflow.eyebrow" },
  { selector: ".workflow-section .section-heading h2", key: "workflow.title" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(1) h3", key: "workflow.feature.heading" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(1) li:nth-child(1) strong", key: "workflow.strong.designContextOptional" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(1) li:nth-child(1) span", key: "workflow.feature.0" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(1) li:nth-child(2) span", key: "workflow.feature.1" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(1) li:nth-child(3) strong", key: "workflow.strong.planOptional" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(1) li:nth-child(3) span", key: "workflow.feature.2" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(1) li:nth-child(4) span", key: "workflow.feature.3" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(1) li:nth-child(5) span", key: "workflow.feature.4" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(1) li:nth-child(6) span", key: "workflow.feature.5" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(1) li:nth-child(7) strong", key: "workflow.strong.commitOptional" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(1) li:nth-child(7) span", key: "workflow.feature.6" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(1) li:nth-child(8) span", key: "workflow.feature.7" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(1) li:nth-child(9) span", key: "workflow.feature.8" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(2) h3", key: "workflow.bug.heading" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(2) li:nth-child(1) span", key: "workflow.bug.1" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(2) li:nth-child(2) span", key: "workflow.bug.2" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(2) li:nth-child(3) span", key: "workflow.bug.3" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(2) li:nth-child(4) strong", key: "workflow.strong.commitOptional" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(2) li:nth-child(4) span", key: "workflow.bug.4" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(2) li:nth-child(5) span", key: "workflow.bug.5" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(2) li:nth-child(6) span", key: "workflow.bug.6" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(3) h3", key: "workflow.hotfix.heading" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(3) li:nth-child(1) span", key: "workflow.hotfix.1" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(3) li:nth-child(2) span", key: "workflow.hotfix.2" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(3) li:nth-child(3) span", key: "workflow.hotfix.3" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(3) li:nth-child(4) span", key: "workflow.hotfix.4" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(3) li:nth-child(5) strong", key: "workflow.strong.finishOptional" },
  { selector: ".workflow-grid-skills .workflow-path:nth-child(3) li:nth-child(5) span", key: "workflow.hotfix.5" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(1) h3", key: "workflow.agent.main.heading" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(1) li:nth-child(1) strong", key: "workflow.agent.main.0.strong" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(1) li:nth-child(1) span", key: "workflow.agent.main.0" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(1) li:nth-child(2) strong", key: "workflow.agent.main.1.strong" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(1) li:nth-child(2) span", key: "workflow.agent.main.1" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(1) li:nth-child(3) strong", key: "workflow.agent.main.2.strong" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(1) li:nth-child(3) span", key: "workflow.agent.main.2" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(1) li:nth-child(4) strong", key: "workflow.agent.main.3.strong" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(1) li:nth-child(4) span", key: "workflow.agent.main.3" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(2) h3", key: "workflow.agent.parallel.heading" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(2) li:nth-child(1) strong", key: "workflow.agent.parallel.0.strong" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(2) li:nth-child(1) span", key: "workflow.agent.parallel.0" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(2) li:nth-child(2) strong", key: "workflow.agent.parallel.1.strong" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(2) li:nth-child(2) span", key: "workflow.agent.parallel.1" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(2) li:nth-child(3) strong", key: "workflow.agent.parallel.2.strong" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(2) li:nth-child(3) span", key: "workflow.agent.parallel.2" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(2) li:nth-child(4) strong", key: "workflow.agent.parallel.3.strong" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(2) li:nth-child(4) span", key: "workflow.agent.parallel.3" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(3) h3", key: "workflow.agent.guard.heading" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(3) li:nth-child(1) strong", key: "workflow.agent.guard.0.strong" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(3) li:nth-child(1) span", key: "workflow.agent.guard.0" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(3) li:nth-child(2) strong", key: "workflow.agent.guard.1.strong" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(3) li:nth-child(2) span", key: "workflow.agent.guard.1" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(3) li:nth-child(3) strong", key: "workflow.agent.guard.2.strong" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(3) li:nth-child(3) span", key: "workflow.agent.guard.2" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(3) li:nth-child(4) strong", key: "workflow.agent.guard.3.strong" },
  { selector: ".workflow-grid-agents .workflow-path:nth-child(3) li:nth-child(4) span", key: "workflow.agent.guard.3" },
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
    "dev-design-context": {
      title: "Dev Design Context",
      input: "$ codex\n> 用 dev-design-context 先沉淀这个项目的设计上下文",
      output: "Explore\n  README / 组件 / CSS tokens / 品牌资产\nAsk\n  只问代码里看不出来的 UX 问题\nWrite\n  .design-context.md -> Design Context\nResult: 未来 UI 工作有统一设计原则"
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
    "dev-design-context": {
      title: "Dev Design Context",
      input: "$ codex\n> Use dev-design-context to capture this project's design context",
      output: "Explore\n  README / components / CSS tokens / brand assets\nAsk\n  Only UX questions the code cannot answer\nWrite\n  .design-context.md -> Design Context\nResult: future UI work follows shared design principles"
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

const agentPreviews = {
  zh: {
    orchestrator: {
      title: "Main Agent / Orchestrator",
      input: "$ codex\n> 这个改动涉及 README、landing page 和校验,帮我拆给 multi-agent 跑",
      output: "Plan\n  1. Explorer: 查现有页面结构和文档约定\n  2. Worker: 只改 landing page 与 README\n  3. Verifier: 独立跑脚本和预览检查\nGuardrails\n  主 agent 保留 git、最终判断和用户沟通"
    },
    explorer: {
      title: "Explorer",
      input: "$ subagent explorer\nobjective: 找出 workflow 和 runtime preview 的现有渲染入口\nwrite_scope: none",
      output: "Evidence\n  site/index.html: preview tabs + workflow cards\n  site/app.js: skillPreviews + workflowNodeSpecs\n  site/styles.css: tab/card/graph styles\nRisk\n  语言切换和自动轮播需要一起更新"
    },
    worker: {
      title: "Worker",
      input: "$ subagent worker\nobjective: 实现两种模式切换\nwrite_scope: site/index.html site/app.js site/styles.css",
      output: "Changed\n  Runtime preview: skills / agents 两套 tab\n  Workflow: skills / agents 两套 cards + graph data\n  CSS: mode switch + hidden grids\nVerify\n  node --check site/app.js"
    },
    verifier: {
      title: "Verifier",
      input: "$ subagent verifier\nobjective: 独立验证 landing page 改动\nwrite_scope: none",
      output: "Commands\n  bash scripts/validate-repo.sh\n  node --check site/app.js\n  git diff --check\nBrowser\n  Desktop + mobile: no horizontal overflow\nResult\n  evidence ready for main agent"
    },
    reviewer: {
      title: "Reviewer",
      input: "$ subagent reviewer\nobjective: 检查 diff 是否越界或破坏原 skill 安装",
      output: "Review\n  Scope: landing page + docs validation only\n  Risk: hidden tab active state, graph fallback text\n  Verdict: READY if mode switch and language switch both pass"
    }
  },
  en: {
    orchestrator: {
      title: "Main Agent / Orchestrator",
      input: "$ codex\n> This touches README, the landing page, and validation. Split it for multi-agent work.",
      output: "Plan\n  1. Explorer: inspect page structure and doc conventions\n  2. Worker: edit only landing page and README surfaces\n  3. Verifier: run scripts and preview checks independently\nGuardrails\n  Main agent keeps git, final judgment, and user communication"
    },
    explorer: {
      title: "Explorer",
      input: "$ subagent explorer\nobjective: find current workflow and runtime preview render points\nwrite_scope: none",
      output: "Evidence\n  site/index.html: preview tabs + workflow cards\n  site/app.js: skillPreviews + workflowNodeSpecs\n  site/styles.css: tab/card/graph styles\nRisk\n  Language switching and auto-cycle must be updated together"
    },
    worker: {
      title: "Worker",
      input: "$ subagent worker\nobjective: implement two mode switches\nwrite_scope: site/index.html site/app.js site/styles.css",
      output: "Changed\n  Runtime preview: separate skills / agents tabs\n  Workflow: separate skills / agents cards + graph data\n  CSS: mode switch + hidden grids\nVerify\n  node --check site/app.js"
    },
    verifier: {
      title: "Verifier",
      input: "$ subagent verifier\nobjective: independently verify landing page changes\nwrite_scope: none",
      output: "Commands\n  bash scripts/validate-repo.sh\n  node --check site/app.js\n  git diff --check\nBrowser\n  Desktop + mobile: no horizontal overflow\nResult\n  evidence ready for the main agent"
    },
    reviewer: {
      title: "Reviewer",
      input: "$ subagent reviewer\nobjective: check whether the diff exceeds scope or breaks skill install",
      output: "Review\n  Scope: landing page + docs validation only\n  Risk: hidden tab active state, graph fallback text\n  Verdict: READY if mode switch and language switch both pass"
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
const HERO_TERMINAL_HOLD_MS = 6000;
let previewRunId = 0;
let heroTypingRunId = 0;
let heroTerminalIndex = 0;
let headerFrame = 0;
let previewAutoCycleTimer = 0;
let previewCountdownFrame = 0;
let previewAutoCycling = false;
let previewUserInteracted = false;
const mobileNavMedia = window.matchMedia("(max-width: 860px)");
let workflowGraph = null;
let activeWorkflowMode = "skills";
let workflowRenderFrame = 0;
let workflowObservedWidth = 0;

const workflowPalette = {
  shared: { color: "#1f5f78", soft: "#e8f4f6" },
  main: { color: "#1f5f78", soft: "#e8f4f6" },
  explore: { color: "#23725f", soft: "#e6f5ee" },
  work: { color: "#a46a16", soft: "#fff5dc" },
  check: { color: "#6733b8", soft: "#f1ebff" },
  feature: { color: "#1465d9", soft: "#e9f0ff" },
  hotfix: { color: "#16835f", soft: "#e6f5ee" },
  bug: { color: "#ef5b12", soft: "#fff0e8" },
  decision: { color: "#a46a16", soft: "#fff5dc" },
  review: { color: "#6733b8", soft: "#f1ebff" },
  dark: { color: "#202d45", soft: "#eef1f6" }
};

const workflowNodeSpecsByMode = {
  skills: [
    { id: "start", branch: "shared", tone: "shared", icon: "in", phaseKey: "workflow.node.start.phase", titleKey: "workflow.node.start.title", descKey: "workflow.node.start.desc", column: "center", y: "start", size: "wide" },
    { id: "feature", branch: "feature", tone: "feature", icon: "1", phaseKey: "workflow.node.feature.phase", titleKey: "workflow.node.feature.title", descKey: "workflow.node.feature.desc", column: "left", y: "feature", size: "branch" },
    { id: "hotfix", branch: "hotfix", tone: "hotfix", icon: "2", phaseKey: "workflow.node.hotfix.phase", titleKey: "workflow.node.hotfix.title", descKey: "workflow.node.hotfix.desc", column: "center", y: "hotfix", size: "branch" },
    { id: "bug", branch: "bug", tone: "bug", icon: "3", phaseKey: "workflow.node.bug.phase", titleKey: "workflow.node.bug.title", descKey: "workflow.node.bug.desc", column: "right", y: "bug", size: "branch" },
    { id: "quality", branch: "shared", tone: "review", icon: "Q", phaseKey: "workflow.node.quality.phase", titleKey: "workflow.node.quality.title", descKey: "workflow.node.quality.desc", column: "center", y: "quality", size: "wide" },
    { id: "ship", branch: "shared", tone: "dark", icon: "S", phaseKey: "workflow.node.ship.phase", titleKey: "workflow.node.ship.title", descKey: "workflow.node.ship.desc", column: "center", y: "ship", size: "wide" }
  ],
  agents: [
    { id: "request", branch: "shared", tone: "shared", icon: "in", phaseKey: "workflow.agent.node.request.phase", titleKey: "workflow.agent.node.request.title", descKey: "workflow.agent.node.request.desc", column: "center", y: "start", size: "wide" },
    { id: "main", branch: "shared", tone: "main", icon: "M", phaseKey: "workflow.agent.node.main.phase", titleKey: "workflow.agent.node.main.title", descKey: "workflow.agent.node.main.desc", column: "center", y: "scope", size: "wide" },
    { id: "explorer", branch: "explore", tone: "explore", icon: "E", phaseKey: "workflow.agent.node.explorer.phase", titleKey: "workflow.agent.node.explorer.title", descKey: "workflow.agent.node.explorer.desc", column: "left", y: "explore", size: "branch" },
    { id: "worker", branch: "work", tone: "work", icon: "W", phaseKey: "workflow.agent.node.worker.phase", titleKey: "workflow.agent.node.worker.title", descKey: "workflow.agent.node.worker.desc", column: "right", y: "work", size: "branch" },
    { id: "verifier", branch: "check", tone: "check", icon: "V", phaseKey: "workflow.agent.node.verifier.phase", titleKey: "workflow.agent.node.verifier.title", descKey: "workflow.agent.node.verifier.desc", column: "left", y: "verify", size: "branch" },
    { id: "reviewer", branch: "check", tone: "review", icon: "R", phaseKey: "workflow.agent.node.reviewer.phase", titleKey: "workflow.agent.node.reviewer.title", descKey: "workflow.agent.node.reviewer.desc", column: "right", y: "review", size: "branch" },
    { id: "integrate", branch: "shared", tone: "decision", icon: "I", phaseKey: "workflow.agent.node.integrate.phase", titleKey: "workflow.agent.node.integrate.title", descKey: "workflow.agent.node.integrate.desc", column: "center", y: "integrate", size: "wide" },
    { id: "ship-agent", branch: "shared", tone: "dark", icon: "S", phaseKey: "workflow.agent.node.ship.phase", titleKey: "workflow.agent.node.ship.title", descKey: "workflow.agent.node.ship.desc", column: "center", y: "ship", size: "wide" }
  ]
};

const workflowEdgeSpecsByMode = {
  skills: [
    { id: "start-feature", source: "start", target: "feature", branch: "feature" },
    { id: "start-hotfix", source: "start", target: "hotfix", branch: "hotfix" },
    { id: "start-bug", source: "start", target: "bug", branch: "bug" },
    { id: "feature-quality", source: "feature", target: "quality", branch: "feature" },
    { id: "hotfix-quality", source: "hotfix", target: "quality", branch: "hotfix" },
    { id: "bug-quality", source: "bug", target: "quality", branch: "bug" },
    { id: "quality-ship", source: "quality", target: "ship", branch: "shared" }
  ],
  agents: [
    { id: "request-main", source: "request", target: "main", branch: "shared" },
    { id: "main-explorer", source: "main", target: "explorer", branch: "explore" },
    { id: "main-worker", source: "main", target: "worker", branch: "work" },
    { id: "explorer-integrate", source: "explorer", target: "integrate", branch: "explore" },
    { id: "worker-verifier", source: "worker", target: "verifier", branch: "check" },
    { id: "worker-reviewer", source: "worker", target: "reviewer", branch: "check" },
    { id: "verifier-integrate", source: "verifier", target: "integrate", branch: "check" },
    { id: "reviewer-integrate", source: "reviewer", target: "integrate", branch: "check" },
    { id: "integrate-ship", source: "integrate", target: "ship-agent", branch: "shared" }
  ]
};

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
  const previewsByMode = currentPreviewMode === "agents" ? agentPreviews : skillPreviews;
  return previewsByMode[currentLanguage] || previewsByMode.zh;
}

function heroTerminalScripts() {
  return [
    {
      label: translate("hero.terminal.workflow.label"),
      text: translate("hero.terminal.workflow")
    },
    {
      label: translate("hero.terminal.agents.label"),
      text: translate("hero.terminal.agents")
    }
  ];
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
  updateWorkflowModeText();
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
  heroTerminalIndex = 0;
  renderHeroTerminal();
  renderWorkflowGraph();
  const activePreview = previewButtons().find((button) => button.classList.contains("is-active")) || previewButtons()[0];
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

  const scripts = heroTerminalScripts();
  const activeIndex = heroTerminalIndex % scripts.length;
  const script = scripts[activeIndex];
  const runId = heroTypingRunId + 1;
  heroTypingRunId = runId;
  terminal.dataset.heroTerminalMode = activeIndex === 0 ? "workflow" : "agents";
  terminal.classList.remove("is-typed");

  const mode = terminal.querySelector("[data-hero-terminal-label]");
  if (mode) mode.textContent = script.label;

  if (!pre.querySelector(".hero-cursor")) {
    const cursor = document.createElement("span");
    cursor.className = "cursor hero-cursor";
    cursor.setAttribute("aria-hidden", "true");
    pre.append(cursor);
  }

  terminal.classList.add("is-typing");
  const typed = await typeText(code, script.text, 17, () => runId === heroTypingRunId);
  if (!typed) return;
  terminal.classList.remove("is-typing");
  terminal.classList.add("is-typed");

  await sleep(HERO_TERMINAL_HOLD_MS);
  if (runId !== heroTypingRunId) return;

  heroTerminalIndex = (activeIndex + 1) % scripts.length;
  renderHeroTerminal();
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
  return [...document.querySelectorAll(`.skill-tab[data-preview-mode="${currentPreviewMode}"]`)];
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

  document.querySelectorAll(".skill-tab").forEach((button) => {
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

  setActiveButton(document.querySelectorAll(".skill-tab"), button);
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

function setPreviewMode(mode, userInitiated = true) {
  if (!["skills", "agents"].includes(mode)) return;

  if (userInitiated) {
    previewUserInteracted = true;
    stopPreviewAutoCycle();
  }

  currentPreviewMode = mode;
  document.querySelectorAll("[data-preview-tabs]").forEach((tablist) => {
    tablist.hidden = tablist.dataset.previewTabs !== mode;
  });

  const buttons = previewButtons();
  const activeButton = buttons.find((button) => button.classList.contains("is-active")) || buttons[0];
  activatePreview(activeButton, userInitiated);
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

function activeWorkflowNodeSpecs() {
  return workflowNodeSpecsByMode[activeWorkflowMode] || workflowNodeSpecsByMode.skills;
}

function activeWorkflowEdgeSpecs() {
  return workflowEdgeSpecsByMode[activeWorkflowMode] || workflowEdgeSpecsByMode.skills;
}

function updateWorkflowModeText() {
  const textKeys = activeWorkflowMode === "agents"
    ? {
        diagram: "workflow.agent.diagram.aria",
        graph: "workflow.agent.graph.aria",
        fallback: "workflow.agent.fallback"
      }
    : {
        diagram: "workflow.diagram.aria",
        graph: "workflow.graph.aria",
        fallback: "workflow.fallback"
      };

  document.querySelector(".workflow-diagram")?.setAttribute("aria-label", translate(textKeys.diagram));
  document.querySelector("#workflow-graph")?.setAttribute("aria-label", translate(textKeys.graph));
  const fallback = document.querySelector(".workflow-graph-fallback");
  if (fallback) fallback.textContent = translate(textKeys.fallback);
}

function workflowLayout(width, mode = activeWorkflowMode) {
  const compact = width < 760;
  const center = width * 0.5;
  const sideInset = compact ? Math.max(105, width * 0.28) : Math.max(126, width * 0.2);
  const oppositeSide = width - sideInset;
  if (mode === "agents") {
    return {
      compact,
      height: compact ? 930 : 760,
      columns: {
        left: sideInset,
        center,
        right: oppositeSide
      },
      rows: compact
        ? { start: 58, scope: 160, explore: 282, work: 392, verify: 506, review: 618, integrate: 746, ship: 846 }
        : { start: 58, scope: 152, explore: 292, work: 292, verify: 438, review: 438, integrate: 594, ship: 700 },
      sizes: {
        branch: compact ? [198, 84] : [230, 86],
        wide: compact ? [226, 82] : [298, 78]
      }
    };
  }

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
  const nodes = activeWorkflowNodeSpecs().map((node) => {
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

  const edges = activeWorkflowEdgeSpecs().map((edge) => {
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

function workflowFallbackEdgePath(sourceNode, targetNode) {
  const [sourceWidth, sourceHeight] = sourceNode.style.size;
  const [targetWidth, targetHeight] = targetNode.style.size;
  const x1 = sourceNode.style.x;
  const y1 = sourceNode.style.y + sourceHeight / 2;
  const x2 = targetNode.style.x;
  const y2 = targetNode.style.y - targetHeight / 2;
  const midY = y1 + Math.max(34, (y2 - y1) * 0.5);
  return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
}

function workflowChainForNode(nodeId) {
  const edgeSpecs = activeWorkflowEdgeSpecs();
  const nodeIds = new Set([nodeId]);
  const edgeIds = new Set();
  const incoming = new Map();
  const outgoing = new Map();

  edgeSpecs.forEach((edge) => {
    if (!incoming.has(edge.target)) incoming.set(edge.target, []);
    if (!outgoing.has(edge.source)) outgoing.set(edge.source, []);
    incoming.get(edge.target).push(edge);
    outgoing.get(edge.source).push(edge);
  });

  const visitIncoming = (currentNodeId) => {
    (incoming.get(currentNodeId) || []).forEach((edge) => {
      if (edgeIds.has(edge.id)) return;
      edgeIds.add(edge.id);
      nodeIds.add(edge.source);
      visitIncoming(edge.source);
    });
  };

  const visitOutgoing = (currentNodeId) => {
    (outgoing.get(currentNodeId) || []).forEach((edge) => {
      if (edgeIds.has(edge.id)) return;
      edgeIds.add(edge.id);
      nodeIds.add(edge.target);
      visitOutgoing(edge.target);
    });
  };

  visitIncoming(nodeId);
  visitOutgoing(nodeId);

  return { nodeIds, edgeIds };
}

function renderWorkflowFallbackGraph(graphContainer, width, data) {
  const nodeById = new Map(data.nodes.map((node) => [node.id, node]));
  const edgeMarkup = data.edges.map((edge) => {
    const sourceNode = nodeById.get(edge.source);
    const targetNode = nodeById.get(edge.target);
    const tone = workflowPalette[edge.branch] || workflowPalette.shared;
    if (!sourceNode || !targetNode) return "";

    return `<path class="workflow-fallback-edge" data-edge-id="${escapeHtml(edge.id)}" d="${workflowFallbackEdgePath(sourceNode, targetNode)}" stroke="${tone.color}" stroke-width="${edge.branch === "shared" ? 4 : 3.4}" fill="none" opacity="${edge.branch === "shared" ? 0.72 : 0.86}" stroke-linecap="round" />`;
  }).join("");

  const nodeMarkup = data.nodes.map((node) => {
    const [nodeWidth, nodeHeight] = node.style.size;
    const left = node.style.x - nodeWidth / 2;
    const top = node.style.y - nodeHeight / 2;
    return `
      <div class="workflow-fallback-node" style="left:${left}px;top:${top}px;width:${nodeWidth}px;height:${nodeHeight}px;">
        ${workflowNodeMarkup(node)}
      </div>
    `;
  }).join("");

  graphContainer.classList.add("is-fallback");
  graphContainer.style.height = `${data.height}px`;
  graphContainer.innerHTML = `
    <svg class="workflow-fallback-edges" viewBox="0 0 ${width} ${data.height}" aria-hidden="true" focusable="false">
      ${edgeMarkup}
    </svg>
    <div class="workflow-fallback-nodes" aria-hidden="true">
      ${nodeMarkup}
    </div>
    <p class="workflow-graph-fallback">${escapeHtml(translate(activeWorkflowMode === "agents" ? "workflow.agent.fallback" : "workflow.fallback"))}</p>
  `;
  setupWorkflowGraphFocus();
}

function applyWorkflowEdgeState(edgeIds) {
  if (!workflowGraph) return;

  activeWorkflowEdgeSpecs().forEach((edge) => {
    workflowGraph.setElementState(edge.id, edgeIds ? (edgeIds.has(edge.id) ? ["active"] : ["inactive"]) : []);
  });
}

function clearWorkflowChainFocus() {
  const graphContainer = document.querySelector("#workflow-graph");
  if (!graphContainer) return;

  graphContainer.classList.remove("is-focusing-chain");
  graphContainer.querySelectorAll(".workflow-g6-node").forEach((node) => {
    node.classList.remove("is-active", "is-muted");
  });
  graphContainer.querySelectorAll(".workflow-fallback-edge").forEach((edge) => {
    edge.classList.remove("is-active", "is-muted");
  });
  applyWorkflowEdgeState(null);
}

function focusWorkflowChain(nodeId) {
  const graphContainer = document.querySelector("#workflow-graph");
  if (!graphContainer || !nodeId) return;

  const { nodeIds, edgeIds } = workflowChainForNode(nodeId);
  graphContainer.classList.add("is-focusing-chain");
  graphContainer.querySelectorAll(".workflow-g6-node").forEach((node) => {
    const isInChain = nodeIds.has(node.dataset.nodeId);
    node.classList.toggle("is-active", isInChain);
    node.classList.toggle("is-muted", !isInChain);
  });
  graphContainer.querySelectorAll(".workflow-fallback-edge").forEach((edge) => {
    const isInChain = edgeIds.has(edge.dataset.edgeId);
    edge.classList.toggle("is-active", isInChain);
    edge.classList.toggle("is-muted", !isInChain);
  });
  applyWorkflowEdgeState(edgeIds);
}

function setupWorkflowGraphFocus() {
  const graphContainer = document.querySelector("#workflow-graph");
  if (!graphContainer) return;

  graphContainer.querySelectorAll(".workflow-g6-node[data-node-id]").forEach((node) => {
    node.addEventListener("mouseenter", () => focusWorkflowChain(node.dataset.nodeId));
    node.addEventListener("mouseleave", (event) => {
      if (event.relatedTarget?.closest?.(".workflow-g6-node[data-node-id]")) return;
      clearWorkflowChainFocus();
    });
  });

  graphContainer.onmouseleave = clearWorkflowChainFocus;
}

function renderWorkflowGraph() {
  const graphContainer = document.querySelector("#workflow-graph");
  const G6 = window.G6;
  if (!graphContainer) return;

  updateWorkflowModeText();
  const width = Math.max(320, Math.floor(graphContainer.getBoundingClientRect().width || graphContainer.clientWidth));
  const data = buildWorkflowGraphData(width);
  if (!G6?.Graph) {
    if (workflowGraph) {
      workflowGraph.destroy();
      workflowGraph = null;
    }
    renderWorkflowFallbackGraph(graphContainer, width, data);
    return;
  }

  graphContainer.style.height = `${data.height}px`;
  graphContainer.classList.remove("is-fallback");

  if (workflowGraph) {
    workflowGraph.destroy();
    workflowGraph = null;
  }
  graphContainer.innerHTML = "";

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

function setWorkflowMode(mode) {
  if (!["skills", "agents"].includes(mode)) return;

  clearWorkflowChainFocus();
  activeWorkflowMode = mode;
  document.querySelectorAll("[data-workflow-grid]").forEach((grid) => {
    grid.hidden = grid.dataset.workflowGrid !== mode;
  });

  updateWorkflowModeText();
  renderWorkflowGraph();
}

function setExperienceMode(mode, userInitiated = true) {
  if (!["skills", "agents"].includes(mode)) return;

  currentExperienceMode = mode;
  document.querySelectorAll("[data-experience-mode]").forEach((button) => {
    const isActive = button.dataset.experienceMode === mode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.setAttribute("tabindex", isActive ? "0" : "-1");
  });

  document.querySelectorAll("[data-experience-only]").forEach((element) => {
    element.hidden = element.dataset.experienceOnly !== mode;
  });

  setPreviewMode(mode, userInitiated);
  setWorkflowMode(mode);
}

document.querySelectorAll(".skill-tab").forEach((button) => {
  button.addEventListener("click", () => {
    activatePreview(button, !previewAutoCycling);
  });
});

document.querySelectorAll("[data-experience-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    setExperienceMode(button.dataset.experienceMode);
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

window.renderWorkflowGraph = renderWorkflowGraph;
setExperienceMode(currentExperienceMode, false);
setupWorkflowGraphResizeObserver();
window.addEventListener("load", renderWorkflowGraph);
window.addEventListener("resize", scheduleWorkflowGraphRender);
renderHeroTerminal();
startPreviewAutoCycle();
