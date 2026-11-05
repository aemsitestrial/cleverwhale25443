import LanguageSwitcherClass from './language-switcher-class.js';

// To use this controller import it in your main js
// and run: new AemLanguageSwitcherController().init();
export default class AemLanguageSwitcherController {
  init() {
    const elements = document.querySelectorAll('.ds-aem_c-language-switcher');
    elements.forEach((el) => new LanguageSwitcherClass(el));
  }
}
