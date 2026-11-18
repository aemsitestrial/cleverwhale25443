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

/**
 * Gives a composed section and every section nested in it the React blocks' AEM grid structure.
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
      if (nested) {
        // A part of the block: a container that is a full-width item of its parent's grid, with no
        // content width of its own unless the section names one (the React block's inner containers
        // have none).
        if (!explicitWidths.has(section)) {
          section.classList.remove('content-width-bleed');
          [...section.classList].filter((cls) => /^ds-content-width-\d+$/.test(cls))
            .forEach((cls) => section.classList.remove(cls));
        }
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
    const rows = section.dataset.aemGrid === 'rows';
    const widths = WIDTHS[section.dataset.aemGrid] || [12];
    // A carousel's items are its slides, as the React blocks mark them.
    const slides = section.classList.contains('ds-splide-carousel');
    [...grid.children].forEach((child, index) => {
      // A block's wrapper goes: the block is the item, as a React block's column is.
      let item = child;
      const block = child.matches('[class$="-wrapper"]') && child.children.length === 1
        && child.firstElementChild.matches('.block') ? child.firstElementChild : null;
      if (block) {
        child.replaceWith(block);
        item = block;
      }
      if (item.matches('.section') || item.classList.contains(COLUMN) || item.classList.contains('aem-Grid')) return;
      if (rows) item.classList.add(...GRID);
      else item.classList.add(...columnOf(widths[index % widths.length]), ...(slides ? ['splide__slide'] : []));
    });
  });
}
