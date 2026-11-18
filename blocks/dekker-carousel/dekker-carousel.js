// dekker-carousel: a container, one entry per item.
// The block's own fields are key-value rows; each item is a row with one cell per item field.
// GENERATED once by tools/ds-blocks/generate.mjs from ds-eds-assets-dekker (render-carousel);
// the site's from now on: the generator does not write it again. The fields are the model in
// _dekker-carousel.json; dekker-carousel-fields.js says what each fills.
import renderCarousel, { startCarousel } from '../../ds-eds-assets-dekker/js/vendor/render-carousel.js';
import {
  loadBundle, readBlock, replaceBlock, containerInput,
} from '../../scripts/ds-dekker.js';
import * as fields from './dekker-carousel-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('dekker-carousel');
  loadBundle('dekker-carousel-item');
  const { own, items, wrapper } = readBlock(block, fields.NAMES);
  const root = renderCarousel({ ...containerInput(own, items, fields), loadBundle });
  replaceBlock(block, root, wrapper);
  if (root.isConnected) startCarousel(root);
  else requestAnimationFrame(() => startCarousel(root));
}
