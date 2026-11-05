// The page controllers the AC package starts, in start order (contracts/page-controllers.md lists
// the fields; the runner is page-controllers.js). Plain data: a function does not belong here.
// Modules are paths relative to this file.

/** @type {import('./page-controllers.js').PageControllerEntry[]} */
const list = [
  {
    name: 'teasers-with-filter',
    selector: '.ac-core-block-teasers-with-filter',
    controllers: [{ module: './teasers-with-filter-controller.js', export: 'BlockTeasersWithFilterController', call: 'init' }],
    // Typing in the filter box hides cards, which the author then cannot select.
    inEditor: false,
    startOnce: 'controller',
    hook: 'teasersWithFilterStructure',
  },
  {
    name: 'splide-grid-carousel',
    selector: '.ac-core-splide-grid-carousel',
    controllers: [{ module: './splide-grid-carousel-controller.js', export: 'BlockSplideGridCarouselController', call: 'init' }],
    // The controller mounts Splide on the carousel, which rearranges the blocks the author edits.
    inEditor: false,
  },
  {
    name: 'ac-splide-carousel',
    // A container with the Splide Carousel style. The ac-splide-carousel block carries the same
    // class and has started its own carousel by now, so a carousel that is mounted is not a match.
    selector: '.ac-core-splide-carousel:not(.ds-splide-carousel--initialized)',
    controllers: [{ module: './ac-splide-carousel-controller.js', export: 'ACSplideCarouselController', call: 'init' }],
    // The slider rearranges the cards the author edits.
    inEditor: false,
    hook: 'maskStartedCarousels',
  },
  {
    name: 'anchor-link',
    selector: "a[href^='#']",
    controllers: [{ module: './anchor-link-controller.js', export: 'AnchorLinkController', call: 'init' }],
    // The header is fixed over the page, so the offset is its height at the click: the design
    // system's header, or the boilerplate one a page keeps.
    options: { headerOffset: { live: { selector: '.ds-v2_c-header__inner, header .nav-wrapper', property: 'offsetHeight', fallback: 0 } } },
    // A click on an in-page link selects it in the editor; scrolling would move the page.
    inEditor: false,
    // The controller binds every in-page link and replays the hash.
    startOnce: { on: 'document', attribute: 'data-anchor-link-started' },
    // The controller binds the links that exist when it starts, and the Table of contents block
    // draws its list a moment after the page changes.
    startWhen: { quiet: true },
  },
  {
    name: 'ac-footer',
    selector: '.ds-brand-button__back-to-top',
    // The constructor binds the first back-to-top button of the document; there is no init.
    controllers: [{ module: './footer-controller.js', export: 'FooterController', call: 'constructor' }],
    // The button only scrolls the page; nothing is rearranged.
    inEditor: true,
    startOnce: { on: 'match', attribute: 'data-footer-started' },
  },
  {
    name: 'ac-header',
    selector: '.ds-v2_c-header',
    // Each controller finds its elements in the document and does nothing when they are missing.
    controllers: [
      { module: './breadcrumb-controller.js', export: 'default', call: 'init' },
      { module: './burger-controller.js', export: 'default', call: 'init' },
      { module: './header-controller.js', export: 'default', call: 'init' },
      { module: './language-switcher-secondary-controller.js', export: 'default', call: 'init' },
      { module: './language-switcher-controller.js', export: 'default', call: 'init' },
      { module: './megamenu-controller.js', export: 'default', call: 'init' },
      { module: './navigation-controller.js', export: 'default', call: 'init' },
      { module: './skip-button-controller.js', export: 'default', call: 'init' },
    ],
    // The header becomes fixed and the page is padded by its height, and the mega menu takes the
    // page over: both get in the way of editing.
    inEditor: false,
    // The controllers keep one header, and add listeners on the document and window each time.
    startOnce: { on: 'match', attribute: 'data-header-started' },
    showWhileStarting: true,
  },
  {
    name: 'toc-layout',
    selector: '.ds-brand-block-toc-layout',
    controllers: [{ module: './toc-layout-controller.js', export: 'BlockTableOfContentLayoutController', call: 'init' }],
    // The sidebar becomes sticky, which gets in the way of editing.
    inEditor: false,
    startOnce: 'controller',
    // The controller reads the links of the table of contents once.
    startWhen: { quiet: true },
  },
];

export default list;
