import { IdentificatorType } from '../../types/common';
import { IDataLayer } from '../../interfaces/common';
import { ICarouselDefaultSlide, ICarouselTeaserSlide } from '../carousel/carousel.types';
import { DownloadProps } from '../download/download.types';
import { ReactNode } from '../../../../dom-types';
export type SplideCarouselType = 'teaser' | 'image' | 'download';
export type SplideCarouselStructureType = 'default' | 'list';
export interface ICarouselDownloadSlide extends DownloadProps {
}
export interface ISplideCarouselProps<T extends ICarouselTeaserSlide | ICarouselDefaultSlide | ICarouselDownloadSlide> {
    className?: string;
    classNameSlide?: string;
    typeCarousel: SplideCarouselType;
    structureType?: SplideCarouselStructureType;
    ':itemsOrder': string[];
    ':items': {
        [key: IdentificatorType]: T | any;
    };
    ':type': string;
    dataLayer?: IDataLayer;
    useExpand?: boolean;
}
export interface IListLayoutProps {
    children: ReactNode;
    className?: string;
}
export interface SplideCarouselItemProps {
    image?: string;
    alt?: string;
    title?: string;
    pretitle?: string;
    description?: string;
    linkUrl?: string;
}
