import { IdentificatorType } from '../../types/common';
import { IDataLayer } from '../../interfaces/common';
export interface DownloadImageProps {
    id: IdentificatorType;
    alt: string;
    title: string;
    src: string;
    uuid: IdentificatorType;
    lazyEnabled: boolean;
    srcset: string;
    ':type': string;
    dataLayer: IDataLayer;
}
export interface DownloadProps {
    id: IdentificatorType;
    layoutAlignContent?: 'left' | 'right';
    backgroundColor?: string;
    backgroundImageReference?: string;
    className?: string;
    url: string;
    title?: string;
    description?: string;
    actionText: string;
    filename: string;
    format: string;
    size: string;
    extension: string;
    image?: DownloadImageProps;
    dataLayer: IDataLayer;
    ':type'?: string;
}
