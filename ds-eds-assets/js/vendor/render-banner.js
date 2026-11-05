// The banner family: the nine banner types that AEM's Style System groups under one teaser-banner
// policy. The content props are Teaser() props. The type, theme, modifier and clamp lists are CSS
// classes on the rendered root, and the type picks the CSS bundle (ac-<type>.css, named after the
// type without its 'ac-core-' prefix). Which content props and modifier lists each type takes is
// data in options/banner.js (`typeMeta`).
import { renderTeaserFamily, actionLink } from './eds-family.js';
import { typeMeta } from '../../options/banner.js';
import { teaserTitleType } from '../../options/common.js';

/** @typedef {import('./eds-family.js').TeaserContent} BannerContent */
/** @typedef {import('./eds-component.js').ContentPath<BannerContent>} BannerPath */

// The option lists whose values are classes on the root.
const CLASS_LISTS = /** @type {const} */ ([
  'bannerType', 'themeType', 'bannerContentAlignment', 'bannerReverseContent', 'promoBannerStyle',
  'sectionTeaserImage', 'startpageBannerModifier', 'stickyBannerContentType',
  'headlineLineClamp', 'descriptionLineClamp', 'spacingMy', 'spacingMb',
]);

// Every option list the wrapper takes: the class lists, and the card action switch, which the
// teaser family applies to every member.
const OPTION_LISTS = /** @type {const} */ ([...CLASS_LISTS, 'cardAction']);

/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} BannerOptions */

// The content props that are editable in place, and the rendered element each one lives on. An
// action's title lives on the action link of its position in `actions`.
const EDITABLE = /** @satisfies {ReadonlyArray<readonly [BannerPath, unknown]>} */ (/** @type {const} */ ([
  ['imagePath', '.cmp-image'],
  ['pretitle', '.cmp-teaser__pretitle'],
  ['title', '.cmp-teaser__title'],
  ['description', '.cmp-teaser__description'],
  ['actions.0.title', actionLink(0)],
  ['date', '.cmp-teaser__date'],
  ['actions.1.title', actionLink(1)],
  ['actions.2.title', actionLink(2)],
  ['actions.3.title', actionLink(3)],
]));

/** @typedef {(typeof EDITABLE)[number][0]} BannerEditable */

export const BANNER_EDITABLE_PROPS = EDITABLE.map(([prop]) => prop);

/** @type {import('./eds-family.js').TeaserFamilyConfig<BannerOptions, BannerEditable>} */
const CONFIG = {
  idPrefix: 'banner',
  typeMeta,
  titleTypes: teaserTitleType,
  defaults: { themeType: 'style-primary' },
  // The section teaser's cut-out image mask is defined only under the four modifier-image-*
  // classes; without one the image sits at the left and pushes the text aside. The AEM policy
  // names no default, so the first value of the list is used. keepForType drops the list for the
  // types that do not name it, so no other banner gets the class.
  required: {
    sectionTeaserImage: 'modifier-image-primary',
    // The promo banner is laid out only under modifier-boxed or modifier-card: without one the
    // image is squeezed and the text column is about one word wide. Every library story sets one
    // and the first story is Card.
    promoBannerStyle: 'modifier-card',
  },
  baseClasses: ['teaserv2', 'ac-core-teaser'],
  classLists: CLASS_LISTS,
  bundle: (type) => `ac-${type.replace(/^ac-core-/, '')}.css`,
  editable: EDITABLE,
};

/**
 * Renders one banner. See renderTeaserFamily for `content`, `options`, `editable` and
 * `loadBundle`.
 *
 * @param {import('./eds-component.js').RenderInput<BannerContent, BannerOptions, BannerEditable>} input
 * @returns {HTMLElement}
 */
export default function renderBanner(input) {
  return renderTeaserFamily(CONFIG, input);
}
