// The video embed: the EmbedVideo() component with the spacing lists as classes on the root.
// A playback switch the content leaves out is on.
import { EmbedVideo } from '../embed-video.js';
import { renderComponent } from './eds-component.js';

/** @typedef {import('../embed-video.js').EmbedVideoProps} EmbedVideoProps */

/**
 * What a site fills in for a video: the EmbedVideo props `poster`, `autoPlay`, `loop`, `muted` and
 * `controls` under their own names, and `source`, the list of files, each as `{ url, type }`. A
 * source without a `type` gets one from its file extension; the wrapper adds each source's id.
 * `id` is the wrapper's.
 *
 * @typedef {Partial<Pick<EmbedVideoProps, 'poster' | 'autoPlay' | 'loop' | 'muted' | 'controls'>>
 *   & { source?: ReadonlyArray<Partial<Pick<NonNullable<EmbedVideoProps['source']>[number], 'url' | 'type'>>> }
 * } EmbedVideoContent
 */

// The option lists whose values are classes on the root, in class order.
const CLASS_LISTS = /** @type {const} */ (['spacingMy', 'spacingMb']);

// Every option list the wrapper takes: all of them are classes.
const OPTION_LISTS = CLASS_LISTS;

/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} EmbedVideoOptions */

const EDITABLE = /** @type {const} */ ([]);

/** @typedef {(typeof EDITABLE)[number][0]} EmbedVideoEditable */

/** @type {Record<string, string>} */
const VIDEO_TYPES = {
  mp4: 'video/mp4',
  m4v: 'video/mp4',
  webm: 'video/webm',
  ogv: 'video/ogg',
  ogg: 'video/ogg',
  mov: 'video/quicktime',
};

// A source that names no type gets the one its file extension stands for, and none when the
// extension is not a known one, so the browser decides from the file itself. A source without a
// URL is left out.
/** @param {EmbedVideoContent['source']} sources */
function sourcesFor(sources) {
  return (sources || []).filter((entry) => entry?.url).map(({ url, type: given }) => {
    const extension = String(url).split(/[?#]/)[0].split('.').pop()?.toLowerCase() ?? '';
    const type = given || VIDEO_TYPES[extension];
    return { url, id: 'video-source', ...(type && { type }) };
  });
}

export const EMBED_VIDEO_EDITABLE_PROPS = /** @type {EmbedVideoEditable[]} */ ([]);

/** @type {import('./eds-component.js').ComponentConfig<EmbedVideoContent, EmbedVideoOptions, EmbedVideoEditable>} */
const CONFIG = {
  idPrefix: 'embed',
  component: EmbedVideo,
  props: (content, id) => ({
    id,
    source: sourcesFor(content.source),
    poster: content.poster,
    autoPlay: content.autoPlay ?? true,
    loop: content.loop ?? true,
    muted: content.muted ?? true,
    controls: content.controls ?? true,
  }),
  classLists: CLASS_LISTS,
  editable: EDITABLE,
};

/**
 * Renders one video. See renderComponent for `content`, `options` and `editable`; `content.source`
 * is the list of files and `content.poster` the poster image's source.
 *
 * @param {import('./eds-component.js').RenderInput<EmbedVideoContent, EmbedVideoOptions, EmbedVideoEditable>} input
 * @returns {HTMLElement}
 */
export default function renderEmbedVideo(input) {
  return renderComponent(CONFIG, input);
}
