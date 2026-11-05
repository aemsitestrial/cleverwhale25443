import { SplideCarouselController, responsiveSlidesThreePermove } from './splide-carousel-controller.js';
import { acBrandName } from './ac-brand-const-data.js';

export const splideCarouselProps = {
  perPage: 3.5,
  perMove: 1,
  focus: 0,
  omitEnd: true,
  adaptiveControles: true,
  breakpoints: {
    4000: { perPage: 3.5 },
    1440: { perPage: 2.5 },
    1200: { perPage: 1.5 },
    1024: { perPage: 3 },
    580: { perPage: 1.2 },
    390: { perPage: 1 },
  },
  type: 'default',
};

export const splideCarouselSecondaryProps = {
  perPage: 3,
  perMove: 1,
  focus: 0,
  omitEnd: true,
  adaptiveControles: true,
  breakpoints: {
    1440: { perPage: 3 },
    1280: { perPage: 2 },
    1023: { perPage: 3 },
    860: { perPage: 2 },
    580: { perPage: 1.2 },
    390: { perPage: 1 },
  },
  type: 'default',
};

export class ACSplideCarouselController {
  carousels = null;

  init() {
    const editMode = document.querySelectorAll('.aem-AuthorLayer-Edit');
    if (editMode.length > 0) return;

    this.runSplideCarousels();
  }

  runSplideCarousels() {
    const carousels = new SplideCarouselController(`${acBrandName}-splide-carousel`, splideCarouselProps);
    carousels.init();

    this.carousels = carousels;
  }
}
export class ACSplideCarouselRTLController {
  carousels = null;

  init() {
    const editMode = document.querySelectorAll('.aem-AuthorLayer-Edit');
    if (editMode.length > 0) return;

    this.runSplideCarousels();
  }

  runSplideCarousels() {
    const carousels = new SplideCarouselController(`${acBrandName}-splide-carousel`, {
      ...splideCarouselProps,
      direction: 'rtl',
    });
    carousels.init();

    this.carousels = carousels;
  }
}
