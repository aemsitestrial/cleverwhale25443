// The button: the Button() component. The link target and the icon are option lists whose values
// are Button() props; the theme, variant, icon position, spacing and grid carousel switch lists
// are classes on the root. Button() draws an <a> when the link has a URL and a <button> otherwise.
// The brand base class `ac-core-button` is passed as className.
import { Button } from '../button.js';
import { renderComponent } from './eds-component.js';

/** @typedef {import('../button.js').ButtonProps} ButtonProps */

/**
 * What a site fills in for a button: the Button props `text` and `buttonLink`, under their own
 * names. A link is given as `{ url }`; the wrapper sets `valid`. The other props are not content:
 * `id` and `className` are the wrapper's, and `target` and `icon` are options.
 *
 * @typedef {Partial<Pick<ButtonProps, 'text'>> & {
 *   buttonLink?: Omit<NonNullable<ButtonProps['buttonLink']>, 'valid'>
 * }} ButtonContent
 */

// The option lists whose values are classes on the root, in class order.
const CLASS_LISTS = /** @type {const} */ ([
  'buttonTheme', 'modifierVariant', 'buttonIconPosition', 'spacingMy', 'spacingMb',
  'buttonGridCarouselSwitch',
]);

// Every option list the wrapper takes: the two whose values are Button() props, and the class lists.
const OPTION_LISTS = /** @type {const} */ (['linkTarget', 'buttonIcon', ...CLASS_LISTS]);

/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} ButtonOptions */

const EDITABLE = /** @type {const} */ ([['text', '.cmp-button__text']]);

/** @typedef {(typeof EDITABLE)[number][0]} ButtonEditable */

export const BUTTON_EDITABLE_PROPS = EDITABLE.map(([prop]) => prop);

/** @type {import('./eds-component.js').ComponentConfig<ButtonContent, ButtonOptions, ButtonEditable>} */
const CONFIG = {
  idPrefix: 'button',
  component: Button,
  /** @returns {ButtonProps} */
  props: (content, id, options) => ({
    id,
    className: 'ac-core-button',
    text: /** @type {string} */ (content.text),
    buttonLink: content.buttonLink?.url ? { valid: true, ...content.buttonLink } : undefined,
    target: options.linkTarget,
    icon: options.buttonIcon,
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
