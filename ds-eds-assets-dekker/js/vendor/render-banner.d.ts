/**
 * Renders one banner. See renderTeaserFamily for `content`, `options`, `editable` and
 * `loadBundle`; `content.backgroundImagePath` is the URL of the image the hero is covered with.
 *
 * @param {import('./eds-component.js').RenderInput<BannerContent, BannerOptions, BannerEditable>} input
 * @returns {HTMLElement}
 */
export default function renderBanner(input: import('./eds-component.js').RenderInput<BannerContent, BannerOptions, BannerEditable>): HTMLElement;
/** @typedef {(typeof EDITABLE)[number][0]} BannerEditable */
export const BANNER_EDITABLE_PROPS: ("title" | "description" | "pretitle" | "date" | "imagePath" | "actions.0.title" | "actions.1.title" | "actions.2.title" | "actions.3.title")[];
export type TeaserContent = import('./eds-family.js').TeaserContent;
/**
 * What a site fills in for a banner: the Teaser content, and the image the hero is covered with
 * (Hero()'s `bgImageSrc`), a URL.
 */
export type BannerContent = TeaserContent & {
    backgroundImagePath?: string;
};
export type TeaserPath = import('./eds-component.js').ContentPath<TeaserContent>;
export type BannerOptions = import('./eds-component.js').OptionsInput<(typeof CLASS_LISTS)[number]>;
export type BannerEditable = (typeof EDITABLE)[number][0];
/** @typedef {import('./eds-family.js').TeaserContent} TeaserContent */
/**
 * What a site fills in for a banner: the Teaser content, and the image the hero is covered with
 * (Hero()'s `bgImageSrc`), a URL.
 *
 * @typedef {TeaserContent & { backgroundImagePath?: string }} BannerContent
 */
/** @typedef {import('./eds-component.js').ContentPath<TeaserContent>} TeaserPath */
declare const CLASS_LISTS: readonly ["heroType", "heroModifier", "spacingMy", "spacingMb"];
/** @typedef {import('./eds-component.js').OptionsInput<(typeof CLASS_LISTS)[number]>} BannerOptions */
declare const EDITABLE: readonly [readonly ["imagePath", ".cmp-image"], readonly ["pretitle", ".cmp-teaser__pretitle"], readonly ["title", ".cmp-teaser__title"], readonly ["description", ".cmp-teaser__description"], readonly ["actions.0.title", (blockId: string) => string], readonly ["date", ".cmp-teaser__date"], readonly ["actions.1.title", (blockId: string) => string], readonly ["actions.2.title", (blockId: string) => string], readonly ["actions.3.title", (blockId: string) => string]];
export {};
