// The iframe embed: the EmbedVideoIframe() component with the spacing lists as classes on the
// root. The component keeps its own `allow`, `frameBorder` and `aria-label` defaults.
import { EmbedVideoIframe } from '../embed-iframe.js';
import { renderComponent } from './eds-component.js';

/** @typedef {import('../embed-iframe.js').EmbedVideoIframeProps} EmbedIframeProps */

/**
 * What a site fills in for an iframe embed: the frame's address, title and size, under the
 * EmbedVideoIframe props' names. `id` is the wrapper's; `allow`, `frameBorder` and `ariaLabel`
 * keep the component's defaults.
 *
 * @typedef {Partial<Pick<EmbedIframeProps, 'src' | 'title' | 'width' | 'height'>>} EmbedIframeContent
 */

// The option lists whose values are classes on the root, in class order.
const CLASS_LISTS = /** @type {const} */ (['spacingMy', 'spacingMb']);

// Every option list the wrapper takes: all of them are classes.
const OPTION_LISTS = CLASS_LISTS;

/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} EmbedIframeOptions */

const EDITABLE = /** @type {const} */ ([]);

/** @typedef {(typeof EDITABLE)[number][0]} EmbedIframeEditable */

/**
 * The address the frame may load, or undefined. Only http and https addresses are used, so a
 * `javascript:` or `data:` address that was authored (or pasted) never reaches the iframe. A path
 * on this site is resolved against the page.
 *
 * @param {string | undefined} value
 * @returns {string | undefined}
 */
export function safeSrc(value) {
  if (!value) return undefined;
  try {
    const url = new URL(value, window.location.href);
    return url.protocol === 'http:' || url.protocol === 'https:' ? value : undefined;
  } catch (error) {
    return undefined;
  }
}

export const EMBED_IFRAME_EDITABLE_PROPS = /** @type {EmbedIframeEditable[]} */ ([]);

/** @type {import('./eds-component.js').ComponentConfig<EmbedIframeContent, EmbedIframeOptions, EmbedIframeEditable>} */
const CONFIG = {
  idPrefix: 'embed',
  component: EmbedVideoIframe,
  props: (content, id) => ({
    id,
    src: safeSrc(content.src),
    title: content.title,
    width: content.width,
    height: content.height,
  }),
  classLists: CLASS_LISTS,
  editable: EDITABLE,
};

/**
 * Renders one iframe embed, or nothing when `content.src` is not an address the frame may load.
 * See renderComponent for `content`, `options` and `editable`.
 *
 * @param {import('./eds-component.js').RenderInput<EmbedIframeContent, EmbedIframeOptions, EmbedIframeEditable>} input
 * @returns {HTMLElement | undefined}
 */
export default function renderEmbedIframe(input) {
  if (!safeSrc(input?.content?.src)) return undefined;
  return renderComponent(CONFIG, input);
}
