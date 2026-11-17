/**
 * Adds the brand's body classes. The design system's CSS is scoped under them, so a page without
 * them is unstyled.
 * @param {HTMLElement} [body]
 * @param {Pick<BrandDescriptor, 'bodyClasses'>} [descriptor] A site's own description of the brand.
 */
export function applyBrandBodyClasses(body?: HTMLElement, descriptor?: Pick<BrandDescriptor, 'bodyClasses'>): void;
/**
 * The address a section's background image field gives, or undefined for an empty one. The value
 * is the repository path as typed, or an absolute URL when the export turned it into a link or an
 * image (readBlockConfig returns the anchor's href or the image's src). Quotes and backslashes are
 * escaped, because the address goes into a quoted url().
 * @param {string | undefined} value The section's backgroundimagereference value
 * @returns {string | undefined}
 */
export function backgroundImageUrl(value: string | undefined): string | undefined;
/**
 * Decorates sections with the Container fields (backgroundColor, backgroundImageReference,
 * gridVariant, contentWidth), the content alignment (contentAlignment: the class of the
 * `contentAlignment` option list, content-center, content-right or content-left, which the
 * design system's utility CSS reads on the section and everything inside it) and the spacing fields (padding, paddingTop, paddingBottom, margin,
 * marginTop, marginBottom; each value is a utility class of the design system, and the side
 * classes win over the pair), and, where the brand has them, the container's composition
 * (AC: filterBlockVariant, blockContainerVariant, carouselVariant, tocLayout, styleVariant; ACG:
 * wrappersVariant, fillColorTheme, backgroundVariant, containerStyle; each value is a class string
 * of the design system, applied under the container block's rules, see container-composition.js;
 * an AC composition also gives the section the grid the container block always has,
 * `.cmp-container > .aem-Grid`, with no content width unless the section names one, and the
 * class `ds-composition`, which css/page-glue.css lays out as the block). decorateSections
 * copies every section-metadata key other
 * than "style" onto section.dataset. Each value is removed once applied, and a decorated section
 * is recognised by its .cmp-container child or the bleed class, so running this again
 * does nothing.
 *
 * The dataset keys are lowercase because the metadata key is derived from the field
 * name by toClassName, which drops the camelCase boundary (backgroundColor becomes
 * backgroundcolor).
 *
 * Must run after decorateBlocks: decorateBlocks only finds "div.section > div > div",
 * and the wrappers added here put the existing wrapper divs one or two levels deeper.
 *
 * A composition's CSS bundle loads through `loadBundle(file)`, which is the site's: it knows the
 * folder the package is installed in (ds-bundles.js `loadBundle(file, assets)`). Without it the
 * classes are set and no bundle loads.
 * @param {Element} main The container of the sections
 * @param {{ loadBundle?: (file: string) => unknown }} [options]
 */
export function decorateContainerSections(main: Element, { loadBundle }?: {
    loadBundle?: (file: string) => unknown;
}): void;
/**
 * The editor swaps in a freshly decorated block after each edit but runs none of the site's
 * page steps again (starting the page controllers, for one), so a swapped-in block would not be
 * set up by them until a reload. The edit events only confirm the page is inside the Universal
 * Editor; the MutationObserver reacts to the swap actually landing, since a fixed delay cannot
 * reliably follow the swap, which is asynchronous.
 * Changes that follow one another are answered once, 100 ms after the last. `onChange` should be
 * idempotent and cheap when there is nothing to do.
 * @param {Element | null | undefined} main The main element
 * @param {() => void} onChange What the site runs after the swap has landed
 */
export function attachNestRefreshListeners(main: Element | null | undefined, onChange: () => void): void;
/**
 * What the package knows of its brand. The values a site may decide for itself (its own path
 * prefix, nav fragment and home page) are defaults here: the site passes its own descriptor where
 * it needs a different one.
 *
 * @typedef {object} BrandDescriptor
 * @property {string} lib The brand library this package is built for (the `<brand-lib>` of libs/<brand-lib>/src/eds/).
 * @property {string[]} bodyClasses The classes the brand's CSS is scoped under, the ones in `css/brands.json`.
 * @property {string | null} pathPrefix Pages whose web path starts with this belong to the brand;
 *   null for the default brand, which takes every other page.
 * @property {string} navPath The nav fragment the header reads when a page names none.
 * @property {string} homePath Where the header's logo goes when the nav fragment gives it no link.
 */
/**
 * The brand of this package. The constant is written into this file by the package build, from
 * `css/brands.json` and `brand-items.json`, so it cannot differ from them.
 * @type {BrandDescriptor}
 */
export const brand: BrandDescriptor;
/**
 * What the package knows of its brand. The values a site may decide for itself (its own path
 * prefix, nav fragment and home page) are defaults here: the site passes its own descriptor where
 * it needs a different one.
 */
export type BrandDescriptor = {
    /**
     * The brand library this package is built for (the `<brand-lib>` of libs/<brand-lib>/src/eds/).
     */
    lib: string;
    /**
     * The classes the brand's CSS is scoped under, the ones in `css/brands.json`.
     */
    bodyClasses: string[];
    /**
     * Pages whose web path starts with this belong to the brand;
     * null for the default brand, which takes every other page.
     */
    pathPrefix: string | null;
    /**
     * The nav fragment the header reads when a page names none.
     */
    navPath: string;
    /**
     * Where the header's logo goes when the nav fragment gives it no link.
     */
    homePath: string;
};
