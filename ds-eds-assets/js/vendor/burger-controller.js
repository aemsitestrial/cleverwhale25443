import BurgerClass from './burger-class.js';

// To use this controller import it in your main js
// and run: new AemBurgerController().init();
export default class AemBurgerController {
  init() {
    const elements = document.querySelectorAll('.ds-aem_c-burger');
    elements.forEach((el) => new BurgerClass(el));
  }
}
