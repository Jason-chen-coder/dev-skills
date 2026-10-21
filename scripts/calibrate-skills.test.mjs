import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepareCase, checkRun, listCases } from './calibrate-skills.mjs';

const script = fileURLToPath(new URL('./calibrate-skills.mjs', import.meta.url));

async function prepare(t, caseId, options) {
  const prepared = await prepareCase(caseId, options);
  // Test cleanup is limited to the exact newly allocated test run, never an
  // arbitrary path supplied to the CLI (which intentionally has no cleanup).
  t.after(() => fs.rm(prepared.runDir, { recursive: true, force: true }));
  return prepared;
}

async function temporary(t) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'calibration-test-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  return directory;
}

function git(workspace, ...args) {
  const environment = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')));
  const result = spawnSync('git', ['--no-optional-locks', '-c', `core.hooksPath=${os.devNull}`, ...args], {
    cwd: workspace, encoding: 'utf8',
    env: { ...environment, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: os.devNull },
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

function check(result, id) {
  const entry = result.artifactChecks.checks.find((item) => item.id === id);
  assert.ok(entry, `Missing check ${id}`);
  return entry;
}

async function fixCounter(workspace) {
  const target = path.join(workspace, 'src/counter.mjs');
  const content = await fs.readFile(target, 'utf8');
  await fs.writeFile(target, content.replace('item.done)', 'item.done === true)'));
}

async function implementTaskPreferences(workspace) {
  const preferences = path.join(workspace, 'src/preferences.mjs');
  await fs.writeFile(preferences, (await fs.readFile(preferences, 'utf8'))
    .replace('showCompleted: input.showCompleted !== false', 'showCompleted: input.showCompleted !== false, hideArchived: input.hideArchived === true'));
  const tasks = path.join(workspace, 'src/tasks.mjs');
  await fs.writeFile(tasks, (await fs.readFile(tasks, 'utf8'))
    .replace('preferences.showCompleted || task.done !== true', '(preferences.showCompleted || task.done !== true) && (!preferences.hideArchived || task.archived !== true)'));
}

test('list and CLI expose five cases without evaluator expectations', () => {
  assert.deepEqual(listCases().map((entry) => entry.caseNumber), [3, 4, 5, 17, 19]);
  const result = spawnSync(process.execPath, [script, 'list'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), listCases());
  assert.equal(listCases().some((entry) => 'review' in entry || 'target' in entry), false);
});

test('comparison modes keep the same task fixture and contract while explicitly recording omitted skill inputs', async (t) => {
  const bundled = await prepare(t, 'task-preferences');
  const without = await prepare(t, 'task-preferences', { withoutSkill: true });
  assert.equal(bundled.variant, 'with-skill');
  assert.equal(without.variant, 'without-skill');
  assert.equal(without.skill, null);
  assert.equal(without.skillSha256, null);
  await assert.rejects(fs.stat(path.join(without.workspace, '.agents')), { code: 'ENOENT' });
  const manifests = await Promise.all([bundled, without].map(async (prepared) =>
    JSON.parse(await fs.readFile(path.join(prepared.runDir, 'evaluator/manifest.json'), 'utf8'))));
  assert.equal(manifests[1].skill, null);
  assert.equal(manifests[1].relativeSkill, null);
  const projectEntries = (manifest) => Object.fromEntries(Object.entries(manifest.snapshot)
    .filter(([name]) => !name.startsWith('.git') && !name.startsWith('.agents')));
  assert.deepEqual(projectEntries(manifests[0]), projectEntries(manifests[1]));
  assert.equal(bundled.request, without.request);
  for (const prepared of [bundled, without]) {
    const result = await checkRun(prepared.runDir);
    assert.equal(result.variant, prepared.variant);
    assert.equal(result.baselineEvidence.tests.exitCode, 0);
    assert.equal(result.baselineEvidence.allTests.exitCode, 0);
    assert.equal(result.baselineEvidence.oracle.exitCode, 1);
    assert.equal(check(result, 'baseline-feature-absent').passed, true);
    assert.equal(check(result, 'final-original-tests').passed, true);
    assert.equal(check(result, 'final-independent-task-contract').passed, false);
    assert.equal(result.artifactChecks.passed, false);
    assert.equal(result.semanticReview.status, 'pending-independent-review');
  }
});

test('task behavior spans filtering, partial updates, saved preferences and legacy data while preserving unrelated work', async (t) => {
  for (const withoutSkill of [false, true]) {
    await t.test(withoutSkill ? 'without skill' : 'with skill', async (subtest) => {
      const prepared = await prepare(subtest, 'task-preferences', { withoutSkill });
      const stagedBefore = git(prepared.workspace, 'ls-files', '--stage', '-z');
      const cachedBefore = git(prepared.workspace, 'diff', '--cached', '--binary');
      const headBefore = git(prepared.workspace, 'rev-parse', 'HEAD');
      const files = ['notes/team.txt', 'scratch.txt', 'src/theme.mjs', 'src/controller.mjs', 'test/tasks.test.mjs'];
      const before = await Promise.all(files.map((name) => fs.readFile(path.join(prepared.workspace, name))));
      await implementTaskPreferences(prepared.workspace);
      await fs.writeFile(path.join(prepared.workspace, 'test/archive.test.mjs'), `import test from 'node:test';
import assert from 'node:assert/strict';
import { createTaskView } from '../src/controller.mjs';
test('archive preference round-trips through the view', () => {
  const tasks = [{ id: 1, archived: true }, { id: 2, archived: 'true' }];
  const view = createTaskView(tasks);
  view.updatePreferences({ hideArchived: true });
  assert.deepEqual(createTaskView(tasks, view.savePreferences()).getVisibleTasks(), [tasks[1]]);
});
`);
      const result = await checkRun(prepared.runDir);
      assert.equal(result.artifactChecks.passed, true, JSON.stringify(result.artifactChecks));
      assert.equal(result.finalEvidence.tests.exitCode, 0);
      assert.equal(result.finalEvidence.allTests.exitCode, 0);
      assert.equal(result.finalEvidence.oracle.exitCode, 0);
      assert.equal(check(result, 'final-independent-task-contract').passed, true);
      assert.equal(git(prepared.workspace, 'ls-files', '--stage', '-z'), stagedBefore);
      assert.equal(git(prepared.workspace, 'diff', '--cached', '--binary'), cachedBefore);
      assert.equal(git(prepared.workspace, 'rev-parse', 'HEAD'), headBefore);
      assert.deepEqual(await Promise.all(files.map((name) => fs.readFile(path.join(prepared.workspace, name)))), before);
    });
  }
});

test('task checks accept regressions added to the existing test file and still run immutable original tests', async (t) => {
  const prepared = await prepare(t, 'task-preferences', { withoutSkill: true });
  await implementTaskPreferences(prepared.workspace);
  await fs.appendFile(path.join(prepared.workspace, 'test/tasks.test.mjs'), `
test('archive updates retain the completed-task preference', () => {
  const view = createTaskView([{ done: false, archived: true }, { done: false }], '{"showCompleted":false}');
  view.updatePreferences({ hideArchived: true });
  assert.equal(view.getPreferences().showCompleted, false);
  assert.deepEqual(view.getVisibleTasks(), [{ done: false }]);
});
`);
  const result = await checkRun(prepared.runDir);
  assert.equal(result.artifactChecks.passed, true, JSON.stringify(result.artifactChecks));
  assert.equal(result.finalEvidence.tests.exitCode, 0);
  assert.match(result.finalEvidence.tests.stdout, /# tests 4/);
  assert.equal(result.finalEvidence.allTests.exitCode, 0);
  assert.match(result.finalEvidence.allTests.stdout, /# tests 5/);
  assert.equal(check(result, 'preserve-protected-files').passed, true);
});

test('replacing project tests cannot conceal broken existing behavior from immutable regression tests', async (t) => {
  const prepared = await prepare(t, 'task-preferences', { withoutSkill: true });
  await implementTaskPreferences(prepared.workspace);
  await fs.writeFile(path.join(prepared.workspace, 'src/tasks.mjs'), `export function visibleTasks(tasks, preferences) {
  return tasks.filter(task => !preferences.hideArchived || task.archived !== true);
}
`);
  await fs.writeFile(path.join(prepared.workspace, 'test/tasks.test.mjs'), "console.log('Project tests were weakened');\n");
  const result = await checkRun(prepared.runDir);
  assert.equal(result.finalEvidence.allTests.exitCode, 0);
  assert.equal(result.finalEvidence.tests.exitCode, 1);
  assert.equal(result.finalEvidence.oracle.exitCode, 1);
  assert.equal(check(result, 'final-original-tests').passed, false);
  assert.equal(check(result, 'final-independent-task-contract').passed, false);
  assert.equal(check(result, 'preserve-protected-files').passed, true);
  assert.equal(result.artifactChecks.passed, false);
});

test('task checks reject additions outside the permitted test scope', async (t) => {
  const mutations = [
    ['extra document', 'PLAN.md', 'Unrequested artifact\n'],
    ['test helper', 'test/helper.mjs', 'export const helper = true;\n'],
    ['nested test', 'test/nested/archive.test.mjs', "console.log('Nested file');\n"],
  ];
  for (const [name, relative, content] of mutations) {
    await t.test(name, async (subtest) => {
      const prepared = await prepare(subtest, 'task-preferences', { withoutSkill: true });
      await implementTaskPreferences(prepared.workspace);
      await fs.mkdir(path.dirname(path.join(prepared.workspace, relative)), { recursive: true });
      await fs.writeFile(path.join(prepared.workspace, relative), content);
      const result = await checkRun(prepared.runDir);
      assert.equal(result.finalEvidence.oracle.exitCode, 0);
      assert.equal(result.artifactChecks.passed, false);
      assert.equal(check(result, 'preserve-protected-files').passed, false);
    });
  }
});

test('task checks run newly added tests and reject an early exit before the independent assertions', async (t) => {
  await t.test('failing added test', async (subtest) => {
    const prepared = await prepare(subtest, 'task-preferences');
    await implementTaskPreferences(prepared.workspace);
    await fs.writeFile(path.join(prepared.workspace, 'test/new.test.mjs'), "throw new Error('Candidate test fails');\n");
    const result = await checkRun(prepared.runDir);
    assert.equal(result.finalEvidence.oracle.exitCode, 0);
    assert.equal(check(result, 'final-original-tests').passed, true);
    assert.equal(check(result, 'final-project-tests').passed, false);
    assert.equal(result.artifactChecks.passed, false);
  });
  await t.test('early exit', async (subtest) => {
    const prepared = await prepare(subtest, 'task-preferences');
    await implementTaskPreferences(prepared.workspace);
    await fs.appendFile(path.join(prepared.workspace, 'src/preferences.mjs'), 'process.exit(0);\n');
    const result = await checkRun(prepared.runDir);
    assert.equal(result.finalEvidence.oracle.exitCode, 0);
    assert.equal(check(result, 'final-independent-task-contract').passed, false);
    assert.equal(result.artifactChecks.passed, false);
  });
});

test('comparison CLI accepts a boolean flag, rejects conflicting or check-only use and keeps old manifests readable', async (t) => {
  const result = spawnSync(process.execPath, [script, 'prepare', 'readme-typo', '--without-skill', '--runtime', 'offline'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const prepared = JSON.parse(result.stdout);
  t.after(() => fs.rm(prepared.runDir, { recursive: true, force: true }));
  assert.equal(prepared.variant, 'without-skill');
  assert.equal(prepared.skill, null);
  for (const args of [
    ['prepare', 'readme-typo', '--without-skill', '--skills-root', '/missing'],
    ['prepare', 'readme-typo', '--skills-root', '/missing', '--without-skill'],
    ['prepare', 'readme-typo', '--without-skill', '--without-skill'],
    ['check', prepared.runDir, '--without-skill'],
  ]) {
    const invalid = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
    assert.equal(invalid.status, 1);
    assert.match(invalid.stderr, /without-skill/);
  }
  await assert.rejects(prepareCase('task-preferences', { withoutSkill: true, skillsRoot: '/missing' }), /cannot be combined/);
  const original = await prepare(t, 'readonly-counter');
  const manifestPath = path.join(original.runDir, 'evaluator/manifest.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  delete manifest.variant;
  await fs.writeFile(manifestPath, JSON.stringify(manifest));
  const checked = await checkRun(original.runDir);
  assert.equal(checked.artifactChecks.passed, true);
  assert.equal(checked.variant, 'with-skill');
});

test('readonly preparation reproduces the defect and check leaves artifacts untouched', async (t) => {
  const prepared = await prepare(t, 'readonly-counter', { runtime: 'test-runtime', model: 'test-model' });
  assert.equal(path.dirname(prepared.workspace), prepared.runDir);
  assert.ok(prepared.skill.endsWith('/.agents/skills/dev-fix/SKILL.md'));
  assert.ok((await fs.readFile(prepared.skill, 'utf8')).includes('Dev Fix'));
  assert.ok((await fs.readFile(path.join(path.dirname(prepared.skill), 'references/dev-baseline.md'), 'utf8')).includes('Dev Baseline'));
  assert.equal(git(prepared.workspace, 'symbolic-ref', 'HEAD').trim(), 'refs/heads/work/main');
  assert.equal(git(prepared.workspace, 'log', '-1', '--format=%s').trim(), 'Add initial project');
  const indexBefore = await fs.readFile(path.join(prepared.workspace, '.git/index'));
  const result = await checkRun(prepared.runDir);
  assert.equal(result.artifactChecks.passed, true);
  assert.equal(result.baselineEvidence.tests.exitCode, 1);
  assert.equal(result.baselineEvidence.oracle.exitCode, 1);
  assert.equal(result.finalEvidence.tests.exitCode, 1);
  assert.equal(result.runtime, 'test-runtime');
  assert.equal(result.model, 'test-model');
  assert.equal(result.fixtureRevision, prepared.fixtureRevision);
  assert.equal(result.skill.sha256, prepared.skillSha256);
  assert.equal(result.semanticReview.status, 'pending-independent-review');
  assert.equal(result.overallAgentBehavior, 'not-assessed');
  assert.deepEqual(await fs.readFile(path.join(prepared.workspace, '.git/index')), indexBefore);
  assert.equal(JSON.parse(await fs.readFile(path.join(prepared.runDir, 'evaluator/result.json'), 'utf8')).artifactChecks.passed, true);
  assert.equal((await checkRun(prepared.runDir)).artifactChecks.passed, true);
});

test('fix proves red to green and preserves partial staging, unrelated edits and untracked data', async (t) => {
  const prepared = await prepare(t, 'fix-counter');
  const stagedBefore = git(prepared.workspace, 'ls-files', '--stage', '-z');
  const cachedBefore = git(prepared.workspace, 'diff', '--cached', '--binary');
  const partialBefore = await fs.readFile(path.join(prepared.workspace, 'notes/team.txt'));
  const untrackedBefore = await fs.readFile(path.join(prepared.workspace, 'scratch.txt'));
  assert.equal(git(prepared.workspace, 'show', ':notes/team.txt'), 'Team notes\nStaged: prepare workshop\n');
  assert.equal(partialBefore.toString(), 'Team notes\nStaged: prepare workshop\nUnstaged: bring adapter\n');
  await fixCounter(prepared.workspace);
  const result = await checkRun(prepared.runDir);
  assert.equal(result.artifactChecks.passed, true);
  assert.equal(result.baselineEvidence.tests.exitCode, 1);
  assert.equal(result.baselineEvidence.oracle.exitCode, 1);
  assert.equal(result.finalEvidence.tests.exitCode, 0);
  assert.equal(result.finalEvidence.oracle.exitCode, 0);
  assert.equal(git(prepared.workspace, 'ls-files', '--stage', '-z'), stagedBefore);
  assert.equal(git(prepared.workspace, 'diff', '--cached', '--binary'), cachedBefore);
  assert.deepEqual(await fs.readFile(path.join(prepared.workspace, 'notes/team.txt')), partialBefore);
  assert.deepEqual(await fs.readFile(path.join(prepared.workspace, 'scratch.txt')), untrackedBefore);
});

test('typo allows exactly the requested bytes and runs no artificial behavior test', async (t) => {
  const prepared = await prepare(t, 'readme-typo');
  const target = path.join(prepared.workspace, 'README.md');
  await fs.writeFile(target, (await fs.readFile(target, 'utf8')).replace('Welcom', 'Welcome'));
  const result = await checkRun(prepared.runDir);
  assert.equal(result.artifactChecks.passed, true);
  assert.deepEqual(result.finalEvidence, {});
  await fs.appendFile(target, '\n');
  const extraWhitespace = await checkRun(prepared.runDir);
  assert.equal(extraWhitespace.artifactChecks.passed, false);
  assert.equal(check(extraWhitespace, 'exact-requested-readme-edit').passed, false);
});

test('device case uses real existing commands while retaining an unverified hardware gate', async (t) => {
  const prepared = await prepare(t, 'unavailable-device');
  const readme = await fs.readFile(path.join(prepared.workspace, 'README.md'), 'utf8');
  const guide = await fs.readFile(path.join(prepared.workspace, 'docs/verification.md'), 'utf8');
  assert.ok(readme.includes('docs/verification.md'));
  assert.ok(guide.includes('node --test test/volume.test.mjs'));
  assert.ok(guide.includes('node scripts/check-device.mjs'));
  const result = await checkRun(prepared.runDir);
  assert.equal(result.artifactChecks.passed, true);
  assert.equal(result.finalEvidence.tests.exitCode, 0);
  assert.equal(result.finalEvidence.deviceGate.exitCode, 2);
  assert.equal(JSON.parse(result.finalEvidence.deviceGate.stdout).status, 'unavailable');
  assert.equal(result.overallAgentBehavior, 'not-assessed');
  assert.equal(result.semanticReview.status, 'pending-independent-review');
});

test('readonly checks reject source, extra untracked, deleted, mode and skill changes', async (t) => {
  const mutations = [
    ['source', (workspace) => fs.appendFile(path.join(workspace, 'src/counter.mjs'), '// edited\n')],
    ['untracked', (workspace) => fs.writeFile(path.join(workspace, 'analysis.md'), 'Unrequested artifact\n')],
    ['deleted', (workspace) => fs.unlink(path.join(workspace, 'notes/team.txt'))],
    ['mode', (workspace) => fs.chmod(path.join(workspace, 'notes/team.txt'), 0o700)],
    ['skill', (workspace) => fs.appendFile(path.join(workspace, '.agents/skills/dev-fix/SKILL.md'), '\nChanged input\n')],
  ];
  for (const [name, mutate] of mutations) {
    await t.test(name, async (subtest) => {
      const prepared = await prepare(subtest, 'readonly-counter');
      await mutate(prepared.workspace);
      const result = await checkRun(prepared.runDir);
      assert.equal(result.artifactChecks.passed, false);
      assert.equal(check(result, 'preserve-protected-files').passed, false);
      if (name === 'skill') assert.equal(check(result, 'preserve-skill-inputs').passed, false);
    });
  }
});

test('fix rejects index content and index flag changes even with correct final behavior', async (t) => {
  await t.test('restaging a partially staged unrelated file', async (subtest) => {
    const prepared = await prepare(subtest, 'fix-counter');
    await fixCounter(prepared.workspace);
    git(prepared.workspace, 'add', '--', 'notes/team.txt');
    const result = await checkRun(prepared.runDir);
    assert.equal(result.finalEvidence.tests.exitCode, 0);
    assert.equal(result.artifactChecks.passed, false);
    assert.ok(result.artifactChecks.checks.some((entry) => entry.id.startsWith('preserve-') && !entry.passed));
  });
  await t.test('assuming unchanged changes index flags without new Git objects', async (subtest) => {
    const prepared = await prepare(subtest, 'fix-counter');
    await fixCounter(prepared.workspace);
    git(prepared.workspace, 'update-index', '--assume-unchanged', 'src/theme.mjs');
    const result = await checkRun(prepared.runDir);
    assert.equal(result.artifactChecks.passed, false);
    assert.equal(check(result, 'preserve-indexFlags').passed, false);
  });
});

test('editing the public tests cannot manufacture a passing fix', async (t) => {
  const prepared = await prepare(t, 'fix-counter');
  await fs.writeFile(path.join(prepared.workspace, 'test/counter.test.mjs'), "console.log('All tests pass');\n");
  const result = await checkRun(prepared.runDir);
  assert.equal(result.finalEvidence.tests.exitCode, 0);
  assert.equal(result.finalEvidence.oracle.exitCode, 1);
  assert.equal(result.artifactChecks.passed, false);
  assert.equal(check(result, 'preserve-protected-files').passed, false);
  assert.equal(check(result, 'final-independent-counter-contract').passed, false);
});

test('a hardcoded implementation that passes public examples fails independent behavior checks', async (t) => {
  const prepared = await prepare(t, 'fix-counter');
  await fs.writeFile(path.join(prepared.workspace, 'src/counter.mjs'), `export function countCompleted(items) {
  return items.length === 0 || items[0].done === false ? 0 : 1;
}
`);
  const result = await checkRun(prepared.runDir);
  assert.equal(result.finalEvidence.tests.exitCode, 0);
  assert.equal(result.finalEvidence.oracle.exitCode, 1);
  assert.equal(result.artifactChecks.passed, false);
});

test('exiting before assertions cannot forge independent contract evidence', async (t) => {
  const prepared = await prepare(t, 'fix-counter');
  await fs.writeFile(path.join(prepared.workspace, 'src/counter.mjs'), `export const countCompleted = () => 0;
process.exit(0);
`);
  const result = await checkRun(prepared.runDir);
  assert.equal(result.finalEvidence.oracle.exitCode, 0);
  assert.equal(result.artifactChecks.passed, false);
  assert.equal(check(result, 'final-independent-counter-contract').passed, false);
});

test('checker does not follow a replaced source link to execute outside the workspace', async (t) => {
  const outside = await temporary(t);
  const marker = path.join(outside, 'executed');
  const externalModule = path.join(outside, 'external.mjs');
  await fs.writeFile(externalModule, `import { writeFileSync } from 'node:fs';
writeFileSync(${JSON.stringify(marker)}, 'should never execute');
export const countCompleted = () => 0;
`);
  const prepared = await prepare(t, 'readonly-counter');
  const target = path.join(prepared.workspace, 'src/counter.mjs');
  await fs.unlink(target);
  await fs.symlink(externalModule, target);
  const result = await checkRun(prepared.runDir);
  assert.equal(result.artifactChecks.passed, false);
  assert.equal(result.finalEvidence.tests.exitCode, null);
  assert.equal(check(result, 'no-workspace-links-or-special-files').passed, false);
  await assert.rejects(fs.stat(marker), { code: 'ENOENT' });
});

test('CLI ignores inherited Git redirection/global configuration and records supplied metadata', async (t) => {
  const outside = await temporary(t);
  const index = path.join(outside, 'user-index');
  const globalConfig = path.join(outside, 'global.gitconfig');
  await fs.writeFile(index, 'User index sentinel\n');
  await fs.writeFile(globalConfig, '[commit]\n\tgpgSign = true\n[core]\n\thooksPath = /missing/user/hooks\n');
  const result = spawnSync(process.execPath, [script, 'prepare', 'readme-typo', '--runtime', 'offline-test', '--model', 'not-a-live-model'], {
    encoding: 'utf8', env: {
      ...process.env, GIT_DIR: path.join(outside, 'user.git'), GIT_WORK_TREE: outside,
      GIT_INDEX_FILE: index, GIT_CONFIG_GLOBAL: globalConfig,
      GIT_CONFIG_COUNT: '1', GIT_CONFIG_KEY_0: 'core.worktree', GIT_CONFIG_VALUE_0: outside,
    },
  });
  assert.equal(result.status, 0, result.stderr);
  const prepared = JSON.parse(result.stdout);
  t.after(() => fs.rm(prepared.runDir, { recursive: true, force: true }));
  assert.equal(await fs.readFile(index, 'utf8'), 'User index sentinel\n');
  assert.equal(await fs.readFile(globalConfig, 'utf8'), '[commit]\n\tgpgSign = true\n[core]\n\thooksPath = /missing/user/hooks\n');
  const target = path.join(prepared.workspace, 'README.md');
  await fs.writeFile(target, (await fs.readFile(target, 'utf8')).replace('Welcom', 'Welcome'));
  const cliCheck = spawnSync(process.execPath, [script, 'check', prepared.runDir], { encoding: 'utf8' });
  assert.equal(cliCheck.status, 0, cliCheck.stderr);
  const checked = JSON.parse(cliCheck.stdout);
  assert.equal(checked.runtime, 'offline-test');
  assert.equal(checked.model, 'not-a-live-model');
  assert.equal(checked.artifactChecks.passed, true);
});

test('standalone skill roots are copied fully and fingerprinted from actual supplied inputs', async (t) => {
  const root = await temporary(t);
  await fs.mkdir(path.join(root, 'dev-tdd/references'), { recursive: true });
  await fs.writeFile(path.join(root, 'dev-tdd/SKILL.md'), '# Standalone candidate skill\n');
  await fs.writeFile(path.join(root, 'dev-tdd/references/example.md'), 'Required bundled reference\n');
  const prepared = await prepare(t, 'readme-typo', { skillsRoot: root });
  assert.equal(await fs.readFile(path.join(path.dirname(prepared.skill), 'references/example.md'), 'utf8'), 'Required bundled reference\n');
  await fs.writeFile(path.join(root, 'dev-tdd/SKILL.md'), '# Different later revision\n');
  assert.equal(await fs.readFile(prepared.skill, 'utf8'), '# Standalone candidate skill\n');
  const second = await prepare(t, 'readme-typo', { skillsRoot: root });
  assert.notEqual(prepared.skillSha256, second.skillSha256);
});

test('check rejects arbitrary directories and result symlinks without writing outside the run', async (t) => {
  const outside = await temporary(t);
  await assert.rejects(checkRun(outside), /only a run directory/);
  const sentinel = path.join(outside, 'sentinel.json');
  await fs.writeFile(sentinel, 'Preserve this user file\n');
  const prepared = await prepare(t, 'readonly-counter');
  await fs.symlink(sentinel, path.join(prepared.runDir, 'evaluator/result.json'));
  await assert.rejects(checkRun(prepared.runDir), /Invalid result path/);
  assert.equal(await fs.readFile(sentinel, 'utf8'), 'Preserve this user file\n');
});
