/**
 * Builds the `items` of a table of content from the headings of a page.
 *
 * AEM builds a table of content on the server from the headings it finds between a start and a
 * stop level; the browser has to do the same on a delivered page. This file is that scan, and
 * returns the nested item shape the DS TableOfContent() takes:
 * { id, text, active, href, children }.
 *
 * `root` is the element to scan (the page's main). The headings between `startLevel` and
 * `stopLevel` (both inclusive, 'h1' to 'h6') are listed in document order, and a heading nests
 * under the closest earlier heading of a higher level. A heading is left out when it, or an
 * element around it, carries one of `ignoreClasses`, when it sits inside `exclude` (the table of
 * content itself), or when it has no text.
 *
 * A heading with no id gets one made from its text, because the link needs a target. The id is
 * set on the heading element and is unique in the document. Headings that already have an id keep
 * it.
 */
const LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function ensureId(heading, text) {
  if (heading.id) return heading.id;
  const base = slugify(text) || 'heading';
  const doc = heading.ownerDocument;
  let id = base;
  let n = 1;
  while (doc.getElementById(id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  heading.id = id;
  return id;
}

/** @typedef {{ id: string, text: string, active: boolean, children: TocItem[], href: string }} TocItem */

/**
 * @param {Element} root
 * @param {{
 *   startLevel?: string, stopLevel?: string, ignoreClasses?: string[], exclude?: Element | null,
 *   idPrefix?: string,
 * }} [options]
 * @returns {TocItem[]}
 */
export default function buildTocItems(root, {
  startLevel = 'h1', stopLevel = 'h6', ignoreClasses = ['cmp-accordion__header'], exclude = null, idPrefix = 'toc',
} = {}) {
  const from = Math.max(LEVELS.indexOf(startLevel), 0);
  const to = LEVELS.indexOf(stopLevel) === -1 ? LEVELS.length - 1 : LEVELS.indexOf(stopLevel);
  const ignore = (ignoreClasses || []).filter(Boolean);
  const ignored = (el) => ignore.some((name) => el.closest(`.${name}`));

  /** @type {TocItem[]} */
  const items = [];
  /** @type {Array<{ level: number, item: TocItem }>} */
  const stack = [];
  let count = 0;
  [...root.querySelectorAll(LEVELS.join(','))].forEach((heading) => {
    const level = LEVELS.indexOf(heading.localName);
    if (level < from || level > to) return;
    if (exclude && exclude.contains(heading)) return;
    if (ignored(heading)) return;
    const text = heading.textContent.replace(/\s+/g, ' ').trim();
    if (!text) return;

    count += 1;
    const item = {
      id: `${idPrefix}-${count}`, text, active: false, children: [], href: `#${ensureId(heading, text)}`,
    };
    while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
    (stack.length ? stack[stack.length - 1].item.children : items).push(item);
    stack.push({ level, item });
  });
  return items;
}
