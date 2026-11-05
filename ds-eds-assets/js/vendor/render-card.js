// The card family: five types (content, aem, feature, icon, product). The content props are
// Teaser() props; the card action switch decides which of the whole-card link and the actions
// applies. The theme, modifier, type and clamp lists are CSS classes on the rendered root. Each
// type has its own modifier lists (options/card.js `typeMeta`), and only the ones of the chosen
// type count. The type picks the CSS bundle too.
import { renderTeaserFamily, actionLink } from './eds-family.js';
import { keepsUrlOnlyVideoAction, urlOnlyVideoAction } from './card-video-action.js';
import { typeMeta, optionMeta } from '../../options/card.js';
import { teaserTitleType } from '../../options/common.js';

/** @typedef {import('./eds-family.js').TeaserContent} CardContent */
/** @typedef {import('./eds-component.js').ContentPath<CardContent>} CardPath */

// The option lists the wrapper takes: the class lists, and the card action switch.
const CLASS_LISTS = /** @type {const} */ ([
  'themeType', 'cardContentModifier', 'cardAemModifier', 'cardFeatureModifier', 'modifierVariant',
  'cardIconVariant', 'cardIconType', 'cardImageCroppingType', 'cardType', 'headlineLineClamp',
  'descriptionLineClamp', 'spacingMy', 'spacingMb',
]);
const OPTION_LISTS = /** @type {const} */ ([...CLASS_LISTS, 'cardAction']);

/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} CardOptions */

// "card-content" already ships with the bundle the card blocks load up front (ac-card.css); the
// other four types load their own.
const CARD_TYPE_BUNDLE_SKIP = 'card-content';

// The content props that are editable in place, and the rendered element each one lives on. An
// action's title lives on the action link of its position in `actions`.
const EDITABLE = /** @satisfies {ReadonlyArray<readonly [CardPath, unknown]>} */ (/** @type {const} */ ([
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

/** @typedef {(typeof EDITABLE)[number][0]} CardEditable */

export const CARD_EDITABLE_PROPS = EDITABLE.map(([prop]) => prop);

/** @type {import('./eds-family.js').TeaserFamilyConfig<CardOptions, CardEditable>} */
const CONFIG = {
  idPrefix: 'card',
  typeMeta,
  titleTypes: teaserTitleType,
  optionMeta,
  defaults: {
    themeType: 'style-primary',
    cardIconVariant: 'modifier-solid',
    cardIconType: 'modifier-vertical',
  },
  baseClasses: ['teaserv2', 'ac-core-teaser'],
  // Card content styles its action links as buttons under this class; the other card types have no
  // such rule.
  buttonsClass: { 'ac-core-card-content': 'ds-brand-use-buttons' },
  classLists: CLASS_LISTS,
  bundle: (type) => {
    const slug = type.replace(/^ac-core-/, '');
    return slug === CARD_TYPE_BUNDLE_SKIP ? undefined : `ac-${slug}.css`;
  },
  // A linked-video Card Aem with a link URL and no link text has no action (an action needs its
  // text), but the empty action link is what the design system styles as the play button, so it
  // is put back. The card action switch can still remove it afterwards.
  adjustProps: (props, content, options, type, id) => {
    const first = content.actions?.[0];
    const url = first?.link?.url;
    return url && keepsUrlOnlyVideoAction({
      cardType: type,
      cardModifier: options.cardAemModifier,
      actionUrl: url,
      actionText: first?.title,
    })
      ? { ...props, actions: [urlOnlyVideoAction(`${id}-action`, url)], actionsEnabled: true }
      : props;
  },
  patchPicture: true,
  editable: EDITABLE,
};

/**
 * Renders one card. See renderTeaserFamily for `content`, `options`, `editable` and
 * `loadBundle`.
 *
 * @param {import('./eds-component.js').RenderInput<CardContent, CardOptions, CardEditable>} input
 * @returns {HTMLElement}
 */
export default function renderCard(input) {
  return renderTeaserFamily(CONFIG, input);
}
