// Content script for additional functionality
let copyButton = null;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

// Create floating copy button (optional feature)
async function createFloatingCopyButton() {
  if (copyButton) return;

  // Get saved position or use default
  const savedPosition = await chrome.storage.local.get(['buttonPosition']);
  const position = savedPosition.buttonPosition || { top: 80, right: 20 };

  copyButton = document.createElement('div');
  copyButton.innerHTML = '📋';
  copyButton.title = 'Copy URL - Drag to move';
  copyButton.style.cssText = `
    position: fixed;
    top: ${position.top}px;
    right: ${position.right}px;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #4285f4, #34a853);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: move;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
    opacity: 0.8;
    user-select: none;
    touch-action: none;
  `;

  // Add drag functionality
  copyButton.addEventListener('mousedown', startDrag);
  copyButton.addEventListener('touchstart', startDrag, { passive: false });

  copyButton.addEventListener('mouseenter', () => {
    if (!isDragging) {
      copyButton.style.opacity = '1';
      copyButton.style.transform = 'scale(1.1)';
    }
  });

  copyButton.addEventListener('mouseleave', () => {
    if (!isDragging) {
      copyButton.style.opacity = '0.8';
      copyButton.style.transform = 'scale(1)';
    }
  });

  copyButton.addEventListener('click', async (e) => {
    if (!isDragging) {
      await navigator.clipboard.writeText(window.location.href);
      showCopyNotification();
    }
  });

  document.body.appendChild(copyButton);
}

// Start dragging
function startDrag(e) {
  e.preventDefault();
  isDragging = true;
  
  const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
  const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
  
  const rect = copyButton.getBoundingClientRect();
  dragOffset.x = clientX - rect.left;
  dragOffset.y = clientY - rect.top;

  copyButton.style.cursor = 'grabbing';
  copyButton.style.transition = 'none';
  copyButton.style.transform = 'scale(1.1)';
  copyButton.style.opacity = '0.9';
  copyButton.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
  copyButton.style.zIndex = '10001';

  // Add global event listeners
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchmove', drag, { passive: false });
  document.addEventListener('touchend', stopDrag);
}

// Handle dragging
function drag(e) {
  if (!isDragging) return;
  
  e.preventDefault();
  
  const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
  const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
  
  let newX = clientX - dragOffset.x;
  let newY = clientY - dragOffset.y;
  
  // Keep button within viewport bounds
  const buttonWidth = 40;
  const buttonHeight = 40;
  const maxX = window.innerWidth - buttonWidth;
  const maxY = window.innerHeight - buttonHeight;
  
  newX = Math.max(0, Math.min(newX, maxX));
  newY = Math.max(0, Math.min(newY, maxY));
  
  copyButton.style.left = newX + 'px';
  copyButton.style.top = newY + 'px';
  copyButton.style.right = 'auto';
  copyButton.style.bottom = 'auto';
}

// Stop dragging
async function stopDrag() {
  if (!isDragging) return;
  
  isDragging = false;
  
  copyButton.style.cursor = 'move';
  copyButton.style.transition = 'all 0.3s ease';
  copyButton.style.transform = 'scale(1)';
  copyButton.style.opacity = '0.8';
  copyButton.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
  copyButton.style.zIndex = '10000';
  
  // Remove global event listeners
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchmove', drag);
  document.removeEventListener('touchend', stopDrag);
  
  // Save new position
  const rect = copyButton.getBoundingClientRect();
  const position = {
    top: rect.top,
    right: window.innerWidth - rect.right
  };
  
  await chrome.storage.local.set({ buttonPosition: position });
}

// Show copy notification
function showCopyNotification(message = 'URL copied!') {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 60px;
    right: 20px;
    background: #333;
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    z-index: 1000000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.3s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.opacity = '1';
  }, 10);

  // Remove after 2 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 2000);
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'copyUrl') {
    navigator.clipboard.writeText(window.location.href);
    showCopyNotification();
    sendResponse({ success: true });
  } else if (request.action === 'toggleFloatingButton') {
    if (copyButton) {
      copyButton.remove();
      copyButton = null;
      sendResponse({ success: true });
    } else {
      createFloatingCopyButton().then(() => {
        sendResponse({ success: true });
      });
      return true; // Keep message port open for async response
    }
  } else if (request.action === 'resetButtonPosition') {
    if (copyButton) {
      // Reset to default position
      copyButton.style.top = '80px';
      copyButton.style.right = '20px';
      copyButton.style.left = 'auto';
      copyButton.style.bottom = 'auto';
    }
    sendResponse({ success: true });
  }
});

// Check settings and show appropriate buttons
chrome.storage.sync.get(['showFloatingButton'], (result) => {
  if (result.showFloatingButton) {
    createFloatingCopyButton();
  }
});
