import { ImgHTMLAttributes } from '../../../dom-types';
import { ImageFetchPriority } from '../../../dom-types';
export type IdentificatorType = string;
export type TextTransformType = 'uppercase' | 'lowercase' | 'capitalize';
export type AlignType = 'left' | 'center' | 'right';
export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type LineClamp = '1' | '2' | '3' | '4' | '5';
export type ListType = 'bulleted' | 'numbered';
export type SpacingScaleType = '4' | '8' | '12' | '16' | '20';
export type GridCount = 1 | 2 | 3 | 4 | 5 | '1-2' | '2-1';
export declare enum GridTypeClassnames {
    grid1 = "grid-col-1",
    grid2 = "grid-col-2",
    grid3 = "grid-col-3",
    grid4 = "grid-col-4",
    grid5 = "grid-col-5",
    grid1_2 = "grid-col-1-2",
    grid2_1 = "grid-col-2-1"
}
export type VideoType = {
    id: IdentificatorType;
    url: string;
    type: string;
};
export interface GlobalImageProps {
    lazyEnabled?: boolean;
    imageFetchpriority?: ImageFetchPriority;
    imageSrcSet?: string;
    imageDecoding?: ImgHTMLAttributes<HTMLImageElement>['decoding'];
}
