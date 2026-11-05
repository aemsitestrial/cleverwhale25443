// ac-accordion: An accordion: one panel per item (AC Accordion Item: a title and a rich text).
// The block's own fields are key-value rows; each item is a row with one cell per item field.
import renderAccordion from '../../ds-eds-assets/js/vendor/render-accordion.js';
import {
  loadBundle, readBlock, replaceBlock, containerInput,
} from '../../scripts/ds.js';
import * as fields from './ac-accordion-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-accordion');
  loadBundle('ac-accordion-item');
  const { own, items, wrapper } = readBlock(block, fields.NAMES);
  const root = renderAccordion({ ...containerInput(own, items, fields), loadBundle });
  replaceBlock(block, root, wrapper);
}
