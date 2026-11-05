// To use this controller import it in your main js
// and run: new AemNavigationController().init();
import defineProperty from './define-property.js';

export default class AemNavigationController {
  constructor() {
    // Define classNames property
    defineProperty(this, 'classNames', {
      el: 'ds-aem_c-navigation',
      linkWithChildren: 'ds-aem_c-mega-menu__link--with-children',
      scroller: 'ds-aem_c-navigation__scroller',
      scrollerVisible: 'ds-aem_c-navigation--scroller-visible',
      scrollerLeftPos: 'ds-aem_c-navigation--scroller-to-left',
      scrollerSvg: 'ds-aem_c-navigation__scroller-icon',
      nav: 'cmp-navigation',
      list: 'cmp-navigation__group',
      initialization: 'ds-aem_c-navigation--initialized',
    });

    // Define eNames property
    defineProperty(this, 'eNames', {
      openMegaMenu: 'openMegaMenu',
      hideHeaderMiddleBar: 'hideHeaderMiddleBar',
    });

    // Define data property
    defineProperty(this, 'data', {
      svgPath: 'M10 23.6667L17.52 16L10 8.33333L12.24 6L22 16L12.24 26L10 23.6667Z',
    });

    if (document.querySelector(`.${this.classNames.el}`)) {
      // Assign component node to root.
      this.el = document.querySelector(`.${this.classNames.el}`);
      this.links = this.el.querySelectorAll('a');
      this.nav = this.el.querySelector(`.${this.classNames.nav}`);
      this.list = this.el.querySelector(`.${this.classNames.list}`);
    }
  }

  // Initialize methods here.
  init() {
    if (this.el) {
      if (this.el.classList.contains(this.classNames.initialization)) {
        return;
      }

      this.getPrimaryNavLinks();
      this.createScroller();
      this.showScroller(this.isNavFits());
      this.listenLinkClick();
      this.listenWindowResize();
      this.listenScroller();
      this.el.classList.add(this.classNames.initialization);
    }
  }

  // Create custom methods here.
  getPrimaryNavLinks() {
    this.primaryNav = document.getElementById('navigation-primary');
  }

  getHrefLinkFromLink(link) {
    return link.getAttribute('href').replace('#', '');
  }

  listenLinkClick() {
    this.links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const isChildrenExist = this.checkPrimaryNavLinkOnChildren(link);
        if (isChildrenExist) {
          const hideMiddleBarEvt = new CustomEvent(this.eNames.hideHeaderMiddleBar);
          const openMegaMenuEvt = new CustomEvent(this.eNames.openMegaMenu, {
            detail: this.getHrefLinkFromLink(e.currentTarget),
          });
          document.dispatchEvent(hideMiddleBarEvt);
          document.dispatchEvent(openMegaMenuEvt);
        } else {
          window.location = link.getAttribute('href');
        }
      });
    });
  }

  checkPrimaryNavLinkOnChildren(link) {
    const hrefId = this.getHrefLinkFromLink(link);
    const prNavLink = this.primaryNav && this.primaryNav.querySelector(`[href*="${hrefId}"]`);
    if (prNavLink && prNavLink.classList.contains(this.classNames.linkWithChildren)) {
      return true;
    } else {
      return false;
    }
  }

  createScroller() {
    const scroller = document.createElement('div');
    scroller.className = this.classNames.scroller;
    const scrollerSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const scrollerSvgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    scrollerSvg.setAttribute('viewBox', '0 0 32 32');
    scrollerSvgPath.setAttribute('d', this.data.svgPath);
    scrollerSvg.classList.add(this.classNames.scrollerSvg);
    scrollerSvg.appendChild(scrollerSvgPath);
    scroller.prepend(scrollerSvg);
    this.el.prepend(scroller);
  }

  listenWindowResize() {
    window.addEventListener(
      'resize',
      () => {
        this.showScroller(this.isNavFits());
      },
      true,
    );
  }

  showScroller(isNavFits) {
    if (!isNavFits) {
      this.el.classList.add(this.classNames.scrollerVisible);
    } else {
      this.el.classList.remove(this.classNames.scrollerVisible);
    }
  }

  isNavFits() {
    const listWidth = this.list && this.list.offsetWidth;
    const navWidth = this.el.offsetWidth;

    if (listWidth > navWidth) {
      return false;
    } else {
      return true;
    }
  }

  listenScroller() {
    const scroller = this.el.querySelector(`.${this.classNames.scroller}`);
    scroller.addEventListener('click', this.scrollTo.bind(this));
  }

  scrollTo() {
    let dist = 0;
    if (!this.el.classList.contains(this.classNames.scrollerLeftPos)) {
      dist = this.list.offsetWidth;
      this.el.classList.add(this.classNames.scrollerLeftPos);
    } else {
      this.el.classList.remove(this.classNames.scrollerLeftPos);
    }

    if (this.isRTL() && dist > 0) dist = -dist;

    this.nav.scroll({
      left: dist,
      behavior: 'smooth',
    });
  }

  isRTL() {
    const dir = getComputedStyle(document.body).direction;
    if (dir === 'rtl') {
      return true;
    } else {
      return false;
    }
  }
}
