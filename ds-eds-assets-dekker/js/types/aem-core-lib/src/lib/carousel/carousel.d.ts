import { CarouselProps, ICarouselDefaultSlide, ICarouselTeaserSlide } from './carousel.types';
export declare function Carousel({ id, className, classNameSlide, ':itemsOrder': itemsOrder, ':items': items, typeCarousel, autopauseDisabled, autoplay, controlsPrepended, delay, useExpand, }: CarouselProps<ICarouselDefaultSlide | ICarouselTeaserSlide>): HTMLElement;
export default Carousel;
