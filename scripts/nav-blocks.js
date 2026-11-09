// Reads the blocks of the nav page (blocks/ac-nav-*) from its markup as delivered (/nav.plain.html,
// before any block is decorated) into what blocks/header/header.js builds the header from.
//
//   AC Nav Header      logo, logo link, breadcrumb on or off, the middle bar's buttons (search,
//                      profile, cart, stock, statistic) and the labels
//   AC Nav Links       one item per link: its group (main menu, mega menu secondary links, top bar
//                      local or global links), its level in the main menu (a link nests under the
//                      closest link above it with a lower level), the link and, for a global
//                      link, its style (link, button, pinned button, locations)
//   AC Nav Languages   one item per language: region, link with the language's name, code
//   AC Nav Locator     the Locator above the header: when it shows, its texts, and one item per
//                      country and language with the page to go to
import { brand } from '../ds-eds-assets/js/vendor/page-glue.js';
import {
  hrefOf, pathOf, currentPath, isExternal,
} from './chrome.js';

export const NAV_BLOCKS = ['ac-nav-header', 'ac-nav-links', 'ac-nav-languages', 'ac-nav-locator'];
const MAX_LEVEL = 3;

const textOf = (cell) => (cell?.textContent || '').replace(/\s+/g, ' ').trim();

/** A key-value block's own rows: field name -> value cell. */
function ownCells(block) {
  return Object.fromEntries([...block.children]
    .filter((row) => row.children.length === 2)
    .map((row) => [textOf(row.children[0]), row.children[1]]));
}

/** A container block's item rows (more than two cells, or not a known field). */
const itemRows = (block, ownNames = []) => [...block.children]
  .filter((row) => !(row.children.length === 2 && ownNames.includes(textOf(row.children[0]))));

/** A link cell: { href, label }, or null when it holds no address. */
function linkOf(cell) {
  const a = cell?.querySelector('a');
  const href = a ? hrefOf(a) : textOf(cell);
  if (!href) return null;
  return { href, label: textOf(a || cell) };
}

/** An image cell's source, resolved against the nav page (its media are relative to it). */
function imageOf(cell, navPath) {
  const img = cell?.querySelector('img');
  if (!img) return null;
  const src = img.getAttribute('src') || '';
  return {
    src: src.startsWith('./') ? new URL(src, new URL(navPath, window.location.href)).href : src,
    alt: img.getAttribute('alt') || '',
  };
}

function readHeader(block, navPath) {
  const cells = block ? ownCells(block) : {};
  const value = (name) => textOf(cells[name]);
  const home = linkOf(cells.homeLink)?.href || brand.homePath;
  const image = imageOf(cells.logo, navPath);
  const tools = {};
  const tool = (name, label = '', title = '') => {
    const link = linkOf(cells[`${name}Link`]);
    if (link) tools[name] = { href: link.href, label, title };
  };
  tool('search');
  tool('profile', value('profileLabel'));
  tool('cart', value('cartCount'));
  tool('stock', value('stockLabel'), value('stockChange'));
  tool('statistic');
  const labels = Object.fromEntries([
    ['skip', 'skipLabel'], ['menu', 'menuLabel'], ['close', 'closeLabel'], ['back', 'backLabel'],
    ['mainMenu', 'mainMenuLabel'], ['navigation', 'navigationLabel'],
  ].filter(([, field]) => value(field)).map(([key, field]) => [key, value(field)]));
  return {
    home,
    logo: image ? { ...image, alt: value('logoAlt') || image.alt, href: home } : null,
    tools,
    labels,
    showBreadcrumb: value('breadcrumb') !== 'false',
  };
}

// AC Nav Link cells: group, level, link (its text folded in), style.
function readLinks(blocks) {
  const here = currentPath();
  const tree = [];
  const stack = [];
  const secondary = [];
  const local = [];
  const global = [];
  const globalButtons = [];
  blocks.flatMap((block) => itemRows(block)).forEach((row) => {
    const [groupCell, levelCell, linkCell, styleCell] = [...row.children];
    const link = linkOf(linkCell);
    if (!link) return;
    const group = textOf(groupCell) || 'main';
    if (group === 'secondary') secondary.push(link);
    else if (group === 'local') local.push(link);
    else if (group === 'global') {
      const style = textOf(styleCell) || 'link';
      if (style === 'link') global.push(link);
      else globalButtons.push({ ...link, pinned: style === 'pinned', globe: style === 'globe' });
    } else {
      const level = Math.min(Math.max(parseInt(textOf(levelCell), 10) || 0, 0), MAX_LEVEL);
      const item = {
        ...link,
        external: isExternal(link.href),
        current: pathOf(link.href) === here,
        children: [],
      };
      while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
      (stack.length ? stack[stack.length - 1].item.children : tree).push(item);
      stack.push({ level, item });
    }
  });
  return {
    tree, secondary, local, global, globalButtons,
  };
}

// AC Nav Language cells: region, link (the language's name folded in), code.
function readLanguages(blocks) {
  const regions = [];
  blocks.flatMap((block) => itemRows(block)).forEach((row) => {
    const [regionCell, linkCell, langCell] = [...row.children];
    const link = linkOf(linkCell);
    if (!link) return;
    const region = textOf(regionCell);
    const lang = textOf(langCell) || (pathOf(link.href) || '').split('/')[1] || '';
    let group = regions[regions.length - 1];
    if (!group || group.region !== region) {
      group = { region, links: [] };
      regions.push(group);
    }
    group.links.push({ label: link.label, href: link.href, lang });
  });
  return regions;
}

const LOCATOR_FIELDS = ['display', 'sentenceLabel', 'countryPlaceholder', 'languagePlaceholder',
  'searchPlaceholder', 'submitLabel', 'viewAllLink'];

// AC Nav Locator: its fields, and its country items (code, country, language, page).
function readLocator(block) {
  if (!block) return null;
  const cells = ownCells(block);
  const value = (name) => textOf(cells[name]);
  const viewAll = linkOf(cells.viewAllLink);
  const entries = itemRows(block, LOCATOR_FIELDS).map((row) => {
    const [codeCell, countryCell, languageCell, linkCell] = [...row.children];
    return {
      code: textOf(codeCell).toUpperCase(),
      country: textOf(countryCell),
      language: textOf(languageCell),
      href: linkOf(linkCell)?.href || '',
    };
  }).filter((entry) => entry.country && entry.language && entry.href);
  return {
    display: value('display') || 'auto',
    sentence: value('sentenceLabel') || 'Looks like you\'re in:',
    countryPlaceholder: value('countryPlaceholder') || 'Country',
    languagePlaceholder: value('languagePlaceholder') || 'Language',
    searchPlaceholder: value('searchPlaceholder') || 'Search country',
    submitLabel: value('submitLabel') || 'Switch to {language}',
    viewAll: viewAll ? {
      href: viewAll.href,
      label: viewAll.label && viewAll.label !== viewAll.href
        ? viewAll.label : 'View all locations and languages',
    } : null,
    entries,
  };
}

/** Whether the nav page's markup has any of the nav blocks. */
export const hasNavBlocks = (root) => !!root.querySelector(NAV_BLOCKS.map((b) => `.${b}`).join(','));

/**
 * The header's content from the nav blocks of the nav page's markup.
 * @param {Element} root the nav page's markup (/nav.plain.html)
 * @param {string} navPath the nav page's path, which its media are relative to
 */
export function readNavBlocks(root, navPath) {
  const all = (name) => [...root.querySelectorAll(`.${name}`)];
  return {
    ...readHeader(all('ac-nav-header')[0], navPath),
    ...readLinks(all('ac-nav-links')),
    languages: readLanguages(all('ac-nav-languages')),
    locator: readLocator(all('ac-nav-locator')[0]),
  };
}
