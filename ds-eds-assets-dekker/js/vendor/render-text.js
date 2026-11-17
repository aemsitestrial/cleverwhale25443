// The text: the Text() component. The icon is an option list whose value is Text()'s `icon`; the
// variant and spacing lists are classes on the root. dekker-lib's Text has no brand base class, so none is passed.
import { Text } from '../dekker-text.js';
import { renderComponent } from './eds-component.js';

/** @typedef {import('../dekker-text.js').TextProps} TextProps */

/**
 * What a site fills in for a text: the Text prop `text`, which is HTML. The other props are not
 * content: `id` is the wrapper's, and `icon` is an option.
 *
 * @typedef {Partial<Pick<TextProps, 'text'>>} TextContent
 */

// The option lists whose values are classes on the root, in class order.
const CLASS_LISTS = /** @type {const} */ (['textVariant', 'spacingMy', 'spacingMb']);

// Every option list the wrapper takes: the one whose value is a Text() prop, and the class lists.
const OPTION_LISTS = /** @type {const} */ (['textIcon', ...CLASS_LISTS]);

/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} TextOptions */

// The content props that are editable in place, and the rendered element each one lives on.
const EDITABLE = /** @satisfies {ReadonlyArray<readonly [import('./eds-component.js').ContentPath<TextContent>, unknown]>} */ (/** @type {const} */ ([
  ['text', '.cmp-text'],
]));

/** @typedef {(typeof EDITABLE)[number][0]} TextEditable */

export const TEXT_EDITABLE_PROPS = EDITABLE.map(([prop]) => prop);

/** @type {import('./eds-component.js').ComponentConfig<TextContent, TextOptions, TextEditable>} */
const CONFIG = {
  idPrefix: 'text',
  component: Text,
  /** @returns {TextProps} */
  props: (content, id, options) => ({
    id,
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
