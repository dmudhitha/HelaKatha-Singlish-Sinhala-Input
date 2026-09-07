#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "=== Packaging HelaKatha WebExtensions ==="

# 1. Rebuild JavaScript engines from Python core
python3 "$DIR/build_web_engine.py"

# 2. Sync shared UI and scripts from extension-chrome to extension-firefox
mkdir -p "$DIR/extension-firefox/icons" "$DIR/extension-firefox/screenshots"
cp "$DIR/extension-chrome/content.js" "$DIR/extension-firefox/"
cp "$DIR/extension-chrome/floating_box.css" "$DIR/extension-firefox/"
cp "$DIR/extension-chrome/popup.html" "$DIR/extension-firefox/"
cp "$DIR/extension-chrome/popup.css" "$DIR/extension-firefox/"
cp "$DIR/extension-chrome/popup.js" "$DIR/extension-firefox/"
cp -r "$DIR/extension-chrome/icons/"* "$DIR/extension-firefox/icons/"
cp -r "$DIR/extension-chrome/screenshots/"* "$DIR/extension-firefox/screenshots/"

# 3. Create Chrome Distribution ZIP (for Chrome Web Store & Chromium manual install)
rm -f "$DIR/helakatha-chrome.zip"
(cd "$DIR/extension-chrome" && zip -q -r "$DIR/helakatha-chrome.zip" . -x "*.DS_Store" "*__pycache__*")
echo "✓ Package created: helakatha-chrome.zip ($(du -h "$DIR/helakatha-chrome.zip" | cut -f1))"

# 4. Create Firefox Distribution ZIP (for Mozilla AMO & Firefox manual install)
rm -f "$DIR/helakatha-firefox.zip"
(cd "$DIR/extension-firefox" && zip -q -r "$DIR/helakatha-firefox.zip" . -x "*.DS_Store" "*__pycache__*")
echo "✓ Package created: helakatha-firefox.zip ($(du -h "$DIR/helakatha-firefox.zip" | cut -f1))"

echo "=========================================================="
echo " Packaging complete!"
echo " Chrome:  extension-chrome/  -> helakatha-chrome.zip"
echo " Firefox: extension-firefox/ -> helakatha-firefox.zip"
echo "=========================================================="
