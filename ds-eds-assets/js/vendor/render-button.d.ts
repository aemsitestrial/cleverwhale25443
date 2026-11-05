/**
 * Renders one button. See renderComponent for `content`, `options` and `editable`.
 *
 * @param {import('./eds-component.js').RenderInput<ButtonContent, ButtonOptions, ButtonEditable>} input
 * @returns {HTMLElement}
 */
export default function renderButton(input: import('./eds-component.js').RenderInput<ButtonContent, ButtonOptions, ButtonEditable>): HTMLElement;
/** @typedef {(typeof EDITABLE)[number][0]} ButtonEditable */
export const BUTTON_EDITABLE_PROPS: "text"[];
export type ButtonProps = import('../button.js').ButtonProps;
/**
 * What a site fills in for a button: the Button props `text` and `buttonLink`, under their own
 * names. A link is given as `{ url }`; the wrapper sets `valid`. The other props are not content:
 * `id` and `className` are the wrapper's, and `target` and `icon` are options.
 */
export type ButtonContent = Partial<Pick<ButtonProps, 'text'>> & {
    buttonLink?: Omit<NonNullable<ButtonProps['buttonLink']>, 'valid'>;
};
export type ButtonOptions = import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>;
export type ButtonEditable = (typeof EDITABLE)[number][0];
declare const OPTION_LISTS: readonly ["linkTarget", "buttonIcon", "buttonTheme", "modifierVariant", "buttonIconPosition", "spacingMy", "spacingMb", "buttonGridCarouselSwitch"];
/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} ButtonOptions */
declare const EDITABLE: readonly [readonly ["text", ".cmp-button__text"]];
export {};
