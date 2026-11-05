// The table of content: TableOfContent() with the spacing lists as classes on the root, and the
// list's toggler. The component lists the `items` it is given and writes a stray "0" for none, so
// an empty list renders an empty container. Below the wide breakpoint the stylesheet hides the
// list and shows a button that opens it; the component's markup has a place for that button
// (cmp-toc__toggler, next to the list's cmp-toc__content) but no code makes it.
import { TableOfContent } from '../table-of-content.js';
import { renderComponent } from './eds-component.js';

/** @typedef {import('../table-of-content.js').TableOfContentProps} TableOfContentProps */
/** @typedef {import('../table-of-content.js').TableOfContentChild} TableOfContentChild */

/**
 * What a site fills in for a table of content: the TableOfContent props `startLevel`, `stopLevel`
 * and `items`, under their own names. `id`, `className` and the list type are the wrapper's.
 *
 * The headings' `children` are typed loosely: ContentPath cannot follow a type that contains
 * itself, and a table of content has no editable props. The component takes the full shape.
 *
 * @typedef {Partial<Pick<TableOfContentProps, 'startLevel' | 'stopLevel'>> & {
 *   items?: Array<Omit<TableOfContentChild, 'children'> & { children?: readonly unknown[] }>
 * }} TableOfContentContent
 */

// The option lists whose values are classes on the root.
const CLASS_LISTS = /** @type {const} */ (['spacingMy', 'spacingMb']);

// Every option list the wrapper takes: the list type is a TableOfContent() prop, the others are
// classes.
const OPTION_LISTS = /** @type {const} */ (['tocListType', ...CLASS_LISTS]);

/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} TableOfContentOptions */

// A table of content has no editable content props.
const EDITABLE = /** @type {readonly (readonly [never, string])[]} */ ([]);

/** @typedef {(typeof EDITABLE)[number][0]} TableOfContentEditable */

/** @returns {HTMLElement} */
function emptyContainer() {
  return Object.assign(document.createElement('div'), { className: 'tableofcontents' });
}

/**
 * @param {HTMLElement} root
 * @param {NonNullable<TableOfContentContent['items']>} items
 */
function addToggler(root, items) {
  const content = root.querySelector('.cmp-toc__content');
  if (!content || !items.length) return;
  const button = document.createElement('button');
  const text = document.createElement('span');
  button.type = 'button';
  button.className = 'cmp-toc__toggler';
  text.className = 'cmp-toc__toggler-text';
  text.textContent = items[0].text;
  button.append(text);
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', content.id);
  const setOpen = (open) => {
    button.classList.toggle('active', open);
    content.classList.toggle('active', open);
    button.setAttribute('aria-expanded', String(open));
  };
  button.addEventListener('click', () => setOpen(!content.classList.contains('active')));
  content.addEventListener('click', (event) => {
    // A click on the list's own element has no closest link, and a text node never receives it.
    if (/** @type {Element} */ (event.target).closest('a')) setOpen(false);
  });
  content.before(button);
}

/** @type {import('./eds-component.js').ComponentConfig<TableOfContentContent, TableOfContentOptions, TableOfContentEditable>} */
const CONFIG = {
  idPrefix: 'toc',
  /** @param {TableOfContentProps} props */
  component: (props) => (props.items.length ? TableOfContent(props) : emptyContainer()),
  props: (content, id, options) => ({
    id,
    listType: options.tocListType,
    startLevel: content.startLevel || 'h1',
    stopLevel: content.stopLevel || 'h6',
    items: /** @type {TableOfContentChild[]} */ (content.items || []),
  }),
  defaults: { tocListType: 'numbered' },
  classLists: CLASS_LISTS,
  editable: EDITABLE,
};

export const TABLE_OF_CONTENT_EDITABLE_PROPS = CONFIG.editable.map(([prop]) => prop);

/**
 * Renders one table of content. See renderComponent for `content`, `options` and `editable`.
 * `content.items` is the nested list of headings ({ id, text, active, href, children }), found by
 * the caller; `startLevel` and `stopLevel` (h1 to h6) say which levels it holds. The list type is
 * the `tocListType` option, a prop of the component and not a class.
 *
 * @param {import('./eds-component.js').RenderInput<TableOfContentContent, TableOfContentOptions, TableOfContentEditable>} input
 * @returns {HTMLElement}
 */
export default function renderTableOfContent(input) {
  const root = renderComponent(CONFIG, input);
  addToggler(root, input?.content?.items || []);
  return root;
}
