/**
 * Builds the wrapper of the design system's ContainerLayout as DOM, for the places that build a
 * container without React: a page section, the container block, and any block layout that needs
 * the same wrapper. The markup, class order and class names are those of ContainerLayout
 * (libs/aem-core-lib/src/lib/container-layout/container-layout.tsx); a test renders both and
 * compares them.
 *
 *   <div id class="container responsivegrid [ds-brand-container] [mx-auto] [max-w-full]
 *                  [ds-content-width-N] [grid-col-*] [className]">
 *     <div class="cmp-container" style="background-color; background-image">
 *       [<div class="aem-Grid aem-Grid--12 aem-Grid--default--12">] ...children... [</div>]
 *
 * Props are those of ContainerLayout: id, className, useLibClass, centered, fullWidth,
 * contentWidth (1 to 12), grid (1 to 5, '1-2' or '2-1'), bgColor, bgImage (a CSS value, for
 * example url("...")) and useAemGridTemplate. Children are not a prop: the caller appends them to
 * `content`, which is the grid element with useAemGridTemplate and the .cmp-container otherwise.
 *
 * With `root`, an element that already exists (a page section decorated by the EDS core) is
 * wrapped instead of a new outer element being made: it keeps its own classes, attributes and
 * place in the page, takes the classes above, and receives the .cmp-container as its last child.
 * Returns { root, container, content }.
 */
/** @type {Record<string, string>} */
const GRID_CLASS = {
  1: 'grid-col-1',
  2: 'grid-col-2',
  3: 'grid-col-3',
  4: 'grid-col-4',
  5: 'grid-col-5',
  '1-2': 'grid-col-1-2',
  '2-1': 'grid-col-2-1',
};

/** @param {number | string} [grid] */
export function gridClassName(grid) {
  return (grid !== undefined && GRID_CLASS[grid]) || '';
}

// The grid count a grid class stands for (grid-col-3 is 3, grid-col-1-2 is '1-2'), or undefined.
/** @param {string} [gridClass] */
export function gridCountOf(gridClass) {
  return Object.keys(GRID_CLASS).map((key) => (/^\d+$/.test(key) ? Number(key) : key))
    .find((count) => GRID_CLASS[count] === gridClass);
}

/**
 * The props of ContainerLayout that this builder takes.
 *
 * @typedef {object} ContainerProps
 * @property {string} [id]
 * @property {string} [className]
 * @property {boolean} [useLibClass]
 * @property {boolean} [centered]
 * @property {boolean} [fullWidth]
 * @property {number | string} [contentWidth] 1 to 12
 * @property {string} [bgColor]
 * @property {string} [bgImage] a CSS value, for example url("...")
 * @property {number | string} [grid] 1 to 5, '1-2' or '2-1'
 * @property {boolean} [useAemGridTemplate]
 */

/**
 * @param {ContainerProps} [props]
 * @param {HTMLElement} [root]
 * @returns {{ root: HTMLElement, container: HTMLElement, content: HTMLElement }}
 */
export default function renderContainer({
  id,
  className,
  useLibClass = false,
  centered = false,
  fullWidth = false,
  contentWidth,
  bgColor,
  bgImage,
  grid,
  useAemGridTemplate = false,
} = {}, root = document.createElement('div')) {
  const names = [
    'container responsivegrid',
    useLibClass && 'ds-brand-container',
    centered && 'mx-auto',
    fullWidth && 'max-w-full',
    contentWidth && `ds-content-width-${contentWidth}`,
    gridClassName(grid),
    className,
  ];
  if (id) root.id = id;
  names.filter(Boolean).join(' ').split(/\s+/).forEach((name) => root.classList.add(name));

  const container = document.createElement('div');
  container.className = 'cmp-container';
  if (bgColor) container.style.backgroundColor = bgColor;
  if (bgImage) container.style.backgroundImage = bgImage;

  let content = container;
  if (useAemGridTemplate) {
    content = document.createElement('div');
    content.className = 'aem-Grid aem-Grid--12 aem-Grid--default--12';
    container.append(content);
  }
  root.append(container);
  return { root, container, content };
}
