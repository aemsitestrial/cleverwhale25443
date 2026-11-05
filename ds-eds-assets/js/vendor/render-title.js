// The title: the Title() component. The heading tag is an option list whose value is Title()'s
// `type`, h2 when none is chosen; the theme and spacing lists are classes on the root. Title()
// draws its anchor only when link.valid is set, which is true whenever a URL is given. The brand
// base class `ac-core-title` is passed as className.
import { Title } from '../title.js';
import { renderComponent } from './eds-component.js';

/** @typedef {import('../title.js').TitleProps} TitleProps */

/**
 * What a site fills in for a title: the Title props `text` and `link`, under their own names. A
 * link is given as `{ url }`; the wrapper sets `valid`. The other props are not content: `id` and
 * `className` are the wrapper's, and `type` is an option.
 *
 * @typedef {Partial<Pick<TitleProps, 'text'>> & {
 *   link?: Omit<NonNullable<TitleProps['link']>, 'valid' | 'attributes'>
 * }} TitleContent
 */

// The option lists whose values are classes on the root, in class order.
const CLASS_LISTS = /** @type {const} */ (['themeType', 'spacingMy', 'spacingMb']);

// Every option list the wrapper takes: the one whose value is Title()'s `type`, and the class
// lists.
const OPTION_LISTS = /** @type {const} */ (['headingTag', ...CLASS_LISTS]);

/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} TitleOptions */

const EDITABLE = /** @type {const} */ ([['text', '.cmp-title__text']]);

/** @typedef {(typeof EDITABLE)[number][0]} TitleEditable */

export const TITLE_EDITABLE_PROPS = EDITABLE.map(([prop]) => prop);

/** @type {import('./eds-component.js').ComponentConfig<TitleContent, TitleOptions, TitleEditable>} */
const CONFIG = {
  idPrefix: 'title',
  component: Title,
  /** @returns {TitleProps} */
  props: (content, id, options) => ({
    id,
    className: 'ac-core-title',
    text: /** @type {string} */ (content.text),
    type: options.headingTag || 'h2',
    link: content.link?.url ? { valid: true, ...content.link } : undefined,
  }),
  classLists: CLASS_LISTS,
  editable: EDITABLE,
};

/**
 * Renders one title. See renderComponent for `content`, `options` and `editable`.
 *
 * @param {import('./eds-component.js').RenderInput<TitleContent, TitleOptions, TitleEditable>} input
 * @returns {HTMLElement}
 */
export default function renderTitle(input) {
  return renderComponent(CONFIG, input);
}
