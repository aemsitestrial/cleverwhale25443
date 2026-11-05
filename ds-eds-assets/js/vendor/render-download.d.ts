/**
 * Renders one download. See renderComponent for `content`, `options` and `editable`.
 *
 * @param {import('./eds-component.js').RenderInput<DownloadContent, DownloadOptions, DownloadEditable>} input
 * @returns {HTMLElement}
 */
export default function renderDownload(input: import('./eds-component.js').RenderInput<DownloadContent, DownloadOptions, DownloadEditable>): HTMLElement;
/** @typedef {(typeof EDITABLE)[number][0]} DownloadEditable */
export const DOWNLOAD_EDITABLE_PROPS: ("title" | "description" | "actionText" | "image.src")[];
export type DownloadProps = import('../download.js').DownloadProps;
/**
 * What a site fills in for a download: the Download props of the same names. The image is given by
 * its source alone, as `image: { src }`; the wrapper adds the id the component builds the image's
 * DOM id from. The other props are not content: `id` and `className` are the wrapper's, and
 * Download() takes no option as a prop.
 */
export type DownloadContent = Partial<Pick<DownloadProps, 'url' | 'title' | 'description' | 'filename' | 'format' | 'size' | 'actionText'>> & {
    image?: Partial<Pick<NonNullable<DownloadProps['image']>, 'src'>>;
};
export type DownloadOptions = import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>;
export type DownloadEditable = (typeof EDITABLE)[number][0];
declare const OPTION_LISTS: readonly ["themeType", "downloadDensity", "spacingMy", "spacingMb"];
/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} DownloadOptions */
declare const EDITABLE: readonly [readonly ["title", ".cmp-download__title-link"], readonly ["description", ".cmp-download__description"], readonly ["actionText", ".cmp-download__action-text"], readonly ["image.src", ".cmp-image"]];
export {};
