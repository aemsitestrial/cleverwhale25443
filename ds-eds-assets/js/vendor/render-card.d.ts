/**
 * Renders one card. See renderTeaserFamily for `content`, `options`, `editable` and
 * `loadBundle`.
 *
 * @param {import('./eds-component.js').RenderInput<CardContent, CardOptions, CardEditable>} input
 * @returns {HTMLElement}
 */
export default function renderCard(input: import('./eds-component.js').RenderInput<CardContent, CardOptions, CardEditable>): HTMLElement;
/** @typedef {(typeof EDITABLE)[number][0]} CardEditable */
export const CARD_EDITABLE_PROPS: ("title" | "description" | "pretitle" | "date" | "imagePath" | "actions.0.title" | "actions.1.title" | "actions.2.title" | "actions.3.title")[];
export type CardContent = import('./eds-family.js').TeaserContent;
export type CardPath = import('./eds-component.js').ContentPath<CardContent>;
export type CardOptions = import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>;
export type CardEditable = (typeof EDITABLE)[number][0];
declare const OPTION_LISTS: readonly ["themeType", "cardContentModifier", "cardAemModifier", "cardFeatureModifier", "modifierVariant", "cardIconVariant", "cardIconType", "cardImageCroppingType", "cardType", "headlineLineClamp", "descriptionLineClamp", "spacingMy", "spacingMb", "cardAction"];
declare const EDITABLE: readonly [readonly ["imagePath", ".cmp-image"], readonly ["pretitle", ".cmp-teaser__pretitle"], readonly ["title", ".cmp-teaser__title"], readonly ["description", ".cmp-teaser__description"], readonly ["actions.0.title", (blockId: string) => string], readonly ["date", ".cmp-teaser__date"], readonly ["actions.1.title", (blockId: string) => string], readonly ["actions.2.title", (blockId: string) => string], readonly ["actions.3.title", (blockId: string) => string]];
export {};
