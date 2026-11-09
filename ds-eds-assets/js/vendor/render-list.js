// The list: List() with its items as teasers, the theme, item type, grid and spacing lists as
// classes on the root, and the CSS bundle the item type needs. An item whose type is a card type
// is that card: renderCard() renders it with all of the card's content and options, as the Card
// block would, inside the list's item.
import { List } from '../list.js';
import { addClasses, setDataAttributes } from './eds-component.js';
import { patchPicture } from './patch-picture.js';
import uniqueId from './unique-id.js';
import renderCard, { CARD_EDITABLE_PROPS } from './render-card.js';
import { typeMeta as cardTypeMeta } from '../../options/card.js';

// The option lists the wrapper takes: all of them are classes on the root.
const CLASS_LISTS = /** @type {const} */ (['themeType', 'listItemType', 'listGridRows', 'spacingMy', 'spacingMb']);

/** @typedef {import('./eds-component.js').OptionsInput<(typeof CLASS_LISTS)[number]>} ListOptions */

/** @typedef {import('./eds-family.js').TeaserContent} TeaserContent */

// The card option lists an item of a card type takes: those of the card types the listItemType
// list offers (content, AEM, icon), the card action, the clamps and the theme. The card type is the
// item type's; the spacing lists are the list's.
const ITEM_CARD_LISTS = /** @type {const} */ ([
  'cardAction', 'cardContentModifier', 'cardImageCroppingType', 'cardAemModifier', 'cardIconType',
  'cardIconVariant', 'headlineLineClamp', 'descriptionLineClamp', 'themeType',
]);

/**
 * The card options of an item, by list.
 * @typedef {import('./eds-component.js').OptionsInput<(typeof ITEM_CARD_LISTS)[number]>} ListItemOptions
 */

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
 *
 * @typedef {Pick<TeaserContent, 'imagePath' | 'pretitle' | 'title' | 'description' | 'date' | 'link' | 'actions' | 'picture' | 'titleTag'> & {
 *   itemStyle?: ListOptions['listItemType'],
 *   options?: ListItemOptions,
 * }} ListItem
 */

/** @typedef {{ items?: ListItem[] }} ListContent */

// The CSS bundle each item type needs beyond the teaser baseline every list loads. These are the
// bundles of the card types of the same names; the key figure has its own. The plain teaser has
// none.
/** @type {Partial<Record<NonNullable<ListOptions['listItemType']>, string>>} */
const ITEM_TYPE_BUNDLES = {
  'ac-core-card-aem ac-core-teaser': 'ac-card-aem.css',
  'ac-core-card-content ac-core-teaser': 'ac-card.css',
  'ac-core-card-icon ac-core-teaser modifier-vertical modifier-solid': 'ac-card-icon.css',
  'ac-core-key-figure ac-core-teaser modifier-vertical modifier-solid': 'ac-key-figure.css',
};

/**
 * The item elements of a rendered list, in item order.
 *
 * @param {Element} root
 * @returns {Element[]}
 */
export function itemElements(root) {
  return [...root.querySelectorAll('.cmp-list__item')];
}

// The card type of an item type: the class of the type that is a value of the cardType list, or
// undefined for a type that is no card.
const CARD_TYPES = Object.keys(cardTypeMeta.types);
/**
 * @param {string | undefined} itemType
 * @returns {string | undefined}
 */
export function cardTypeOf(itemType) {
  return (itemType || '').split(/\s+/).find((cls) => CARD_TYPES.includes(cls));
}

// An item is a teaser without a title link, whose whole link is the item's `link`. It has an image
// only when the item gives an `imagePath`. Its `itemStyle` (a value of the listItemType list)
// replaces the list's item type for this item: it is a class on the item's teaser root.
/**
 * @param {ListItem} item
 * @returns {import('../teaser.js').TeaserProps}
 */
function propsOf(item) {
  const id = uniqueId('list-item');
  return {
    id,
    imageLinkHidden: true,
    titleLinkHidden: true,
    pretitle: item.pretitle,
    title: item.title,
    description: item.description,
    imagePath: item.imagePath,
    link: { url: item.link?.url ?? '', valid: Boolean(item.link?.url) },
    className: item.itemStyle,
    actionsEnabled: false,
    actions: [],
  };
}

const EDITABLE = /** @type {const} */ ([
  ['imagePath', '.cmp-image'],
  ['pretitle', '.cmp-teaser__pretitle'],
  ['title', '.cmp-teaser__title'],
  ['description', '.cmp-teaser__description'],
]);

/** @typedef {(typeof EDITABLE)[number][0]} ListItemEditable */
/** @typedef {(typeof CARD_EDITABLE_PROPS)[number]} ListCardEditable */

// An item is `items.<n>`; its fields are `items.<n>.<prop>`. An item of a card type has the card's
// editable props (the date and the action texts as well).
/** @typedef {`items.${number}` | `items.${number}.${ListItemEditable | ListCardEditable}`} ListEditable */

export const LIST_EDITABLE_PROPS = EDITABLE.map(([prop]) => prop);

// The attributes given for an item (`items.<n>`) and for its image, pretitle, title and description
// (`items.<n>.imagePath`, `items.<n>.pretitle`, ...). A field goes on its element only when it has
// a value. An item's `picture` (a <picture>) replaces the plain image Teaser() renders.
/**
 * @param {Element} root
 * @param {ListItem[]} items
 * @param {import('./eds-component.js').EditableInput<ListEditable>} editable
 */
function applyEditable(root, items, editable, cards) {
  const elements = itemElements(root);
  items.forEach((item, index) => {
    const element = elements[index];
    if (!element) return;
    const key = `items.${index}`;
    setDataAttributes(element, editable[key]);
    // A card has put its own editable attributes and picture on its elements.
    if (cards[index]) return;
    EDITABLE.forEach(([prop, selector]) => {
      if (item[prop]) setDataAttributes(element.querySelector(selector), editable[`${key}.${prop}`]);
    });
    if (item.picture) {
      // patchPicture takes the element that holds the picture.
      const holder = document.createElement('div');
      holder.append(item.picture);
      patchPicture(holder, element);
    }
  });
}

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
export default function renderList({
  content = {}, options = {}, editable = {}, loadBundle,
} = {}) {
  const items = content.items || [];
  // Each bundle once: the item types' and the card types' share names.
  const requested = new Set();
  const loadOnce = (/** @type {string} */ file) => {
    if (requested.has(file)) return;
    requested.add(file);
    loadBundle?.(file);
  };
  const bundles = [options.listItemType, ...items.map((item) => item.itemStyle)]
    .map((type) => (type ? ITEM_TYPE_BUNDLES[type] : undefined));
  [...new Set(bundles)].forEach((file) => file && loadOnce(file));

  const classHolder = document.createElement('div');
  addClasses(classHolder, CLASS_LISTS.map((list) => options[list]));
  const itemProps = items.map(propsOf);
  // With displayItemAsTeaser List() reads none of the text-list props; the prop type requires them.
  const root = List({
    id: uniqueId('list'),
    className: classHolder.className,
    displayItemAsTeaser: true,
    showDescription: false,
    showModificationDate: false,
    linkItems: false,
    dateFormatString: '',
    dataLayer: {},
    ':type': 'list',
    items: itemProps,
  });
  const cards = items.map((item, index) => renderItemCard(item, index, options, editable, loadOnce));
  itemElements(root).forEach((element, index) => {
    const card = cards[index];
    if (card) element.replaceChildren(card);
  });
  applyEditable(root, items, editable, cards);
  return root;
}

/**
 * The card an item of a card type is, or undefined for an item of another type.
 *
 * @param {ListItem} item
 * @param {number} index
 * @param {ListOptions} listOptions
 * @param {import('./eds-component.js').EditableInput<ListEditable>} editable
 * @param {(file: string) => void} loadBundle
 * @returns {HTMLElement | undefined}
 */
function renderItemCard(item, index, listOptions, editable, loadBundle) {
  const cardType = cardTypeOf(item.itemStyle || listOptions.listItemType);
  if (!cardType) return undefined;
  const itemOptions = item.options || {};
  // The card's content is the item's, without the item type and the options.
  const content = { ...item };
  delete content.itemStyle;
  delete content.options;
  const prefix = `items.${index}.`;
  const cardEditable = Object.fromEntries(CARD_EDITABLE_PROPS
    .filter((prop) => editable[`${prefix}${prop}`])
    .map((prop) => [prop, editable[`${prefix}${prop}`]]));
  const chosen = Object.fromEntries(ITEM_CARD_LISTS
    .filter((list) => itemOptions[list] !== undefined)
    .map((list) => [list, itemOptions[list]]));
  return renderCard({
    content,
    options: {
      ...(listOptions.themeType && { themeType: listOptions.themeType }),
      ...chosen,
      cardType: /** @type {any} */ (cardType),
    },
    editable: /** @type {any} */ (cardEditable),
    loadBundle,
  });
}
