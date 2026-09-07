/**
 * HelaKatha WebExtension - Content Script
 * Real-time Singlish typing, candidate box, Alt+S shortcut, and live theme synchronization
 */

(function () {
  'use strict';

  let isEnabled = true;
  let isLegacyFont = false;
  let isLightTheme = false;
  let buffer = '';
  let lastTypedWord = '';
  let activeElement = null;
  let candidateBox = null;
  let toastNotification = null;
  let rows = [];
  let previewLabel = null;
  let currentCandidates = [];
  let selectedIndex = 0;

  const engine = new TransliterationEngine();

  // 1. Sync settings from storage & listen for live changes
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['isEnabled', 'isLegacyFont', 'isLightTheme'], (res) => {
      if (res.isEnabled !== undefined) isEnabled = res.isEnabled;
      if (res.isLegacyFont !== undefined) isLegacyFont = res.isLegacyFont;
      if (res.isLightTheme !== undefined) isLightTheme = res.isLightTheme;
      updateThemeClass();
    });

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local') {
        if (changes.isEnabled !== undefined) {
          isEnabled = changes.isEnabled.newValue;
          if (!isEnabled) hideUI();
        }
        if (changes.isLegacyFont !== undefined) {
          isLegacyFont = changes.isLegacyFont.newValue;
        }
        if (changes.isLightTheme !== undefined) {
          isLightTheme = changes.isLightTheme.newValue;
          updateThemeClass();
        }
      }
    });

    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.action === 'toggleState') {
        isEnabled = msg.isEnabled;
        if (!isEnabled) hideUI();
      } else if (msg.action === 'setLegacyFont') {
        isLegacyFont = msg.isLegacyFont;
      } else if (msg.action === 'setTheme') {
        isLightTheme = msg.isLightTheme;
        updateThemeClass();
      }
      if (sendResponse) sendResponse({ success: true });
    });
  }

  function updateThemeClass() {
    if (!candidateBox) return;
    if (isLightTheme) {
      candidateBox.classList.add('helakatha-light');
    } else {
      candidateBox.classList.remove('helakatha-light');
    }
  }

  // 2. Build DOM Candidate Floating Box
  function createCandidateBox() {
    if (candidateBox) return;

    candidateBox = document.createElement('div');
    candidateBox.id = 'helakatha-suggestion-box';
    candidateBox.className = 'helakatha-hidden';

    previewLabel = document.createElement('div');
    previewLabel.className = 'helakatha-preview';
    previewLabel.textContent = 'Typing:';
    candidateBox.appendChild(previewLabel);

    rows = [];
    for (let i = 0; i < 5; i++) {
      const row = document.createElement('div');
      row.className = 'helakatha-row' + (i === 0 ? ' helakatha-active' : '');
      row.dataset.index = i;

      const wordSpan = document.createElement('span');
      wordSpan.className = 'helakatha-word';
      wordSpan.textContent = '';

      const numSpan = document.createElement('span');
      numSpan.className = 'helakatha-num';
      numSpan.textContent = String(i + 1);

      row.appendChild(wordSpan);
      row.appendChild(numSpan);

      row.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectCandidate(i);
      });

      candidateBox.appendChild(row);
      rows.push(row);
    }

    updateThemeClass();
    const parent = document.body || document.documentElement;
    if (parent) parent.appendChild(candidateBox);
  }

  // Visual notification toast for Alt+S
  function showToast(message) {
    if (!toastNotification) {
      toastNotification = document.createElement('div');
      toastNotification.style.position = 'fixed';
      toastNotification.style.bottom = '20px';
      toastNotification.style.right = '20px';
      toastNotification.style.zIndex = '2147483647';
      toastNotification.style.padding = '8px 16px';
      toastNotification.style.borderRadius = '8px';
      toastNotification.style.fontSize = '13px';
      toastNotification.style.fontWeight = 'bold';
      toastNotification.style.fontFamily = 'system-ui, sans-serif';
      toastNotification.style.color = '#ffffff';
      toastNotification.style.background = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)';
      toastNotification.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
      toastNotification.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      const parent = document.body || document.documentElement;
      if (parent) parent.appendChild(toastNotification);
    }

    toastNotification.textContent = message;
    toastNotification.style.opacity = '1';
    toastNotification.style.display = 'block';

    setTimeout(() => {
      if (toastNotification) {
        toastNotification.style.opacity = '0';
        setTimeout(() => {
          if (toastNotification) toastNotification.style.display = 'none';
        }, 200);
      }
    }, 1500);
  }

  // 3. UI Show / Hide helpers
  function showUI(bufferText, candidates) {
    if (!isEnabled || !bufferText || !candidates || candidates.length === 0) {
      hideUI();
      return;
    }

    createCandidateBox();
    currentCandidates = candidates;
    selectedIndex = 0;

    previewLabel.textContent = `Typing: ${bufferText}` + (isLegacyFont ? ' [FM Abhaya]' : ' [Unicode]');

    for (let i = 0; i < 5; i++) {
      if (i < candidates.length) {
        let displayWord = candidates[i];
        if (isLegacyFont && displayWord !== bufferText) {
          displayWord = unicode_to_fm_abhaya(displayWord);
        }
        rows[i].querySelector('.helakatha-word').textContent = displayWord;
        rows[i].className = 'helakatha-row' + (i === selectedIndex ? ' helakatha-active' : '');
        rows[i].style.display = 'flex';
      } else {
        rows[i].style.display = 'none';
      }
    }

    positionCandidateBox();
    candidateBox.classList.remove('helakatha-hidden');
  }

  function hideUI() {
    if (candidateBox) {
      candidateBox.classList.add('helakatha-hidden');
    }
    buffer = '';
    currentCandidates = [];
  }

  // 4. Caret Positioning
  function positionCandidateBox() {
    if (!candidateBox || !activeElement) return;

    let left = 0;
    let top = 0;

    if (activeElement.isContentEditable) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0).cloneRange();
        const rect = range.getBoundingClientRect();
        left = rect.left + window.scrollX + 5;
        top = rect.bottom + window.scrollY + 8;
      }
    } else {
      const rect = activeElement.getBoundingClientRect();
      left = rect.left + window.scrollX + 15;
      top = rect.bottom + window.scrollY + 6;
    }

    const boxWidth = 240;
    if (left + boxWidth > window.innerWidth + window.scrollX) {
      left = window.innerWidth + window.scrollX - boxWidth - 20;
    }

    candidateBox.style.left = `${Math.max(10, left)}px`;
    candidateBox.style.top = `${top}px`;
  }

  // 5. Text Replacement Logic
  function replaceText(deleteCount, wordToInsert, extraChar = '') {
    if (!activeElement) return;

    let textToInject = isLegacyFont ? unicode_to_fm_abhaya(wordToInsert) : wordToInsert;
    textToInject += extraChar;

    if (activeElement.isContentEditable) {
      // ContentEditable (Google Docs, Gmail, WhatsApp Web, ChatGPT)
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        for (let i = 0; i < deleteCount; i++) {
          document.execCommand('delete', false, null);
        }
        document.execCommand('insertText', false, textToInject);
      }
    } else if (typeof activeElement.selectionStart === 'number') {
      // Standard inputs and textareas
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;
      const deleteStart = Math.max(0, start - deleteCount);
      
      activeElement.setRangeText(textToInject, deleteStart, end, 'end');
      
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
      activeElement.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Dynamic Learning
    if (buffer) {
      engine.learn_word(buffer, wordToInsert);
      if (lastTypedWord) {
        engine.learn_bigram(lastTypedWord, wordToInsert);
      }
      lastTypedWord = wordToInsert;
    }

    hideUI();
  }

  function selectCandidate(index) {
    if (index >= 0 && index < currentCandidates.length) {
      const selected = currentCandidates[index];
      replaceText(buffer.length, selected, ' ');
    }
  }

  // 6. Global Key Interception
  window.addEventListener('keydown', function (e) {
    // 1. Direct Alt + Space (or Alt + S) Toggle Handler
    if (e.altKey && (e.key === ' ' || e.code === 'Space' || e.key === 's' || e.key === 'S' || e.code === 'KeyS')) {
      e.preventDefault();
      e.stopPropagation();
      isEnabled = !isEnabled;
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ isEnabled: isEnabled });
      }
      hideUI();
      showToast(isEnabled ? 'HelaKatha: ON (සි)' : 'HelaKatha: OFF (EN)');
      return;
    }

    if (!isEnabled) return;

    const el = e.target;
    if (!el) return;

    const isInput = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable;
    if (!isInput) return;

    if (el.tagName === 'INPUT' && el.type === 'password') return;

    activeElement = el;

    // Modifiers (Ctrl, Alt, Cmd) -> cancel buffer
    if (e.ctrlKey || e.altKey || e.metaKey) {
      if (buffer) hideUI();
      return;
    }

    // Escape -> dismiss popup
    if (e.key === 'Escape') {
      if (buffer) {
        hideUI();
        e.preventDefault();
      }
      return;
    }

    // Space or Enter -> commit word
    if (e.key === ' ' || e.key === 'Enter') {
      if (buffer && currentCandidates.length > 0) {
        e.preventDefault();
        const selected = currentCandidates[0];
        const extra = e.key === ' ' ? ' ' : '\n';
        replaceText(buffer.length, selected, extra);
        return;
      } else {
        hideUI();
      }
      return;
    }

    // Number keys 1-5 selection
    if (buffer && ['1', '2', '3', '4', '5'].includes(e.key)) {
      const idx = parseInt(e.key, 10) - 1;
      if (idx < currentCandidates.length) {
        e.preventDefault();
        selectCandidate(idx);
        return;
      }
    }

    // Punctuation marks (. , ? ! ;) -> commit word + punctuation
    if (buffer && ['.', ',', '?', '!', ';'].includes(e.key)) {
      if (currentCandidates.length > 0) {
        e.preventDefault();
        const selected = currentCandidates[0];
        replaceText(buffer.length, selected, e.key);
        return;
      }
    }

    // Backspace
    if (e.key === 'Backspace') {
      if (buffer.length > 0) {
        buffer = buffer.slice(0, -1);
        if (buffer) {
          const candidates = engine.get_candidates(buffer);
          showUI(buffer, candidates);
        } else {
          hideUI();
        }
      } else {
        hideUI();
      }
      return;
    }

    // Standard character typing (letters, numbers, allowed symbols)
    if (e.key.length === 1 && (/^[a-zA-Z0-9)\]\/\\\-:]$/).test(e.key)) {
      if (!buffer && !isNaN(e.key)) {
        return; // Don't buffer starting numbers
      }
      buffer += e.key;
      const candidates = engine.get_candidates(buffer);
      showUI(buffer, candidates);
    }
  }, true);

  // Click outside closes suggestion box
  document.addEventListener('mousedown', function (e) {
    if (candidateBox && !candidateBox.contains(e.target)) {
      hideUI();
    }
  });
})();
