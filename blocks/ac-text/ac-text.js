// ac-text: A text: Text() from the design system.
// The fields are the model in _ac-text.json; ac-text-fields.js says what each fills.
import renderText from '../../ds-eds-assets/js/vendor/render-text.js';
import { decorateComponentBlock } from '../../scripts/ds.js';
import * as fields from './ac-text-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  decorateComponentBlock(block, { bundle: 'ac-text', render: renderText, fields });
}
