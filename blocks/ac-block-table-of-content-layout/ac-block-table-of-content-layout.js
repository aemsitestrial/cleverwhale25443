// ac-block-table-of-content-layout: the design system's BlockTableOfContentLayout (the package's
// render-block-table-of-content-layout), as on the wiki page of ac-core-lib: a sticky sidebar that
// holds a TableOfContent with other components above and below it, beside a content column whose
// headings the table of contents lists.
//
// The Universal Editor puts no block inside a block, so the layout holds items (the model's
// filter, tools/ds-blocks/generate.mjs). Each item is one of:
//   - Table of contents: the TableOfContent of the sidebar, at its place among the sidebar's
//     items; start level, stop level and list type are its fields
//   - a component (Title, Text, Card, Text Content, Image, Button, Link, Table, Separator,
//     Download): the fields of that component's block, and "Place" (Content or Sidebar)
// Items keep their order within the sidebar and within the content column. The first cell of an
// item is its kind (its template fills it), which says which block renders it: the item's cells
// become that block's key-value rows and the block's own decorator renders them.
//
// The toc-layout page controller makes the sidebar sticky and marks the heading in view.
import renderBlockTableOfContentLayout, {
  layoutSlots,
} from '../../ds-eds-assets/js/vendor/render-block-table-of-content-layout.js';
import renderTableOfContent from '../../ds-eds-assets/js/vendor/render-table-of-content.js';
import buildTocItems from '../../ds-eds-assets/js/vendor/build-toc-items.js';
import {
  fieldsByName, valuesByName, instrumentationOf,
} from '../../ds-eds-assets/js/vendor/field-rows.js';
import { componentInput } from '../../ds-eds-assets/js/vendor/component-block.js';
import { isAuthoringContext } from '../../ds-eds-assets/js/vendor/nest-by-parent.js';
import {
  loadBundle, readBlock, replaceBlock, applyNone, NONE,
} from '../../scripts/ds.js';
import * as fields from './ac-block-table-of-content-layout-fields.js';

const HEADINGS = 'h1, h2, h3, h4, h5, h6';
// A class the heading scan skips (build-toc-items.js ignoreClasses), set for one scan.
const SKIP = 'ac-toc-skip';
// The headings components render for themselves (a card's or a highlight's title), which are not
// headings of the content.
const NOT_CONTENT_HEADINGS = '.cmp-teaser, .cmp-image, .cmp-download';
// The editor attributes the decorators copy from an item onto the element they decorate.
const RESOURCE_ATTRS = ['data-aue-resource', 'data-aue-type', 'data-aue-behavior', 'data-aue-model',
  'data-aue-label', 'data-aue-component'];

const textOf = (cell) => (cell?.textContent.trim() || '');
const isEmptyCell = (cell) => !textOf(cell) && !cell.querySelector('img, picture, a');

/**
 * A component item as the block it is: a `<name>` element whose rows are the item's fields as
 * key-value rows (an empty field has no row, as in a block). In the editor the rows sit in an inner
 * element that carries the item's editor attributes, as the editor delivers a block
 * (field-rows.js blockRows), and the block's decorator moves them onto what it renders.
 *
 * It is not a `.block`: after an edit the Universal Editor replaces the closest `.block` that has
 * an editor resource with fresh markup (scripts/editor-support.js). That has to be this layout,
 * which renders its items again, and not an item, whose fresh markup is a bare row.
 */
function itemAsBlock(name, names, cells, attributes) {
  const block = document.createElement('div');
  block.className = name;
  const inner = attributes ? document.createElement('div') : block;
  Object.entries(attributes || {}).forEach(([attr, value]) => inner.setAttribute(attr, value));
  names.forEach((field, i) => {
    const cell = cells[i];
    if (!cell || isEmptyCell(cell)) return;
    const row = document.createElement('div');
    const label = document.createElement('div');
    label.textContent = field;
    row.append(label, cell);
    inner.append(row);
  });
  if (inner !== block) block.append(inner);
  const wrapper = document.createElement('div');
  wrapper.className = `${name}-wrapper`;
  wrapper.append(block);
  return { wrapper, block };
}

/** The headings of the content column, without the titles components render for themselves. */
function contentHeadings(content, startLevel, stopLevel) {
  const skipped = [...content.querySelectorAll(HEADINGS)]
    .filter((heading) => heading.closest(NOT_CONTENT_HEADINGS));
  skipped.forEach((heading) => heading.classList.add(SKIP));
  try {
    return buildTocItems(content, {
      startLevel, stopLevel, ignoreClasses: ['cmp-accordion__header', SKIP],
    });
  } finally {
    skipped.forEach((heading) => {
      heading.classList.remove(SKIP);
      if (!heading.classList.length) heading.removeAttribute('class');
    });
  }
}

/** The TableOfContent of a Table of contents item, listing the content column's headings. */
function renderToc(cells, attributes, content) {
  loadBundle('ac-table-of-content');
  const { names } = fields.ITEMS.toc;
  const value = (field) => {
    const text = textOf(cells[names.indexOf(field)]);
    return text && text !== NONE ? text : undefined;
  };
  const startLevel = value('startLevel') || 'h2';
  const stopLevel = value('stopLevel') || 'h3';
  const items = contentHeadings(content, startLevel, stopLevel);
  const root = renderTableOfContent({
    content: { startLevel, stopLevel, items },
    options: { ...(value('tocListTypeOption') && { tocListType: value('tocListTypeOption') }) },
    loadBundle,
  });
  // An empty table of contents has nothing to click in the editor: it says what it is.
  if (!items.length && isAuthoringContext(document)) {
    root.textContent = `Table of contents: no ${startLevel}-${stopLevel} headings in the content yet`;
  }
  Object.entries(attributes || {}).forEach(([attr, val]) => root.setAttribute(attr, val));
  return root;
}

/** @param {HTMLElement} block */
export default async function decorate(block) {
  const { own, items, wrapper } = readBlock(block, fields.NAMES);
  const found = fieldsByName(own, fields.NAMES);
  const input = applyNone(componentInput(found, valuesByName(found, fields.KINDS), {
    contentFields: {},
    optionFields: fields.OPTION_FIELDS,
    editableProps: [],
  }), fields);
  const root = renderBlockTableOfContentLayout({ ...input, loadBundle });
  const { sidebar, content } = layoutSlots(root);

  // The components first, in order; a table of contents keeps its place in the sidebar and is
  // rendered once the content column is complete.
  const tocs = [];
  const decorators = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const row of items) {
    const [kindCell, ...cells] = [...row.children];
    const kind = textOf(kindCell);
    const spec = fields.ITEMS[kind];
    // eslint-disable-next-line no-continue
    if (!spec) continue;
    const attributes = instrumentationOf(row);
    if (kind === 'toc') {
      const slot = document.createElement('div');
      sidebar.append(slot);
      tocs.push({ slot, cells, attributes });
      // eslint-disable-next-line no-continue
      continue;
    }
    const placeAt = spec.names.indexOf('place');
    const place = textOf(cells[placeAt]) === 'sidebar' ? sidebar : content;
    const names = spec.names.filter((name) => name !== 'place');
    const item = itemAsBlock(spec.block, names, cells.filter((_, i) => i !== placeAt), attributes);
    place.append(item.wrapper);
    if (!decorators[spec.block]) {
      // eslint-disable-next-line no-await-in-loop
      decorators[spec.block] = (await import(`../${spec.block}/${spec.block}.js`)).default;
    }
    // eslint-disable-next-line no-await-in-loop
    await decorators[spec.block](item.block);
    // The decorator copied the item's resource onto the element; only what it rendered keeps it.
    RESOURCE_ATTRS.forEach((attr) => item.block.removeAttribute(attr));
  }
  tocs.forEach(({ slot, cells, attributes }) => {
    slot.replaceWith(renderToc(cells, attributes, content));
  });

  replaceBlock(block, root, wrapper);
}
