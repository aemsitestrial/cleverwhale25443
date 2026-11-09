// The site header: the design system's AC header and mega menu, built from the nav fragment
// (ds-eds-assets/contracts/ac-header.md). The bundle ac-chrome-header styles it and the ac-header
// page controllers (burger, navigation, mega menu, language switchers, skip button, breadcrumb)
// make it work.
//
// The nav fragment (/nav, or the page's "nav" metadata) has up to four sections, in this order:
//   1. Brand       the logo (an image), and a link for it (the home page when there is none)
//   2. Navigation  a nested list, up to four levels: the main navigation and the mega menu;
//                  a second list is the mega menu's secondary links
//   3. Top bar     a list of links (the local links), a second list (the global links), links in
//                  paragraphs (global link buttons: `:globe:` marks the locations link, bold
//                  pins it)
//                  and a list whose items hold a list (the language switcher: region > languages;
//                  a language link's title is its lang)
//   4. Tools       links named by an icon or their first word: search, profile, cart, stock,
//                  statistic; the rest of the text is the label (stock: its title is the change)
// The breadcrumb is the page's branch of the navigation; page metadata "breadcrumb: off" hides it.
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { loadBundle } from '../../scripts/ds.js';
import { brand } from '../../ds-eds-assets/js/vendor/page-glue.js';
import { startPageControllers } from '../../ds-eds-assets/js/vendor/start-page-controllers.js';
import {
  el, sectionsOf, contentOf, iconOf, textOf, hrefOf, pathOf, currentPath, isExternal,
} from '../../scripts/chrome.js';

const LABELS = {
  skip: 'Skip to main content',
  menu: 'Menu',
  close: 'Close',
  home: 'Home',
  back: 'Back to',
  mainMenu: 'main menu',
  navigation: 'Main navigation',
};
const TOOLS = ['stock', 'search', 'profile', 'statistic', 'cart'];
const MAX_LEVEL = 3;

// ---- Reading the fragment ----------------------------------------------------------------------

/** The items of a nested list: { label, href, external, current, children }. */
function readTree(ul, level = 0) {
  const here = currentPath();
  return [...ul.children].filter((li) => li.tagName === 'LI').map((li) => {
    const a = li.querySelector(':scope > a, :scope > p > a, :scope > strong > a, :scope > p > strong > a');
    const sub = li.querySelector(':scope > ul, :scope > ol');
    const href = a ? hrefOf(a) : '#';
    return {
      label: textOf(a || li),
      href,
      external: isExternal(href),
      current: !!a && pathOf(href) === here,
      children: sub && level < MAX_LEVEL ? readTree(sub, level + 1) : [],
    };
  });
}

/** The items from the root to the page's own item, or [] when the page is not in the tree. */
function branchTo(items) {
  for (let i = 0; i < items.length; i += 1) {
    if (items[i].current) return [items[i]];
    const below = branchTo(items[i].children);
    if (below.length) return [items[i], ...below];
  }
  return [];
}

const linksOf = (node) => [...node.querySelectorAll('a')];
const listsOf = (content) => content.filter((n) => n.tagName === 'UL' || n.tagName === 'OL');
const isLanguageList = (ul) => !!ul.querySelector(':scope > li > ul, :scope > li > ol');

function readNav(fragment) {
  const [brandSection, navSection, topSection, toolsSection] = sectionsOf(fragment);

  // The logo's link, and the breadcrumb's first item: the brand section's link, or the home page.
  const brandLink = brandSection?.querySelector('a');
  const home = brandLink ? hrefOf(brandLink) : brand.homePath;
  const img = brandSection?.querySelector('img');
  const logo = img ? {
    src: img.currentSrc || img.getAttribute('src'),
    alt: img.getAttribute('alt') || '',
    href: home,
  } : null;

  const navLists = listsOf(contentOf(navSection));
  const tree = navLists[0] ? readTree(navLists[0]) : [];
  const toLink = (a) => ({ label: textOf(a), href: hrefOf(a) });
  const secondary = navLists[1] ? linksOf(navLists[1]).map(toLink) : [];

  const topContent = contentOf(topSection);
  const topLists = listsOf(topContent);
  const plainLists = topLists.filter((ul) => !isLanguageList(ul));
  const languageList = topLists.find(isLanguageList);
  const local = plainLists[0] ? linksOf(plainLists[0]).map(toLink) : [];
  const global = plainLists[1] ? linksOf(plainLists[1]).map(toLink) : [];
  const globalButtons = topContent.filter((n) => n.tagName === 'P').flatMap(linksOf).map((a) => ({
    ...toLink(a),
    globe: iconOf(a) === 'globe',
    pinned: !!a.closest('strong'),
  }));
  const languages = languageList ? [...languageList.children].map((li) => ({
    region: textOf(li),
    links: linksOf(li.querySelector('ul, ol')).map((a) => ({
      label: textOf(a),
      href: hrefOf(a),
      lang: a.getAttribute('title') || a.getAttribute('hreflang') || (pathOf(hrefOf(a)) || '').split('/')[1] || '',
    })),
  })) : [];

  const tools = {};
  (toolsSection ? linksOf(toolsSection) : []).forEach((a) => {
    let name = iconOf(a);
    let label = textOf(a);
    if (!TOOLS.includes(name)) {
      const [first, ...rest] = label.split(' ');
      name = first.toLowerCase();
      label = rest.join(' ');
    }
    if (TOOLS.includes(name) && !tools[name]) {
      tools[name] = { href: hrefOf(a), label, title: a.getAttribute('title') || '' };
    }
  });

  return {
    home, logo, tree, secondary, local, global, globalButtons, languages, tools,
  };
}

// ---- Building the markup -----------------------------------------------------------------------

const button = (divClass, text, attrs = {}) => el(
  'div',
  { class: `${divClass}`, ...attrs },
  el('button', { class: 'cmp-button', type: 'button' }, el('span', { class: 'cmp-button__text' }, text)),
);

const linkButton = (divClass, { href, label }, linkAttrs = {}) => el(
  'div',
  { class: divClass, 'design-system': divClass.includes('ds-v2_c-middle-bar') ? true : undefined },
  el('a', { class: 'cmp-button', href, ...linkAttrs }, el('span', { class: 'cmp-button__text' }, label || '')),
);

const cmpList = (links, itemClass = 'cmp-list__item') => el(
  'ul',
  { class: 'cmp-list' },
  links.map(({ label, href }) => el(
    'li',
    { class: itemClass },
    el('a', { class: 'cmp-list__item-link', href }, label),
  )),
);

const logoImage = (logo, extraClass) => el(
  'div',
  { class: `ds-aem_c-logo image ${extraClass}` },
  el(
    'div',
    { class: 'cmp-image' },
    el('a', { class: 'cmp-image__link', href: logo.href }, el('img', { class: 'cmp-image__image', src: logo.src, alt: logo.alt })),
  ),
);

const burger = (extraClass) => button(
  `ds-aem_c-burger button ${extraClass}`,
  LABELS.menu,
  { 'design-system': true, 'data-open': LABELS.menu, 'data-close': LABELS.close },
);

function languageSwitcher(languages) {
  if (!languages.length) return null;
  return el(
    'div',
    { class: 'ds-aem_c-language-switcher languagenavigation ds-brand-language-switcher' },
    el('nav', { class: 'cmp-languagenavigation' }, el(
      'ul',
      { class: 'cmp-languagenavigation__group' },
      languages.map(({ region, links }) => el(
        'li',
        { class: 'cmp-languagenavigation__item cmp-languagenavigation__item--level-0' },
        el('span', { class: 'cmp-languagenavigation__item-title', lang: links[0]?.lang || undefined }, region),
        el('ul', { class: 'cmp-languagenavigation__group cmp-navigation__group' }, links.map((link) => el(
          'li',
          { class: 'cmp-languagenavigation__item cmp-languagenavigation__item--level-1' },
          el('a', {
            class: 'cmp-languagenavigation__item-link',
            href: link.href,
            lang: link.lang || undefined,
            hreflang: link.lang || undefined,
            rel: 'alternate',
          }, link.label),
        ))),
      )),
    )),
  );
}

function topBar(nav) {
  const globalItems = [
    nav.global.length ? el('div', { class: 'ds-aem_c-top-bar-global-link navigation' }, cmpList(nav.global)) : null,
    ...nav.globalButtons.map((link) => linkButton(
      [
        'ds-aem_c-top-bar-global-link button',
        link.pinned ? 'ds-aem_c-top-bar-global-link--pinned' : '',
        link.globe ? 'ds-aem_c-top-bar-global-link--globe' : '',
      ].filter(Boolean).join(' '),
      link,
    )),
    languageSwitcher(nav.languages),
  ];
  return el(
    'div',
    { class: 'ds-v2_c-top-bar ds-v2_c-header__top-bar', 'design-system': true },
    el(
      'div',
      { class: 'ds-v2_c-top-bar__inner' },
      el(
        'div',
        { class: 'ds-aem_c-skip-button button ds-v2_c-top-bar__skip-button' },
        el(
          'button',
          { class: 'cmp-button', type: 'button' },
          el('span', { class: 'cmp-button__icon', 'aria-hidden': true }),
          el('span', { class: 'cmp-button__text' }, LABELS.skip),
        ),
      ),
      nav.local.length ? el('div', { class: 'ds-aem_c-top-bar-local navigation ds-v2_c-top-bar__local' }, cmpList(nav.local)) : null,
      el(
        'div',
        { class: 'ds-v2_c-top-bar-global ds-v2_c-top-bar__global', 'design-system': true },
        el('div', { class: 'ds-v2_c-top-bar-global__item-list' }, globalItems),
      ),
      el('div', { class: 'ds-v2_c-top-bar__burger-wrap' }, burger('ds-v2_c-top-bar__burger ds-aem_c-burger--top-bar')),
    ),
  );
}

function breadcrumb(nav) {
  if (/^(off|false|no|hide)$/i.test(getMetadata('breadcrumb'))) return null;
  const here = currentPath();
  if (pathOf(nav.home) === here) return null;
  const branch = branchTo(nav.tree);
  const ancestors = branch.slice(0, -1).filter((item) => item.href !== '#');
  const title = getMetadata('breadcrumb-title')
    || branch[branch.length - 1]?.label
    || getMetadata('og:title')
    || document.title;
  return el(
    'div',
    { class: 'ds-aem_c-breadcrumb breadcrumb ds-v2_c-middle-bar__breadcrumb' },
    el('nav', { class: 'cmp-breadcrumb', 'aria-label': 'Breadcrumb' }, el(
      'ol',
      { class: 'cmp-breadcrumb__list' },
      [{ label: LABELS.home, href: nav.home }, ...ancestors].map(({ label, href }) => el(
        'li',
        { class: 'cmp-breadcrumb__item' },
        el('a', { class: 'cmp-breadcrumb__item-link', href }, el('span', {}, label)),
      )),
      el(
        'li',
        { class: 'cmp-breadcrumb__item cmp-breadcrumb__item--active', 'aria-current': 'page' },
        el('span', {}, title),
      ),
    )),
  );
}

function tool(name, { href, label, title }) {
  const base = `ds-aem_c-${name} button ds-v2_c-middle-bar__${name}`;
  if (name === 'stock') {
    const states = { '-': 'negative', '+': 'positive' };
    const state = states[title.charAt(0)] || 'neutral';
    const cls = base.replace(' button', ` button ds-aem_c-stock--${state}`);
    return linkButton(cls, { href, label }, { 'data-text': title });
  }
  // Search and statistic have no text; the cart's text is its count.
  return linkButton(base, { href, label: name === 'search' || name === 'statistic' ? '' : label });
}

function middleBar(nav, crumb) {
  return el(
    'div',
    { class: 'ds-v2_c-middle-bar ds-v2_c-header__middle-bar', 'design-system': true },
    el(
      'div',
      { class: 'ds-v2_c-middle-bar__inner' },
      el('div', { class: 'ds-v2_c-middle-bar__left-block' }, nav.logo ? logoImage(nav.logo, 'ds-v2_c-middle-bar__logo') : null),
      el(
        'div',
        { class: 'ds-v2_c-middle-bar__center-block' },
        el(
          'div',
          { class: 'ds-aem_c-navigation navigation ds-v2_c-middle-bar__navigation' },
          el('nav', { class: 'cmp-navigation' }, el('ul', { class: 'cmp-navigation__group' }, nav.tree.map((item, i) => el(
            'li',
            { class: 'cmp-navigation__item cmp-navigation__item--level-0' },
            el('a', {
              class: 'cmp-navigation__item-link',
              href: item.href,
              'data-id': `nav-${i}`,
              'aria-current': item.current ? 'page' : undefined,
            }, item.label),
          )))),
        ),
        crumb ? el('div', { class: 'ds-v2_c-middle-bar__separator' }) : null,
        crumb,
      ),
      el(
        'div',
        { class: 'ds-v2_c-middle-bar__right-block' },
        TOOLS.filter((name) => nav.tools[name]).map((name) => tool(name, nav.tools[name])),
        burger('ds-v2_c-middle-bar__burger'),
      ),
    ),
  );
}

function navItems(items, level) {
  return items.map((item, i) => el(
    'li',
    { class: `cmp-navigation__item cmp-navigation__item--level-${level}` },
    el('a', {
      class: `cmp-navigation__item-link${item.external ? ' cmp-navigation__item-link--external' : ''}`,
      href: item.href,
      'data-id': level === 0 ? `nav-${i}` : undefined,
      'aria-current': item.current ? 'page' : undefined,
    }, item.label),
    item.children.length
      ? el('ul', { class: 'cmp-navigation__group' }, navItems(item.children, level + 1))
      : null,
  ));
}

function megaMenu(nav) {
  const column = (cls, ...children) => el(
    'div',
    { class: `container responsivegrid ${cls} aem-GridColumn aem-GridColumn--default--12` },
    el('div', { class: 'cmp-container' }, children),
  );
  return el(
    'div',
    {
      class: 'ds-aem_c-mega-menu',
      'data-back-text': LABELS.back,
      'data-main-menu-text': LABELS.mainMenu,
      'design-system': true,
    },
    el('div', { class: 'cmp-container' }, el(
      'div',
      { class: 'aem-Grid aem-Grid--12 aem-Grid--default--12' },
      el(
        'div',
        { class: 'ds-aem_c-mega-menu__inner' },
        column('ds-aem_c-mega-menu__overlay'),
        column(
          'ds-aem_c-mega-menu__nav',
          nav.logo ? logoImage(nav.logo, 'ds-aem_c-mega-menu__logo') : null,
          el(
            'div',
            { class: 'navigation ds-aem_c-mega-menu__primary-navigation' },
            el(
              'nav',
              { class: 'cmp-navigation', id: 'navigation-primary', 'aria-label': LABELS.navigation },
              el('ul', { class: 'cmp-navigation__group' }, navItems(nav.tree, 0)),
            ),
          ),
          nav.secondary.length
            ? el('div', { class: 'list ds-aem_c-mega-menu__secondary-navigation' }, cmpList(nav.secondary, 'cmp-list__item cmp-list__item--level-0'))
            : null,
          button('button ds-aem_c-mega-menu__close aem-GridColumn aem-GridColumn--default--12', LABELS.close),
        ),
      ),
    )),
  );
}

/**
 * Loads the nav fragment and builds the design system's header and mega menu from it.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : brand.navPath;
  const fragment = await loadFragment(navPath);
  const nav = readNav(fragment);
  const crumb = breadcrumb(nav);

  // The skip button moves focus into #main; its controller looks the id up when it starts.
  const main = document.querySelector('main');
  if (main && !main.id) main.id = 'main';

  // The breadcrumb controller measures the items, so the CSS is in before the controllers start.
  await Promise.all([
    loadBundle('ac-chrome-header'),
    crumb ? loadBundle('ac-chrome-breadcrumb') : null,
  ]);

  // The root is a div (a header element with these classes turns the mega menu off); the page's
  // header element is the landmark. The mega menu is the root's next sibling.
  const root = el(
    'div',
    { class: 'ds-v2_c-header', 'design-system': true },
    el('div', { class: 'ds-v2_c-header__inner' }, topBar(nav), middleBar(nav, crumb)),
  );
  block.replaceChildren(root, megaMenu(nav));

  // The header is not authored on the page, so its controllers start in the editor too.
  await startPageControllers(block, { inEditor: false });
}
