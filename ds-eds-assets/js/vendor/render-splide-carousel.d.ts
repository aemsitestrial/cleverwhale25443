/**
 * The slide elements of a rendered carousel, in item order, before the slider moves them into its
 * own structure (it moves the elements, so attributes set before it starts stay on them).
 *
 * @param {Element} root
 * @returns {Element[]}
 */
export function itemElements(root: Element): Element[];
/**
 * Starts the slider on this root alone. The controller mounts every root it finds by class, and a
 * mounted root mounted again gets its slides wrapped and cloned a second time, so the controller is
 * given a class that only this root carries while it looks. The caller runs it once the root is in
 * the page. `type` is the slider's: `loop` (the default) repeats the slides by cloning them, `slide`
 * does not. A clone repeats the id of its slide, so each clone's elements get an id of their own,
 * and the controller numbers roots per controller, so the root is given a page-unique id.
 *
 * @param {Element} root
 * @param {{ type?: 'loop' | 'slide' }} [options]
 */
export function startSplideCarousel(root: Element, { type }?: {
    type?: 'loop' | 'slide';
}): void;
/**
 * Renders one splide carousel. `content.items` are the slides, as for renderCarousel. The
 * `splideCarouselItemType` option (`teaser` when none) is the shape of every slide; `spacingMy`
 * and `spacingMb` are classes on the root. `loadBundle(file)` loads the CSS bundles of the item
 * type. See renderComponent for `options` and `editable`; the keys of `editable` are those of
 * renderCarousel.
 *
 * @param {import('./eds-component.js').RenderInput<SplideCarouselContent, SplideCarouselOptions, SplideCarouselEditable>} input
 * @returns {HTMLElement}
 */
export default function renderSplideCarousel({ content, options, editable, loadBundle, }?: import('./eds-component.js').RenderInput<SplideCarouselContent, SplideCarouselOptions, SplideCarouselEditable>): HTMLElement;
export type SplideCarouselContent = import('./render-carousel.js').CarouselContent;
export type SplideCarouselEditable = import('./render-carousel.js').CarouselEditable;
export type SplideCarouselOptions = import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>;
export type SplideItemType = NonNullable<SplideCarouselOptions['splideCarouselItemType']>;
/** @typedef {import('./render-carousel.js').CarouselContent} SplideCarouselContent */
/** @typedef {import('./render-carousel.js').CarouselEditable} SplideCarouselEditable */
declare const OPTION_LISTS: readonly ["splideCarouselItemType", "spacingMy", "spacingMb"];
export {};
