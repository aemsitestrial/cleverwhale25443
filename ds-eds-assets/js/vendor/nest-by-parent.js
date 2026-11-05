/*
 * Nests decorated blocks (the layout blocks a site names, see nestByParent) under whatever names
 * itself with data-nest-id matching their data-parent-id -- a top-level block (whose
 * slot is the .aem-Grid it built, or the block itself if it built none) or an
 * item inside one (whose slot is its own content element, e.g. one accordion
 * panel -- see slotFor). Only a block with a parentId field moves: the layout
 * blocks (container, accordion, tabs) and the content blocks table, carousel,
 * splide carousel, banner, text content, table of content, list and teaser (the site lists the
 * ones it ships). Those content blocks are children
 * only, never places, and every other content block stays an item of a layout
 * block in the authored content. Must run AFTER blocks are decorated: a
 * parent's decorate() rebuilds its own DOM, so children moved in earlier
 * would be wiped. A child never moves into its own subtree;
 * already-nested children are skipped, so calling it again (loadEager then
 * loadLazy, or after an edit) is safe.
 *
 * Where a nested block lands in its place is set by the place's
 * data-nest-order: "end" (default) appends after the place's own content,
 * "start" inserts before it. Blocks nested at the start keep document order.
 *
 * Problems that leave a block where it is -- an unmatched parentId, two
 * places sharing one name, a block of another kind that still carries a
 * parentId -- would otherwise be silent. In an authoring/editor render --
 * detected by the presence of data-aue-resource, which real published pages
 * never carry -- they show a visible warning on the block instead. Never
 * shown on a real published page: isAuthoringContext is false there, so warn
 * is false and nestOnce never touches the DOM beyond moving blocks.
 */
const WARNING_CLASS = 'nest-parent-warning';
const MISPLACED_CLASS = 'nest-misplaced-warning';
const STRUCTURE_WARNING = 'twf-structure-warning';

export function isAuthoringContext(root) {
  return !!root.querySelector('[data-aue-resource]');
}

export function setWarning(child, text, className = WARNING_CLASS) {
  let warning = child.querySelector(`:scope > .${className}`);
  if (!warning) {
    warning = document.createElement('div');
    warning.className = className;
    warning.setAttribute('contenteditable', 'false');
    warning.style.cssText = 'display:block;background:#fff3cd;color:#664d03;'
      + 'border:1px solid #ffe69c;border-radius:4px;padding:8px 12px;'
      + 'margin:0 0 8px;font:600 13px/1.4 sans-serif;';
    child.prepend(warning);
  }
  // Rewriting identical text still replaces the text node, which the editor's
  // MutationObserver sees as a change and answers with another nestByParent run.
  if (warning.textContent !== text) warning.textContent = text;
}

/**
 * Shows each structure problem the page controllers report as a banner on its element and takes
 * a banner away once its problem is gone. Authoring renders pass this as the runner's onWarning.
 * @param {ParentNode} root
 * @param {Array<{ element: Element, message: string }>} problems
 */
export function showStructureProblems(root, problems) {
  root.querySelectorAll(`.${STRUCTURE_WARNING}`).forEach((banner) => {
    if (!problems.some(({ element }) => element === banner.parentElement)) banner.remove();
  });
  problems.forEach(({ element, message }) => setWarning(element, message, STRUCTURE_WARNING));
}

const idSelector = (id) => `[data-nest-id="${CSS.escape(id)}"]`;

/**
 * The place named `id`: `owner` is the element carrying data-nest-id, `slot`
 * is where children go. A top-level block names itself on the block element
 * and its slot is the .aem-Grid it built. An item inside a container+item
 * block (e.g. one accordion panel) names its own content element, which IS
 * the slot (see render-accordion-item.js). `count` is how many elements
 * carry the name; the first in document order wins.
 */
function slotFor(root, id) {
  const owners = root.querySelectorAll(idSelector(id));
  if (!owners.length) return null;
  const owner = root.querySelector(`.block${idSelector(id)}`) || owners[0];
  const slot = owner.matches('.block') ? (owner.querySelector('.aem-Grid') || owner) : owner;
  return { slot, owner, count: owners.length };
}

function appendByOrder(slot, owner, child) {
  if (owner.dataset.nestOrder === 'start') {
    const firstOwn = [...slot.children].find((el) => !el.matches('[data-parent-id]')
      && !el.classList.contains(WARNING_CLASS));
    if (firstOwn) {
      firstOwn.before(child);
      return;
    }
  }
  slot.append(child);
}

function nestOnce(root, warn, canNest, layoutSelector) {
  let moved = 0;
  if (warn) {
    // A block that no longer carries a parentId (author cleared the field)
    // may still carry a stale warning from an earlier unmatched value.
    root.querySelectorAll(`.${WARNING_CLASS}`).forEach((warning) => {
      if (!warning.parentElement?.dataset.parentId) warning.remove();
    });
  }
  root.querySelectorAll('.block[data-parent-id]').forEach((child) => {
    if (!child.matches(layoutSelector)) {
      if (warn) {
        // The blocks that can be nested are the ones the site's selector names.
        const nestable = [...layoutSelector.matchAll(/\.block\.([\w-]+)/g)].map(([, name]) => name);
        setWarning(child, 'Not nested: this kind of block cannot be nested'
          + `${nestable.length ? ` (${nestable.join(', ')} can)` : ''}. `
          + 'Put this block inside a container instead.');
      }
      return;
    }
    const found = slotFor(root, child.dataset.parentId);
    if (!found) {
      if (warn) {
        setWarning(child, `Not nested: no block is named "${child.dataset.parentId}" for nesting. `
          + 'Open this block\'s "Nest inside" field and pick a place again, '
          + 'or choose "In its section (not nested)".');
      }
      return;
    }
    const { slot, owner, count } = found;
    if (slot.contains(child) || child.contains(slot)) return;
    if (!canNest(child, owner)) return;
    if (warn) {
      if (count > 1) {
        setWarning(child, `Several blocks are named "${child.dataset.parentId}" for nesting; `
          + 'this block goes into the first one. To use another one, open this block\'s '
          + '"Nest inside" field and pick it again.');
      } else {
        child.querySelector(`:scope > .${WARNING_CLASS}`)?.remove();
      }
    }
    const wrapper = child.parentElement;
    appendByOrder(slot, owner, child);
    // The child may adapt to the place it landed in; it hears of the move only after the block is
    // decorated, which is when this runs.
    child.dispatchEvent(new child.ownerDocument.defaultView.CustomEvent('nested', { detail: { slot, owner } }));
    if (wrapper && !wrapper.children.length && !wrapper.textContent.trim()) wrapper.remove();
    moved += 1;
  });
  return moved;
}

/**
 * Duplicate writes the copy of a nested layout block under the resource of the block around
 * it, so the page renders it as a stray item inside that block instead of as a block of its
 * own. It still carries the layout block's model, which a real item never does. Authoring
 * renders only, like the other warnings. Returns how many copies were flagged.
 */
export function warnMisplacedCopies(root, { layoutModels }) {
  if (!isAuthoringContext(root)) return 0;
  const selector = layoutModels.map((model) => `.block [data-aue-model="${model}"]`).join(',');
  const strays = [...root.querySelectorAll(selector)].filter((el) => !el.matches('.block'));
  strays.forEach((stray) => {
    const label = stray.closest('.block')?.dataset.aueLabel || 'another block';
    setWarning(stray, `This copy was placed inside the ${label} instead of next to the original. `
      + 'Undo, then add a new block instead of duplicating.', MISPLACED_CLASS);
  });
  return strays.length;
}

/**
 * @param {ParentNode} root
 * @param {object} options
 * @param {string} options.layoutSelector Matches the blocks that may nest: the site's layout and
 *   nestable content blocks that carry a parentId, for example
 *   `.block.acg-tabs[data-parent-id],.block.acg-text[data-parent-id]`.
 * @param {string[]} options.layoutModels The models of the layout blocks, for the misplaced-copy
 *   warning.
 * @param {(child: Element, owner: Element) => boolean} [options.canNest] The hook for the place
 *   matrix and the depth cap; it defaults to allowing every nesting.
 */
export default function nestByParent(root = document, { layoutSelector, layoutModels, canNest = () => true }) {
  if (!layoutSelector || !layoutModels) throw new Error('nestByParent needs layoutSelector and layoutModels');
  const warn = isAuthoringContext(root);
  if (warn) warnMisplacedCopies(root, { layoutModels });
  let total = 0;
  // A parent can itself be moved by a later iteration, so repeat until stable.
  let moved = nestOnce(root, warn, canNest, layoutSelector);
  while (moved > 0) {
    total += moved;
    moved = nestOnce(root, warn, canNest, layoutSelector);
  }
  return total;
}
