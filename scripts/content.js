// Main content script
(function() {
  'use strict';

  // Import modules (will be bundled or loaded as ES modules)
  let elementSelector = null;
  let isInitialized = false;

  /**
   * Initialize content script
   */
  function initialize() {
    if (isInitialized) return;
    isInitialized = true;
    
    // Listen for messages from popup/background
    chrome.runtime.onMessage.addListener(handleMessage);
  }

  /**
   * Handle messages from extension
   * @param {Object} message - Message object
   * @param {Object} sender - Sender information
   * @param {Function} sendResponse - Response callback
   * @returns {boolean} Keep channel open
   */
  function handleMessage(message, sender, sendResponse) {
    try {
      switch (message.action) {
        case 'startSelection':
          startSelection();
          sendResponse({ success: true });
          break;
          
        case 'captureFullPage':
          captureFullPage();
          sendResponse({ success: true });
          break;
          
        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('[Site2Code] Error handling message:', error);
      sendResponse({ success: false, error: error.message });
    }
    
    return true; // Keep message channel open
  }

  /**
   * Start element selection
   */
  function startSelection() {
    if (!elementSelector) {
      elementSelector = createElementSelector();
    }
    
    elementSelector.start();
  }

  /**
   * Create element selector instance
   * @returns {Object} Element selector
   */
  function createElementSelector() {
    return {
      isSelecting: false,
      highlightBox: null,
      tooltip: null,
      
      start() {
        if (this.isSelecting) return;
        
        this.isSelecting = true;
        document.body.classList.add('site2code-active');
        
        this.createHighlightBox();
        this.createTooltip();
        this.attachEventListeners();
      },
      
      stop() {
        if (!this.isSelecting) return;
        
        this.isSelecting = false;
        document.body.classList.remove('site2code-active');
        
        this.removeHighlightBox();
        this.removeTooltip();
        this.detachEventListeners();
      },
      
      createHighlightBox() {
        this.highlightBox = document.createElement('div');
        this.highlightBox.className = 'site2code-highlight';
        this.highlightBox.setAttribute('data-site2code', 'true');
        document.body.appendChild(this.highlightBox);
      },
      
      createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'site2code-tooltip';
        this.tooltip.setAttribute('data-site2code', 'true');
        document.body.appendChild(this.tooltip);
      },
      
      removeHighlightBox() {
        if (this.highlightBox) {
          this.highlightBox.remove();
          this.highlightBox = null;
        }
      },
      
      removeTooltip() {
        if (this.tooltip) {
          this.tooltip.remove();
          this.tooltip = null;
        }
      },
      
      attachEventListeners() {
        this.boundHandleMouseMove = this.handleMouseMove.bind(this);
        this.boundHandleClick = this.handleClick.bind(this);
        this.boundHandleKeyDown = this.handleKeyDown.bind(this);
        
        document.addEventListener('mousemove', this.boundHandleMouseMove, true);
        document.addEventListener('click', this.boundHandleClick, true);
        document.addEventListener('keydown', this.boundHandleKeyDown, true);
      },
      
      detachEventListeners() {
        if (this.boundHandleMouseMove) {
          document.removeEventListener('mousemove', this.boundHandleMouseMove, true);
        }
        if (this.boundHandleClick) {
          document.removeEventListener('click', this.boundHandleClick, true);
        }
        if (this.boundHandleKeyDown) {
          document.removeEventListener('keydown', this.boundHandleKeyDown, true);
        }
      },
      
      handleMouseMove(e) {
        if (!this.isSelecting) return;
        
        const element = e.target;
        if (this.isOwnElement(element)) return;
        
        const rect = element.getBoundingClientRect();
        this.updateHighlightBox(rect);
        this.updateTooltip(element, rect);
      },
      
      isOwnElement(element) {
        return element === this.highlightBox || 
               element === this.tooltip ||
               element.hasAttribute('data-site2code');
      },
      
      updateHighlightBox(rect) {
        if (!this.highlightBox) return;
        
        this.highlightBox.style.top = `${rect.top + window.scrollY}px`;
        this.highlightBox.style.left = `${rect.left + window.scrollX}px`;
        this.highlightBox.style.width = `${rect.width}px`;
        this.highlightBox.style.height = `${rect.height}px`;
      },
      
      updateTooltip(element, rect) {
        if (!this.tooltip) return;
        
        const tagName = element.tagName.toLowerCase();
        const className = element.className && typeof element.className === 'string' 
          ? `.${element.className.split(' ').filter(c => c.trim()).join('.')}` 
          : '';
        const id = element.id ? `#${element.id}` : '';
        
        this.tooltip.textContent = `${tagName}${id}${className}`;
        
        const tooltipTop = rect.top + window.scrollY - 30;
        const tooltipLeft = rect.left + window.scrollX;
        
        this.tooltip.style.top = `${Math.max(tooltipTop, window.scrollY)}px`;
        this.tooltip.style.left = `${tooltipLeft}px`;
      },
      
      handleClick(e) {
        if (!this.isSelecting) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const element = e.target;
        if (this.isOwnElement(element)) return;
        
        this.extractAndSend(element);
        this.stop();
      },
      
      handleKeyDown(e) {
        if (e.key === 'Escape') {
          this.stop();
        }
      },
      
      extractAndSend(element) {
        try {
          const extractedData = extractElementData(element);
          
          chrome.runtime.sendMessage({
            action: 'elementSelected',
            data: extractedData
          }).catch(err => {
            console.error('[Site2Code] Failed to send extracted data:', err);
          });
        } catch (error) {
          console.error('[Site2Code] Extraction failed:', error);
        }
      }
    };
  }

  /**
   * Extract element data
   * @param {Element} element - DOM element
   * @returns {Object} Extracted data
   */
  function extractElementData(element) {
    const html = getCleanHTML(element);
    const css = extractCSS(element);
    const tailwind = generateTailwindClasses(element);
    const react = generateReactComponent(element, html);
    
    return { html, css, tailwind, react };
  }

  /**
   * Get clean HTML
   * @param {Element} element - DOM element
   * @returns {string} Clean HTML
   */
  function getCleanHTML(element) {
    const clone = element.cloneNode(true);
    
    // Remove scripts
    clone.querySelectorAll('script').forEach(script => script.remove());
    
    // Remove event handlers
    removeEventHandlers(clone);
    
    // Remove site2code elements
    clone.querySelectorAll('[data-site2code]').forEach(el => el.remove());
    
    return formatHTML(clone.outerHTML);
  }

  /**
   * Remove event handler attributes
   * @param {Element} element - DOM element
   */
  function removeEventHandlers(element) {
    const removeHandlers = (el) => {
      const attrs = Array.from(el.attributes);
      attrs.forEach(attr => {
        if (attr.name.startsWith('on')) {
          el.removeAttribute(attr.name);
        }
      });
    };
    
    removeHandlers(element);
    element.querySelectorAll('*').forEach(removeHandlers);
  }

  /**
   * Extract CSS
   * @param {Element} element - DOM element
   * @returns {string} CSS code
   */
  function extractCSS(element) {
    const styles = window.getComputedStyle(element);
    const cssProperties = [];
    
    const importantProps = [
      'display', 'position', 'width', 'height', 'margin', 'padding',
      'background', 'background-color', 'color', 'font-family', 'font-size',
      'font-weight', 'line-height', 'text-align', 'border', 'border-radius',
      'box-shadow', 'flex', 'flex-direction', 'justify-content', 'align-items',
      'grid', 'grid-template-columns', 'gap', 'opacity', 'transform', 'transition'
    ];
    
    importantProps.forEach(prop => {
      const value = styles.getPropertyValue(prop);
      if (value && value !== 'none' && value !== 'normal' && value !== 'auto') {
        cssProperties.push(`  ${prop}: ${value};`);
      }
    });
    
    const selector = getSelector(element);
    return cssProperties.length > 0 
      ? `${selector} {\n${cssProperties.join('\n')}\n}`
      : `/* No significant styles found */`;
  }

  /**
   * Get CSS selector
   * @param {Element} element - DOM element
   * @returns {string} CSS selector
   */
  function getSelector(element) {
    if (element.id) return `#${element.id}`;
    
    if (element.className && typeof element.className === 'string') {
      const classes = element.className.split(' ').filter(c => c.trim());
      if (classes.length > 0) return `.${classes[0]}`;
    }
    
    return element.tagName.toLowerCase();
  }

  /**
   * Generate Tailwind classes
   * @param {Element} element - DOM element
   * @returns {string} Tailwind classes
   */
  function generateTailwindClasses(element) {
    const styles = window.getComputedStyle(element);
    const classes = [];
    
    const display = styles.display;
    if (display === 'flex') classes.push('flex');
    else if (display === 'grid') classes.push('grid');
    else if (display === 'block') classes.push('block');
    else if (display === 'inline-block') classes.push('inline-block');
    
    if (display === 'flex') {
      const flexDir = styles.flexDirection;
      if (flexDir === 'column') classes.push('flex-col');
      
      const justify = styles.justifyContent;
      if (justify === 'center') classes.push('justify-center');
      else if (justify === 'space-between') classes.push('justify-between');
      else if (justify === 'flex-end') classes.push('justify-end');
      
      const align = styles.alignItems;
      if (align === 'center') classes.push('items-center');
      else if (align === 'flex-start') classes.push('items-start');
      else if (align === 'flex-end') classes.push('items-end');
    }
    
    const textAlign = styles.textAlign;
    if (textAlign === 'center') classes.push('text-center');
    else if (textAlign === 'right') classes.push('text-right');
    
    const fontWeight = parseInt(styles.fontWeight);
    if (fontWeight >= 700) classes.push('font-bold');
    else if (fontWeight >= 600) classes.push('font-semibold');
    
    const borderRadius = styles.borderRadius;
    if (borderRadius && borderRadius !== '0px') {
      classes.push('rounded');
    }
    
    return classes.length > 0 
      ? classes.join(' ') 
      : '/* Add Tailwind classes manually for spacing, colors, and sizing */';
  }

  /**
   * Generate React component
   * @param {Element} element - DOM element
   * @param {string} html - HTML string
   * @returns {string} React component
   */
  function generateReactComponent(element, html) {
    const componentName = 'ExtractedComponent';
    
    let jsx = html
      .replace(/class=/g, 'className=')
      .replace(/for=/g, 'htmlFor=')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/style="([^"]*)"/g, (match, styles) => {
        const styleObj = styles.split(';')
          .filter(s => s.trim())
          .map(s => {
            const [key, value] = s.split(':').map(str => str.trim());
            if (!key || !value) return '';
            const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
            return `${camelKey}: '${value}'`;
          })
          .filter(s => s)
          .join(', ');
        return styleObj ? `style={{${styleObj}}}` : '';
      });
    
    return `import React from 'react';

const ${componentName} = () => {
  return (
    ${jsx}
  );
};

export default ${componentName};`;
  }

  /**
   * Format HTML
   * @param {string} html - HTML string
   * @returns {string} Formatted HTML
   */
  function formatHTML(html) {
    let formatted = '';
    let indent = 0;
    const tab = '  ';
    
    html.split(/>\s*</).forEach((node, index) => {
      if (node.match(/^\/\w/)) {
        indent = Math.max(0, indent - 1);
      }
      
      if (index > 0) {
        formatted += tab.repeat(indent);
      }
      
      formatted += (index === 0 ? '' : '<') + node + (index === html.split(/>\s*</).length - 1 ? '' : '>') + '\n';
      
      if (node.match(/^<?\w[^>]*[^\/]$/) && 
          !node.startsWith('input') && 
          !node.startsWith('br') && 
          !node.startsWith('img') &&
          !node.startsWith('hr') &&
          !node.startsWith('meta') &&
          !node.startsWith('link')) {
        indent++;
      }
    });
    
    return formatted.trim();
  }

  /**
   * Capture full page
   */
  function captureFullPage() {
    try {
      const html = formatHTML(document.documentElement.outerHTML);
      const css = extractAllCSS();
      const tailwind = '/* Full page capture - Tailwind classes not applicable */';
      const react = generateFullPageReact();
      
      chrome.runtime.sendMessage({
        action: 'elementSelected',
        data: { html, css, tailwind, react }
      }).catch(err => {
        console.error('[Site2Code] Failed to send full page data:', err);
      });
    } catch (error) {
      console.error('[Site2Code] Full page capture failed:', error);
    }
  }

  /**
   * Extract all CSS
   * @returns {string} All CSS
   */
  function extractAllCSS() {
    let allCSS = '';
    
    Array.from(document.styleSheets).forEach(sheet => {
      try {
        Array.from(sheet.cssRules).forEach(rule => {
          allCSS += rule.cssText + '\n';
        });
      } catch (e) {
        allCSS += `/* Could not access stylesheet: ${sheet.href || 'inline'} */\n`;
      }
    });
    
    return allCSS || '/* No CSS found */';
  }

  /**
   * Generate full page React component
   * @returns {string} React component
   */
  function generateFullPageReact() {
    return `import React from 'react';
import './styles.css';

const FullPage = () => {
  return (
    <div className="full-page">
      {/* Full page content extracted */}
      {/* Convert HTML to JSX manually or use a converter tool */}
    </div>
  );
};

export default FullPage;`;
  }

  // Initialize on load
  initialize();
})();
