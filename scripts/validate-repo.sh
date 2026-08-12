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
  dev-grill-docs
  dev-image-to-code
  swagger-doc-skill
)

AGENT_CAPABLE_SKILLS=(
  dev-plan
  dev-tdd
  dev-fix
  dev-verify
  dev-code-review
  dev-design-context
  swagger-doc-skill
)

MAIN_AGENT_FIRST_SKILLS=(
  dev-auto
  dev-spec
  dev-commit-writer
  dev-finish
  dev-grill-docs
)

SDD_AWARE_SKILLS=(
  dev-auto
  dev-grill-docs
  dev-spec
  dev-plan
  dev-tdd
  dev-fix
  dev-verify
  dev-code-review
  swagger-doc-skill
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
[[ -f skills/swagger-doc-skill/agents/openai.yaml ]] || fail "swagger-doc-skill agents/openai.yaml missing"
[[ -f skills/swagger-doc-skill/references/output-format.md ]] || fail "swagger-doc-skill output-format reference missing"
[[ -x skills/swagger-doc-skill/scripts/extract_swagger_docs.mjs ]] || fail "swagger-doc-skill extractor missing or not executable"
[[ -f skills/swagger-doc-skill/scripts/extract_swagger_docs.test.mjs ]] || fail "swagger-doc-skill regression test missing"
[[ -f skills/swagger-doc-skill/swagger.config.example.json ]] || fail "swagger-doc-skill config example missing"

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
grep -q '13 个 skill' README.md || fail "README.md should advertise 13 skills"
grep -q 'skills-13' README.md || fail "README badge should advertise skills-13"
grep -q 'dev-auto' README.md || fail "README.md missing dev-auto"
grep -q 'dev-design-context' README.md || fail "README.md missing dev-design-context"
grep -q 'dev-grill-docs' README.md || fail "README.md missing dev-grill-docs"
grep -q 'dev-image-to-code' README.md || fail "README.md missing dev-image-to-code"
grep -q 'dev-image-to-code' CHANGELOG.md || fail "CHANGELOG.md missing dev-image-to-code"
grep -q 'dev-image-to-code' docs/onboarding.md || fail "docs/onboarding.md missing dev-image-to-code"
grep -q 'swagger-doc-skill' README.md || fail "README.md missing swagger-doc-skill"
grep -q 'swagger-doc-skill' CHANGELOG.md || fail "CHANGELOG.md missing swagger-doc-skill"
grep -q 'swagger-doc-skill' docs/onboarding.md || fail "docs/onboarding.md missing swagger-doc-skill"
grep -q 'dev-design-context' .claude-plugin/plugin.json || fail ".claude-plugin/plugin.json missing dev-design-context"
grep -q 'dev-design-context' .claude-plugin/marketplace.json || fail ".claude-plugin/marketplace.json missing dev-design-context"
grep -q 'dev-design-context' .codex-plugin/plugin.json || fail ".codex-plugin/plugin.json missing dev-design-context"
grep -q 'dev-grill-docs' .claude-plugin/plugin.json || fail ".claude-plugin/plugin.json missing dev-grill-docs"
grep -q 'dev-grill-docs' .claude-plugin/marketplace.json || fail ".claude-plugin/marketplace.json missing dev-grill-docs"
grep -q 'dev-grill-docs' .codex-plugin/plugin.json || fail ".codex-plugin/plugin.json missing dev-grill-docs"
grep -q 'dev-image-to-code' .claude-plugin/plugin.json || fail ".claude-plugin/plugin.json missing dev-image-to-code"
grep -q 'dev-image-to-code' .claude-plugin/marketplace.json || fail ".claude-plugin/marketplace.json missing dev-image-to-code"
grep -q 'dev-image-to-code' .codex-plugin/plugin.json || fail ".codex-plugin/plugin.json missing dev-image-to-code"
grep -q 'swagger-doc-skill' .claude-plugin/plugin.json || fail ".claude-plugin/plugin.json missing swagger-doc-skill"
grep -q 'swagger-doc-skill' .claude-plugin/marketplace.json || fail ".claude-plugin/marketplace.json missing swagger-doc-skill"
grep -q 'swagger-doc-skill' .codex-plugin/plugin.json || fail ".codex-plugin/plugin.json missing swagger-doc-skill"
grep -q 'dev-grill-docs' site/index.html || fail "site/index.html missing dev-grill-docs"
grep -q 'dev-grill-docs' index.html || fail "index.html missing dev-grill-docs"
grep -q 'dev-image-to-code' site/index.html || fail "site/index.html missing dev-image-to-code"
grep -q 'dev-image-to-code' index.html || fail "index.html missing dev-image-to-code"
grep -q 'swagger-doc-skill' site/index.html || fail "site/index.html missing swagger-doc-skill"
grep -q 'swagger-doc-skill' index.html || fail "index.html missing swagger-doc-skill"
installer_skills="$(awk '/^EXPECTED_SKILLS=\($/{inside=1; next} inside && /^\)/{exit} inside {print $1}' scripts/install-codex-skills.sh)"
for skill in "${EXPECTED_SKILLS[@]}"; do
  printf '%s\n' "$installer_skills" | grep -qx "$skill" || fail "Codex installer missing $skill"
done
installer_skill_count="$(printf '%s\n' "$installer_skills" | wc -l | tr -d ' ')"
[[ "$installer_skill_count" -eq "${#EXPECTED_SKILLS[@]}" ]] || fail "Codex installer skill inventory differs from validator inventory"
grep -q 'Do not inherit Swagger sources across chats' skills/swagger-doc-skill/SKILL.md || fail "swagger-doc-skill missing cross-chat source isolation"
grep -q 'only reads config files when `--config' skills/swagger-doc-skill/SKILL.md || fail "swagger-doc-skill must require explicit config loading"
grep -q '<skill-dir>/scripts/extract_swagger_docs.mjs' skills/swagger-doc-skill/SKILL.md || fail "swagger-doc-skill commands must resolve from the skill directory"
if grep -q 'node swagger-doc-skill/scripts' skills/swagger-doc-skill/SKILL.md; then
  fail "swagger-doc-skill commands must not depend on the project working directory"
fi
grep -q 'Compatibility alias for dev-grill-docs spec-only mode' skills/dev-spec/SKILL.md || fail "dev-spec should be a compatibility alias for dev-grill-docs"
grep -q 'dev-grill-docs --spec-only' README.md || fail "README.md should describe dev-spec as dev-grill-docs --spec-only"
grep -q 'dev-grill-docs --spec-only' docs/sdd-workflow.md || fail "docs/sdd-workflow.md should describe dev-spec as dev-grill-docs --spec-only"
grep -q -- '-> dev-grill-docs' docs/multi-agent-policy.md || fail "docs/multi-agent-policy.md feature path should route through dev-grill-docs"
grep -q 'dev-design-context' site/index.html || fail "site/index.html missing dev-design-context"
grep -q 'dev-design-context' index.html || fail "index.html missing dev-design-context"
grep -q 'id="articles"' site/index.html || fail "site/index.html missing CSDN articles section"
grep -q 'id="articles"' index.html || fail "index.html missing CSDN articles section"
grep -q 'href="#articles"' site/index.html || fail "site/index.html missing articles nav link"
grep -q 'href="#articles"' index.html || fail "index.html missing articles nav link"
grep -q 'category_13177255' site/index.html || fail "site/index.html missing CSDN column link"
grep -q 'category_13177255' index.html || fail "index.html missing CSDN column link"
for article_id in 161932215 161881057 161851302 161822966 161792237 161752082; do
  grep -q "article/details/$article_id" site/index.html || fail "site/index.html missing CSDN article $article_id"
  grep -q "article/details/$article_id" index.html || fail "index.html missing CSDN article $article_id"
done
grep -q 'bash scripts/install-codex-skills.sh --upgrade' README.md || fail "README.md missing simple Codex upgrade command"
grep -q 'bash scripts/install-codex-skills.sh --upgrade' docs/onboarding.md || fail "docs/onboarding.md missing simple Codex upgrade command"
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

echo "Checking swagger-doc-skill regression tests..."
node --check skills/swagger-doc-skill/scripts/extract_swagger_docs.mjs
node --check skills/swagger-doc-skill/scripts/extract_swagger_docs.test.mjs
node skills/swagger-doc-skill/scripts/extract_swagger_docs.test.mjs

echo "Checking landing page contract..."
node scripts/test-landing-page.mjs

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
