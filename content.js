// Content script for element selection and extraction
let isSelecting = false;
let highlightBox = null;
let tooltip = null;
let selectedElement = null;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startSelection') {
    startSelection();
    sendResponse({ success: true });
  } else if (message.action === 'captureFullPage') {
    captureFullPage();
    sendResponse({ success: true });
  }
  return true;
});

// Start element selection mode
function startSelection() {
  if (isSelecting) return;
  
  isSelecting = true;
  document.body.classList.add('site2code-active');
  
  // Create highlight box
  highlightBox = document.createElement('div');
  highlightBox.className = 'site2code-highlight';
  document.body.appendChild(highlightBox);
  
  // Create tooltip
  tooltip = document.createElement('div');
  tooltip.className = 'site2code-tooltip';
  document.body.appendChild(tooltip);
  
  // Add event listeners
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('click', handleClick, true);
  document.addEventListener('keydown', handleKeyDown);
}

// Stop selection mode
function stopSelection() {
  isSelecting = false;
  document.body.classList.remove('site2code-active');
  
  if (highlightBox) {
    highlightBox.remove();
    highlightBox = null;
  }
  
  if (tooltip) {
    tooltip.remove();
    tooltip = null;
  }
  
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('click', handleClick, true);
  document.removeEventListener('keydown', handleKeyDown);
}

// Handle mouse movement
function handleMouseMove(e) {
  if (!isSelecting) return;
  
  const element = e.target;
  if (element === highlightBox || element === tooltip) return;
  
  const rect = element.getBoundingClientRect();
  
  // Update highlight box
  highlightBox.style.top = `${rect.top + window.scrollY}px`;
  highlightBox.style.left = `${rect.left + window.scrollX}px`;
  highlightBox.style.width = `${rect.width}px`;
  highlightBox.style.height = `${rect.height}px`;
  
  // Update tooltip
  const tagName = element.tagName.toLowerCase();
  const className = element.className ? `.${element.className.split(' ').join('.')}` : '';
  const id = element.id ? `#${element.id}` : '';
  
  tooltip.textContent = `${tagName}${id}${className}`;
  tooltip.style.top = `${rect.top + window.scrollY - 30}px`;
  tooltip.style.left = `${rect.left + window.scrollX}px`;
}

// Handle click
function handleClick(e) {
  if (!isSelecting) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  selectedElement = e.target;
  
  if (selectedElement === highlightBox || selectedElement === tooltip) return;
  
  // Extract element data
  const extractedData = extractElementData(selectedElement);
  
  // Send to popup
  chrome.runtime.sendMessage({
    action: 'elementSelected',
    data: extractedData
  });
  
  stopSelection();
}

// Handle keyboard
function handleKeyDown(e) {
  if (e.key === 'Escape') {
    stopSelection();
  }
}

// Extract element data
function extractElementData(element) {
  const html = getCleanHTML(element);
  const css = extractCSS(element);
  const tailwind = generateTailwindClasses(element);
  const react = generateReactComponent(element, html);
  
  return { html, css, tailwind, react };
}

// Get clean HTML
function getCleanHTML(element) {
  const clone = element.cloneNode(true);
  
  // Remove script tags
  clone.querySelectorAll('script').forEach(script => script.remove());
  
  // Remove event handlers
  removeEventHandlers(clone);
  
  // Format HTML
  return formatHTML(clone.outerHTML);
}

// Remove event handlers
function removeEventHandlers(element) {
  const attributes = element.attributes;
  for (let i = attributes.length - 1; i >= 0; i--) {
    const attr = attributes[i];
    if (attr.name.startsWith('on')) {
      element.removeAttribute(attr.name);
    }
  }
  
  element.querySelectorAll('*').forEach(child => {
    const childAttrs = child.attributes;
    for (let i = childAttrs.length - 1; i >= 0; i--) {
      const attr = childAttrs[i];
      if (attr.name.startsWith('on')) {
        child.removeAttribute(attr.name);
      }
    }
  });
}

// Extract CSS
function extractCSS(element) {
  const styles = window.getComputedStyle(element);
  const cssProperties = [];
  
  // Important CSS properties to extract
  const importantProps = [
    'display', 'position', 'width', 'height', 'margin', 'padding',
    'background', 'background-color', 'color', 'font-family', 'font-size',
    'font-weight', 'line-height', 'text-align', 'border', 'border-radius',
    'box-shadow', 'flex', 'flex-direction', 'justify-content', 'align-items',
    'grid', 'grid-template-columns', 'gap', 'opacity', 'transform', 'transition'
  ];
  
  importantProps.forEach(prop => {
    const value = styles.getPropertyValue(prop);
    if (value && value !== 'none' && value !== 'normal') {
      cssProperties.push(`  ${prop}: ${value};`);
    }
  });
  
  const selector = getSelector(element);
  return `${selector} {\n${cssProperties.join('\n')}\n}`;
}

// Get CSS selector
function getSelector(element) {
  if (element.id) {
    return `#${element.id}`;
  }
  
  if (element.className) {
    const classes = element.className.split(' ').filter(c => c.trim());
    if (classes.length > 0) {
      return `.${classes.join('.')}`;
    }
  }
  
  return element.tagName.toLowerCase();
}

// Generate Tailwind classes
function generateTailwindClasses(element) {
  const styles = window.getComputedStyle(element);
  const classes = [];
  
  // Display
  const display = styles.display;
  if (display === 'flex') classes.push('flex');
  if (display === 'grid') classes.push('grid');
  if (display === 'block') classes.push('block');
  if (display === 'inline-block') classes.push('inline-block');
  
  // Flex properties
  if (display === 'flex') {
    const flexDir = styles.flexDirection;
    if (flexDir === 'column') classes.push('flex-col');
    if (flexDir === 'row') classes.push('flex-row');
    
    const justify = styles.justifyContent;
    if (justify === 'center') classes.push('justify-center');
    if (justify === 'space-between') classes.push('justify-between');
    if (justify === 'flex-end') classes.push('justify-end');
    
    const align = styles.alignItems;
    if (align === 'center') classes.push('items-center');
    if (align === 'flex-start') classes.push('items-start');
    if (align === 'flex-end') classes.push('items-end');
  }
  
  // Spacing
  const padding = styles.padding;
  if (padding && padding !== '0px') {
    classes.push('p-4'); // Simplified
  }
  
  const margin = styles.margin;
  if (margin && margin !== '0px') {
    classes.push('m-4'); // Simplified
  }
  
  // Colors
  const bgColor = styles.backgroundColor;
  if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
    classes.push('bg-gray-100'); // Simplified
  }
  
  // Border
  const borderRadius = styles.borderRadius;
  if (borderRadius && borderRadius !== '0px') {
    classes.push('rounded');
  }
  
  // Text
  const textAlign = styles.textAlign;
  if (textAlign === 'center') classes.push('text-center');
  if (textAlign === 'right') classes.push('text-right');
  
  const fontWeight = styles.fontWeight;
  if (parseInt(fontWeight) >= 600) classes.push('font-semibold');
  if (parseInt(fontWeight) >= 700) classes.push('font-bold');
  
  return classes.join(' ') || 'No Tailwind classes generated';
}

// Generate React component
function generateReactComponent(element, html) {
  const componentName = 'ExtractedComponent';
  const tagName = element.tagName.toLowerCase();
  
  // Convert HTML to JSX
  let jsx = html
    .replace(/class=/g, 'className=')
    .replace(/for=/g, 'htmlFor=')
    .replace(/style="([^"]*)"/g, (match, styles) => {
      const styleObj = styles.split(';')
        .filter(s => s.trim())
        .map(s => {
          const [key, value] = s.split(':').map(str => str.trim());
          const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
          return `${camelKey}: '${value}'`;
        })
        .join(', ');
      return `style={{${styleObj}}}`;
    });
  
  return `import React from 'react';

const ${componentName} = () => {
  return (
    ${jsx}
  );
};

export default ${componentName};`;
}

// Capture full page
function captureFullPage() {
  const html = document.documentElement.outerHTML;
  const css = extractAllCSS();
  const scripts = extractScripts();
  
  const formattedHTML = formatHTML(html);
  const tailwind = 'Full page capture - Tailwind classes not applicable';
  const react = generateFullPageReact();
  
  chrome.runtime.sendMessage({
    action: 'elementSelected',
    data: {
      html: formattedHTML,
      css: css,
      tailwind: tailwind,
      react: react
    }
  });
}

// Extract all CSS
function extractAllCSS() {
  let allCSS = '';
  
  // Get all stylesheets
  Array.from(document.styleSheets).forEach(sheet => {
    try {
      Array.from(sheet.cssRules).forEach(rule => {
        allCSS += rule.cssText + '\n';
      });
    } catch (e) {
      // Cross-origin stylesheets
      allCSS += `/* Could not access stylesheet: ${sheet.href} */\n`;
    }
  });
  
  return allCSS || '/* No CSS found */';
}

// Extract scripts
function extractScripts() {
  const scripts = [];
  document.querySelectorAll('script[src]').forEach(script => {
    scripts.push(script.src);
  });
  return scripts;
}

// Generate full page React component
function generateFullPageReact() {
  return `import React from 'react';
import './styles.css';

const FullPage = () => {
  return (
    <div className="full-page">
      {/* Full page content extracted */}
      {/* Convert HTML to JSX manually */}
    </div>
  );
};

export default FullPage;`;
}

// Format HTML
function formatHTML(html) {
  let formatted = '';
  let indent = 0;
  
  html.split(/>\s*</).forEach(node => {
    if (node.match(/^\/\w/)) indent--;
    formatted += '  '.repeat(indent) + '<' + node + '>\n';
    if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith('input') && !node.startsWith('br') && !node.startsWith('img')) {
      indent++;
    }
  });
  
  return formatted.trim();
}
