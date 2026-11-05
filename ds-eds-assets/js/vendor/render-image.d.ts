/**
 * Renders one image. See renderComponent for `content`, `options` and `editable`.
 *
 * @param {import('./eds-component.js').RenderInput<ImageContent, ImageOptions, ImageEditable>} input
 * @returns {HTMLElement}
 */
export default function renderImage(input: import('./eds-component.js').RenderInput<ImageContent, ImageOptions, ImageEditable>): HTMLElement;
/** @typedef {(typeof EDITABLE)[number][0]} ImageEditable */
export const IMAGE_EDITABLE_PROPS: "src"[];
export type ImageProps = import('../image.js').ImageProps;
/**
 * What a site fills in for an image: the Image props `src` and `alt`, under their own names. The
 * other props are not content: `id`, `uuid` and `actions` are the wrapper's.
 */
export type ImageContent = Partial<Pick<ImageProps, 'src' | 'alt'>>;
export type ImageOptions = import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>;
export type ImageEditable = (typeof EDITABLE)[number][0];
declare const OPTION_LISTS: readonly ["spacingMy", "spacingMb"];
/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} ImageOptions */
declare const EDITABLE: readonly [readonly ["src", ".cmp-image"]];
export {};
