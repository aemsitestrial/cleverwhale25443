// ac-list: A list of teasers, one per item (AC List Item). The list item type is the look of every
// item; an item may choose its own.
// The block's own fields are key-value rows; each item is a row with one cell per item field.
import renderList from '../../ds-eds-assets/js/vendor/render-list.js';
import {
  loadBundle, readBlock, replaceBlock, containerInput,
} from '../../scripts/ds.js';
import * as fields from './ac-list-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-list');
  loadBundle('ac-list-item');
  const { own, items, wrapper } = readBlock(block, fields.NAMES);
  const root = renderList({ ...containerInput(own, items, fields), loadBundle });
  replaceBlock(block, root, wrapper);
}
