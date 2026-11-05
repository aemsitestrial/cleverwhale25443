export class Carousel {
  constructor(options) {
    this.el = options.el || null;
    this.options = options;

    this.initClassName = 'cmp-carousel--initialized';

    this.actionDisableCn = 'cmp-carousel__action--disabled';
    this.hideBtnCn = 'hidden';
    this.hiddenAttrButton = 'hidden';
    this.disabledAttrButton = 'disabled';
    this.activeSlideCls = 'cmp-carousel__item--active';
    this.activeBulletCls = 'cmp-carousel__indicator--active';
    this.hiddenSlideAttribute = 'aria-hidden';
    this.adaptiveControlsCls = 'cmp-carousel__actions-adaptive';
    this.contentCls = 'cmp-carousel__content';

    this.$carouselSlides = null;
    this.$contentCarousel = null;
    this.autoplay = null;
    this.autoplayDelay = null;
    this.activeSlideIndex = 0;
    this.lengthSlides = null;
    this.bullets = false;
    this.controls = false;
    this.$bulletsContainer = null;
    this.$controlsContainer = null;
    this.$bullets = null;
    this.$btnPrev = null;
    this.$btnNext = null;
    this.$btnPlay = null;
    this.$btnPause = null;
    this.autopauseDisabled = this.$btnPause ? !this.$btnPause.classList.contains(this.actionDisableCn) : true;
    this.adaptiveControles = options.adaptiveControles ?? false; // if need to put together in one div bullets and buttons
    this.expand = this.el.parentNode.classList.contains('ds-brand-expand');
    this.expandLink = null;

    this.init();
  }

  set activeSlide(slideIndex) {
    this.activeSlideIndex = slideIndex;
    this.setActiveSlideByIndex(slideIndex);

    if (this.bullets) {
      this.setActiveBulletByIndex(slideIndex);
    }
  }

  get activeSlide() {
    return this.activeSlideIndex;
  }

  setupValues() {
    this.$carouselSlides = this.el.querySelectorAll('.cmp-carousel__item');
    this.autoplay = this.el.hasAttribute('data-cmp-autoplay') ? true : false;
    this.autoplayDelay = parseInt(this.el.getAttribute('data-cmp-delay'));
    this.lengthSlides = this.el.querySelectorAll('.cmp-carousel__item').length;
    this.bullets = this.options.bullets || false;
    this.controls = this.options.controls || false;
    this.$bulletsContainer = this.el.querySelector('.cmp-carousel__indicators');
    this.$controlsContainer = this.el.querySelector('.cmp-carousel__actions');
    this.$bullets = this.el.querySelectorAll('.cmp-carousel__indicator');
    this.$btnPrev = this.el.querySelector('.cmp-carousel__action--previous');
    this.$btnNext = this.el.querySelector('.cmp-carousel__action--next');
    this.$btnPlay = this.el.querySelector('.cmp-carousel__action--play');
    this.$btnPause = this.el.querySelector('.cmp-carousel__action--pause');
  }

  init() {
    if (!this.el) return;

    this.setupValues();

    if (this.isRun()) return;

    this.el.classList.add(this.initClassName);

    this.generateAdditionalControles();

    if (this.bullets) {
      this.bulletsToggler();
    } else {
      this.$bulletsContainer?.setAttribute('hidden', '');
    }

    if (this.controls) {
      this.controlsToggler();
    } else {
      this.$controlsContainer?.setAttribute('hidden', '');
    }

    if (this.autoplay && this.autopauseDisabled) {
      this.runAutoplay();
    }

    if (this.adaptiveControles) {
      this.prepareAdaptiveControles();
    }
  }

  isRun() {
    return this.el.classList.contains(this.initClassName);
  }

  runAutoplay() {
    this.autoplayTimeout = setInterval(() => {
      if (this.activeSlideIndex + 1 <= this.lengthSlides - 1) {
        this.activeSlide += 1;
      } else {
        this.activeSlide = 0;
      }
    }, this.autoplayDelay);
  }

  initActiveSlideByIndex(index) {
    if (!this.$carouselSlides?.length) return;
    const array = Array.prototype.slice.call(this.$carouselSlides);
    array[index].classList.add(this.activeSlideCls);
  }

  bulletsToggler() {
    if (!this.$bullets && !this.bullets) return;

    this.$bullets?.forEach((el, index) => {
      el.addEventListener('click', (e) => {
        this.activeSlide = index;
        this.setActiveBulletByIndex(index);
        this.updateExpandLink(this.getUrlFromImageSlide(this.$carouselSlides[index]));
      });
    });
  }

  setActiveSlideByIndex(indexSlide) {
    this.$carouselSlides?.forEach((el, index) => {
      if (index === indexSlide) {
        el.classList.add(this.activeSlideCls);
        el.setAttribute(this.hiddenSlideAttribute, 'true');
      } else {
        el.classList.remove(this.activeSlideCls);
        el.removeAttribute(this.hiddenSlideAttribute);
      }
    });
  }

  setActiveBulletByIndex(indexBullet) {
    this.$bullets?.forEach((el, index) => {
      if (index === indexBullet) {
        el.classList.add(this.activeBulletCls);
      } else {
        el.classList.remove(this.activeBulletCls);
      }
    });
  }

  controlsToggler() {
    this.$btnPrev?.addEventListener('click', (e) => {
      e.preventDefault();
      this.goPrevSlide();
    });

    this.$btnNext?.addEventListener('click', (e) => {
      e.preventDefault();
      this.goNextSlide();
    });
    if (this.autoplay) {
      this.playSlides();
      this.pauseSlides();
    } else {
      this.hideAutoplayButtons();
    }
  }

  hideAutoplayButtons() {
    this.$btnPlay?.setAttribute('hidden', '');
    this.$btnPause?.setAttribute('hidden', '');
  }

  playSlides() {
    this.$btnPause?.addEventListener('click', (e) => {
      e.preventDefault();
      e.currentTarget?.classList.add(this.hideBtnCn);
      this.statePlayButton('remove');
      this.pauseAutoplay();
    });
  }

  pauseSlides() {
    this.$btnPlay?.addEventListener('click', (e) => {
      e.preventDefault();
      e.currentTarget?.classList.add(this.hideBtnCn);
      this.statePauseButton('remove');
      this.runAutoplay();
    });
  }

  goNextSlide() {
    if (this.activeSlideIndex + 1 <= this.lengthSlides - 1) {
      this.activeSlide += 1;
    } else {
      this.activeSlide = 0;
    }
    this.updateExpandLink(this.getUrlFromImageSlide(this.$carouselSlides[this.activeSlide]));
  }

  goPrevSlide() {
    if (this.activeSlideIndex - 1 >= 0) {
      this.activeSlide -= 1;
    } else {
      this.activeSlide = this.lengthSlides - 1;
    }
    this.updateExpandLink(this.getUrlFromImageSlide(this.$carouselSlides[this.activeSlide]));
  }

  pauseAutoplay() {
    clearInterval(this.autoplayTimeout);
  }

  // state - add / remove
  statePlayButton(state) {
    if (!this.$btnPlay) return;
    this.$btnPlay.classList[state](this.hideBtnCn);

    if (state === 'add') {
      this.$btnPlay.setAttribute(this.disabledAttrButton, '');
      this.$btnPlay.classList.add(this.actionDisableCn);
    } else {
      this.$btnPlay.removeAttribute(this.disabledAttrButton);
      this.$btnPlay.classList.remove(this.actionDisableCn);
    }
  }

  statePauseButton(state) {
    if (!this.$btnPause) return;
    this.$btnPause.classList[state](this.hideBtnCn);

    if (state === 'add') {
      this.$btnPause.setAttribute(this.disabledAttrButton, '');
      this.$btnPause.classList.add(this.actionDisableCn);
    } else {
      this.$btnPause.removeAttribute(this.disabledAttrButton);
      this.$btnPause.classList.remove(this.actionDisableCn);
    }
  }

  prepareAdaptiveControles() {
    const tempCopy = this.$bulletsContainer;
    this.$bulletsContainer.remove();
    this.$controlsContainer.appendChild(tempCopy);
    this.$controlsContainer.classList.add(this.adaptiveControlsCls);
  }

  generateAdditionalControles() {
    if (this.expand) {
      const expandLink = this.getGeneratedExpandLink();
      this.$controlsContainer.append(expandLink);
      this.expandLink = expandLink;

      this.updateExpandLink(this.getUrlFromImageSlide(this.$carouselSlides[0]));
    }
  }

  getUrlFromImageSlide(slide) {
    const img = slide.querySelector('img');
    if (img && img.src.length) return img.src;
    return '/';
  }

  getGeneratedExpandLink() {
    const link = document.createElement('a');
    link.setAttribute('href', '/');
    link.setAttribute('target', '_blank');
    link.classList.add('cmp-carousel__action');
    link.classList.add('cmp-carousel__action--expand');
    const span = document.createElement('span');
    span.classList.add('cmp-carousel__action-icon');
    link.appendChild(span);
    return link;
  }

  updateExpandLink(url) {
    if (!this.expandLink) return;
    this.expandLink.setAttribute('href', url);
  }
}
