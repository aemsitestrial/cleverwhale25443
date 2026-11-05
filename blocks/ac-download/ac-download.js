// ac-download: One download: Download() from the design system.
// The fields are the model in _ac-download.json; ac-download-fields.js says what each fills.
import renderDownload from '../../ds-eds-assets/js/vendor/render-download.js';
import { decorateComponentBlock } from '../../scripts/ds.js';
import * as fields from './ac-download-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  decorateComponentBlock(block, { bundle: 'ac-download', render: renderDownload, fields });
}
