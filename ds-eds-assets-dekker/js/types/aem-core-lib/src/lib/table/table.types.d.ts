import { IDataLayer } from '../../interfaces/common';
import { IdentificatorType } from '../../types/common';
export interface TableProps {
    id: IdentificatorType;
    ':orderCol': string[];
    ':itemsCol'?: {
        [key: string]: {
            id: IdentificatorType;
            title: string;
            ':type': string;
            dataLayer: IDataLayer;
        };
    };
    ':itemsRow': {
        [key: string]: string;
    }[];
    ':type': string;
    dataLayer: IDataLayer;
    className?: string;
    useRootClassName?: boolean;
}
