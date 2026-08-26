# HelaKatha for Linux

HelaKatha on Linux supports two operating modes:

---

## Mode 1: 🥇 Native IBus Input Method (Zero Clipboard — Recommended)
Integrates directly with the Linux desktop (GNOME, KDE, XFCE) as an official input method source.

### Features:
* **Zero Clipboard (0%):** Injects text via direct OS `commit_text()` calls.
* **Inline Pre-edit Text:** Shows active transliteration underlined at the cursor position.
* **Floating Candidate Lookup Box:** Shows matching suggestions with numeric keys 1-5.
* **Wayland & X11 Native:** Full support for pure Wayland and X11 sessions.

### Installation:
```bash
cd linux
chmod +x setup_ibus.sh
./setup_ibus.sh
```

### Enabling in GNOME / Ubuntu:
1. Open **Settings ➔ Keyboard ➔ Input Sources**.
2. Click **+ (Add)** ➔ **Sinhala** ➔ **Sinhala (HelaKatha Singlish)**.
3. Switch layouts dynamically using `Super + Space`.

---

## Mode 2: 🪟 Standalone Desktop Overlay (PyQt6 GUI)
Runs as an independent desktop tray app with floating language pill and OSD.

### Running from source:
```bash
cd linux/standalone
chmod +x run.sh
./run.sh
```

### Installing as a `.deb` package:
```bash
chmod +x build_linux.sh
./build_linux.sh
sudo apt install ./helakatha_1.0.1-1_all.deb
```
