// ac-table-of-content: a table of contents of the page's headings between a start and a stop level,
// TableOfContent() from the design system. AEM builds the list on the server; here it is built from
// the
// headings on the page (build-toc-items.js), which get an id when they have none.
import renderTableOfContent from '../../ds-eds-assets/js/vendor/render-table-of-content.js';
import buildTocItems from '../../ds-eds-assets/js/vendor/build-toc-items.js';
import { fieldsByName, valuesByName } from '../../ds-eds-assets/js/vendor/field-rows.js';
import { componentInput } from '../../ds-eds-assets/js/vendor/component-block.js';
import { loadBundle, readBlock, replaceBlock } from '../../scripts/ds.js';
import * as fields from './ac-table-of-content-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-table-of-content');
  const { own, wrapper } = readBlock(block, fields.NAMES);
  const found = fieldsByName(own, fields.NAMES);
  const input = componentInput(found, valuesByName(found, fields.KINDS), {
    contentFields: fields.CONTENT_FIELDS,
    optionFields: fields.OPTION_FIELDS,
    editableProps: [],
  });
  const { startLevel = 'h2', stopLevel = 'h3' } = input.content;
  // In a section with the table of contents layout (decorateTocSections in scripts/ds.js) the list
  // is the headings of the content column beside it; elsewhere, of the whole page.
  const scope = block.closest('.ds-brand-block-toc-layout')?.querySelector('.TOC-content-container')
    || block.closest('main') || document.body;
  const items = buildTocItems(scope, { startLevel, stopLevel, exclude: block });
  const root = renderTableOfContent({
    ...input,
    content: {
      ...input.content, startLevel, stopLevel, items,
    },
    loadBundle,
  });
  replaceBlock(block, root, wrapper);
}
