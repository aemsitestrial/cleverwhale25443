// dekker-block-news: a container, one entry per item.
// The block's own fields are key-value rows; each item is a row with one cell per item field.
// GENERATED once by tools/ds-blocks/generate.mjs from ds-eds-assets-dekker (render-block-news);
// the site's from now on: the generator does not write it again. The fields are the model in
// _dekker-block-news.json; dekker-block-news-fields.js says what each fills.
import renderBlockNews, { startBlockNews } from '../../ds-eds-assets-dekker/js/vendor/render-block-news.js';
import {
  loadBundle, readBlock, replaceBlock, containerInput,
} from '../../scripts/ds-dekker.js';
import * as fields from './dekker-block-news-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('dekker-block-news');
  loadBundle('dekker-block-news-item');
  const { own, items, wrapper } = readBlock(block, fields.NAMES);
  const root = renderBlockNews({ ...containerInput(own, items, fields), loadBundle });
  replaceBlock(block, root, wrapper);
  if (root.isConnected) startBlockNews(root);
  else requestAnimationFrame(() => startBlockNews(root));
}
