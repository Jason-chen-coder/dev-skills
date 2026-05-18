#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

EXPECTED_SKILLS=(
  dev-auto
  dev-spec
  dev-plan
  dev-tdd
  dev-fix
  dev-verify
  dev-code-review
  dev-commit-writer
  dev-finish
)

OLD_WORKFLOW_SKILL="dev-"
OLD_WORKFLOW_SKILL+="workflow"
OLD_WORKFLOW_TITLE="Dev "
OLD_WORKFLOW_TITLE+="Workflow"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

echo "Checking SKILL.md frontmatter..."
for f in skills/*/SKILL.md; do
  echo "  $f"
  grep -q '^name:' "$f" || fail "$f missing name frontmatter"
  grep -q '^description:' "$f" || fail "$f missing description frontmatter"
done

echo "Checking expected skill directories..."
[[ ! -d "skills/$OLD_WORKFLOW_SKILL" ]] || fail "old $OLD_WORKFLOW_SKILL directory should be removed"
for skill in "${EXPECTED_SKILLS[@]}"; do
  [[ -f "skills/$skill/SKILL.md" ]] || fail "skills/$skill/SKILL.md missing"
  [[ -f "skills/$skill/references/dev-baseline.md" ]] || fail "skills/$skill/references/dev-baseline.md missing"
done

echo "Checking team template guard..."
[[ ! -f CLAUDE.md ]] || fail "CLAUDE.md should not exist at repo root; use CLAUDE.md.template"
[[ -f CLAUDE.md.template ]] || fail "CLAUDE.md.template missing"
[[ -f AGENTS.md.template ]] || fail "AGENTS.md.template missing"
[[ -f docs/why-dev-baseline.md ]] || fail "docs/why-dev-baseline.md missing"
[[ -f docs/team-policy.md ]] || fail "docs/team-policy.md missing"
grep -q 'docs/team-policy.md' CLAUDE.md.template || fail "CLAUDE.md.template should point to docs/team-policy.md"
grep -q 'docs/team-policy.md' AGENTS.md.template || fail "AGENTS.md.template should point to docs/team-policy.md"
grep -q 'docs/why-dev-baseline.md' CLAUDE.md.template || fail "CLAUDE.md.template should point to docs/why-dev-baseline.md"
grep -q 'docs/why-dev-baseline.md' AGENTS.md.template || fail "AGENTS.md.template should point to docs/why-dev-baseline.md"

echo "Checking baseline copies..."
canonical_md5="$(md5sum references/dev-baseline.md | cut -d' ' -f1)"
for f in skills/*/references/dev-baseline.md; do
  copy_md5="$(md5sum "$f" | cut -d' ' -f1)"
  [[ "$copy_md5" == "$canonical_md5" ]] || fail "$f drifted from references/dev-baseline.md"
done

echo "Checking Claude plugin manifests..."
[[ -f .claude-plugin/marketplace.json ]] || fail ".claude-plugin/marketplace.json missing"
[[ -f .claude-plugin/plugin.json ]] || fail ".claude-plugin/plugin.json missing"
python3 - <<'PY'
import json
from pathlib import Path

marketplace = json.loads(Path(".claude-plugin/marketplace.json").read_text())
plugin = json.loads(Path(".claude-plugin/plugin.json").read_text())
serialized = json.dumps(marketplace, ensure_ascii=False) + json.dumps(plugin, ensure_ascii=False)
old_workflow = "dev-" + "workflow"

assert marketplace["name"] == "dev-skills"
assert marketplace["owner"]["name"]
assert marketplace["plugins"][0]["skills"] == "./skills"
assert plugin["name"] == "dev-skills"
assert plugin["skills"] == "./skills"
assert "dev-auto" in serialized
assert old_workflow not in serialized
PY

echo "Checking Codex plugin manifest..."
[[ -f .codex-plugin/plugin.json ]] || fail ".codex-plugin/plugin.json missing"
python3 - <<'PY'
import json
from pathlib import Path

manifest = json.loads(Path(".codex-plugin/plugin.json").read_text())
serialized = json.dumps(manifest, ensure_ascii=False)
old_workflow = "dev-" + "workflow"

assert manifest["name"] == "dev-skills"
assert manifest["skills"] == "./skills/"
assert manifest["interface"]["displayName"] == "Dev Skills"
assert "Coding" == manifest["interface"]["category"]
for skill in ("dev-tdd", "dev-verify", "dev-finish"):
    assert skill in manifest["description"], f"{skill} missing from Codex description"
assert "dev-auto" in serialized
assert old_workflow not in serialized
PY

echo "Checking docs mention the expanded skill set..."
grep -q '9 个 skill' README.md || fail "README.md should advertise 9 skills"
grep -q 'skills-9' README.md || fail "README badge should advertise skills-9"
grep -q 'dev-auto' README.md || fail "README.md missing dev-auto"
grep -Fq "统一命名为 \`dev-auto\`" CHANGELOG.md || fail "CHANGELOG.md should document the dev-auto rename"
grep -q 'docs/why-dev-baseline.md' README.md || fail "README.md missing docs/why-dev-baseline.md"
grep -q 'docs/team-policy.md' README.md || fail "README.md missing docs/team-policy.md"
for skill in dev-tdd dev-verify dev-finish; do
  grep -q "$skill" README.md || fail "README.md missing $skill"
  grep -q "$skill" CLAUDE.md.template || fail "CLAUDE.md.template missing $skill"
  grep -q "$skill" skills/dev-auto/SKILL.md || fail "dev-auto missing $skill"
done

if grep -RIEq "$OLD_WORKFLOW_SKILL|$OLD_WORKFLOW_TITLE" \
  README.md CLAUDE.md.template AGENTS.md.template CHANGELOG.md CONTRIBUTING.md \
  references docs skills scripts index.html site .claude-plugin .codex-plugin; then
  fail "old $OLD_WORKFLOW_SKILL references should be renamed to dev-auto"
fi

if grep -RIEq 'dev-fix([[:space:]]+--[a-z]+)?[[:space:]]*(→|->)[^|]*dev-tdd' README.md CLAUDE.md.template AGENTS.md.template docs skills scripts; then
  fail "bug path should not route dev-fix into dev-tdd; dev-fix already owns bug TDD"
fi

echo "Validation OK"
