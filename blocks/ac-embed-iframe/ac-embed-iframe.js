// ac-embed-iframe: An embedded page (iframe). The wrapper renders nothing for an address it may not
// load, and the block stays empty.
// The fields are the model in _ac-embed-iframe.json; ac-embed-iframe-fields.js says what each
// fills.
import renderEmbedIframe from '../../ds-eds-assets/js/vendor/render-embed-iframe.js';
import { decorateComponentBlock } from '../../scripts/ds.js';
import * as fields from './ac-embed-iframe-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  decorateComponentBlock(block, { bundle: 'ac-embed-iframe', render: renderEmbedIframe, fields });
}
