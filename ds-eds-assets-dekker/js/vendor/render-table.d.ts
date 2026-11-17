/**
 * Renders one table. See renderComponent for `content`, `options` and `editable`;
 * `content.text` is the HTML holding the table.
 *
 * @param {import('./eds-component.js').RenderInput<TableContent, TableOptions, TableEditable>} input
 * @returns {HTMLElement}
 */
export default function renderTable(input: import('./eds-component.js').RenderInput<TableContent, TableOptions, TableEditable>): HTMLElement;
/** @typedef {(typeof EDITABLE)[number][0]} TableEditable */
export const TABLE_EDITABLE_PROPS: "text"[];
export type TextProps = import('../dekker-text.js').TextProps;
/**
 * What a site fills in for a table: the Text prop `text`, under its own name. It holds the HTML
 * of the table. The other Text props are not content: `id` is the wrapper's, and `className` and
 * `icon` are not used here.
 */
export type TableContent = Partial<Pick<TextProps, 'text'>>;
export type TableOptions = import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>;
export type TableEditable = (typeof EDITABLE)[number][0];
declare const OPTION_LISTS: readonly ["spacingMy", "spacingMb"];
/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} TableOptions */
declare const EDITABLE: readonly [readonly ["text", ".cmp-text"]];
export {};
