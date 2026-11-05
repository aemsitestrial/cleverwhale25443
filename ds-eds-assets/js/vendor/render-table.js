// The table: a table is authored as HTML inside a rich text field and stored as a Text node, so
// Text() owns its markup, and ac-core-lib's table styles select it by the text's theme class
// (`.text.style-primary table`). Unlike render-text.js it has no brand base class, no icon and no
// alignment or size lists.
import { Text } from '../text.js';
import { renderComponent } from './eds-component.js';

/** @typedef {import('../text.js').TextProps} TextProps */

/**
 * What a site fills in for a table: the Text prop `text`, the HTML holding the table. `id` is the
 * wrapper's and the table has no class or icon.
 *
 * @typedef {Partial<Pick<TextProps, 'text'>>} TableContent
 */

// The option lists, all classes on the root.
const CLASS_LISTS = /** @type {const} */ (['themeType', 'spacingMy', 'spacingMb']);

/** @typedef {import('./eds-component.js').OptionsInput<(typeof CLASS_LISTS)[number]>} TableOptions */

const EDITABLE = /** @type {const} */ ([['text', '.cmp-text']]);

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
