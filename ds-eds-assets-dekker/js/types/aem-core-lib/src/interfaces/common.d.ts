import { ImgHTMLAttributes } from '../../../dom-types';
import { IdentificatorType } from '../types/common';
export interface ILink {
    url: string;
    valid: boolean;
}
export interface IDataLayer {
    [key: IdentificatorType]: {
        '@type'?: string;
        'repo:modifyDate'?: string;
        'dc:title'?: string;
        'xdm:linkURL'?: string;
        'dc:description'?: string;
        'xdm:text'?: string;
        image?: {
            'repo:id': IdentificatorType;
            'repo:modifyDate': string;
            '@type': string;
            'repo:path': string;
        };
        shownItems?: string[] | [];
    };
}
export interface IImage extends ImgHTMLAttributes<HTMLImageElement> {
    uuid: IdentificatorType;
    lazyEnabled?: boolean;
    dataLayer?: IDataLayer | any;
    ':type': string;
}
export interface ILinkComponent {
    id: IdentificatorType;
    className?: string;
    title: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    tooltip: string;
    assetType: string;
    assetPathWithQueryParams: string;
    ':type'?: string;
}
export interface ThemeOptions {
    mixins?: any;
    components?: any;
    palette?: any;
    shadows?: any;
    transitions?: any;
    typography?: any;
    zIndex?: any;
    unstable_strictMode?: boolean;
    unstable_sxConfig?: any;
}
