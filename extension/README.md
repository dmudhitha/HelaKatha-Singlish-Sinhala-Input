# 🌐 HelaKatha WebExtension (Chrome & Firefox)

**HelaKatha Singlish to Sinhala WebExtension** brings seamless phonetic typing, real-time candidate suggestions, emoji shortcuts, macros, and FM Abhaya conversion to any web browser.

---

## 🚀 How to Install in Google Chrome / Brave / Edge / Opera

1. Open your browser and navigate to:
   * **Chrome / Brave:** `chrome://extensions`
   * **Edge:** `edge://extensions`
2. Enable **Developer mode** (toggle located in the top-right corner).
3. Click the **"Load unpacked"** button.
4. Select the `extension/` folder inside this repository:
   ```
   /home/mudhitha/System/singlish-input-tool/extension
   ```
5. Done! The purple **සි** icon will appear in your browser toolbar.

---

## 🦊 How to Install in Mozilla Firefox

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2. Click **"Load Temporary Add-on..."**.
3. Select the `extension/manifest.json` file inside this repository:
   ```
   /home/mudhitha/System/singlish-input-tool/extension/manifest.json
   ```
4. Done! The extension is now active in Firefox across all web pages.

---

## ⌨️ How to Use

| Key / Action | What it Does |
| :--- | :--- |
| **`Alt + S`** | Global shortcut to toggle Singlish typing **ON / OFF** |
| **`Space` or `Enter`** | Commit the #1 candidate word and auto-hide suggestion box |
| **`1` – `5`** | Directly select a specific word from the suggestion list |
| **`.` `,` `?` `!` `;`** | Auto-commit the current word with the punctuation attached |
| **`Esc`** | Dismiss the suggestion box without typing Sinhala |

---

## 🌟 Key Features

* **Works Everywhere:** Supported across Google Docs, Gmail, WhatsApp Web, Facebook, Twitter/X, ChatGPT, YouTube, Reddit, and all standard textboxes.
* **100% Client-Side & Private:** No network requests, zero telemetry. All transliteration runs locally in JavaScript.
* **Auto-Hiding Floating Box:** Positioned right next to your text cursor, strictly vanishing on Space/Enter until you type again.
* **FM Abhaya Mode:** Toggle between Standard Sinhala Unicode and FM Abhaya visual ASCII encoding.
* **Emoji & Macro Shortcuts:** Type `smi` for 😊, `lk` for 🇱🇰, `hwru` for *"කොහොමද ඔයාට?"*, etc.
