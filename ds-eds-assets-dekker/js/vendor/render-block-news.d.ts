/**
 * Renders one News block.
 *
 * @param {import('./eds-component.js').RenderInput<BlockNewsContent, BlockNewsOptions, BlockNewsEditable>} input
 * @returns {HTMLElement}
 */
export default function renderBlockNews(input: import('./eds-component.js').RenderInput<BlockNewsContent, BlockNewsOptions, BlockNewsEditable>): HTMLElement;
/**
 * Mounts the cards' carousel (three cards at a time, as in BlockNews's story). Call it once the
 * root is in the page. In the Universal Editor nothing is mounted: the cards stay a grid.
 *
 * @param {HTMLElement} root
 */
export function startBlockNews(root: HTMLElement): void;
export type TeaserContent = import('./eds-family.js').TeaserContent;
/**
 * One news card: the props of a News card the block takes.
 */
export type BlockNewsItem = Pick<TeaserContent, 'imagePath' | 'title' | 'description' | 'date' | 'link'>;
/**
 * What a site fills in for a News block: the heading, the button's label and link, and the news
 * cards (`items`). BlockNews takes the heading and the button label as `heading` and `link`.
 */
export type BlockNewsContent = {
    heading?: string;
    buttonLabel?: string;
    buttonLink?: {
        url?: string;
    };
    items?: ReadonlyArray<BlockNewsItem>;
};
export type BlockNewsOptions = import('./eds-component.js').OptionsInput<(typeof CLASS_LISTS)[number]>;
/**
 * The elements the editable attributes of a News block go on: its heading and button label, each
 * card (`items.<n>`) and the card's own fields.
 */
export type BlockNewsEditable = (typeof EDITABLE)[number][0] | `items.${number}` | `items.${number}.${'imagePath' | 'title' | 'description' | 'date'}`;
/** @typedef {import('./eds-family.js').TeaserContent} TeaserContent */
/**
 * One news card: the props of a News card the block takes.
 *
 * @typedef {Pick<TeaserContent, 'imagePath' | 'title' | 'description' | 'date' | 'link'>} BlockNewsItem
 */
/**
 * What a site fills in for a News block: the heading, the button's label and link, and the news
 * cards (`items`). BlockNews takes the heading and the button label as `heading` and `link`.
 *
 * @typedef {{
 *   heading?: string, buttonLabel?: string, buttonLink?: { url?: string },
 *   items?: ReadonlyArray<BlockNewsItem>,
 * }} BlockNewsContent
 */
declare const CLASS_LISTS: readonly ["spacingMy", "spacingMb"];
/** @typedef {import('./eds-component.js').OptionsInput<(typeof CLASS_LISTS)[number]>} BlockNewsOptions */
declare const EDITABLE: readonly [readonly ["heading", ".ds-block-news__head .cmp-title__text"], readonly ["buttonLabel", ".ds-block-news__head .cmp-button__text"]];
export {};
