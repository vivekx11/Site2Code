# 🧪 Testing Guide for Site2Code

Complete testing checklist to ensure everything works perfectly.

## Pre-Installation Testing

### ✅ File Verification
- [ ] All core files present (manifest.json, popup.html, etc.)
- [ ] Icons folder exists
- [ ] No syntax errors in JavaScript files
- [ ] CSS files properly formatted

## Installation Testing

### ✅ Extension Loading
- [ ] Extension loads without errors
- [ ] Icon appears in Chrome toolbar
- [ ] Popup opens when clicked
- [ ] No console errors in popup

### ✅ Permissions
- [ ] activeTab permission granted
- [ ] storage permission granted
- [ ] scripting permission granted
- [ ] No permission warnings

## Feature Testing

### 1. Element Selection
- [ ] "Select Element" button works
- [ ] Hover highlights elements correctly
- [ ] Tooltip shows element info
- [ ] Click extracts element
- [ ] ESC cancels selection
- [ ] Works on different websites

### 2. Code Extraction
- [ ] HTML tab shows formatted code
- [ ] CSS tab shows styles
- [ ] Tailwind tab shows classes
- [ ] React tab shows component
- [ ] Syntax highlighting works
- [ ] Code is properly formatted

### 3. Full Page Capture
- [ ] "Capture Full Page" button works
- [ ] Entire HTML captured
- [ ] CSS extracted
- [ ] No errors in console
- [ ] Large pages handled

### 4. Copy Functionality
- [ ] Copy buttons work for all tabs
- [ ] Clipboard receives correct content
- [ ] Success message appears
- [ ] Works for all code formats

### 5. Project Structure
- [ ] File explorer displays correctly
- [ ] Shows proper folder structure
- [ ] All files listed
- [ ] Visual hierarchy clear

### 6. Download Feature
- [ ] Download ZIP button works
- [ ] ZIP file downloads
- [ ] ZIP contains all files
- [ ] Files are properly organized
- [ ] Content is correct

### 7. GitHub Integration
- [ ] Token input accepts text
- [ ] Connect button works
- [ ] Invalid token shows error
- [ ] Valid token connects
- [ ] Username displays
- [ ] Disconnect works
- [ ] Repository creation works
- [ ] Code push succeeds
- [ ] Private repos work
- [ ] Success message shows

### 8. Settings
- [ ] All toggles work
- [ ] Settings persist
- [ ] Reset button works
- [ ] Changes apply immediately

### 9. Theme Switching
- [ ] Dark mode displays correctly
- [ ] Light mode displays correctly
- [ ] Toggle button works
- [ ] Theme persists
- [ ] All elements styled properly

### 10. UI/UX
- [ ] Tabs switch correctly
- [ ] Buttons respond to clicks
- [ ] Hover states work
- [ ] Scrolling works
- [ ] Responsive at different sizes
- [ ] No visual glitches

## Browser Compatibility

### Chrome Versions
- [ ] Latest Chrome version
- [ ] Chrome 100+
- [ ] Chrome 90+

### Operating Systems
- [ ] Windows
- [ ] macOS
- [ ] Linux

## Website Testing

Test on various websites:

### Simple Sites
- [ ] https://example.com
- [ ] https://google.com
- [ ] Static HTML pages

### Complex Sites
- [ ] https://github.com
- [ ] https://stackoverflow.com
- [ ] https://reddit.com

### Framework Sites
- [ ] React applications
- [ ] Vue.js applications
- [ ] Angular applications

### Special Cases
- [ ] Sites with iframes
- [ ] Sites with shadow DOM
- [ ] Single page applications
- [ ] Sites with heavy JavaScript

## Edge Cases

### Element Selection
- [ ] Nested elements
- [ ] Overlapping elements
- [ ] Fixed position elements
- [ ] Absolute position elements
- [ ] Hidden elements
- [ ] Very large elements
- [ ] Very small elements

### Code Extraction
- [ ] Elements with no styles
- [ ] Elements with inline styles
- [ ] Elements with !important
- [ ] Elements with pseudo-elements
- [ ] Elements with animations
- [ ] Elements with transforms

### GitHub Integration
- [ ] Repository name conflicts
- [ ] Network errors
- [ ] Invalid tokens
- [ ] Rate limiting
- [ ] Large file uploads

## Performance Testing

### Speed
- [ ] Extension loads quickly
- [ ] Element selection responsive
- [ ] Code extraction fast
- [ ] UI remains responsive
- [ ] No memory leaks

### Resource Usage
- [ ] CPU usage acceptable
- [ ] Memory usage reasonable
- [ ] No excessive network calls

## Security Testing

### Data Privacy
- [ ] No data sent to external servers
- [ ] Tokens stored securely
- [ ] Settings stored locally
- [ ] No tracking or analytics

### Permissions
- [ ] Only necessary permissions requested
- [ ] Permissions used appropriately
- [ ] No permission abuse

## Error Handling

### User Errors
- [ ] Empty GitHub token handled
- [ ] Invalid repository name handled
- [ ] Network failures handled gracefully
- [ ] User-friendly error messages

### System Errors
- [ ] Console errors caught
- [ ] Extension doesn't crash
- [ ] Graceful degradation

## Accessibility

### Keyboard Navigation
- [ ] Tab navigation works
- [ ] Enter key activates buttons
- [ ] ESC cancels operations
- [ ] Focus indicators visible

### Screen Readers
- [ ] Buttons have labels
- [ ] Images have alt text
- [ ] Semantic HTML used

## Documentation Testing

### Accuracy
- [ ] README instructions work
- [ ] Installation guide accurate
- [ ] Quick start guide works
- [ ] All links functional

### Completeness
- [ ] All features documented
- [ ] Troubleshooting covers issues
- [ ] Examples are clear

## Pre-Publishing Checklist

### Code Quality
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] Code properly formatted
- [ ] Variables named clearly

### Assets
- [ ] Icons created (16, 48, 128)
- [ ] Screenshots prepared
- [ ] Promotional images ready

### Documentation
- [ ] README complete
- [ ] Privacy policy published
- [ ] Changelog updated
- [ ] Version number correct

### Legal
- [ ] License included
- [ ] Copyright notices present
- [ ] Third-party licenses acknowledged

## Automated Testing (Future)

Consider adding:
- Unit tests for utility functions
- Integration tests for features
- End-to-end tests with Puppeteer
- Performance benchmarks

## Bug Reporting

When you find a bug:
1. Note the steps to reproduce
2. Check browser console for errors
3. Document expected vs actual behavior
4. Include screenshots if relevant
5. Note browser version and OS

## Testing Tools

Useful tools:
- Chrome DevTools (F12)
- Extension Reloader
- Lighthouse for performance
- axe DevTools for accessibility

## Continuous Testing

After updates:
- [ ] Retest all core features
- [ ] Check for regressions
- [ ] Verify new features work
- [ ] Update documentation

---

**Testing is crucial for quality!**

Take your time and test thoroughly before publishing.
