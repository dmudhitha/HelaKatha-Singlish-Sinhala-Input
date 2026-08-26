#!/bin/bash
# apple/macos/build_macos.sh
# Builds HelaKatha.app Input Method bundle and installs to ~/Library/Input Methods/
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "=== Building HelaKatha for macOS (InputMethodKit) ==="

APP_NAME="HelaKatha"
BUNDLE_DIR="$APP_NAME.app"
MACOS_DIR="$BUNDLE_DIR/Contents/MacOS"
RESOURCES_DIR="$BUNDLE_DIR/Contents/Resources"

# Clean old build
rm -rf "$BUNDLE_DIR" "$APP_NAME"
mkdir -p "$MACOS_DIR" "$RESOURCES_DIR"

# Compile Swift sources into native binary
echo "Compiling Swift sources with InputMethodKit..."
swiftc -O -o "$MACOS_DIR/$APP_NAME" \
    main.swift \
    HelaKathaInputController.swift \
    SinglishEngine.swift \
    -framework Cocoa \
    -framework InputMethodKit

# Copy bundle metadata
echo "Packaging Info.plist..."
cp Info.plist "$BUNDLE_DIR/Contents/"
echo "APPL????" > "$BUNDLE_DIR/Contents/PkgInfo"

# Install to ~/Library/Input Methods/
TARGET_DIR="$HOME/Library/Input Methods"
echo "Installing to $TARGET_DIR/$BUNDLE_DIR..."
mkdir -p "$TARGET_DIR"
rm -rf "$TARGET_DIR/$BUNDLE_DIR"
cp -r "$BUNDLE_DIR" "$TARGET_DIR/"

echo "==========================================================="
echo " HelaKatha macOS Input Method built and installed!"
echo " How to enable:"
echo " 1. Open System Settings -> Keyboard -> Text Input (Input Sources) -> Edit."
echo " 2. Click '+' -> Sinhala -> HelaKatha."
echo " 3. Switch using Control+Space or the Globe key."
echo "==========================================================="
