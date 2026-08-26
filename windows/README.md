# HelaKatha for Windows

HelaKatha on Windows implements **Direct Win32 Unicode Keystroke Injection** (`SendInput` with `KEYEVENTF_UNICODE`).

---

## Key Windows Features
* **Zero Clipboard (0%):** Does not touch the Windows clipboard. Uses Win32 `SendInput` to type UTF-16 Unicode character packets directly into the active window.
* **100% Application Compatibility:** Works across Notepad, Microsoft Word/Excel, Google Chrome, Microsoft Edge, VS Code, Discord, Slack, Telegram, and games.
* **Smart Singlish Engine:** Integrates N-gram sentence predictions, phonetic typo autocorrection, custom text macros (`[date]`, `[time]`), and emoji prefix `:` searches.
* **Modern Catppuccin UI:** Floating suggestion box with smooth animations and system tray integration.

---

## Running from Source
1. Double-click `install.bat` to install Python dependencies (`PyQt6`, `pynput`, `SpeechRecognition`, `pyaudio`).
2. Double-click `run.bat` to launch HelaKatha.

---

## Building Standalone Installer
Run `build_installer.bat` on Windows to generate `HelaKatha_Setup.exe` with Inno Setup.
