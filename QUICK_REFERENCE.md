# 🚀 Quick Reference

## Essential Commands

### Load Extension
```
chrome://extensions/ → Developer mode ON → Load unpacked
```

### Reload Extension
```
chrome://extensions/ → Click refresh icon on Site2Code
```

### Open Consoles
```
Popup:      Right-click icon → Inspect popup
Background: chrome://extensions/ → Service worker → Inspect  
Content:    F12 on webpage → Console tab
```

## File Locations

| What | Where |
|------|-------|
| UI | `popup/popup.html` |
| UI Logic | `popup/popup.js` |
| UI Styles | `popup/popup.css` |
| Content Script | `scripts/content.js` |
| Element Selection | `scripts/elementSelector.js` |
| Code Extraction | `scripts/codeExtractor.js` |
| Background | `background/service-worker.js` |
| Overlay Styles | `styles/content.css` |
| Utilities | `utils/helpers.js` |
| Config | `manifest.json` |

## Common Tasks

### Add New Feature
1. Plan implementation
2. Update relevant files
3. Test thoroughly
4. Update docs

### Fix Bug
1. Reproduce issue
2. Check console errors
3. Fix code
4. Test fix
5. Verify no regressions

### Update UI
1. Edit `popup/popup.html`
2. Update `popup/popup.css`
3. Add logic in `popup/popup.js`
4. Test in both themes

### Modify Extraction
1. Edit `scripts/codeExtractor.js`
2. Test on multiple sites
3. Verify all formats work

## Debugging Tips

### Element Selection Not Working
- Refresh webpage
- Check content.js loaded
- Verify CSS injected

### Popup Not Opening
- Check popup.html path
- Verify no JS errors
- Check manifest.json

### GitHub Push Fails
- Verify token valid
- Check network tab
- Verify repo name unique

## Test Sites
- Simple: example.com
- Complex: github.com
- Framework: react apps
- Special: sites with iframes

## Keyboard Shortcuts
- Start Selection: `Ctrl+Shift+E` (Windows) / `Cmd+Shift+E` (Mac)
- Cancel Selection: `ESC`
- Reload Extension: Set custom at chrome://extensions/shortcuts

## NPM Scripts
```bash
npm run dev      # Open dev dashboard
npm run icons    # Generate icons
npm run zip      # Create distribution ZIP
npm run clean    # Remove old ZIPs
```

## Git Workflow
```bash
git checkout -b feature/my-feature
# Make changes
git add .
git commit -m "feat: Add my feature"
git push origin feature/my-feature
```

## Resources
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [GitHub API](https://docs.github.com/en/rest)
