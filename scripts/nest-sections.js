// Nested sections and the structure of a composition.
//
// A section whose "Nest inside" field names another section's "Name" moves into that section's
// grid. This is how a composition of the design system is built from its parts: the News block's
// head row and its news carousel are sections nested in the News block's section.
//
// The design system's React blocks render the AEM grid: a container holds its parts as items of
// its grid, `.container > .cmp-container > .aem-Grid > .aem-GridColumn`, and the blocks'
// stylesheets are written against that structure (`.ds-block-news > .cmp-container > .aem-Grid >
// .container:nth-child(1) .aem-GridColumn:nth-child(2)`). alignToAemGrid gives a composed section
// and the sections nested in it that structure: a nested section is an item of its parent's grid
// (a container with the grid column classes), a block is an item of its section's grid (its
// wrapper goes), and each item takes the column classes the React blocks give for the section's
// Grid (2 columns: 6 + 6 from a medium screen up, 12 below). The section then lays out as the
// React block does, with the AEM grid, not the Grid's CSS grid.
//
// The fields are section metadata: `nestId` (Name) and `parentId` (Nest inside), read from the
// section's data attributes (`data-nestid`, `data-parentid`). Run widthsOf before
// decorateContainerSections, nestSections and alignToAemGrid after it and before the sections load.
// Running them again (after an edit in the Universal Editor) changes only what is not done yet.

import { layoutOf } from '../ds-eds-assets-dekker/js/vendor/container-composition.js';

const WARNING = 'nest-section-warning';
const GRID = ['aem-Grid', 'aem-Grid--12', 'aem-Grid--default--12'];
const COLUMN = 'aem-GridColumn';

// The column classes of an item of a grid of N columns, as the React blocks write them: the width
// from a medium screen up, and the full width on a small screen.
const columnOf = (width) => [
  COLUMN, `aem-GridColumn--default--${width}`, `aem-GridColumn--large-screens--${width}`,
  `aem-GridColumn--medium-screens--${width}`, 'aem-GridColumn--small-screen--12',
  'aem-GridColumn--extra-small-screen--12',
];
// The widths of the items for each Grid of a section, in item order (repeating).
const WIDTHS = {
  'grid-col-1': [12],
  'grid-col-2': [6],
  'grid-col-3': [4],
  'grid-col-4': [3],
  'grid-col-1-2': [4, 8],
  'grid-col-2-1': [8, 4],
};

/** The place in `parent` a nested section goes: its grid, else its container, else itself. */
function slotOf(parent) {
  return parent.querySelector(':scope > .cmp-container > .aem-Grid')
    || parent.querySelector(':scope > .cmp-container')
    || parent;
}

/**
 * In the editor a section that cannot be nested says why; a published page shows nothing.
 * @param {Element} section
 * @param {string} text
 * @param {boolean} editing
 */
function warn(section, text, editing) {
  section.querySelector(`:scope > .${WARNING}`)?.remove();
  if (!editing || !text) return;
  const note = document.createElement('p');
  note.className = WARNING;
  note.textContent = text;
  section.prepend(note);
}

/** The sections that name a content width themselves. Call it before decorateContainerSections. */
export function widthsOf(main) {
  return new Set(main.querySelectorAll('.section[data-contentwidth]'));
}

/**
 * Moves every section with a "Nest inside" into the section with that "Name", in document order, as
 * the last item of its grid.
 * @param {Element} main
 * @param {{ editing?: boolean }} [options] `editing`: the page is open in the Universal Editor
 */
export default function nestSections(main, { editing = false } = {}) {
  const byName = new Map();
  main.querySelectorAll('.section[data-nestid]').forEach((section) => {
    const name = section.dataset.nestid.trim();
    byName.set(name, byName.has(name) ? null : section); // a name two sections give is no place
  });
  main.querySelectorAll('.section[data-parentid]').forEach((section) => {
    const name = section.dataset.parentid.trim();
    if (!name || section.parentElement?.closest('.section')) return;
    const parent = byName.get(name);
    if (parent === undefined) {
      warn(section, `Nest inside "${name}": no section has this Name, so this section stays where it is.`, editing);
      return;
    }
    if (parent === null) {
      warn(section, `Nest inside "${name}": two sections have this Name, so this section stays where it is.`, editing);
      return;
    }
    if (parent === section || section.contains(parent)) {
      warn(section, `Nest inside "${name}": a section cannot be nested inside itself.`, editing);
      return;
    }
    warn(section, '', false);
    slotOf(parent).append(section);
  });
}

/**
 * The grid of a section: `.cmp-container > .aem-Grid`, made when the section has only its container
 * (a section with no Grid), with the AEM grid's classes.
 * @param {Element} section
 */
function gridOf(section) {
  const container = section.querySelector(':scope > .cmp-container');
  if (!container) return null;
  let grid = container.querySelector(':scope > .aem-Grid');
  if (!grid) {
    grid = document.createElement('div');
    grid.append(...container.childNodes);
    container.append(grid);
  }
  grid.classList.add(...GRID);
  return grid;
}

/** The block an item of a grid is: the block itself, or the one block of its wrapper. */
const blockIn = (child) => {
  if (child.matches('.block')) return child;
  return child.matches('[class$="-wrapper"]') && child.children.length === 1
    && child.firstElementChild.matches('.block') ? child.firstElementChild : null;
};

/**
 * Gives the items of a grid their column classes for `gridKey` (a Grid value, or "rows"), the block
 * of a wrapper standing in for its wrapper, as a React block's column is.
 * @param {Element} grid
 * @param {string} gridKey
 * @param {boolean} slides the grid is a carousel's: its items are its slides
 */
function alignItems(grid, gridKey, slides) {
  const widths = WIDTHS[gridKey] || [12];
  [...grid.children].forEach((child, index) => {
    const block = blockIn(child);
    if (block && block !== child) child.replaceWith(block);
    const item = block || child;
    if (item.matches('.section, .ds-composition-part') || item.classList.contains(COLUMN)
      || item.classList.contains('aem-Grid')) return;
    if (gridKey === 'rows') item.classList.add(...GRID);
    else item.classList.add(...columnOf(widths[index % widths.length]), ...(slides ? ['splide__slide'] : []));
  });
}

/**
 * The containers of a composition's parts in `grid` (the layout of container-composition.js),
 * made the first time: a `.container` with the part's classes, a full-width item of the grid, with
 * its own grid inside, as the React block writes it.
 * @typedef {import('../ds-eds-assets-dekker/js/vendor/container-composition.js').CompositionPart}
 *   CompositionPart
 * @param {Element} grid
 * @param {CompositionPart[]} layout
 */
function partsIn(grid, layout) {
  return layout.map((part, index) => {
    let element = grid.querySelector(`:scope > .ds-composition-part[data-part="${index}"]`);
    if (!element) {
      element = document.createElement('div');
      element.className = 'container responsivegrid ds-composition-part';
      if (part.class) element.classList.add(...part.class.split(/\s+/));
      element.classList.add(...columnOf(12));
      element.dataset.part = String(index);
      const container = document.createElement('div');
      container.className = 'cmp-container';
      const inner = document.createElement('div');
      inner.classList.add(...GRID);
      container.append(inner);
      element.append(container);
      const next = grid.querySelector(`:scope > .ds-composition-part[data-part="${index + 1}"]`);
      grid.insertBefore(element, next);
    }
    return { part, element, grid: element.querySelector(':scope > .cmp-container > .aem-Grid') };
  });
}

/**
 * Gives a composed section and every section nested in it the React blocks' AEM grid structure. A
 * composition with a layout (the News block) takes its blocks into its parts (the heading and
 * the button in a row, the cards in a carousel), in their order on the page; a block no part takes
 * stays an item of the section's grid.
 * @param {Element} main
 * @param {Set<Element>} explicitWidths the sections that name their content width (widthsOf)
 */
export function alignToAemGrid(main, explicitWidths = new Set()) {
  const sections = [...main.querySelectorAll('.section.ds-composition')]
    .flatMap((section) => [section, ...section.querySelectorAll('.section')]);
  new Set(sections).forEach((section) => {
    const nested = !!section.parentElement?.closest('.section');
    // The section itself is aligned once (a later run after an edit would take a width it names);
    // its items are aligned on every run, so a block an edit swapped in gets its column again.
    if (!section.dataset.aemGrid) {
      // The block's root, and each of its parts, is a full-width item of the grid around it.
      section.classList.add(...columnOf(12));
      if (nested && !explicitWidths.has(section)) {
        // A part of the block: no content width of its own unless the section names one (the React
        // block's inner containers have none).
        section.classList.remove('content-width-bleed');
        [...section.classList].filter((cls) => /^ds-content-width-\d+$/.test(cls))
          .forEach((cls) => section.classList.remove(cls));
      }
      // The section's Grid becomes the items' column classes; the AEM grid lays them out. A section
      // with no Grid stacks its items as rows of the grid (`.aem-Grid` each), as the React blocks
      // write a column of components (BlockProducts' heading and text).
      const gridClass = Object.keys(WIDTHS).find((cls) => section.classList.contains(cls)) || 'rows';
      section.classList.remove(gridClass);
      section.dataset.aemGrid = gridClass;
    }
    const grid = gridOf(section);
    if (!grid) return;
    const layout = !nested && layoutOf(section);
    if (layout) {
      const parts = partsIn(grid, layout);
      [...grid.children].forEach((child) => {
        const block = blockIn(child);
        const name = block?.dataset.blockName || block?.classList[0];
        const target = name && parts.find(({ part }) => part.blocks.includes(name));
        if (!target) return;
        if (block !== child) child.remove();
        target.grid.append(block);
      });
      parts.forEach(({ part, element, grid: partGrid }) => alignItems(partGrid, part.grid || 'rows', element.classList.contains('ds-splide-carousel')));
    }
    alignItems(grid, section.dataset.aemGrid, section.classList.contains('ds-splide-carousel'));
  });
}
