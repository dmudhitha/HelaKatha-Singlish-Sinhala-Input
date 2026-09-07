/**
 * HelaKatha WebExtension - Background Service Worker
 * Handles shortcuts (Alt+S), badge status, and settings sync
 */

let isEnabled = true;

// Initialize badge and state
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

function updateBadge(enabled) {
  if (enabled) {
    chrome.action.setBadgeText({ text: 'සි' });
    chrome.action.setBadgeBackgroundColor({ color: '#7c3aed' });
    chrome.action.setTitle({ title: 'HelaKatha: ON (Alt+S to toggle)' });
  } else {
    chrome.action.setBadgeText({ text: 'EN' });
    chrome.action.setBadgeBackgroundColor({ color: '#6b7280' });
    chrome.action.setTitle({ title: 'HelaKatha: OFF (Alt+S to toggle)' });
  }
}

// Handle global command shortcut (Alt+S)
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
