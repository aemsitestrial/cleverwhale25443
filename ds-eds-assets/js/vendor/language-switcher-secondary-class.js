import defineProperty from './define-property.js';

export default class languageSwitcherSecondaryClass {
  constructor(el) {
    if (!el) return;
    // Define classNames property
    defineProperty(this, 'classNames', {
      active: 'active',
      initialization: 'ds-brand-language-switcher--initialized',
      initializationForPrimaryVariant: 'ds-aem_c-language-switcher--initialized',
      dropdown: 'languagenavigation',
      toggler: 'button',
      inactiveDropdown: 'inactive',
      activeDropdown: 'active',
      dropdownWrapper: 'ds-brand-language-switcher-dropdown',
      group: 'cmp-languagenavigation__group',
    });

    this.activated = false;
    this.mobileBreakpoint = '787px';

    this.$dropdownEl = null;
    this.$toggler = null;

    this.$dropdownElLinks = null;

    this.bodyEl = document.querySelector('body');

    this.el = el;
    this.init();
  }

  init() {
    if (this.el) {
      this.$dropdownEl = this.el;

      this.buildCustomStructure();

      this.$dropdownEl.classList.add(this.classNames.initializationForPrimaryVariant);
      this.$toggler = this.$dropdownEl.querySelector(`.${this.classNames.toggler}`);
      this.replaceDropdownToRootPage();
      this.eventListeners();
      this.el.classList.add(this.classNames.initialization);
    }
  }

  eventListeners() {
    window.addEventListener('resize', () => this.setDropdownPosition());

    this.$toggler.addEventListener('click', (e) => {
      e.stopPropagation();

      if (this.activated) {
        this.closeDropdown();
        this.activated = false;
      } else {
        this.activated = true;
        this.showDropdown();
      }
    });

    document.addEventListener('click', (e) => {
      e.stopPropagation();

      if (!this.activated) return;

      const clickedInsideDropdown = this.$dropdownEl.contains(e.target);

      if (!clickedInsideDropdown && this.activated) {
        this.closeDropdown();
      }
    });

    window.addEventListener('scroll', () => {
      this.closeDropdown();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closeDropdown();
      }
    });

    this.$dropdownEl.addEventListener('focusout', (e) => {
      e.preventDefault();
      if (e.relatedTarget === null || e.relatedTarget.classList.contains(this.classNames.dropdownWrapper)) {
        this.closeDropdown();
      }
    });
  }

  // The scroll and Escape listeners call this whether or not the dropdown is open. With it closed
  // there is nothing to hide, and focusing the button would draw its focus frame on every scroll.
  closeDropdown() {
    if (!this.activated) return;
    const button = this.$toggler.querySelector('.cmp-button');
    requestAnimationFrame(() => {
      button.focus();
      this.activated = false;
      this.hideDropdown();
    });
  }

  replaceDropdownToRootPage() {
    this.$dropdownEl = this.el.querySelector('.ds-brand-language-switcher-dropdown');
    this.$dropdownEl.hidden = true;

    this.dropdownElLinks = this.$dropdownEl.querySelectorAll('a');

    this.bodyEl.appendChild(this.$dropdownEl);
    this.$dropdownEl.classList.add(this.classNames.inactiveDropdown);
    this.$dropdownEl.style.display = 'none';
    this.$dropdownEl.style.position = 'absolute';
    this.$dropdownEl.style.bottom = '0';
    this.$dropdownEl.style.right = '0';
  }

  setDropdownPosition() {
    const rect = this.$toggler.getBoundingClientRect();
    this.$dropdownEl.style.top = `${rect.bottom + window.scrollY}px`;

    if (this.isMobileBreakpoint()) {
      this.$dropdownEl.style.left = 0;
      this.$dropdownEl.style.right = 0;
    } else {
      this.$dropdownEl.style.left = `${rect.right + window.scrollX - this.$dropdownEl.offsetWidth}px`;
    }
  }

  showDropdown() {
    this.$toggler.classList.add(this.classNames.active);
    const rect = this.$toggler.getBoundingClientRect();

    this.$dropdownEl.hidden = false;
    this.$dropdownEl.setAttribute('tabindex', 0);
    this.$dropdownEl.style.top = `${rect.bottom + window.scrollY}px`;
    this.$dropdownEl.style.display = 'block';
    this.$dropdownEl.style.zIndex = '9999';

    if (this.isMobileBreakpoint()) {
      this.$dropdownEl.style.left = 0;
      this.$dropdownEl.style.right = 0;
    } else {
      this.$dropdownEl.style.left = `${rect.right + window.scrollX - this.$dropdownEl.offsetWidth}px`;
    }
    this.$dropdownEl.style.bottom = 'auto';
    this.$dropdownEl.classList.add(this.classNames.activeDropdown);
    this.$dropdownEl.classList.remove(this.classNames.inactiveDropdown);
    this.$dropdownEl.focus();
  }

  hideDropdown() {
    this.$dropdownEl.removeAttribute('tabindex');
    this.$dropdownEl.classList.remove(this.classNames.activeDropdown);
    this.$dropdownEl.hidden = true;
    this.$dropdownEl.classList.add(this.classNames.inactiveDropdown);
    this.$toggler.classList.remove(this.classNames.active);
    this.$dropdownEl.style.top = '';
    this.$dropdownEl.style.left = '';
    this.$dropdownEl.style.bottom = '0';
    this.$dropdownEl.style.zIndex = '';
    this.$dropdownEl.style.display = 'none';
  }

  isMobileBreakpoint() {
    return window.matchMedia(`(max-width: ${this.mobileBreakpoint})`).matches;
  }

  buildCustomStructure() {
    const rootEl = document.createElement('div');
    rootEl.classList.add('ds-brand-language-switcher');

    const button = document.createElement('div');
    button.className = 'button';

    const cmpNavigation = this.el.querySelector('.cmp-languagenavigation');
    cmpNavigation.classList.add('ds-brand-language-switcher-dropdown');
    const firstCategory = cmpNavigation.querySelector('.cmp-languagenavigation__item--level-0 span');

    const commonGroup = Array.from(cmpNavigation.querySelector(`.${this.classNames.group}`).children);
    commonGroup.forEach((item) => {
      const group = item.querySelector(`.${this.classNames.group}`);
      this.sortLanguagesItems(group);
    });

    const cmpButton = document.createElement('button');
    cmpButton.className = 'cmp-button';

    const span = document.createElement('span');
    span.className = 'cmp-button__text';
    span.textContent = firstCategory.innerText;
    cmpButton.appendChild(span);

    button.appendChild(cmpButton);

    this.el.prepend(button);
  }

  sortLanguagesItems(groupList) {
    Array.from(groupList.children)
      .sort((a, b) => {
        const textA = a.querySelector('.cmp-languagenavigation__item-link').textContent.trim();
        const textB = b.querySelector('.cmp-languagenavigation__item-link').textContent.trim();
        return textA.localeCompare(textB);
      })
      .forEach((li) => groupList.appendChild(li));
  }
}
