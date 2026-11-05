// ac-tabs: Tabs: one tab per item (AC Tabs Item: a title and a rich text). With the responsive
// layout the tabs turn into a dropdown on a narrow screen.
// The block's own fields are key-value rows; each item is a row with one cell per item field.
import renderTabs, { startResponsiveTabs } from '../../ds-eds-assets/js/vendor/render-tabs.js';
import {
  loadBundle, readBlock, replaceBlock, containerInput,
} from '../../scripts/ds.js';
import * as fields from './ac-tabs-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-tabs');
  loadBundle('ac-tabs-item');
  const { own, items, wrapper } = readBlock(block, fields.NAMES);
  const root = renderTabs({ ...containerInput(own, items, fields), loadBundle });
  replaceBlock(block, root, wrapper);
  // The controller measures the rendered slides or tabs, so it starts once the root is in the page.
  if (root.isConnected) startResponsiveTabs(root);
  else requestAnimationFrame(() => startResponsiveTabs(root));
}
