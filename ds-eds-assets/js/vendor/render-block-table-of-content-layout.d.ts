/** @typedef {(typeof EDITABLE)[number][0]} BlockTableOfContentLayoutEditable */
/**
 * The slots of a rendered layout: the sidebar (inside its sticky container) and the content
 * column's grid.
 *
 * @param {Element} root
 * @returns {{ sidebar: HTMLElement | null, content: HTMLElement | null }}
 */
export function layoutSlots(root: Element): {
    sidebar: HTMLElement | null;
    content: HTMLElement | null;
};
/**
 * Renders the layout. `content.sidebar` and `content.children` are elements put in the sidebar and
 * in the content column, in order; both may be left out and filled later through
 * `layoutSlots(root)`. The `spacingMy` and `spacingMb` options are classes on the root.
 * `loadBundle(file)` loads the layout's CSS bundle (ac-block-table-of-content-layout).
 *
 * @param {import('./eds-component.js').RenderInput<BlockTableOfContentLayoutContent, BlockTableOfContentLayoutOptions, BlockTableOfContentLayoutEditable>} [input]
 * @returns {HTMLElement}
 */
export default function renderBlockTableOfContentLayout({ content, options, loadBundle, }?: import('./eds-component.js').RenderInput<BlockTableOfContentLayoutContent, BlockTableOfContentLayoutOptions, BlockTableOfContentLayoutEditable>): HTMLElement;
export type BlockTableOfContentLayoutEditable = (typeof EDITABLE)[number][0];
/**
 * The sidebar and the content column, as slots of their own: elements a site puts in them.
 */
export type BlockTableOfContentLayoutContent = {
    sidebar?: ReadonlyArray<HTMLElement>;
    children?: ReadonlyArray<HTMLElement>;
};
export type BlockTableOfContentLayoutOptions = import('./eds-component.js').OptionsInput<(typeof CLASS_LISTS)[number]>;
/** @typedef {import('./eds-component.js').OptionsInput<(typeof CLASS_LISTS)[number]>} BlockTableOfContentLayoutOptions */
declare const EDITABLE: readonly (readonly [never, string])[];
/**
 * The sidebar and the content column, as slots of their own: elements a site puts in them.
 *
 * @typedef {{
 *   sidebar?: ReadonlyArray<HTMLElement>,
 *   children?: ReadonlyArray<HTMLElement>,
 * }} BlockTableOfContentLayoutContent
 */
declare const CLASS_LISTS: readonly ["spacingMy", "spacingMb"];
export {};
