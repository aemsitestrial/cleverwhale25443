// The button: the Button() component. The link target is an option list whose value is a
// Button() prop; the variant and spacing lists are classes on the root.
// Button() draws an <a> when the link has a URL and a <button> otherwise. 
// dekker-lib's Button has no brand base class, so none is passed.
import { Button } from '../dekker-button.js';
import { renderComponent } from './eds-component.js';

/** @typedef {import('../dekker-button.js').ButtonProps} ButtonProps */

/**
 * What a site fills in for a button: the Button props `text` and `buttonLink`, under their own
 * names. A link is given as `{ url }`; the wrapper sets `valid`. The other props are not content:
 * `id` is the wrapper's, and `target` is an option.
 *
 * @typedef {Partial<Pick<ButtonProps, 'text'>> & {
 *   buttonLink?: Omit<NonNullable<ButtonProps['buttonLink']>, 'valid'>
 * }} ButtonContent
 */

// The option lists whose values are classes on the root, in class order.
const CLASS_LISTS = /** @type {const} */ (['buttonVariant', 'spacingMy', 'spacingMb']);

// Every option list the wrapper takes: the one whose value is a Button() prop, and the class lists.
const OPTION_LISTS = /** @type {const} */ (['linkTarget', ...CLASS_LISTS]);

/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} ButtonOptions */

// The content props that are editable in place, and the rendered element each one lives on.
const EDITABLE = /** @satisfies {ReadonlyArray<readonly [import('./eds-component.js').ContentPath<ButtonContent>, unknown]>} */ (/** @type {const} */ ([
  ['text', '.cmp-button__text'],
]));

/** @typedef {(typeof EDITABLE)[number][0]} ButtonEditable */

export const BUTTON_EDITABLE_PROPS = EDITABLE.map(([prop]) => prop);

/** @type {import('./eds-component.js').ComponentConfig<ButtonContent, ButtonOptions, ButtonEditable>} */
const CONFIG = {
  idPrefix: 'button',
  component: Button,
  /** @returns {ButtonProps} */
  props: (content, id, options) => ({
    id,
    text: /** @type {string} */ (content.text),
    buttonLink: content.buttonLink?.url ? { valid: true, ...content.buttonLink } : undefined,
    target: options.linkTarget,
  }),
  classLists: CLASS_LISTS,
  editable: EDITABLE,
};

/**
 * Renders one button. See renderComponent for `content`, `options` and `editable`.
 *
 * @param {import('./eds-component.js').RenderInput<ButtonContent, ButtonOptions, ButtonEditable>} input
 * @returns {HTMLElement}
 */
export default function renderButton(input) {
  return renderComponent(CONFIG, input);
}
