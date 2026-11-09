// The table of contents layout: BlockTableOfContentLayout(), a sticky sidebar beside a content
// column. Both are slots: the wrapper renders them empty, and `layoutSlots(root)` gives the
// elements a site puts its blocks into (the table of contents and anything under it in the
// sidebar, the content it lists in the column). The toc-layout page controller
// (js/vendor/toc-layout-controller.js, the `toc-layout` entry of page-controllers.md) makes the
// sidebar sticky, opens the list on a narrow screen and marks the heading in view; it reads the
// links of the `.tableofcontents` in the sidebar.
import { BlockTableOfContentLayout } from '../block-table-of-content-layout.js';
import { addClasses } from './eds-component.js';

/**
 * The sidebar and the content column, as slots of their own: blocks a site puts in them.
 *
 * @typedef {{
 *   sidebar?: ReadonlyArray<HTMLElement>,
 *   children?: ReadonlyArray<HTMLElement>,
 * }} BlockTableOfContentLayoutContent
 */

// The option lists whose values are classes on the root.
const CLASS_LISTS = /** @type {const} */ (['spacingMy', 'spacingMb']);

/** @typedef {import('./eds-component.js').OptionsInput<(typeof CLASS_LISTS)[number]>} BlockTableOfContentLayoutOptions */

// The layout has no editable content props.
const EDITABLE = /** @type {readonly (readonly [never, string])[]} */ ([]);

/** @typedef {(typeof EDITABLE)[number][0]} BlockTableOfContentLayoutEditable */

/**
 * The slots of a rendered layout: the sidebar (inside its sticky container) and the content
 * column's grid.
 *
 * @param {Element} root
 * @returns {{ sidebar: HTMLElement | null, content: HTMLElement | null }}
 */
export function layoutSlots(root) {
  return {
    sidebar: root.querySelector('.ds-brand-sticky-container > .cmp-container'),
    content: root.querySelector('.TOC-content-container > .cmp-container > .aem-Grid'),
  };
}

/**
 * Renders the layout. `content.sidebar` and `content.children` are elements put in the sidebar and
 * in the content column, in order; both may be left out and filled later through
 * `layoutSlots(root)`. The `spacingMy` and `spacingMb` options are classes on the root.
 * `loadBundle(file)` loads the layout's CSS bundle (ac-block-table-of-content-layout).
 *
 * @param {import('./eds-component.js').RenderInput<BlockTableOfContentLayoutContent, BlockTableOfContentLayoutOptions, BlockTableOfContentLayoutEditable>} [input]
 * @returns {HTMLElement}
 */
export default function renderBlockTableOfContentLayout({
  content = {}, options = {}, loadBundle,
} = {}) {
  loadBundle?.('ac-block-table-of-content-layout.css');
  const root = /** @type {HTMLElement} */ (/** @type {unknown} */ (BlockTableOfContentLayout({
    sidebar: null,
    children: null,
  })));
  addClasses(root, CLASS_LISTS.map((list) => options[list]));
  const { sidebar, content: column } = layoutSlots(root);
  sidebar?.append(...(content.sidebar || []));
  column?.append(...(content.children || []));
  return root;
}
