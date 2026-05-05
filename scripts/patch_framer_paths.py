from __future__ import annotations

import os
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]

# Exported Framer bundles reference remote assets; we vendored them under /assets/.
REPLACEMENTS: list[tuple[str, str]] = [
    ("https://framerusercontent.com/", "/assets/framerusercontent.com/"),
]

TARGET_SUFFIXES = {".html", ".mjs", ".js", ".css", ".json", ""}  # "" for extensionless


def should_process(path: Path) -> bool:
    if not path.is_file():
        return False
    if path.name.startswith("."):
        return False
    # Only touch known text-like exports (including extensionless route files)
    if path.suffix not in TARGET_SUFFIXES:
        return False
    # Avoid fonts/images binaries
    lower = path.name.lower()
    if any(
        lower.endswith(ext)
        for ext in (
            ".png",
            ".jpg",
            ".jpeg",
            ".gif",
            ".webp",
            ".ico",
            ".woff",
            ".woff2",
            ".ttf",
            ".otf",
            ".mp4",
            ".mov",
        )
    ):
        return False
    return True


def patch_text(text: str) -> tuple[str, int]:
    total = 0
    for a, b in REPLACEMENTS:
        if a in text:
            total += text.count(a)
            text = text.replace(a, b)
    return text, total


def main() -> int:
    changed_files = 0
    changed_refs = 0

    for dirpath, _, filenames in os.walk(ROOT):
        # Skip .git if present
        if "/.git" in dirpath:
            continue

        for name in filenames:
            path = Path(dirpath) / name
            if not should_process(path):
                continue

            try:
                raw = path.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                # Not a UTF-8 text file; skip.
                continue

            patched, n = patch_text(raw)
            if n <= 0:
                continue

            path.write_text(patched, encoding="utf-8")
            changed_files += 1
            changed_refs += n
            rel = path.relative_to(ROOT)
            print(f"patched {rel} ({n} replacements)")

    print(f"\nDone. Patched {changed_refs} references across {changed_files} files.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

