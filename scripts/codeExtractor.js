// Code extraction functionality
import { CSS_PROPERTIES } from '../utils/constants.js';

class CodeExtractor {
  /**
   * Extract all code formats from element
   * @param {Element} element - DOM element
   * @returns {Object} Extracted code
   */
  static extractAll(element) {
    const html = this.extractHTML(element);
    const css = this.extractCSS(element);
    const tailwind = this.generateTailwind(element);
    const react = this.generateReact(element, html);
    
    return { html, css, tailwind, react };
  }

  /**
   * Extract clean HTML
   * @param {Element} element - DOM element
   * @returns {string} Clean HTML
   */
  static extractHTML(element) {
    const clone = element.cloneNode(true);
    
    // Remove scripts
    clone.querySelectorAll('script').forEach(script => script.remove());
    
    // Remove event handlers
    this.removeEventHandlers(clone);
    
    // Remove site2code elements
    clone.querySelectorAll('[data-site2code]').forEach(el => el.remove());
    
    return this.formatHTML(clone.outerHTML);
  }

  /**
   * Remove event handler attributes
   * @param {Element} element - DOM element
   */
  static removeEventHandlers(element) {
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
   * Extract CSS styles
   * @param {Element} element - DOM element
   * @returns {string} CSS code
   */
  static extractCSS(element) {
    const styles = window.getComputedStyle(element);
    const cssProperties = [];
    
    CSS_PROPERTIES.forEach(prop => {
      const value = styles.getPropertyValue(prop);
      if (value && value !== 'none' && value !== 'normal' && value !== 'auto') {
        cssProperties.push(`  ${prop}: ${value};`);
      }
    });
    
    const selector = this.getSelector(element);
    return cssProperties.length > 0 
      ? `${selector} {\n${cssProperties.join('\n')}\n}`
      : `/* No significant styles found for ${selector} */`;
  }

  /**
   * Get CSS selector for element
   * @param {Element} element - DOM element
   * @returns {string} CSS selector
   */
  static getSelector(element) {
    if (element.id) {
      return `#${element.id}`;
    }
    
    if (element.className && typeof element.className === 'string') {
      const classes = element.className.split(' ').filter(c => c.trim());
      if (classes.length > 0) {
        return `.${classes[0]}`;
      }
    }
    
    return element.tagName.toLowerCase();
  }

  /**
   * Generate Tailwind CSS classes
   * @param {Element} element - DOM element
   * @returns {string} Tailwind classes
   */
  static generateTailwind(element) {
    const styles = window.getComputedStyle(element);
    const classes = [];
    
    // Display
    const display = styles.display;
    if (display === 'flex') classes.push('flex');
    else if (display === 'grid') classes.push('grid');
    else if (display === 'block') classes.push('block');
    else if (display === 'inline-block') classes.push('inline-block');
    else if (display === 'inline-flex') classes.push('inline-flex');
    
    // Flex properties
    if (display === 'flex' || display === 'inline-flex') {
      const flexDir = styles.flexDirection;
      if (flexDir === 'column') classes.push('flex-col');
      else if (flexDir === 'row-reverse') classes.push('flex-row-reverse');
      else if (flexDir === 'column-reverse') classes.push('flex-col-reverse');
      
      const justify = styles.justifyContent;
      if (justify === 'center') classes.push('justify-center');
      else if (justify === 'space-between') classes.push('justify-between');
      else if (justify === 'space-around') classes.push('justify-around');
      else if (justify === 'flex-end') classes.push('justify-end');
      else if (justify === 'flex-start') classes.push('justify-start');
      
      const align = styles.alignItems;
      if (align === 'center') classes.push('items-center');
      else if (align === 'flex-start') classes.push('items-start');
      else if (align === 'flex-end') classes.push('items-end');
      else if (align === 'stretch') classes.push('items-stretch');
      
      const wrap = styles.flexWrap;
      if (wrap === 'wrap') classes.push('flex-wrap');
      else if (wrap === 'wrap-reverse') classes.push('flex-wrap-reverse');
    }
    
    // Position
    const position = styles.position;
    if (position === 'relative') classes.push('relative');
    else if (position === 'absolute') classes.push('absolute');
    else if (position === 'fixed') classes.push('fixed');
    else if (position === 'sticky') classes.push('sticky');
    
    // Text alignment
    const textAlign = styles.textAlign;
    if (textAlign === 'center') classes.push('text-center');
    else if (textAlign === 'right') classes.push('text-right');
    else if (textAlign === 'justify') classes.push('text-justify');
    
    // Font weight
    const fontWeight = parseInt(styles.fontWeight);
    if (fontWeight >= 700) classes.push('font-bold');
    else if (fontWeight >= 600) classes.push('font-semibold');
    else if (fontWeight >= 500) classes.push('font-medium');
    else if (fontWeight <= 300) classes.push('font-light');
    
    // Border radius
    const borderRadius = styles.borderRadius;
    if (borderRadius && borderRadius !== '0px') {
      if (borderRadius.includes('9999')) classes.push('rounded-full');
      else classes.push('rounded');
    }
    
    // Overflow
    const overflow = styles.overflow;
    if (overflow === 'hidden') classes.push('overflow-hidden');
    else if (overflow === 'auto') classes.push('overflow-auto');
    else if (overflow === 'scroll') classes.push('overflow-scroll');
    
    // Cursor
    const cursor = styles.cursor;
    if (cursor === 'pointer') classes.push('cursor-pointer');
    
    return classes.length > 0 
      ? classes.join(' ') 
      : '/* No Tailwind classes generated - consider adding spacing, colors, and sizing classes manually */';
  }

  /**
   * Generate React component
   * @param {Element} element - DOM element
   * @param {string} html - HTML string
   * @returns {string} React component code
   */
  static generateReact(element, html) {
    const componentName = 'ExtractedComponent';
    
    // Convert HTML to JSX
    let jsx = html
      .replace(/class=/g, 'className=')
      .replace(/for=/g, 'htmlFor=')
      .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
      .replace(/style="([^"]*)"/g, (match, styles) => {
        return this.convertStylesToJSX(styles);
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
   * Convert inline styles to JSX format
   * @param {string} styles - Inline styles string
   * @returns {string} JSX style object
   */
  static convertStylesToJSX(styles) {
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
  }

  /**
   * Format HTML with indentation
   * @param {string} html - HTML string
   * @returns {string} Formatted HTML
   */
  static formatHTML(html) {
    let formatted = '';
    let indent = 0;
    const tab = '  ';
    
    html.split(/>\s*</).forEach((node, index) => {
      // Decrease indent for closing tags
      if (node.match(/^\/\w/)) {
        indent = Math.max(0, indent - 1);
      }
      
      // Add indentation
      if (index > 0) {
        formatted += tab.repeat(indent);
      }
      
      formatted += (index === 0 ? '' : '<') + node + (index === html.split(/>\s*</).length - 1 ? '' : '>') + '\n';
      
      // Increase indent for opening tags (but not self-closing)
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
   * Capture full page code
   * @returns {Object} Full page code
   */
  static captureFullPage() {
    const html = this.formatHTML(document.documentElement.outerHTML);
    const css = this.extractAllCSS();
    const tailwind = '/* Full page capture - Tailwind classes not applicable */';
    const react = this.generateFullPageReact();
    
    return { html, css, tailwind, react };
  }

  /**
   * Extract all CSS from page
   * @returns {string} All CSS
   */
  static extractAllCSS() {
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
  static generateFullPageReact() {
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
}

export default CodeExtractor;
