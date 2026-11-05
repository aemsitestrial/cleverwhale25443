// To use this controller import it in your main js
// and run: new AemMegaMenuController().init();
import defineProperty from './define-property.js';

export default class AemMegaMenuController {
  constructor() {
    // Define classNames property
    defineProperty(this, 'classNames', {
      el: 'ds-aem_c-mega-menu',
      isVisible: 'ds-aem_c-mega-menu--is-visible',
      menuInner: 'ds-aem_c-mega-menu__inner',
      logo: 'ds-aem_c-mega-menu__logo',
      nav: 'ds-aem_c-mega-menu__nav',
      primaryNav: 'ds-aem_c-mega-menu__primary-navigation',
      secondaryNav: 'ds-aem_c-mega-menu__secondary-navigation',
      linkWithChildrenJs: 'ds-aem_c-mega-menu__link--with-children',
      item: 'cmp-navigation__item',
      itemLv0: 'cmp-navigation__item--level-0',
      itemLv: 'cmp-navigation__item--level-',
      itemActiveJs: 'ds-aem_c-mega-menu__item--active',
      itemLink: 'cmp-navigation__item-link',
      group: 'cmp-navigation__group',
      groupCurrentJs: 'ds-aem_c-mega-menu__group--current',
      groupNarrowJs: 'ds-aem_c-mega-menu__group--narrow',
      groupActiveJs: 'ds-aem_c-mega-menu__group--active',
      info: 'ds-aem_c-mega-menu__nav-info',
      submenuOpenerInfo: 'ds-aem_c-mega-menu__nav-submenu-opener-info',
      submenuOpenerText: 'ds-aem_c-mega-menu__nav-submenu-opener-text',
      submenuOverlay: 'ds-aem_c-mega-menu__nav-submenu-overlay',
      submenuOpener: 'ds-aem_c-mega-menu__nav-submenu-opener',
      groupAdditionalInfo: 'ds-aem_c-mega-menu__nav-info-additional',
      back: 'ds-aem_c-mega-menu__back',
      backSvg: 'ds-aem_c-mega-menu__icon-back',
      close: 'ds-aem_c-mega-menu__close',
      closeText: 'cmp-button__text',
      overlay: 'ds-aem_c-mega-menu__overlay',
      additionalInfo: 'ds-aem_c-mega-menu__additional-info',
      additionalInfoHidden: 'ds-aem_c-mega-menu__nav-info-additional--hidden',
      additionalInfoItem: 'ds-aem_c-mega-menu__additional-info-item',
      transitionRun: 'ds-aem_c-mega-menu--transition-run',
      differentWritingType: 'ds-aem_c-mega-menu--different-writing-type',
      initialization: 'ds-aem_c-mega-menu--initialized',
      stopTransition: 'ds-aem_c-mega-menu-stop-transitions',
      locatorActive: 'locator--initialization',
    });

    // Define eNames property
    defineProperty(this, 'eNames', {
      openMegaMenu: 'openMegaMenu',
      closeMegaMenu: 'closeMegaMenu',
      dirChange: 'dirChange',
    });

    // Define data property
    defineProperty(this, 'data', {
      svgPath:
        'M16 9.14288L17.2257 10.3369L12.4429 15.1429H22.8572V16.8572H12.4429L17.2257 21.634L16 22.8572L9.14288 16L16 9.14288Z M16 28C13.6266 28 11.3066 27.2962 9.33316 25.9776C7.35977 24.6591 5.8217 22.7849 4.91345 20.5922C4.0052 18.3995 3.76756 15.9867 4.23058 13.6589C4.6936 11.3311 5.83649 9.19295 7.51472 7.51472C9.19295 5.83649 11.3311 4.6936 13.6589 4.23058C15.9867 3.76756 18.3995 4.0052 20.5922 4.91345C22.7849 5.8217 24.6591 7.35977 25.9776 9.33316C27.2962 11.3066 28 13.6266 28 16C27.9964 19.1815 26.731 22.2317 24.4813 24.4813C22.2317 26.731 19.1815 27.9964 16 28ZM16 5.71429C13.9657 5.71429 11.977 6.31754 10.2856 7.44775C8.59409 8.57795 7.27575 10.1844 6.49724 12.0638C5.71874 13.9433 5.51505 16.0114 5.91193 18.0066C6.3088 20.0019 7.28842 21.8346 8.72691 23.2731C10.1654 24.7116 11.9981 25.6912 13.9934 26.0881C15.9886 26.485 18.0567 26.2813 19.9362 25.5028C21.8156 24.7243 23.4221 23.4059 24.5523 21.7144C25.6825 20.023 26.2857 18.0343 26.2857 16C26.2826 13.273 25.1979 10.6586 23.2697 8.73034C21.3414 6.80207 18.727 5.7174 16 5.71429Z',
    });

    defineProperty(this, 'columns', {
      minWidth: 200,
      maxWidth: 400,
      narrowColumnWidth: 48,
    });

    if (document.querySelector(`.${this.classNames.el}`)) {
      // Assign component node to root.
      this.el = document.querySelector(`.${this.classNames.el}`);
      this.logo = this.el.querySelector(`.${this.classNames.logo}`);
      this.menuInner = document.querySelector(`.${this.classNames.menuInner}`);
      this.backText = this.el.dataset.backText;
      this.mainMenuText = this.el.dataset.mainMenuText;
      this.nav = this.el.querySelector(`.${this.classNames.nav}`);
      this.primaryNav = this.el.querySelector(`.${this.classNames.primaryNav}`);
      this.secondaryNav = this.el.querySelector(`.${this.classNames.secondaryNav}`);
      // Max nav depth in AEM, set as constant
      this.MAX_DEPTH = 5;
      this.groups = this.primaryNav ? this.primaryNav.querySelectorAll(`.${this.classNames.group}`) : [];
      const currentPage = this.primaryNav ? this.primaryNav.querySelector(`[aria-current="page"]`) : null;
      this.itemsActive = this.getParentsByClass(currentPage, this.classNames.item);
      this.close = this.el.querySelector(`.${this.classNames.close}`);
      this.overlay = this.el.querySelector(`.${this.classNames.overlay}`);
      this.closeMegaMenu = new CustomEvent(this.eNames.closeMegaMenu);
      this.isMobileView = false;
      this.isRTL = false;
    }
  }

  // Initialize methods here.
  init() {
    if (this.el) {
      if (this.el.classList.contains(this.classNames.initialization)) {
        return;
      }

      // Do not change invoke order
      this.checkIsMobile();
      this.checkIsRTL();
      this.detectDifferentWritingTypeLanguage();
      this.setClassOnLinksWithChildren();
      this.createCustomElements();
      this.setMarginOnBackEl();
      this.updateMenuView();
      this.listenUserActions();
      this.listenMegaMenuTransition();
      this.handleInert();
      this.el.classList.add(this.classNames.initialization);
    }
  }

  // Create custom methods here.
  createCustomElements() {
    this.createOverlay();
    this.setAdditionalColumnsInfo();
    this.setPrimaryNavColumnsInfo();
  }

  updateMenuView(data) {
    this.removeGroupCurrent();
    let currentLevel = null;

    if (data) {
      const item = data.navColumn.closest(`.${this.classNames.itemActiveJs}`);

      if (item) {
        currentLevel = this.getLevelFromMenuItem(item);
      }

      this.addGroupCurrent(data.navColumn);
      this.removeActiveItems(data.activeItems);
      if (data.expand) this.addActiveItems(this.getParentItems(data.link));
    } else {
      this.setActiveClassOnNavItem();
      this.setCurrentClassOnNavGroup();
    }

    if (currentLevel === 0) {
      this.removeNarrowGroupsFromSubmenuLv1Items();
    } else {
      this.removeNarrowGroupsFromAnotherLv0Items();
    }

    this.removeHideClassOnNotCurrentAdditionalInfo();
    this.updateMenuSizesAndPositionateItsElements();

    this.handleMenuElementsInert();
  }

  removeNarrowGroupsFromSubmenuLv1Items() {
    if (!this.primaryNav) return;

    const narrowGroups = this.primaryNav.querySelectorAll(`.${this.classNames.groupNarrowJs}`);
    narrowGroups.forEach((group) => {
      group.classList.remove(this.classNames.groupNarrowJs);
    });
  }

  removeNarrowGroupsFromAnotherLv0Items() {
    if (!this.primaryNav) return;

    const narrowGroups = this.primaryNav.querySelectorAll(`.${this.classNames.groupNarrowJs}`);
    narrowGroups.forEach((group) => {
      const closestLv0Item = group && group.closest(`.${this.classNames.itemLv0}`);
      if (closestLv0Item && !closestLv0Item.classList.contains(this.classNames.itemActiveJs)) {
        group.classList.remove(this.classNames.groupNarrowJs);
      }
    });
  }

  updateMenuViewOnLinkInteraction(link) {
    const data = this.getMenuDataForUpdate(link);
    data && this.updateMenuView(data);
  }

  updateMenuViewOnSubmenuTogglerInteraction(toggler) {
    const data = this.getMenuDataForUpdateSubmenuToggler(toggler);
    data && this.updateMenuView(data);
  }

  updateMenuSizesAndPositionateItsElements() {
    if (this.isMobileView) {
      this.resetInlineStylesForColumns();
      this.resetInlineStylesForCloseButton();
      this.setMenuInnerMinHeight();

      return;
    }
    this.flexibleFitMenuToScreen();
    this.setClosePosition();
    this.setMenuInnerMinHeight();
  }

  listenUserActions() {
    this.listenLinkWithChildrenClick();
    this.listenBackClick();
    this.listenSubmenuOpenerNarrowState();
    this.listenWindowResize();
    this.listenCustomEvents();
    this.listenCloseClick();
    this.listenOverlayClick();
    this.listenUserKeyboard();
  }

  setClassOnLinksWithChildren() {
    this.groups.forEach((el) => {
      const link = el.previousElementSibling;
      if (link) {
        link.classList.add(this.classNames.linkWithChildrenJs);
        // attribute used for sharepoint integration
        link.setAttribute('data-interception', 'off');
      }
    });
  }

  setActiveClassOnNavItem() {
    if (!this.itemsActive.length) return;

    this.itemsActive.forEach((el) => {
      this.addActiveItem(el);
    });
  }

  setCurrentClassOnNavGroup() {
    if (this.itemsActive.length) {
      this.itemsActive.forEach((el) => {
        const link = el.firstElementChild;
        const current = link.getAttribute('aria-current');

        if (current && current === 'page') {
          const isChildrenPresent = link.classList.contains(this.classNames.linkWithChildrenJs);
          let navColumn = null;
          if (isChildrenPresent) {
            navColumn = link.nextElementSibling;
          } else {
            navColumn = link.closest(`.${this.classNames.group}`);
          }
          this.addGroupCurrent(navColumn);
        }
      });
    } else {
      this.groups.length > 0 && this.addGroupCurrent(this.groups[0]);
    }
  }

  setMarginOnBackEl() {
    const back = this.primaryNav ? this.primaryNav.querySelectorAll(`.${this.classNames.back}`) : [];
    const closeButtonText =
      document.querySelector(`.${this.classNames.close} .${this.classNames.closeText}`) ||
      document.querySelector('.ds-aem_c-mega-menu__close-text');

    if (!back.length || !closeButtonText) return;

    const closeButtonTextWidth = closeButtonText.offsetWidth;
    // hardcoded value of button inner space
    const closeButtonInnerSpace = 52;
    const spaceReserveBetweenEls = 15;
    const margin = closeButtonTextWidth + closeButtonInnerSpace + spaceReserveBetweenEls;

    back.forEach((el) => {
      el.style.marginInlineEnd = `${margin}px`;
    });
  }

  getMenuDataForUpdateSubmenuToggler(toggler) {
    if (!toggler) return null;

    const data = {
      navColumn: null,
      activeItems: null,
      link: null,
      expand: null,
    };

    data.link = toggler;

    data.navColumn = toggler.closest(`.${this.classNames.group}`);

    if (toggler.parentNode && toggler.parentNode.classList.contains(this.classNames.itemActiveJs)) {
      data.activeItems = data.navColumn.querySelectorAll(`.${this.classNames.itemActiveJs}`);
      data.expand = false;
    } else {
      data.activeItems = this.primaryNav ? this.primaryNav.querySelectorAll(`.${this.classNames.itemActiveJs}`) : [];
      data.expand = true;
    }

    return data;
  }

  getMenuDataForUpdate(link) {
    if (!link) return null;

    const data = {
      navColumn: null,
      activeItems: null,
      link: null,
      expand: null,
    };

    data.link = link;

    if (link.parentNode && link.parentNode.classList.contains(this.classNames.itemActiveJs)) {
      data.navColumn = link.closest(`.${this.classNames.group}`);
      data.activeItems = data.navColumn.querySelectorAll(`.${this.classNames.itemActiveJs}`);
      data.expand = false;
    } else {
      data.navColumn = link.nextElementSibling;
      data.activeItems = this.primaryNav ? this.primaryNav.querySelectorAll(`.${this.classNames.itemActiveJs}`) : [];
      data.expand = true;
    }

    return data;
  }

  removeGroupCurrent() {
    const groupCurrent = this.primaryNav && this.primaryNav.querySelector(`.${this.classNames.groupCurrentJs}`);
    if (groupCurrent) groupCurrent.classList.remove(this.classNames.groupCurrentJs);
  }

  addGroupCurrent(el) {
    el.classList.add(this.classNames.groupCurrentJs);
  }

  removeActiveItems(elements) {
    elements.forEach((activeItem) => {
      this.removeActiveItem(activeItem);
    });
  }

  removeActiveItem(el) {
    el.classList.remove(this.classNames.itemActiveJs);
  }

  addActiveItems(elements) {
    elements.forEach((activeItem) => {
      this.addActiveItem(activeItem);
    });
  }

  addActiveItem(el) {
    el.classList.add(this.classNames.itemActiveJs);
  }

  getParentItems(el) {
    let item = el;
    let itemsList = [];
    for (let index = 0; index < this.MAX_DEPTH; index++) {
      item = item.closest(`.${this.classNames.item}`);
      if (item) {
        itemsList.push(item);
        item = item.parentNode;
      } else {
        break;
      }
    }
    return itemsList;
  }

  resetInlineStylesForColumns() {
    const activeGroups = this.getActiveGroups();

    activeGroups.forEach((element) => {
      element.removeAttribute('style');
    });
  }

  resetInlineStylesForCloseButton() {
    this.close.removeAttribute('style');
  }

  getFreeNavigationAreaWidth() {
    const maxWidth = document.body.clientWidth;
    const mainColumnWidth = this.getMenuMainColumnWidth();
    const closeWidth = this.getCloseBarWidth();
    return maxWidth - (mainColumnWidth + closeWidth);
  }

  setWidthForColumn(column, width) {
    const minWidth = `${width}px`;
    const maxWidth = `${width}px`;

    column.style.minWidth = minWidth;
    column.style.maxWidth = maxWidth;

    if (this.isRTL) {
      column.style.transform = `translateX(-${minWidth})`;
    } else {
      column.style.transform = `translateX(${minWidth})`;
    }
  }

  flexibleFitMenuToScreen() {
    if (!this.primaryNav) return;

    const freeNavigationAreaWidth = this.getFreeNavigationAreaWidth();
    const activeGroups = this.getActiveGroups();
    const additionalInfo = this.primaryNav.querySelector(
      `.${this.classNames.groupCurrentJs} > .${this.classNames.groupAdditionalInfo}`,
    );

    let activeGroupLength = activeGroups.length;
    let narrowColN = 0;
    let flexibleRepeatN = activeGroupLength;

    if (additionalInfo) {
      activeGroups.push(additionalInfo);
      activeGroupLength += 1;
    }

    const isNarrowAction = freeNavigationAreaWidth / activeGroupLength < this.columns.minWidth;

    const narrowAction = (narrowColCounter) => {
      if (narrowColCounter > activeGroupLength - 1) return;
      flexibleRepeatN = activeGroupLength - narrowColCounter;

      const freeNavWithNarrowColumns = freeNavigationAreaWidth - this.columns.narrowColumnWidth * narrowColCounter;
      const flexibleWidthColumn = freeNavWithNarrowColumns / flexibleRepeatN;

      for (let index = 0; index < flexibleRepeatN; index++) {
        const element = activeGroups[narrowColN + index];

        if (flexibleWidthColumn < this.columns.minWidth) {
          element.removeAttribute('style');
          this.makeNavColumnNarrower(element);

          const classes = document.body.classList;
          classes.remove(this.classNames.stopTransition);

          narrowColN++;
          narrowAction(narrowColN);
          return;
        }

        if (flexibleWidthColumn >= this.columns.minWidth) {
          this.setWidthForColumn(element, flexibleWidthColumn);
          this.makeNavColumnWider(element);

          if (element.classList.contains(this.classNames.additionalInfoHidden)) {
            element.classList.remove(this.classNames.additionalInfoHidden);
          }
        }

        if (freeNavWithNarrowColumns <= this.columns.maxWidth && additionalInfo) {
          const freeNavWithNarrowColumns =
            freeNavigationAreaWidth - this.columns.narrowColumnWidth * (narrowColCounter - 1);
          const flexibleWidthColumn = freeNavWithNarrowColumns / flexibleRepeatN;

          const prevMenu = activeGroups[narrowColN + index - 1];
          additionalInfo.classList.add(this.classNames.additionalInfoHidden);
          element.removeAttribute('style');
          this.setWidthForColumn(prevMenu, flexibleWidthColumn);
          this.makeNavColumnWider(prevMenu);
        }
      }
    };

    if (isNarrowAction) {
      narrowAction(narrowColN);
      return;
    }

    if (!(freeNavigationAreaWidth / activeGroupLength > this.columns.minWidth)) return;

    for (let index = 0; index < activeGroupLength; index++) {
      const element = activeGroups[index];

      const flexibleWidthColumn = freeNavigationAreaWidth / activeGroupLength;
      if (element.classList.contains(this.classNames.groupNarrowJs)) {
        this.makeNavColumnWider(element);
      }

      if (flexibleWidthColumn > this.columns.maxWidth) {
        this.setWidthForColumn(element, this.columns.maxWidth);
      } else {
        this.setWidthForColumn(element, flexibleWidthColumn);

        if (
          element.classList.contains(this.classNames.groupAdditionalInfo) &&
          element.classList.contains(this.classNames.additionalInfoHidden)
        ) {
          element.classList.remove(this.classNames.additionalInfoHidden);
        }
      }
    }
  }

  hideCurrentAdditionalColumnsInfo() {
    const additionalInfo = this.getGroupAdditionalInfo();
    if (additionalInfo) additionalInfo.classList.add(this.classNames.additionalInfoHidden);
  }

  showCurrentAdditionalColumnsInfo() {
    const additionalInfo = this.getGroupAdditionalInfo();
    if (additionalInfo) additionalInfo.classList.remove(this.classNames.additionalInfoHidden);
  }

  removeHideClassOnNotCurrentAdditionalInfo() {
    const hiddenAdditionalInfo =
      this.primaryNav && this.primaryNav.querySelector(`.${this.classNames.additionalInfoHidden}`);
    if (
      hiddenAdditionalInfo &&
      !hiddenAdditionalInfo.parentNode.classList.contains(`.${this.classNames.groupCurrentJs}`)
    ) {
      hiddenAdditionalInfo.classList.remove(this.classNames.additionalInfoHidden);
    }
  }

  makeNavColumnNarrower(col) {
    col.classList.add(this.classNames.groupNarrowJs);
  }

  makeNavColumnWider(col) {
    col.classList.remove(this.classNames.groupNarrowJs);
  }

  getMenuMainColumnWidth() {
    return this.nav ? this.nav.offsetWidth : 0;
  }

  getTotalWidthOfDomElements(domElemens) {
    let sumActiveGroupsWidth = 0;

    if (domElemens.length > 0) {
      domElemens.forEach((group) => {
        sumActiveGroupsWidth += group.offsetWidth;
      });
    }

    return sumActiveGroupsWidth;
  }
  // 1 - check
  getNavWidth() {
    let totalWidth = 0;

    const sumActiveGroupsWidth = this.getTotalWidthOfDomElements(this.getActiveGroups());

    let groupAdditionalInfoWidth = 0;
    const groupAdditionalInfo = this.getGroupAdditionalInfo();

    if (groupAdditionalInfo && !groupAdditionalInfo.classList.contains(this.classNames.additionalInfoHidden))
      groupAdditionalInfoWidth = groupAdditionalInfo.offsetWidth;

    totalWidth = sumActiveGroupsWidth + groupAdditionalInfoWidth;
    return totalWidth;
  }

  getActiveGroups() {
    const activeGroups = [];
    const itemsActive = this.primaryNav ? this.primaryNav.querySelectorAll(`.${this.classNames.itemActiveJs}`) : [];

    if (itemsActive.length) {
      itemsActive.forEach((el) => {
        const group = el.querySelector(`.${this.classNames.group}`);
        if (group) activeGroups.push(group);
      });
    }

    return activeGroups;
  }

  getGroupAdditionalInfo() {
    const groupAdditionalInfo =
      this.primaryNav &&
      this.primaryNav.querySelector(`.${this.classNames.groupCurrentJs} > .${this.classNames.groupAdditionalInfo}`);

    return groupAdditionalInfo;
  }

  getCloseBarWidth() {
    return this.close ? this.close.offsetWidth : 0;
  }

  setClosePosition() {
    if (this.isMobileView) return;
    const x = this.getNavWidth();

    if (this.isRTL) {
      if (this.close) this.close.style.transform = `translateX(-${x}px)`;
    } else {
      if (this.close) this.close.style.transform = `translateX(${x}px)`;
    }
  }

  setMenuInnerMinHeight() {
    if (this.menuInner) {
      setTimeout(() => {
        this.menuInner.style.minHeight = '';
        const TOP_MARGIN = 40;
        let additionalInfoHeight = 0;
        const colCurr = this.primaryNav && this.primaryNav.querySelector(`.${this.classNames.groupCurrentJs}`);
        const colFirst = this.primaryNav && this.primaryNav.querySelector(`.${this.classNames.group}`);
        const columnCurrent = colCurr ? colCurr : colFirst;
        const groupAdditionalInfo = this.getGroupAdditionalInfo();

        if (groupAdditionalInfo && !groupAdditionalInfo.classList.contains(this.classNames.additionalInfoHidden))
          additionalInfoHeight = groupAdditionalInfo.firstElementChild
            ? groupAdditionalInfo.firstElementChild.offsetHeight
            : 0;
        const columnHeight = columnCurrent ? columnCurrent.offsetHeight : 0;
        const minHeight = Math.max(window.innerHeight - TOP_MARGIN, columnHeight, additionalInfoHeight);

        if (this.isMobileView) {
          const activeItem = columnCurrent ? columnCurrent.closest(`.${this.classNames.itemActiveJs}`) : null;

          // if we are in root primaryNav
          if (!activeItem) {
            this.menuInner.style.height = 'auto';
          } else {
            this.menuInner.style.height = `${minHeight}px`;
          }
        } else {
          this.menuInner.style.height = 'auto';
          this.menuInner.style.minHeight = `${minHeight}px`;
        }
      }, 0);
    }
  }

  getMegaMenuMaxWidth() {
    const scrollBarWidth = 17;
    return document.body.offsetWidth - scrollBarWidth;
  }

  listenLinkWithChildrenClick() {
    const linksWithChildren = this.primaryNav
      ? this.primaryNav.querySelectorAll(`.${this.classNames.linkWithChildrenJs}`)
      : [];

    linksWithChildren.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        this.resetInlineStylesForColumns();
        this.resetInlineStylesForCloseButton();
        this.updateMenuViewOnLinkInteraction(link);
      });
    });
  }

  listenBackClick() {
    const back = this.primaryNav ? this.primaryNav.querySelectorAll(`.${this.classNames.back}`) : [];

    back.forEach((el) => {
      el.addEventListener('click', () => {
        const item = el.closest(`.${this.classNames.itemActiveJs}`);
        const link = item.firstElementChild;
        const groupNarrow = item.closest(`.${this.classNames.groupNarrowJs}`);
        if (groupNarrow) groupNarrow.classList.remove(this.classNames.groupNarrowJs);
        this.updateMenuViewOnLinkInteraction(link);
      });
    });
  }

  listenSubmenuOpenerNarrowState() {
    const submenuToggler = this.primaryNav ? this.primaryNav.querySelectorAll(`.${this.classNames.submenuOpener}`) : [];

    submenuToggler.forEach((el) => {
      el.addEventListener('click', () => {
        this.updateMenuViewOnSubmenuTogglerInteraction(el);
      });
    });
  }

  getLevelFromMenuItem(menuItem) {
    const classname = Array.from(menuItem.classList).find((item) => {
      return item.startsWith(this.classNames.itemLv);
    });
    return +classname.replace(this.classNames.itemLv, '');
  }

  listenWindowResize() {
    let timer = 0;
    const classes = document.body.classList;

    window.addEventListener(
      'resize',
      () => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        } else {
          classes.add(this.classNames.stopTransition);
        }

        timer = setTimeout(() => {
          classes.remove(this.classNames.stopTransition);
          timer = null;
        }, 100);

        this.checkIsMobile();
        this.updateMenuSizesAndPositionateItsElements();
        this.handleMenuElementsInert();
      },
      true,
    );
  }

  listenCustomEvents() {
    document.addEventListener(this.eNames.closeMegaMenu, () => {
      this.hideMegaMenu();
      this.removeActiveItems(document.querySelectorAll(`.${this.classNames.itemActiveJs}`));
      this.updateMenuView();
    });

    document.addEventListener(this.eNames.openMegaMenu, (event) => {
      if (event.detail) {
        const link =
          this.primaryNav && this.primaryNav.querySelector(`.cmp-navigation__item-link[href*="${event.detail}"]`);

        if (link) {
          this.removeActiveItems(document.querySelectorAll(`.${this.classNames.itemActiveJs}`));
          this.updateMenuViewOnLinkInteraction(link);
        }
      }

      this.showMegaMenu();
    });

    document.addEventListener(this.eNames.dirChange, () => {
      this.checkIsRTL();
    });
  }

  listenCloseClick() {
    if (!this.close) return;

    this.close.addEventListener('click', () => {
      document.dispatchEvent(this.closeMegaMenu);
    });
    // listen keyup instead keydown as due to
    // focus on burger after mega menu close
    // keydown triggers click on burger therefore
    // it will lead to mega menu open again
    this.close.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        document.dispatchEvent(this.closeMegaMenu);
      }
    });
  }

  listenOverlayClick() {
    if (!this.overlay) return;

    this.overlay.addEventListener('click', () => {
      document.dispatchEvent(this.closeMegaMenu);
    });
  }

  listenUserKeyboard() {
    document.addEventListener(
      this.eNames.openMegaMenu,
      () => {
        document.addEventListener('keydown', (event) => {
          if (this.el.classList.contains(this.classNames.isVisible)) {
            if (event.key === 'Escape') this.esc();
            if (event.key === 'Backspace') this.backspace();
          }
        });
      },
      { once: true },
    );
  }

  esc() {
    document.dispatchEvent(this.closeMegaMenu);
  }

  backspace() {
    const groupCurrent = this.primaryNav && this.primaryNav.querySelector(`.${this.classNames.groupCurrentJs}`);
    if (groupCurrent) {
      const item = groupCurrent.closest(`.${this.classNames.itemActiveJs}`);

      if (!item) return;

      const link = item.firstElementChild;
      const groupNarrow = item.closest(`.${this.classNames.groupNarrowJs}`);

      if (groupNarrow) groupNarrow.classList.remove(this.classNames.groupNarrowJs);
      this.updateMenuViewOnLinkInteraction(link);
    }
  }

  createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = this.classNames.overlay;
    this.insertAfter(overlay, this.el);
  }

  setAdditionalColumnsInfo() {
    this.isAdditionalInfoPresent();
    if (!this.additionalInfo) return;

    const items = this.additionalInfo.querySelectorAll(`.${this.classNames.additionalInfoItem}`);

    items.forEach((item) => {
      const id = item.dataset.id;
      const link = this.primaryNav && this.primaryNav.querySelector(`[data-id="${id}"]`);

      if (!link || !link.nextElementSibling) return;

      const navColumnAdditionalInfo = document.createElement('li');
      navColumnAdditionalInfo.className = this.classNames.groupAdditionalInfo;
      navColumnAdditionalInfo.dataset.id = id;

      const navColumn = link.nextElementSibling;
      navColumn.appendChild(navColumnAdditionalInfo);
      const columnAdditionalInfo = navColumn.querySelector(`.${this.classNames.groupAdditionalInfo}[data-id="${id}"]`);
      columnAdditionalInfo.appendChild(item);
    });
  }

  isAdditionalInfoPresent() {
    this.additionalInfo = document.querySelector(`.${this.classNames.additionalInfo}`);
  }

  setPrimaryNavColumnsInfo() {
    const linksWithChildren = this.primaryNav
      ? this.primaryNav.querySelectorAll(`.${this.classNames.linkWithChildrenJs}`)
      : [];

    if (!linksWithChildren.length) return;

    linksWithChildren.forEach((el) => {
      const linkText = el.innerText;
      const linkPath = el.href;
      const navColumn = el.nextElementSibling;
      const closestGroup = el.closest(`.${this.classNames.group}`);
      const parentLink = closestGroup ? closestGroup.previousElementSibling : null;
      const info = document.createElement('li');
      const back = document.createElement('button');
      const submenuOpenerInfo = document.createElement('li');
      const submenuOverlay = document.createElement('li');
      const columnText = parentLink ? parentLink.innerText : this.mainMenuText;
      let infoTitle;
      const backSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const backPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

      if (
        linkPath === undefined ||
        linkPath === '' ||
        linkPath === '#' ||
        (linkPath && linkPath.split('#')[1] === '')
      ) {
        infoTitle = document.createElement('b');
        infoTitle.textContent = linkText;
      } else {
        infoTitle = document.createElement('a');
        infoTitle.textContent = linkText;
        infoTitle.href = linkPath;
      }

      backSvg.setAttribute('viewBox', '0 0 32 32');
      backPath.setAttribute('d', this.data.svgPath);
      //back.textContent = `${this.backText} ${columnText}`;
      // Set this to english only for now
      back.textContent = 'Back';
      back.classList.add(this.classNames.back);
      backSvg.classList.add(this.classNames.backSvg);
      backSvg.appendChild(backPath);
      back.prepend(backSvg);

      submenuOpenerInfo.classList.add(this.classNames.submenuOpenerInfo);
      const submenuOpener = document.createElement('button');
      submenuOpener.classList.add(this.classNames.submenuOpener);
      const submenuOpenerText = document.createElement('span');
      submenuOpenerText.classList.add(this.classNames.submenuOpenerText);
      submenuOpenerText.innerText = linkText;
      submenuOpenerInfo.appendChild(submenuOpener);
      submenuOpenerInfo.appendChild(submenuOpenerText);

      submenuOverlay.classList.add(this.classNames.submenuOverlay);

      info.classList.add(this.classNames.info);
      info.appendChild(back);
      info.appendChild(infoTitle);

      navColumn.prepend(info);
      navColumn.prepend(submenuOpenerInfo);
      navColumn.prepend(submenuOverlay);
    });
  }

  showMegaMenu() {
    this.el.classList.add(this.classNames.isVisible);
    document.querySelector('html').style.overflow = 'hidden';
    document.body.style.overflow = 'scroll';

    this.addExtraspaceTopForLocator();
  }

  hideMegaMenu() {
    this.el.classList.remove(this.classNames.isVisible);
    document.querySelector('html').style.overflow = '';
    document.body.style.overflow = '';

    this.removeExtraspaceTopForLocator();
  }

  addExtraspaceTopForLocator() {
    const locator = document.querySelector(`.${this.classNames.locatorActive}`);
    this.el.style.paddingTop = locator ? `${locator.offsetHeight}px` : '';
  }

  removeExtraspaceTopForLocator() {
    this.el.style.removeProperty('padding-top');
  }

  listenMegaMenuTransition() {
    document.addEventListener(this.eNames.openMegaMenu, () => {
      this.el.classList.add(this.classNames.transitionRun);
    });
    document.addEventListener(this.eNames.closeMegaMenu, () => {
      this.el.classList.add(this.classNames.transitionRun);
    });
    this.el.addEventListener('transitionend', () => {
      this.el.classList.remove(this.classNames.transitionRun);
    });
  }

  checkIsMobile() {
    this.isMobileView = window.innerWidth < 768;
  }

  checkIsRTL() {
    const dir = getComputedStyle(document.body).direction;
    if (dir === 'rtl') {
      this.isRTL = true;
    } else {
      this.isRTL = false;
    }
  }

  handleInert() {
    this.el.setAttribute('inert', true);

    document.addEventListener(this.eNames.openMegaMenu, () => {
      this.el.removeAttribute('inert');
    });

    document.addEventListener(this.eNames.closeMegaMenu, () => {
      this.el.setAttribute('inert', true);
    });
  }

  handleMenuElementsInert() {
    this.el.querySelectorAll('[inert="true"]').forEach((el) => {
      el.removeAttribute('inert');
    });
    this.handleMenuElementsInertDesktop();
    this.handleMenuElementsInertMobile();
  }

  handleMenuElementsInertDesktop() {
    if (this.isMobileView) return;
    const groupCurrent = this.primaryNav && this.primaryNav.querySelector(`.${this.classNames.groupCurrentJs}`);

    // handle backTo buttons
    const backButtons = this.primaryNav ? this.primaryNav.querySelectorAll(`.${this.classNames.back}`) : [];
    backButtons.length &&
      backButtons.forEach((backButton) => {
        backButton.setAttribute('inert', true);
      });

    const currentBackButton = groupCurrent ? groupCurrent.querySelector(`.${this.classNames.back}`) : null;
    currentBackButton && currentBackButton.removeAttribute('inert');

    // handle additional info blocks
    const addInfo = this.primaryNav ? this.primaryNav.querySelectorAll(`.${this.classNames.groupAdditionalInfo}`) : [];
    addInfo.length &&
      addInfo.forEach((info) => {
        info.setAttribute('inert', true);
      });

    const currentAddInfo = this.getGroupAdditionalInfo();
    currentAddInfo && currentAddInfo.removeAttribute('inert');

    // handle group blocks
    this.groups.forEach((group) => {
      group.setAttribute('inert', true);
    });

    groupCurrent && groupCurrent.removeAttribute('inert');

    const currentGroupParents = this.getParentsByClass(groupCurrent, this.classNames.group);
    currentGroupParents.length &&
      currentGroupParents.forEach((group) => {
        group.removeAttribute('inert');
      });
  }

  handleMenuElementsInertMobile() {
    if (!this.isMobileView) return;
    const groupCurrent = this.primaryNav && this.primaryNav.querySelector(`.${this.classNames.groupCurrentJs}`);

    if (groupCurrent && groupCurrent.parentNode && groupCurrent.parentNode.id === 'navigation-primary') {
      // unInert elements
      this.logo && this.logo.removeAttribute('inert');
      this.secondaryNav && this.secondaryNav.removeAttribute('inert');
    } else {
      // condition added just in case if this.primaryNav not rendered in template
      if (groupCurrent !== null) {
        // Inert elements
        this.logo && this.logo.setAttribute('inert', true);
        this.secondaryNav && this.secondaryNav.setAttribute('inert', true);
      }
    }

    // handle items
    const items = this.primaryNav ? this.primaryNav.querySelectorAll(`.${this.classNames.item}`) : [];
    items.length &&
      items.forEach((item) => {
        item.setAttribute('inert', true);
      });

    // handle groups
    const groups = this.primaryNav ? this.primaryNav.querySelectorAll(`.${this.classNames.group}`) : [];
    groups.length &&
      groups.forEach((group) => {
        group.setAttribute('inert', true);
      });

    // handle additional info blocks
    const addInfo = this.primaryNav ? this.primaryNav.querySelectorAll(`.${this.classNames.groupAdditionalInfo}`) : [];
    addInfo.length &&
      addInfo.forEach((info) => {
        info.setAttribute('inert', true);
      });

    // handle info blocks
    const info = this.primaryNav ? this.primaryNav.querySelectorAll(`.${this.classNames.info}`) : [];
    info.length &&
      info.forEach((info) => {
        info.setAttribute('inert', true);
      });

    // unInert current
    const firstGroup = this.primaryNav && this.primaryNav.querySelector(`.${this.classNames.group}`);
    firstGroup && firstGroup.removeAttribute('inert');

    const currentGroupParentItems = this.getParentsByClass(groupCurrent, this.classNames.item);
    currentGroupParentItems.length &&
      currentGroupParentItems.forEach((item) => {
        item.removeAttribute('inert');
        const itemLink = item.querySelector(`:scope > .${this.classNames.itemLink}`);
        itemLink && itemLink.setAttribute('inert', true);
        const group = item.querySelector(`:scope > .${this.classNames.group}`);
        group && group.removeAttribute('inert');
      });

    const currentAddInfo = this.getGroupAdditionalInfo();
    currentAddInfo && currentAddInfo.removeAttribute('inert');

    const currInfo = groupCurrent ? groupCurrent.querySelector(`.${this.classNames.info}`) : null;
    currInfo && currInfo.removeAttribute('inert');

    const currGroupItems = groupCurrent ? groupCurrent.querySelectorAll(`:scope > .${this.classNames.item}`) : [];
    currGroupItems.length &&
      currGroupItems.forEach((item) => {
        item.removeAttribute('inert');
      });
  }

  getParentsByClass(el, className) {
    if (!el) return [];
    let parents = [];
    let parent = el.parentNode;
    while (parent) {
      if (parent.classList && parent.classList.contains(className)) {
        parents.push(parent);
      }
      parent = parent.parentNode;
    }
    return parents;
  }

  insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextElementSibling);
  }

  detectDifferentWritingTypeLanguage() {
    const url = window.location.href;
    const lang = document.documentElement.getAttribute('lang');
    const languageRegex = /^(ja-jp|ko-kr|ar|ar-eg|cn|zh-cn|zh-tw)$/;
    const urlRegex = /\/(ja-jp|ko-kr|ar|ar-eg|cn|zh-cn|zh-tw)(\/|[?#]|$)/;
    const langMatch = lang ? lang.match(languageRegex) : null;
    const urlMatch = url.match(urlRegex);
    const isMatch = Boolean(langMatch || urlMatch);

    if (isMatch) this.el.classList.add(this.classNames.differentWritingType);
  }
}
