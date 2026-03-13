// Element selection functionality
import { debounce } from '../utils/helpers.js';
import { CONFIG } from '../utils/constants.js';

class ElementSelector {
  constructor() {
    this.isSelecting = false;
    this.highlightBox = null;
    this.tooltip = null;
    this.selectedElement = null;
    
    // Bind methods
    this.handleMouseMove = debounce(this.handleMouseMove.bind(this), CONFIG.DEBOUNCE_DELAY);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  /**
   * Start element selection mode
   */
  start() {
    if (this.isSelecting) return;
    
    this.isSelecting = true;
    document.body.classList.add('site2code-active');
    
    this.createHighlightBox();
    this.createTooltip();
    this.attachEventListeners();
  }

  /**
   * Stop element selection mode
   */
  stop() {
    if (!this.isSelecting) return;
    
    this.isSelecting = false;
    document.body.classList.remove('site2code-active');
    
    this.removeHighlightBox();
    this.removeTooltip();
    this.detachEventListeners();
  }

  /**
   * Create highlight box element
   */
  createHighlightBox() {
    this.highlightBox = document.createElement('div');
    this.highlightBox.className = 'site2code-highlight';
    this.highlightBox.setAttribute('data-site2code', 'true');
    document.body.appendChild(this.highlightBox);
  }

  /**
   * Create tooltip element
   */
  createTooltip() {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'site2code-tooltip';
    this.tooltip.setAttribute('data-site2code', 'true');
    document.body.appendChild(this.tooltip);
  }

  /**
   * Remove highlight box
   */
  removeHighlightBox() {
    if (this.highlightBox) {
      this.highlightBox.remove();
      this.highlightBox = null;
    }
  }

  /**
   * Remove tooltip
   */
  removeTooltip() {
    if (this.tooltip) {
      this.tooltip.remove();
      this.tooltip = null;
    }
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    document.addEventListener('mousemove', this.handleMouseMove, true);
    document.addEventListener('click', this.handleClick, true);
    document.addEventListener('keydown', this.handleKeyDown, true);
  }

  /**
   * Detach event listeners
   */
  detachEventListeners() {
    document.removeEventListener('mousemove', this.handleMouseMove, true);
    document.removeEventListener('click', this.handleClick, true);
    document.removeEventListener('keydown', this.handleKeyDown, true);
  }

  /**
   * Handle mouse movement
   * @param {MouseEvent} e - Mouse event
   */
  handleMouseMove(e) {
    if (!this.isSelecting) return;
    
    const element = e.target;
    
    // Ignore our own elements
    if (this.isOwnElement(element)) return;
    
    const rect = element.getBoundingClientRect();
    
    // Update highlight box position
    this.updateHighlightBox(rect);
    
    // Update tooltip
    this.updateTooltip(element, rect);
  }

  /**
   * Check if element is created by this extension
   * @param {Element} element - Element to check
   * @returns {boolean} Is own element
   */
  isOwnElement(element) {
    return element === this.highlightBox || 
           element === this.tooltip ||
           element.hasAttribute('data-site2code');
  }

  /**
   * Update highlight box position
   * @param {DOMRect} rect - Element bounding rect
   */
  updateHighlightBox(rect) {
    if (!this.highlightBox) return;
    
    this.highlightBox.style.top = `${rect.top + window.scrollY}px`;
    this.highlightBox.style.left = `${rect.left + window.scrollX}px`;
    this.highlightBox.style.width = `${rect.width}px`;
    this.highlightBox.style.height = `${rect.height}px`;
  }

  /**
   * Update tooltip content and position
   * @param {Element} element - Target element
   * @param {DOMRect} rect - Element bounding rect
   */
  updateTooltip(element, rect) {
    if (!this.tooltip) return;
    
    const tagName = element.tagName.toLowerCase();
    const className = element.className && typeof element.className === 'string' 
      ? `.${element.className.split(' ').filter(c => c.trim()).join('.')}` 
      : '';
    const id = element.id ? `#${element.id}` : '';
    
    this.tooltip.textContent = `${tagName}${id}${className}`;
    
    // Position tooltip above element
    const tooltipTop = rect.top + window.scrollY - 30;
    const tooltipLeft = rect.left + window.scrollX;
    
    this.tooltip.style.top = `${Math.max(tooltipTop, window.scrollY)}px`;
    this.tooltip.style.left = `${tooltipLeft}px`;
  }

  /**
   * Handle click event
   * @param {MouseEvent} e - Mouse event
   */
  handleClick(e) {
    if (!this.isSelecting) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const element = e.target;
    
    // Ignore our own elements
    if (this.isOwnElement(element)) return;
    
    this.selectedElement = element;
    this.onElementSelected(element);
    this.stop();
  }

  /**
   * Handle keyboard events
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeyDown(e) {
    if (e.key === 'Escape') {
      this.stop();
    }
  }

  /**
   * Callback when element is selected
   * Override this method
   * @param {Element} element - Selected element
   */
  onElementSelected(element) {
    // To be overridden
  }
}

export default ElementSelector;
