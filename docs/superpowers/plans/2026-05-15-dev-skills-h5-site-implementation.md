# dev-skills H5 Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static H5 landing page for `dev-skills` and publish it as the official GitHub Pages site on `master` pushes.

**Architecture:** Use a lightweight static site in `site/` with no build step: `index.html` for semantic content, `styles.css` for the trusted product-page visual system, and `app.js` for tabs, copy buttons, and the Skill Runtime Preview typewriter effect. GitHub Actions uploads `site/` directly to GitHub Pages.

**Tech Stack:** HTML, CSS, vanilla JavaScript, GitHub Actions Pages deployment.

---

## File Structure

- Create `site/index.html`: complete single-page H5 structure, including Hero, Skill Library, Skill Runtime Preview, Workflow, Install / Upgrade, and FAQ sections.
- Create `site/styles.css`: responsive trusted product-page styling, terminal preview styling, tabs, command blocks, and mobile layout.
- Create `site/app.js`: install tabs, skill preview tabs, typewriter effect with `prefers-reduced-motion`, and copy command buttons.
- Create `.github/workflows/deploy-pages.yml`: deploy `site/` to GitHub Pages on `master` push and manual dispatch.
- Modify `README.md`: add official site link after the badge area once the Pages workflow exists.
- Modify `CHANGELOG.md`: record the H5 site and GitHub Pages deployment addition.

## Task 1: Static Site Shell

**Files:**
- Create: `site/index.html`

- [ ] **Step 1: Create semantic page structure**

Create `site/index.html` with:

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>dev-skills - AI 开发工作流 Skill 库</title>
  <meta name="description" content="6 个 AI 开发 skill,串起需求对齐、实施方案、Bug 修复、提交前 review 和 commit message。">
  <link rel="stylesheet" href="./styles.css">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="#top" aria-label="dev-skills home">dev-skills</a>
    <nav class="nav-links" aria-label="Primary navigation">
      <a href="#skills">Skills</a>
      <a href="#preview">Preview</a>
      <a href="#workflow">Workflow</a>
      <a href="#install">Install</a>
      <a href="https://github.com/Jason-chen-coder/dev-skills">GitHub</a>
    </nav>
  </header>
  <main id="top">
    <section class="hero">...</section>
    <section id="skills" class="section">...</section>
    <section id="preview" class="section">...</section>
    <section id="workflow" class="section">...</section>
    <section id="install" class="section">...</section>
    <section id="faq" class="section">...</section>
  </main>
  <script src="./app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Open locally**

Run:

```bash
open site/index.html
```

Expected: browser opens a mostly unstyled page with all sections visible.

## Task 2: Trusted Product Visual System

**Files:**
- Create: `site/styles.css`
- Modify: `site/index.html`

- [ ] **Step 1: Add layout and visual styling**

Implement a white, restrained product-page visual system:

```css
:root {
  --bg: #f7f8fb;
  --surface: #ffffff;
  --text: #1b2430;
  --muted: #657184;
  --line: #dfe5ee;
  --accent: #2563eb;
  --accent-2: #0f766e;
  --warning: #b7791f;
  --code-bg: #111418;
  --code-text: #e6edf3;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

- [ ] **Step 2: Add responsive rules**

Add breakpoints:

```css
@media (max-width: 900px) {
  .hero-grid,
  .preview-grid,
  .workflow-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .nav-links {
    display: none;
  }

  .section {
    padding: 56px 18px;
  }

  pre,
  .terminal-panel {
    overflow-x: auto;
  }
}
```

- [ ] **Step 3: Verify mobile width**

Run a local static server:

```bash
python3 -m http.server 4173 --directory site
```

Expected: `http://localhost:4173` renders without horizontal page overflow at 390px and 1440px widths.

## Task 3: Skill Runtime Preview

**Files:**
- Modify: `site/index.html`
- Modify: `site/styles.css`
- Create: `site/app.js`

- [ ] **Step 1: Add preview markup**

Add a `#preview` section with 6 tab buttons, a left terminal panel, and a right output panel:

```html
<div class="skill-tabs" role="tablist" aria-label="Skill runtime previews">
  <button class="skill-tab is-active" type="button" data-skill="dev-workflow">dev-workflow</button>
  <button class="skill-tab" type="button" data-skill="dev-spec">dev-spec</button>
  <button class="skill-tab" type="button" data-skill="dev-plan">dev-plan</button>
  <button class="skill-tab" type="button" data-skill="dev-fix">dev-fix</button>
  <button class="skill-tab" type="button" data-skill="dev-code-review">dev-code-review</button>
  <button class="skill-tab" type="button" data-skill="dev-commit-writer">dev-commit-writer</button>
</div>
<div class="preview-grid">
  <div class="terminal-panel" aria-label="Codex CLI input preview">
    <div class="terminal-title">codex cli</div>
    <pre><code id="preview-input"></code><span class="cursor" aria-hidden="true"></span></pre>
  </div>
  <div class="output-panel" aria-live="polite">
    <div class="output-title" id="preview-title"></div>
    <pre><code id="preview-output"></code></pre>
  </div>
</div>
```

- [ ] **Step 2: Add preview data and tab logic**

In `site/app.js`, define:

```js
const skillPreviews = {
  "dev-workflow": {
    title: "Dev Workflow",
    input: "$ codex\n> 用 dev-workflow 帮我串起来,下一步该做什么?",
    output: "━━━ Dev Workflow ━━━\n路径   : feature\n复杂度 : moderate\n下一步\n  $ dev-spec --default user-export\n为什么:先把模糊需求拆成可验证 spec。"
  },
  "dev-spec": {
    title: "Dev Spec",
    input: "$ codex\n> 用 dev-spec 帮我设计用户导出功能",
    output: "执行 dev-spec 前,我需要确认:\n1. 导出谁的数据?\n2. CSV 还是 JSON?\n3. 同步还是异步?\n回答后生成 .claude/artifacts/designs/user-export.md"
  },
  "dev-plan": {
    title: "Dev Plan",
    input: "$ codex\n> 用 dev-plan 基于 user-export spec 出实施方案",
    output: "Status: APPROVED\nOption A: 复用现有 worker\nDecision: 选 A\nRisks: 队列隔离 / S3 权限\nVerification: API + worker + notification tests"
  },
  "dev-fix": {
    title: "Dev Fix",
    input: "$ codex\n> 用 dev-fix 排查登录 30 分钟后被踢出的问题",
    output: "Reproduce: failing test RED\nHypothesis: Redis session TTL 被覆盖\nRoot cause: refresh path 写入 30m TTL\nFix: 统一使用 24h TTL\nVerify: red -> green -> red"
  },
  "dev-code-review": {
    title: "Dev Code Review",
    input: "$ codex\n> 用 dev-code-review 看下这次修改,准备 commit",
    output: "━━━ Dev Code Review ━━━\nVerdict   : ✅ READY\nAxis Check\n  规范   ✓\n  功能   ✓\n  闭环   ✓\nCommit\n  docs: update install flow"
  },
  "dev-commit-writer": {
    title: "Dev Commit Writer",
    input: "$ codex\n> 我自审过了,只要 commit message",
    output: "docs: update Codex install instructions\n\nClarify manual skill sync and AGENTS.md template setup for Codex users."
  }
};
```

- [ ] **Step 3: Implement typewriter with reduced-motion support**

Implement:

```js
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function renderPreview(skill) {
  const data = skillPreviews[skill];
  document.querySelector("#preview-title").textContent = data.title;
  document.querySelector("#preview-output").textContent = data.output;
  typeInput(data.input);
}

function typeInput(text) {
  const target = document.querySelector("#preview-input");
  if (reduceMotion) {
    target.textContent = text;
    return;
  }
  target.textContent = "";
  let index = 0;
  const timer = window.setInterval(() => {
    target.textContent = text.slice(0, index + 1);
    index += 1;
    if (index >= text.length) window.clearInterval(timer);
  }, 18);
}
```

- [ ] **Step 4: Verify preview tabs**

Open `http://localhost:4173`, click all 6 tabs.

Expected: left terminal input changes and replays; right output changes immediately; no auto-rotation.

## Task 4: Install, Upgrade, and Copy Interactions

**Files:**
- Modify: `site/index.html`
- Modify: `site/app.js`
- Modify: `site/styles.css`

- [ ] **Step 1: Add install tabs**

Add tabs for Claude Code, Codex, and `npx skills`, with commands matching README.

- [ ] **Step 2: Add copy buttons**

Implement:

```js
document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.querySelector(button.dataset.copyTarget);
    await navigator.clipboard.writeText(target.textContent.trim());
    button.textContent = "Copied";
    window.setTimeout(() => {
      button.textContent = "Copy";
    }, 1200);
  });
});
```

- [ ] **Step 3: Verify no-JS fallback**

Disable JavaScript in the browser or inspect HTML directly.

Expected: commands are readable even if tabs and copy buttons do not run.

## Task 5: GitHub Pages Deployment

**Files:**
- Create: `.github/workflows/deploy-pages.yml`
- Modify: `README.md`
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Add Pages workflow**

Create `.github/workflows/deploy-pages.yml`:

```yaml
name: deploy-pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: site
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Add README site link**

Add:

```markdown
[Website](https://jason-chen-coder.github.io/dev-skills/)
```

- [ ] **Step 3: Add changelog entry**

Record the H5 site and Pages deploy workflow under `Unreleased`.

## Task 6: Final Verification

**Files:**
- All changed files

- [ ] **Step 1: Validate workflow YAML**

Run:

```bash
python3 - <<'PY'
import yaml
for path in [".github/workflows/validate.yml", ".github/workflows/deploy-pages.yml"]:
    with open(path, encoding="utf-8") as f:
        yaml.safe_load(f)
    print(f"{path}: ok")
PY
```

Expected: both workflow files parse.

- [ ] **Step 2: Run static smoke checks**

Run:

```bash
python3 -m http.server 4173 --directory site
```

Open `http://localhost:4173`.

Expected:

- Hero CTA links work.
- 6 skill preview tabs work.
- Install tabs work.
- Copy buttons work.
- Mobile viewport has no horizontal page overflow.

- [ ] **Step 3: Run repository checks**

Run:

```bash
git diff --check
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add site .github/workflows/deploy-pages.yml README.md CHANGELOG.md
git commit -m "feat: 新增 dev-skills H5 正式站点"
```
