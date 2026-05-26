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
  dev-design-context
)

AGENT_CAPABLE_SKILLS=(
  dev-plan
  dev-tdd
  dev-fix
  dev-verify
  dev-code-review
  dev-design-context
)

MAIN_AGENT_FIRST_SKILLS=(
  dev-auto
  dev-spec
  dev-commit-writer
  dev-finish
)

SDD_AWARE_SKILLS=(
  dev-auto
  dev-spec
  dev-plan
  dev-tdd
  dev-fix
  dev-verify
  dev-code-review
)

OLD_WORKFLOW_SKILL="dev-"
OLD_WORKFLOW_SKILL+="workflow"
OLD_WORKFLOW_TITLE="Dev "
OLD_WORKFLOW_TITLE+="Workflow"
OLD_DESIGN_SKILL="teach-"
OLD_DESIGN_SKILL+="impecc"
OLD_DESIGN_SKILL+="able"
OLD_DESIGN_TITLE="Teach "
OLD_DESIGN_TITLE+="Impecc"
OLD_DESIGN_TITLE+="able"
OLD_DESIGN_MARK="impecc"
OLD_DESIGN_MARK+="able"

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
[[ -x "scripts/install-codex-skills.sh" ]] || fail "scripts/install-codex-skills.sh missing or not executable"
bash -n scripts/install-codex-skills.sh || fail "scripts/install-codex-skills.sh has a syntax error"
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
[[ -f docs/sdd-workflow.md ]] || fail "docs/sdd-workflow.md missing"
[[ -f docs/multi-agent-policy.md ]] || fail "docs/multi-agent-policy.md missing"
grep -q 'docs/team-policy.md' CLAUDE.md.template || fail "CLAUDE.md.template should point to docs/team-policy.md"
grep -q 'docs/team-policy.md' AGENTS.md.template || fail "AGENTS.md.template should point to docs/team-policy.md"
grep -q 'docs/why-dev-baseline.md' CLAUDE.md.template || fail "CLAUDE.md.template should point to docs/why-dev-baseline.md"
grep -q 'docs/why-dev-baseline.md' AGENTS.md.template || fail "AGENTS.md.template should point to docs/why-dev-baseline.md"
grep -q 'docs/multi-agent-policy.md' CLAUDE.md.template || fail "CLAUDE.md.template should point to docs/multi-agent-policy.md"
grep -q 'docs/multi-agent-policy.md' AGENTS.md.template || fail "AGENTS.md.template should point to docs/multi-agent-policy.md"

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
grep -q '10 个 skill' README.md || fail "README.md should advertise 10 skills"
grep -q 'skills-10' README.md || fail "README badge should advertise skills-10"
grep -q 'dev-auto' README.md || fail "README.md missing dev-auto"
grep -q 'dev-design-context' README.md || fail "README.md missing dev-design-context"
grep -q 'dev-design-context' .claude-plugin/plugin.json || fail ".claude-plugin/plugin.json missing dev-design-context"
grep -q 'dev-design-context' .claude-plugin/marketplace.json || fail ".claude-plugin/marketplace.json missing dev-design-context"
grep -q 'dev-design-context' .codex-plugin/plugin.json || fail ".codex-plugin/plugin.json missing dev-design-context"
grep -q 'dev-design-context' site/index.html || fail "site/index.html missing dev-design-context"
grep -q 'dev-design-context' index.html || fail "index.html missing dev-design-context"
grep -q 'dev-design-context' site/app.js || fail "site/app.js missing dev-design-context"
grep -q 'agent-mode' site/index.html || fail "site/index.html missing agent-mode section"
grep -q 'agent-mode' index.html || fail "index.html missing agent-mode section"
grep -q 'agent.title' site/app.js || fail "site/app.js missing agent mode translations"
grep -q 'experience-section' site/index.html || fail "site/index.html missing wrapped experience section"
grep -q 'experience-section' index.html || fail "index.html missing wrapped experience section"
grep -q 'data-experience-mode="agents"' site/index.html || fail "site/index.html missing agent top-level tab"
grep -q 'data-experience-mode="agents"' index.html || fail "index.html missing agent top-level tab"
grep -q 'data-experience-only="agents"' site/index.html || fail "site/index.html missing agent-only content marker"
grep -q 'data-experience-only="agents"' index.html || fail "index.html missing agent-only content marker"
grep -q 'workflow-grid-agents' site/index.html || fail "site/index.html missing agent workflow grid"
grep -q 'workflow-grid-agents' index.html || fail "index.html missing agent workflow grid"
grep -q 'data-install-action="upgrade"' site/index.html || fail "site/index.html missing upgrade install action"
grep -q 'data-install-action="upgrade"' index.html || fail "index.html missing upgrade install action"
grep -q 'install.action.upgrade' site/app.js || fail "site/app.js missing upgrade action translation"
grep -q 'upgradeCommand' site/app.js || fail "site/app.js missing upgrade commands"
grep -q '/plugin update dev-skills' site/app.js || fail "site/app.js missing Claude upgrade command"
grep -q 'bash scripts/install-codex-skills.sh' site/app.js || fail "site/app.js missing simple Codex install command"
grep -q 'bash scripts/install-codex-skills.sh --upgrade' site/app.js || fail "site/app.js missing simple Codex upgrade command"
grep -q 'bash scripts/install-codex-skills.sh --upgrade' README.md || fail "README.md missing simple Codex upgrade command"
grep -q 'bash scripts/install-codex-skills.sh --upgrade' docs/onboarding.md || fail "docs/onboarding.md missing simple Codex upgrade command"
grep -q 'npx skills update' site/app.js || fail "site/app.js missing npx upgrade command"
grep -q 'agentPreviews' site/app.js || fail "site/app.js missing agent runtime preview data"
grep -q 'workflowNodeSpecsByMode' site/app.js || fail "site/app.js missing mode-specific workflow graph data"
grep -q 'setExperienceMode' site/app.js || fail "site/app.js missing top-level experience mode switch"
grep -q '^## 升级' docs/onboarding.md || fail "docs/onboarding.md missing upgrade section"
if grep -q 'for skill in dev-auto' README.md docs/onboarding.md site/app.js; then
  fail "Codex user-facing install docs should use scripts/install-codex-skills.sh instead of exposing the sync loop"
fi
grep -Fq "统一命名为 \`dev-auto\`" CHANGELOG.md || fail "CHANGELOG.md should document the dev-auto rename"
grep -q 'docs/why-dev-baseline.md' README.md || fail "README.md missing docs/why-dev-baseline.md"
grep -q 'docs/team-policy.md' README.md || fail "README.md missing docs/team-policy.md"
grep -q 'docs/sdd-workflow.md' README.md || fail "README.md missing docs/sdd-workflow.md"
grep -q 'docs/sdd-workflow.md' docs/onboarding.md || fail "docs/onboarding.md missing docs/sdd-workflow.md"
grep -q 'docs/sdd-workflow.md' docs/multi-agent-policy.md || fail "docs/multi-agent-policy.md missing docs/sdd-workflow.md"
grep -q 'SDD artifact 对齐' CLAUDE.md.template || fail "CLAUDE.md.template missing SDD artifact rule"
grep -q 'SDD artifact 对齐' AGENTS.md.template || fail "AGENTS.md.template missing SDD artifact rule"
grep -q '轻量 SDD' site/app.js || fail "site/app.js missing SDD landing copy"
grep -q '轻量 SDD' site/index.html || fail "site/index.html missing SDD fallback copy"
grep -q '轻量 SDD' index.html || fail "index.html missing SDD fallback copy"
grep -q 'docs/multi-agent-policy.md' README.md || fail "README.md missing docs/multi-agent-policy.md"
grep -q 'docs/multi-agent-policy.md' docs/onboarding.md || fail "docs/onboarding.md missing docs/multi-agent-policy.md"
grep -q 'Spec-anchored' docs/sdd-workflow.md || fail "docs/sdd-workflow.md missing Spec-anchored guidance"
grep -q 'Multi-Agent Contract' docs/sdd-workflow.md || fail "docs/sdd-workflow.md missing multi-agent SDD contract"
grep -q 'Source artifact:' docs/multi-agent-policy.md || fail "docs/multi-agent-policy.md missing Source artifact contract"
for skill in dev-design-context dev-tdd dev-verify dev-finish; do
  grep -q "$skill" README.md || fail "README.md missing $skill"
  grep -q "$skill" CLAUDE.md.template || fail "CLAUDE.md.template missing $skill"
  grep -q "$skill" skills/dev-auto/SKILL.md || fail "dev-auto missing $skill"
done

echo "Checking multi-agent profile coverage..."
for skill in "${AGENT_CAPABLE_SKILLS[@]}"; do
  grep -q '^## Multi-Agent Profile' "skills/$skill/SKILL.md" || fail "skills/$skill/SKILL.md missing Multi-Agent Profile"
  grep -q 'Recommended agent_type:' "skills/$skill/SKILL.md" || fail "skills/$skill/SKILL.md missing recommended agent_type"
  grep -q 'docs/multi-agent-policy.md' "skills/$skill/SKILL.md" || fail "skills/$skill/SKILL.md should link docs/multi-agent-policy.md"
done
for skill in "${MAIN_AGENT_FIRST_SKILLS[@]}"; do
  grep -q '^## Multi-Agent Note' "skills/$skill/SKILL.md" || fail "skills/$skill/SKILL.md missing Multi-Agent Note"
  grep -q 'docs/multi-agent-policy.md' "skills/$skill/SKILL.md" || fail "skills/$skill/SKILL.md should link docs/multi-agent-policy.md"
done

echo "Checking SDD contract coverage..."
for skill in "${SDD_AWARE_SKILLS[@]}"; do
  grep -q 'SDD' "skills/$skill/SKILL.md" || fail "skills/$skill/SKILL.md missing SDD handoff language"
done

if grep -RIEq "$OLD_WORKFLOW_SKILL|$OLD_WORKFLOW_TITLE" \
  README.md CLAUDE.md.template AGENTS.md.template CHANGELOG.md CONTRIBUTING.md \
  references docs skills scripts index.html site .claude-plugin .codex-plugin; then
  fail "old $OLD_WORKFLOW_SKILL references should be renamed to dev-auto"
fi

if grep -RIEq "$OLD_DESIGN_SKILL|$OLD_DESIGN_TITLE|$OLD_DESIGN_MARK" \
  README.md CLAUDE.md.template AGENTS.md.template CHANGELOG.md CONTRIBUTING.md \
  references docs skills scripts index.html site .claude-plugin .codex-plugin; then
  fail "old design-context skill references should be renamed to dev-design-context"
fi

if grep -RIEq 'dev-fix([[:space:]]+--[a-z]+)?[[:space:]]*(→|->)[^|]*dev-tdd' README.md CLAUDE.md.template AGENTS.md.template docs skills scripts; then
  fail "bug path should not route dev-fix into dev-tdd; dev-fix already owns bug TDD"
fi

echo "Validation OK"
