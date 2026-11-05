/**
 * Renders one table of content. See renderComponent for `content`, `options` and `editable`.
 * `content.items` is the nested list of headings ({ id, text, active, href, children }), found by
 * the caller; `startLevel` and `stopLevel` (h1 to h6) say which levels it holds. The list type is
 * the `tocListType` option, a prop of the component and not a class.
 *
 * @param {import('./eds-component.js').RenderInput<TableOfContentContent, TableOfContentOptions, TableOfContentEditable>} input
 * @returns {HTMLElement}
 */
export default function renderTableOfContent(input: import('./eds-component.js').RenderInput<TableOfContentContent, TableOfContentOptions, TableOfContentEditable>): HTMLElement;
export const TABLE_OF_CONTENT_EDITABLE_PROPS: never[];
export type TableOfContentEditable = (typeof EDITABLE)[number][0];
export type TableOfContentProps = import('../table-of-content.js').TableOfContentProps;
export type TableOfContentChild = import('../table-of-content.js').TableOfContentChild;
/**
 * What a site fills in for a table of content: the TableOfContent props `startLevel`, `stopLevel`
 * and `items`, under their own names. `id`, `className` and the list type are the wrapper's.
 *
 * The headings' `children` are typed loosely: ContentPath cannot follow a type that contains
 * itself, and a table of content has no editable props. The component takes the full shape.
 */
export type TableOfContentContent = Partial<Pick<TableOfContentProps, 'startLevel' | 'stopLevel'>> & {
    items?: Array<Omit<TableOfContentChild, 'children'> & {
        children?: readonly unknown[];
    }>;
};
export type TableOfContentOptions = import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>;
/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} TableOfContentOptions */
declare const EDITABLE: readonly (readonly [never, string])[];
declare const OPTION_LISTS: readonly ["tocListType", "spacingMy", "spacingMb"];
export {};
