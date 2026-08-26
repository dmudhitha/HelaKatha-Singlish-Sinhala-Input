#!/bin/bash
# HelaKatha root launcher script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Force X11 backend for PyQt (necessary on Wayland systems via Xwayland)
export QT_QPA_PLATFORM=xcb

# Run using virtual environment if present, else system python3
if [ -f "$DIR/.venv/bin/python3" ]; then
    exec "$DIR/.venv/bin/python3" "$DIR/linux/standalone/main.py" "$@"
else
    exec python3 "$DIR/linux/standalone/main.py" "$@"
fi
