// The image: the Image() component with its source and alternative text. There is no brand base
// class. The spacing lists are classes on the root. The block does not generate responsive
// sources, a ratio, a caption or a link.
import { Image } from '../image.js';
import { renderComponent } from './eds-component.js';

/** @typedef {import('../image.js').ImageProps} ImageProps */

/**
 * What a site fills in for an image: the Image props `src` and `alt`, under their own names. The
 * other props are not content: `id`, `uuid` and `actions` are the wrapper's.
 *
 * @typedef {Partial<Pick<ImageProps, 'src' | 'alt'>>} ImageContent
 */

// The option lists whose values are classes on the root, in class order.
const CLASS_LISTS = /** @type {const} */ (['spacingMy', 'spacingMb']);

// Every option list the wrapper takes: all of them are classes.
const OPTION_LISTS = CLASS_LISTS;

/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} ImageOptions */

const EDITABLE = /** @type {const} */ ([['src', '.cmp-image']]);

/** @typedef {(typeof EDITABLE)[number][0]} ImageEditable */

export const IMAGE_EDITABLE_PROPS = EDITABLE.map(([prop]) => prop);

/** @type {import('./eds-component.js').ComponentConfig<ImageContent, ImageOptions, ImageEditable>} */
const CONFIG = {
  idPrefix: 'image',
  component: Image,
  props: (content, id) => ({
    id,
    uuid: id,
    src: content.src,
    alt: content.alt,
    // Image() puts the props it does not know on the <img>.
    actions: [],
  }),
  classLists: CLASS_LISTS,
  editable: EDITABLE,
};

/**
 * Renders one image. See renderComponent for `content`, `options` and `editable`.
 *
 * @param {import('./eds-component.js').RenderInput<ImageContent, ImageOptions, ImageEditable>} input
 * @returns {HTMLElement}
 */
export default function renderImage(input) {
  return renderComponent(CONFIG, input);
}
