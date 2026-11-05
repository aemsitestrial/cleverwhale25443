/**
 * Renders one text content element. See renderTeaserFamily for `content`, `options`, `editable`
 * and `loadBundle`.
 *
 * @param {import('./eds-component.js').RenderInput<TextContentContent, TextContentOptions, TextContentEditable>} input
 * @returns {HTMLElement}
 */
export default function renderTextContent(input: import('./eds-component.js').RenderInput<TextContentContent, TextContentOptions, TextContentEditable>): HTMLElement;
/** @typedef {(typeof EDITABLE)[number][0]} TextContentEditable */
export const TEXT_CONTENT_EDITABLE_PROPS: ("title" | "description" | "pretitle" | "date" | "imagePath" | "actions.0.title" | "actions.1.title" | "actions.2.title" | "actions.3.title")[];
export type TextContentContent = import('./eds-family.js').TeaserContent;
export type TextContentPath = import('./eds-component.js').ContentPath<TextContentContent>;
export type TextContentOptions = import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>;
export type TextContentEditable = (typeof EDITABLE)[number][0];
declare const OPTION_LISTS: readonly ["themeType", "textContentModifier", "headlineLineClamp", "descriptionLineClamp", "spacingMy", "spacingMb", "textContentType"];
/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} TextContentOptions */
declare const EDITABLE: readonly [readonly ["imagePath", ".cmp-image"], readonly ["pretitle", ".cmp-teaser__pretitle"], readonly ["title", ".cmp-teaser__title"], readonly ["description", ".cmp-teaser__description"], readonly ["actions.0.title", (blockId: string) => string], readonly ["date", ".cmp-teaser__date"], readonly ["actions.1.title", (blockId: string) => string], readonly ["actions.2.title", (blockId: string) => string], readonly ["actions.3.title", (blockId: string) => string]];
export {};
