import BreadcrumbClass from './breadcrumb-class.js';

// To use this controller import it in your main js
// and run: new AemBreadcrumbController().init();
export default class AemBreadcrumbController {
  init() {
    const elements = document.querySelectorAll('.ds-aem_c-breadcrumb');
    elements.forEach((el) => new BreadcrumbClass(el));
  }
}
