# HelaKatha for Apple Devices (macOS & iOS)

HelaKatha for Apple platforms provides **100% native, zero-clipboard Singlish input**.

---

## 1. 🍏 macOS: Native Input Method (`InputMethodKit`)

Located in `apple/macos/`, this target implements Apple's official `IMKInputController` protocol.

### Highlights:
* **Zero Clipboard:** Calls `client.insertText(string, replacementRange:)`.
* **Inline Pre-edit:** Shows active transliteration underlined directly in the focused app (Pages, Safari, Word, Xcode, Slack).
* **Native Switching:** Registered in **System Settings ➔ Keyboard ➔ Input Sources**.

### Building on macOS:
```bash
cd apple/macos
chmod +x build_macos.sh
./build_macos.sh
```

### Enabling in macOS:
1. Open **System Settings ➔ Keyboard ➔ Text Input (Input Sources) ➔ Edit**.
2. Click **+ (Add)** ➔ **Sinhala** ➔ **HelaKatha**.
3. Toggle between English and Sinhala anytime using `Control + Space` or the `Globe 🌐` key.

---

## 2. 📱 iOS / iPadOS: Custom Keyboard Extension

Located in `apple/ios/`, this target implements Apple's `UIInputViewController` extension for iPhone and iPad.

### Highlights:
* **Zero Clipboard:** Calls `textDocumentProxy.insertText()`.
* **Touch Suggestion Bar:** Displays live Sinhala candidate buttons above the keyboard.
* **Privacy:** Does not require "Full Access" (100% offline & secure).

### Building in Xcode:
1. Open Xcode and create/open your iOS App project.
2. Add a new **Custom Keyboard Extension** target.
3. Drag `KeyboardViewController.swift` and `SinglishEngine.swift` into the target.
4. Build and run on your iPhone / iPad or iOS Simulator.
