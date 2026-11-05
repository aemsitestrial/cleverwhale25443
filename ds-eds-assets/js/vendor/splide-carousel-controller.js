import { Splide } from './splide.esm.js';

// to extend options you cat get new from https://splidejs.com/guides/options/

export class SplideCarouselController {
  // Options
  /**
   * @param {string} type // Default = 'slide'. The type of the carousel. params: "loop", "fade" - A carousel with the fade transition. This does not support the perPage option, "slide" - default type
   */
  /**
   * @param {boolean} arrows // Default = true. Determines whether to create arrows or not. This option still must be true if you provide arrows by HTML.
   */
  /**
   * @param {boolean} cover // Default = true. Converts the image src to the css background-image URL of the parent element. This requires height, fixedHeight or heightRatio option.
   */
  /**
   * @param {number} perPage // Determines the number of slides to display in a page. The value must be an integer.
   */
  /**
   * @param {number} perMove // Determines the number of slides to move at once. The following example displays 3 slides per page but moves slides one by one. The value must be an integer.
   */
  /**
   * @param {number} speed // Default = 400. The transition speed in milliseconds If 0, the carousel immediately jumps to the target slide
   */
  /**
   * @param {number | string}  { left?: number | string, right?: number | string } | { top?: number | string, bottom?: number | string }  // Sets padding left/right for the horizontal carousel or top/bottom for the vertical carousel. Provide a single value to set the same size for both, or an object literal for different sizes. The CSS format is acceptable, such as 1em.
   */
  /**
   * @param {boolean} pagination // Default = true Determines whether to create pagination (indicator dots) or not.
   */

  /**
   * @param {boolean} mobile // Default = false Run carousel only when screen size less then 787px
   */

  options = {
    type: 'loop',
    arrows: true,
    cover: true,
    mobile: false,
    direction: document.querySelector('html')?.dir ?? 'ltr',

    adaptiveControles: false,
  };

  /**
   * @param {string} carousel // carousel classname
   */

  constructor(carousel, options) {
    this.carouselBaseSelector = '.ds-splide-carousel';
    this.carouselSlideBaseSelector = 'ds-splide-carousel__slide';
    this.carouselSlideCloneClassName = '.splide__slide--clone';
    this.carouselArrowsBoxClassName = '.splide__arrows';
    this.carousel = carousel;
    this.carouselSelector = '.splide';
    this.options = {
      ...this.options,
      ...options,
    };

    this.mobileCarouselBreakpoint = '767px';

    this.editModeClassNames = ['aem-AuthorLayer-Edit', 'aem-AuthorLayer-Preview', 'aem-AuthorLayer-initial'];
    this.innactiveClassName = 'ds-splide-carousel--innactive';

    this.initClassName = 'ds-splide-carousel--initialized';
    this.adaptiveControles = options.adaptiveControles; // if need to put together in one div bullets and buttons

    this.splideClasses = {
      root: 'splide',
      track: 'splide__track',
      list: 'splide__list',
      slide: 'splide__slide',
    };

    this.$carouselCollection = document.querySelectorAll(`.${this.carousel}`);
    this.$carouselInstanse = [];
    this.$bulletsContainer = null;
    this.$controlsContainer = null;
    this.adaptiveControlsCls = 'splide__actions-adaptive';

    this.expandCls = 'ds-brand-expand';

    this.cmpListClassName = 'cmp-list';
    this.cmpListItemClassName = 'cmp-list__item';
  }

  init() {
    if (!document.querySelectorAll(`.${this.carousel}`).length) return;
    this.run();
  }

  prepareStructureForCarousel(carousel) {
    const splide = document.createElement('div');
    splide.classList.add(this.splideClasses.root);
    const splideTrack = document.createElement('div');
    splideTrack.classList.add(this.splideClasses.track);
    const splideList = document.createElement('div');
    splideList.classList.add(this.splideClasses.list);

    const $cmpList = carousel.querySelector(`.${this.cmpListClassName}`);

    let slideItems = [];

    if ($cmpList) {
      slideItems = $cmpList.querySelectorAll(`.${this.cmpListItemClassName}`);
    } else {
      slideItems = carousel.querySelectorAll('.aem-GridColumn');
    }

    slideItems.forEach((slide) => {
      const slideWrapper = document.createElement('div');
      slideWrapper.classList.add(this.carouselSlideBaseSelector);

      if (slide.hasAttribute('id')) {
        slideWrapper.setAttribute('id', slide.getAttribute('id'));
        slide.removeAttribute('id');
      }

      slideWrapper.classList.add(this.splideClasses.slide);

      if ($cmpList) {
        slideWrapper.append(slide);
      } else {
        slideWrapper.append(slide);
      }

      splideList.appendChild(slideWrapper);
    });

    let carouselWrapper = null;

    if ($cmpList) {
      carouselWrapper = carousel.querySelector(`.cmp-container > .list > .${this.cmpListClassName}`);
    } else {
      carouselWrapper = carousel.querySelector('.cmp-container > .aem-Grid');
    }

    carouselWrapper.innerHTML = '';
    splide.append(splideTrack);
    carouselWrapper.append(splide);
    splideTrack.append(splideList);
    this.controls = this.options.controls || false;
  }

  prepareAdaptiveControles() {
    const tempCopy = this.$bulletsContainer;
    if (this.bulletsContainer) {
      this.$bulletsContainer.remove();
    }
    if (this.$controlsContainer && tempCopy) {
      this.$controlsContainer.appendChild(tempCopy);
      this.$controlsContainer.classList.add(this.adaptiveControlsCls);
    }
  }

  resetStructureForCarousel(carousel) {
    const uniqSlidesForGrid = carousel.querySelectorAll(
      `.${this.carouselSlideBaseSelector}:not(${this.carouselSlideCloneClassName}) > div`,
    );
    const uniqSlidesForList = carousel.querySelectorAll(
      `.${this.carouselSlideBaseSelector}:not(${this.carouselSlideCloneClassName}) > li`,
    );

    const uniqSlides = uniqSlidesForGrid.length ? uniqSlidesForGrid : uniqSlidesForList;
    if (!uniqSlides.length) return;

    const $cmpList = carousel.querySelector(`.${this.cmpListClassName}`);

    let carouselWrapper = null;

    if ($cmpList) {
      carouselWrapper = carousel.querySelector(`.cmp-container .list .${this.cmpListClassName}`);
    } else {
      carouselWrapper = carousel.querySelector('.cmp-container .aem-Grid');
    }

    carouselWrapper.innerHTML = '';
    uniqSlides.forEach((slide) => carouselWrapper.append(slide));
  }

  setInnactiveClass() {
    this.$carouselCollection.forEach((carousel) => {
      carousel.classList.add(this.innactiveClassName);
    });
  }

  run() {
    if (!this.$carouselCollection.length) return;

    this.$carouselCollection.forEach((carousel, index) => {
      if (carousel.classList.contains(this.initClassName) && carousel.classList.contains('cq-Editable-dom')) return;

      carousel.setAttribute('id', `${this.splideClasses.root}-carousel-0${++index}`);
      if (this.isMobileBreakpoint()) {
        this.mount(carousel);
      } else if (!this.options.mobile) {
        this.mount(carousel);
      }
      carousel.classList.add(this.initClassName);
    });

    this.resizeScreenRemount();
  }

  resizeScreenRemount() {
    let timer = 0;

    window.addEventListener('resize', () => {
      if (this.isMobileBreakpoint() && timer !== -1) {
        timer = -1;
        this.$carouselCollection.forEach((carousel) => {
          if (carousel) {
            this.mount(carousel);
          }
        });
        return;
      }
      if (!this.isMobileBreakpoint() && timer !== 0) {
        timer = 0;
        this.unmount();
        return;
      }
    });
  }

  isMobileBreakpoint() {
    return this.options.mobile && window.matchMedia(`(max-width: ${this.mobileCarouselBreakpoint})`).matches;
  }

  mount(carousel) {
    this.prepareStructureForCarousel(carousel);

    const $carousel = carousel.querySelector(this.carouselSelector);
    const firstSlide = $carousel.querySelector(`.${this.carouselSlideBaseSelector}`);

    // A carousel with no slides has nothing to mount. Throwing here would also stop every
    // carousel after it on the page from mounting.
    if (!firstSlide) return;

    const splideCarousel = new Splide($carousel, this.options);

    this.$carouselInstanse.push(splideCarousel);

    const firstSlideImage = firstSlide.querySelector('img');

    splideCarousel.mount();

    if (carousel.classList.contains(this.expandCls)) {
      const arrows = carousel.querySelector(this.carouselArrowsBoxClassName);

      this.expandLink = this.getGeneratedExpandLink(firstSlideImage.src || '/');

      arrows.append(this.expandLink);
    }

    this.$bulletsContainer = carousel.querySelector('ul.splide__pagination');

    this.$controlsContainer = carousel.querySelector('div.splide__arrows');

    splideCarousel.on('active', (slideObj) => {
      const $slide = slideObj.slide;
      const image = $slide.querySelector('img');

      if (image && this.expandLink) {
        this.updateExpandLink(image.src);
      }
    });

    if (this.adaptiveControles && this.$controlsContainer) {
      this.prepareAdaptiveControles();
    }
  }

  unmount() {
    this.$carouselInstanse.forEach((instanse) => instanse.destroy());
    this.$carouselCollection.forEach((item) => this.resetStructureForCarousel(item));
  }

  updateExpandLink(url) {
    if (!this.expandLink) return;
    this.expandLink.setAttribute('href', url);
  }

  getGeneratedExpandLink(value) {
    const link = document.createElement('a');

    link.setAttribute('href', value);
    link.setAttribute('target', '_blank');
    link.classList.add('splide__arrow');
    link.classList.add('splide__arrow--expand');
    return link;
  }
}

export const responsiveSlidesTwo = {
  640: {
    perPage: 1,
  },
  768: {
    perPage: 2,
  },
};

export const responsiveSlidesThree = {
  640: {
    perPage: 1,
  },
  768: {
    perPage: 2,
  },
  1024: {
    perPage: 3,
  },
};

export const responsiveSlidesFour = {
  640: {
    perPage: 1,
  },
  768: {
    perPage: 2,
  },
  1024: {
    perPage: 3,
  },
  1366: {
    perPage: 4,
  },
};

export const responsiveSlidesTwoPermove = {
  640: {
    perPage: 1,
    perMove: 1,
  },
  768: {
    perPage: 2,
    perMove: 2,
  },
};

export const responsiveSlidesThreePermove = {
  640: {
    perPage: 1,
    perMove: 1,
  },
  768: {
    perPage: 2,
    perMove: 2,
  },
  1024: {
    perPage: 3,
    perMove: 3,
  },
};

export const responsiveSlidesFourPermove = {
  640: {
    perPage: 1,
    perMove: 1,
  },
  768: {
    perPage: 2,
    perMove: 2,
  },
  1024: {
    perPage: 3,
    perMove: 3,
  },
  1366: {
    perPage: 4,
    perMove: 4,
  },
};

export default SplideCarouselController;
