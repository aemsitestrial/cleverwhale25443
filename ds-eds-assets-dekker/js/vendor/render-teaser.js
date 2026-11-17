// The Dekker teaser: 6 types (news card, product card, product teaser, teaser card, teaser link, teaser news) on one Teaser. The content props are Teaser() props. The
// teaser type, its modifier and the spacing lists are CSS classes on the rendered root, and the type decides which modifier
// counts (options/teaser.js `typeMeta`). One stylesheet bundle holds every type, and the block that
// hosts the teaser loads it.
import { renderTeaserFamily, actionLink } from './eds-family.js';
import { typeMeta, optionMeta } from '../../options/teaser.js';
import { teaserTitleType } from '../../options/common.js';

/** @typedef {import('./eds-family.js').TeaserContent} TeaserContent */
/** @typedef {import('./eds-component.js').ContentPath<TeaserContent>} TeaserPath */

// The option lists whose values are classes on the root, in class order.
const CLASS_LISTS = /** @type {const} */ (['teaserType', 'newsCardModifier', 'productCardModifier', 'productTeaserModifier', 'teaserCardModifier', 'teaserLinkModifier', 'teaserNewsModifier', 'spacingMy', 'spacingMb']);

// Every option list the wrapper takes: the class lists, and the card action switch.
const OPTION_LISTS = /** @type {const} */ ([...CLASS_LISTS, 'cardAction']);

/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} TeaserOptions */

// The content props that are editable in place, and the rendered element each one lives on. An
// action's title lives on the action link of its position in `actions`.
const EDITABLE = /** @satisfies {ReadonlyArray<readonly [TeaserPath, unknown]>} */ (/** @type {const} */ ([
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

/** @typedef {(typeof EDITABLE)[number][0]} TeaserEditable */

export const TEASER_EDITABLE_PROPS = EDITABLE.map(([prop]) => prop);

/** @type {import('./eds-family.js').TeaserFamilyConfig<TeaserOptions, TeaserEditable>} */
const CONFIG = {
  idPrefix: 'dekker-teaser',
  typeMeta,
  optionMeta,
  titleTypes: teaserTitleType,
  baseClasses: [],
  classLists: CLASS_LISTS,
  // Every type draws its title as an h3 unless the content sets a level, so a teaser embedded
  // under an h2 section title keeps a correct outline. Teaser() would draw an h2.
  defaultTitleTag: 'h3',
  patchPicture: true,
  editable: EDITABLE,
};

/**
 * Renders one teaser. See renderTeaserFamily for `content`, `options`, `editable` and
 * `loadBundle`.
 *
 * @param {import('./eds-component.js').RenderInput<TeaserContent, TeaserOptions, TeaserEditable>} input
 * @returns {HTMLElement}
 */
export default function renderTeaser(input) {
  return renderTeaserFamily(CONFIG, input);
}
