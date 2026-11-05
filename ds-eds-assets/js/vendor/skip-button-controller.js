import SkipButtonClass from './skip-button-class.js';

// To use this controller import it in your main js
// and run: new AemSkipButtonController().init();
export default class AemSkipButtonController {
  init() {
    const elements = document.querySelectorAll('.ds-aem_c-skip-button');
    elements.forEach((el) => new SkipButtonClass(el));
  }
}
