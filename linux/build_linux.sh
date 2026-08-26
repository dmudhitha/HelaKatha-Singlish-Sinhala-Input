#!/bin/bash
# linux/build_linux.sh
# Build script for Linux packages (Debian .deb installer)
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_ROOT="$( dirname "$DIR" )"

echo "=== Building HelaKatha for Linux ==="

# Staging files into linux/debian/opt/helakatha
echo "Staging files into linux/debian/opt/helakatha..."
mkdir -p "$DIR/debian/opt/helakatha"
cp "$PROJECT_ROOT/core/engine.py" "$DIR/debian/opt/helakatha/"
cp "$DIR/standalone/main.py" "$DIR/debian/opt/helakatha/"
cp "$DIR/standalone/ui.py" "$DIR/debian/opt/helakatha/"
cp "$DIR/ibus_engine.py" "$DIR/debian/opt/helakatha/"
cp "$DIR/README.md" "$DIR/debian/opt/helakatha/"

# Build .deb package
echo "Building Debian installer package..."
dpkg-deb --build "$DIR/debian" "$DIR/helakatha_1.0.1-1_all.deb"

echo "==========================================================="
echo " Linux build complete!"
echo " Package created: linux/helakatha_1.0.1-1_all.deb"
echo "==========================================================="
