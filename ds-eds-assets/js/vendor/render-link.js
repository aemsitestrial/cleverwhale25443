// The link: the Link() component. The link target is an option list whose value is Link()'s
// `target`; the theme, the arrow modifier and the spacing lists are classes on the root. The brand
// base class `ac-core-link` is passed as className.
import { Link } from '../link.js';
import { renderComponent } from './eds-component.js';

/** @typedef {import('../link.js').LinkProps} LinkProps */

/**
 * What a site fills in for a link: the Link props `title` (the text of the anchor),
 * `assetPathWithQueryParams` (its address) and `tooltip` (its title attribute), under their own
 * names. The other props are not content: `id` and `className` are the wrapper's, `assetType` is
 * AEM's, and `target` is an option.
 *
 * @typedef {Partial<Pick<LinkProps, 'title' | 'assetPathWithQueryParams' | 'tooltip'>>} LinkContent
 */

// The option lists whose values are classes on the root, in class order.
const CLASS_LISTS = /** @type {const} */ (['themeType', 'linkModifier', 'spacingMy', 'spacingMb']);

// Every option list the wrapper takes: the one whose value is Link()'s `target`, and the class lists.
const OPTION_LISTS = /** @type {const} */ (['linkTarget', ...CLASS_LISTS]);

/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} LinkOptions */

const EDITABLE = /** @type {const} */ ([['title', '.cmp-link__anchor']]);

/** @typedef {(typeof EDITABLE)[number][0]} LinkEditable */

export const LINK_EDITABLE_PROPS = EDITABLE.map(([prop]) => prop);

/** @type {import('./eds-component.js').ComponentConfig<LinkContent, LinkOptions, LinkEditable>} */
const CONFIG = {
  idPrefix: 'link',
  component: Link,
  /** @returns {LinkProps & { target?: string }} */
  props: (content, id, options) => ({
    id,
    className: 'ac-core-link',
    title: content.title || '',
    tooltip: /** @type {string} */ (content.tooltip),
    assetType: '',
    assetPathWithQueryParams: content.assetPathWithQueryParams || '',
    target: options.linkTarget,
  }),
  classLists: CLASS_LISTS,
  editable: EDITABLE,
};

/**
 * Renders one link. See renderComponent for `content`, `options` and `editable`.
 *
 * @param {import('./eds-component.js').RenderInput<LinkContent, LinkOptions, LinkEditable>} input
 * @returns {HTMLElement}
 */
export default function renderLink(input) {
  return renderComponent(CONFIG, input);
}
