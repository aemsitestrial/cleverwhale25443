import { IdentificatorType } from './../../types/common';
export interface LinkProps {
    id: IdentificatorType;
    className?: string;
    title: string;
    tooltip: string;
    assetType: string;
    assetPathWithQueryParams: string;
    ":type"?: string;
}
