export class Tab {
  constructor(options) {
    this.storybookRoot = document.querySelector('#storybook-root');
    this.el = options.el || null;
    this.initializationClass = 'tab--initialization';
    this.elInner = options.el ? options.el.querySelector('.cmp-tabs') : null;
    this.tabList = this.elInner ? this.elInner.querySelector('.cmp-tabs > .cmp-tabs__tablist') : null;
    this.tabLinks = this.tabList ? this.tabList.querySelectorAll('.cmp-tabs__tab') : null;
    this.tabContents = options.el ? options.el.querySelectorAll('.cmp-tabs > .cmp-tabs__tabpanel') : null;
    this.activeIndex = options.activeIndex || null;
    this.previousLinkClass = 'cmp-tabs__tab--previous';
    this.activeLinkClass = 'cmp-tabs__tab--active';
    this.activeContentClass = 'cmp-tabs__tabpanel--active';
    this.tabLinksIndexName = 'tabindex';
    this.tabLinksAriaSelected = 'aria-selected';
    this.tabContentAttribute = 'aria-hidden';
    this.useResponsiveSelectSelector = 'ds-brand-responsive-select-run-js';
    this.responsiveSelectActivatedClass = 'responsive-select';
    this.mobileRestructureClassName = 'modifier-mobile-accordion';

    this.tabItem = 'cmp-tabs__tab';
    this.togglerSelect = null;
    this.selectBox = null;
    this.activatedSelectState = false;
    this.mobileBreakpoint = '767px';
    this.mobileRestructure = false;
    this.mobileRestructureBreakpoint = '1023px';

    this.selectorsSelect = {
      selectBox: 'cmp-tabs__select',
      buttonToggler: 'cmp-tabs__select-button',
      dataSelectId: 'data-select-id',
      activeButtonTogglerClass: 'active',
      activeSelectClass: 'cmp-tabs__select--active',
    };

    this.resizeType = this.el.classList.contains('ds-window-resize-type') ? 'window' : 'block';

    this.cacheStorage = {
      existSelect: false,
    };

    this.init();
  }

  isStorybookPreview() {
    return this.storybookRoot !== null;
  }

  get activeTabIndex() {
    return this.activeIndex || 0;
  }

  set activeTabIndex(index) {
    this.activeIndex = index;
  }

  get activatedSelect() {
    return this.activatedSelectState;
  }

  set activatedSelect(value) {
    this.activatedSelectState = value;
    this.togglerSelect.classList.toggle(this.selectorsSelect.activeButtonTogglerClass);
    this.selectBox.classList.toggle(this.selectorsSelect.activeSelectClass);
  }

  init() {
    if (!this.el) {
      return;
    }
    if (this.el.classList.contains(this.initializationClass)) {
      return;
    }

    this._initPrevClassname();
    this.linksEventClick();
    if (this.activeIndex) {
      this.initTabByIndex(this.activeIndex);
    }
    this.initResponsiveSelect();
    this.initRestructureTabs();
    this.el.classList.add(this.initializationClass);
  }

  initRestructureTabs() {
    if (!this.el.classList.contains(this.mobileRestructureClassName)) {
      return;
    }

    this.resizeType = 'window';
    this.mobileBreakpoint = this.mobileRestructureBreakpoint;

    if (this.isMobileBreakpoint()) {
      this._mountRestructureTabs();
    }

    this._resizeScreenRemount(this._mountRestructureTabs.bind(this), this._unMountRestructureTabs.bind(this));
  }

  initResponsiveSelect() {
    if (!this.isActiveResponsiveSelect()) {
      return;
    }

    if (this._getConditionType()) {
      this._mountResponsiveSelect();
    }

    this._resizeScreenRemount(this._mountResponsiveSelect.bind(this), this._unMountResponsiveSelect.bind(this));
  }

  isActiveResponsiveSelect() {
    return this.el.classList.contains(this.useResponsiveSelectSelector);
  }

  initTabByIndex(linkIndex) {
    if (!this.tabLinks) {
      return;
    }
    this.tabLinks.forEach((el, index) => {
      if (linkIndex === index) {
        el.click();
      }
    });
  }

  linksEventClick() {
    if (!this.tabLinks) {
      return;
    }

    this.tabLinks.forEach((el, index) => {
      el.addEventListener('keyup', (e) => {
        if (e.keyCode === 13 && document.activeElement === el) {
          this._linkEventClick(el, index);
        }
      });

      el.addEventListener('click', (e) => {
        this._linkEventClick(e.target, index);
      });

      el.addEventListener('keydown', (e) => this._onKeydown(e));
    });
  }

  _getTabLinkIndex(tabLinks, tabLink) {
    let currentIndex = -1;

    for (let [i, item] of tabLinks.entries()) {
      if (item.id === tabLink.id) {
        currentIndex = i;
        break;
      }
    }

    return currentIndex;
  }

  _onKeydown(e) {
    const key = e.key;
    const allButtons = Array.from(this.tabLinks);
    let currentIndex = this._getTabLinkIndex(allButtons, e.currentTarget);
    let newIndex = -1;

    if (key === 'ArrowRight' || key === 'ArrowDown') {
      newIndex = (currentIndex + 1) % allButtons.length;
    } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
      newIndex = (currentIndex - 1 + allButtons.length) % allButtons.length;
    } else {
      return;
    }

    if (newIndex >= 0) {
      const next = allButtons[newIndex];

      if (this.isStorybookPreview()) {
        next.focus();
        next.click();
      } else {
        const prev = allButtons[newIndex - 1];
        if (prev) {
          this._clearPreviousTabLinks();
          prev.classList.add(this.previousLinkClass);
        }
      }
    }
    e.preventDefault();
  }

  _linkEventClick(el, index) {
    // if (el.classList.contains(this.activeLinkClass)) return;

    this.activeTabIndex = index;

    if (this.isStorybookPreview()) {
      this.tabContentSwitcher(index);
      el.classList.add(this.activeLinkClass);
      this.tabLinksSwitcher(index);
    }

    this._setClassNameOnPreviousTabLink(el);

    if (this.isActiveResponsiveSelect() && this.togglerSelect) {
      this._setUpdatedDataForSelectToggler(this.togglerSelect, this._getParsedFirstTabItem(index));
      this.closeSelect();
    }
  }

  _clearPreviousTabLinks() {
    for (const item of this.tabLinks) {
      item.classList.remove(this.previousLinkClass);
    }
  }

  _setClassNameOnPreviousTabLink(el) {
    this._clearPreviousTabLinks();

    for (let i = 0; i <= this.tabLinks.length - 1; i++) {
      const item = this.tabLinks[i];

      if (item.getAttribute('id') === el.getAttribute('id')) {
        const prevItem = this.tabLinks[i - 1];

        if (prevItem) {
          prevItem.classList.add(this.previousLinkClass);
        }
      }
    }
  }

  _initPrevClassname() {
    this.tabLinks.forEach((item, i) => {
      if (!item.classList.contains(this.activeLinkClass)) {
        return;
      }
      const prevItem = this.tabLinks[i - 1];
      if (prevItem) {
        prevItem.classList.add(this.previousLinkClass);
      }
    });
  }

  tabLinksSwitcher(tabindex) {
    if (!this.tabLinks) return;
    this.tabLinks.forEach((el, index) => {
      el.classList.remove(this.previousLinkClass);

      if (tabindex === index) {
        el.setAttribute(this.tabLinksIndexName, '0');
        el.setAttribute(this.tabLinksAriaSelected, 'true');
        el.classList.add(this.activeLinkClass);
      } else {
        el.setAttribute(this.tabLinksIndexName, '-1');
        el.setAttribute(this.tabLinksAriaSelected, 'false');
        el.classList.remove(this.activeLinkClass);
      }
    });
  }

  tabContentSwitcher(tabindex) {
    if (!this.isStorybookPreview()) return;

    this.tabContents.forEach((el, index) => {
      if (tabindex === index) {
        el.setAttribute(this.tabContentAttribute, 'true');
        el.classList.add(this.activeContentClass);
      } else {
        el.removeAttribute(this.tabContentAttribute);
        el.classList.remove(this.activeContentClass);
      }
    });
  }

  _mountResponsiveSelect() {
    this.el.classList.add(this.responsiveSelectActivatedClass);
    if (this.cacheStorage.existSelect) {
      return;
    }
    this._generatedSelect();
    this._togglerSelect();
    this._escHandleCloseMenu();
    this._closeMenuClickOutside();
    this._initButtonsNavigation();
    this.cacheStorage.existSelect = true;
  }

  _unMountResponsiveSelect() {
    this.el.classList.remove(this.responsiveSelectActivatedClass);
  }

  _mountRestructureTabs() {
    this.tabLinks.forEach((item, index) => {
      item.after(this.tabContents[index]);
    });
  }

  _unMountRestructureTabs() {
    for (let i = this.tabContents.length - 1; i >= 0; i--) {
      this.tabList.after(this.tabContents[i]);
    }
  }

  _togglerSelect() {
    this.togglerSelect.addEventListener('click', () => {
      this.activatedSelect = !this.activatedSelect;
      setTimeout(() => {
        this.tabLinks[this.activeTabIndex].focus();
      }, 300);
    });
  }

  _onMoundSelect() {
    this.togglerSelect.removeEventListener('click');
  }

  _generatedSelect() {
    const selectBox = document.createElement('div');
    selectBox.classList.add(this.selectorsSelect.selectBox);
    selectBox.append(this._getGeneratedSelectToggler());
    this._changeTabIndexesForSelectList();
    const list = this.tabList;
    selectBox.append(list);
    this.selectBox = selectBox;
    this.elInner.prepend(selectBox);
  }

  _getGeneratedSelectToggler() {
    const button = document.createElement('button');
    button.classList.add(this.selectorsSelect.buttonToggler);
    this._setUpdatedDataForSelectToggler(button, this._getParsedFirstTabItem(this.activeTabIndex));
    this.togglerSelect = button;
    return button;
  }

  _setUpdatedDataForSelectToggler(selectToggler, props) {
    selectToggler.textContent = props.text;
    selectToggler.setAttribute(this.selectorsSelect.dataSelectId, props.id);
  }

  _getParsedFirstTabItem(index) {
    const link = this.tabLinks[index || 0];
    const id = link.getAttribute('id');
    const text = link.innerHTML;

    return {
      id,
      text,
    };
  }

  _escHandleCloseMenu() {
    document.addEventListener('keydown', (e) => {
      if (!this.activatedSelect) {
        return;
      }
      e = e || window.event;
      if (e.keyCode == 27) {
        this.closeSelect();
      }
    });
  }

  _closeMenuClickOutside() {
    window.addEventListener('click', (e) => {
      if (this.activatedSelect && !this.selectBox.contains(e.target)) {
        this.closeSelect();
      }
    });
  }

  _changeTabIndexesForSelectList() {
    this.tabLinks.forEach((item) => {
      item.tabIndex = 1;
    });
  }

  closeSelect() {
    this.activatedSelect = false;
  }

  _resizeScreenRemount(callback1, callback2) {
    let timer = 0;

    window.addEventListener('resize', () => {
      if (this._getConditionType() && timer !== -1) {
        timer = -1;
        callback1();
        return;
      }
      if (!this._getConditionType() && timer !== 0) {
        timer = 0;
        callback2();
        return;
      }
    });
  }

  isMobileBreakpoint() {
    return window.matchMedia(`(max-width: ${this.mobileBreakpoint})`).matches;
  }

  isMobileSize() {
    return this.el.offsetWidth < parseInt(this.mobileBreakpoint);
  }

  _getConditionType() {
    const conditionType = {
      window: this.isMobileBreakpoint(),
      block: this.isMobileSize(),
    };

    return conditionType[this.resizeType];
  }

  _initButtonsNavigation() {
    let pointer = 0;
    document.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowUp' && pointer > 0) {
        pointer -= 1;
        this.tabLinks[pointer].focus();
      }
      if (e.code === 'ArrowDown' && pointer < this.tabLinks.length - 1) {
        pointer += 1;
        this.tabLinks[pointer].focus();
      }
    });
  }
}
