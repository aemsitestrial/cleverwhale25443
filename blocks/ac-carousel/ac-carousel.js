// ac-carousel: A carousel, one slide per item (AC Carousel Item).
// The block's own fields are key-value rows; each item is a row with one cell per item field.
import renderCarousel, { startCarousel } from '../../ds-eds-assets/js/vendor/render-carousel.js';
import {
  loadBundle, readBlock, replaceBlock, containerInput,
} from '../../scripts/ds.js';
import * as fields from './ac-carousel-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-carousel');
  loadBundle('ac-carousel-item');
  const { own, items, wrapper } = readBlock(block, fields.NAMES);
  const root = renderCarousel({ ...containerInput(own, items, fields), loadBundle });
  replaceBlock(block, root, wrapper);
  // The controller measures the rendered slides or tabs, so it starts once the root is in the page.
  if (root.isConnected) startCarousel(root);
  else requestAnimationFrame(() => startCarousel(root));
}
