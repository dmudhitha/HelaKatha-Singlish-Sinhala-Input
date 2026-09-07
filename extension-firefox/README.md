# 🦊 HelaKatha - Mozilla Firefox Add-on (Manifest V3)

A high-performance phonetic **Singlish to Sinhala Input Add-on** for **Mozilla Firefox**, compliant with Mozilla AMO Manifest V3 standards.

---

## 🚀 Quick Install in Mozilla Firefox

### Method 1: Load Temporary Add-on (Development / Testing)
1. Open Firefox and navigate to:
   ```text
   about:debugging#/runtime/this-firefox
   ```
2. Click the **"Load Temporary Add-on..."** button.
3. Select `manifest.json` from the `extension-firefox/` directory:
   ```text
   /home/mudhitha/System/singlish-input-tool/extension-firefox/manifest.json
   ```
4. The purple **සි** badge will appear in your Firefox toolbar!

---

## ⌨️ How to Use

1. Click any input field or textarea on any website (e.g. Google Docs, Gmail, WhatsApp Web, ChatGPT, YouTube, Facebook, Twitter/X).
2. Press **`Alt + Space`** to toggle HelaKatha ON (`සි`) or OFF (`EN`).
3. Type phonetically in Singlish:
   - Type `amma` ➔ **අම්මා**
   - Type `subha dawasak` ➔ **සුබ දවසක්**
   - Type `sri lanka` ➔ **ශ්‍රී ලංකා**
4. Press **`Space`** or **`Enter`** to commit candidate #1, or press numbers **`1` – `5`** to pick from the floating suggestion box.
5. Punctuation marks (`.` `,` `?` `!` `;`) commit automatically.

---

## 🎨 Popup Features
Click the **HelaKatha icon (සි)** in your toolbar to:
* **Toggle Typing ON / OFF**
* **Font Mode Switcher:**
  * **Sinhala Unicode:** For modern websites, Google Docs, WhatsApp, and social media.
  * **FM Abhaya (Legacy ASCII):** Generates visual-order ASCII text for Adobe Photoshop, Illustrator, InDesign, and MS Word.
* **Theme Selector:** Toggle between Catppuccin Dark and Light themes.

---

## 🦊 Mozilla Add-ons (AMO) Submission Guide

To publish HelaKatha on [Mozilla Add-ons (AMO)](https://addons.mozilla.org):

1. **ZIP Archive:**
   Use the pre-built `helakatha-firefox.zip` in the root repository folder, or run:
   ```bash
   ./package_extensions.sh
   ```
2. **AMO Developer Hub:**
   - Go to [AMO Developer Hub](https://addons.mozilla.org/developers/addon/submit/upload-listed).
   - Upload `helakatha-firefox.zip`.
3. **Manifest V3 Validation:**
   - Pre-configured with unique Gecko ID: `helakatha-sinhala-input@mudhitha.net`
   - Configured with mandatory privacy declaration: `"data_collection_permissions": { "required": ["none"] }`
   - Background script loader: `"background": { "scripts": ["background.js"] }`
4. **Source Code Notice:**
   - When asked if code is minified or generated, select **No** (pure readable vanilla JavaScript).
