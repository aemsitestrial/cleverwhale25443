/**
 * Renders one teaser. See renderTeaserFamily for `content`, `options`, `editable` and
 * `loadBundle`.
 *
 * @param {import('./eds-component.js').RenderInput<TeaserContent, TeaserOptions, TeaserEditable>} input
 * @returns {HTMLElement}
 */
export default function renderTeaser(input: import('./eds-component.js').RenderInput<TeaserContent, TeaserOptions, TeaserEditable>): HTMLElement;
/** @typedef {(typeof EDITABLE)[number][0]} TeaserEditable */
export const TEASER_EDITABLE_PROPS: ("title" | "description" | "pretitle" | "date" | "imagePath" | "actions.0.title" | "actions.1.title" | "actions.2.title" | "actions.3.title")[];
export type TeaserContent = import('./eds-family.js').TeaserContent;
export type TeaserPath = import('./eds-component.js').ContentPath<TeaserContent>;
export type TeaserOptions = import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>;
export type TeaserEditable = (typeof EDITABLE)[number][0];
declare const OPTION_LISTS: readonly ["teaserType", "newsCardModifier", "productCardModifier", "productTeaserModifier", "teaserCardModifier", "teaserLinkModifier", "teaserNewsModifier", "spacingMy", "spacingMb", "cardAction"];
/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} TeaserOptions */
declare const EDITABLE: readonly [readonly ["imagePath", ".cmp-image"], readonly ["pretitle", ".cmp-teaser__pretitle"], readonly ["title", ".cmp-teaser__title"], readonly ["description", ".cmp-teaser__description"], readonly ["actions.0.title", (blockId: string) => string], readonly ["date", ".cmp-teaser__date"], readonly ["actions.1.title", (blockId: string) => string], readonly ["actions.2.title", (blockId: string) => string], readonly ["actions.3.title", (blockId: string) => string]];
export {};
