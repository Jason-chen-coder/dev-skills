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
  check(new RegExp(`id=["']${id}["']`).test(html), `missing public section anchor #${id}`);
}

check(/<html[^>]+lang="zh-CN"/.test(html), "page language must match its Chinese content");
check((html.match(/<h1\b/g) || []).length === 1, "expected one primary product heading");
check(/<h1\b[^>]*>\s*dev-skills\s*<\/h1>/.test(html), "product name must remain the primary heading");

const skillNames = [...html.matchAll(/data-skill="([^"]+)"/g)].map((match) => match[1]);
check(skillNames.length === expectedSkills.length, "directory must contain exactly 13 skill entries");
for (const skill of expectedSkills) {
  check(skillNames.filter((name) => name === skill).length === 1, `missing or duplicate skill: ${skill}`);
}

for (const [asset, url, date, title] of expectedArticles) {
  check(html.includes(`/${asset}"`), `missing article image: ${asset}`);
  check(html.includes(`href="${url}"`), `missing article URL: ${url}`);
  check(html.includes(`datetime="${date}"`), `missing article date: ${date}`);
  check(html.includes(title), `missing article title: ${title}`);
}
check(html.includes("category_13177255"), "article collection link is missing");

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
check(ids.length === new Set(ids).size, "duplicate document IDs");
for (const match of html.matchAll(/(?:href|aria-controls|aria-labelledby)="([^"]+)"/g)) {
  if (match[0].startsWith('href=') && !match[1].startsWith("#")) continue;
  for (const target of match[1].replace(/^#/, "").split(/\s+/)) {
    check(ids.includes(target), `unresolved document reference: ${target}`);
  }
}

for (const entry of [html, siteHtml]) {
  const base = entry === html ? root : join(root, "site");
  for (const match of entry.matchAll(/(?:src|srcset)="(\.\/[^"]+)"/g)) {
    check(existsSync(join(base, match[1])), `missing asset: ${match[1]}`);
  }
}
check(siteHtml.replaceAll("./assets/landing/", "./site/assets/landing/") === html,
  "root and site landing pages have drifted");

for (const id of ["scenario-prompt", "scenario-output", "copy-prompt", "install-command", "copy-install", "menu-toggle", "primary-navigation"]) {
  check(ids.includes(id), `missing interactive surface #${id}`);
}
check((html.match(/data-scenario="/g) || []).length === 5, "expected five task choices");
for (const mode of ["claude", "codex", "npx"]) {
  check(html.includes(`data-install-mode="${mode}"`), `missing install client: ${mode}`);
}
for (const action of ["install", "upgrade"]) {
  check(html.includes(`data-install-action="${action}"`), `missing install action: ${action}`);
}
for (const command of [
  "/plugin marketplace add https://github.com/Jason-chen-coder/dev-skills",
  "/plugin install dev-skills",
  "/plugin update dev-skills",
  "git clone https://github.com/Jason-chen-coder/dev-skills.git",
  "bash scripts/install-codex-skills.sh",
  "--upgrade",
  "npx skills add Jason-chen-coder/dev-skills",
  "npx skills update",
]) {
  check(html.includes(command), `missing supported command: ${command}`);
}
check(html.includes('aria-live="polite"'), "copy feedback needs accessible live status");
check(html.includes('role="tablist"') && html.includes('role="tabpanel"'), "missing tab semantics");
check(!/<script[^>]+src=/.test(html), "page must remain usable without external scripts");
check(!/setInterval\s*\(/.test(html), "examples must not auto-cycle");
check(!/[\u2013\u2014]/u.test(html), "avoid em/en dash in page copy");
check(!/gradient/i.test(html), "page must not introduce gradient decoration");

const { Script } = await import("node:vm");
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)];
check(scripts.length > 0, "missing page interactions");
for (const [index, match] of scripts.entries()) {
  try {
    new Script(match[1], { filename: `landing-inline-${index}.js` });
  } catch (error) {
    failures.push(error.message);
  }
}

if (failures.length) {
  throw new assert.AssertionError({
    message: `Landing page contract failed (${failures.length}):\n- ${failures.join("\n- ")}`,
  });
}
console.log("Landing page contract passed: inventory, links, assets, installation and script syntax");
