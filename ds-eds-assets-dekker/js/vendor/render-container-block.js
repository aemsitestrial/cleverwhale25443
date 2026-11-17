// The container block: the design system's ContainerLayout wrapper (render-container.js) around
// an element that already exists, with the grid and content width, the composition and background,
// and the spacing lists as classes, the CSS bundle each composition needs, and the items it
// holds in its grid.
import renderContainer, { gridCountOf } from './render-container.js';
import { addClasses } from './eds-component.js';
import { compositionOf, oneOf } from './container-composition.js';
import { contentWidth } from '../../options/container.js';

// The block bundles are the rules of the composition, which the page section reads too.
export { WRAPPER_BUNDLES } from './container-composition.js';

/** @typedef {import('./eds-component.js').OptionValues} OptionValues */

/**
 * What a site fills in for a container: the items it holds, and the grid and the content width as
 * values of the gridVariant and contentWidth lists. The grid is a class string (`grid-col-3`) and
 * not ContainerLayout's `grid` count, and the width is a string and not its `contentWidth` number,
 * because the lists are what an author picks from. A value the lists do not have gives none.
 *
 * @typedef {object} ContainerBlockContent
 * @property {ReadonlyArray<Node>} [children] the items, each one grid cell
 * @property {OptionValues['gridVariant']} [gridVariant]
 * @property {OptionValues['contentWidth']} [contentWidth]
 */

// The spacing lists in the order their classes are set.
const SPACING_LISTS = /** @type {const} */ (['spacingPt', 'spacingPb', 'spacingPy', 'spacingMt', 'spacingMb', 'spacingMy']);

// Every option list the wrapper takes. The composition and background are classes on the root, set
// by the composition rules (container-composition.js) with the bundles they need.
const OPTION_LISTS = /** @type {const} */ (['wrappersVariant', 'backgroundVariant', ...SPACING_LISTS]);

/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} ContainerBlockOptions */

// The container renders no content prop of its own to edit in place; its items are blocks with
// editable props of their own.
/** @typedef {never} ContainerBlockEditable */

/**
 * Renders the container into `root`, the element the container is built in (it keeps its place,
 * its classes and its attributes), and returns { root, content }, `content` being the grid the
 * items are in. `content.children` are the items, each one grid cell. `content.gridVariant` is the
 * grid's class (`grid-col-3`; none gives no grid) and `content.contentWidth` the width of the
 * content, one of the contentWidth list; a value the lists do not have gives none.
 *
 * The `wrappersVariant` (a composition) and `backgroundVariant` options are classes on the root, and a
 * composition loads its CSS bundle through `loadBundle(file)`.
 * `spacingPt`, `spacingPb`, `spacingPy`, `spacingMt`, `spacingMb` and `spacingMy` are classes too.
 * The root carries no brand scope class: the stylesheets are scoped under the page's brand body
 * class.
 *
 * @param {import('./eds-component.js').RenderInput<ContainerBlockContent, ContainerBlockOptions, ContainerBlockEditable> & { root?: HTMLElement }} input
 * @returns {{ root: HTMLElement, content: HTMLElement }}
 */
export default function renderContainerBlock({
  content = {}, options = {}, root, loadBundle,
} = {}) {
  const { classes, bundles, libClass } = compositionOf(options);
  bundles.forEach((file) => loadBundle?.(file));
  const classHolder = document.createElement('div');
  addClasses(classHolder, [...classes, ...SPACING_LISTS.map((list) => options[list])]);
  // renderContainer's declaration lists `id`, `bgColor` and `bgImage` as required, so they are given
  // empty: the container has no id of its own and no background style (a background is a class).
  // It also types `root` as HTMLDivElement, the type of its default value, but it only adds classes
  // to the element and appends to it, so any element serves.
  const built = renderContainer({
    id: undefined,
    bgColor: undefined,
    bgImage: undefined,
    className: classHolder.className,
    contentWidth: oneOf(contentWidth, content.contentWidth) || undefined,
    grid: gridCountOf(content.gridVariant),
    useLibClass: libClass,
    useAemGridTemplate: true,
  }, /** @type {HTMLDivElement | undefined} */ (root));
  built.content.append(...(content.children || []));
  return { root: built.root, content: built.content };
}
