// The container block: the design system's ContainerLayout wrapper (render-container.js) around
// an element that already exists, with the grid, content width, style and spacing lists as
// classes, the compositions the container can be (a Teasers with filter, a carousel, a Table of
// contents layout, a Block Containers composition) with the CSS bundle each needs, and the items
// it holds in its grid.
import renderContainer, { gridCountOf } from './render-container.js';
import { addClasses } from './eds-component.js';
import {
  contentWidth, filterBlockVariant, carouselVariant, tocLayout,
} from '../../options/container.js';
import { themeType } from '../../options/common.js';

// The class of each whole composition of the "Variants - Block Containers" list, with the CSS
// bundle that styles it. A value can carry a modifier after the composition's class
// ("... modifier-horizontal"); the composition is the first class, and the value is a class of the
// root whenever that class has a bundle.
export const BLOCK_CONTAINER_BUNDLES = {
  'ac-core-block-quote-section': 'ac-block-quote-section',
  'ac-core-block-section-banner-with-cards': 'ac-block-section-banner-with-cards',
  'ac-core-block-content-with-splide-grid-carousel': 'ac-block-content-with-splide-grid-carousel',
  'ac-core-block-splide-grid-carousel': 'ac-block-splide-grid-carousel',
  'ac-core-block-country-selector': 'ac-block-country-selector',
  'ac-core-block-cta-section': 'ac-block-cta-section',
};

// Every composition bundle with the class of the container that carries it, the compositions
// that have a list of their own included.
export const COMPOSITION_BUNDLES = {
  ...BLOCK_CONTAINER_BUNDLES,
  'ac-core-block-teasers-with-filter': 'ac-block-teasers-with-filter',
  'ds-brand-block-toc-layout': 'ac-block-table-of-content-layout',
};

const FILTER_BUNDLE = COMPOSITION_BUNDLES['ac-core-block-teasers-with-filter'];
const CAROUSEL_BUNDLE = 'ac-splide-carousel';
const TOC_ROOT_CLASS = 'ds-brand-block-toc-layout';

// The spacing lists in the order their classes are set.
const SPACING_LISTS = /** @type {const} */ ([
  'spacingPt', 'spacingPb', 'spacingPy', 'spacingMt', 'spacingMb', 'spacingMy',
]);

/**
 * The value, when the list has it, and '' otherwise.
 *
 * @param {ReadonlyArray<{ value: string }>} list
 * @param {string} [value]
 * @returns {string}
 */
const oneOf = (list, value) => (list.map((entry) => entry.value).includes(/** @type {string} */ (value)) ? /** @type {string} */ (value) : '');

// The option lists the container takes; the composition lists and `themeType` are classes on the
// root too, but each also decides a bundle, so they are read by name below.
const OPTION_LISTS = /** @type {const} */ ([
  'filterBlockVariant', 'blockContainerVariant', 'carouselVariant', 'tocLayout', 'themeType',
  ...SPACING_LISTS,
]);

/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} ContainerBlockOptions */

/**
 * What a site fills in for the container: the items, one grid cell each, the grid's class and the
 * width of the content.
 *
 * @typedef {{
 *   children?: ReadonlyArray<HTMLElement>,
 *   gridVariant?: import('./eds-component.js').OptionValues['gridVariant'],
 *   contentWidth?: import('./eds-component.js').OptionValues['contentWidth'],
 * }} ContainerBlockContent
 */

/**
 * Renders the container into `root`, the element the container is built in (it keeps its place,
 * its classes and its attributes; with none, a new div is made), and returns { root, content }, `content` being the grid the
 * items are in. `content.children` are the items, each one grid cell. `content.gridVariant` is the
 * grid's class (`grid-col-3`; none gives no grid) and `content.contentWidth` the width of the
 * content, one of the contentWidth list; a value the lists do not have gives none.
 *
 * The `filterBlockVariant`, `blockContainerVariant`, `carouselVariant`, `tocLayout` and
 * `themeType` options are classes on the root, and the composition they choose loads its CSS
 * bundle through `loadBundle(file)`. `spacingPt`, `spacingPb`, `spacingPy`, `spacingMt`,
 * `spacingMb` and `spacingMy` are classes too. A carousel container turns each of its items into
 * a slide: the carousel controller finds its slides by the `aem-GridColumn` class, which AEM puts
 * on each component of a grid and the items here do not carry.
 *
 * @param {import('./eds-component.js').RenderInput<ContainerBlockContent, ContainerBlockOptions, never>
 *   & { root?: HTMLElement }} [input]
 * @returns {{ root: HTMLElement, content: HTMLElement }}
 */
export default function renderContainerBlock({
  content = {}, options = {}, root, loadBundle,
} = {}) {
  const filter = oneOf(filterBlockVariant, options.filterBlockVariant);
  const blockContainer = BLOCK_CONTAINER_BUNDLES[(options.blockContainerVariant || '').split(/\s+/)[0]]
    ? options.blockContainerVariant : '';
  const carousel = oneOf(carouselVariant, options.carouselVariant);
  const toc = oneOf(tocLayout, options.tocLayout);
  const theme = oneOf(themeType, options.themeType);

  if (filter) loadBundle?.(`${FILTER_BUNDLE}.css`);
  if (blockContainer) {
    loadBundle?.(`${BLOCK_CONTAINER_BUNDLES[blockContainer.split(/\s+/)[0]]}.css`);
  }
  if (carousel) loadBundle?.(`${CAROUSEL_BUNDLE}.css`);
  if (toc === TOC_ROOT_CLASS) loadBundle?.(`${COMPOSITION_BUNDLES[TOC_ROOT_CLASS]}.css`);

  const classHolder = document.createElement('div');
  addClasses(classHolder, ['ac-core', filter, blockContainer, carousel, toc, theme,
    ...SPACING_LISTS.map((list) => options[list])]);
  const built = renderContainer({
    className: classHolder.className,
    contentWidth: oneOf(contentWidth, content.contentWidth) || undefined,
    grid: gridCountOf(content.gridVariant),
    useAemGridTemplate: true,
  }, root);
  const children = content.children || [];
  built.content.append(...children);
  if (carousel) children.forEach((slide) => slide.classList.add('aem-GridColumn'));
  return { root: built.root, content: built.content };
}
