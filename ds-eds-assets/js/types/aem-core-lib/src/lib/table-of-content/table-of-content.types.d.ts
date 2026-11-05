import { HeadingTag, IdentificatorType, ListType } from '../../types/common';
export interface TableOfContentChild {
    id: IdentificatorType;
    text: string;
    children: TableOfContentChild[];
    href: string;
    active: boolean;
}
export interface TableOfContentProps {
    id: IdentificatorType;
    className?: string;
    listType: ListType;
    startLevel?: HeadingTag;
    stopLevel?: HeadingTag;
    ignoreClasses?: string[];
    items: TableOfContentChild[];
}
