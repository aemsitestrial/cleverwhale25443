// The News block of dekker-lib (BlockNews, blockNews.tsx) for an EDS site: a heading and a link
// button in one row, the news cards below them as a Splide carousel. The markup is BlockNews's own
// (the containers, AEM grid columns and classes blockNews.scss is written against), built around
// the package's Title, Button and Teaser wrappers, so each part is the same element as its block.
// A card is a teaser of the News card type with the gold highlight, as BlockNews renders it.
//
// startBlockNews mounts the carousel once the root is in the page (Splide measures the slides). In
// the Universal Editor it does nothing: the cards stay a grid an author can select and edit.
import renderTitle from './render-title.js';
import renderButton from './render-button.js';
import renderTeaser from './render-teaser.js';
import { addClasses, setDataAttributes } from './eds-component.js';
import { SplideCarouselController, responsiveSlidesThree } from './splide-carousel-controller.js';
import uniqueId from './unique-id.js';

/** @typedef {import('./eds-family.js').TeaserContent} TeaserContent */

/**
 * One news card: the props of a News card the block takes.
 *
 * @typedef {Pick<TeaserContent, 'imagePath' | 'title' | 'description' | 'date' | 'link'>} BlockNewsItem
 */

/**
 * What a site fills in for a News block: the heading, the button's label and link, and the news
 * cards (`items`). BlockNews takes the heading and the button label as `heading` and `link`.
 *
 * @typedef {{
 *   heading?: string, buttonLabel?: string, buttonLink?: { url?: string },
 *   items?: ReadonlyArray<BlockNewsItem>,
 * }} BlockNewsContent
 */

const CLASS_LISTS = /** @type {const} */ (['spacingMy', 'spacingMb']);

/** @typedef {import('./eds-component.js').OptionsInput<(typeof CLASS_LISTS)[number]>} BlockNewsOptions */

// The content props that are editable in place, and the rendered element each one lives on.
const EDITABLE = /** @type {const} */ ([
  ['heading', '.ds-block-news__head .cmp-title__text'],
  ['buttonLabel', '.ds-block-news__head .cmp-button__text'],
]);

/**
 * The elements the editable attributes of a News block go on: its heading and button label, each
 * card (`items.<n>`) and the card's own fields.
 *
 * @typedef {(typeof EDITABLE)[number][0] | `items.${number}` | `items.${number}.${'imagePath' | 'title' | 'description' | 'date'}`} BlockNewsEditable
 */

// The classes of BlockNews: the half-width columns of the heading row and the third-width column of
// a card (blockNews.tsx).
const HALF_COLUMN = 'aem-GridColumn--small-screen--12 aem-GridColumn--offset--large-screens--0 '
  + 'aem-GridColumn--extra-small-screen--none aem-GridColumn--default--none aem-GridColumn--small-screen--none '
  + 'aem-GridColumn--offset--small-screen--0 aem-GridColumn--offset--default--0 aem-GridColumn--extra-small-screen--12 '
  + 'aem-GridColumn--large-screens--none aem-GridColumn--medium-screens--6 aem-GridColumn '
  + 'aem-GridColumn--offset--medium-screens--0 aem-GridColumn--default--6 aem-GridColumn--medium-screens--none '
  + 'aem-GridColumn--large-screens--6 aem-GridColumn--offset--extra-small-screen--0';
const CARD_COLUMN = 'aem-GridColumn--small-screen--12 aem-GridColumn--extra-small-screen--none '
  + 'aem-GridColumn--default--none aem-GridColumn--medium-screens--12 aem-GridColumn--small-screen--none '
  + 'aem-GridColumn--offset--small-screen--0 aem-GridColumn--offset--default--0 aem-GridColumn--extra-small-screen--12 '
  + 'aem-GridColumn aem-GridColumn--offset--medium-screens--0 aem-GridColumn--medium-screens--none '
  + 'aem-GridColumn--default--4 aem-GridColumn--offset--extra-small-screen--0 splide__slide';
const GRID = 'aem-Grid aem-Grid--12 aem-Grid--default--12';
const CAROUSEL_CLASS = 'ds-splide-carousel-news';
const CARD_TYPE = 'ds-brand-news-card';
const CARD_HIGHLIGHT = 'ds-brand-news-card--highlight-gold';

/**
 * An element with classes and children.
 *
 * @param {string} classes
 * @param {Array<Node | null | undefined>} [children]
 */
function el(classes, children = []) {
  const element = document.createElement('div');
  addClasses(element, [classes]);
  children.filter(Boolean).forEach((child) => element.append(/** @type {Node} */ (child)));
  return element;
}

/** A container of the AEM grid holding `children`: container > cmp-container > aem-Grid. */
const container = (classes, children) => el(classes, [el('cmp-container', [el(GRID, children)])]);

/** @type {WeakMap<Element, string>} */
const carousels = new WeakMap();

/**
 * Renders one News block.
 *
 * @param {import('./eds-component.js').RenderInput<BlockNewsContent, BlockNewsOptions, BlockNewsEditable>} input
 * @returns {HTMLElement}
 */
export default function renderBlockNews(input) {
  const {
    content = {}, options = {}, editable = {}, loadBundle,
  } = input;
  const items = content.items || [];

  const heading = content.heading ? renderTitle({
    content: { text: content.heading },
    options: { headingTag: 'h2' },
    editable: { text: editable.heading },
    loadBundle,
  }) : null;
  const button = content.buttonLabel ? renderButton({
    content: { text: content.buttonLabel, buttonLink: content.buttonLink },
    editable: { text: editable.buttonLabel },
    loadBundle,
  }) : null;
  const head = container('container responsivegrid aem-GridColumn aem-GridColumn--default--12 ds-block-news__head', [
    heading && el(HALF_COLUMN, [heading]),
    button && el(HALF_COLUMN, [button]),
  ]);

  // Each carousel has a class of its own: the controller selects its carousels by class, and a
  // page may hold several News blocks.
  const carouselId = uniqueId(CAROUSEL_CLASS);
  const cards = items.length ? container(
    `ds-splide-carousel ${CAROUSEL_CLASS} ${carouselId} ds-brand-splide-carousel container responsivegrid aem-GridColumn aem-GridColumn--default--12`,
    items.map((item, index) => {
      const key = /** @type {const} */ (`items.${index}`);
      const card = renderTeaser({
        content: item,
        options: { teaserType: CARD_TYPE, newsCardModifier: CARD_HIGHLIGHT },
        editable: {
          imagePath: editable[`${key}.imagePath`],
          title: editable[`${key}.title`],
          description: editable[`${key}.description`],
          date: editable[`${key}.date`],
        },
        loadBundle,
      });
      const column = el(CARD_COLUMN, [card]);
      setDataAttributes(column, editable[key]);
      return column;
    }),
  ) : null;

  const root = container('ds-block-news container responsivegrid aem-GridColumn aem-GridColumn--default--12', [head, cards]);
  addClasses(root, CLASS_LISTS.map((list) => options[list]));
  if (cards) carousels.set(root, carouselId);
  return root;
}

/**
 * Mounts the cards' carousel (three cards at a time, as in BlockNews's story). Call it once the
 * root is in the page. In the Universal Editor nothing is mounted: the cards stay a grid.
 *
 * @param {HTMLElement} root
 */
export function startBlockNews(root) {
  const carouselId = carousels.get(root);
  if (!carouselId || root.ownerDocument.querySelector('[data-aue-resource]')) return;
  new SplideCarouselController(carouselId, {
    perPage: 3,
    type: 'slide',
    breakpoints: responsiveSlidesThree,
    arrows: false,
  }).init();
}
