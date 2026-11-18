// The rules of a container's composition: which composition and background it takes, the classes
// they give and the CSS bundles they need. The container block (render-container-block.js) and the
// page section (page-glue.js, decorateContainerSections) both read them from here, so a section and
// a container block with the same values come out the same.
import { wrappersVariant, backgroundVariant } from '../../options/container.js';

// The compositions of the brand, each with the CSS bundle that styles it. A key is an option value
// of the wrappersVariant list and also its class string. Add a composition here, to wrappersVariant
// (container.options.js), as a part (src/eds/css-components.cjs), as a bundle (src/eds/css-bundles.json)
// and in brand.json bundles.compositions.
/** @type {Record<string, string>} */
export const WRAPPER_BUNDLES = {
  'ds-block-news': 'dekker-block-news',
  'ds-block-news ds-block-news--worm-grey': 'dekker-block-news',
  'ds-block-news ds-block-news--dark-grey': 'dekker-block-news',
  'ds-block-news ds-block-news--very-light-grey': 'dekker-block-news',
  'ds-splide-carousel ds-splide-carousel-news ds-brand-splide-carousel': 'dekker-block-news',
  'ds-block-products': 'dekker-block-products',
  'ds-block-products ds-block-products--worm-grey': 'dekker-block-products',
  'ds-block-products ds-block-products--dark-grey': 'dekker-block-products',
  'ds-block-products ds-block-products--very-light-grey': 'dekker-block-products',
  'ds-splide-carousel ds-splide-carousel-products ds-brand-splide-carousel': 'dekker-block-products',
  'ds-block-teaser-news': 'dekker-block-teaser-news',
  'ds-brand-key-specs': 'dekker-key-specs',
};

/** @param {ReadonlyArray<{ value: string }>} list */
const valuesOf = (list) => list.map(({ value }) => value);
/**
 * @param {ReadonlyArray<{ value: string }>} list
 * @param {string | undefined} value
 * @returns {string}
 */
export const oneOf = (list, value) => (value !== undefined && valuesOf(list).includes(value) ? value : '');

/**
 * The classes and CSS bundles the composition options give. A value the lists do not have gives
 * nothing. A composition loads its bundle; a background is a class of the brand file and loads
 * nothing. The brand's container has no container style, so `libClass` is always false.
 *
 * @param {{ wrappersVariant?: string, backgroundVariant?: string }} [options]
 * @returns {{ classes: string[], bundles: string[], libClass: boolean, aemGrid: boolean, carousel: boolean, sectionClass: string }}
 *   `aemGrid` is true for a composition: the container block always renders `.cmp-container >
 *   .aem-Grid`, and the composition's stylesheet and the carousel controller read it, so a section
 *   with a composition has the grid too. `carousel` is true for a carousel composition
 *   (`ds-splide-carousel`), whose slides take `aem-GridColumn`. `sectionClass` is the class a page
 *   section with a composition carries, which css/page-glue.css lays out as the container block, and
 *   in which a section nested in it sits in a `.nest-cell`.
 */
export function compositionOf(options = {}) {
  const wrapper = oneOf(wrappersVariant, options.wrappersVariant);
  const background = oneOf(backgroundVariant, options.backgroundVariant);
  /** @type {string[]} */
  const bundles = [];
  if (wrapper && WRAPPER_BUNDLES[wrapper]) bundles.push(`${WRAPPER_BUNDLES[wrapper]}.css`);
  return {
    classes: [wrapper, background].filter(Boolean),
    bundles,
    libClass: false,
    aemGrid: !!wrapper,
    carousel: wrapper.split(/\s+/).includes('ds-splide-carousel'),
    sectionClass: wrapper ? 'ds-composition' : '',
  };
}

/**
 * One part of a composition's React block: a container (`class` adds its classes) whose grid holds the
 * blocks it takes, in their order on the page, laid out by `grid` (the Grid values of a section; none:
 * one block per row).
 * @typedef {{ class?: string, blocks: string[], grid?: string }} CompositionPart
 */

// The parts of the compositions whose React block lays its blocks out in containers of its own (the
// News block: a heading and a button in a row, the cards in a carousel), by composition value. A page
// section with the composition and its blocks inside is arranged into these parts by the site.
/** @type {Record<string, CompositionPart[]>} */
export const LAYOUTS = {
  "ds-block-news": [
    {
      "blocks": [
        "dekker-title",
        "dekker-button"
      ],
      "grid": "grid-col-2"
    },
    {
      "class": "ds-splide-carousel ds-splide-carousel-news ds-brand-splide-carousel",
      "blocks": [
        "dekker-teaser"
      ],
      "grid": "grid-col-3"
    }
  ],
  "ds-block-news ds-block-news--worm-grey": [
    {
      "blocks": [
        "dekker-title",
        "dekker-button"
      ],
      "grid": "grid-col-2"
    },
    {
      "class": "ds-splide-carousel ds-splide-carousel-news ds-brand-splide-carousel",
      "blocks": [
        "dekker-teaser"
      ],
      "grid": "grid-col-3"
    }
  ],
  "ds-block-news ds-block-news--dark-grey": [
    {
      "blocks": [
        "dekker-title",
        "dekker-button"
      ],
      "grid": "grid-col-2"
    },
    {
      "class": "ds-splide-carousel ds-splide-carousel-news ds-brand-splide-carousel",
      "blocks": [
        "dekker-teaser"
      ],
      "grid": "grid-col-3"
    }
  ],
  "ds-block-news ds-block-news--very-light-grey": [
    {
      "blocks": [
        "dekker-title",
        "dekker-button"
      ],
      "grid": "grid-col-2"
    },
    {
      "class": "ds-splide-carousel ds-splide-carousel-news ds-brand-splide-carousel",
      "blocks": [
        "dekker-teaser"
      ],
      "grid": "grid-col-3"
    }
  ],
  "ds-block-products": [
    {
      "blocks": [
        "dekker-title",
        "dekker-text"
      ]
    },
    {
      "class": "ds-splide-carousel ds-splide-carousel-products ds-brand-splide-carousel",
      "blocks": [
        "dekker-teaser"
      ],
      "grid": "grid-col-3"
    }
  ],
  "ds-block-products ds-block-products--worm-grey": [
    {
      "blocks": [
        "dekker-title",
        "dekker-text"
      ]
    },
    {
      "class": "ds-splide-carousel ds-splide-carousel-products ds-brand-splide-carousel",
      "blocks": [
        "dekker-teaser"
      ],
      "grid": "grid-col-3"
    }
  ],
  "ds-block-products ds-block-products--dark-grey": [
    {
      "blocks": [
        "dekker-title",
        "dekker-text"
      ]
    },
    {
      "class": "ds-splide-carousel ds-splide-carousel-products ds-brand-splide-carousel",
      "blocks": [
        "dekker-teaser"
      ],
      "grid": "grid-col-3"
    }
  ],
  "ds-block-products ds-block-products--very-light-grey": [
    {
      "blocks": [
        "dekker-title",
        "dekker-text"
      ]
    },
    {
      "class": "ds-splide-carousel ds-splide-carousel-products ds-brand-splide-carousel",
      "blocks": [
        "dekker-teaser"
      ],
      "grid": "grid-col-3"
    }
  ]
};

/**
 * The parts of the composition a section carries, by its classes: the layout of the composition value
 * whose classes it has all of (the longest such value, so a colour variant finds its own).
 * @param {Element} section
 * @returns {CompositionPart[] | null}
 */
export function layoutOf(section) {
  const value = Object.keys(LAYOUTS)
    .filter((key) => key.split(/\s+/).every((cls) => section.classList.contains(cls)))
    .sort((a, b) => b.length - a.length)[0];
  return value ? LAYOUTS[value] : null;
}
