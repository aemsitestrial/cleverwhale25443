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
export type TextProps = import('../text.js').TextProps;
/**
 * What a site fills in for a table: the Text prop `text`, the HTML holding the table. `id` is the
 * wrapper's and the table has no class or icon.
 */
export type TableContent = Partial<Pick<TextProps, 'text'>>;
export type TableOptions = import('./eds-component.js').OptionsInput<(typeof CLASS_LISTS)[number]>;
export type TableEditable = (typeof EDITABLE)[number][0];
/** @typedef {import('../text.js').TextProps} TextProps */
/**
 * What a site fills in for a table: the Text prop `text`, the HTML holding the table. `id` is the
 * wrapper's and the table has no class or icon.
 *
 * @typedef {Partial<Pick<TextProps, 'text'>>} TableContent
 */
declare const CLASS_LISTS: readonly ["themeType", "spacingMy", "spacingMb"];
/** @typedef {import('./eds-component.js').OptionsInput<(typeof CLASS_LISTS)[number]>} TableOptions */
declare const EDITABLE: readonly [readonly ["text", ".cmp-text"]];
export {};
