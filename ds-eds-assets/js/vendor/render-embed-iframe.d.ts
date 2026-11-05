/** @typedef {(typeof EDITABLE)[number][0]} EmbedIframeEditable */
/**
 * The address the frame may load, or undefined. Only http and https addresses are used, so a
 * `javascript:` or `data:` address that was authored (or pasted) never reaches the iframe. A path
 * on this site is resolved against the page.
 *
 * @param {string | undefined} value
 * @returns {string | undefined}
 */
export function safeSrc(value: string | undefined): string | undefined;
/**
 * Renders one iframe embed, or nothing when `content.src` is not an address the frame may load.
 * See renderComponent for `content`, `options` and `editable`.
 *
 * @param {import('./eds-component.js').RenderInput<EmbedIframeContent, EmbedIframeOptions, EmbedIframeEditable>} input
 * @returns {HTMLElement | undefined}
 */
export default function renderEmbedIframe(input: import('./eds-component.js').RenderInput<EmbedIframeContent, EmbedIframeOptions, EmbedIframeEditable>): HTMLElement | undefined;
export const EMBED_IFRAME_EDITABLE_PROPS: never[];
export type EmbedIframeEditable = (typeof EDITABLE)[number][0];
export type EmbedIframeProps = import('../embed-iframe.js').EmbedVideoIframeProps;
/**
 * What a site fills in for an iframe embed: the frame's address, title and size, under the
 * EmbedVideoIframe props' names. `id` is the wrapper's; `allow`, `frameBorder` and `ariaLabel`
 * keep the component's defaults.
 */
export type EmbedIframeContent = Partial<Pick<EmbedIframeProps, 'src' | 'title' | 'width' | 'height'>>;
export type EmbedIframeOptions = import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>;
/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} EmbedIframeOptions */
declare const EDITABLE: readonly [];
declare const OPTION_LISTS: readonly ["spacingMy", "spacingMb"];
export {};
