// Site2Code Content Script
(function () {
  'use strict';

  let isSelecting = false;
  let highlightBox = null;
  let tooltip = null;

  // Guard: don't re-register listener
  if (window.__site2codeLoaded) return;
  window.__site2codeLoaded = true;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startSelection') {
      startSelection();
      sendResponse({ success: true });
    } else if (message.action === 'captureFullPage') {
      const data = captureFullPage();
      sendResponse({ success: true, data });
    } else if (message.action === 'ping') {
      sendResponse({ success: true });
    }
    return true;
  });

  // ─── Element Selection ────────────────────────────────────────────────────

  function startSelection() {
    if (isSelecting) return;
    isSelecting = true;
    document.body.classList.add('site2code-active');

    highlightBox = document.createElement('div');
    highlightBox.className = 'site2code-highlight';
    highlightBox.setAttribute('data-site2code', 'true');
    document.body.appendChild(highlightBox);

    tooltip = document.createElement('div');
    tooltip.className = 'site2code-tooltip';
    tooltip.setAttribute('data-site2code', 'true');
    document.body.appendChild(tooltip);

    document.addEventListener('mousemove', onMouseMove, true);
    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', onKeyDown, true);
  }

  function stopSelection() {
    if (!isSelecting) return;
    isSelecting = false;
    document.body.classList.remove('site2code-active');

    highlightBox && highlightBox.remove();
    tooltip && tooltip.remove();
    highlightBox = null;
    tooltip = null;

    document.removeEventListener('mousemove', onMouseMove, true);
    document.removeEventListener('click', onClick, true);
    document.removeEventListener('keydown', onKeyDown, true);
  }

  function isOwnElement(el) {
    return el && (el === highlightBox || el === tooltip || el.hasAttribute('data-site2code'));
  }

  function onMouseMove(e) {
    if (!isSelecting || isOwnElement(e.target)) return;
    const rect = e.target.getBoundingClientRect();

    Object.assign(highlightBox.style, {
      top: `${rect.top + window.scrollY}px`,
      left: `${rect.left + window.scrollX}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`
    });

    const tag = e.target.tagName.toLowerCase();
    const id = e.target.id ? `#${e.target.id}` : '';
    const cls = typeof e.target.className === 'string' && e.target.className.trim()
      ? '.' + e.target.className.trim().split(/\s+/).join('.')
      : '';
    tooltip.textContent = `${tag}${id}${cls}`;
    tooltip.style.top = `${Math.max(rect.top + window.scrollY - 30, 0)}px`;
    tooltip.style.left = `${rect.left + window.scrollX}px`;
  }

  function onClick(e) {
    if (!isSelecting || isOwnElement(e.target)) return;
    e.preventDefault();
    e.stopPropagation();

    const data = extractElementData(e.target);
    stopSelection();

    // Save to storage so popup can read it even after re-opening
    chrome.storage.local.set({ site2codeResult: data, site2codeTimestamp: Date.now() });
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') stopSelection();
  }

  // ─── Extraction ───────────────────────────────────────────────────────────

  function extractElementData(element) {
    const html = getCleanHTML(element);
    const css = extractCSS(element);
    const tailwind = generateTailwindClasses(element);
    const react = generateReactComponent(element, html);
    return { html, css, tailwind, react };
  }

  function getCleanHTML(element) {
    const clone = element.cloneNode(true);
    clone.querySelectorAll('script').forEach(s => s.remove());
    clone.querySelectorAll('[data-site2code]').forEach(s => s.remove());
    // Strip event handlers
    clone.querySelectorAll('*').forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('on')) el.removeAttribute(attr.name);
      });
    });
    return formatHTML(clone.outerHTML);
  }

  function extractCSS(element) {
    const styles = window.getComputedStyle(element);
    const props = [
      'display', 'position', 'width', 'height', 'margin', 'padding',
      'background-color', 'color', 'font-family', 'font-size', 'font-weight',
      'line-height', 'text-align', 'border', 'border-radius', 'box-shadow',
      'flex-direction', 'justify-content', 'align-items', 'gap', 'opacity',
      'transform', 'transition', 'cursor', 'overflow'
    ];
    const lines = props
      .map(p => ({ p, v: styles.getPropertyValue(p).trim() }))
      .filter(({ v }) => v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px')
      .map(({ p, v }) => `  ${p}: ${v};`);

    const selector = element.id ? `#${element.id}`
      : typeof element.className === 'string' && element.className.trim()
        ? `.${element.className.trim().split(/\s+/)[0]}`
        : element.tagName.toLowerCase();

    return lines.length ? `${selector} {\n${lines.join('\n')}\n}` : `/* No significant styles found for ${selector} */`;
  }

  function generateTailwindClasses(element) {
    const s = window.getComputedStyle(element);
    const cls = [];

    const display = s.display;
    if (display === 'flex') cls.push('flex');
    else if (display === 'grid') cls.push('grid');
    else if (display === 'inline-block') cls.push('inline-block');
    else if (display === 'inline') cls.push('inline');

    if (display === 'flex') {
      if (s.flexDirection === 'column') cls.push('flex-col');
      if (s.justifyContent === 'center') cls.push('justify-center');
      else if (s.justifyContent === 'space-between') cls.push('justify-between');
      else if (s.justifyContent === 'flex-end') cls.push('justify-end');
      if (s.alignItems === 'center') cls.push('items-center');
      else if (s.alignItems === 'flex-end') cls.push('items-end');
    }

    if (s.textAlign === 'center') cls.push('text-center');
    else if (s.textAlign === 'right') cls.push('text-right');

    const fw = parseInt(s.fontWeight);
    if (fw >= 700) cls.push('font-bold');
    else if (fw >= 600) cls.push('font-semibold');

    if (s.borderRadius && s.borderRadius !== '0px') cls.push('rounded');
    if (s.cursor === 'pointer') cls.push('cursor-pointer');
    if (s.overflow === 'hidden') cls.push('overflow-hidden');

    return cls.length ? cls.join(' ') : '/* No Tailwind classes mapped */';
  }

  function generateReactComponent(element, html) {
    let jsx = html
      .replace(/\bclass=/g, 'className=')
      .replace(/\bfor=/g, 'htmlFor=')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/style="([^"]*)"/g, (_, styles) => {
        const obj = styles.split(';')
          .map(s => s.trim()).filter(Boolean)
          .map(s => {
            const idx = s.indexOf(':');
            if (idx === -1) return '';
            const key = s.slice(0, idx).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
            const val = s.slice(idx + 1).trim();
            return `${key}: '${val}'`;
          }).filter(Boolean).join(', ');
        return obj ? `style={{${obj}}}` : '';
      });

    return `import React from 'react';\n\nconst ExtractedComponent = () => {\n  return (\n    ${jsx}\n  );\n};\n\nexport default ExtractedComponent;`;
  }

  function formatHTML(html) {
    let result = '';
    let depth = 0;
    const tab = '  ';
    const voidTags = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);

    html.replace(/<!--[\s\S]*?-->|<\/?[^>]+>/g, (tag, offset) => {
      const isClose = tag.startsWith('</');
      const isSelfClose = tag.endsWith('/>');
      const tagName = (tag.match(/<\/?([a-zA-Z][^\s/>]*)/) || [])[1]?.toLowerCase();

      if (isClose) depth = Math.max(0, depth - 1);
      result += tab.repeat(depth) + tag + '\n';
      if (!isClose && !isSelfClose && tagName && !voidTags.has(tagName)) depth++;
    });

    return result.trim();
  }

  // ─── Full Page Capture ────────────────────────────────────────────────────

  function captureFullPage() {
    const html = formatHTML(document.documentElement.outerHTML);
    const css = extractAllCSS();
    const tailwind = '/* Full page — Tailwind classes not applicable */';
    const react = `import React from 'react';\nimport './styles.css';\n\nconst FullPage = () => (\n  <div className="full-page">\n    {/* Paste converted JSX here */}\n  </div>\n);\n\nexport default FullPage;`;
    return { html, css, tailwind, react };
  }

  function extractAllCSS() {
    let css = '';
    Array.from(document.styleSheets).forEach(sheet => {
      try {
        Array.from(sheet.cssRules).forEach(rule => { css += rule.cssText + '\n'; });
      } catch {
        css += `/* Cross-origin stylesheet skipped: ${sheet.href} */\n`;
      }
    });
    return css || '/* No CSS found */';
  }

})();
