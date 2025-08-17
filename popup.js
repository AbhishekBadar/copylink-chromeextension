// Popup script (MV3-safe, fully offline QR via bundled qrcode.min.js from soldair)
document.addEventListener('DOMContentLoaded', async () => {
  const currentUrlElement = document.getElementById('currentUrl');
  const copyFormatSelect = document.getElementById('copyFormat');
  const copyBtn = document.getElementById('copyBtn');
  const copyTitleBtn = document.getElementById('copyTitleBtn');
  const qrCodeBtn = document.getElementById('qrCodeBtn');
  const historyList = document.getElementById('historyList');
  const optionsLink = document.getElementById('optionsLink');

  // QR Modal elements
  const qrModal = document.getElementById('qrModal');
  const qrCloseBtn = document.getElementById('qrCloseBtn');
  const qrCodeContainer = document.getElementById('qrCodeContainer');
  const qrUrl = document.getElementById('qrUrl');
  const downloadQrBtn = document.getElementById('downloadQrBtn');
  const copyQrBtn = document.getElementById('copyQrBtn');

  let currentTab = null;

  // Get current tab
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTab = tab;
    currentUrlElement.textContent = tab?.url || 'Unknown URL';
  } catch (error) {
    console.error('Unable to get current tab:', error);
    currentUrlElement.textContent = 'Unable to get current URL';
  }

  // Load settings
  const settings = await chrome.storage.sync.get(['defaultFormat', 'enableQrCode']);
  if (settings.defaultFormat) {
    copyFormatSelect.value = settings.defaultFormat;
  }

  // Show/hide QR code button based on settings
  if (settings.enableQrCode === false) {
    qrCodeBtn.style.display = 'none';
  }

  // Copy URL button
  copyBtn.addEventListener('click', async () => {
    if (!currentTab) return;

    const format = copyFormatSelect.value;
    let textToCopy = '';

    switch (format) {
      case 'markdown':
        textToCopy = `[${currentTab.title}](${currentTab.url})`;
        break;
      case 'html':
        textToCopy = `<a href="${currentTab.url}">${currentTab.title}</a>`;
        break;
      default:
        textToCopy = currentTab.url || '';
    }

    await copyToClipboard(textToCopy);
    await addToHistory(currentTab.url, currentTab.title, 'popup-copy');
    showNotification('URL copied!');
  });

  // Copy title + URL button
  copyTitleBtn.addEventListener('click', async () => {
    if (!currentTab) return;

    const textToCopy = `${currentTab.title}\n${currentTab.url}`;
    await copyToClipboard(textToCopy);
    await addToHistory(currentTab.url, currentTab.title, 'popup-title-copy');
    showNotification('Title + URL copied!');
  });

  // QR Code button
  qrCodeBtn.addEventListener('click', async () => {
    if (!currentTab) return;
    generateQRCode(currentTab.url);
  });

  // QR Modal event listeners
  qrCloseBtn.addEventListener('click', closeQRModal);
  qrModal.addEventListener('click', (e) => {
    if (e.target === qrModal) closeQRModal();
  });

  downloadQrBtn.addEventListener('click', downloadQRCode);
  copyQrBtn.addEventListener('click', copyQRCodeImage);

  // Format selection change
  copyFormatSelect.addEventListener('change', async () => {
    await chrome.storage.sync.set({ defaultFormat: copyFormatSelect.value });
  });

  // Options link
  optionsLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  // Load and display history
  await loadHistory();

  // ---------- Helpers ----------
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
  }

  async function addToHistory(url, title, action) {
    const { copyHistory, maxHistoryItems } = await chrome.storage.sync.get(['copyHistory', 'maxHistoryItems']);
    if (!copyHistory) return;

    const result = await chrome.storage.local.get(['urlHistory']);
    let history = result.urlHistory || [];

    const newItem = { url, title, action, timestamp: Date.now() };

    // De-dup by URL, newest first
    history = history.filter(item => item.url !== url);
    history.unshift(newItem);

    const max = maxHistoryItems || 10;
    if (history.length > max) history = history.slice(0, max);

    await chrome.storage.local.set({ urlHistory: history });
    await loadHistory();
  }

  async function loadHistory() {
    const { copyHistory } = await chrome.storage.sync.get(['copyHistory']);
    if (!copyHistory) {
      const section = document.getElementById('historySection');
      if (section) section.style.display = 'none';
      return;
    }

    const result = await chrome.storage.local.get(['urlHistory']);
    const history = result.urlHistory || [];

    historyList.innerHTML = '';
    if (history.length === 0) {
      historyList.innerHTML = '<div style="font-size: 12px; color: #999; text-align: center; padding: 10px;">No history yet</div>';
      return;
    }

    history.slice(0, 5).forEach(item => {
      const el = document.createElement('div');
      el.className = 'history-item';
      el.innerHTML = `
        <div class="history-title-text">${item.title || 'Untitled'}</div>
        <div class="history-url">${item.url}</div>
      `;
      el.addEventListener('click', async () => {
        if (!item.url) return;
        await copyToClipboard(item.url);
        showNotification('URL copied from history!');
      });
      historyList.appendChild(el);
    });
  }

  function showNotification(message) {
    const n = document.createElement('div');
    n.className = 'notification';
    n.textContent = message;
    document.body.appendChild(n);

    setTimeout(() => n.classList.add('show'), 10);
    setTimeout(() => {
      n.classList.remove('show');
      setTimeout(() => n.remove(), 300);
    }, 2000);
  }

  // ---------- QR: standards-compliant, fully offline ----------
  function generateQRCode(url) {
    qrCodeContainer.innerHTML = '';
    qrUrl.textContent = url || '';

    // Render a compact QR code that definitely fits in the modal
    const cssSize = 150;                   // Much smaller size for guaranteed fit
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const canvas = document.createElement('canvas');
    canvas.width = cssSize * dpr;          // real pixels
    canvas.height = cssSize * dpr;
    canvas.style.width = cssSize + 'px';
    canvas.style.height = cssSize + 'px';

    // Use the vendored soldair qrcode library (lib/qrcode.min.js)
    // Minimum quiet zone: 4 modules; we set margin: 4
    const opts = {
      width: cssSize * dpr,
      margin: 4,
      errorCorrectionLevel: 'M',
      color: { dark: '#000000', light: '#FFFFFF' }
    };

    if (!window.QRCode || !window.QRCode.toCanvas) {
      console.error('QR library not loaded. Ensure lib/qrcode.min.js (soldair) is included before popup.js');
      qrCodeContainer.innerHTML = '<p style="color:red;text-align:center;">QR library missing</p>';
      qrModal.classList.add('show');
      return;
    }

    window.QRCode.toCanvas(canvas, url || '', opts, (err) => {
      if (err) {
        console.error('QR generation failed:', err);
        qrCodeContainer.innerHTML = '<p style="color:red;text-align:center;">Failed to generate QR</p>';
      } else {
        // Keep pixels sharp
        canvas.style.imageRendering = 'pixelated';
        qrCodeContainer.appendChild(canvas);
      }
      qrModal.classList.add('show');
    });
  }

  function closeQRModal() {
    qrModal.classList.remove('show');
  }

  function downloadQRCode() {
    const canvas = qrCodeContainer.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'qr-code.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    showNotification('QR code downloaded!');
  }

  async function copyQRCodeImage() {
    const canvas = qrCodeContainer.querySelector('canvas');
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return showNotification('Failed to copy QR code');
      try {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        showNotification('QR code copied to clipboard!');
      } catch (e) {
        console.error(e);
        showNotification('Failed to copy QR code');
      }
    }, 'image/png');
  }
});
