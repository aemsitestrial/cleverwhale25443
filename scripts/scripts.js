import {
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';
import {
  applyBrandBodyClasses, decorateContainerSections, attachNestRefreshListeners,
} from '../ds-eds-assets/js/vendor/page-glue.js';
import nestByParent, { isAuthoringContext } from '../ds-eds-assets/js/vendor/nest-by-parent.js';
import { startPageControllers } from '../ds-eds-assets/js/vendor/start-page-controllers.js';
import {
  NESTABLE_SELECTOR, LAYOUT_MODELS, decorateTocSections, clearNoneSectionFields,
} from './ds.js';

/**
 * Moves all the attributes from a given elmenet to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveAttributes(from, to, attributes) {
  if (!attributes) {
    // eslint-disable-next-line no-param-reassign
    attributes = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attributes.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to?.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveInstrumentation(from, to) {
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')),
  );
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks() {
  try {
    // TODO: add auto block, if needed
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  // A section field chosen as None (grid, spacing, layout) adds nothing.
  clearNoneSectionFields(main);
  // The design system's container on each section, from its section fields (background, grid,
  // content width, spacing). After decorateBlocks, before the blocks load.
  decorateContainerSections(main);
  // A section with the layout "Table of contents": its table of contents beside its content.
  decorateTocSections(main);
}

/**
 * The design system's page steps, once the blocks are decorated: blocks that name a container in
 * their "Nest inside" field move into it, then the page controllers start (carousels, table of
 * contents layout, anchor links, header and footer). Both are safe to run again.
 * @param {Element} main The main element
 */
async function finishDesignSystemPage(main) {
  // The editor swaps in a section without decorateMain: put it into its layout again.
  decorateTocSections(main);
  nestByParent(main, { layoutSelector: NESTABLE_SELECTOR, layoutModels: LAYOUT_MODELS });
  // Every block has its final markup now: a table of contents lists the page's headings again.
  document.dispatchEvent(new CustomEvent('ds:page-ready'));
  await startPageControllers(document, {
    inEditor: isAuthoringContext(document),
    onWarning(problems) {
      // eslint-disable-next-line no-console
      problems.forEach(({ element, message, source }) => console.warn(`[${source}] ${message}`, element));
    },
  });
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  // The design system's body classes (ac-core, ds-atlascopco): its CSS is scoped under them.
  applyBrandBodyClasses();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadSections(main);
  await finishDesignSystemPage(main);
  // The Universal Editor swaps in a decorated block after an edit without running the page steps.
  attachNestRefreshListeners(main, () => finishDesignSystemPage(main));

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
