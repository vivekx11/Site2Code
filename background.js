// Background service worker for Site2Code extension

// Installation handler
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Site2Code extension installed');
    
    // Set default settings
    chrome.storage.local.set({
      includeInlineStyles: true,
      includeComputedStyles: true,
      generateTailwind: true,
      minifyCode: false,
      theme: 'dark'
    });
    
    // Open welcome page
    chrome.tabs.create({
      url: 'https://github.com/yourusername/site2code'
    });
  } else if (details.reason === 'update') {
    console.log('Site2Code extension updated');
  }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'elementSelected') {
    // Forward to popup if open
    chrome.runtime.sendMessage(message);
  }
  
  if (message.action === 'captureFullPage') {
    // Handle full page capture
    handleFullPageCapture(sender.tab.id);
  }
  
  return true;
});

// Handle full page capture
async function handleFullPageCapture(tabId) {
  try {
    const result = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: capturePageContent
    });
    
    if (result && result[0]) {
      chrome.runtime.sendMessage({
        action: 'fullPageCaptured',
        data: result[0].result
      });
    }
  } catch (error) {
    console.error('Failed to capture page:', error);
  }
}

// Function to inject into page for capturing content
function capturePageContent() {
  return {
    html: document.documentElement.outerHTML,
    title: document.title,
    url: window.location.href
  };
}

// Context menu integration (optional)
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'site2code-extract',
    title: 'Extract with Site2Code',
    contexts: ['all']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'site2code-extract') {
    chrome.tabs.sendMessage(tab.id, { action: 'startSelection' });
  }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'start-selection') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'startSelection' });
      }
    });
  }
});

// Storage change listener
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(`Storage key "${key}" changed from "${oldValue}" to "${newValue}"`);
  }
});

// Keep service worker alive
let keepAliveInterval;

function keepAlive() {
  keepAliveInterval = setInterval(() => {
    chrome.runtime.getPlatformInfo(() => {
      // Just to keep the service worker alive
    });
  }, 20000);
}

keepAlive();

// Clean up on suspend
chrome.runtime.onSuspend.addListener(() => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
  }
});
