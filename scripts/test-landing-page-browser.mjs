import assert from "node:assert/strict";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(process.argv[2] || join(tmpdir(), "dev-skills-landing-qa"));
mkdirSync(output, { recursive: true });
const require = createRequire(import.meta.url);
let playwright;
try {
  playwright = await import("playwright");
} catch {
  const modules = process.env.CODEX_NODE_MODULES || join(process.env.HOME, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
  playwright = require(join(modules, "playwright"));
}
let browser;
try {
  browser = await playwright.chromium.launch();
} catch (error) {
  const executablePath = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  if (!existsSync(executablePath)) throw error;
  browser = await playwright.chromium.launch({ executablePath });
}

const evidence = [];
const url = pathToFileURL(join(root, "index.html")).href;
const repo = "https://github.com/Jason-chen-coder/dev-skills.git";

async function checkLayout(page, label) {
  const layout = await page.evaluate(() => ({
    viewport: innerWidth,
    document: document.documentElement.scrollWidth,
    clipped: [...document.querySelectorAll("button, h1, h2, h3")]
      .filter((element) => element.getClientRects().length && element.scrollWidth > element.clientWidth + 2)
      .map((element) => element.textContent.trim()),
  }));
  assert.ok(layout.document <= layout.viewport + 1, `${label}: horizontal page overflow`);
  assert.deepEqual(layout.clipped, [], `${label}: clipped text`);
}

async function checkTabKeys(page, selector) {
  const tabs = page.locator(selector);
  await tabs.first().focus();
  await page.keyboard.press("End");
  assert.equal(await tabs.last().getAttribute("aria-selected"), "true");
  await page.keyboard.press("Home");
  assert.equal(await tabs.first().getAttribute("aria-selected"), "true");
  await page.keyboard.press("ArrowRight");
  assert.equal(await tabs.nth(1).getAttribute("aria-selected"), "true");
  await page.keyboard.press("ArrowLeft");
  assert.equal(await tabs.first().getAttribute("aria-selected"), "true");
}

try {
  for (const [width, height] of [[1440, 1000], [1920, 1080], [1024, 768], [901, 768], [768, 1024], [390, 844], [320, 700]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(() => {
      window.__copied = [];
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: async (text) => { window.__copied.push(text); } },
      });
    });
    await page.goto(url, { waitUntil: "load" });
    await checkLayout(page, `${width}px initial`);
    assert.ok((await page.locator("#why").boundingBox()).y < height, `${width}px: first viewport must reveal the next section`);
    const logo = page.locator(".hero-logo img");
    assert.ok(await logo.evaluate((image) => image.complete && image.naturalWidth >= 320), "hero logo must use a loaded full-resolution asset");
    const heroBox = await page.locator(".hero").boundingBox();
    const logoBox = await logo.boundingBox();
    if (width > 900) {
      assert.ok(logoBox.x >= heroBox.x + heroBox.width, `${width}px: logo must occupy the right side of the introduction`);
    }
    assert.ok((await page.locator("#why").boundingBox()).y >= Math.max(heroBox.y + heroBox.height, logoBox.y + logoBox.height), `${width}px: examples must follow the introduction and logo`);
    await page.screenshot({ path: join(output, `desktop-${width}.png`) });

    const scenarios = page.locator("[data-scenario]");
    const observedSkills = new Set();
    for (let index = 0; index < await scenarios.count(); index += 1) {
      const tab = scenarios.nth(index);
      await tab.click();
      assert.equal(await tab.getAttribute("aria-selected"), "true");
      const prompt = await page.locator("#scenario-prompt").innerText();
      const skill = prompt.match(/dev-grill-docs|dev-fix|dev-code-review|dev-image-to-code|swagger-doc-skill/)?.[0];
      assert.ok(skill, "scenario needs an executable skill prompt");
      observedSkills.add(skill);
      assert.ok((await page.locator("#scenario-output").innerText()).trim().length > 20, "scenario needs meaningful expected output");
      await page.locator("#copy-prompt").click();
      await page.waitForFunction((text) => window.__copied.includes(text), prompt);
      await checkLayout(page, `${width}px scenario ${index}`);
    }
    assert.equal(observedSkills.size, 5, "all five distinct workflows must be reachable");
    await checkTabKeys(page, "[data-scenario]");

    for (const mode of ["claude", "codex", "npx"]) {
      await page.locator(`[data-install-mode="${mode}"]`).click();
      for (const action of ["install", "upgrade"]) {
        await page.locator(`[data-install-action="${action}"]`).click();
        const command = await page.locator("#install-command").innerText();
        const expected = {
          claude: {
            install: "/plugin marketplace add https://github.com/Jason-chen-coder/dev-skills\n/plugin install dev-skills",
            upgrade: "/plugin update dev-skills",
          },
          codex: {
            install: `git clone ${repo}\ncd dev-skills\nbash scripts/install-codex-skills.sh`,
            upgrade: "bash scripts/install-codex-skills.sh --upgrade",
          },
          npx: { install: "npx skills add Jason-chen-coder/dev-skills", upgrade: "npx skills update" },
        }[mode][action];
        assert.equal(command.trim(), expected);
        await page.locator("#copy-install").click();
        await page.waitForFunction((text) => window.__copied.includes(text), command);
        await checkLayout(page, `${width}px ${mode} ${action}`);
      }
    }
    await page.locator('[data-install-action="install"]').click();
    await page.locator('[data-install-scope="global"]').click();
    assert.equal((await page.locator("#install-command").innerText()).trim(), "npx skills add Jason-chen-coder/dev-skills --global");
    await page.locator('[data-install-scope="project"]').click();
    assert.equal((await page.locator("#install-command").innerText()).trim(), "npx skills add Jason-chen-coder/dev-skills");
    await checkTabKeys(page, "[data-install-mode]");
    await checkTabKeys(page, "[data-install-action]");
    if (await page.locator("[data-workflow]").count()) {
      const flows = page.locator("[data-workflow]");
      for (let index = 0; index < await flows.count(); index += 1) {
        await flows.nth(index).click();
        assert.equal(await flows.nth(index).getAttribute("aria-selected"), "true");
        await checkLayout(page, `${width}px workflow ${index}`);
      }
      await checkTabKeys(page, "[data-workflow]");
    }

    if (await page.locator("#menu-toggle").isVisible()) {
      await page.locator("#menu-toggle").click();
      assert.equal(await page.locator("#menu-toggle").getAttribute("aria-expanded"), "true");
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("#menu-toggle").getAttribute("aria-expanded"), "false");
      await page.locator("#menu-toggle").click();
      await page.locator("#primary-navigation a").first().click();
      assert.equal(await page.locator("#menu-toggle").getAttribute("aria-expanded"), "false");
    }

    await page.locator("#articles").scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0));
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: join(output, `full-${width}.png`), fullPage: true });
    assert.deepEqual(errors, [], `${width}px: browser errors`);
    evidence.push({ viewport: { width, height }, scenarios: observedSkills.size, installCombinations: 6, runtimeErrors: errors });
    await page.close();
  }

  const clipboardPage = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await clipboardPage.goto(url);
  for (const [button, status, change] of [
    ["#copy-prompt", "#prompt-copy-status", "[data-scenario]"],
    ["#copy-install", "#copy-status", "[data-install-mode]"],
  ]) {
    await clipboardPage.evaluate(() => {
      window.__resolveCopy = null;
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: () => new Promise((resolveCopy) => { window.__resolveCopy = resolveCopy; }) },
      });
    });
    await clipboardPage.locator(button).click();
    await clipboardPage.waitForFunction(() => typeof window.__resolveCopy === "function");
    await clipboardPage.locator(change).nth(1).click();
    await clipboardPage.evaluate(async () => { window.__resolveCopy(); await Promise.resolve(); });
    assert.doesNotMatch(await clipboardPage.locator(status).innerText(), /已复制/, "stale clipboard completion must not label new content copied");
  }
  await clipboardPage.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => { throw new Error("Clipboard permission denied"); } },
    });
    document.execCommand = () => false;
  });
  await clipboardPage.locator("#copy-prompt").click();
  await clipboardPage.waitForFunction(() => /无法|失败|手动/.test(document.querySelector("#prompt-copy-status").textContent));
  await clipboardPage.evaluate(() => {
    document.execCommand = () => {
      window.__fallbackText = document.activeElement.value;
      return true;
    };
  });
  await clipboardPage.locator("#copy-install").click();
  await clipboardPage.waitForFunction(() => typeof window.__fallbackText === "string");
  assert.equal(await clipboardPage.evaluate(() => window.__fallbackText), await clipboardPage.locator("#install-command").innerText());
  await clipboardPage.close();
  evidence.push({ clipboard: "success, failure, fallback and stale completion checks passed using controlled browser APIs" });

  const noScript = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await noScript.goto(pathToFileURL(join(root, "site/index.html")).href);
  assert.ok((await noScript.locator("#scenario-prompt").innerText()).includes("dev-fix"));
  assert.ok((await noScript.locator("#install-command").innerText()).includes("/plugin install dev-skills"));
  await checkLayout(noScript, "JavaScript disabled");
  await noScript.close();
  evidence.push({ javascriptDisabled: "default scenario and install command remain readable" });
  writeFileSync(join(output, "report.json"), `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(`Browser checks passed. Screenshots and report: ${output}`);
} finally {
  await browser.close();
}
