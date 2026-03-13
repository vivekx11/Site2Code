// State management
let extractedData = {
  html: '',
  css: '',
  tailwind: '',
  react: '',
  files: {}
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeTabs();
  initializeTheme();
  initializeButtons();
  loadSettings();
  checkGithubConnection();
});

// Tab management
function initializeTabs() {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(targetTab).classList.add('active');
    });
  });

  // Code tabs
  const codeTabs = document.querySelectorAll('.code-tab');
  codeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetCode = tab.dataset.code;
      
      codeTabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.code-section').forEach(cs => cs.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(`${targetCode}-code`).classList.add('active');
    });
  });
}

// Theme management
function initializeTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  
  if (savedTheme === 'light') {
    document.body.setAttribute('data-theme', 'light');
    themeToggle.textContent = '☀️';
  }
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'light' ? '☀️' : '🌙';
    localStorage.setItem('theme', newTheme);
  });
}

// Button handlers
function initializeButtons() {
  document.getElementById('startSelection').addEventListener('click', startElementSelection);
  document.getElementById('captureFullPage').addEventListener('click', captureFullPage);
  document.getElementById('downloadProject').addEventListener('click', downloadProject);
  
  // Copy buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => copyCode(btn.dataset.target));
  });

  // GitHub buttons
  document.getElementById('connectGithub').addEventListener('click', connectGithub);
  document.getElementById('disconnectGithub').addEventListener('click', disconnectGithub);
  document.getElementById('createRepo').addEventListener('click', createAndPushRepo);
  
  // Settings
  document.getElementById('resetSettings').addEventListener('click', resetSettings);
}

// Element selection
async function startElementSelection() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, { action: 'startSelection' }, (response) => {
    if (response && response.success) {
      // Listen for element selection
      chrome.runtime.onMessage.addListener(handleElementSelected);
    }
  });
}

function handleElementSelected(message, sender, sendResponse) {
  if (message.action === 'elementSelected') {
    extractedData = message.data;
    displayExtractedCode();
    generateProjectStructure();
  }
}

// Display extracted code
function displayExtractedCode() {
  document.getElementById('codePreview').classList.remove('hidden');
  
  document.getElementById('htmlContent').textContent = extractedData.html;
  document.getElementById('cssContent').textContent = extractedData.css;
  document.getElementById('tailwindContent').textContent = extractedData.tailwind;
  document.getElementById('reactContent').textContent = extractedData.react;
  
  // Simple syntax highlighting with CSS
  highlightCode();
}

// Capture full page
async function captureFullPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, { action: 'captureFullPage' }, (response) => {
    if (response && response.data) {
      extractedData = response.data;
      displayExtractedCode();
      generateProjectStructure();
    }
  });
}

// Copy code to clipboard
function copyCode(target) {
  const content = document.getElementById(`${target}Content`).textContent;
  
  navigator.clipboard.writeText(content).then(() => {
    const btn = document.querySelector(`[data-target="${target}"]`);
    const originalText = btn.textContent;
    btn.textContent = '✓ Copied!';
    
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  });
}

// Generate project structure
function generateProjectStructure() {
  const structure = `
    <div class="folder">📁 project</div>
    <div class="file">📄 index.html</div>
    <div class="file">📄 styles.css</div>
    <div class="folder">📁 components</div>
    <div class="file" style="padding-left: 40px;">📄 Component.jsx</div>
    <div class="folder">📁 assets</div>
    <div class="file" style="padding-left: 40px;">📄 (extracted images)</div>
  `;
  
  document.getElementById('fileExplorer').innerHTML = structure;
  
  // Prepare files for download
  extractedData.files = {
    'index.html': extractedData.html,
    'styles.css': extractedData.css,
    'components/Component.jsx': extractedData.react,
    'README.md': generateReadme()
  };
}

// Generate README
function generateReadme() {
  return `# Extracted Website Code

Generated by Site2Code Chrome Extension

## Files Included
- index.html - Main HTML structure
- styles.css - Extracted CSS styles
- components/Component.jsx - React component version

## Usage
1. Open index.html in a browser to view the extracted element
2. Import Component.jsx in your React project
3. Customize styles in styles.css as needed

## Tailwind Classes
${extractedData.tailwind}

---
Generated on ${new Date().toLocaleString()}
`;
}

// Download project as ZIP (simplified - downloads individual files)
async function downloadProject() {
  // For now, download files individually
  // A proper ZIP would require a library, but we can't use CDN due to CSP
  
  alert('Downloading files individually. Check your downloads folder.');
  
  Object.entries(extractedData.files).forEach(([path, content]) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = path.replace(/\//g, '_'); // Replace slashes with underscores
    a.click();
    
    URL.revokeObjectURL(url);
  });
}

// GitHub integration
async function connectGithub() {
  const token = document.getElementById('githubToken').value.trim();
  
  if (!token) {
    alert('Please enter a GitHub token');
    return;
  }
  
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (response.ok) {
      const user = await response.json();
      
      chrome.storage.local.set({
        githubToken: token,
        githubUsername: user.login
      }, () => {
        showGithubConnected(user.login);
      });
    } else {
      alert('Invalid GitHub token');
    }
  } catch (error) {
    alert('Failed to connect to GitHub');
  }
}

function showGithubConnected(username) {
  document.getElementById('githubLogin').classList.add('hidden');
  document.getElementById('githubConnected').classList.remove('hidden');
  document.getElementById('githubUsername').textContent = `Connected as ${username}`;
}

function disconnectGithub() {
  chrome.storage.local.remove(['githubToken', 'githubUsername'], () => {
    document.getElementById('githubLogin').classList.remove('hidden');
    document.getElementById('githubConnected').classList.add('hidden');
    document.getElementById('githubToken').value = '';
  });
}

function checkGithubConnection() {
  chrome.storage.local.get(['githubToken', 'githubUsername'], (result) => {
    if (result.githubToken && result.githubUsername) {
      showGithubConnected(result.githubUsername);
    }
  });
}

async function createAndPushRepo() {
  const repoName = document.getElementById('repoName').value.trim();
  const repoDescription = document.getElementById('repoDescription').value.trim();
  const isPrivate = document.getElementById('repoPrivate').checked;
  
  if (!repoName) {
    alert('Please enter a repository name');
    return;
  }
  
  chrome.storage.local.get(['githubToken', 'githubUsername'], async (result) => {
    const token = result.githubToken;
    const username = result.githubUsername;
    
    try {
      // Create repository
      const createRepoResponse = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: repoName,
          description: repoDescription || 'Code extracted using Site2Code',
          private: isPrivate
        })
      });
      
      if (!createRepoResponse.ok) {
        throw new Error('Failed to create repository');
      }
      
      const repo = await createRepoResponse.json();
      
      // Push files
      await pushFilesToRepo(token, username, repoName);
      
      // Show success
      const statusDiv = document.getElementById('pushStatus');
      statusDiv.classList.remove('hidden');
      statusDiv.innerHTML = `
        ✅ Successfully created repository!<br>
        <a href="${repo.html_url}" target="_blank" style="color: var(--accent);">View on GitHub</a>
      `;
    } catch (error) {
      alert('Failed to create repository: ' + error.message);
    }
  });
}

async function pushFilesToRepo(token, username, repoName) {
  // Push each file to the repository
  for (const [path, content] of Object.entries(extractedData.files)) {
    await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Add ${path}`,
        content: btoa(unescape(encodeURIComponent(content)))
      })
    });
  }
}

// Settings
function loadSettings() {
  chrome.storage.local.get([
    'includeInlineStyles',
    'includeComputedStyles',
    'generateTailwind',
    'minifyCode'
  ], (result) => {
    document.getElementById('includeInlineStyles').checked = result.includeInlineStyles !== false;
    document.getElementById('includeComputedStyles').checked = result.includeComputedStyles !== false;
    document.getElementById('generateTailwind').checked = result.generateTailwind !== false;
    document.getElementById('minifyCode').checked = result.minifyCode || false;
  });
  
  // Save on change
  ['includeInlineStyles', 'includeComputedStyles', 'generateTailwind', 'minifyCode'].forEach(id => {
    document.getElementById(id).addEventListener('change', (e) => {
      chrome.storage.local.set({ [id]: e.target.checked });
    });
  });
}

function resetSettings() {
  const defaults = {
    includeInlineStyles: true,
    includeComputedStyles: true,
    generateTailwind: true,
    minifyCode: false
  };
  
  chrome.storage.local.set(defaults, () => {
    loadSettings();
  });
}


// Simple syntax highlighting function (replaces Prism.js)
function highlightCode() {
  // Basic highlighting is handled by CSS
  // Code is already displayed in <code> tags with proper classes
  // The CSS will handle the styling
}
