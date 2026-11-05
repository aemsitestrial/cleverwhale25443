// The list: List() with its items as teasers, the theme, item type, grid and spacing lists as
// classes on the root, and the CSS bundle the item type needs.
import { List } from '../list.js';
import { addClasses, setDataAttributes } from './eds-component.js';
import { patchPicture } from './patch-picture.js';
import uniqueId from './unique-id.js';

// The option lists the wrapper takes: all of them are classes on the root.
const CLASS_LISTS = /** @type {const} */ (['themeType', 'listItemType', 'listGridRows', 'spacingMy', 'spacingMb']);

/** @typedef {import('./eds-component.js').OptionsInput<(typeof CLASS_LISTS)[number]>} ListOptions */

/** @typedef {import('./eds-family.js').TeaserContent} TeaserContent */

/**
 * One item, a teaser: the teaser family's content (`imagePath`, `pretitle`, `title`,
 * `description`, `link` as `{ url }` and `picture`), and `itemStyle`, the item type that replaces
 * the list's for this item. `itemStyle` is a value of the listItemType list and a class on the
 * item's teaser root; it is no Teaser prop. The family's `actions` and `titleTag` do not apply: an
 * item has no actions and its title tag is Teaser()'s own.
 *
 * @typedef {Pick<TeaserContent, 'imagePath' | 'pretitle' | 'title' | 'description' | 'link' | 'picture'> & {
 *   itemStyle?: ListOptions['listItemType'],
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

// An item is `items.<n>`; its fields are `items.<n>.<prop>`.
/** @typedef {`items.${number}` | `items.${number}.${ListItemEditable}`} ListEditable */

export const LIST_EDITABLE_PROPS = EDITABLE.map(([prop]) => prop);

// The attributes given for an item (`items.<n>`) and for its image, pretitle, title and description
// (`items.<n>.imagePath`, `items.<n>.pretitle`, ...). A field goes on its element only when it has
// a value. An item's `picture` (a <picture>) replaces the plain image Teaser() renders.
/**
 * @param {Element} root
 * @param {ListItem[]} items
 * @param {import('./eds-component.js').EditableInput<ListEditable>} editable
 */
function applyEditable(root, items, editable) {
  const elements = itemElements(root);
  items.forEach((item, index) => {
    const element = elements[index];
    if (!element) return;
    const key = `items.${index}`;
    setDataAttributes(element, editable[key]);
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
  const bundles = [options.listItemType, ...items.map((item) => item.itemStyle)]
    .map((type) => (type ? ITEM_TYPE_BUNDLES[type] : undefined));
  [...new Set(bundles)].forEach((file) => file && loadBundle?.(file));

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
  applyEditable(root, items, editable);
  return root;
}
