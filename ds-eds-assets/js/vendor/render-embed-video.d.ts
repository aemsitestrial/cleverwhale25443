/**
 * Renders one video. See renderComponent for `content`, `options` and `editable`; `content.source`
 * is the list of files and `content.poster` the poster image's source.
 *
 * @param {import('./eds-component.js').RenderInput<EmbedVideoContent, EmbedVideoOptions, EmbedVideoEditable>} input
 * @returns {HTMLElement}
 */
export default function renderEmbedVideo(input: import('./eds-component.js').RenderInput<EmbedVideoContent, EmbedVideoOptions, EmbedVideoEditable>): HTMLElement;
export const EMBED_VIDEO_EDITABLE_PROPS: never[];
export type EmbedVideoProps = import('../embed-video.js').EmbedVideoProps;
/**
 * What a site fills in for a video: the EmbedVideo props `poster`, `autoPlay`, `loop`, `muted` and
 * `controls` under their own names, and `source`, the list of files, each as `{ url, type }`. A
 * source without a `type` gets one from its file extension; the wrapper adds each source's id.
 * `id` is the wrapper's.
 */
export type EmbedVideoContent = Partial<Pick<EmbedVideoProps, 'poster' | 'autoPlay' | 'loop' | 'muted' | 'controls'>> & {
    source?: ReadonlyArray<Partial<Pick<NonNullable<EmbedVideoProps['source']>[number], 'url' | 'type'>>>;
};
export type EmbedVideoOptions = import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>;
export type EmbedVideoEditable = (typeof EDITABLE)[number][0];
declare const OPTION_LISTS: readonly ["spacingMy", "spacingMb"];
/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} EmbedVideoOptions */
declare const EDITABLE: readonly [];
export {};
