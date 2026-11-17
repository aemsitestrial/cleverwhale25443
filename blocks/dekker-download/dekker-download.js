// dekker-download: one component, renderDownload() of the design system.
// GENERATED once by tools/ds-blocks/generate.mjs from ds-eds-assets-dekker (render-download);
// the site's from now on: the generator does not write it again. The fields are the model in
// _dekker-download.json; dekker-download-fields.js says what each fills.
import renderDownload from '../../ds-eds-assets-dekker/js/vendor/render-download.js';
import { decorateComponentBlock } from '../../scripts/ds-dekker.js';
import * as fields from './dekker-download-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  decorateComponentBlock(block, { bundle: 'dekker-download', render: renderDownload, fields });
}
