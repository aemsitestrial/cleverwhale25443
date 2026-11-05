// ac-embed-video: An embedded video: EmbedVideo() from the design system.
// The fields are the model in _ac-embed-video.json; ac-embed-video-fields.js says what each fills.
import renderEmbedVideo from '../../ds-eds-assets/js/vendor/render-embed-video.js';
import { decorateComponentBlock } from '../../scripts/ds.js';
import * as fields from './ac-embed-video-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  decorateComponentBlock(block, { bundle: 'ac-embed-video', render: renderEmbedVideo, fields });
}
