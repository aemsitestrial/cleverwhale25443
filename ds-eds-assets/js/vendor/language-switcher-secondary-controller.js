import LanguageSwitcherSecondaryClass from './language-switcher-secondary-class.js';

// To use this controller import it in your main js
// and run: new AemLanguageSwitcherController().init();
export default class AemLanguageSwitcherSecondaryController {
  init() {
    const elements = document.querySelectorAll('.ds-brand-language-switcher');
    elements.forEach((el) => new LanguageSwitcherSecondaryClass(el));
  }
}
