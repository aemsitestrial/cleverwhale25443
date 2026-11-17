/**
 * The slide elements of a rendered carousel, in item order.
 *
 * @param {Element} root
 * @returns {Element[]}
 */
export function itemElements(root: Element): Element[];
/**
 * @param {CarouselItem} item
 * @param {boolean} imageShape
 * @param {string} idPrefix
 * @returns {{ id: string, props: Slide }}
 */
export function slideEntry(item: CarouselItem, imageShape: boolean, idPrefix: string): {
    id: string;
    props: Slide;
};
/**
 * @param {Element[]} elements
 * @param {CarouselItem[]} items
 * @param {import('./eds-component.js').EditableInput<CarouselEditable>} editable
 */
export function applySlideEditable(elements: Element[], items: CarouselItem[], editable: import('./eds-component.js').EditableInput<CarouselEditable>): void;
/**
 * Starts the slide controls. It reads the carousel's layout, so the caller runs it once the root
 * is in the page.
 *
 * @param {Element} root
 */
export function startCarousel(root: Element): void;
/**
 * Renders one carousel. `content.items` are the slides ({ imagePath, alt, title, pretitle, description,
 * link: { url } }, `description` being HTML). The `carouselItemType` option (`teaser` when none)
 * is the shape of every slide; the class lists are classes on the root and `carouselSlideStyle`,
 * when the brand has it, the class of every teaser slide. The block loads its own bundle. See
 * renderComponent for `options` and `editable`; the keys of `editable` here are given above, at
 * applySlideEditable.
 *
 * @param {import('./eds-component.js').RenderInput<CarouselContent, CarouselOptions, CarouselEditable>} input
 * @returns {HTMLElement}
 */
export default function renderCarousel({ content, options, editable, }?: import('./eds-component.js').RenderInput<CarouselContent, CarouselOptions, CarouselEditable>): HTMLElement;
/** @typedef {(typeof EDITABLE)[number][0]} CarouselItemEditable */
/** @typedef {`items.${number}` | `items.${number}.${CarouselItemEditable}`} CarouselEditable */
export const CAROUSEL_EDITABLE_PROPS: ("title" | "description" | "pretitle" | "imagePath")[];
export type ItemsMap = Pick<import('../dekker-carousel.js').CarouselProps<TeaserSlide>, ':itemsOrder' | ':items'>;
/**
 * One slide: the image shape reads `imagePath`, `alt` and `title`; the teaser shape reads
 * `imagePath`, `pretitle`, `title`, `description` and `link`. `imagePath` is Teaser's prop of that
 * name; the image shape hands it to Image() as `src`.
 */
export type CarouselItem = {
    imagePath?: string;
    alt?: string;
    title?: string;
    pretitle?: string;
    description?: string;
    link?: {
        url?: string;
    };
};
export type CarouselContent = {
    items?: CarouselItem[];
};
export type TeaserSlide = import('../dekker-carousel.js').ICarouselTeaserSlide;
export type ImageSlide = Partial<Pick<import('../dekker-carousel.js').ICarouselDefaultSlide, 'src' | 'alt' | 'title' | 'useCaption' | 'lazyEnabled'>>;
export type Slide = (ImageSlide | TeaserSlide) & {
    id: string;
    'cq:panelTitle': string;
};
export type CarouselOptions = import('./eds-component.js').OptionsInput<(typeof OPTION_LISTS)[number]>;
export type CarouselItemType = NonNullable<CarouselOptions['carouselItemType']>;
export type CarouselItemEditable = (typeof EDITABLE)[number][0];
export type CarouselEditable = `items.${number}` | `items.${number}.${CarouselItemEditable}`;
declare const OPTION_LISTS: readonly ["carouselItemType", "carouselStyle", "spacingMy", "spacingMb"];
declare const EDITABLE: readonly [readonly ["imagePath", ".cmp-image"], readonly ["title", ".cmp-image__title, .cmp-teaser__title"], readonly ["pretitle", ".cmp-teaser__pretitle"], readonly ["description", ".cmp-teaser__description"]];
export {};
