// The splide carousel: SplideCarousel() with the item map it takes, the spacing lists as classes
// on the root, and the CSS bundles the item type needs. The slider starts with
// startSplideCarousel once the root is in the page.
import { SplideCarousel } from '../splide-carousel.js';
import { SplideCarouselController } from './splide-carousel-controller.js';
import buildItemsMap from './build-items-map.js';
import { slideEntry, applySlideEditable } from './render-carousel.js';
import { addClasses } from './eds-component.js';
import uniqueId from './unique-id.js';

/** @typedef {import('./render-carousel.js').CarouselContent} SplideCarouselContent */
/** @typedef {import('./render-carousel.js').CarouselEditable} SplideCarouselEditable */

// The option lists the wrapper takes: the item type and the spacing classes on the root.
const OPTION_LISTS = /** @type {const} */ (['splideCarouselItemType', 'spacingMy', 'spacingMb']);

/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} SplideCarouselOptions */

/** @typedef {NonNullable<SplideCarouselOptions['splideCarouselItemType']>} SplideItemType */

// The CSS bundles of each item type. The teaser slides look like cards.
/** @type {Record<SplideItemType, string[]>} */
const ITEM_TYPE_BUNDLES = {
  teaser: ['ac-teaser.css', 'ac-card.css'],
  image: ['ac-image.css'],
};
/** @type {SplideItemType} */
const DEFAULT_ITEM_TYPE = 'teaser';
const ROOT_CLASS = 'ac-core-splide-carousel';
// Held by one root while its slider starts, so the controller's lookup by class finds that root only.
const START_CLASS = 'ac-core-splide-carousel-starting';

/**
 * The slide elements of a rendered carousel, in item order, before the slider moves them into its
 * own structure (it moves the elements, so attributes set before it starts stay on them).
 *
 * @param {Element} root
 * @returns {Element[]}
 */
export function itemElements(root) {
  return [...root.querySelectorAll('.aem-Grid > .aem-GridColumn')];
}

// The slider finds its slides by aem-GridColumn when the markup holds no list; without the class
// it finds none and the carousel stays a static grid.
/** @type {Record<SplideItemType, string>} */
const SLIDE_CLASSES = {
  teaser: 'ac-core-teaser ac-core-card-content style-primary aem-GridColumn',
  image: 'aem-GridColumn',
};

/**
 * Starts the slider on this root alone. The controller mounts every root it finds by class, and a
 * mounted root mounted again gets its slides wrapped and cloned a second time, so the controller is
 * given a class that only this root carries while it looks. The caller runs it once the root is in
 * the page. `type` is the slider's: `loop` (the default) repeats the slides by cloning them, `slide`
 * does not. A clone repeats the id of its slide, so each clone's elements get an id of their own,
 * and the controller numbers roots per controller, so the root is given a page-unique id.
 *
 * @param {Element} root
 * @param {{ type?: 'loop' | 'slide' }} [options]
 */
export function startSplideCarousel(root, { type = 'loop' } = {}) {
  // The type is always passed: the controller's own default is `loop`, which a missing key falls
  // through to.
  root.classList.add(START_CLASS);
  try {
    new SplideCarouselController(START_CLASS, { arrows: true, cover: true, type }).init();
  } finally {
    root.classList.remove(START_CLASS);
  }
  root.id = uniqueId('splide-carousel');
  root.querySelectorAll('.splide__slide--clone [id]').forEach((element) => {
    element.id = uniqueId(element.id.replace(/-\d+$/, ''));
  });
}

/**
 * Renders one splide carousel. `content.items` are the slides, as for renderCarousel. The
 * `splideCarouselItemType` option (`teaser` when none) is the shape of every slide; `spacingMy`
 * and `spacingMb` are classes on the root. `loadBundle(file)` loads the CSS bundles of the item
 * type. See renderComponent for `options` and `editable`; the keys of `editable` are those of
 * renderCarousel.
 *
 * @param {import('./eds-component.js').RenderInput<SplideCarouselContent, SplideCarouselOptions, SplideCarouselEditable>} input
 * @returns {HTMLElement}
 */
export default function renderSplideCarousel({
  content = {}, options = {}, editable = {}, loadBundle,
} = {}) {
  const type = options.splideCarouselItemType || DEFAULT_ITEM_TYPE;
  const items = content.items || [];
  (ITEM_TYPE_BUNDLES[type] || []).forEach((file) => loadBundle?.(file));

  const root = SplideCarousel({
    className: ROOT_CLASS,
    classNameSlide: SLIDE_CLASSES[type] || SLIDE_CLASSES.image,
    // SplideCarousel() does not read `:type`; the prop type requires it.
    ':type': 'splide-carousel',
    typeCarousel: type,
    ...buildItemsMap(items.map((item) => slideEntry(item, type === 'image', 'spcitem'))),
  });
  addClasses(root, [options.spacingMy, options.spacingMb]);
  applySlideEditable(itemElements(root), items, editable);
  return root;
}
