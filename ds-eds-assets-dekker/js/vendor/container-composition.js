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
  'ds-block-products': 'dekker-block-products',
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
 * @returns {{ classes: string[], bundles: string[], libClass: boolean }}
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
  };
}
