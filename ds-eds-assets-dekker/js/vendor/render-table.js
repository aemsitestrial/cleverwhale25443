// The table: a table is authored as HTML inside a rich text field and stored as a Text node, so
// Text() owns its markup, and the table bundle (dekker-lib's table stylesheet) styles the table inside
// it. The spacing lists are classes on the root. Unlike render-text.js it has no icon and no variant.
import { Text } from '../dekker-text.js';
import { renderComponent } from './eds-component.js';

/** @typedef {import('../dekker-text.js').TextProps} TextProps */

/**
 * What a site fills in for a table: the Text prop `text`, under its own name. It holds the HTML
 * of the table. The other Text props are not content: `id` is the wrapper's, and `className` and
 * `icon` are not used here.
 *
 * @typedef {Partial<Pick<TextProps, 'text'>>} TableContent
 */

// The option lists whose values are classes on the root, in class order.
const CLASS_LISTS = /** @type {const} */ (['spacingMy', 'spacingMb']);

// Every option list the wrapper takes: all of them are class lists.
const OPTION_LISTS = CLASS_LISTS;

/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} TableOptions */

const EDITABLE = /** @satisfies {ReadonlyArray<readonly [import('./eds-component.js').ContentPath<TableContent>, unknown]>} */ (/** @type {const} */ ([
  ['text', '.cmp-text'],
]));

/** @typedef {(typeof EDITABLE)[number][0]} TableEditable */

export const TABLE_EDITABLE_PROPS = EDITABLE.map(([prop]) => prop);

/** @type {import('./eds-component.js').ComponentConfig<TableContent, TableOptions, TableEditable>} */
const CONFIG = {
  idPrefix: 'table',
  component: Text,
  props: (content, id) => ({ id, text: content.text || '' }),
  classLists: CLASS_LISTS,
  editable: EDITABLE,
};

/**
 * Renders one table. See renderComponent for `content`, `options` and `editable`;
 * `content.text` is the HTML holding the table.
 *
 * @param {import('./eds-component.js').RenderInput<TableContent, TableOptions, TableEditable>} input
 * @returns {HTMLElement}
 */
export default function renderTable(input) {
  return renderComponent(CONFIG, input);
}
