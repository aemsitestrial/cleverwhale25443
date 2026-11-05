// ac-link: One link: Link() from the design system.
// The fields are the model in _ac-link.json; ac-link-fields.js says what each fills.
import renderLink from '../../ds-eds-assets/js/vendor/render-link.js';
import { decorateComponentBlock } from '../../scripts/ds.js';
import * as fields from './ac-link-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  decorateComponentBlock(block, { bundle: 'ac-link', render: renderLink, fields });
}
