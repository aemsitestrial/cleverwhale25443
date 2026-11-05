// The separator: the Separator() component with its theme and spacing lists as classes on the
// root. `isDecorative` is a Separator() prop.
import { Separator } from '../separator.js';
import { renderComponent } from './eds-component.js';

/** @typedef {import('../separator.js').SeparatorProps} SeparatorProps */

/**
 * What a site fills in for a separator: the Separator prop `isDecorative`. `id` and `className`
 * are not content.
 *
 * @typedef {Partial<Pick<SeparatorProps, 'isDecorative'>>} SeparatorContent
 */

// The option lists whose values are classes on the root, in class order.
const CLASS_LISTS = /** @type {const} */ (['separatorTheme', 'spacingMy', 'spacingMb']);

// Every option list the wrapper takes: all of them are classes.
const OPTION_LISTS = CLASS_LISTS;

/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} SeparatorOptions */

const EDITABLE = /** @type {const} */ ([]);

/** @typedef {(typeof EDITABLE)[number][0]} SeparatorEditable */

/** @type {import('./eds-component.js').ComponentConfig<SeparatorContent, SeparatorOptions, SeparatorEditable>} */
const CONFIG = {
  idPrefix: 'separator',
  component: Separator,
  props: (content, id) => ({ id, isDecorative: content.isDecorative }),
  classLists: CLASS_LISTS,
  editable: EDITABLE,
};

export const SEPARATOR_EDITABLE_PROPS = /** @type {SeparatorEditable[]} */ ([]);

/**
 * Renders one separator. See renderComponent for `content`, `options` and `editable`.
 *
 * @param {import('./eds-component.js').RenderInput<SeparatorContent, SeparatorOptions, SeparatorEditable>} input
 * @returns {HTMLElement}
 */
export default function renderSeparator(input) {
  return renderComponent(CONFIG, input);
}
