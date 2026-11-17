import { IDataLayer } from './../../interfaces/common';
import { IdentificatorType } from './../../types/common';
import { ILink, IImage } from '../../interfaces/common';
export type ImageLinkTargetType = '_blank' | '_self' | '_parent' | '_top';
export type ImageRatioType = '4:3' | '16:9' | '1:1' | '21:9' | '';
/**
 * The base Image props. Each brand library declares its own EDS block for
 * this component (an @edsBlock interface in its own types file); the base
 * library carries no block tag.
 */
export interface ImageProps extends IImage {
    src: string;
    srcset?: string;
    alt: string;
    className?: string;
    title?: string;
    useCaption?: boolean;
    ratio?: ImageRatioType;
    target?: ImageLinkTargetType;
    imageLink?: ILink;
    lazyEnabled?: boolean;
    uuid: IdentificatorType;
    ':type': string;
    dataLayer?: IDataLayer;
}
