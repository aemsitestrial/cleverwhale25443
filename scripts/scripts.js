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
// The site's brand is Dekker: its design system package is ds-eds-assets-dekker (the dekker-*
// blocks, scripts/ds-dekker.js). The Atlas Copco package (ds-eds-assets, the ac-* blocks,
// scripts/ds.js) stays in the repository, but the page no longer loads its brand.
import {
  applyBrandBodyClasses, decorateContainerSections, attachNestRefreshListeners,
} from '../ds-eds-assets-dekker/js/vendor/page-glue.js';
import { startPageControllers } from '../ds-eds-assets-dekker/js/vendor/start-page-controllers.js';
import { loadBundle, isAuthoringContext, clearNoneSectionFields } from './ds-dekker.js';
import nestSections from './nest-sections.js';

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
  // A section field chosen as None (grid, spacing) adds nothing.
  clearNoneSectionFields(main);
  // The design system's container on each section, from its section fields (background, grid,
  // content width, composition, spacing). After decorateBlocks, before the blocks load. A
  // composition (News block, Key specs, ...) loads its CSS bundle through loadBundle.
  decorateContainerSections(main, { loadBundle });
  // A section whose "Nest inside" names another section's "Name" moves into its grid: the parts
  // of a composition (the News block's head row and carousel) are sections nested in its section.
  nestSections(main, { editing: isAuthoringContext(document) });
}

/**
 * The design system's page steps, once the blocks are decorated: sections an edit brought in are
 * nested, then the page controllers start (the carousel of a composition). Safe to run again.
 * @param {Element} main The main element
 */
async function finishDesignSystemPage(main) {
  nestSections(main, { editing: isAuthoringContext(document) });
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
  // The design system's body class (ds-dekker): its CSS is scoped under it.
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
