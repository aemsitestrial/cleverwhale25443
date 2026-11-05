import { IdentificatorType, HeadingTag } from '../../types/common';
import { IDataLayer } from '../../interfaces/common';
export interface TitleProps {
    id: IdentificatorType;
    className?: string;
    linkDisabled?: boolean;
    type: HeadingTag;
    text: string;
    link?: {
        valid: boolean;
        attributes?: {
            [key: string]: string;
        };
        url: string;
    };
    ":type"?: string;
    dataLayer?: IDataLayer;
}
