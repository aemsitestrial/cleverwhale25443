// The Dekker banner: 1 type (hero) on one Teaser of aem-core-lib. The banner type, its
// modifier and the spacing lists are CSS classes on the root (options/banner.js), and the type decides
// which modifier counts (`typeMeta`). An image given as `backgroundImagePath` is the root's inline
// background (a hero that covers itself with an image). One stylesheet bundle holds every type, and the
// block that hosts the banner loads it.
import { renderTeaserFamily, actionLink } from './eds-family.js';
import { typeMeta, optionMeta } from '../../options/banner.js';
import { teaserTitleType } from '../../options/common.js';

/** @typedef {import('./eds-family.js').TeaserContent} TeaserContent */
/**
 * What a site fills in for a banner: the Teaser content, and the image the hero is covered with
 * (Hero()'s `bgImageSrc`), a URL.
 *
 * @typedef {TeaserContent & { backgroundImagePath?: string }} BannerContent
 */
/** @typedef {import('./eds-component.js').ContentPath<TeaserContent>} TeaserPath */

// The option lists whose values are classes on the root, in class order. They are all the options
// the wrapper takes.
const CLASS_LISTS = /** @type {const} */ (['heroType', 'heroModifier', 'spacingMy', 'spacingMb']);

/** @typedef {import('./eds-component.js').OptionsInput<(typeof CLASS_LISTS)[number]>} BannerOptions */

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

/** @typedef {(typeof EDITABLE)[number][0]} BannerEditable */

export const BANNER_EDITABLE_PROPS = EDITABLE.map(([prop]) => prop);

/** @type {import('./eds-family.js').TeaserFamilyConfig<BannerOptions, BannerEditable>} */
const CONFIG = {
  idPrefix: 'dekker-banner',
  typeMeta,
  optionMeta,
  titleTypes: teaserTitleType,
  baseClasses: [],
  classLists: CLASS_LISTS,
  // The authored <picture> replaces the plain image, and the banner at the top of the page is the
  // one the browser should fetch first.
  patchPicture: true,
  prioritiseFirstImage: true,
  editable: EDITABLE,
};

/**
 * Renders one banner. See renderTeaserFamily for `content`, `options`, `editable` and
 * `loadBundle`; `content.backgroundImagePath` is the URL of the image the hero is covered with.
 *
 * @param {import('./eds-component.js').RenderInput<BannerContent, BannerOptions, BannerEditable>} input
 * @returns {HTMLElement}
 */
export default function renderBanner(input) {
  const root = renderTeaserFamily(CONFIG, input);
  const background = input.content?.backgroundImagePath;
  if (background) root.style.backgroundImage = `url(${JSON.stringify(background)})`;
  return root;
}
