/**
 * Renders one title. See renderComponent for `content`, `options` and `editable`.
 *
 * @param {import('./eds-component.js').RenderInput<TitleContent, TitleOptions, TitleEditable>} input
 * @returns {HTMLElement}
 */
export default function renderTitle(input: import('./eds-component.js').RenderInput<TitleContent, TitleOptions, TitleEditable>): HTMLElement;
/** @typedef {(typeof EDITABLE)[number][0]} TitleEditable */
export const TITLE_EDITABLE_PROPS: "text"[];
export type TitleProps = import('../title.js').TitleProps;
/**
 * What a site fills in for a title: the Title props `text` and `link`, under their own names. A
 * link is given as `{ url }`; the wrapper sets `valid`. The other props are not content: `id` and
 * `className` are the wrapper's, and `type` is an option.
 */
export type TitleContent = Partial<Pick<TitleProps, 'text'>> & {
    link?: Omit<NonNullable<TitleProps['link']>, 'valid' | 'attributes'>;
};
export type TitleOptions = import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>;
export type TitleEditable = (typeof EDITABLE)[number][0];
declare const OPTION_LISTS: readonly ["headingTag", "themeType", "spacingMy", "spacingMb"];
/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} TitleOptions */
declare const EDITABLE: readonly [readonly ["text", ".cmp-title__text"]];
export {};
