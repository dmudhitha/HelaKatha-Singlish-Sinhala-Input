# HelaKatha - Google Chrome & Chromium Extension (Manifest V3)

A high-performance phonetic **Singlish to Sinhala Input Extension** for **Google Chrome**, **Brave**, **Microsoft Edge**, **Opera**, and other Chromium-based browsers.

---

## 🚀 Quick Install in Google Chrome / Brave / Edge

### Method 1: Load Unpacked (Development / Local Testing)
1. Open your browser and navigate to the Extensions page:
   - **Chrome:** `chrome://extensions`
   - **Brave:** `brave://extensions`
   - **Edge:** `edge://extensions`
2. Enable **Developer mode** (toggle located in the top-right corner).
3. Click the **Load unpacked** button in the top-left corner.
4. Select the directory:
   ```text
   singlish-input-tool/extension-chrome
   ```
5. Pin **HelaKatha (සි)** to your browser toolbar for quick access!

---

## ⌨️ How to Use

1. Click any input field, comment box, or text area on any website (e.g. Google Docs, Gmail, WhatsApp Web, ChatGPT, YouTube, Facebook, Twitter/X).
2. Press **`Alt + Space`** to toggle HelaKatha ON (`සි`) or OFF (`EN`).
3. Type phonetically in Singlish:
   - Type `amma` ➔ **අම්මා**
   - Type `subha dawasak` ➔ **සුබ දවසක්**
   - Type `sri lanka` ➔ **ශ්‍රී ලංකා**
4. Press **`Space`** or **`Enter`** to commit the top candidate, or press numbers **`1` – `5`** to pick from the floating suggestion box.
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

## 🛒 Chrome Web Store Submission Guide

To publish HelaKatha on the **Chrome Web Store**:

1. **ZIP Archive:**
   Use the pre-built `helakatha-chrome.zip` in the root repository folder, or run:
   ```bash
   ./package_extensions.sh
   ```
2. **Chrome Developer Dashboard:**
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
   - Click **Add new item** and upload `helakatha-chrome.zip`.
3. **Store Listing Details:**
   - **Title:** `HelaKatha - Singlish to Sinhala Input`
   - **Summary:** `Smart Singlish to Sinhala phonetic typing tool with real-time transliteration, predictions, and FM Abhaya legacy conversion.`
   - **Category:** `Productivity` or `Accessibility`
   - **Icons:** Automatically picked from `icons/icon128.png`.
   - **Screenshots:** Upload the 16:10 screenshots located in `screenshots/`:
     - `screenshot1_typing.png` (1600x1000)
     - `screenshot2_popup.png` (1600x1000)
     - `screenshot3_fm_abhaya.png` (1600x1000)
4. **Privacy Practices:**
   - **Single Purpose:** `Phonetic Singlish to Sinhala text input method for web forms and text editors.`
   - **Permissions Justification:**
     - `storage`: Saves user preference flags (active mode, font selection, and theme).
     - `activeTab`: Used to send state toggle notifications (`Alt + Space`) to the active page.
   - **Data Usage:** Select **"Does not collect or use user data"**. 100% of transliteration happens locally on the user's device.
