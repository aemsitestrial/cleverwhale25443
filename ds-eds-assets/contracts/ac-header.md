# Header and mega menu (AC): markup contract for an EDS page

The AC header is not a block. The page's navigation fragment is turned into the markup below, the
`ac-chrome-header` CSS bundle styles it, and seven controllers make it work (eight with the breadcrumb's). The markup is what
`header.tsx` and `megaMenu.tsx` render; the bundle's CSS and the controllers select on it.

The skip button is part of this bundle. The breadcrumb is not: it has a bundle and a controller of its own
(`ac-chrome-breadcrumb`), listed below, for a page that has one. The Locator is not part of this bundle and its
markup is left out below.

## What ships in `@ac-brandsframework/eds-assets` (AC package)

| File | What it is |
|---|---|
| bundle `ac-chrome-header` | The header's CSS: AEM Button, then the `*-aem` styles of the header, the skip button, the bars, logo, navigation, burger, language switcher and the cart, profile, stock and statistic links, then the mega menu with its featured, resource and article lists. |
| `js/vendor/header-controller.js` | `AemHeaderController`: finds `.ds-v2_c-header`, reacts to scroll and resize, hides and shows the middle bar. |
| `js/vendor/burger-controller.js`, `burger-class.js` | `AemBurgerController`: one `BurgerClass` per `.ds-aem_c-burger` (the Menu / Close buttons). |
| `js/vendor/language-switcher-secondary-controller.js`, `-class.js` | `AemLanguageSwitcherSecondaryController`: one per `.ds-brand-language-switcher`; builds the language dropdown. |
| `js/vendor/language-switcher-controller.js`, `-class.js` | `AemLanguageSwitcherController`: one per `.ds-aem_c-language-switcher`; opens and closes the dropdown. |
| `js/vendor/megamenu-controller.js` | `AemMegaMenuController`: finds `.ds-aem_c-mega-menu`, builds its columns and back buttons, opens and closes it on the events. |
| `js/vendor/navigation-controller.js` | `AemNavigationController`: finds `.ds-aem_c-navigation` (the middle bar's links), scrolls it and dispatches `openMegaMenu` from its links. |
| `js/vendor/skip-button-controller.js`, `skip-button-class.js` | `AemSkipButtonController`: one `SkipButtonClass` per `.ds-aem_c-skip-button`; on click it moves focus to the first focusable element in `#main`, scrolled clear of the header. |
| bundle `ac-chrome-breadcrumb` | The breadcrumb's CSS: the aem-core-lib Breadcrumb styles, then the ac-core-lib ones. |
| `js/vendor/breadcrumb-controller.js`, `breadcrumb-class.js` | `AemBreadcrumbController`: one `BreadcrumbClass` per `.ds-aem_c-breadcrumb`; marks it initialized (which shows it) and trims or hides items that do not fit its width. |
| `js/vendor/define-property.js` | The small helper every controller imports. |
| `contracts/ac-header.md` | This file. |

Each controller is the ac-core-lib file with its relative imports pointed at the sibling files above.
Each is a default export. The language switcher element carries both classes (`ds-aem_c-language-switcher`
and `ds-brand-language-switcher`), so both language switcher controllers act on it.

## Page requirements

- `css/foundational.css` loaded once, and `ac-core` and `ds-atlascopco` on `<body>`. The bundle's
  selectors are scoped under those classes.
- bundle `ac-chrome-header` loaded when the header is built, and bundle `ac-chrome-breadcrumb`
  when the header has a breadcrumb. The breadcrumb controller measures the items, so its CSS is loaded before it starts.
- **One header per page.** The controllers find their element with `document.querySelector` and take the
  first match, and they talk to each other with events on `document` (`openMegaMenu`, `closeMegaMenu`,
  `showHeaderMiddleBar`, `hideHeaderMiddleBar`, `headerHeightTrigger`).
- The **header root is a `div`**, never a `header` element with the class `ds-v2_c-header` and the
  attribute `design-system`: the DS's own start-up reads that combination as a switch that turns the
  mega menu off. The page's own `header` element is the landmark and wraps the root.
- The **mega menu is the header's next sibling** (the DS moves it there at start; build it there).
- The page's main content has `id="main"`: the skip button's target. The skip button looks it up when its
  controller starts, so the id is set before then; it moves focus to the first focusable element inside it.
- The links of the page that is open carry `aria-current="page"`; the mega menu opens on the branch that
  holds it.

## Starting the controllers

The `ac-header` entry of `page-controllers.md` starts the controllers, once for each document and in the order it lists, after the header and the mega menu are in the document.

`headerHeightTrigger` is dispatched by the header controller from its scroll handler only, not at start.
A listener that needs the header's height before the first scroll (the Table of contents layout on a
narrow screen) gets none until the visitor scrolls, unless the page dispatches the event once itself
after starting the controllers.

## Markup

Class names are the contract. Elements and nesting are shown as `tag.class`; attributes that matter are
named. Anything not listed (ids, `data-cmp-*`) is optional.

```
div.ds-v2_c-header[design-system=true]
└ div.ds-v2_c-header__inner
  ├ div.ds-v2_c-top-bar.ds-v2_c-header__top-bar[design-system=true]
  │ └ div.ds-v2_c-top-bar__inner
  │   ├ div.ds-aem_c-skip-button.button.ds-v2_c-top-bar__skip-button                      (first child; hidden until it has focus)
  │   │ └ button.cmp-button > span.cmp-button__icon[aria-hidden=true] + span.cmp-button__text   (text: the label, `Skip to main content`)
  │   ├ div.ds-aem_c-top-bar-local.navigation.ds-v2_c-top-bar__local
  │   │ └ ul.cmp-list > li.cmp-list__item > a.cmp-list__item-link[href]                     (one per link)
  │   ├ div.ds-v2_c-top-bar-global.ds-v2_c-top-bar__global[design-system=true]
  │   │ └ div.ds-v2_c-top-bar-global__item-list
  │   │   ├ div.ds-aem_c-top-bar-global-link.navigation
  │   │   │ └ ul.cmp-list > li.cmp-list__item > a.cmp-list__item-link[href]
  │   │   ├ div.ds-aem_c-top-bar-global-link.button                                        (zero or more)
  │   │   │ └ a.cmp-button[href] > span.cmp-button__text
  │   │   │   modifiers on the div: ds-aem_c-top-bar-global-link--pinned, --globe (the locations link)
  │   │   └ div.ds-aem_c-language-switcher.languagenavigation.ds-brand-language-switcher
  │   │     └ nav.cmp-languagenavigation > ul.cmp-languagenavigation__group
  │   │       └ li.cmp-languagenavigation__item.cmp-languagenavigation__item--level-0         (one per region)
  │   │         ├ span.cmp-languagenavigation__item-title[lang]
  │   │         └ ul.cmp-languagenavigation__group.cmp-navigation__group
  │   │           └ li.cmp-languagenavigation__item.cmp-languagenavigation__item--level-1
  │   │             └ a.cmp-languagenavigation__item-link[href][lang][hrefLang][rel=alternate]
  │   └ div.ds-v2_c-top-bar__burger-wrap
  │     └ div.ds-aem_c-burger.button.ds-v2_c-top-bar__burger.ds-aem_c-burger--top-bar[design-system=true][data-open][data-close]
  │       └ button.cmp-button > span.cmp-button__text                                       (text: the open label)
  └ div.ds-v2_c-middle-bar.ds-v2_c-header__middle-bar[design-system=true]
    └ div.ds-v2_c-middle-bar__inner
      ├ div.ds-v2_c-middle-bar__left-block
      │ └ div.ds-aem_c-logo.image.ds-v2_c-middle-bar__logo
      │   └ div.cmp-image > a.cmp-image__link[href] > img.cmp-image__image[src][alt]
      ├ div.ds-v2_c-middle-bar__center-block
      │ ├ div.ds-aem_c-navigation.navigation.ds-v2_c-middle-bar__navigation
      │ │ └ nav.cmp-navigation > ul.cmp-navigation__group
      │ │   └ li.cmp-navigation__item.cmp-navigation__item--level-0
      │ │     └ a.cmp-navigation__item-link[href][data-id]                                  (one per top-level link)
      │ ├ div.ds-v2_c-middle-bar__separator
      │ └ div.ds-aem_c-breadcrumb.breadcrumb.ds-v2_c-middle-bar__breadcrumb                (optional; hidden until the controller adds ds-aem_c-breadcrumb--initialized)
      │   └ nav.cmp-breadcrumb[aria-label=Breadcrumb] > ol.cmp-breadcrumb__list
      │     ├ li.cmp-breadcrumb__item                                                      (one per ancestor page, the home page first)
      │     │ └ a.cmp-breadcrumb__item-link[href] > span                                   (span: the page name)
      │     └ li.cmp-breadcrumb__item.cmp-breadcrumb__item--active[aria-current=page]     (the current page, last; not a link)
      │       └ span                                                                       (the page name)
      └ div.ds-v2_c-middle-bar__right-block
        ├ div.ds-aem_c-stock.button.ds-aem_c-stock--positive.ds-v2_c-middle-bar__stock[design-system=true]
        │ └ a.cmp-button[href][data-text] > span.cmp-button__text                           (state class on the div: ds-aem_c-stock--positive, ds-aem_c-stock--negative or ds-aem_c-stock--neutral)
        ├ div.ds-aem_c-search.button.ds-v2_c-middle-bar__search[design-system=true]
        │ └ a.cmp-button[href] > span.cmp-button__text                                      (text empty)
        ├ div.ds-aem_c-profile.button.ds-v2_c-middle-bar__profile[design-system=true]
        │ └ a.cmp-button[href] > span.cmp-button__text                                      (logged in: ds-aem_c-profile--logged-in)
        ├ div.ds-aem_c-statistic.button.ds-v2_c-middle-bar__statistic[design-system=true]
        │ └ a.cmp-button[href] > span.cmp-button__text                                      (text empty)
        ├ div.ds-aem_c-cart.button.ds-v2_c-middle-bar__cart[design-system=true]
        │ └ a.cmp-button[href] > span.cmp-button__text                                      (text: the count)
        └ div.ds-aem_c-burger.button.ds-v2_c-middle-bar__burger[design-system=true][data-open][data-close]
          └ button.cmp-button > span.cmp-button__text

div.ds-aem_c-mega-menu[data-back-text][data-main-menu-text][design-system=true]            (the header's next sibling)
└ div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12
  └ div.ds-aem_c-mega-menu__inner
    ├ div.container.responsivegrid.ds-aem_c-mega-menu__overlay.aem-GridColumn.aem-GridColumn--default--12
    │ └ div.cmp-container                                                                   (empty)
    └ div.container.responsivegrid.ds-aem_c-mega-menu__nav.aem-GridColumn.aem-GridColumn--default--12
      └ div.cmp-container
        ├ div.ds-aem_c-logo.image.ds-aem_c-mega-menu__logo > div.cmp-image > a.cmp-image__link > img.cmp-image__image
        ├ div.navigation.ds-aem_c-mega-menu__primary-navigation
        │ └ nav.cmp-navigation#navigation-primary[aria-label] > ul.cmp-navigation__group
        │   └ li.cmp-navigation__item.cmp-navigation__item--level-0
        │     ├ a.cmp-navigation__item-link[href][data-id?]
        │     └ ul.cmp-navigation__group > li...--level-1 > a + ul > li...--level-2 > a + ul > li...--level-3 > a
        │       (link modifier for an external target: cmp-navigation__item-link--external)
        ├ div.list.ds-aem_c-mega-menu__secondary-navigation
        │ └ ul.cmp-list > li.cmp-list__item.cmp-list__item--level-0 > a.cmp-list__item-link[href]
        ├ div.ds-aem_c-mega-menu__additional-info                                           (optional)
        │ └ div.ds-aem_c-mega-menu__additional-info-item[data-id]                          (one per top-level link that has one)
        │   └ div.ds-v2_c-featured-list | div.ds-v2_c-resource-list | the article list
        └ div.button.ds-aem_c-mega-menu__close.aem-GridColumn.aem-GridColumn--default--12
          └ button.cmp-button > span.cmp-button__text                                       (text: the close label)
```

### Rules the controllers depend on

- **The breadcrumb's first item is shown as a home icon.** The styles draw the icon beside the first item's
  link; the link keeps its text. The `ol` is a flat list, one `li` per page, the current page last. The
  `schema.org` attributes React renders (`itemscope`, `itemprop`, `itemtype` and the `meta` position) are
  optional for the styles and the controller. The controller adds `cmp-breadcrumb__item--trimmed` (the text
  shows as `...`) and `cmp-breadcrumb__item--hidden` to the items between the first and the last two when the
  list is wider than the breadcrumb, and takes them off when it fits.
- **`data-id` pairs a top-level link with its additional-info item.** The mega menu controller matches
  each level-0 link in `nav#navigation-primary` to the `ds-aem_c-mega-menu__additional-info-item` with the
  same `data-id`. It is required wherever additional info is used. `megaMenu.tsx` renders it only in
  Storybook's data (the five `data-id` lines are commented out there), so the Storybook markup of the
  mega menu does not show it. A mega menu without additional info needs no `data-id`.
- The middle bar's `nav` and the mega menu's `nav#navigation-primary` list the same top-level links, in
  the same order; the id `navigation-primary` is fixed.
- The mega menu is hidden until the controller adds `ds-aem_c-mega-menu--is-visible` to its root on open. Storybook
  renders it with the class already set; the EDS markup has no such class at build.
- The mega menu opens on the branch that holds `a[aria-current=page]`; the `--active` classes on the
  items are set by the controller.
- The secondary language switcher moves its dropdown into `document.body` when it starts, so the dropdown
  is found by class under `body`, not under the header.
- Four levels (`--level-0` to `--level-3`) are styled; a fifth is not.

## Labels

The labels are English, as the DS has them:

| Where | Text | Override |
|---|---|---|
| Mega menu back button | `Back` (set in `megamenu-controller.js`) | none |
| Mega menu back-to text | `Back to` | `data-back-text` on the mega menu root |
| Mega menu main-menu text | `main menu` | `data-main-menu-text` on the mega menu root |
| Burger | `Menu` / `Close` | `data-open` and `data-close` on the burger |
| Mega menu close button | the button's own text | the markup |

Nothing is translated by the bundle.

## Wiring left to the site

The search, cart, profile, stock and statistic parts are links. Their icon, text and state are CSS; the
bundle has no code for them. A site that wants them to do something sets the markup:

| Part | What the markup carries | What the site sets |
|---|---|---|
| Search | A link; the icon is CSS. | The `href` (a search page, or a script that opens an overlay). Nothing in the header listens for it. The Algolia search box in the top bar (`div.search-box`) is a hook for a search widget; the bundle does not style it. |
| Cart | A link; the text is the count. | The `href` and the count. |
| Profile | A link; the text is the user name when signed in. | The `href`; `ds-aem_c-profile--logged-in` on the div and the name as the link text, from the site's sign-in. |
| Stock | A link; `data-text` is drawn after the label. | The state class (`ds-aem_c-stock--positive`, `ds-aem_c-stock--negative` or `ds-aem_c-stock--neutral`), the `data-text` and the `href`, from the site's stock service. |
| Statistic | A link; text empty. | The `href`. |

The anchor-link offset of a page (the height a link scrolls past) is the height of
`.ds-v2_c-header__inner`; a page that fixes its own offset reads it from there.

## Known issues in the DS source

These are in the files the bundle and the controllers are copied from, and are listed here, not changed:

- `header.controller.js` sets `height: auto !important` on the first element in the document with the class
  `header` (a DS fix for another page structure, marked for removal there). On a page whose block wrapper
  carries that class it is the wrapper that is changed.
- `search-aem/search.scss` has the root selector `.ds-aem_c-skip-button` where `.ds-aem_c-search` is meant. It
  styles the skip button, so the search link has no styles of its own, and the file is not in this bundle.
- `skipButton.class.js` moves focus after the window has scrolled: it waits for a `scroll` event. When the click
  does not scroll the page (the target is already at the top, or the page is too short to scroll), focus stays
  on the skip button.
- `languageSwitcherSecondary.class.js` writes a `console.log` line.
- `megaMenu.tsx` has the `data-id` lines commented out (see above).
- With all five tools (stock, profile, statistic, cart and the burger) in the middle bar, the bar's right
  block is 756 px wide at a 390 px viewport (`flex-shrink: 0`, `middleBar.scss`), so the middle bar's burger
  is outside the viewport. Markup rendered by React and by the EDS builder do the same. A mobile header needs
  fewer tools or a shorter stock text.
- The button of the secondary language switcher (`.ds-brand-language-switcher`) has no text when the
  controllers start on the header block of the aurora page: `buildCustomStructure()` reads
  `firstCategory.innerText`, which was empty while `textContent` was `Europe`. The same class run on a copy
  of the markup outside the header block gives the label. The cause is not known.
