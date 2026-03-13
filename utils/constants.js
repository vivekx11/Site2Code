// Constants and configuration
export const CONFIG = {
  DEBOUNCE_DELAY: 50,
  GITHUB_API_BASE: 'https://api.github.com',
  MAX_CODE_PREVIEW_HEIGHT: 300,
  STORAGE_KEYS: {
    GITHUB_TOKEN: 'githubToken',
    GITHUB_USERNAME: 'githubUsername',
    THEME: 'theme',
    SETTINGS: {
      INLINE_STYLES: 'includeInlineStyles',
      COMPUTED_STYLES: 'includeComputedStyles',
      GENERATE_TAILWIND: 'generateTailwind',
      MINIFY_CODE: 'minifyCode'
    }
  },
  DEFAULT_SETTINGS: {
    includeInlineStyles: true,
    includeComputedStyles: true,
    generateTailwind: true,
    minifyCode: false,
    theme: 'dark'
  }
};

export const CSS_PROPERTIES = [
  'display', 'position', 'width', 'height', 'margin', 'padding',
  'background', 'background-color', 'color', 'font-family', 'font-size',
  'font-weight', 'line-height', 'text-align', 'border', 'border-radius',
  'box-shadow', 'flex', 'flex-direction', 'justify-content', 'align-items',
  'grid', 'grid-template-columns', 'gap', 'opacity', 'transform', 'transition',
  'z-index', 'overflow', 'cursor', 'text-decoration'
];

export const MESSAGES = {
  ERRORS: {
    NO_TOKEN: 'Please enter a GitHub token',
    INVALID_TOKEN: 'Invalid GitHub token. Please check and try again.',
    NO_REPO_NAME: 'Please enter a repository name',
    GITHUB_CONNECTION_FAILED: 'Failed to connect to GitHub. Please try again.',
    REPO_CREATE_FAILED: 'Failed to create repository',
    NO_EXTRACTED_DATA: 'No code has been extracted yet. Please select an element first.'
  },
  SUCCESS: {
    TOKEN_COPIED: '✓ Copied!',
    REPO_CREATED: '✅ Successfully created repository!'
  }
};
