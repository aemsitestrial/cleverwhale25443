import { IDataLayer, ILink } from '../../interfaces/common';
import { IdentificatorType } from './../../types/common';
import { TeaserProps } from '../teaser/teaser.types';
export interface ListItemProps {
    id: string;
    path: string;
    link: ILink;
    pretitle?: string;
    description?: string;
    lastModified?: number;
    title: string;
    target?: string;
    dataLayer: IDataLayer | any;
    ':type': string;
}
export interface ListProps {
    id: IdentificatorType;
    showDescription: boolean;
    showModificationDate: boolean;
    linkItems: boolean;
    displayItemAsTeaser: boolean;
    dateFormatString: string;
    grid?: number;
    className?: string;
    items: ListItemProps[] | TeaserProps[];
    dataLayer: IDataLayer;
    ':type': string;
}
