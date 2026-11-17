/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} ContainerBlockOptions */
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
export default function renderContainerBlock({ content, options, root, loadBundle, }?: import('./eds-component.js').RenderInput<ContainerBlockContent, ContainerBlockOptions, ContainerBlockEditable> & {
    root?: HTMLElement;
}): {
    root: HTMLElement;
    content: HTMLElement;
};
export { WRAPPER_BUNDLES } from "./container-composition.js";
export type ContainerBlockOptions = import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>;
export type ContainerBlockEditable = never;
export type OptionValues = import('./eds-component.js').OptionValues;
/**
 * What a site fills in for a container: the items it holds, and the grid and the content width as
 * values of the gridVariant and contentWidth lists. The grid is a class string (`grid-col-3`) and
 * not ContainerLayout's `grid` count, and the width is a string and not its `contentWidth` number,
 * because the lists are what an author picks from. A value the lists do not have gives none.
 */
export type ContainerBlockContent = {
    /**
     * the items, each one grid cell
     */
    children?: ReadonlyArray<Node>;
    gridVariant?: OptionValues['gridVariant'];
    contentWidth?: OptionValues['contentWidth'];
};
declare const OPTION_LISTS: readonly ["wrappersVariant", "backgroundVariant", "spacingPt", "spacingPb", "spacingPy", "spacingMt", "spacingMb", "spacingMy"];
