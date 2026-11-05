// The text content family: the three types AEM's Style System groups under the teaser-text
// policy (teaser, quote, highlight). The content props are Teaser() props. Every type carries
// 'ac-core-teaser': the AC teaser base rules, including the title font, only apply with it. This
// differs from ac-core-lib's own Quote wrapper (quote.tsx, useAcCoreClass=false) and from the AEM
// Style System's cq:styleClasses for the Quote variant ("quote" only). The type picks the base
// classes and the CSS bundle (ac-teaser, ac-quote or ac-highlight); the theme, modifier and clamp
// lists are classes on the rendered root.
import { renderTeaserFamily, actionLink } from './eds-family.js';
import { typeMeta } from '../../options/text-content.js';
import { teaserTitleType } from '../../options/common.js';

/** @typedef {import('./eds-family.js').TeaserContent} TextContentContent */
/** @typedef {import('./eds-component.js').ContentPath<TextContentContent>} TextContentPath */

// The option lists the wrapper takes: the class lists, and the type list.
const CLASS_LISTS = /** @type {const} */ ([
  'themeType', 'textContentModifier', 'headlineLineClamp', 'descriptionLineClamp', 'spacingMy',
  'spacingMb',
]);
const OPTION_LISTS = /** @type {const} */ ([...CLASS_LISTS, 'textContentType']);

/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} TextContentOptions */

// The content props that are editable in place, and the rendered element each one lives on. An
// action's title lives on the action link of its position in `actions`.
const EDITABLE = /** @satisfies {ReadonlyArray<readonly [TextContentPath, unknown]>} */ (/** @type {const} */ ([
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

/** @typedef {(typeof EDITABLE)[number][0]} TextContentEditable */

export const TEXT_CONTENT_EDITABLE_PROPS = EDITABLE.map(([prop]) => prop);

const BASE_CLASSES = {
  teaser: ['ac-core-teaser'],
  quote: ['quote', 'ac-core-teaser'],
  highlight: ['ac-core-highlight', 'ac-core-teaser'],
};

/** @type {import('./eds-family.js').TeaserFamilyConfig<TextContentOptions, TextContentEditable>} */
const CONFIG = {
  idPrefix: 'text',
  typeMeta,
  titleTypes: teaserTitleType,
  defaults: { themeType: 'style-primary' },
  baseClasses: (type) => BASE_CLASSES[type] || BASE_CLASSES.teaser,
  classLists: CLASS_LISTS,
  bundle: (type) => `ac-${type}.css`,
  editable: EDITABLE,
};

/**
 * Renders one text content element. See renderTeaserFamily for `content`, `options`, `editable`
 * and `loadBundle`.
 *
 * @param {import('./eds-component.js').RenderInput<TextContentContent, TextContentOptions, TextContentEditable>} input
 * @returns {HTMLElement}
 */
export default function renderTextContent(input) {
  return renderTeaserFamily(CONFIG, input);
}
