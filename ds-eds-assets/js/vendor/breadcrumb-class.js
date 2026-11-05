import defineProperty from './define-property.js';

export default class BreadcrumbClass {
  constructor(el) {
    if (!el) return;

    // Define classNames property
    defineProperty(this, 'classNames', {
      initialization: 'ds-aem_c-breadcrumb--initialized',
      breadcrumbList: 'cmp-breadcrumb__list',
      breadcrumbItem: 'cmp-breadcrumb__item',
      breadcrumbLink: 'cmp-breadcrumb__item-link',
      breadcrumbItemTrimmed: 'cmp-breadcrumb__item--trimmed',
      breadcrumbItemHidden: 'cmp-breadcrumb__item--hidden',
    });

    if (el.classList.contains(this.classNames.initialization)) {
      return;
    }

    // Assign component node to root.
    this.breadcrumb = el;
    this.breadcrumbList = el.querySelector(`.${this.classNames.breadcrumbList}`);
    this.breadcrumbItems = el.querySelectorAll(`.${this.classNames.breadcrumbItem}`);
    this.breadcrumbLinks = el.querySelectorAll(`.${this.classNames.breadcrumbLink}`);
    this.data = [];

    el.classList.add(this.classNames.initialization);

    if (!this.breadcrumbList || !this.breadcrumbItems.length || !this.breadcrumbLinks.length) return;

    this.getBreadcrumbData();
    this.fitBreadcrumb();
    this.listenWindowResize();
    this.listenTrimmedLinkClick();
  }

  // Create custom methods here.
  listenWindowResize() {
    window.addEventListener(
      'resize',
      () => {
        this.checkBreadcrumbFit();
      },
      true,
    );
  }

  getBreadcrumbData() {
    this.breadcrumbItems.forEach((el, i, array) => {
      const infoObj = {
        trimmed: false,
        hidden: false,
        changesEnabled: true,
      };

      infoObj.width = el.offsetWidth;

      if (i === array.length - 2 || i === array.length - 1 || i === 0) {
        infoObj.changesEnabled = false;
      }

      this.data.push(infoObj);
    });
  }

  fitBreadcrumb() {
    let i = this.breadcrumbLinks.length;
    while (i > 0) {
      this.checkBreadcrumbFit();
      i--;
    }
  }

  checkBreadcrumbFit() {
    const bWidth = this.getBreadcrumbWidth();
    const maxBWidth = this.getMaxBreadcrumbWidth();
    const difference = maxBWidth - bWidth;

    if (bWidth > maxBWidth) {
      this.modifyBreadcrumb('narrower');
    } else {
      this.modifyBreadcrumb('wider', difference);
    }
  }

  getBreadcrumbWidth() {
    return this.breadcrumbList.offsetWidth;
  }

  getMaxBreadcrumbWidth() {
    return this.breadcrumb.offsetWidth;
  }

  modifyBreadcrumb(action, difference) {
    if (action === 'narrower') {
      for (let i = 0; i < this.data.length; i++) {
        const obj = this.data[i];
        if (obj.changesEnabled === false) continue;
        if (obj.changesEnabled === true && obj.trimmed === false) {
          this.trimmBreadcrumbLinkText(i);
          this.data[i].trimmed = true;
          if (this.data[i - 1] && this.data[i - 1].trimmed === true) {
            this.hideBreadcrumbItem(i - 1);
            this.data[i - 1].hidden = true;
          }
          break;
        }
      }
    }

    if (action === 'wider') {
      for (let i = this.data.length - 1; i > 0; i--) {
        const obj = this.data[i];
        if (obj.changesEnabled === false) continue;
        if (obj.changesEnabled === true && obj.trimmed === true && obj.width <= difference) {
          this.untrimmBreadcrumbLinkText(i);
          this.data[i].trimmed = false;
          if (this.data[i - 1] && this.data[i - 1].hidden === true) {
            this.showBreadcrumbItem(i - 1);
            this.data[i - 1].hidden = false;
          }
          break;
        }
      }
    }
  }

  trimmBreadcrumbLinkText(i) {
    this.breadcrumbItems[i].classList.add(`${this.classNames.breadcrumbItemTrimmed}`);
  }

  untrimmBreadcrumbLinkText(i) {
    this.breadcrumbItems[i].classList.remove(`${this.classNames.breadcrumbItemTrimmed}`);
  }

  hideBreadcrumbItem(i) {
    this.breadcrumbItems[i].classList.add(`${this.classNames.breadcrumbItemHidden}`);
  }

  showBreadcrumbItem(i) {
    this.breadcrumbItems[i].classList.remove(`${this.classNames.breadcrumbItemHidden}`);
  }

  listenTrimmedLinkClick() {
    this.breadcrumbItems.forEach((item) => {
      item.addEventListener('click', () => {
        const prevItem = item.previousElementSibling;
        if (prevItem.classList.contains(`${this.classNames.breadcrumbItemHidden}`)) this.toggleBreadcrumbMenu();
      });
    });
  }

  toggleBreadcrumbMenu() {
    // console.log('toggleBreadcrumbMenu');
  }
}
