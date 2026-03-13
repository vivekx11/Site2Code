# 📦 Installation Guide - Site2Code

## Quick Start (5 minutes)

### Step 1: Download the Extension

Clone or download this repository:
```bash
git clone https://github.com/yourusername/site2code.git
cd site2code
```

Or download as ZIP and extract it.

### Step 2: Create Extension Icons

You need three icon sizes. Choose one method:

#### Method A: Use Online Generator (Easiest)
1. Visit [favicon.io](https://favicon.io/favicon-generator/)
2. Create an icon with text "S2C" or upload your design
3. Download the generated icons
4. Rename and copy to `icons/` folder:
   - `favicon-16x16.png` → `icon16.png`
   - `favicon-32x32.png` → `icon48.png` (resize to 48x48)
   - `android-chrome-192x192.png` → `icon128.png` (resize to 128x128)

#### Method B: Use Image Editor
1. Create three PNG images:
   - 16x16 pixels → `icons/icon16.png`
   - 48x48 pixels → `icons/icon48.png`
   - 128x128 pixels → `icons/icon128.png`
2. Use any design (logo, text, or simple shape)
3. Save with transparent background

#### Method C: Quick Placeholder (For Testing)
Create simple colored squares using any image editor or online tool.

### Step 3: Load Extension in Chrome

1. **Open Chrome Extensions Page**
   - Type `chrome://extensions/` in address bar
   - OR: Menu (⋮) → More Tools → Extensions

2. **Enable Developer Mode**
   - Look for toggle switch in top-right corner
   - Turn it ON

3. **Load Unpacked Extension**
   - Click "Load unpacked" button
   - Navigate to the extension folder
   - Select the folder and click "Select Folder"

4. **Verify Installation**
   - You should see "Site2Code" in your extensions list
   - Status should show "Enabled"

5. **Pin to Toolbar** (Optional but Recommended)
   - Click the puzzle icon (🧩) in Chrome toolbar
   - Find "Site2Code" in the list
   - Click the pin icon to keep it visible

### Step 4: Test the Extension

1. Visit any website (e.g., https://example.com)
2. Click the Site2Code icon in toolbar
3. Click "Select Element" button
4. Hover over elements and click one
5. View extracted code!

## Troubleshooting

### Extension Not Loading

**Error: "Manifest file is missing or unreadable"**
- Solution: Make sure you selected the correct folder containing `manifest.json`

**Error: "Required value 'icons' is missing"**
- Solution: Create the icon files in the `icons/` folder

**Error: "Could not load icon"**
- Solution: Verify icon files exist and are valid PNG images

### Extension Loaded But Not Working

**Popup doesn't open**
- Solution: Right-click extension icon → Inspect popup → Check console for errors

**Element selection not working**
- Solution: Refresh the webpage after installing the extension
- Content scripts only inject on page load

**GitHub integration fails**
- Solution: Verify your token has `repo` scope permissions

### Permission Issues

**"This extension may not work properly"**
- Solution: This is normal for unpacked extensions in development mode

**"Extension requires additional permissions"**
- Solution: Click "Allow" when prompted

## Advanced Configuration

### Custom Keyboard Shortcuts

1. Go to `chrome://extensions/shortcuts`
2. Find "Site2Code"
3. Set custom keyboard shortcut for "Start Selection"
4. Example: `Ctrl+Shift+E` or `Cmd+Shift+E` (Mac)

### Storage Management

Clear extension data:
1. Right-click extension icon
2. Select "Manage Extension"
3. Scroll to "Site data"
4. Click "Remove"

### Update Extension

After making code changes:
1. Go to `chrome://extensions/`
2. Find Site2Code
3. Click refresh icon (🔄)
4. Reload any open tabs

## Development Setup

### Prerequisites
- Google Chrome (latest version)
- Text editor (VS Code recommended)
- Basic knowledge of JavaScript

### File Structure
```
site2code/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic
├── content.js            # Page interaction script
├── background.js         # Background service worker
├── styles.css            # Popup styles
├── content.css           # Page overlay styles
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # Documentation
```

### Enable Console Logging

For debugging, open:
- **Popup console**: Right-click extension icon → Inspect popup
- **Background console**: chrome://extensions/ → Site2Code → Service worker → Inspect
- **Content script console**: F12 on any webpage → Console tab

### Hot Reload (Optional)

Install an extension reloader for faster development:
1. Install "Extensions Reloader" from Chrome Web Store
2. Click its icon to reload all unpacked extensions
3. Saves time during development

## Next Steps

✅ Extension installed successfully!

Now you can:
1. **Extract code** from any website
2. **Generate React components** automatically
3. **Push to GitHub** with one click
4. **Download projects** as ZIP files

### Learn More
- Read the [README.md](README.md) for full feature list
- Check [PUBLISHING.md](PUBLISHING.md) for Chrome Web Store submission
- Visit [GitHub Issues](https://github.com/yourusername/site2code/issues) for support

## Uninstallation

To remove the extension:
1. Go to `chrome://extensions/`
2. Find "Site2Code"
3. Click "Remove"
4. Confirm removal

Your extracted code and settings will be deleted.

---

Need help? Open an issue on GitHub or contact support@site2code.dev
