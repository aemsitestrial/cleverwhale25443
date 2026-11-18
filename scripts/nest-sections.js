// Nested sections: a section whose "Nest inside" field names another section's "Name" moves into
// that section, as one item of its grid, in a `.nest-cell`. This is how a composition of the design
// system is built from its parts (the News block: its head row and its news carousel are sections
// nested in the News block's section). The package's css/page-glue.css lays the cells out
// (`.ds-composition .aem-Grid > .nest-cell`), and the brand's composition rules name them.
//
// The fields are section metadata: `nestId` (Name) and `parentId` (Nest inside), read from the
// section's data attributes (`data-nestid`, `data-parentid`). Run it after
// decorateContainerSections, which builds the grid a section is nested into, and before the
// sections load. Running it again (after an edit in the Universal Editor) moves only what is not
// nested yet.

const CELL = 'nest-cell';
const WARNING = 'nest-section-warning';

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
  if (!editing) return;
  const note = document.createElement('p');
  note.className = WARNING;
  note.textContent = text;
  section.prepend(note);
}

/**
 * Moves every section with a "Nest inside" into the section with that "Name", in document order.
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
    if (!name || section.parentElement?.classList.contains(CELL)) return;
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
    const cell = document.createElement('div');
    cell.className = CELL;
    slotOf(parent).append(cell);
    cell.append(section);
  });
}
