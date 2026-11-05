// The page glue of an EDS site that renders this package's components: the one step the design
// system adds to the Adobe page pipeline (decorateContainerSections), the Universal Editor refresh
// wiring (attachNestRefreshListeners), and the brand's body classes (applyBrandBodyClasses). A
// site calls these from its own scripts.js / scripts.ts; nothing here reads a site file.
import renderContainer, { gridCountOf } from './render-container.js';

/**
 * What the package knows of its brand. The values a site may decide for itself (its own path
 * prefix, nav fragment and home page) are defaults here: the site passes its own descriptor where
 * it needs a different one.
 *
 * @typedef {object} BrandDescriptor
 * @property {string} lib The brand library this package is built for (`ac-core-lib`, `ac-group-lib`).
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
export const brand = {
  "lib": "ac-core-lib",
  "bodyClasses": [
    "ac-core",
    "ds-atlascopco"
  ],
  "pathPrefix": null,
  "navPath": "/nav",
  "homePath": "/"
};

/**
 * Adds the brand's body classes. The design system's CSS is scoped under them, so a page without
 * them is unstyled.
 * @param {HTMLElement} [body]
 * @param {Pick<BrandDescriptor, 'bodyClasses'>} [descriptor] A site's own description of the brand.
 */
export function applyBrandBodyClasses(body = document.body, descriptor = brand) {
  body.classList.add(...descriptor.bodyClasses);
}

/**
 * The address a section's background image field gives, or undefined for an empty one. The value
 * is the repository path as typed, or an absolute URL when the export turned it into a link or an
 * image (readBlockConfig returns the anchor's href or the image's src). Quotes and backslashes are
 * escaped, because the address goes into a quoted url().
 * @param {string | undefined} value The section's backgroundimagereference value
 * @returns {string | undefined}
 */
export function backgroundImageUrl(value) {
  const url = (value ?? '').trim().replace(/[\r\n]/g, '');
  return url ? url.replace(/["\\]/g, '\\$&') : undefined;
}

// The section fields that hold a spacing class, by field name; the dataset key is its lowercase.
const SPACING_KEYS = ['padding', 'paddingTop', 'paddingBottom', 'margin', 'marginTop', 'marginBottom'];

/**
 * Decorates sections with the Container fields (backgroundColor, backgroundImageReference,
 * gridVariant, contentWidth) and the spacing fields (padding, paddingTop, paddingBottom, margin,
 * marginTop, marginBottom; each value is a utility class of the design system, and the side
 * classes win over the pair). decorateSections copies every section-metadata key other
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
 * @param {Element} main The container of the sections
 */
export function decorateContainerSections(main) {
  main.querySelectorAll(':scope > .section').forEach((section) => {
    const {
      backgroundcolor: backgroundColor,
      gridvariant: gridVariant,
      contentwidth: contentWidth,
      backgroundimagereference: backgroundImageReference,
    } = section.dataset;
    // Each spacing key holds a class name (py-12, pt-4, my-8, mb-16 and so on).
    const spacing = SPACING_KEYS.filter((key) => section.dataset[key.toLowerCase()]);

    // Every section on the page gets a content width: the one it asks for, or 12 when it
    // has none (older content, or a field that was never saved). A fragment's sections
    // (the header and footer included) are not page sections, and a fragment placed in a
    // page already sits inside the page section's container, so they keep only what they
    // ask for.
    const width = contentWidth || (main.matches('body > main') ? '12' : undefined);

    // A section that already has the wrapper below, or the bleed class, has been
    // decorated: the editor runs this again over the whole main after each section swap.
    if (section.classList.contains('content-width-bleed')
      || section.querySelector(':scope > .cmp-container')) return;
    if (!backgroundColor && !backgroundImageReference && !gridVariant && !width
      && !spacing.length) {
      return;
    }

    // A section is full-bleed: its background colour and image are drawn on the section itself,
    // across the page, and its padding sits inside them. Only the content is held to the
    // section's width, by the .cmp-container built below. (A container block is a box: its
    // colour and image sit on its own .cmp-container.)
    if (backgroundColor) {
      // A hex value typed with its "#" reaches here as a link (the export turns it into
      // an anchor, and readBlockConfig returns its absolute URL ending in the hash).
      // A hex value without the "#" is invalid CSS and would be ignored.
      const hex = backgroundColor.match(/^https?:\/\/[^#]*#([0-9a-f]{3,8})$/i)?.[1]
        || (/^[0-9a-f]{3,8}$/i.test(backgroundColor) && backgroundColor);
      section.style.backgroundColor = hex ? `#${hex}` : backgroundColor;
      delete section.dataset.backgroundcolor;
    }

    // Any value except "bleed" is a width (6, 8, 10 or 12) and gets the design system's
    // container, which caps and centres it. Bleed has no container and no cap.
    const hasWidth = width && width !== 'bleed';
    if (hasWidth) delete section.dataset.contentwidth;

    if (width === 'bleed') {
      // css/page-glue.css overrides the width cap, keyed on this class.
      section.classList.add('content-width-bleed');
      delete section.dataset.contentwidth;
    }

    const imageUrl = backgroundImageUrl(backgroundImageReference);
    if (backgroundImageReference) delete section.dataset.backgroundimagereference;
    if (imageUrl) section.style.backgroundImage = `url("${imageUrl}")`;
    if (gridVariant) delete section.dataset.gridvariant;

    if (hasWidth || gridVariant) {
      // The wrapper is the design system's ContainerLayout, built by renderContainer on the
      // section itself. The design system styles ".ds-content-width-N .cmp-container"
      // (max-width, centered) and ".grid-col-N > .cmp-container > .aem-Grid". Both selectors
      // have to match the same element, so there is exactly one .cmp-container, the section's
      // direct child, and it carries the width and the grid together. A second .cmp-container
      // would give the grid a nested container that the width rule also matches and caps again.
      // Shapes: width only is ".cmp-container > children"; grid (with or without a width)
      // is ".cmp-container > .aem-Grid > children".
      const existing = [...section.children];
      const { content } = renderContainer({
        contentWidth: hasWidth ? width : undefined,
        grid: gridVariant ? gridCountOf(gridVariant) : undefined,
        useAemGridTemplate: !!gridVariant,
      }, section);
      content.append(...existing);
    }

    spacing.forEach((key) => {
      section.classList.add(section.dataset[key.toLowerCase()]);
      delete section.dataset[key.toLowerCase()];
    });
  });
}

// The Universal Editor events that mean a block was changed.
const EDIT_EVENTS = [
  'aue:content-patch',
  'aue:content-update',
  'aue:content-add',
  'aue:content-move',
  'aue:content-remove',
  'aue:content-copy',
];

/**
 * The editor swaps in a freshly decorated block after each edit but runs none of the site's
 * page steps again (nesting a block under its parent, starting the page controllers), so a block
 * that gained or changed a parentId would stay in place until a reload. The edit events only
 * confirm the page is inside the Universal Editor; the MutationObserver reacts to the swap
 * actually landing, since a fixed delay cannot reliably follow the swap, which is asynchronous.
 * Changes that follow one another are answered once, 100 ms after the last. `onChange` should be
 * idempotent and cheap when there is nothing to do.
 * @param {Element | null | undefined} main The main element
 * @param {() => void} onChange What the site runs after the swap has landed
 */
export function attachNestRefreshListeners(main, onChange) {
  if (!main) return;
  let observer = null;
  let pendingTimeout = null;
  const scheduleChange = () => {
    if (pendingTimeout !== null) clearTimeout(pendingTimeout);
    pendingTimeout = setTimeout(() => {
      pendingTimeout = null;
      onChange();
    }, 100);
  };
  const startObserving = () => {
    if (observer) return;
    observer = new MutationObserver(scheduleChange);
    observer.observe(main, { childList: true, subtree: true });
  };
  EDIT_EVENTS.forEach((eventType) => main.addEventListener(eventType, startObserving));
}
