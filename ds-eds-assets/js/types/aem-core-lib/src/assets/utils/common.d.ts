import { GridCount, GridTypeClassnames } from '../../types/common';
export declare function getGridClassName(grid?: GridCount): GridTypeClassnames | string;
export declare function loadScript(src: string): Promise<void>;
export declare function loadCss(href: string): Promise<void>;
