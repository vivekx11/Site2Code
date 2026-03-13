# 🛠️ Development Guide..

## Development Environment Setup

### Prerequisites
- Google Chrome (latest version)
- Text editor (VS Code recommended)
- Basic knowledge of JavaScript, HTML, CSS

### Project Structure

```
site2code/
├── popup/                    # Extension popup UI
│   ├── popup.html           # Main UI structure
│   ├── popup.js             # UI logic
│   └── popup.css            # Popup styles
├── scripts/                  # Content scripts
│   ├── content.js           # Main content script
│   ├── elementSelector.js   # Element selection logic
│   └── codeExtractor.js     # Code extraction logic
├── styles/                   # Stylesheets
│   └── content.css          # Page overlay styles
├── utils/                    # Utility functions
│   ├── helpers.js           # Helper functions
│   └── constants.js         # Constants
├── icons/                    # Extension icons
├── background.js             # Service worker
└── manifest.json            # Extension config
```

## Development Workflow

### 1. Initial Setup

```bash
# Generate icons first
open create-icons.html

# Load extension in Chrome
# 1. Go to chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select this folder
```

### 2. Making Changes

**Edit Files:**
- Modify any file in your editor
- Save changes

**Reload Extension:**
- Go to `chrome://extensions/`
- Click refresh icon (🔄) on Site2Code
- Or use Extensions Reloader extension

**Test Changes:**
- Open/refresh test webpage
- Click extension icon
- Test your changes

### 3. Debugging

**Popup Console:**
```
Right-click extension icon → Inspect popup
```

**Background Console:**
```
chrome://extensions/ → Site2Code → Service worker → Inspect
```

**Content Script Console:**
```
F12 on any webpage → Console tab
```

## Development Tips

### Hot Reload
Install "Extensions Reloader" from Chrome Web Store for one-click reload.

### Console Logging
```javascript
// Popup/Background
console.log('Debug:', data);

// Content Script
console.log('[Site2Code]', data);
```

### Testing on Multiple Sites
Create a test list:
- Simple: example.com
- Complex: github.com, stackoverflow.com
- Framework: React/Vue/Angular sites

### File Organization
- Keep popup logic in `popup/`
- Keep content scripts in `scripts/`
- Keep utilities in `utils/`
- Keep styles separate

## Common Development Tasks

### Adding a New Feature

1. **Plan the feature**
   - What does it do?
   - Where does it fit?
   - What files need changes?

2. **Update manifest.json** (if needed)
   - Add permissions
   - Add new scripts

3. **Implement the feature**
   - Write code
   - Add error handling
   - Test thoroughly

4. **Update UI** (if needed)
   - Add buttons/controls
   - Update styles
   - Add event listeners

5. **Test**
   - Test on multiple sites
   - Check console for errors
   - Verify all edge cases

6. **Document**
   - Update README.md
   - Add to CHANGELOG.md
   - Update FEATURES.md

### Adding a New Code Format (e.g., Vue)

**1. Update codeExtractor.js:**
```javascript
function generateVueComponent(element, html) {
  // Vue component generation logic
  return vueCode;
}

// Add to extraction
function extractElementData(element) {
  return {
    html: getCleanHTML(element),
    css: extractCSS(element),
    tailwind: generateTailwindClasses(element),
    react: generateReactComponent(element),
    vue: generateVueComponent(element) // NEW
  };
}
```

**2. Update popup.html:**
```html
<button class="code-tab" data-code="vue">Vue</button>

<div class="code-section" id="vue-code">
  <div class="code-header">
    <span>Vue Component</span>
    <button class="copy-btn" data-target="vue">📋 Copy</button>
  </div>
  <pre><code class="language-vue" id="vueContent"></code></pre>
</div>
```

**3. Update popup.js:**
```javascript
function displayExtractedCode() {
  // ... existing code ...
  document.getElementById('vueContent').textContent = extractedData.vue;
  Prism.highlightAll();
}
```

### Modifying Extraction Logic

**Location:** `scripts/codeExtractor.js`

**Common modifications:**
- Add more CSS properties
- Improve Tailwind mapping
- Better HTML formatting
- Enhanced React conversion

### Updating UI Styles

**Popup styles:** `popup/popup.css`
**Content overlay:** `styles/content.css`

**CSS Variables:**
```css
:root {
  --accent: #007acc;        /* Change primary color */
  --bg-primary: #1e1e1e;    /* Change background */
}
```

## Testing Checklist

Before committing changes:

- [ ] Extension loads without errors
- [ ] All features work as expected
- [ ] No console errors
- [ ] Tested on 3+ different websites
- [ ] UI looks good in both themes
- [ ] Code is properly formatted
- [ ] Comments added for complex logic
- [ ] Documentation updated

## Performance Optimization

### Best Practices
- Minimize DOM queries
- Cache computed styles
- Debounce mouse events
- Lazy load heavy operations
- Clean up event listeners

### Memory Management
```javascript
// Good: Clean up
function stopSelection() {
  document.removeEventListener('mousemove', handleMouseMove);
  highlightBox?.remove();
  tooltip?.remove();
}
```

## Security Considerations

### Content Security Policy
- No inline scripts in HTML
- No eval() or Function()
- Sanitize user input
- Validate GitHub tokens

### Data Privacy
- Store tokens securely
- No external API calls (except GitHub)
- Clear sensitive data on disconnect

## Git Workflow

### Branching
```bash
# Create feature branch
git checkout -b feature/vue-support

# Make changes and commit
git add .
git commit -m "Add Vue component generation"

# Push and create PR
git push origin feature/vue-support
```

### Commit Messages
```
feat: Add Vue component generation
fix: Resolve element selection on fixed elements
docs: Update installation guide
style: Format code with prettier
refactor: Simplify CSS extraction logic
test: Add tests for code extraction
```

## Troubleshooting Development Issues

### Extension Won't Reload
- Check for syntax errors
- Verify manifest.json is valid
- Clear Chrome cache
- Restart Chrome

### Content Script Not Injecting
- Check manifest.json matches
- Verify run_at timing
- Refresh the webpage
- Check console for errors

### Popup Not Opening
- Check popup.html path in manifest
- Verify no JavaScript errors
- Check popup console

### GitHub API Fails
- Verify token is valid
- Check network tab
- Verify API endpoint
- Check rate limits

## Advanced Development

### Adding TypeScript
```bash
npm install --save-dev typescript
# Create tsconfig.json
# Convert .js to .ts
# Add build script
```

### Adding Tests
```bash
npm install --save-dev jest
# Create __tests__ folder
# Write unit tests
# Add test script
```

### Build Process
```bash
npm install --save-dev webpack
# Create webpack.config.js
# Add build scripts
# Optimize for production
```

## Resources

### Chrome Extension Docs
- [Getting Started](https://developer.chrome.com/docs/extensions/mv3/getstarted/)
- [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Content Scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)
- [Message Passing](https://developer.chrome.com/docs/extensions/mv3/messaging/)

### APIs Used
- [chrome.tabs](https://developer.chrome.com/docs/extensions/reference/tabs/)
- [chrome.storage](https://developer.chrome.com/docs/extensions/reference/storage/)
- [chrome.scripting](https://developer.chrome.com/docs/extensions/reference/scripting/)
- [GitHub API](https://docs.github.com/en/rest)

### Tools
- [Prism.js](https://prismjs.com/)
- [JSZip](https://stuk.github.io/jszip/)
- [Extensions Reloader](https://chrome.google.com/webstore/detail/extensions-reloader/)

## Getting Help

- Check existing documentation
- Search GitHub issues
- Ask in discussions
- Email: support@site2code.dev

---

Happy developing! 🚀
