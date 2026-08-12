import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(root, "index.html"), "utf8");
const siteHtml = readFileSync(join(root, "site", "index.html"), "utf8");
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function count(text) {
  return html.split(text).length - 1;
}

const expectedSkills = [
  "dev-auto",
  "dev-design-context",
  "dev-grill-docs",
  "dev-spec",
  "dev-plan",
  "swagger-doc-skill",
  "dev-image-to-code",
  "dev-tdd",
  "dev-fix",
  "dev-verify",
  "dev-code-review",
  "dev-commit-writer",
  "dev-finish",
];

const expectedArticles = [
  ["article-sdd.webp", "https://blog.csdn.net/weixin_39085822/article/details/161932215", "2026-06-12", "AI 写代码越快，越要先给它装上刹车"],
  ["article-review.webp", "https://blog.csdn.net/weixin_39085822/article/details/161881057", "2026-06-11", "为什么 AI 写完代码后，不能直接 commit"],
  ["article-fix.webp", "https://blog.csdn.net/weixin_39085822/article/details/161851302", "2026-06-10", "别被“已修复”骗了：AI 修 bug 最该追问这一句"],
  ["article-workflow.webp", "https://blog.csdn.net/weixin_39085822/article/details/161822966", "2026-06-09", "从需求到 commit：一套更稳的 AI 编程工作流"],
  ["article-gates.webp", "https://blog.csdn.net/weixin_39085822/article/details/161792237", "2026-06-08", "AI 越会写代码，越不能让它直接写到 commit"],
  ["article-intake.webp", "https://blog.csdn.net/weixin_39085822/article/details/161752082", "2026-06-06", "AI 编程最危险的瞬间：它还没听懂，就已经开始写了"],
];

for (const id of ["top", "why", "workflow", "skills", "swagger", "install", "articles"]) {
  check(new RegExp(`id=["']${id}["']`).test(html), `missing section anchor #${id}`);
}

for (const heading of [
  "返工通常从这六个地方开始。",
  "通常怎么做：先把需求说清，再写代码。",
  "卡在哪一步，就用哪一个 skill。",
  "先查全 endpoint 和 type，再写调用代码。",
  "选客户端，复制安装命令。",
  "文章里有需求、bug、验证和 commit。",
  "从当前卡住的地方开始。",
]) {
  check(html.includes(heading), `missing heading: ${heading}`);
}

check(html.includes("需求、bug、验证，找 skill。"), "hero statement changed");
check(html.includes("给 Claude Code 和 Codex 用，也能查 Swagger、还原 UI、检查 commit。"), "hero summary changed");
check(html.includes('<dd class="skill-names"><code data-skill="dev-auto">dev-auto</code></dd>\n          <dd class="skill-description">根据当前任务和已有产物，给出下一步 skill。</dd>'), "dev-auto skill row is missing or duplicated");
for (const rejectedCopy of [
  "AI 不只写代码，也要完成交付。",
  "AI 会写代码，不等于它会交付。",
  "从需求到 review，一条五阶段交付链。",
  "不用背 13 个名字，只按现在的问题选入口。",
  "从下一次任务开始，让每一步都留下证据。",
]) {
  check(!html.includes(rejectedCopy), `old AI-styled copy remains: ${rejectedCopy}`);
}
check(html.includes("dev-skills - Claude Code 与 Codex 开发工作流"), "page and OG title were not humanized");
check(count("dev-skills 收录 13 个 skills，供 Claude Code 和 Codex 处理需求、实现、修复、API 文档查询和提交前检查。") === 2, "meta and OG descriptions are missing or inconsistent");
check(!html.includes('src="./hero-artifacts.png"'), "hero photography was not replaced");
check(/class="[^"]*\bclosing-cta\b/.test(html), "missing closing CTA");
check(/<footer\b/.test(html), "missing footer");

const expectedHeroModes = ["workflow", "api-docs", "agents"];
const actualHeroModes = [...html.matchAll(/data-hero-terminal-mode="([^"]+)"/g)].map((match) => match[1]);
check(actualHeroModes.length === 3, `expected 3 hero mode tabs, found ${actualHeroModes.length}`);
check(expectedHeroModes.every((mode) => actualHeroModes.includes(mode)), "hero modes do not match the production implementation");
check(html.includes('aria-orientation="horizontal"'), "hero tablist lacks horizontal orientation");
check(html.includes('aria-controls="hero-terminal-panel"'), "hero tabs do not control the shared panel");
check(html.includes('id="hero-terminal-panel"'), "missing hero tabpanel id");
check(html.includes('aria-labelledby="hero-terminal-tab-workflow"'), "hero panel lacks active tab label");
for (const text of [
  "用 dev-auto 看登录页下一步",
  "当前  需求边界未确认",
  "查 Petstore 的接口和类型",
  "Result  3 modules / 19 endpoints / 6 types",
  "登录页拆给多 agent，先定各自范围",
  "Verifier  独立验证",
]) {
  check(html.includes(text), `missing production-backed hero sample: ${text}`);
}
check(html.includes("function setHeroMode"), "hero mode switching is not implemented");
check(!/setInterval\s*\(/.test(html), "hero modes must not auto-cycle");

check(html.includes("async function typeHeroText"), "hero output is not rendered through a typewriter");
check(html.includes("let heroTypingRunId = 0"), "hero typewriter lacks a cancellation run id");
check(html.includes("const runId = ++heroTypingRunId"), "each hero render does not claim a new run id");
check(html.includes("runId !== heroTypingRunId"), "stale hero typing runs are not cancelled");
check(html.includes('window.matchMedia("(prefers-reduced-motion: reduce)")'), "motion preference is not queried in JavaScript");
check(html.includes("reducedMotion.matches"), "reduced motion does not bypass incremental typing");
check(html.includes("content.textContent = sample.text"), "reduced motion does not restore the complete hero sample");
check(html.includes('panel.classList.add("is-typing")'), "hero panel does not expose its typing state");
check(html.includes('panel.classList.remove("is-typing")'), "hero typing state is not cleared after completion");
check(html.includes("@keyframes hero-cursor-blink"), "typewriter cursor animation is missing");
check(html.includes(".hero-terminal.is-typing"), "typewriter cursor is not scoped to active typing");

const revealSections = [...html.matchAll(/<section\b(?=[^>]*\bdata-reveal\b)[^>]*>/g)];
check(revealSections.length === 7, `expected 7 reveal sections, found ${revealSections.length}`);
check(html.includes("IntersectionObserver"), "section reveal does not use IntersectionObserver");
check(html.includes('document.documentElement.classList.add("motion-ready")'), "motion enhancement class is not enabled by JavaScript");
check(html.includes('classList.add("is-revealed")'), "observed sections are not revealed");
check(html.includes("observer.unobserve(entry.target)"), "section reveal is not one-time");
check(html.includes(".motion-ready [data-reveal]"), "reveal CSS is not progressively enhanced");
check(!/(?:^|})\s*\[data-reveal\]\s*\{[^}]*opacity\s*:\s*0/is.test(html), "sections are hidden even when JavaScript does not run");
check(!/(?:window|document)\.addEventListener\(\s*["']scroll["']/i.test(html), "scroll listeners are not allowed for reveal motion");

check(html.includes('id="menu-toggle"'), "missing mobile menu button");
check(html.includes('aria-controls="primary-navigation"'), "mobile menu lacks aria-controls");
check(html.includes('id="primary-navigation"'), "missing primary navigation id");
check(html.includes('setAttribute("aria-expanded"'), "mobile menu does not update aria-expanded");
check(html.includes('case "Escape"'), "mobile menu does not close with Escape");

const actualSkills = [...html.matchAll(/data-skill="([^"]+)"/g)].map((match) => match[1]);
check(actualSkills.length === expectedSkills.length, `expected 13 skill entries, found ${actualSkills.length}`);
check(new Set(actualSkills).size === expectedSkills.length, "skill entries are not unique");
for (const skill of expectedSkills) {
  check(actualSkills.includes(skill), `missing skill entry: ${skill}`);
}

for (const phrase of [
  "Swagger UI",
  "OpenAPI",
  "Knife4j",
  "FastAPI docs",
  "Redoc",
  "https://petstore3.swagger.io/api/v3/openapi.json",
  "3 Modules / 19 Endpoints / 6 Types",
]) {
  check(html.includes(phrase), `missing Swagger contract text: ${phrase}`);
}

const swaggerSection = html.match(/<section\b[^>]*id="swagger"[\s\S]*?<\/section>/)?.[0] || "";
check(swaggerSection.length > 0, "missing Swagger section markup");
check(!/<(?:picture|img)\b/.test(swaggerSection), "Swagger section still renders an image");
check(!swaggerSection.includes("swagger-artifacts"), "Swagger section still references the removed photography");
check(!swaggerSection.includes("给它一个 source，拿回完整 API 契约。"), "Swagger section keeps the AI-styled title");
check(swaggerSection.includes("先查全 endpoint 和 type，再写调用代码。"), "Swagger section lacks the plain-language title");
check(swaggerSection.includes('class="swagger-terminal"'), "Swagger section lacks its readable terminal");
for (const terminalText of [
  "查这个 Petstore 文档，列出全部 endpoint 和可复用 type/schema。",
  "Source  https://petstore3.swagger.io/api/v3/openapi.json",
  "Modules  3",
  "Endpoints  19",
  "Types  6",
  "GET /pet/{petId}",
  "200 -> Pet",
  "id: integer(int64)",
  "status: available | pending | sold",
]) {
  check(swaggerSection.includes(terminalText), `Swagger terminal lacks meaningful output: ${terminalText}`);
}
for (const rule of [
  "当前 chat 只复用这个已确认的 source。",
  "如果给了多个 source，先问清楚用哪一个。",
  "只有明确传入 --config 时才读配置。",
  "token、cookie 和 Authorization 不写进输出。",
]) {
  check(swaggerSection.includes(rule), `Swagger rule is missing or unclear: ${rule}`);
}
check(html.includes("async function typeSwaggerOutput"), "Swagger output lacks progressive typing");
check(html.includes("let swaggerTerminalPlayed = false"), "Swagger terminal lacks a play-once guard");
check(html.includes('entry.target.id === "swagger"'), "Swagger typing is not tied to section reveal");
check(html.includes("playSwaggerTerminal()"), "Swagger reveal does not start terminal feedback");
check(html.includes("swaggerTerminalPlayed = true"), "Swagger terminal never records completion ownership");
check(html.includes("reducedMotion.matches"), "Swagger feedback does not honor reduced motion");
check(html.includes("swaggerOutput.textContent = swaggerReply"), "reduced motion cannot show the complete Swagger reply");
check(html.includes(".swagger-terminal.is-typing"), "Swagger typing cursor is not scoped to active feedback");
check(html.includes("border-radius: 8px"), "Swagger terminal does not use the requested 8px radius");

for (const [image, url, date, title] of expectedArticles) {
  check(html.includes(`/${image}"`), `missing article image reference: ${image}`);
  check(html.includes(`href="${url}"`), `missing article URL: ${url}`);
  check(html.includes(`datetime="${date}"`), `missing article date: ${date}`);
  check(html.includes(title), `missing article title: ${title}`);
}
check(count('class="article-link') === 6, "expected exactly 6 article links");

for (const asset of [
  "logo-small.webp",
  ...expectedArticles.map(([image]) => image),
]) {
  check(existsSync(join(root, "site", "assets", "landing", asset)), `missing local asset: ${asset}`);
}

const normalizedSiteHtml = siteHtml.replaceAll("./assets/landing/", "./site/assets/landing/");
check(normalizedSiteHtml === html, "root and site landing pages have drifted");

for (const mode of ["claude", "codex", "npx"]) {
  check(html.includes(`data-install-mode="${mode}"`), `missing install tab: ${mode}`);
}
check(html.includes('role="tablist"'), "install tabs lack tablist role");
const installTabs = [...html.matchAll(/<button\b(?=[^>]*data-install-mode="[^"]+")(?=[^>]*role="tab")[^>]*>/g)];
check(installTabs.length === 3, "expected exactly 3 install tabs");
check(html.includes('role="tabpanel"'), "install code lacks tabpanel role");
for (const key of ["ArrowLeft", "ArrowRight", "Home", "End"]) {
  check(html.includes(`case "${key}"`), `missing install keyboard behavior: ${key}`);
}
for (const command of [
  "/plugin marketplace add https://github.com/Jason-chen-coder/dev-skills",
  "/plugin install dev-skills",
  "git clone https://github.com/Jason-chen-coder/dev-skills.git",
  "bash scripts/install-codex-skills.sh",
  "npx skills add Jason-chen-coder/dev-skills",
  "npx skills add Jason-chen-coder/dev-skills --global",
]) {
  check(html.includes(command), `missing README install command: ${command}`);
}
check(html.includes('aria-live="polite"'), "copy feedback lacks live status");
check(html.includes("navigator.clipboard.writeText"), "copy control is not wired");

for (const breakpoint of ["980px", "768px", "390px"]) {
  check(html.includes(`@media (max-width: ${breakpoint})`), `missing responsive breakpoint ${breakpoint}`);
}
check(html.includes("color-scheme: only light"), "light theme is not locked");
check(html.includes("#2457e6"), "cobalt accent is missing");
check(!/[\u2013\u2014]/u.test(html), "em dash or en dash found");
check(!/gradient/i.test(html), "gradient found");
for (const [index, line] of html.split("\n").entries()) {
  check((line.match(/·/g) || []).length <= 1, `line ${index + 1} contains more than one middle dot`);
}
for (const copy of [
  'aria-label="页面导航"',
  'aria-label="展开导航"',
  'aria-label="三组 dev-skills 命令示例"',
  'aria-label="选择命令示例"',
  'aria-label="Petstore 文档查询示例"',
  'aria-label="选择安装客户端"',
  'open ? "收起导航" : "展开导航"',
  'copyStatus.textContent = "已复制安装命令。"',
  'copyButton.textContent = "无法复制"',
]) {
  check(html.includes(copy), `dynamic or accessible copy was not updated: ${copy}`);
}

const intentAnchors = [...html.matchAll(/<a\b[^>]*class="[^"]*intent-button[^"]*"[^>]*>([\s\S]*?)<\/a>/g)]
  .map((match) => match[1].replace(/<[^>]+>/g, "").trim());
check(intentAnchors.length >= 4, "expected repeated install and GitHub intent buttons");
check(intentAnchors.every((label) => label === "安装" || label === "查看 GitHub"), "CTA intent labels drifted");

if (failures.length) {
  throw new assert.AssertionError({
    message: `Landing V2 contract failed (${failures.length}):\n- ${failures.join("\n- ")}`,
  });
}

console.log("Landing V2 contract passed");
