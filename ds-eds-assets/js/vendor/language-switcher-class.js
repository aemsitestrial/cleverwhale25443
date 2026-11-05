import defineProperty from './define-property.js';

export default class LanguageSwitcherClass {
  constructor(el) {
    if (!el) return;
    // Define classNames property
    defineProperty(this, 'classNames', {
      disabled: 'ds-aem_c-language-switcher--disabled',
      active: 'ds-aem_c-language-switcher--active',
      item: 'cmp-languagenavigation__item',
      activeItem: 'cmp-languagenavigation__item--active',
      link: 'cmp-languagenavigation__item-link',
      initialization: 'ds-aem_c-language-switcher--initialized',
    });

    // Assign component node to root.
    this.el = el;
    this.init();
  }

  // Initialize methods here.
  init() {
    if (this.el || !this.el.classList.contains('.ds-brand-language-switcher')) {
      if (this.el.classList.contains(this.classNames.initialization)) {
        return;
      }

      this.activeItem = this.el.querySelector(`.${this.classNames.activeItem}`);
      this.items = this.el.querySelectorAll(`.${this.classNames.item}`);
      this.links = this.el.querySelectorAll(`.${this.classNames.link}`);
      this.listenSwitcherClick();
      this.listenElMouseLeave();
      this.listenLinkClick();
      this.handleInert();
      this.el.classList.add(this.classNames.initialization);
    }
  }

  initSecondaryVariant() {}

  // Create custom methods here.
  listenElMouseLeave() {
    this.el.addEventListener('mouseleave', () => {
      this.el.classList.remove(this.classNames.active);
      this.handleInert();
    });
  }

  listenSwitcherClick() {
    this.el.addEventListener('click', () => {
      this.el.classList.toggle(this.classNames.active);

      if (this.el.classList.contains(this.classNames.active)) {
        this.items &&
          this.items.forEach((item) => {
            item.removeAttribute('inert');
          });
      } else {
        this.handleInert();
      }
    });
  }

  listenLinkClick() {
    this.links && this.links.forEach((link) => this.onLinkClick(link));
  }

  onLinkClick(link) {
    link.addEventListener(
      'click',
      (event) => {
        if (link.parentNode.classList.contains(this.classNames.activeItem)) {
          event.preventDefault();
        } else {
          this.activeItem && this.activeItem.classList.remove(this.classNames.activeItem);
          link.parentNode.classList.add(this.classNames.activeItem);
          this.el.classList.add(this.classNames.disabled);
        }
      },
      false,
    );
  }

  handleInert() {
    this.items &&
      this.items.forEach((item) => {
        item.setAttribute('inert', true);
      });
    this.activeItem && this.activeItem.removeAttribute('inert');
  }
}
