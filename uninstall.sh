#!/bin/bash
# HelaKatha Complete Uninstaller
set -e

echo "=== HelaKatha Complete Uninstaller ==="

# 1. Kill running HelaKatha processes
echo "1. Terminating running HelaKatha processes..."
pkill -f "python3.*main.py" || true
pkill -f "helakatha" || true

# 2. Remove user desktop and autostart launchers
echo "2. Removing user desktop and autostart shortcuts..."
rm -f "$HOME/.local/share/applications/helakatha.desktop"
rm -f "$HOME/.config/autostart/helakatha.desktop"
update-desktop-database "$HOME/.local/share/applications" 2>/dev/null || true

# 3. Purge system-wide package if installed
if dpkg -l helakatha >/dev/null 2>&1; then
    echo "3. Purging system-wide debian package..."
    sudo dpkg -P helakatha
fi

# 4. Remove local virtual environment
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
if [ -d "$DIR/.venv" ]; then
    echo "4. Removing Python virtual environment..."
    rm -rf "$DIR/.venv"
fi

# 5. Clean configuration files
echo "5. Cleaning user settings and dictionary files..."
rm -f "$HOME/.gemini/antigravity-cli/user_dict.json"
rm -f "$HOME/.gemini/antigravity-cli/bigram_dict.json"
rm -f "$HOME/.gemini/antigravity-cli/macros.json"
rm -f "$HOME/.gemini/antigravity-cli/settings.json"

echo "=========================================="
echo "HelaKatha has been completely uninstalled!"
echo "=========================================="
