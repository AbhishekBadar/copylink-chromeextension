// Background script for Chrome extension
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu items
  chrome.contextMenus.create({
    id: "copyUrl",
    title: "Copy URL",
    contexts: ["page", "link"]
  });

  chrome.contextMenus.create({
    id: "copyUrlMarkdown",
    title: "Copy as Markdown Link",
    contexts: ["page", "link"]
  });

  chrome.contextMenus.create({
    id: "copyUrlHtml",
    title: "Copy as HTML Link",
    contexts: ["page", "link"]
  });

  chrome.contextMenus.create({
    type: "separator",
    id: "separator1",
    contexts: ["page", "link"]
  });

  chrome.contextMenus.create({
    id: "generateQrCode",
    title: "Generate QR Code",
    contexts: ["page", "link"]
  });

  // Set default settings
  chrome.storage.sync.set({
    defaultFormat: 'plain',
    showNotification: true,
    copyHistory: true,
    maxHistoryItems: 10
  });
});

// Show page action on all tabs (this makes the icon appear in address bar)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Show the page action for this tab
    chrome.action.setIcon({
      tabId: tabId,
      path: {
        "16": "icons/icon16.png",
        "32": "icons/icon32.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
      }
    });
    
    // Ensure the action is enabled for this tab
    chrome.action.enable(tabId);
  }
});

// Also show on existing tabs when extension loads
chrome.tabs.query({}, (tabs) => {
  tabs.forEach(tab => {
    if (tab.url && !tab.url.startsWith('chrome://')) {
      chrome.action.enable(tab.id);
    }
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  let url = info.linkUrl || tab.url;
  let title = tab.title;
  let textToCopy = '';

  switch (info.menuItemId) {
    case 'copyUrl':
      textToCopy = url;
      await copyToClipboard(textToCopy, tab);
      await addToHistory(url, title, info.menuItemId);
      break;
    case 'copyUrlMarkdown':
      textToCopy = `[${title}](${url})`;
      await copyToClipboard(textToCopy, tab);
      await addToHistory(url, title, info.menuItemId);
      break;
    case 'copyUrlHtml':
      textToCopy = `<a href="${url}">${title}</a>`;
      await copyToClipboard(textToCopy, tab);
      await addToHistory(url, title, info.menuItemId);
      break;
    case 'generateQrCode':
      // Open QR code in a new tab
      const qrUrl = `data:text/html,${encodeURIComponent(generateQRHTML(url, title))}`;
      chrome.tabs.create({ url: qrUrl });
      break;
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  const settings = await chrome.storage.sync.get(['defaultFormat']);
  let textToCopy = '';

  switch (settings.defaultFormat) {
    case 'markdown':
      textToCopy = `[${tab.title}](${tab.url})`;
      break;
    case 'html':
      textToCopy = `<a href="${tab.url}">${tab.title}</a>`;
      break;
    default:
      textToCopy = tab.url;
  }

  await copyToClipboard(textToCopy, tab);
  await addToHistory(tab.url, tab.title, 'extension-click');
});

// Copy text to clipboard
async function copyToClipboard(text, tab) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (textToCopy) => {
        navigator.clipboard.writeText(textToCopy);
      },
      args: [text]
    });

    // Show notification if enabled
    const settings = await chrome.storage.sync.get(['showNotification']);
    if (settings.showNotification) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'CopyLink',
        message: 'URL copied to clipboard!'
      });
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
  }
}

// Add URL to history
async function addToHistory(url, title, action) {
  const settings = await chrome.storage.sync.get(['copyHistory', 'maxHistoryItems']);
  
  if (!settings.copyHistory) return;

  const result = await chrome.storage.local.get(['urlHistory']);
  let history = result.urlHistory || [];

  // Add new item to the beginning
  const newItem = {
    url,
    title,
    action,
    timestamp: Date.now()
  };

  // Remove duplicates
  history = history.filter(item => item.url !== url);
  history.unshift(newItem);

  // Limit history size
  if (history.length > settings.maxHistoryItems) {
    history = history.slice(0, settings.maxHistoryItems);
  }

  await chrome.storage.local.set({ urlHistory: history });
}

// Generate QR code HTML page
function generateQRHTML(url, title) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>QR Code - ${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin: 0;
      padding: 40px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .container {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(10px);
      max-width: 500px;
      color: #333;
    }
    h1 {
      margin: 0 0 10px 0;
      font-size: 28px;
      font-weight: 300;
    }
    .subtitle {
      color: #666;
      margin-bottom: 30px;
      font-size: 16px;
    }
    #qrcode {
      margin: 30px auto;
      padding: 20px;
      background: white;
      border-radius: 15px;
      display: inline-block;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
    .url-display {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 10px;
      padding: 15px;
      margin: 20px 0;
      word-break: break-all;
      font-family: monospace;
      font-size: 14px;
      color: #495057;
    }
    .actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-top: 30px;
      flex-wrap: wrap;
    }
    .btn {
      background: #4285f4;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn:hover {
      background: #3367d6;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
    }
    .btn.secondary {
      background: #34a853;
    }
    .btn.secondary:hover {
      background: #2e7d32;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📱 QR Code Generator</h1>
    <p class="subtitle">Scan with your mobile device</p>
    
    <div id="qrcode"></div>
    
    <div class="url-display">${url}</div>
    
    <div class="actions">
      <button class="btn" onclick="downloadQR()">💾 Download</button>
      <button class="btn secondary" onclick="copyToClipboard('${url}')">📋 Copy URL</button>
      <button class="btn" onclick="window.close()" style="background: #666;">✕ Close</button>
    </div>
    
    <div class="footer">
      Generated by CopyLink Extension
    </div>
  </div>

  <script>
    // Generate QR code
    QRCode.toCanvas(document.getElementById('qrcode'), '${url}', {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    }, function (error) {
      if (error) console.error(error);
    });

    function downloadQR() {
      const canvas = document.querySelector('#qrcode canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = 'qr-code-${title.replace(/[^a-zA-Z0-9]/g, '-')}.png';
        link.href = canvas.toDataURL();
        link.click();
      }
    }

    async function copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  </script>
</body>
</html>`;
}
