// ac-splide-carousel: A Splide carousel, one slide per item (AC Splide Carousel Item).
// The block's own fields are key-value rows; each item is a row with one cell per item field.
import renderSplideCarousel, { startSplideCarousel } from '../../ds-eds-assets/js/vendor/render-splide-carousel.js';
import {
  loadBundle, readBlock, replaceBlock, containerInput,
} from '../../scripts/ds.js';
import * as fields from './ac-splide-carousel-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-splide-carousel');
  loadBundle('ac-splide-carousel-item');
  const { own, items, wrapper } = readBlock(block, fields.NAMES);
  const root = renderSplideCarousel({ ...containerInput(own, items, fields), loadBundle });
  replaceBlock(block, root, wrapper);
  // The controller measures the rendered slides or tabs, so it starts once the root is in the page.
  if (root.isConnected) startSplideCarousel(root);
  else requestAnimationFrame(() => startSplideCarousel(root));
}
