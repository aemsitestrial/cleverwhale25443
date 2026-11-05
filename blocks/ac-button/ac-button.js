// ac-button: One button: Button() from the design system.
// The fields are the model in _ac-button.json; ac-button-fields.js says what each fills.
import renderButton from '../../ds-eds-assets/js/vendor/render-button.js';
import { decorateComponentBlock } from '../../scripts/ds.js';
import * as fields from './ac-button-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  decorateComponentBlock(block, { bundle: 'ac-button', render: renderButton, fields });
}
