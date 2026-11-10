import type * as React from '../../../../dom-types';
import { GridCount, IdentificatorType } from '../../types/common';
type ContainerContentWithType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export interface ContainerLayoutProps {
    id?: IdentificatorType;
    bgColor?: string;
    bgImage?: string;
    className?: string;
    centered?: boolean;
    fullWidth?: boolean;
    children?: React.ReactNode;
    useLibClass?: boolean;
    contentWidth?: ContainerContentWithType;
    grid?: GridCount;
    useAemGridTemplate?: boolean;
}
export {};
