// ac-image: One image: Image() from the design system.
// The fields are the model in _ac-image.json; ac-image-fields.js says what each fills.
import renderImage from '../../ds-eds-assets/js/vendor/render-image.js';
import { decorateComponentBlock } from '../../scripts/ds.js';
import * as fields from './ac-image-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  decorateComponentBlock(block, { bundle: 'ac-image', render: renderImage, fields });
}
