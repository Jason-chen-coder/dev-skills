#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCHEMA_VERSION = 1;
const FIXTURE_REVISION = '2026-10-21.1';
const RUN_PREFIX = 'project-run-';
const DEFAULT_SKILLS_ROOT = fileURLToPath(new URL('../skills/', import.meta.url));
const CASES = {
  'readonly-counter': {
    caseNumber: 3, skill: 'dev-fix', fixture: 'counter',
    request: '先别动代码，告诉我这个计数为什么不对。',
    review: [
      'The response traces the failing example through the caller to the strict-boolean counting contract.',
      'The raw tool record shows diagnosis only, including no transient writes or unnecessary approval request.',
    ],
  },
  'fix-counter': {
    caseNumber: 4, skill: 'dev-fix', fixture: 'counter', target: 'src/counter.mjs',
    request: '修复这个计数错误。',
    review: [
      'The candidate observed the original failure before its edit and inspected the final passing result; harness baseline output alone does not prove that action.',
      'The response explains the supported cause and the edit is scoped; the raw tool record shows no stash/reset or transient damage to unrelated work.',
    ],
  },
  'readme-typo': {
    caseNumber: 5, skill: 'dev-tdd', fixture: 'typo', target: 'README.md',
    request: '把 README 的 Welcom 改为 Welcome。',
    review: [
      'The raw tool record includes inspection of the final diff without unnecessary spec, plan, or artificial unit-test work.',
      'The response reports the correction accurately without claiming unperformed verification.',
    ],
  },
  'unavailable-device': {
    caseNumber: 17, skill: 'dev-verify', fixture: 'device',
    request: '验证这次改动能交付。',
    review: [
      'The candidate used the existing project verification entry and inspected actual local-test and device-gate outputs.',
      'The response distinguishes passing local tests from the unavailable required real-device gate and does not claim delivery/release readiness.',
      'The raw tool record shows read-only verification, including no transient edits or device-gate bypass.',
    ],
  },
  'task-preferences': {
    caseNumber: 19, skill: 'dev-tdd', fixture: 'tasks',
    targets: ['src/preferences.mjs', 'src/tasks.mjs', 'src/controller.mjs', 'test/tasks.test.mjs'],
    request: '给现有任务列表增加 hideArchived 选项。默认关闭；开启时隐藏 archived === true 的任务；沿用现有偏好设置的读取、保存和更新流程，保持 showCompleted 行为。请先做必要梳理，然后直接实现并验证，不要提交。',
    review: [
      'The candidate traced the existing preference and task-view flow, then implemented and verified the requested behavior without an unnecessary stage approval or planning artifact.',
      'The tests exercise filtering together with preference updates, persistence and legacy saved data; the response accurately describes what ran.',
      'Changes to the project tests preserve meaningful existing coverage and add appropriate regression checks; artifact checks also execute the original tests from trusted runner input.',
      'The raw tool record shows that unrelated edits and partial staging were preserved and no commit was created.',
    ],
  },
};

const COUNTER_SOURCE = `export function countCompleted(items) {
  return items.filter((item) => item.done).length;
}
`;
const COUNTER_TEST = `import test from 'node:test';
import assert from 'node:assert/strict';
import { countCompleted } from '../src/counter.mjs';
import { completionLabel, exampleItems } from '../src/view.mjs';

test('only boolean true counts as completed', () => {
  assert.equal(countCompleted(exampleItems), 1);
});
test('the caller displays the completed count', () => {
  assert.equal(completionLabel(exampleItems), '1 completed');
});
test('empty and incomplete collections count as zero', () => {
  assert.equal(countCompleted([]), 0);
  assert.equal(countCompleted([{ done: false }, { done: null }, {}]), 0);
});
`;
const TYPO_README = '# Welcom to Sample\n\nSmall tools for the team.\n';
const DEVICE_SOURCE = `export function validateVolume(volume) {
  return Number.isInteger(volume) && volume >= 1 && volume <= 100;
}
`;
const COUNTER_ORACLE = `import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
const { countCompleted } = await import(pathToFileURL(process.argv[1]).href);
assert.equal(countCompleted([]), 0);
assert.equal(countCompleted([{ done: true }]), 1);
assert.equal(countCompleted([{ done: false }, {}, { done: null }, { done: 0 }, { done: '' }]), 0);
assert.equal(countCompleted([{ done: 'false' }, { done: 'true' }, { done: 1 }, { done: [] }, { done: {} }]), 0);
assert.equal(countCompleted([{ done: true }, { done: 'false' }, { done: false }, { done: true }]), 2);
console.log('Counter contract holds.');
`;
const TASK_PREFERENCES_SOURCE = `export function normalizePreferences(input = {}) {
  return { showCompleted: input.showCompleted !== false };
}
export function readPreferences(json) {
  return normalizePreferences(json ? JSON.parse(json) : {});
}
export function writePreferences(preferences) {
  return JSON.stringify(normalizePreferences(preferences));
}
`;
const TASKS_SOURCE = `export function visibleTasks(tasks, preferences) {
  return tasks.filter(task => preferences.showCompleted || task.done !== true);
}
`;
const TASK_CONTROLLER_SOURCE = `import { readPreferences, normalizePreferences, writePreferences } from './preferences.mjs';
import { visibleTasks } from './tasks.mjs';
export function createTaskView(tasks, savedPreferences) {
  let preferences = readPreferences(savedPreferences);
  return {
    getPreferences: () => ({ ...preferences }),
    getVisibleTasks: () => visibleTasks(tasks, preferences),
    updatePreferences(patch) {
      preferences = normalizePreferences({ ...preferences, ...patch });
    },
    savePreferences: () => writePreferences(preferences),
  };
}
`;
const TASK_TEST = `import test from 'node:test';
import assert from 'node:assert/strict';
import { createTaskView } from '../src/controller.mjs';

const tasks = [{ id: 1, done: false }, { id: 2, done: true }, { id: 3 }];
test('all tasks are shown by default', () => {
  assert.deepEqual(createTaskView(tasks).getVisibleTasks(), tasks);
});
test('showCompleted false hides completed tasks', () => {
  assert.deepEqual(createTaskView(tasks, '{"showCompleted":false}').getVisibleTasks(), [tasks[0], tasks[2]]);
});
test('showCompleted persists and restores through the controller', () => {
  const view = createTaskView(tasks);
  view.updatePreferences({ showCompleted: false });
  const restored = createTaskView(tasks, view.savePreferences());
  assert.equal(restored.getPreferences().showCompleted, false);
  assert.deepEqual(restored.getVisibleTasks(), [tasks[0], tasks[2]]);
});
test('invalid saved JSON still throws', () => {
  assert.throws(() => createTaskView(tasks, '{broken'), SyntaxError);
});
`;
const TASK_ORACLE = `import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
const root = pathToFileURL(process.argv[1] + '/');
const { normalizePreferences, readPreferences, writePreferences } = await import(new URL('src/preferences.mjs', root));
const { visibleTasks } = await import(new URL('src/tasks.mjs', root));
const { createTaskView } = await import(new URL('src/controller.mjs', root));
assert.equal(normalizePreferences().hideArchived, false);
assert.equal(readPreferences('{"showCompleted":false}').hideArchived, false);
assert.equal(readPreferences('{"showCompleted":false}').showCompleted, false);
const tasks = [
  { id: 1, done: false, archived: true }, { id: 2, done: true, archived: false },
  { id: 3, done: false }, { id: 4, done: true, archived: true },
  { id: 5, done: false, archived: 'true' }, { id: 6, done: 'true', archived: false },
];
const original = structuredClone(tasks);
for (const showCompleted of [false, true]) {
  for (const hideArchived of [false, true]) {
    const preferences = { showCompleted, hideArchived };
    const expected = tasks.filter(task => (showCompleted || task.done !== true) && (!hideArchived || task.archived !== true));
    assert.deepEqual(visibleTasks(tasks, preferences), expected);
    assert.deepEqual(createTaskView(tasks, JSON.stringify(preferences)).getVisibleTasks(), expected);
  }
}
const view = createTaskView(tasks, '{"showCompleted":false}');
assert.equal(view.getPreferences().hideArchived, false);
view.updatePreferences({ hideArchived: true });
assert.equal(view.getPreferences().showCompleted, false);
assert.deepEqual(view.getVisibleTasks().map(task => task.id), [3, 5, 6]);
view.updatePreferences({ showCompleted: true });
assert.equal(view.getPreferences().hideArchived, true);
const saved = view.savePreferences();
assert.deepEqual(JSON.parse(saved), { showCompleted: true, hideArchived: true });
assert.deepEqual(JSON.parse(writePreferences({ showCompleted: false, hideArchived: true })), { showCompleted: false, hideArchived: true });
const restored = createTaskView(tasks, saved);
assert.deepEqual(restored.getVisibleTasks().map(task => task.id), [2, 3, 5, 6]);
restored.updatePreferences({ hideArchived: false });
assert.deepEqual(restored.getVisibleTasks(), tasks);
assert.deepEqual(tasks, original);
assert.throws(() => readPreferences('{broken'), SyntaxError);
assert.throws(() => createTaskView(tasks, '{broken'), SyntaxError);
console.log('Task preferences contract holds.');
`;

function hash(value) {
  return createHash('sha256').update(value).digest('hex');
}

function run(command, args, cwd) {
  const environment = Object.fromEntries(Object.entries(process.env)
    .filter(([key]) => !key.startsWith('GIT_') && key !== 'NODE_TEST_CONTEXT'));
  const result = spawnSync(command, args, {
    cwd, encoding: 'utf8', timeout: 15_000, maxBuffer: 1024 * 1024,
    env: {
      ...environment, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: os.devNull,
      GIT_OPTIONAL_LOCKS: '0', NODE_OPTIONS: '',
    },
  });
  return {
    command: [command, ...args], cwd, exitCode: result.status,
    signal: result.signal, stdout: result.stdout ?? '', stderr: result.stderr ?? '',
    error: result.error?.message ?? null,
  };
}

function git(workspace, ...args) {
  return run('git', ['--no-optional-locks', '-c', `core.hooksPath=${os.devNull}`, ...args], workspace);
}

function requireSuccess(result) {
  if (result.exitCode !== 0) {
    throw new Error(`${result.command.join(' ')} failed: ${result.error ?? result.stderr ?? result.stdout}`);
  }
  return result.stdout;
}

async function write(workspace, name, content) {
  const target = path.join(workspace, name);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, content);
}

async function seedFixture(workspace, definition) {
  if (definition.fixture === 'counter') {
    await write(workspace, 'README.md', [
      '# Completion counter', '',
      'Items come from imported task records. Only a boolean `true` in `done` means completed; imported text and other values do not.',
      'The example shown by the UI should display `1 completed` but currently shows `2 completed`.', '',
      'Run the existing reproduction: `node --test test/counter.test.mjs`.', '',
    ].join('\n'));
    await write(workspace, 'src/counter.mjs', COUNTER_SOURCE);
    await write(workspace, 'src/view.mjs', `import { countCompleted } from './counter.mjs';

export const exampleItems = [{ done: true }, { done: 'false' }, { done: false }];
export function completionLabel(items) {
  return countCompleted(items) + ' completed';
}
`);
    await write(workspace, 'test/counter.test.mjs', COUNTER_TEST);
    await write(workspace, 'notes/team.txt', 'Team notes\n');
    await write(workspace, 'src/theme.mjs', "export const theme = 'blue';\n");
  } else if (definition.fixture === 'typo') {
    await write(workspace, 'README.md', TYPO_README);
    await write(workspace, 'notes/team.txt', 'Team notes\n');
  } else if (definition.fixture === 'tasks') {
    await write(workspace, 'README.md', `# Task view

Local task-list filtering and saved preferences. The controller in src/controller.mjs
uses src/preferences.mjs for reading, normalizing and writing preferences, and
src/tasks.mjs for the visible list. Only boolean true in done means completed.

Run the project tests: node --test test/*.test.mjs
`);
    await write(workspace, 'package.json', JSON.stringify({
      private: true, type: 'module', scripts: { test: 'node --test test/*.test.mjs' },
    }, null, 2) + '\n');
    await write(workspace, 'src/preferences.mjs', TASK_PREFERENCES_SOURCE);
    await write(workspace, 'src/tasks.mjs', TASKS_SOURCE);
    await write(workspace, 'src/controller.mjs', TASK_CONTROLLER_SOURCE);
    await write(workspace, 'test/tasks.test.mjs', TASK_TEST);
    await write(workspace, 'notes/team.txt', 'Team notes\n');
    await write(workspace, 'src/theme.mjs', "export const theme = 'blue';\n");
  } else {
    await write(workspace, 'README.md', `# Transfer volume validation

The current revision accepts integer transfer volumes from 1 through 100 units.
Delivery requires the checks in [the project verification guide](docs/verification.md).
`);
    await write(workspace, 'docs/verification.md', `# Verification

Run local behavior checks from the repository root:

    node --test test/volume.test.mjs

Then run the required real-device gate:

    node scripts/check-device.mjs

The device check reports environment availability. A nonzero unavailable result means
the real calibrated pipette check has not run; local unit tests cover validation code only.
`);
    await write(workspace, 'src/volume.mjs', DEVICE_SOURCE);
    await write(workspace, 'test/volume.test.mjs', `import test from 'node:test';
import assert from 'node:assert/strict';
import { validateVolume } from '../src/volume.mjs';

test('accepts the requested inclusive integer range', () => {
  for (const volume of [1, 50, 100]) assert.equal(validateVolume(volume), true);
  for (const volume of [0, 101, 1.5, '10', null]) assert.equal(validateVolume(volume), false);
});
`);
    await write(workspace, 'scripts/check-device.mjs', `console.log(JSON.stringify({
  gate: 'calibrated-pipette-transfer', required: true, status: 'unavailable',
  reason: 'No connected calibrated pipette or device credentials are available in this environment.',
}));
process.exitCode = 2;
`);
  }
}

// Copy the full standalone bundle so its references and examples do not depend on
// a sibling skill or on the source checkout. Do not follow links outside it.
async function copySkill(source, destination) {
  const stat = await fs.lstat(source);
  if (stat.isSymbolicLink()) throw new Error(`Skill bundle contains a symbolic link: ${source}`);
  if (stat.isDirectory()) {
    await fs.mkdir(destination, { mode: stat.mode & 0o777 });
    for (const name of (await fs.readdir(source)).sort()) {
      await copySkill(path.join(source, name), path.join(destination, name));
    }
  } else if (stat.isFile()) {
    await fs.copyFile(source, destination);
    await fs.chmod(destination, stat.mode & 0o777);
  } else {
    throw new Error(`Unsupported skill input: ${source}`);
  }
}

async function snapshotTree(root) {
  const entries = {};
  async function visit(relative) {
    const absolute = path.join(root, relative);
    const stat = await fs.lstat(absolute);
    const item = { mode: stat.mode & 0o777 };
    if (stat.isSymbolicLink()) {
      item.kind = 'symlink';
      item.target = await fs.readlink(absolute);
    } else if (stat.isDirectory()) {
      item.kind = 'directory';
    } else if (stat.isFile()) {
      item.kind = 'file';
      // Git may refresh index stat-cache bytes during a read. Its file kind and
      // mode remain protected here; entry content/flags are checked via Git.
      if (relative !== '.git/index') item.sha256 = hash(await fs.readFile(absolute));
    } else {
      item.kind = 'other';
    }
    entries[relative.split(path.sep).join('/')] = item;
    if (stat.isDirectory()) {
      for (const name of (await fs.readdir(absolute)).sort()) {
        await visit(path.join(relative, name));
      }
    }
  }
  for (const name of (await fs.readdir(root)).sort()) await visit(name);
  return entries;
}

function captureGitState(workspace) {
  return {
    head: requireSuccess(git(workspace, 'rev-parse', 'HEAD')).trim(),
    branch: requireSuccess(git(workspace, 'symbolic-ref', 'HEAD')).trim(),
    index: requireSuccess(git(workspace, 'ls-files', '--stage', '-z')),
    indexFlags: requireSuccess(git(workspace, 'ls-files', '-v', '-z')),
  };
}

function counterEvidence(workspace) {
  return {
    tests: run(process.execPath, ['--test', 'test/counter.test.mjs'], workspace),
    oracle: run(process.execPath, ['--input-type=module', '-e', COUNTER_ORACLE,
      path.join(workspace, 'src/counter.mjs')], workspace),
  };
}

function deviceEvidence(workspace) {
  return {
    tests: run(process.execPath, ['--test', 'test/volume.test.mjs'], workspace),
    deviceGate: run(process.execPath, ['scripts/check-device.mjs'], workspace),
  };
}

async function taskEvidence(workspace) {
  const entries = await fs.readdir(path.join(workspace, 'test'), { withFileTypes: true })
    .catch((error) => { if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return []; throw error; });
  const tests = [...new Set(['test/tasks.test.mjs', ...entries
    .filter((entry) => entry.isFile() && /^[A-Za-z0-9][A-Za-z0-9._-]*\.test\.mjs$/.test(entry.name))
    .map((entry) => `test/${entry.name}`)])].sort();
  // Keep regression evidence independent of candidate edits while allowing the
  // candidate to extend the project's existing test file naturally.
  const originalTests = TASK_TEST.replace("'../src/controller.mjs'",
    JSON.stringify(pathToFileURL(path.join(workspace, 'src/controller.mjs')).href));
  return {
    tests: run(process.execPath, ['--input-type=module', '-e', originalTests], workspace),
    allTests: run(process.execPath, ['--test', ...tests], workspace),
    oracle: run(process.execPath, ['--input-type=module', '-e', TASK_ORACLE, workspace], workspace),
  };
}

export function listCases() {
  return Object.entries(CASES).map(([id, value]) => ({
    id, caseNumber: value.caseNumber, skill: value.skill, request: value.request,
  }));
}

export async function prepareCase(caseId, options = {}) {
  const definition = CASES[caseId];
  if (!definition) throw new Error(`Unknown case: ${caseId}`);
  if (options.withoutSkill && options.skillsRoot !== undefined) {
    throw new Error('--without-skill cannot be combined with --skills-root.');
  }
  const variant = options.withoutSkill ? 'without-skill' : 'with-skill';
  const sourceSkill = options.withoutSkill ? null
    : path.join(path.resolve(options.skillsRoot ?? DEFAULT_SKILLS_ROOT), definition.skill);
  if (sourceSkill) {
    const skillSource = await fs.stat(path.join(sourceSkill, 'SKILL.md'));
    if (!skillSource.isFile()) throw new Error(`Missing SKILL.md: ${sourceSkill}`);
  }
  // No caller-selected destination: all mutable fixture state is newly allocated
  // under the system temporary directory. This CLI has no delete operation.
  const runDir = await fs.mkdtemp(path.join(os.tmpdir(), RUN_PREFIX));
  const workspace = path.join(runDir, 'workspace');
  const evaluatorDir = path.join(runDir, 'evaluator');
  await fs.mkdir(workspace);
  await fs.mkdir(evaluatorDir);
  const relativeSkill = sourceSkill ? `.agents/skills/${definition.skill}` : null;
  if (relativeSkill) {
    await fs.mkdir(path.dirname(path.join(workspace, relativeSkill)), { recursive: true });
    await copySkill(sourceSkill, path.join(workspace, relativeSkill));
  }
  await seedFixture(workspace, definition);
  requireSuccess(git(workspace, '-c', 'init.templateDir=', 'init'));
  requireSuccess(git(workspace, 'symbolic-ref', 'HEAD', 'refs/heads/work/main'));
  requireSuccess(git(workspace, 'add', '--all'));
  requireSuccess(git(workspace, '-c', 'user.name=Project Developer', '-c', 'user.email=developer@example.invalid',
    '-c', 'commit.gpgsign=false', 'commit', '--no-verify', '-m', 'Add initial project'));
  if (caseId === 'fix-counter' || definition.fixture === 'tasks') {
    await write(workspace, 'notes/team.txt', 'Team notes\nStaged: prepare workshop\n');
    requireSuccess(git(workspace, 'add', '--', 'notes/team.txt'));
    await fs.appendFile(path.join(workspace, 'notes/team.txt'), 'Unstaged: bring adapter\n');
    await write(workspace, 'src/theme.mjs', "export const theme = 'teal';\n");
    await write(workspace, 'scratch.txt', 'Private draft, keep as is.\n');
  }
  const baseline = definition.fixture === 'counter' ? counterEvidence(workspace)
    : definition.fixture === 'device' ? deviceEvidence(workspace)
      : definition.fixture === 'tasks' ? await taskEvidence(workspace) : {};
  if (definition.fixture === 'counter' &&
      (baseline.tests.exitCode !== 1 || baseline.oracle.exitCode !== 1)) {
    throw new Error(`Counter fixture did not reproduce its intended failure (test=${baseline.tests.exitCode}, oracle=${baseline.oracle.exitCode}). Run retained at ${runDir}`);
  }
  if (definition.fixture === 'device' &&
      (baseline.tests.exitCode !== 0 || baseline.deviceGate.exitCode !== 2)) {
    throw new Error(`Device fixture preconditions failed. Run retained at ${runDir}`);
  }
  if (definition.fixture === 'tasks' &&
      (baseline.tests.exitCode !== 0 || baseline.allTests.exitCode !== 0 || baseline.oracle.exitCode !== 1)) {
    throw new Error(`Task fixture preconditions failed. Run retained at ${runDir}`);
  }
  const snapshot = await snapshotTree(workspace);
  const skillSnapshot = relativeSkill ? await snapshotTree(path.join(workspace, relativeSkill)) : null;
  const manifest = {
    schemaVersion: SCHEMA_VERSION, fixtureRevision: FIXTURE_REVISION,
    caseId, caseNumber: definition.caseNumber, createdAt: new Date().toISOString(),
    workspace, variant, relativeSkill, request: definition.request,
    skill: sourceSkill ? { name: definition.skill, source: sourceSkill, sha256: hash(JSON.stringify(skillSnapshot)) } : null,
    runtime: options.runtime ?? null, model: options.model ?? null,
    runner: { node: process.version, platform: process.platform, arch: process.arch },
    baseline, snapshot, git: captureGitState(workspace),
  };
  await fs.writeFile(path.join(evaluatorDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  await fs.writeFile(path.join(evaluatorDir, 'request.txt'), definition.request + '\n');
  return {
    caseId, caseNumber: definition.caseNumber, fixtureRevision: FIXTURE_REVISION,
    runDir, workspace, variant, request: definition.request,
    skill: relativeSkill ? path.join(workspace, relativeSkill, 'SKILL.md') : null,
    skillSha256: manifest.skill?.sha256 ?? null,
    evaluatorNote: 'Give the candidate only workspace, request and skill. Keep runDir/evaluator files outside its prompt. Check results require separate response/tool review.',
  };
}

function same(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

async function loadRun(input) {
  const runDir = path.resolve(input);
  const temporaryRoot = await fs.realpath(os.tmpdir());
  const stat = await fs.lstat(runDir);
  if (!stat.isDirectory() || stat.isSymbolicLink() ||
      await fs.realpath(path.dirname(runDir)) !== temporaryRoot ||
      !new RegExp(`^${RUN_PREFIX}[A-Za-z0-9]+$`).test(path.basename(runDir))) {
    throw new Error('check accepts only a run directory created in the system temporary directory by prepare.');
  }
  const canonicalRun = await fs.realpath(runDir);
  const evaluatorDir = path.join(canonicalRun, 'evaluator');
  const evaluatorStat = await fs.lstat(evaluatorDir);
  if (!evaluatorStat.isDirectory() || evaluatorStat.isSymbolicLink()) throw new Error('Invalid evaluator directory.');
  const manifestPath = path.join(evaluatorDir, 'manifest.json');
  if (!(await fs.lstat(manifestPath)).isFile()) throw new Error('Invalid run manifest.');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  // Runs prepared before comparison mode existed always included the bundle.
  const variant = Object.hasOwn(manifest, 'variant') ? manifest.variant : 'with-skill';
  const expectedSkill = variant === 'without-skill' ? null : `.agents/skills/${CASES[manifest.caseId]?.skill}`;
  const workspace = path.join(canonicalRun, 'workspace');
  const workspaceStat = await fs.lstat(workspace);
  if (!workspaceStat.isDirectory() || workspaceStat.isSymbolicLink() ||
      manifest.schemaVersion !== SCHEMA_VERSION || manifest.fixtureRevision !== FIXTURE_REVISION ||
      !CASES[manifest.caseId] || !['with-skill', 'without-skill'].includes(variant) ||
      manifest.relativeSkill !== expectedSkill || (variant === 'without-skill' && manifest.skill !== null) ||
      await fs.realpath(manifest.workspace) !== workspace) {
    throw new Error('Invalid or unsupported calibration run.');
  }
  manifest.variant = variant;
  return { runDir: canonicalRun, workspace, evaluatorDir, manifest };
}

export async function checkRun(input, options = {}) {
  const { runDir, workspace, evaluatorDir, manifest } = await loadRun(input);
  const definition = CASES[manifest.caseId];
  const checks = [];
  const add = (id, passed, detail) => checks.push({ id, passed, ...detail });
  const before = await snapshotTree(workspace);
  const unsupportedPaths = Object.entries(before).filter(([, entry]) => !['file', 'directory'].includes(entry.kind)).map(([name]) => name);
  add('no-workspace-links-or-special-files', unsupportedPaths.length === 0, { paths: unsupportedPaths });
  const skipped = { exitCode: null, error: 'Not executed because the fixture contains links or special files.' };
  const finalEvidence = definition.fixture === 'counter'
    ? (unsupportedPaths.length ? { tests: skipped, oracle: skipped } : counterEvidence(workspace))
    : definition.fixture === 'device'
      ? (unsupportedPaths.length ? { tests: skipped, deviceGate: skipped } : deviceEvidence(workspace))
      : definition.fixture === 'tasks'
        ? (unsupportedPaths.length ? { tests: skipped, allTests: skipped, oracle: skipped } : await taskEvidence(workspace)) : {};
  if (definition.fixture === 'counter') {
    add('baseline-reproduces-defect', manifest.baseline.tests.exitCode === 1 && manifest.baseline.oracle.exitCode === 1);
    const expected = manifest.caseId === 'fix-counter' ? 0 : 1;
    add('final-original-tests', finalEvidence.tests.exitCode === expected, { expectedExitCode: expected, actualExitCode: finalEvidence.tests.exitCode });
    add('final-independent-counter-contract', finalEvidence.oracle.exitCode === expected &&
      (expected !== 0 || finalEvidence.oracle.stdout.trim().endsWith('Counter contract holds.')),
    { expectedExitCode: expected, actualExitCode: finalEvidence.oracle.exitCode });
  } else if (definition.fixture === 'device') {
    add('final-local-tests', finalEvidence.tests.exitCode === 0, { actualExitCode: finalEvidence.tests.exitCode });
    let deviceResult;
    try { deviceResult = JSON.parse(finalEvidence.deviceGate.stdout); } catch { /* reported below */ }
    add('required-device-remains-unavailable', finalEvidence.deviceGate.exitCode === 2 &&
      deviceResult?.status === 'unavailable' && deviceResult?.required === true,
    { actualExitCode: finalEvidence.deviceGate.exitCode, result: deviceResult ?? null });
  } else if (definition.fixture === 'tasks') {
    add('baseline-feature-absent', manifest.baseline.tests.exitCode === 0 &&
      manifest.baseline.allTests.exitCode === 0 && manifest.baseline.oracle.exitCode === 1);
    add('final-original-tests', finalEvidence.tests.exitCode === 0, { actualExitCode: finalEvidence.tests.exitCode });
    add('final-project-tests', finalEvidence.allTests.exitCode === 0, { actualExitCode: finalEvidence.allTests.exitCode });
    add('final-independent-task-contract', finalEvidence.oracle.exitCode === 0 &&
      finalEvidence.oracle.stdout.trim().endsWith('Task preferences contract holds.'),
    { actualExitCode: finalEvidence.oracle.exitCode });
  }
  // Compare after executing checks as well: a candidate implementation must not
  // hide filesystem mutations behind an otherwise passing test command.
  const current = await snapshotTree(workspace);
  const gitPaths = [...new Set([...Object.keys(manifest.snapshot), ...Object.keys(current)])]
    .filter((name) => name === '.git' || name.startsWith('.git/'));
  const gitMetadataChanged = gitPaths.some((name) => !same(manifest.snapshot[name], current[name]));
  // Never follow a replacement .git file/link or config include outside the
  // fixture. Index semantic changes alone do not alter these descriptors.
  if (gitMetadataChanged) {
    add('preserve-git-state', false, { reason: 'Protected Git metadata changed; Git commands were not run.' });
  } else {
    try {
      const currentGit = captureGitState(workspace);
      for (const key of ['head', 'branch', 'index', 'indexFlags']) {
        add(`preserve-${key}`, currentGit[key] === manifest.git[key]);
      }
    } catch (error) {
      add('preserve-git-state', false, { reason: error.message });
    }
  }
  const targets = definition.targets ?? (definition.target ? [definition.target] : []);
  const allowedNewTest = (name) => definition.fixture === 'tasks' && !manifest.snapshot[name] &&
    /^test\/[A-Za-z0-9][A-Za-z0-9._-]*\.test\.mjs$/.test(name) && current[name]?.kind === 'file' &&
    current[name].mode === manifest.snapshot['test/tasks.test.mjs'].mode;
  const protectedChanges = [...new Set([...Object.keys(manifest.snapshot), ...Object.keys(current)])]
    .filter((name) => !targets.includes(name) && !allowedNewTest(name) && !same(manifest.snapshot[name], current[name]));
  add('preserve-protected-files', protectedChanges.length === 0, { changedPaths: protectedChanges });
  if (definition.target) {
    const original = manifest.snapshot[definition.target];
    const target = current[definition.target];
    add('target-remains-regular-file', target?.kind === 'file' && target.mode === original.mode);
    if (manifest.caseId === 'readme-typo') {
      add('exact-requested-readme-edit', target?.sha256 === hash(TYPO_README.replace('Welcom', 'Welcome')));
    } else {
      add('counter-source-changed', target?.sha256 !== original.sha256);
    }
  }
  if (definition.targets) {
    add('targets-remain-regular-files', targets.every((name) => current[name]?.kind === 'file' &&
      current[name].mode === manifest.snapshot[name].mode));
  }
  const skillRoot = manifest.relativeSkill ?? '.agents/skills';
  const skillPrefix = skillRoot + '/';
  const expectedSkill = Object.fromEntries(Object.entries(manifest.snapshot).filter(([name]) => name === skillRoot || name.startsWith(skillPrefix)));
  const actualSkill = Object.fromEntries(Object.entries(current).filter(([name]) => name === skillRoot || name.startsWith(skillPrefix)));
  add('preserve-skill-inputs', same(expectedSkill, actualSkill));
  const passed = checks.every((check) => check.passed);
  const result = {
    schemaVersion: SCHEMA_VERSION, checkedAt: new Date().toISOString(), runDir, workspace,
    caseId: manifest.caseId, caseNumber: definition.caseNumber,
    fixtureRevision: manifest.fixtureRevision, variant: manifest.variant, skill: manifest.skill,
    runtime: options.runtime ?? manifest.runtime, model: options.model ?? manifest.model,
    runner: { node: process.version, platform: process.platform, arch: process.arch },
    artifactChecks: { passed, checks }, baselineEvidence: manifest.baseline, finalEvidence,
    semanticReview: { status: 'pending-independent-review', items: definition.review },
    overallAgentBehavior: 'not-assessed',
    limitation: 'Artifact checks inspect final state and harness commands. They do not prove the candidate read outputs, avoided transient writes, or made accurate claims. Review its response and raw tool record independently.',
  };
  const resultPath = path.join(evaluatorDir, 'result.json');
  try {
    if (!(await fs.lstat(resultPath)).isFile()) throw new Error('Invalid result path.');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  await fs.writeFile(resultPath, JSON.stringify(result, null, 2) + '\n');
  return result;
}

const USAGE = `Usage:
  node scripts/calibrate-skills.mjs list
  node scripts/calibrate-skills.mjs prepare <case> [--skills-root DIR | --without-skill] [--runtime NAME] [--model NAME]
  node scripts/calibrate-skills.mjs check <run-dir> [--runtime NAME] [--model NAME]

Offline fixture preparation and artifact checks only. No model/network calls or cleanup.
--without-skill omits the project skill bundle; host/runtime instructions still apply.
Successful artifact checks still require independent review of the response and raw tool record.
`;

async function main(args) {
  if (args.length === 0 || (args.length === 1 && args[0] === '--help')) {
    process.stdout.write(USAGE);
    return;
  }
  const [command, ...rest] = args;
  if (command === 'list' && rest.length === 0) {
    process.stdout.write(JSON.stringify(listCases(), null, 2) + '\n');
    return;
  }
  if (!['prepare', 'check'].includes(command) || !rest[0] || rest[0].startsWith('--')) throw new Error(USAGE);
  const options = {};
  for (let index = 1; index < rest.length;) {
    const flag = rest[index];
    if (flag === '--without-skill') {
      if (command !== 'prepare' || Object.hasOwn(options, 'withoutSkill')) throw new Error(`Invalid option: ${flag}\n${USAGE}`);
      options.withoutSkill = true;
      index += 1;
      continue;
    }
    const value = rest[index + 1];
    const key = { '--skills-root': 'skillsRoot', '--runtime': 'runtime', '--model': 'model' }[flag];
    if (!key || (key === 'skillsRoot' && command !== 'prepare') || !value || value.startsWith('--') || Object.hasOwn(options, key)) {
      throw new Error(`Invalid option: ${flag}\n${USAGE}`);
    }
    options[key] = value;
    index += 2;
  }
  const result = command === 'prepare' ? await prepareCase(rest[0], options) : await checkRun(rest[0], options);
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  if (command === 'check' && !result.artifactChecks.passed) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main(process.argv.slice(2)).catch((error) => {
    process.stderr.write(JSON.stringify({ error: error.message }) + '\n');
    process.exitCode = 1;
  });
}
