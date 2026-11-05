import { SplideCarouselController, responsiveSlidesThreePermove } from './splide-carousel-controller.js';
import { acBrandName } from './ac-brand-const-data.js';

import { splideCarouselProps, splideCarouselSecondaryProps } from './ac-splide-carousel-controller.js';

export class BlockSplideGridCarouselController {
  carousels = null;

  init() {
    const editMode = document.querySelectorAll('.aem-AuthorLayer-Edit');
    if (editMode.length > 0) return;

    this.runSplideCarousels();
    this.runSplideSecondaryCarousels();
  }

  runSplideCarousels() {
    const carouselSelector = `${acBrandName}-splide-grid-carousel`;

    const elements = document.querySelectorAll(`.${carouselSelector}`);
    if (!elements.length) return;

    const buttonGridToggler = `.${acBrandName}-grid-button`;
    const buttonCarouselToggler = `.${acBrandName}-carousel-button`;

    const carousels = new SplideCarouselController(carouselSelector, splideCarouselProps);
    carousels.init();

    this.carousels = carousels;

    this.runTogglers(elements);
  }

  runSplideSecondaryCarousels() {
    const carouselSelector = `${acBrandName}-splide-grid-carousel-secondary`;

    const elements = document.querySelectorAll(`.${carouselSelector}`);
    if (!elements.length) return;

    const buttonGridToggler = `.${acBrandName}-grid-button`;
    const buttonCarouselToggler = `.${acBrandName}-carousel-button`;

    const carousels = new SplideCarouselController(carouselSelector, splideCarouselSecondaryProps);
    carousels.init();

    this.carousels = carousels;

    this.runTogglers(elements);
  }

  runTogglers(elements) {
    const buttonGridToggler = `.${acBrandName}-grid-button`;
    const buttonCarouselToggler = `.${acBrandName}-carousel-button`;

    elements.forEach((el) => {
      const rootContainer = el.parentElement;
      const gridButtonElement = rootContainer.querySelector(buttonGridToggler);
      const carouselButtonElement = rootContainer.querySelector(buttonCarouselToggler);

      if (!gridButtonElement) return;
      if (!carouselButtonElement) return;

      gridButtonElement.addEventListener('click', () =>
        this.viewAsGrid(rootContainer, gridButtonElement, carouselButtonElement),
      );
      carouselButtonElement.addEventListener('click', () =>
        this.viewAsCarousel(rootContainer, gridButtonElement, carouselButtonElement),
      );
    });
  }

  viewAsGrid(el, gridButton, carouselButton) {
    const splideCarouselElement = el.querySelector('.ds-splide-carousel');
    const splide = el.querySelector('.splide');
    const carouselInstance = this.carousels.$carouselInstanse.find((instance) => instance.root === splide);
    carouselInstance?.destroy();

    if (!splideCarouselElement) return;

    splideCarouselElement.classList.add('grid-col-3');

    this.carousels.resetStructureForCarousel(splideCarouselElement);

    gridButton.classList.remove('active');
    carouselButton.classList.add('active');
  }

  viewAsCarousel(el, gridButton, carouselButton) {
    const splideCarouselElement = el.querySelector('.ds-splide-carousel');

    if (!splideCarouselElement) return;

    splideCarouselElement.classList.remove('grid-col-3');

    this.carousels.mount(splideCarouselElement);

    carouselButton.classList.remove('active');
    gridButton.classList.add('active');
  }
}
