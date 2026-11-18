// dekker-tabs: a container, one entry per item.
// The block's own fields are key-value rows; each item is a row with one cell per item field.
// GENERATED once by tools/ds-blocks/generate.mjs from ds-eds-assets-dekker (render-tabs);
// the site's from now on: the generator does not write it again. The fields are the model in
// _dekker-tabs.json; dekker-tabs-fields.js says what each fills.
import renderTabs, { startResponsiveTabs } from '../../ds-eds-assets-dekker/js/vendor/render-tabs.js';
import {
  loadBundle, readBlock, replaceBlock, containerInput,
} from '../../scripts/ds-dekker.js';
import * as fields from './dekker-tabs-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('dekker-tabs');
  loadBundle('dekker-tabs-item');
  const { own, items, wrapper } = readBlock(block, fields.NAMES);
  const root = renderTabs({ ...containerInput(own, items, fields), loadBundle });
  replaceBlock(block, root, wrapper);
  if (root.isConnected) startResponsiveTabs(root);
  else requestAnimationFrame(() => startResponsiveTabs(root));
}
