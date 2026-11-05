// The text: the Text() component. The icon is an option list whose value is Text()'s `icon`; the
// theme, content alignment, size and spacing lists are classes on the root. The brand base class
// `ac-core-text` is passed as className.
import { Text } from '../text.js';
import { renderComponent } from './eds-component.js';

/** @typedef {import('../text.js').TextProps} TextProps */

/**
 * What a site fills in for a text: the Text prop `text`, under its own name. `id` and `className`
 * are the wrapper's, and `icon` is an option.
 *
 * @typedef {Partial<Pick<TextProps, 'text'>>} TextContent
 */

// The option lists whose values are classes on the root, in class order.
const CLASS_LISTS = /** @type {const} */ ([
  'themeType', 'textContentAlignment', 'textLargeSize', 'spacingMy', 'spacingMb',
]);

// Every option list the wrapper takes: the one whose value is a Text() prop, and the class lists.
const OPTION_LISTS = /** @type {const} */ (['textIcon', ...CLASS_LISTS]);

/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} TextOptions */

const EDITABLE = /** @type {const} */ ([['text', '.cmp-text']]);

/** @typedef {(typeof EDITABLE)[number][0]} TextEditable */

export const TEXT_EDITABLE_PROPS = EDITABLE.map(([prop]) => prop);

/** @type {import('./eds-component.js').ComponentConfig<TextContent, TextOptions, TextEditable>} */
const CONFIG = {
  idPrefix: 'text',
  component: Text,
  /** @returns {TextProps} */
  props: (content, id, options) => ({
    id,
    className: 'ac-core-text',
    text: /** @type {string} */ (content.text),
    icon: options.textIcon,
  }),
  classLists: CLASS_LISTS,
  editable: EDITABLE,
};

/**
 * Renders one text. See renderComponent for `content`, `options` and `editable`; `content.text`
 * is HTML.
 *
 * @param {import('./eds-component.js').RenderInput<TextContent, TextOptions, TextEditable>} input
 * @returns {HTMLElement}
 */
export default function renderText(input) {
  return renderComponent(CONFIG, input);
}
