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
export default function renderContainerBlock({ content, options, root, loadBundle, }?: import('./eds-component.js').RenderInput<ContainerBlockContent, ContainerBlockOptions, never> & {
    root?: HTMLElement;
}): {
    root: HTMLElement;
    content: HTMLElement;
};
export const BLOCK_CONTAINER_BUNDLES: {
    'ac-core-block-quote-section': string;
    'ac-core-block-section-banner-with-cards': string;
    'ac-core-block-content-with-splide-grid-carousel': string;
    'ac-core-block-splide-grid-carousel': string;
    'ac-core-block-country-selector': string;
    'ac-core-block-cta-section': string;
};
export const COMPOSITION_BUNDLES: {
    'ac-core-block-teasers-with-filter': string;
    'ds-brand-block-toc-layout': string;
    'ac-core-block-quote-section': string;
    'ac-core-block-section-banner-with-cards': string;
    'ac-core-block-content-with-splide-grid-carousel': string;
    'ac-core-block-splide-grid-carousel': string;
    'ac-core-block-country-selector': string;
    'ac-core-block-cta-section': string;
};
export type ContainerBlockOptions = import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>;
/**
 * What a site fills in for the container: the items, one grid cell each, the grid's class and the
 * width of the content.
 */
export type ContainerBlockContent = {
    children?: ReadonlyArray<HTMLElement>;
    gridVariant?: import('./eds-component.js').OptionValues['gridVariant'];
    contentWidth?: import('./eds-component.js').OptionValues['contentWidth'];
};
declare const OPTION_LISTS: readonly ["filterBlockVariant", "blockContainerVariant", "carouselVariant", "tocLayout", "themeType", "spacingPt", "spacingPb", "spacingPy", "spacingMt", "spacingMb", "spacingMy"];
export {};
