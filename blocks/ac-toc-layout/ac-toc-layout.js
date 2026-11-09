// ac-toc-layout: the design system's BlockTableOfContentLayout, as on the wiki page of
// ac-core-lib: a sticky sidebar that holds a TableOfContent with other components above and below
// it, beside a content column whose headings the table of contents lists.
//
// The Universal Editor puts no block inside a block, so the layout holds items (the model's
// filter, tools/ds-blocks/generate.mjs). Each item is one of:
//   - Table of contents: the TableOfContent of the sidebar, at its place among the sidebar's
//     items; start level, stop level and list type are its fields
//   - a component (Title, Text, Card, Text Content, Image, Button, Link, Table, Separator,
//     Download): the fields of that component's block, and "Place" (Content or Sidebar)
// Items keep their order within the sidebar and within the content column. The first cell of an
// item is its kind (its template fills it), which says which block renders it: the item's cells
// become that block's key-value rows and the block's own decorator renders them, so a component
// looks and reads its fields as it does on its own.
//
// The toc-layout page controller (ds-eds-assets page-controller-list.js) makes the sidebar sticky,
// opens the list on a narrow screen and marks the heading in view.
import renderTableOfContent from '../../ds-eds-assets/js/vendor/render-table-of-content.js';
import buildTocItems from '../../ds-eds-assets/js/vendor/build-toc-items.js';
import { fieldsByName, valuesByName, instrumentationOf } from '../../ds-eds-assets/js/vendor/field-rows.js';
import { componentInput } from '../../ds-eds-assets/js/vendor/component-block.js';
import {
  loadBundle, readBlock, replaceBlock, applyNone, NONE,
} from '../../scripts/ds.js';
import * as fields from './ac-toc-layout-fields.js';

const HEADINGS = 'h1, h2, h3, h4, h5, h6';
// A class the heading scan skips (build-toc-items.js ignoreClasses), set for one scan.
const SKIP = 'ac-toc-skip';
// The headings components render for themselves (a card's or a highlight's title), which are not
// headings of the content.
const NOT_CONTENT_HEADINGS = '.cmp-teaser, .cmp-image, .cmp-download';

/** div.container.responsivegrid.<cls> > div.cmp-container [> div.aem-Grid] > children */
function layoutContainer(cls, children = [], grid = true) {
  const outer = document.createElement('div');
  outer.className = `container responsivegrid ${cls}`;
  const inner = document.createElement('div');
  inner.className = 'cmp-container';
  outer.append(inner);
  let holder = inner;
  if (grid) {
    holder = document.createElement('div');
    holder.className = 'aem-Grid aem-Grid--12 aem-Grid--default--12';
    inner.append(holder);
  }
  holder.append(...children);
  return outer;
}

/** BlockTableOfContentLayout's markup, and its two places. */
function buildLayout() {
  const column = 'aem-GridColumn aem-GridColumn--default--12';
  const root = layoutContainer('ds-brand-block-toc-layout', [
    layoutContainer(`ds-brand-block-toc-layout-sidebar ${column}`, [
      layoutContainer('ds-brand-sticky-container', [], false),
    ]),
    layoutContainer(`TOC-content-container ${column}`),
  ]);
  return {
    root,
    sidebar: root.querySelector('.ds-brand-sticky-container > .cmp-container'),
    content: root.querySelector('.TOC-content-container > .cmp-container > .aem-Grid'),
  };
}

const textOf = (cell) => (cell?.textContent.trim() || '');
const isEmptyCell = (cell) => !textOf(cell) && !cell.querySelector('img, picture, a');

/**
 * A component item as the block it is: a `.block.<name>` whose rows are the item's fields as
 * key-value rows (an empty field has no row, as in a block), inside a wrapper that carries the
 * item's editor attributes, which the block's decorator moves onto what it renders.
 */
function itemAsBlock(name, names, cells, attributes) {
  const block = document.createElement('div');
  block.className = `${name} block`;
  block.dataset.blockName = name;
  const inner = document.createElement('div');
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
  block.append(inner);
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
  const spec = fields.ITEMS.toc;
  const value = (field) => {
    const text = textOf(cells[spec.names.indexOf(field)]);
    return text && text !== NONE ? text : undefined;
  };
  const startLevel = value('startLevel') || 'h2';
  const stopLevel = value('stopLevel') || 'h3';
  const root = renderTableOfContent({
    content: { startLevel, stopLevel, items: contentHeadings(content, startLevel, stopLevel) },
    options: { ...(value('tocListTypeOption') && { tocListType: value('tocListTypeOption') }) },
    loadBundle,
  });
  Object.entries(attributes || {}).forEach(([attr, val]) => root.setAttribute(attr, val));
  return root;
}

/** @param {HTMLElement} block */
export default async function decorate(block) {
  loadBundle('ac-block-table-of-content-layout');
  const { own, items, wrapper } = readBlock(block, fields.NAMES);
  const found = fieldsByName(own, fields.NAMES);
  const { options } = applyNone(componentInput(found, valuesByName(found, fields.KINDS), {
    contentFields: {},
    optionFields: fields.OPTION_FIELDS,
    editableProps: [],
  }), fields);
  const { root, sidebar, content } = buildLayout();
  Object.values(options).filter(Boolean).forEach((cls) => root.classList.add(...cls.split(/\s+/)));

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
    item.block.dataset.blockStatus = 'loaded';
  }
  tocs.forEach(({ slot, cells, attributes }) => {
    slot.replaceWith(renderToc(cells, attributes, content));
  });

  replaceBlock(block, root, wrapper);
}
