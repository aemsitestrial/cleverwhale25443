// What the header and footer blocks share: reading the nav and footer fragments (default content
// of their sections) and building the design system's chrome markup
// (ds-eds-assets/contracts/ac-header.md, ac-footer.md).

/**
 * Creates an element.
 * @param {string} tag
 * @param {Record<string, string | boolean | undefined | null>} [attrs] `class` and attributes;
 *   a false, null or undefined value is left out
 * @param {...(Node | string | null | undefined | false)} children
 */
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([name, value]) => {
    if (value === false || value === null || value === undefined) return;
    if (name === 'class') node.className = value;
    else node.setAttribute(name, value === true ? 'true' : value);
  });
  children.flat().forEach((child) => {
    if (child === null || child === undefined || child === false) return;
    node.append(typeof child === 'string' ? document.createTextNode(child) : child);
  });
  return node;
}

/** The sections of a fragment, in order. */
export const sectionsOf = (fragment) => (fragment ? [...fragment.querySelectorAll(':scope > .section')] : []);

/** The default content of a section (headings, paragraphs, lists, pictures), in order. */
export const contentOf = (section) => (section
  ? [...section.querySelectorAll('.default-content-wrapper > *')]
  : []);

/** The name of the icon in an element (`:search:` becomes span.icon.icon-search), or ''. */
export function iconOf(node) {
  const icon = node?.querySelector('span.icon');
  const name = icon && [...icon.classList].find((c) => c.startsWith('icon-'));
  return name ? name.slice('icon-'.length) : '';
}

/** The text of an element without its icons and nested lists. */
export function textOf(node) {
  if (!node) return '';
  const copy = node.cloneNode(true);
  copy.querySelectorAll('span.icon, ul, ol').forEach((n) => n.remove());
  return copy.textContent.replace(/\s+/g, ' ').trim();
}

/** A link's href as authored. */
export const hrefOf = (a) => a?.getAttribute('href') || '#';

const normalisePath = (pathname) => pathname.replace(/\.html$/, '').replace(/\/+$/, '') || '/';

/** The path of a link, for comparing with the page's; null for a link to another site. */
export function pathOf(href) {
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return null;
    return normalisePath(url.pathname);
  } catch (e) {
    return null;
  }
}

/** The page's own path. */
export const currentPath = () => normalisePath(window.location.pathname);

/** Whether a link goes to another site. */
export const isExternal = (href) => /^https?:\/\//.test(href) && pathOf(href) === null;

/**
 * Shows a block of the nav page as a labelled list of its rows, on the nav page itself (the
 * header reads the block from the nav page's markup, not from this). The rows keep their editor
 * attributes, so the fields stay editable.
 * @param {HTMLElement} block
 * @param {string} title
 */
export function decorateNavConfig(block, title) {
  block.classList.add('ac-nav-config');
  if (!block.querySelector(':scope > .ac-nav-config-title')) {
    block.prepend(el('div', { class: 'ac-nav-config-title' }, title));
  }
}
