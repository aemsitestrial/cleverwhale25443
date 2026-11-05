import defineProperty from './define-property.js';

export default class SkipButtonClass {
  constructor(el) {
    if (!el) return;
    // Define classNames property
    defineProperty(this, 'classNames', {
      button: 'cmp-button',
      headerInner: 'ds-v2_c-header__inner',
      initialization: 'ds-aem_c-skip-button--initialized',
    });

    // Define classNames property
    defineProperty(this, 'id', {
      mainContent: 'main',
    });

    // Assign component node to root.
    this.el = el;
    this.init();
  }

  // Initialize methods here.
  init() {
    if (this.el) {
      this.skipButton = this.el.querySelector(`.${this.classNames.button}`);
      this.headerInner = document.querySelector(`.${this.classNames.headerInner}`);
      this.mainContent = document.querySelector(`#${this.id.mainContent}`);
      this.el.classList.add(this.classNames.initialization);
      if (this.skipButton && this.mainContent) this.listenSkipButtonClick();
    }
  }

  // Create custom methods here.
  listenSkipButtonClick() {
    this.skipButton.addEventListener('click', (event) => {
      event.preventDefault();
      const firstTabbable = this.getFirstTabbableChild(this.mainContent);

      if (firstTabbable) {
        const firstTabbablePosition = firstTabbable.offsetTop;
        const headerHeight = this.headerInner ? this.headerInner.offsetHeight : 0;
        const topPosition = firstTabbablePosition - headerHeight;

        this.scrollWindowTo(topPosition, () => {
          firstTabbable.focus();
        });
      }
    });
  }

  getFirstTabbableChild(el) {
    const hasTabIndex = el.hasAttribute('tabindex');

    if (hasTabIndex) {
      return el;
    }

    const focusableSelectors = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusableElements = el.querySelectorAll(focusableSelectors);

    return focusableElements.length > 0 ? focusableElements[0] : null;
  }

  scrollWindowTo(topPosition, onScrollEnd) {
    const initialPosition = window.scrollY;
    let isScrolling;

    window.scrollTo({
      top: topPosition,
      left: 0,
      behavior: 'smooth',
    });

    const checkIfScrollEnds = () => {
      window.clearTimeout(isScrolling);

      isScrolling = setTimeout(() => {
        if (Math.abs(window.scrollY - topPosition) < 5 || Math.abs(window.scrollY - initialPosition) < 5) {
          window.removeEventListener('scroll', checkIfScrollEnds);
          onScrollEnd();
        }
      }, 100);
    };

    window.addEventListener('scroll', checkIfScrollEnds);
  }
}
