// ac-table-of-content: a table of contents of the page's headings between a start and a stop level,
// TableOfContent() from the design system. AEM builds the list on the server; here it is built from
// the headings on the page (build-toc-items.js), which get an id when they have none.
//
// The list holds the headings an author writes as page text: the headings of the default content
// and of the AC Title and AC Text blocks. The headings other blocks render (the titles of cards,
// list items, carousel slides, banners) are not listed, and neither are the cells of a block that
// is not decorated yet. The list is built when the block is decorated and again once the page has
// loaded (the `ds:page-ready` event of scripts/scripts.js), when every block has its final markup.
import renderTableOfContent from '../../ds-eds-assets/js/vendor/render-table-of-content.js';
import buildTocItems from '../../ds-eds-assets/js/vendor/build-toc-items.js';
import { fieldsByName, valuesByName } from '../../ds-eds-assets/js/vendor/field-rows.js';
import { componentInput } from '../../ds-eds-assets/js/vendor/component-block.js';
import {
  loadBundle, readBlock, replaceBlock, moveInstrumentation, applyNone,
} from '../../scripts/ds.js';
import * as fields from './ac-table-of-content-fields.js';

// The blocks whose headings are page text.
const HEADING_BLOCKS = ['ac-title', 'ac-text'];
// A class the scan skips (build-toc-items.js ignoreClasses), set for the length of one scan.
const SKIP = 'ac-toc-skip';
const HEADINGS = 'h1, h2, h3, h4, h5, h6';

/** Whether a heading is page text: outside any block, or in a heading block that is decorated. */
function isPageText(heading) {
  const block = heading.closest('.block');
  if (!block) return true;
  return HEADING_BLOCKS.some((name) => block.classList.contains(name))
    && block.dataset.blockStatus === 'loaded';
}

/** The headings of `scope` between the levels, without those other blocks render. */
function tocItems(block, startLevel, stopLevel) {
  // In a section with the table of contents layout (decorateTocSections in scripts/ds.js) the list
  // is the headings of the content column beside it; elsewhere, of the whole page.
  const scope = block.closest('.ds-brand-block-toc-layout')?.querySelector('.TOC-content-container')
    || block.closest('main') || document.body;
  const skipped = [...scope.querySelectorAll(HEADINGS)].filter((h) => !isPageText(h));
  skipped.forEach((h) => h.classList.add(SKIP));
  try {
    return buildTocItems(scope, {
      startLevel, stopLevel, exclude: block, ignoreClasses: ['cmp-accordion__header', SKIP],
    });
  } finally {
    skipped.forEach((h) => {
      h.classList.remove(SKIP);
      if (!h.classList.length) h.removeAttribute('class');
    });
  }
}

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-table-of-content');
  const { own, wrapper } = readBlock(block, fields.NAMES);
  const found = fieldsByName(own, fields.NAMES);
  const input = applyNone(componentInput(found, valuesByName(found, fields.KINDS), {
    contentFields: fields.CONTENT_FIELDS,
    optionFields: fields.OPTION_FIELDS,
    editableProps: [],
  }), fields);
  const { startLevel = 'h2', stopLevel = 'h3' } = input.content;
  const render = () => renderTableOfContent({
    ...input,
    content: {
      ...input.content, startLevel, stopLevel, items: tocItems(block, startLevel, stopLevel),
    },
    loadBundle,
  });
  let root = render();
  replaceBlock(block, root, wrapper);

  // Once every block of the page is decorated, the list is built again from the final markup.
  // A table of contents the layout controller has started keeps its list.
  const refresh = () => {
    if (!block.isConnected) {
      document.removeEventListener('ds:page-ready', refresh);
      return;
    }
    if (block.closest('.ds-brand-block-toc-layout--initialize')) return;
    const next = render();
    moveInstrumentation(root, next);
    root.replaceWith(next);
    root = next;
  };
  document.addEventListener('ds:page-ready', refresh);
}
