/**
 * The item elements of a rendered list, in item order.
 *
 * @param {Element} root
 * @returns {Element[]}
 */
export function itemElements(root: Element): Element[];
/**
 * @param {string | undefined} itemType
 * @returns {string | undefined}
 */
export function cardTypeOf(itemType: string | undefined): string | undefined;
/**
 * Renders one list. `content.items` are the teasers ({ imagePath, picture, pretitle, title,
 * description, link: { url }, itemStyle }, `description` being HTML). The `themeType`, `listItemType`,
 * `listGridRows`, `spacingMy` and `spacingMb` options are classes on the root. `loadBundle(file)`
 * loads the CSS bundle of the list's item type and of every item type an item chooses. See
 * renderComponent for `options` and `editable`; the keys of `editable` here are given above, at
 * applyEditable.
 *
 * @param {import('./eds-component.js').RenderInput<ListContent, ListOptions, ListEditable>} input
 * @returns {HTMLElement}
 */
export default function renderList({ content, options, editable, loadBundle, }?: import('./eds-component.js').RenderInput<ListContent, ListOptions, ListEditable>): HTMLElement;
/** @typedef {(typeof EDITABLE)[number][0]} ListItemEditable */
/** @typedef {(typeof CARD_EDITABLE_PROPS)[number]} ListCardEditable */
/** @typedef {`items.${number}` | `items.${number}.${ListItemEditable | ListCardEditable}`} ListEditable */
export const LIST_EDITABLE_PROPS: ("title" | "description" | "pretitle" | "imagePath")[];
export type ListOptions = import('./eds-component.js').OptionsInput<(typeof CLASS_LISTS)[number]>;
export type TeaserContent = import('./eds-family.js').TeaserContent;
/**
 * The card options of an item, by list.
 */
export type ListItemOptions = import('./eds-component.js').OptionsInput<(typeof ITEM_CARD_LISTS)[number]>;
/**
 * One item: the teaser family's content (`imagePath`, `pretitle`, `title`, `description`,
 * `date`, `link` as `{ url }`, `actions`, `titleTag` and `picture`), `itemStyle`, the item type
 * that replaces the list's for this item, and `options`, the item's card options.
 *
 * `itemStyle` is a value of the listItemType list. An item whose type is a card type (one of the
 * type's classes is a value of the cardType list: Card AEM, Card content, Card icon) is rendered
 * by renderCard() with its content and `options`, so it has every prop and option of that card.
 * The list's theme is the card's when the item chooses none. Any other item (Teasers, Key figure)
 * is a teaser with `itemStyle` as a class on its root: it takes `imagePath`, `pretitle`,
 * `title`, `description`, `link` and `picture`, and no `options`.
 */
export type ListItem = Pick<TeaserContent, 'imagePath' | 'pretitle' | 'title' | 'description' | 'date' | 'link' | 'actions' | 'picture' | 'titleTag'> & {
    itemStyle?: ListOptions['listItemType'];
    options?: ListItemOptions;
};
export type ListContent = {
    items?: ListItem[];
};
export type ListItemEditable = (typeof EDITABLE)[number][0];
export type ListCardEditable = (typeof CARD_EDITABLE_PROPS)[number];
export type ListEditable = `items.${number}` | `items.${number}.${ListItemEditable | ListCardEditable}`;
declare const CLASS_LISTS: readonly ["themeType", "listItemType", "listGridRows", "spacingMy", "spacingMb"];
/** @typedef {import('./eds-component.js').OptionsInput<(typeof CLASS_LISTS)[number]>} ListOptions */
/** @typedef {import('./eds-family.js').TeaserContent} TeaserContent */
declare const ITEM_CARD_LISTS: readonly ["cardAction", "cardContentModifier", "cardImageCroppingType", "cardAemModifier", "cardIconType", "cardIconVariant", "headlineLineClamp", "descriptionLineClamp", "themeType"];
declare const EDITABLE: readonly [readonly ["imagePath", ".cmp-image"], readonly ["pretitle", ".cmp-teaser__pretitle"], readonly ["title", ".cmp-teaser__title"], readonly ["description", ".cmp-teaser__description"]];
import { CARD_EDITABLE_PROPS } from './render-card.js';
export {};
