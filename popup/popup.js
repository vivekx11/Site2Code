// ─── State ────────────────────────────────────────────────────────────────────
let extractedData = { html: '', css: '', tailwind: '', react: '', files: {} };
let storageListener = null;

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initializeTabs();
  initializeTheme();
  initializeButtons();
  loadSettings();
  checkGithubConnection();
});

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function initializeTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });

  document.querySelectorAll('.code-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.code-section').forEach(cs => cs.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`${tab.dataset.code}-code`).classList.add('active');
    });
  });
}

// ─── Theme ────────────────────────────────────────────────────────────────────
function initializeTheme() {
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme') || 'dark';
  if (saved === 'light') {
    document.body.setAttribute('data-theme', 'light');
    btn.textContent = '☀️';
  }
  btn.addEventListener('click', () => {
    const next = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', next);
    btn.textContent = next === 'light' ? '☀️' : '🌙';
    localStorage.setItem('theme', next);
  });
}

// ─── Buttons ──────────────────────────────────────────────────────────────────
function initializeButtons() {
  document.getElementById('startSelection').addEventListener('click', startElementSelection);
  document.getElementById('captureFullPage').addEventListener('click', captureFullPage);
  document.getElementById('downloadProject').addEventListener('click', downloadProject);
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => copyCode(btn.dataset.target));
  });
  document.getElementById('connectGithub').addEventListener('click', connectGithub);
  document.getElementById('disconnectGithub').addEventListener('click', disconnectGithub);
  document.getElementById('createRepo').addEventListener('click', createAndPushRepo);
  document.getElementById('resetSettings').addEventListener('click', resetSettings);
}

// ─── Element Selection ────────────────────────────────────────────────────────
async function startElementSelection() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Inject content script (safe to call even if already injected)
  try {
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['scripts/content.js'] });
  } catch (_) { /* already injected */ }

  // Inject overlay CSS
  try {
    await chrome.scripting.insertCSS({ target: { tabId: tab.id }, files: ['styles/content.css'] });
  } catch (_) { /* already injected */ }

  // Ping to confirm content script is alive
  chrome.tabs.sendMessage(tab.id, { action: 'ping' }, (res) => {
    if (chrome.runtime.lastError || !res) {
      showStatus('❌ Could not connect. Please refresh the page and try again.', 'error');
      return;
    }

    // Tell content script to start selection
    chrome.tabs.sendMessage(tab.id, { action: 'startSelection' });

    // Show waiting state
    showStatus('🎯 Click any element on the page…', 'info');

    // Watch storage for result written by content script
    watchForResult();
  });
}

function watchForResult() {
  // Remove any previous listener
  if (storageListener) {
    chrome.storage.onChanged.removeListener(storageListener);
  }

  storageListener = (changes) => {
    if (changes.site2codeResult) {
      extractedData = changes.site2codeResult.newValue;
      displayExtractedCode();
      generateProjectStructure();
      showStatus('✅ Element extracted!', 'success');
      chrome.storage.onChanged.removeListener(storageListener);
      storageListener = null;
    }
  };

  chrome.storage.onChanged.addListener(storageListener);
}

// ─── Full Page Capture ────────────────────────────────────────────────────────
async function captureFullPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  try {
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['scripts/content.js'] });
  } catch (_) { /* already injected */ }

  showStatus('📄 Capturing full page…', 'info');

  chrome.tabs.sendMessage(tab.id, { action: 'captureFullPage' }, (response) => {
    if (chrome.runtime.lastError || !response) {
      showStatus('❌ Could not connect. Please refresh the page and try again.', 'error');
      return;
    }
    if (response.data) {
      extractedData = response.data;
      displayExtractedCode();
      generateProjectStructure();
      showStatus('✅ Full page captured!', 'success');
    }
  });
}

// ─── Display Code ─────────────────────────────────────────────────────────────
function displayExtractedCode() {
  document.getElementById('codePreview').classList.remove('hidden');
  document.getElementById('htmlContent').textContent = extractedData.html || '';
  document.getElementById('cssContent').textContent = extractedData.css || '';
  document.getElementById('tailwindContent').textContent = extractedData.tailwind || '';
  document.getElementById('reactContent').textContent = extractedData.react || '';
}

// ─── Status Banner ────────────────────────────────────────────────────────────
function showStatus(msg, type = 'info') {
  let banner = document.getElementById('statusBanner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'statusBanner';
    banner.style.cssText = 'padding:10px 16px;margin:8px 0;border-radius:6px;font-size:13px;text-align:center;';
    document.querySelector('.action-buttons').after(banner);
  }
  const colors = { info: '#007acc', success: '#4ec9b0', error: '#f44747' };
  banner.style.background = colors[type] || colors.info;
  banner.style.color = '#fff';
  banner.textContent = msg;
  banner.style.display = 'block';
  if (type !== 'info') setTimeout(() => { banner.style.display = 'none'; }, 3000);
}

// ─── Copy ─────────────────────────────────────────────────────────────────────
function copyCode(target) {
  const content = document.getElementById(`${target}Content`).textContent;
  navigator.clipboard.writeText(content).then(() => {
    const btn = document.querySelector(`[data-target="${target}"]`);
    const orig = btn.textContent;
    btn.textContent = '✓ Copied!';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  });
}

// ─── Project Structure ────────────────────────────────────────────────────────
function generateProjectStructure() {
  document.getElementById('fileExplorer').innerHTML = `
    <div class="folder">📁 project</div>
    <div class="file">📄 index.html</div>
    <div class="file">📄 styles.css</div>
    <div class="folder">📁 components</div>
    <div class="file" style="padding-left:40px">📄 Component.jsx</div>
  `;
  extractedData.files = {
    'index.html': extractedData.html,
    'styles.css': extractedData.css,
    'components/Component.jsx': extractedData.react,
    'README.md': `# Extracted by Site2Code\n\nGenerated: ${new Date().toLocaleString()}\n\n## Tailwind Classes\n${extractedData.tailwind}`
  };
}

// ─── Download ─────────────────────────────────────────────────────────────────
function downloadProject() {
  if (!extractedData.html) {
    showStatus('⚠️ Nothing to download yet. Extract an element first.', 'error');
    return;
  }
  Object.entries(extractedData.files).forEach(([path, content]) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
      href: url,
      download: path.replace(/\//g, '_')
    });
    a.click();
    URL.revokeObjectURL(url);
  });
}

// ─── GitHub ───────────────────────────────────────────────────────────────────
async function connectGithub() {
  const token = document.getElementById('githubToken').value.trim();
  if (!token) { alert('Please enter a GitHub token'); return; }

  try {
    const res = await fetch('https://api.github.com/user', {
      headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!res.ok) throw new Error('Invalid token');
    const user = await res.json();
    chrome.storage.local.set({ githubToken: token, githubUsername: user.login }, () => {
      showGithubConnected(user.login);
    });
  } catch {
    alert('Failed to connect. Check your token.');
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
    if (result.githubToken && result.githubUsername) showGithubConnected(result.githubUsername);
  });
}

async function createAndPushRepo() {
  const repoName = document.getElementById('repoName').value.trim();
  if (!repoName) { alert('Please enter a repository name'); return; }

  chrome.storage.local.get(['githubToken', 'githubUsername'], async ({ githubToken: token, githubUsername: username }) => {
    try {
      const res = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: repoName,
          description: document.getElementById('repoDescription').value.trim() || 'Code extracted using Site2Code',
          private: document.getElementById('repoPrivate').checked
        })
      });
      if (!res.ok) throw new Error('Failed to create repository');
      const repo = await res.json();

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

      const statusDiv = document.getElementById('pushStatus');
      statusDiv.classList.remove('hidden');
      statusDiv.innerHTML = `✅ Repo created! <a href="${repo.html_url}" target="_blank" style="color:var(--accent)">View on GitHub →</a>`;
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function loadSettings() {
  chrome.storage.local.get(['includeInlineStyles', 'includeComputedStyles', 'generateTailwind', 'minifyCode'], (result) => {
    document.getElementById('includeInlineStyles').checked = result.includeInlineStyles !== false;
    document.getElementById('includeComputedStyles').checked = result.includeComputedStyles !== false;
    document.getElementById('generateTailwind').checked = result.generateTailwind !== false;
    document.getElementById('minifyCode').checked = result.minifyCode || false;
  });
  ['includeInlineStyles', 'includeComputedStyles', 'generateTailwind', 'minifyCode'].forEach(id => {
    document.getElementById(id).addEventListener('change', e => chrome.storage.local.set({ [id]: e.target.checked }));
  });
}

function resetSettings() {
  const defaults = { includeInlineStyles: true, includeComputedStyles: true, generateTailwind: true, minifyCode: false };
  chrome.storage.local.set(defaults, loadSettings);
}
