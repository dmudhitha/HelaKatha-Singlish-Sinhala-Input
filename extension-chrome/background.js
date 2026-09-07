/**
 * HelaKatha WebExtension - Background Service Worker (Chrome Manifest V3)
 * Handles shortcuts (Alt+Space), badge status, and settings sync
 */

let isEnabled = true;

// Initialize badge and state on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['isEnabled'], (res) => {
    if (res.isEnabled !== undefined) {
      isEnabled = res.isEnabled;
    } else {
      chrome.storage.local.set({ isEnabled: true, isLegacyFont: false, isLightTheme: false });
    }
    updateBadge(isEnabled);
  });
});

// Restore badge on browser startup
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(['isEnabled'], (res) => {
    updateBadge(res.isEnabled ?? true);
  });
});

function updateBadge(enabled) {
  if (enabled) {
    chrome.action.setBadgeText({ text: 'සි' });
    chrome.action.setBadgeBackgroundColor({ color: '#7c3aed' });
    chrome.action.setTitle({ title: 'HelaKatha: ON (Alt+Space to toggle)' });
  } else {
    chrome.action.setBadgeText({ text: 'EN' });
    chrome.action.setBadgeBackgroundColor({ color: '#6b7280' });
    chrome.action.setTitle({ title: 'HelaKatha: OFF (Alt+Space to toggle)' });
  }
}

// Handle global command shortcut (Alt+Space)
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-helakatha') {
    chrome.storage.local.get(['isEnabled'], (res) => {
      const newState = !(res.isEnabled ?? true);
      chrome.storage.local.set({ isEnabled: newState }, () => {
        updateBadge(newState);
        // Broadcast to all open tabs
        chrome.tabs.query({}, (tabs) => {
          for (const tab of tabs) {
            if (tab.id) {
              chrome.tabs.sendMessage(tab.id, { action: 'toggleState', isEnabled: newState }).catch(() => {});
            }
          }
        });
      });
    });
  }
});
