import defineProperty from './define-property.js';

// To use this controller import it in your main js
// and run: new AemHeaderController().init();
export default class AemHeaderController {
  constructor() {
    // Define classNames property
    defineProperty(this, 'classNames', {
      initialization: 'ds-v2_c-header--initialized',
      scrolled: 'ds-v2_c-header--page-scrolled-down',
      dropshadow: 'ds-v2_c-header--shadow',
      hidden: 'ds-v2_c-header--hide-middle-bar',
      inner: 'ds-v2_c-header__inner',
      middleBar: 'ds-v2_c-header__middle-bar',
      topBarBurger: 'ds-v2_c-top-bar__burger-wrap',
      topBar: 'ds-v2_c-header__top-bar',
    });

    // Define eNames property
    defineProperty(this, 'eNames', {
      showHeaderMiddleBar: 'showHeaderMiddleBar',
      hideHeaderMiddleBar: 'hideHeaderMiddleBar',
      openMegaMenu: 'openMegaMenu',
      closeMegaMenu: 'closeMegaMenu',
      headerHeightTrigger: 'headerHeightTrigger',
    });

    this.isActiveStepScroll = false;

    if (document.querySelector('.ds-v2_c-header')) {
      // Assign component node to root.
      this.el = document.querySelector('.ds-v2_c-header');
    }
  }

  // Initialize methods here.
  init() {
    if (this.el) {
      if (this.el.classList.contains(this.classNames.initialization)) {
        return;
      }

      this.lastKnownScrollPos = 0;
      this.ticking = false;
      this.inner = this.el.querySelector(`.${this.classNames.inner}`);
      if (this.inner) this.inner.style.position = 'fixed';
      this.topBarBurger = this.el.querySelector(`.${this.classNames.topBarBurger}`);
      this.topBar = this.el.querySelector(`.${this.classNames.topBar}`);
      this.middleBar = this.el.querySelector(`.${this.classNames.middleBar}`);
      this.setHeaderPadding();
      this.listenCustomEvents();
      this.listenPageScroll();
      this.listenWindowResize();
      if (this.topBarBurger) this.topBarBurger.setAttribute('inert', true);
      // TODO: remove after new header deploy (fix for ACAS-10910)
      this.setHeaderHeightAuto();
      // TODO end of code which mest be removed
      this.el.classList.add(this.classNames.initialization);
    }
  }

  // Create custom methods here.
  listenPageScroll() {
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.setHeaderClass();
          this.handleMiddleBarInert();
          this.handleTopBarBurgerInert();
          this.ticking = false;
        });

        this.ticking = true;
      }
    });
  }

  listenWindowResize() {
    window.addEventListener(
      'resize',
      () => {
        this.setHeaderPadding();
      },
      true,
    );
  }

  setHeaderPadding() {
    if (this.inner) {
      const height = this.inner.offsetHeight;
      this.el.style.paddingTop = `${height}px`;
    }
  }

  headerTriggerHeightEvent(el) {
    document.dispatchEvent(
      new CustomEvent(this.eNames.headerHeightTrigger, {
        detail: {
          height: el.clientHeight,
        },
      }),
    );
  }

  setHeaderClass() {
    const dist = 200;
    const topMargin = 550;

    if (window.scrollY > this.lastKnownScrollPos && window.scrollY > topMargin) {
      this.el.classList.add(this.classNames.scrolled);
      this.lastKnownScrollPos = window.scrollY;

      if (!this.isActiveStepScroll) {
        this.headerTriggerHeightEvent(this.topBar);
        this.isActiveStepScroll = true;
      }
    }

    if (window.scrollY < this.lastKnownScrollPos - dist) {
      this.el.classList.remove(this.classNames.scrolled);
      this.lastKnownScrollPos = window.scrollY;

      if (this.isActiveStepScroll) {
        this.headerTriggerHeightEvent(this.inner);
        this.isActiveStepScroll = false;
      }
    }

    if (window.scrollY < topMargin) {
      this.el.classList.remove(this.classNames.scrolled);
    }

    if (window.scrollY > 1) {
      this.el.classList.add(this.classNames.dropshadow);
    } else {
      this.el.classList.remove(this.classNames.dropshadow);
    }

    if (window.scrollY > 0 && window.scrollY < 2) {
      this.headerTriggerHeightEvent(this.inner);
    }
  }

  listenCustomEvents() {
    document.addEventListener(this.eNames.showHeaderMiddleBar, () => {
      this.el.classList.remove(this.classNames.hidden);
      this.middleBar && this.middleBar.removeAttribute('inert');
    });
    document.addEventListener(this.eNames.hideHeaderMiddleBar, () => {
      this.el.classList.add(this.classNames.hidden);
      this.middleBar && this.middleBar.setAttribute('inert', true);
    });
    document.addEventListener(this.eNames.closeMegaMenu, () => {
      this.el.classList.remove(this.classNames.hidden);
      this.handleMiddleBarInert();
      this.handleTopBarBurgerInert();
      this.handleMiddleBarBurgerFocusOnCloseMegaMenu();
    });
    document.addEventListener(this.eNames.openMegaMenu, () => {
      if (this.topBarBurger) {
        this.topBarBurger.removeAttribute('inert');
        const button = this.topBarBurger.querySelector('.cmp-button');
        button && button.focus();
      }
    });
  }

  handleMiddleBarInert() {
    if (this.el.classList.contains(this.classNames.scrolled)) {
      this.middleBar && this.middleBar.setAttribute('inert', true);
    } else {
      this.middleBar && this.middleBar.removeAttribute('inert');
    }
  }

  handleTopBarBurgerInert() {
    if (this.el.classList.contains(this.classNames.scrolled)) {
      this.topBarBurger && this.topBarBurger.removeAttribute('inert');
    } else {
      this.topBarBurger && this.topBarBurger.setAttribute('inert', true);
    }
  }

  handleMiddleBarBurgerFocusOnCloseMegaMenu() {
    if (!this.el.classList.contains(this.classNames.scrolled) && this.middleBar) {
      const button = this.middleBar.querySelector('.ds-aem_c-burger .cmp-button');
      button && button.focus();
    }
  }

  // TODO: remove after new header deploy (fix for ACAS-10910)
  setHeaderHeightAuto() {
    const headerElement = document.querySelector('.header');

    if (headerElement) {
      headerElement.style.setProperty('height', 'auto', 'important');
    }
  }
  // TODO end of code which must be removed
}
