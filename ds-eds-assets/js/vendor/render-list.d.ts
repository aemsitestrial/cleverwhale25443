/**
 * The item elements of a rendered list, in item order.
 *
 * @param {Element} root
 * @returns {Element[]}
 */
export function itemElements(root: Element): Element[];
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
/** @typedef {`items.${number}` | `items.${number}.${ListItemEditable}`} ListEditable */
export const LIST_EDITABLE_PROPS: ("title" | "description" | "pretitle" | "imagePath")[];
export type ListOptions = import('./eds-component.js').OptionsInput<(typeof CLASS_LISTS)[number]>;
export type TeaserContent = import('./eds-family.js').TeaserContent;
/**
 * One item, a teaser: the teaser family's content (`imagePath`, `pretitle`, `title`,
 * `description`, `link` as `{ url }` and `picture`), and `itemStyle`, the item type that replaces
 * the list's for this item. `itemStyle` is a value of the listItemType list and a class on the
 * item's teaser root; it is no Teaser prop. The family's `actions` and `titleTag` do not apply: an
 * item has no actions and its title tag is Teaser()'s own.
 */
export type ListItem = Pick<TeaserContent, 'imagePath' | 'pretitle' | 'title' | 'description' | 'link' | 'picture'> & {
    itemStyle?: ListOptions['listItemType'];
};
export type ListContent = {
    items?: ListItem[];
};
export type ListItemEditable = (typeof EDITABLE)[number][0];
export type ListEditable = `items.${number}` | `items.${number}.${ListItemEditable}`;
declare const CLASS_LISTS: readonly ["themeType", "listItemType", "listGridRows", "spacingMy", "spacingMb"];
declare const EDITABLE: readonly [readonly ["imagePath", ".cmp-image"], readonly ["pretitle", ".cmp-teaser__pretitle"], readonly ["title", ".cmp-teaser__title"], readonly ["description", ".cmp-teaser__description"]];
export {};
