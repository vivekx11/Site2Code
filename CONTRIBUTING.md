# Contributing to Site2Code

First off, thank you for considering contributing to Site2Code! It's people like you that make Site2Code such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your Chrome version and OS**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any similar features in other tools**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code, add tests if applicable
3. Ensure your code follows the existing style
4. Update documentation as needed
5. Write a clear commit message

## Development Process

### Setup Development Environment

```bash
# Clone your fork
git clone https://github.com/yourusername/site2code.git
cd site2code

# Create a new branch
git checkout -b feature/my-new-feature
```

### Making Changes

1. Make your changes in your feature branch
2. Test thoroughly in Chrome
3. Update documentation if needed
4. Commit with clear messages

### Testing

Before submitting:
- Test on multiple websites
- Test all features (extract, GitHub, download)
- Check console for errors
- Test in both light and dark mode
- Verify on different screen sizes

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful variable names

### Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests

Example:
```
Add Vue.js component generation

- Implement Vue component converter
- Add Vue syntax highlighting
- Update UI to include Vue tab

Closes #123
```

## Project Structure

```
site2code/
├── manifest.json          # Extension configuration
├── popup.html            # Main UI
├── popup.js              # UI logic
├── content.js            # Page interaction
├── background.js         # Background tasks
├── styles.css            # UI styles
├── content.css           # Page overlay styles
└── icons/                # Extension icons
```

## Adding New Features

### Adding a New Code Format (e.g., Vue)

1. Update `content.js`:
   - Add extraction function (e.g., `generateVueComponent()`)
   - Add to `extractElementData()` return object

2. Update `popup.html`:
   - Add new code tab
   - Add new code section

3. Update `popup.js`:
   - Add display logic
   - Add copy functionality
   - Update project structure

4. Test thoroughly

### Adding New Settings

1. Update `popup.html`:
   - Add setting UI in settings tab

2. Update `popup.js`:
   - Add to `loadSettings()`
   - Add to `resetSettings()`
   - Implement setting logic

3. Update `background.js`:
   - Add default value in `onInstalled`

## Documentation

- Update README.md for user-facing changes
- Update CHANGELOG.md with your changes
- Add JSDoc comments for new functions
- Update INSTALLATION.md if setup changes

## Release Process

Maintainers will:
1. Review and merge pull requests
2. Update version in manifest.json
3. Update CHANGELOG.md
4. Create GitHub release
5. Submit to Chrome Web Store

## Questions?

Feel free to:
- Open an issue for discussion
- Email: support@site2code.dev
- Join our Discord: [link]

## Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Given credit in the extension

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
