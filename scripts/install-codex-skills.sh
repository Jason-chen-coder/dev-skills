#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_DIR="$ROOT/skills"
TARGET_DIR="${CODEX_SKILLS_DIR:-${CODEX_HOME:-$HOME/.codex}/skills}"
MODE="install"

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

usage() {
  cat <<'EOF'
Usage: bash scripts/install-codex-skills.sh [--upgrade] [--target-dir DIR]

Installs dev-skills into Codex's skills directory.

Options:
  --upgrade        Pull the latest repo first, then resync the skills.
  --target-dir DIR Install into DIR instead of ${CODEX_HOME:-$HOME/.codex}/skills.
  -h, --help       Show this help.
EOF
}

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --upgrade)
      MODE="upgrade"
      shift
      ;;
    --target-dir)
      [[ $# -ge 2 ]] || fail "--target-dir requires a directory"
      TARGET_DIR="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      fail "unknown option: $1"
      ;;
  esac
done

[[ -d "$SOURCE_DIR" ]] || fail "skills directory not found: $SOURCE_DIR"
[[ -n "$TARGET_DIR" && "$TARGET_DIR" != "/" ]] || fail "unsafe target directory: $TARGET_DIR"

if [[ "$MODE" == "upgrade" && -d "$ROOT/.git" ]]; then
  git -C "$ROOT" pull --ff-only
fi

mkdir -p "$TARGET_DIR"
SOURCE_REALPATH="$(cd "$SOURCE_DIR" && pwd -P)"
TARGET_REALPATH="$(cd "$TARGET_DIR" && pwd -P)"
[[ "$TARGET_REALPATH" != "$SOURCE_REALPATH" ]] || fail "target directory must not be the repo skills directory"

for skill in "${EXPECTED_SKILLS[@]}"; do
  [[ -d "$SOURCE_DIR/$skill" ]] || fail "missing source skill: $skill"
  rm -rf "$TARGET_DIR/$skill"
  cp -R "$SOURCE_DIR/$skill" "$TARGET_DIR/"
done

echo "Synced ${#EXPECTED_SKILLS[@]} dev-skills to $TARGET_DIR"
