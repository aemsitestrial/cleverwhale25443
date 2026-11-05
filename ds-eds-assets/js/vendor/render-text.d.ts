/**
 * Renders one text. See renderComponent for `content`, `options` and `editable`; `content.text`
 * is HTML.
 *
 * @param {import('./eds-component.js').RenderInput<TextContent, TextOptions, TextEditable>} input
 * @returns {HTMLElement}
 */
export default function renderText(input: import('./eds-component.js').RenderInput<TextContent, TextOptions, TextEditable>): HTMLElement;
/** @typedef {(typeof EDITABLE)[number][0]} TextEditable */
export const TEXT_EDITABLE_PROPS: "text"[];
export type TextProps = import('../text.js').TextProps;
/**
 * What a site fills in for a text: the Text prop `text`, under its own name. `id` and `className`
 * are the wrapper's, and `icon` is an option.
 */
export type TextContent = Partial<Pick<TextProps, 'text'>>;
export type TextOptions = import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>;
export type TextEditable = (typeof EDITABLE)[number][0];
declare const OPTION_LISTS: readonly ["textIcon", "themeType", "textContentAlignment", "textLargeSize", "spacingMy", "spacingMb"];
/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} TextOptions */
declare const EDITABLE: readonly [readonly ["text", ".cmp-text"]];
export {};
