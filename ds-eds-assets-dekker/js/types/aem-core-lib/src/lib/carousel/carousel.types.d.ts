import { IdentificatorType } from '../../types/common';
import { IDataLayer } from '../../interfaces/common';
import { TeaserProps } from '../teaser/teaser.types';
import { ImageProps } from '../image/image.types';
export interface ICarouselDefaultSlide extends ImageProps {
}
export interface ICarouselTeaserSlide extends TeaserProps {
}
export interface CarouselProps<T extends ICarouselTeaserSlide | ICarouselDefaultSlide> {
    id: IdentificatorType;
    className?: string;
    classNameSlide?: string;
    autoplay: boolean;
    delay: number;
    typeCarousel: 'teaser' | 'image' | 'hero' | 'hero-teaser';
    autopauseDisabled: boolean;
    controlsPrepended: boolean;
    ':itemsOrder': string[];
    ':items': {
        [key: IdentificatorType]: T & {
            'cq:panelTitle': string;
        };
    };
    ':type': string;
    dataLayer?: IDataLayer;
    useExpand?: boolean;
}
export interface CarouselItemProps {
    image?: string;
    alt?: string;
    title?: string;
    pretitle?: string;
    description?: string;
    linkUrl?: string;
}
