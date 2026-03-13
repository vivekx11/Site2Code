# 🎨 Site2Code – Copy Code From Any Website

A powerful Chrome Extension that allows developers to inspect any website and extract its structure and code. Perfect for learning, prototyping, and understanding web design patterns.

## ✨ Features

### 🎯 Element Selection Tool
- Hover over any element on a webpage
- Visual highlighting with element information
- Click to extract code instantly
- Press ESC to cancel selection

### 📝 Code Extraction
Extract multiple formats from any selected element:
- **Clean HTML** - Structured and formatted HTML
- **CSS Styles** - All computed styles applied to the element
- **Tailwind Classes** - Automatically generated Tailwind CSS equivalents
- **React Component** - Ready-to-use React component with JSX

### 📁 Project Structure Generator
Generates a complete project structure:
```
/project
├── index.html
├── styles.css
├── components
│   └── Component.jsx
└── assets
```

### 🌐 Full Website Code Capture
- Capture entire page HTML
- Extract all linked CSS files
- Identify JavaScript files
- List all assets and images

### 🚀 GitHub Repository Integration
- Connect your GitHub account securely
- Create new repositories directly from the extension
- Automatically push extracted code
- Support for private repositories
- Preview files before pushing

### 🎨 Modern UI/UX
- Dark mode and light mode support
- VS Code-style file explorer
- Syntax highlighting with Prism.js
- One-click copy to clipboard
- Clean, developer-friendly interface

### 💾 Download Options
- Download complete project as ZIP file
- Copy individual code sections to clipboard
- Organized file structure ready for development

## 🛠️ Tech Stack

- **Manifest V3** - Latest Chrome Extension standard
- **Vanilla JavaScript** - No framework dependencies
- **Prism.js** - Syntax highlighting
- **JSZip** - ZIP file generation
- **GitHub API** - Repository integration
- **Modern CSS** - Custom properties and flexbox

## 📦 Installation

### Install Locally (Development)

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/yourusername/site2code.git
   cd site2code
   ```

2. **Open Chrome Extensions page**
   - Navigate to `chrome://extensions/`
   - Or click Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right

4. **Load the extension**
   - Click "Load unpacked"
   - Select the `extension` folder from this repository

5. **Pin the extension**
   - Click the puzzle icon in Chrome toolbar
   - Pin Site2Code for easy access

### Create Extension Icons

Before loading the extension, you need to create icons. You can:

1. **Use an online tool** like [favicon.io](https://favicon.io/) to generate icons
2. **Create manually** using any image editor
3. **Use the provided template** (if included)

Required icon sizes:
- 16x16 pixels (icon16.png)
- 48x48 pixels (icon48.png)
- 128x128 pixels (icon128.png)

Place all icons in the `icons/` folder.

## 🚀 Usage

### Extract Element Code

1. Click the Site2Code extension icon
2. Click "Select Element" button
3. Hover over any element on the webpage
4. Click the element you want to extract
5. View extracted HTML, CSS, Tailwind, and React code
6. Copy or download the code

### Capture Full Page

1. Open the extension popup
2. Click "Capture Full Page"
3. View complete page structure
4. Download as project or push to GitHub

### GitHub Integration

1. Go to the "GitHub" tab
2. Generate a Personal Access Token:
   - Visit [GitHub Token Settings](https://github.com/settings/tokens/new)
   - Select `repo` scope
   - Generate and copy the token
3. Paste token and click "Connect"
4. Enter repository details
5. Click "Create & Push" to upload your code

### Settings

Customize extraction behavior:
- Include inline styles
- Include computed styles
- Generate Tailwind classes
- Minify extracted code

## 📝 Publishing to Chrome Web Store

### Prerequisites

1. **Google Developer Account**
   - Visit [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Pay one-time $5 registration fee

2. **Prepare Extension Package**
   ```bash
   # Create a ZIP file of the extension folder
   zip -r site2code.zip extension/
   ```

### Publishing Steps

1. **Login to Developer Dashboard**
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)

2. **Create New Item**
   - Click "New Item"
   - Upload your ZIP file

3. **Fill Store Listing**
   - **Detailed Description**: Explain all features
   - **Category**: Developer Tools
   - **Language**: English (or your preferred language)
   - **Screenshots**: Provide 1280x800 or 640x400 screenshots
   - **Promotional Images**: 
     - Small tile: 440x280
     - Large tile: 920x680 (optional)
   - **Icon**: 128x128 PNG

4. **Privacy Practices**
   - Declare data usage
   - Add privacy policy URL (if collecting data)
   - Explain GitHub token usage

5. **Submit for Review**
   - Review all information
   - Click "Submit for Review"
   - Wait for approval (typically 1-3 days)

### Store Listing Template

**Short Description:**
```
Extract HTML, CSS, and React code from any website. Generate Tailwind classes and push to GitHub instantly.
```

**Detailed Description:**
```
Site2Code is a powerful developer tool that lets you extract code from any website with just a few clicks.

KEY FEATURES:
• Select any element and extract its HTML, CSS, and React component
• Automatically generate Tailwind CSS classes
• Capture full page code including all styles
• Create GitHub repositories and push code directly
• Download projects as ZIP files
• Dark mode and light mode support
• Syntax highlighting for better readability

PERFECT FOR:
• Learning web development
• Prototyping new projects
• Understanding design patterns
• Extracting components for reuse
• Educational purposes

PRIVACY:
Site2Code only accesses the current tab when you activate it. GitHub tokens are stored locally and never sent to external servers except GitHub API.
```

## 🔒 Privacy & Security

- **Local Storage**: All settings and tokens stored locally
- **No External Servers**: Code extraction happens entirely in your browser
- **GitHub Token**: Only used for GitHub API calls, never shared
- **Permissions**: Only requests necessary permissions for functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

- Cross-origin stylesheets cannot be fully extracted due to browser security
- Some dynamically loaded content may not be captured
- Complex JavaScript interactions are not preserved

## 🔮 Future Enhancements

- [ ] Vue.js component generation
- [ ] Angular component generation
- [ ] Svelte component generation
- [ ] CSS-in-JS extraction
- [ ] TypeScript support
- [ ] Multiple element selection
- [ ] Component library export
- [ ] Figma integration
- [ ] AI-powered code optimization

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: support@site2code.dev
- Twitter: @site2code

## 🙏 Acknowledgments

- Prism.js for syntax highlighting
- JSZip for ZIP generation
- GitHub API for repository integration
- Chrome Extensions documentation

---

Made with ❤️ by developers, for developers

**Star this repo if you find it useful!** ⭐
