export function blockRows(block: any): {
    rows: any[];
    wrapper: any;
};
export function splitRows(rows: any, edsNames: any): {
    dsRows: any;
    eds: {};
};
export function fillIfEmpty(rows: any, name: any, content: any): void;
export function fieldsByName(rows: any, names: any): {};
export function htmlValue(field: any): any;
export function imageValue(field: any): any;
export function listValue(field: any): any;
export function booleanValue(field: any): boolean;
export function valuesByName(fields: any, kinds?: {}): {
    [k: string]: any;
};
export function editorAttributes(row: any): {};
export function instrumentationOf(element: any): {};
export function addClasses(root: any, ...values: any[]): void;
export function addListClasses(root: any, value: any): void;
export function instrument(field: any, root: any, selector: any): void;
export function recordApplied(root: any, values: any, applied: any): void;
export function textOf(cell: any): any;
export function textValue(field: any): any;
export function hrefValue(field: any): any;
