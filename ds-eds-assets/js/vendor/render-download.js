// The download: the Download() component with the theme, density and spacing lists as classes on
// the root. The brand base class `ac-core-download` is passed as className. Download() builds the
// image's DOM id from the image's own id, so the image gets the download's id.
import { Download } from '../download.js';
import { renderComponent } from './eds-component.js';

/** @typedef {import('../download.js').DownloadProps} DownloadProps */

/**
 * What a site fills in for a download: the Download props of the same names. The image is given by
 * its source alone, as `image: { src }`; the wrapper adds the id the component builds the image's
 * DOM id from. The other props are not content: `id` and `className` are the wrapper's, and
 * Download() takes no option as a prop.
 *
 * @typedef {Partial<Pick<DownloadProps,
 *   'url' | 'title' | 'description' | 'filename' | 'format' | 'size' | 'actionText'
 * >> & {
 *   image?: Partial<Pick<NonNullable<DownloadProps['image']>, 'src'>>
 * }} DownloadContent
 */

// The option lists whose values are classes on the root, in class order.
const CLASS_LISTS = /** @type {const} */ (['themeType', 'downloadDensity', 'spacingMy', 'spacingMb']);

// Every option list the wrapper takes: all of them are classes.
const OPTION_LISTS = CLASS_LISTS;

/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} DownloadOptions */

const EDITABLE = /** @satisfies {ReadonlyArray<readonly [import('./eds-component.js').ContentPath<DownloadContent>, unknown]>} */ (/** @type {const} */ ([
  ['title', '.cmp-download__title-link'],
  ['description', '.cmp-download__description'],
  ['actionText', '.cmp-download__action-text'],
  ['image.src', '.cmp-image'],
]));

/** @typedef {(typeof EDITABLE)[number][0]} DownloadEditable */

export const DOWNLOAD_EDITABLE_PROPS = EDITABLE.map(([prop]) => prop);

/** @type {import('./eds-component.js').ComponentConfig<DownloadContent, DownloadOptions, DownloadEditable>} */
const CONFIG = {
  idPrefix: 'download',
  component: Download,
  /** @returns {Partial<Omit<DownloadProps, 'image'>> & { image?: Partial<NonNullable<DownloadProps['image']>> }} */
  props: (content, id) => ({
    id,
    className: 'ac-core-download',
    url: content.url,
    title: content.title,
    description: content.description,
    filename: content.filename,
    format: content.format,
    size: content.size,
    actionText: content.actionText,
    image: content.image?.src ? { src: content.image.src, id } : undefined,
  }),
  classLists: CLASS_LISTS,
  editable: EDITABLE,
};

/**
 * Renders one download. See renderComponent for `content`, `options` and `editable`.
 *
 * @param {import('./eds-component.js').RenderInput<DownloadContent, DownloadOptions, DownloadEditable>} input
 * @returns {HTMLElement}
 */
export default function renderDownload(input) {
  return renderComponent(CONFIG, input);
}
