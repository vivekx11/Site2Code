# 🎯 Features Documentation

Complete guide to all Site2Code features.

## 🎨 Element Selection

### How It Works
1. Click "Select Element" button
2. Hover over any element on the page
3. See real-time highlighting and element info
4. Click to extract code
5. Press ESC to cancel

### What Gets Extracted
- Complete HTML structure
- All CSS styles (computed and inline)
- Tailwind CSS equivalents
- React component version

### Tips
- Select parent elements for complete sections
- Use on responsive designs to see media queries
- Extract navigation bars, cards, forms, etc.

## 📄 Full Page Capture

### What It Captures
- Complete HTML document
- All inline and external CSS
- JavaScript file references
- Meta tags and head content
- Body structure

### Use Cases
- Learning from complete page layouts
- Understanding site architecture
- Creating templates
- Studying responsive designs

### Limitations
- Cross-origin stylesheets may be limited
- Dynamic content may not be captured
- JavaScript functionality not preserved

## 💻 Code Formats

### HTML
- Clean, formatted structure
- Removed event handlers
- Preserved class names and IDs
- Indented for readability

### CSS
- Computed styles from browser
- Important properties extracted
- Organized by selector
- Includes pseudo-elements

### Tailwind CSS
- Automatically generated utility classes
- Common patterns recognized:
  - Flexbox layouts
  - Grid systems
  - Spacing (padding, margin)
  - Colors and backgrounds
  - Typography
  - Borders and shadows

### React Component
- JSX syntax
- className instead of class
- Inline styles converted to objects
- Export statement included
- Ready to import and use

## 📁 Project Structure

### Generated Files
```
project/
├── index.html          # Main HTML file
├── styles.css          # Extracted CSS
├── components/
│   └── Component.jsx   # React component
└── README.md           # Project documentation
```

### File Contents
- **index.html**: Standalone HTML with structure
- **styles.css**: All extracted styles
- **Component.jsx**: React component with imports
- **README.md**: Usage instructions and metadata

## 🚀 GitHub Integration

### Setup
1. Generate Personal Access Token:
   - Go to https://github.com/settings/tokens/new
   - Select `repo` scope
   - Generate and copy token

2. Connect in Extension:
   - Go to GitHub tab
   - Paste token
   - Click Connect

### Creating Repositories
1. Enter repository name
2. Add description (optional)
3. Choose public or private
4. Click "Create & Push"

### What Gets Pushed
- All extracted files
- Project structure
- README with metadata
- Timestamp and source URL

### Security
- Tokens stored locally only
- Never sent to external servers
- Can disconnect anytime
- Revoke tokens on GitHub

## ⚙️ Settings

### Include Inline Styles
- **On**: Extracts style attributes
- **Off**: Only external/computed styles
- **Use**: When you want clean HTML

### Include Computed Styles
- **On**: All browser-computed styles
- **Off**: Only explicitly set styles
- **Use**: For complete style replication

### Generate Tailwind Classes
- **On**: Creates Tailwind equivalents
- **Off**: Skip Tailwind generation
- **Use**: When using Tailwind in projects

### Minify Code
- **On**: Removes whitespace and formatting
- **Off**: Keeps readable formatting
- **Use**: For production-ready code

## 🎨 Themes

### Dark Mode (Default)
- Easy on eyes
- Professional look
- Better for long sessions

### Light Mode
- High contrast
- Better in bright environments
- Personal preference

### Switching
- Click moon/sun icon in header
- Preference saved automatically
- Applies to all tabs

## 📋 Copy & Download

### Copy to Clipboard
- Click copy button on any code section
- Instant clipboard copy
- Visual confirmation
- Works for all formats

### Download as ZIP
- Includes all files
- Organized structure
- Ready to extract and use
- Named with timestamp

### File Organization
- Logical folder structure
- Separated concerns
- Easy to navigate
- Ready for version control

## 🔍 Advanced Usage

### Extracting Components
1. Identify reusable sections
2. Select parent container
3. Extract React component
4. Customize props as needed

### Building Component Libraries
1. Extract multiple components
2. Organize by category
3. Create consistent naming
4. Document usage

### Learning from Sites
1. Find interesting designs
2. Extract and study code
3. Understand techniques
4. Apply to your projects

### Rapid Prototyping
1. Extract design patterns
2. Modify for your needs
3. Combine multiple extractions
4. Build quickly

## 🎯 Best Practices

### When to Use Element Selection
- Extracting specific components
- Learning CSS techniques
- Copying design patterns
- Building component libraries

### When to Use Full Page
- Understanding site structure
- Studying layouts
- Creating templates
- Learning architecture

### Code Quality
- Review extracted code
- Remove unnecessary styles
- Optimize for your use case
- Add semantic HTML

### GitHub Integration
- Use descriptive repo names
- Add meaningful descriptions
- Review before pushing
- Keep tokens secure

## 🚫 Limitations

### Technical Constraints
- Cross-origin resources limited
- Dynamic content may not capture
- JavaScript functionality not preserved
- Some CSS may be browser-specific

### Legal Considerations
- Respect copyright
- Use for learning/reference
- Don't copy entire sites
- Give credit when appropriate

### Browser Limitations
- Chrome only (for now)
- Requires active tab permission
- Some sites may block extraction
- Performance varies by page size

## 🔮 Coming Soon

### Planned Features
- Vue.js component generation
- Angular component generation
- Svelte component generation
- TypeScript support
- Multiple element selection
- Custom templates
- Export to CodePen
- Figma integration

### Requested Features
- Safari extension
- Firefox extension
- Edge-specific features
- Mobile support
- Batch extraction
- AI optimization

---

Have a feature request? Open an issue on GitHub!
