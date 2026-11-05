import type * as React from '../../../../dom-types';
import { IdentificatorType } from '../../types/common';
import { IDataLayer } from '../../interfaces/common';
import { TabComponents, TabImageItem, TabTextItem } from '../tabs/tabs.types';
import { TeaserProps } from '../teaser/teaser.types';
import { TableProps } from '../table/table.types';
import { EmbedVideoProps } from '../embed-video/embed-video.type';
import { ReactNode } from '../../../../dom-types';
interface AccordionImageItem {
    id: IdentificatorType;
    alt: string;
    title: string;
    src: string;
    uuid: IdentificatorType;
    srcset: string;
    lazyEnabled: boolean;
    ':type': string;
    dataLayer: IDataLayer;
}
interface AccordionTextItem {
    id: IdentificatorType;
    text: string;
    richText: boolean;
    ':type': string;
    dataLayer: IDataLayer;
}
export interface AccordionItem {
    id: IdentificatorType;
    text: string;
    richText: boolean;
    ':type': string;
    dataLayer?: IDataLayer;
    columnClassNames?: {
        image: string;
        text: string;
        teaser?: string;
        table?: string;
        'embed-video'?: string;
        'custom-component'?: string;
    };
    gridClassNames: string;
    columnCount: number;
    ':items'?: {
        image: AccordionImageItem;
        text: AccordionTextItem;
        teaser?: TeaserProps;
        table?: TableProps;
        'embed-video'?: EmbedVideoProps;
        'custom-component'?: ReactNode;
    };
    ':itemsOrder'?: (TabComponents | string)[];
    'cq:panelTitle': string;
}
export type { TabImageItem, TabTextItem };
export interface AccordionProps {
    className?: string;
    id: IdentificatorType;
    typeAccordion: 'default' | 'sample';
    singleExpansion: boolean;
    expandedItems: string[];
    ':itemsOrder'?: string[];
    ':items': {
        [key: IdentificatorType]: AccordionItem | any;
    };
    ':type': string;
    dataLayer: IDataLayer;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, activeItem?: string) => void;
}
