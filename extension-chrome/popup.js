/**
 * HelaKatha WebExtension - Popup Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const toggleEnabled = document.getElementById('toggle-enabled');
  const statusText = document.getElementById('status-text');
  const modeSelect = document.getElementById('mode-select');
  const modeDesc = document.getElementById('mode-desc');
  const themeSelect = document.getElementById('theme-select');

  // Load current settings
  chrome.storage.local.get(['isEnabled', 'isLegacyFont', 'isLightTheme'], (res) => {
    const isEnabled = res.isEnabled ?? true;
    const isLegacy = res.isLegacyFont ?? false;
    const isLight = res.isLightTheme ?? false;

    toggleEnabled.checked = isEnabled;
    updateStatusText(isEnabled);

    modeSelect.value = isLegacy ? 'fm_abhaya' : 'unicode';
    updateModeDesc(isLegacy);

    themeSelect.value = isLight ? 'light' : 'dark';
    document.body.classList.toggle('light-theme', isLight);
  });

  // Toggle On/Off
  toggleEnabled.addEventListener('change', () => {
    const enabled = toggleEnabled.checked;
    updateStatusText(enabled);
    chrome.storage.local.set({ isEnabled: enabled });

    // Update background badge
    if (chrome.action && chrome.action.setBadgeText) {
      chrome.action.setBadgeText({ text: enabled ? 'සි' : 'EN' });
      chrome.action.setBadgeBackgroundColor({ color: enabled ? '#7c3aed' : '#6b7280' });
    }
  });

  // Mode change (Unicode vs FM Abhaya)
  modeSelect.addEventListener('change', () => {
    const isLegacy = modeSelect.value === 'fm_abhaya';
    updateModeDesc(isLegacy);
    chrome.storage.local.set({ isLegacyFont: isLegacy });
  });

  // Theme change (Dark vs Light)
  themeSelect.addEventListener('change', () => {
    const isLight = themeSelect.value === 'light';
    document.body.classList.toggle('light-theme', isLight);
    chrome.storage.local.set({ isLightTheme: isLight });
  });

  function updateStatusText(enabled) {
    if (enabled) {
      statusText.textContent = 'Enabled (Active)';
      statusText.className = '';
    } else {
      statusText.textContent = 'Disabled (Press Alt+Space)';
      statusText.className = 'disabled';
    }
  }

  function updateModeDesc(isLegacy) {
    if (isLegacy) {
      modeDesc.textContent = 'FM Abhaya ASCII for Photoshop/Word';
    } else {
      modeDesc.textContent = 'Standard Sinhala Unicode (Web/Doc)';
    }
  }
});
