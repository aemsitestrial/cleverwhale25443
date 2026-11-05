import defineProperty from './define-property.js';

export default class BurgerClass {
  constructor(el) {
    if (!el) return;
    // Define classNames property
    defineProperty(this, 'classNames', {
      initialization: 'ds-aem_c-burger--initialized',
      active: 'ds-aem_c-burger--active',
    });

    // Define eNames property
    defineProperty(this, 'eNames', {
      openMegaMenu: 'openMegaMenu',
      closeMegaMenu: 'closeMegaMenu',
      showHeaderMiddleBar: 'showHeaderMiddleBar',
      hideHeaderMiddleBar: 'hideHeaderMiddleBar',
    });

    if (el.classList.contains(this.classNames.initialization)) {
      return;
    }

    // Assign component node to root.
    this.el = el;
    this.openText = this.el.dataset.open;
    this.closeText = this.el.dataset.close;
    this.text = this.el.querySelector('.cmp-button__text');
    this.init();
  }

  set isActive(value) {
    value ? this.activateBurger() : this.inactivateBurger();
  }

  get isActive() {
    return this.el.classList.contains(this.classNames.active);
  }

  // Initialize methods here.
  init() {
    if (this.el) {
      this.openMegaMenu = new CustomEvent(this.eNames.openMegaMenu);
      this.closeMegaMenu = new CustomEvent(this.eNames.closeMegaMenu);
      this.showHeaderMiddleBar = new CustomEvent(this.eNames.showHeaderMiddleBar);
      this.hideHeaderMiddleBar = new CustomEvent(this.eNames.hideHeaderMiddleBar);
      this.listenBurgerClick();
      this.listenCustomEvents();
      this.el.classList.add(this.classNames.initialization);
    }
  }

  // Create custom methods here.
  setText(action) {
    if (!this.text) return;
    if (action === 'close') this.text.innerHTML = this.openText;
    if (action === 'open') this.text.innerHTML = this.closeText;
  }

  listenBurgerClick() {
    this.el.addEventListener('click', () => {
      this.isActive = !this.isActive;
    });
  }

  listenCustomEvents() {
    document.addEventListener(this.eNames.closeMegaMenu, () => {
      this.el.classList.remove(this.classNames.active);
      this.setText('close');
    });
    document.addEventListener(this.eNames.openMegaMenu, () => {
      this.el.classList.add(this.classNames.active);
      this.setText('open');
    });
  }

  activateBurger() {
    document.dispatchEvent(this.hideHeaderMiddleBar);
    document.dispatchEvent(this.openMegaMenu);
  }

  inactivateBurger() {
    document.dispatchEvent(this.closeMegaMenu);
    document.dispatchEvent(this.showHeaderMiddleBar);
  }
}
