/**
 * Renders one link. See renderComponent for `content`, `options` and `editable`.
 *
 * @param {import('./eds-component.js').RenderInput<LinkContent, LinkOptions, LinkEditable>} input
 * @returns {HTMLElement}
 */
export default function renderLink(input: import('./eds-component.js').RenderInput<LinkContent, LinkOptions, LinkEditable>): HTMLElement;
/** @typedef {(typeof EDITABLE)[number][0]} LinkEditable */
export const LINK_EDITABLE_PROPS: "title"[];
export type LinkProps = import('../link.js').LinkProps;
/**
 * What a site fills in for a link: the Link props `title` (the text of the anchor),
 * `assetPathWithQueryParams` (its address) and `tooltip` (its title attribute), under their own
 * names. The other props are not content: `id` and `className` are the wrapper's, `assetType` is
 * AEM's, and `target` is an option.
 */
export type LinkContent = Partial<Pick<LinkProps, 'title' | 'assetPathWithQueryParams' | 'tooltip'>>;
export type LinkOptions = import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>;
export type LinkEditable = (typeof EDITABLE)[number][0];
declare const OPTION_LISTS: readonly ["linkTarget", "themeType", "linkModifier", "spacingMy", "spacingMb"];
/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} LinkOptions */
declare const EDITABLE: readonly [readonly ["title", ".cmp-link__anchor"]];
export {};
