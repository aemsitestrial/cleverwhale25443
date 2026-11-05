/**
 * Renders one separator. See renderComponent for `content`, `options` and `editable`.
 *
 * @param {import('./eds-component.js').RenderInput<SeparatorContent, SeparatorOptions, SeparatorEditable>} input
 * @returns {HTMLElement}
 */
export default function renderSeparator(input: import('./eds-component.js').RenderInput<SeparatorContent, SeparatorOptions, SeparatorEditable>): HTMLElement;
export const SEPARATOR_EDITABLE_PROPS: never[];
export type SeparatorProps = import('../separator.js').SeparatorProps;
/**
 * What a site fills in for a separator: the Separator prop `isDecorative`. `id` and `className`
 * are not content.
 */
export type SeparatorContent = Partial<Pick<SeparatorProps, 'isDecorative'>>;
export type SeparatorOptions = import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>;
export type SeparatorEditable = (typeof EDITABLE)[number][0];
declare const OPTION_LISTS: readonly ["separatorTheme", "spacingMy", "spacingMb"];
/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} SeparatorOptions */
declare const EDITABLE: readonly [];
export {};
