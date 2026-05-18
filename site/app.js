const skillPreviews = {
  "dev-workflow": {
    title: "Dev Workflow",
    input: "$ codex\n> 用 dev-workflow 帮我串起来,下一步该做什么?",
    output: "━━━ Dev Workflow ━━━\n路径   : feature\n复杂度 : moderate\n下一步\n  $ dev-spec --default user-export\n为什么:先把模糊需求拆成可验证 spec。"
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

const installOptions = {
  claude: {
    title: "Claude Code",
    command: "/plugin marketplace add https://github.com/Jason-chen-coder/dev-skills\n/plugin install dev-skills",
    notes: "升级: /plugin update dev-skills。短版团队规则复制 CLAUDE.md.template 到项目根 CLAUDE.md;详细政策参考 docs/team-policy.md。"
  },
  codex: {
    title: "Codex",
    command: "git clone https://github.com/Jason-chen-coder/dev-skills.git\ncd dev-skills\nmkdir -p \"${CODEX_HOME:-$HOME/.codex}/skills\"\ncp -R skills/* \"${CODEX_HOME:-$HOME/.codex}/skills/\"",
    notes: "升级: git pull --ff-only 后重新同步 skills/*。短版团队规则复制 AGENTS.md.template 到项目根 AGENTS.md;详细政策参考 docs/team-policy.md。"
  },
  npx: {
    title: "npx skills",
    command: "npx skills add Jason-chen-coder/dev-skills\nnpx skills add Jason-chen-coder/dev-skills --global",
    notes: "升级优先使用 npx skills update;如果版本不支持 update,使用 add --force 重新安装。团队规则模板仍需人工同步。"
  }
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let previewRunId = 0;
let headerFrame = 0;

const workflowFlows = [
  { id: "start-workflow", from: "start", to: "workflow", kind: "vertical" },
  { id: "workflow-decision", from: "workflow", to: "decision", kind: "vertical" },
  { id: "decision-spec", from: "decision", to: "spec", kind: "branch-left" },
  { id: "decision-fix", from: "decision", to: "fix", kind: "branch-right" },
  { id: "spec-plan", from: "spec", to: "plan", kind: "vertical" },
  { id: "plan-build", from: "plan", to: "build", kind: "vertical" },
  { id: "build-review", from: "build", to: "review", kind: "merge-left" },
  { id: "fix-verify", from: "fix", to: "verify", kind: "vertical" },
  { id: "verify-patch", from: "verify", to: "patch", kind: "vertical" },
  { id: "patch-review", from: "patch", to: "review", kind: "merge-right" },
  { id: "review-commit", from: "review", to: "commit", kind: "vertical" }
];

function sleep(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function typeText(target, text, delay, runId) {
  if (!target) return false;
  if (reduceMotion) {
    target.textContent = text;
    return runId === previewRunId;
  }

  target.textContent = "";
  for (let index = 0; index < text.length; index += 1) {
    if (runId !== previewRunId) return false;
    target.textContent += text[index];
    await sleep(delay);
  }

  return runId === previewRunId;
}

async function renderPreview(skill) {
  const data = skillPreviews[skill];
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

  const inputDone = await typeText(input, data.input, 18, runId);
  if (!inputDone) return;

  if (!reduceMotion) await sleep(180);
  if (runId !== previewRunId) return;

  panel.classList.remove("is-waiting");
  panel.classList.add("is-typing");

  const outputDone = await typeText(output, data.output, 12, runId);
  if (!outputDone) return;

  panel.classList.remove("is-typing");
  panel.setAttribute("aria-busy", "false");
}

function setActiveButton(buttons, activeButton) {
  buttons.forEach((button) => {
    const isActive = button === activeButton;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

function workflowNodeBox(node, mapBox) {
  const box = node.getBoundingClientRect();
  return {
    left: box.left - mapBox.left,
    right: box.right - mapBox.left,
    top: box.top - mapBox.top,
    bottom: box.bottom - mapBox.top,
    width: box.width,
    height: box.height,
    centerX: box.left - mapBox.left + box.width / 2,
    centerY: box.top - mapBox.top + box.height / 2
  };
}

function workflowPathFor(flow, from, to) {
  const sourceBleed = 2;
  const arrowGap = 7;
  const startY = from.bottom - sourceBleed;
  const endY = to.top - arrowGap;
  const startX = from.centerX;
  const endX = to.centerX;
  const elbowY = startY + Math.max(24, Math.min(52, (endY - startY) * 0.58));

  if (flow.kind === "vertical") {
    return `M${startX} ${startY} L${endX} ${endY}`;
  }

  if (flow.kind === "branch-left" || flow.kind === "branch-right") {
    const sourceOffset = flow.kind === "branch-left" ? -26 : 26;
    const sourceX = from.centerX + sourceOffset;
    return `M${sourceX} ${startY} L${sourceX} ${elbowY} L${endX} ${elbowY} L${endX} ${endY}`;
  }

  if (flow.kind === "merge-left" || flow.kind === "merge-right") {
    const targetOffset = flow.kind === "merge-left" ? -22 : 22;
    const targetX = to.centerX + targetOffset;
    return `M${startX} ${startY} L${startX} ${elbowY} L${targetX} ${elbowY} L${targetX} ${endY}`;
  }

  return `M${startX} ${startY} L${endX} ${endY}`;
}

function layoutWorkflowLines() {
  const map = document.querySelector(".workflow-map");
  const svg = document.querySelector(".workflow-lines");
  if (!map || !svg) return;

  const mapBox = map.getBoundingClientRect();
  svg.setAttribute("viewBox", `0 0 ${mapBox.width} ${mapBox.height}`);

  const nodes = new Map(
    [...map.querySelectorAll("[data-node]")].map((node) => [
      node.dataset.node,
      workflowNodeBox(node, mapBox)
    ])
  );

  workflowFlows.forEach((flow) => {
    const from = nodes.get(flow.from);
    const to = nodes.get(flow.to);
    const track = svg.querySelector(`[data-flow-track="${flow.id}"]`);
    const line = svg.querySelector(`[data-flow-line="${flow.id}"]`);
    if (!from || !to || !track || !line) return;

    const path = workflowPathFor(flow, from, to);
    track.setAttribute("d", path);
    line.setAttribute("d", path);
  });
}

document.querySelectorAll(".skill-tab").forEach((button) => {
  button.addEventListener("click", () => {
    setActiveButton(document.querySelectorAll(".skill-tab"), button);
    renderPreview(button.dataset.skill);
  });
});

document.querySelectorAll(".install-tab").forEach((button) => {
  button.addEventListener("click", () => {
    const option = installOptions[button.dataset.install];
    if (!option) return;

    setActiveButton(document.querySelectorAll(".install-tab"), button);
    document.querySelector("#install-title").textContent = option.title;
    document.querySelector("#install-command").textContent = option.command;
    document.querySelector("#install-notes").innerHTML = `<p>${option.notes}</p>`;
  });
});

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.querySelector(button.dataset.copyTarget);
    if (!target) return;

    try {
      await navigator.clipboard.writeText(target.textContent.trim());
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = "Copy";
      }, 1200);
    } catch {
      button.textContent = "Select text";
      window.setTimeout(() => {
        button.textContent = "Copy";
      }, 1200);
    }
  });
});

function updateHeaderState() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  header.classList.toggle("is-condensed", window.scrollY > 24);
}

function scheduleHeaderStateUpdate() {
  if (headerFrame) return;

  headerFrame = window.requestAnimationFrame(() => {
    headerFrame = 0;
    updateHeaderState();
  });
}

updateHeaderState();
window.addEventListener("load", updateHeaderState);
window.addEventListener("resize", updateHeaderState);
window.addEventListener("scroll", scheduleHeaderStateUpdate, { passive: true });

layoutWorkflowLines();
window.addEventListener("load", layoutWorkflowLines);
window.addEventListener("resize", layoutWorkflowLines);

if ("ResizeObserver" in window) {
  const workflowMap = document.querySelector(".workflow-map");
  if (workflowMap) {
    const workflowObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(layoutWorkflowLines);
    });
    workflowObserver.observe(workflowMap);
    document.querySelectorAll(".workflow-node").forEach((node) => {
      workflowObserver.observe(node);
    });
  }
}

renderPreview("dev-workflow");
