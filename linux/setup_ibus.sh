#!/bin/bash
# linux/setup_ibus.sh
# Automated installer for native Linux IBus integration (Zero Clipboard)
set -e

echo "=== HelaKatha Native IBus Installer ==="
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_ROOT="$( dirname "$DIR" )"

# Check dependencies
echo "Checking IBus Python dependencies..."
if ! python3 -c "import gi; gi.require_version('IBus', '1.0'); from gi.repository import IBus" 2>/dev/null; then
    echo "Installing missing GObject IBus bindings..."
    if [ -x "$(command -v apt-get)" ]; then
        sudo apt-get update && sudo apt-get install -y python3-gi gir1.2-ibus-1.0 ibus
    elif [ -x "$(command -v dnf)" ]; then
        sudo dnf install -y python3-gobject ibus ibus-libs
    elif [ -x "$(command -v pacman)" ]; then
        sudo pacman -S --noconfirm python-gobject ibus
    fi
fi

# Target installation directory
IBUS_COMPONENT_DIR="/usr/share/ibus/component"
TARGET_DIR="/usr/share/helakatha"

echo "Installing HelaKatha files to $TARGET_DIR..."
sudo mkdir -p "$TARGET_DIR" "$IBUS_COMPONENT_DIR"
sudo cp "$PROJECT_ROOT/core/engine.py" "$TARGET_DIR/"
sudo cp "$DIR/ibus_engine.py" "$TARGET_DIR/"

# Create executable wrapper
echo "Creating /usr/bin/helakatha-ibus..."
sudo bash -c "cat << 'EOF' > /usr/bin/helakatha-ibus
#!/bin/bash
exec python3 /usr/share/helakatha/ibus_engine.py \"\$@\"
EOF"
sudo chmod +x /usr/bin/helakatha-ibus

# Register IBus Component XML
echo "Registering IBus Component XML..."
sudo cp "$DIR/helakatha.xml" "$IBUS_COMPONENT_DIR/helakatha.xml"

# Restart IBus daemon to register new engine
echo "Restarting IBus daemon..."
ibus restart || true

echo "==========================================================="
echo " HelaKatha IBus Input Method installed successfully!"
echo " How to enable:"
echo " 1. Open GNOME / Desktop Settings -> Keyboard -> Input Sources."
echo " 2. Click '+' (Add) -> Sinhala -> 'Sinhala (HelaKatha Singlish)'."
echo " 3. Switch layouts anytime using Super+Space or Ctrl+Space."
echo "==========================================================="
