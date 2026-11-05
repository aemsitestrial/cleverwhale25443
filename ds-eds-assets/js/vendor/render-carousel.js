// The carousel: Carousel() with the item map it takes, the theme and spacing lists as classes on
// the root, and the CSS bundle the item type needs. The slides' controls (bullets, previous and
// next) start with startCarousel once the root is in the page.
import { Carousel } from '../carousel.js';
import { Carousel as CarouselController } from './carousel-controller.js';
import buildItemsMap from './build-items-map.js';
import { addClasses, setDataAttributes } from './eds-component.js';
import uniqueId from './unique-id.js';

/**
 * One slide: the image shape reads `imagePath`, `alt` and `title`; the teaser shape reads
 * `imagePath`, `pretitle`, `title`, `description` and `link`. `imagePath` is Teaser's prop of that
 * name; the image shape hands it to Image() as `src`.
 *
 * @typedef {{
 *   imagePath?: string, alt?: string, title?: string, pretitle?: string, description?: string,
 *   link?: { url?: string },
 * }} CarouselItem
 */

/** @typedef {{ items?: CarouselItem[] }} CarouselContent */

/** @typedef {import('../carousel.js').ICarouselTeaserSlide} TeaserSlide */

// The image slide props Image() reads. They are all optional here: ImageProps also requires
// `uuid` and `:type`, but Image() reads `uuid` only as an optional data-asset-id attribute, and a
// slide without an image must keep `src` unset rather than empty.
/** @typedef {Partial<Pick<import('../carousel.js').ICarouselDefaultSlide, 'src' | 'alt' | 'title' | 'useCaption' | 'lazyEnabled'>>} ImageSlide */

/** @typedef {(ImageSlide | TeaserSlide) & { id: string, 'cq:panelTitle': string }} Slide */

// The option lists the wrapper takes: the item type and the classes on the root.
const OPTION_LISTS = /** @type {const} */ (['carouselItemType', 'carouselTheme', 'spacingMy', 'spacingMb']);

/** @typedef {import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>} CarouselOptions */

/** @typedef {NonNullable<CarouselOptions['carouselItemType']>} CarouselItemType */

// The CSS bundle of each item type: the teaser types share one, the image types another.
/** @type {Record<CarouselItemType, string>} */
const ITEM_TYPE_BUNDLES = {
  teaser: 'ac-teaser.css',
  'hero-teaser': 'ac-teaser.css',
  image: 'ac-image.css',
  hero: 'ac-image.css',
};
const IMAGE_TYPES = new Set(/** @type {CarouselItemType[]} */ (['image', 'hero']));
/** @type {CarouselItemType} */
const DEFAULT_ITEM_TYPE = 'teaser';

// The slide behaviour of the model the compiled component is built for; not an option.
const PLAYBACK = {
  autoplay: false,
  delay: 5000,
  controlsPrepended: true,
  autopauseDisabled: true,
};

/**
 * The slide elements of a rendered carousel, in item order.
 *
 * @param {Element} root
 * @returns {Element[]}
 */
export function itemElements(root) {
  return [...root.querySelectorAll('.cmp-carousel__item')];
}

// One entry of the item map: a slide of the image shape or of the teaser shape. The id carries no
// hyphen of its own: Carousel() takes the part after the first hyphen of an id as the slide's
// suffix for aria-controls and aria-labelledby, so a hyphenated prefix would give every slide on
// the page the same suffix. The splide carousel builds the same slides.
/**
 * @param {CarouselItem} item
 * @param {boolean} imageShape
 * @param {string} idPrefix
 * @returns {{ id: string, props: Slide }}
 */
export function slideEntry(item, imageShape, idPrefix) {
  const id = uniqueId(idPrefix);
  const title = item.title || '';
  const props = imageShape
    ? {
      id,
      src: item.imagePath,
      alt: item.alt || '',
      title,
      useCaption: true,
      lazyEnabled: true,
      'cq:panelTitle': title,
    }
    : {
      id,
      imagePath: item.imagePath,
      pretitle: item.pretitle,
      title,
      description: item.description,
      link: { url: item.link?.url ?? '', valid: Boolean(item.link?.url) },
      actionsEnabled: false,
      imageLinkHidden: true,
      titleLinkHidden: true,
      'cq:panelTitle': title,
    };
  return { id, props };
}

/** @typedef {Pick<import('../carousel.js').CarouselProps<TeaserSlide>, ':itemsOrder' | ':items'>} ItemsMap */

// buildItemsMap is plain JS and returns an untyped map. Carousel() types a slide as ImageProps
// or TeaserProps, which require fields it never reads (see ImageSlide), so the map is asserted to
// the shape Carousel() takes; slideEntry checks each slide's keys against the component's props.
/**
 * @param {Array<{ id: string, props: Slide }>} entries
 * @returns {ItemsMap}
 */
function slidesMap(entries) {
  return /** @type {ItemsMap} */ (buildItemsMap(entries));
}

const EDITABLE = /** @type {const} */ ([
  ['imagePath', '.cmp-image'],
  ['title', '.cmp-image__title, .cmp-teaser__title'],
  ['pretitle', '.cmp-teaser__pretitle'],
  ['description', '.cmp-teaser__description'],
]);

/** @typedef {(typeof EDITABLE)[number][0]} CarouselItemEditable */

// A slide is `items.<n>`; its fields are `items.<n>.<prop>`.
/** @typedef {`items.${number}` | `items.${number}.${CarouselItemEditable}`} CarouselEditable */

export const CAROUSEL_EDITABLE_PROPS = EDITABLE.map(([prop]) => prop);

// The attributes given for a slide (`items.<n>`) and for its image, title, pretitle and
// description (`items.<n>.imagePath`, ...). A field goes on its element only when it has a value.
// `elements` are the slide elements in item order.
/**
 * @param {Element[]} elements
 * @param {CarouselItem[]} items
 * @param {import('./eds-component.js').EditableInput<CarouselEditable>} editable
 */
export function applySlideEditable(elements, items, editable) {
  items.forEach((item, index) => {
    const element = elements[index];
    if (!element) return;
    const key = `items.${index}`;
    setDataAttributes(element, editable[key]);
    EDITABLE.forEach(([prop, selector]) => {
      if (item[prop]) setDataAttributes(element.querySelector(selector), editable[`${key}.${prop}`]);
    });
  });
}

/**
 * Starts the slide controls. It reads the carousel's layout, so the caller runs it once the root
 * is in the page.
 *
 * @param {Element} root
 */
export function startCarousel(root) {
  const element = root.querySelector('.cmp-carousel');
  // The constructor starts the controller.
  // eslint-disable-next-line no-new
  if (element) new CarouselController({ el: element, bullets: true, controls: true });
}

/**
 * Renders one carousel. `content.items` are the slides ({ imagePath, alt, title, pretitle,
 * description, link: { url } }, `description` being HTML, `pretitle`, `description` and `link`
 * only for the teaser types and `alt` only for the image types). The `carouselItemType` option
 * (`teaser` when none) is the shape of every slide; `carouselTheme`, `spacingMy` and `spacingMb`
 * are classes on the root. `loadBundle(file)` loads the CSS bundle of the item type. See
 * renderComponent for `options` and `editable`; the keys of `editable` here are given above, at
 * applySlideEditable.
 *
 * @param {import('./eds-component.js').RenderInput<CarouselContent, CarouselOptions, CarouselEditable>} input
 * @returns {HTMLElement}
 */
export default function renderCarousel({
  content = {}, options = {}, editable = {}, loadBundle,
} = {}) {
  const type = options.carouselItemType || DEFAULT_ITEM_TYPE;
  const items = content.items || [];
  if (ITEM_TYPE_BUNDLES[type]) loadBundle?.(ITEM_TYPE_BUNDLES[type]);

  // classNameSlide reaches the teaser slides only. Without it the teaser title keeps the base
  // serif font, because the rule that sets the brand font needs the class.
  // Carousel() does not read `:type`; the prop type requires it.
  const root = Carousel({
    id: uniqueId('carousel'),
    ':type': 'carousel',
    typeCarousel: type,
    classNameSlide: 'ac-core-teaser',
    ...PLAYBACK,
    ...slidesMap(items.map((item) => slideEntry(item, IMAGE_TYPES.has(type), 'citem'))),
  });
  root.classList.add('ac-core-carousel');
  addClasses(root, [options.carouselTheme, options.spacingMy, options.spacingMb]);
  applySlideEditable(itemElements(root), items, editable);
  return root;
}
