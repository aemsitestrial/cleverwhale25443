// ac-separator: A separator: Separator() from the design system.
// The fields are the model in _ac-separator.json; ac-separator-fields.js says what each fills.
import renderSeparator from '../../ds-eds-assets/js/vendor/render-separator.js';
import { decorateComponentBlock } from '../../scripts/ds.js';
import * as fields from './ac-separator-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  decorateComponentBlock(block, { bundle: 'ac-separator', render: renderSeparator, fields });
}
