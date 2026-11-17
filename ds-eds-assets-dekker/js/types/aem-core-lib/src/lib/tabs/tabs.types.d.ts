import type * as React from '../../../../dom-types';
import { IdentificatorType } from '../../types/common';
import { IDataLayer } from '../../interfaces/common';
import { TeaserProps } from '../teaser/teaser.types';
import { TableProps } from '../table/table.types';
import { EmbedVideoProps } from '../embed-video/embed-video.type';
import { ReactNode } from '../../../../dom-types';
export interface TabImageItem {
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
export interface TabTextItem {
    id: IdentificatorType;
    text: string;
    richText: boolean;
    ':type': string;
    dataLayer: IDataLayer;
}
export interface TabItem {
    dataLayer?: IDataLayer;
    columnClassNames: TabItemClassNames;
    gridClassNames: string;
    columnCount: number;
    ':items': TabItemComponent;
    customChildrent?: ReactNode;
    ':type': string;
    ':itemsOrder': string[];
    'cq:panelTitle': string;
}
export type TabComponents = 'image' | 'text' | 'teaser' | 'table' | 'embed-video' | 'custom-component';
type TabItemClassNames = {
    [key in TabComponents]?: string;
};
type TabItemComponent = {
    [key in TabComponents]?: TabImageItem | TabTextItem | TeaserProps | TableProps | EmbedVideoProps | ReactNode;
};
export interface TabsProps {
    id: IdentificatorType;
    className?: string;
    activeItem?: string;
    singleExpansion?: boolean;
    useWindowResizeType?: boolean;
    useResponsiveSelect?: boolean;
    useResponsiveType: 'window' | 'container';
    ':itemsOrder': string[];
    ':items': {
        [key: IdentificatorType]: TabItem;
    };
    ':type': string;
    dataLayer: IDataLayer;
    children?: ReactNode;
    onClick?: (e: React.MouseEvent<HTMLLIElement, MouseEvent>, activeItem?: string) => void;
}
export {};
