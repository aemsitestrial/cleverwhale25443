export class FooterController {
  constructor() {
    this.$el = document.querySelector('.ds-brand-button__back-to-top');
    this.init(this.$el);
  }

  // Initialize methods here.
  init(el) {
    if (!el) return;
    this.initSticky();
  }

  initSticky() {
    if (!this.$el) return;
    this.$el.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }
}
