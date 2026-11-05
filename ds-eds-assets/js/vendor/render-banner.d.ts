/**
 * Renders one banner. See renderTeaserFamily for `content`, `options`, `editable` and
 * `loadBundle`.
 *
 * @param {import('./eds-component.js').RenderInput<BannerContent, BannerOptions, BannerEditable>} input
 * @returns {HTMLElement}
 */
export default function renderBanner(input: import('./eds-component.js').RenderInput<BannerContent, BannerOptions, BannerEditable>): HTMLElement;
/** @typedef {(typeof EDITABLE)[number][0]} BannerEditable */
export const BANNER_EDITABLE_PROPS: ("title" | "description" | "pretitle" | "date" | "imagePath" | "actions.0.title" | "actions.1.title" | "actions.2.title" | "actions.3.title")[];
export type BannerContent = import('./eds-family.js').TeaserContent;
export type BannerPath = import('./eds-component.js').ContentPath<BannerContent>;
export type BannerOptions = import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>;
export type BannerEditable = (typeof EDITABLE)[number][0];
declare const OPTION_LISTS: readonly ["bannerType", "themeType", "bannerContentAlignment", "bannerReverseContent", "promoBannerStyle", "sectionTeaserImage", "startpageBannerModifier", "stickyBannerContentType", "headlineLineClamp", "descriptionLineClamp", "spacingMy", "spacingMb", "cardAction"];
/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} BannerOptions */
declare const EDITABLE: readonly [readonly ["imagePath", ".cmp-image"], readonly ["pretitle", ".cmp-teaser__pretitle"], readonly ["title", ".cmp-teaser__title"], readonly ["description", ".cmp-teaser__description"], readonly ["actions.0.title", (blockId: string) => string], readonly ["date", ".cmp-teaser__date"], readonly ["actions.1.title", (blockId: string) => string], readonly ["actions.2.title", (blockId: string) => string], readonly ["actions.3.title", (blockId: string) => string]];
export {};
