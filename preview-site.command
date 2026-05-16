#!/bin/bash
# Double-click in Finder: serves this folder so /about/ and assets load correctly.
cd "$(dirname "$0")" || exit 1
PORT="${PORT:-8899}"
echo ""
echo "  Preview:  http://127.0.0.1:${PORT}/about/"
echo "  Homepage: http://127.0.0.1:${PORT}/"
echo ""
echo "Press Ctrl+C to stop."
echo ""
exec python3 -m http.server "$PORT"
