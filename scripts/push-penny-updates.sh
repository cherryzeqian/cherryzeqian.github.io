#!/usr/bin/env bash
# Commit and push Penny + site screenshot/asset updates to GitHub Pages repo.
# Run from Terminal on your Mac (requires Git + SSH key for github.com).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Prefer real Git from Command Line Tools / Xcode (Apple's /usr/bin/git can stay a stub until install finishes).
pick_git() {
  local g
  for g in \
    "/Library/Developer/CommandLineTools/usr/bin/git" \
    "/Applications/Xcode.app/Contents/Developer/usr/bin/git" \
    "$(command -v git 2>/dev/null || true)"; do
    if [[ -n "$g" && -x "$g" ]]; then
      if "$g" version >/dev/null 2>&1; then
        printf '%s' "$g"
        return 0
      fi
    fi
  done
  return 1
}

GIT_BIN="$(pick_git)" || {
  echo "Git is not available yet."
  echo ""
  echo "1) Finish installing Xcode Command Line Tools (wait for the installer dialog to complete)."
  echo "2) Quit Terminal, open a new window, then run this script again."
  echo ""
  echo "Check install:"
  echo "  xcode-select -p"
  echo "  # Should print e.g. /Library/Developer/CommandLineTools"
  echo ""
  echo "Or download \"Command Line Tools for Xcode\" from developer.apple.com/download"
  exit 1
}

git() { "$GIT_BIN" "$@"; }

git add -A

if git diff --cached --quiet && git diff --quiet; then
  echo "Nothing to commit — working tree clean."
  exit 0
fi

git status -sb

MSG="Penny: update Figma screenshots, exports, and HTML references"

git commit -m "$MSG"

git push origin main

echo "Done: pushed to origin/main."
