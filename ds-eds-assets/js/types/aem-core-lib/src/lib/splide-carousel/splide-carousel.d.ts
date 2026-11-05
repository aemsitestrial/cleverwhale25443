import { ISplideCarouselProps, ICarouselDownloadSlide } from './splide-carousel.types';
import { ICarouselDefaultSlide, ICarouselTeaserSlide } from '../carousel/carousel.types';
export declare function SplideCarousel({ className, classNameSlide, typeCarousel, structureType, ':itemsOrder': itemsOrder, ':items': items, useExpand, }: ISplideCarouselProps<ICarouselDefaultSlide | ICarouselTeaserSlide | ICarouselDownloadSlide>): HTMLElement;
export default SplideCarousel;
