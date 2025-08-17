// Options page script
document.addEventListener('DOMContentLoaded', async () => {
  const elements = {
    defaultFormat: document.getElementById('defaultFormat'),
    showNotification: document.getElementById('showNotification'),
    showFloatingButton: document.getElementById('showFloatingButton'),
    enableQrCode: document.getElementById('enableQrCode'),
    copyHistory: document.getElementById('copyHistory'),
    maxHistoryItems: document.getElementById('maxHistoryItems'),
    saveBtn: document.getElementById('saveBtn'),
    resetBtn: document.getElementById('resetBtn'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
    resetButtonPosition: document.getElementById('resetButtonPosition'),
    statusMessage: document.getElementById('statusMessage')
  };

  // Load current settings
  await loadSettings();

  // Save settings
  elements.saveBtn.addEventListener('click', async () => {
    await saveSettings();
    showStatus('Settings saved successfully!', 'success');
  });

  // Reset to defaults
  elements.resetBtn.addEventListener('click', async () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      await resetSettings();
      await loadSettings();
      showStatus('Settings reset to defaults', 'success');
    }
  });

  // Clear history
  elements.clearHistoryBtn.addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear all URL history?')) {
      await chrome.storage.local.clear();
      showStatus('History cleared successfully', 'success');
    }
  });

  // Auto-save on change for checkboxes
  [
    elements.showNotification,
    elements.showFloatingButton,
    elements.enableQrCode,
    elements.copyHistory
  ].forEach(element => {
    element.addEventListener('change', async () => {
      await saveSettings();
      showStatus('Setting updated', 'success');
    });
  });

  // Auto-save on change for selects and inputs
  elements.defaultFormat.addEventListener('change', async () => {
    await saveSettings();
    showStatus('Default format updated', 'success');
  });

  elements.maxHistoryItems.addEventListener('change', async () => {
    await saveSettings();
    showStatus('History limit updated', 'success');
  });

  // Reset button position
  elements.resetButtonPosition.addEventListener('click', async () => {
    await chrome.storage.local.remove('buttonPosition');
    
    // Notify all tabs to reset button position
    const tabs = await chrome.tabs.query({});
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        action: 'resetButtonPosition'
      }).catch(() => {
        // Ignore errors for tabs that don't have content script
      });
    });
    
    showStatus('Button position reset to default', 'success');
  });

  async function loadSettings() {
    const settings = await chrome.storage.sync.get([
      'defaultFormat',
      'showNotification',
      'showFloatingButton',
      'enableQrCode',
      'copyHistory',
      'maxHistoryItems'
    ]);

    elements.defaultFormat.value = settings.defaultFormat || 'plain';
    elements.showNotification.checked = settings.showNotification !== false;
    elements.showFloatingButton.checked = settings.showFloatingButton || false;
    elements.enableQrCode.checked = settings.enableQrCode !== false;
    elements.copyHistory.checked = settings.copyHistory !== false;
    elements.maxHistoryItems.value = settings.maxHistoryItems || 10;
  }

  async function saveSettings() {
    const settings = {
      defaultFormat: elements.defaultFormat.value,
      showNotification: elements.showNotification.checked,
      showFloatingButton: elements.showFloatingButton.checked,
      enableQrCode: elements.enableQrCode.checked,
      copyHistory: elements.copyHistory.checked,
      maxHistoryItems: parseInt(elements.maxHistoryItems.value)
    };

    await chrome.storage.sync.set(settings);

    // If floating button setting changed, notify content scripts
    const tabs = await chrome.tabs.query({});
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        action: 'settingsUpdated',
        settings: settings
      }).catch(() => {
        // Ignore errors for tabs that don't have content script
      });
    });
  }

  async function resetSettings() {
    const defaultSettings = {
      defaultFormat: 'plain',
      showNotification: true,
      showFloatingButton: false,
      enableQrCode: true,
      copyHistory: true,
      maxHistoryItems: 10
    };

    await chrome.storage.sync.set(defaultSettings);
  }

  function showStatus(message, type) {
    elements.statusMessage.textContent = message;
    elements.statusMessage.className = `status-message ${type}`;
    elements.statusMessage.style.display = 'block';

    setTimeout(() => {
      elements.statusMessage.style.display = 'none';
    }, 3000);
  }
});
