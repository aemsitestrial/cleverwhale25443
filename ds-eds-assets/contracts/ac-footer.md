# Footer (AC): markup contract for an EDS page

The AC footer is not a block. The page's footer fragment is turned into the markup below, the
`ac-chrome-footer` CSS bundle styles it and `footer-controller.js` makes the back-to-top button
work. The markup is what `footer.tsx` renders; the bundle's CSS selects on it.

## What ships in `@ac-brandsframework/eds-assets` (AC package)

| File | What it is |
|---|---|
| bundle `ac-chrome-footer` | The footer's CSS: AEM Button, Image and List rules, ds-atlascopco Text (its selectors narrowed to inside `.ds-brand-footer`), `ac-list`, then `footer.scss`. |
| `js/vendor/footer-controller.js` | `export class FooterController`, copied from `footer.controller.js` as it is. Imports nothing. |
| `contracts/ac-footer.md` | This file. |

## Page requirements

- `css/foundational.css` loaded once, and `ac-core` and `ds-atlascopco` on `<body>`. The bundle's
  selectors are scoped under those classes.
- bundle `ac-chrome-footer` loaded when the footer is built.
- The `ac-footer` entry of `page-controllers.md` constructs `FooterController` once, after the markup is in the
  document; it does nothing if `.ds-brand-button__back-to-top` is missing.

## Markup

Class names are the contract. Elements and nesting are shown as `tag.class`; attributes that matter
are named. Anything not listed (ids, `data-cmp-*`) is optional for the CSS. The CSS selects on
classes only, so the root may be a `div` inside the page's own `footer` element.

```
footer.footer.container.ds-brand-footer
└ div.cmp-container
  └ div.aem-Grid.aem-Grid--12.aem-Grid--default--12
    ├ div.container.responsivegrid.ds-brand-footer__top.aem-Grid--12.aem-Grid--default--12      (optional)
    │ └ div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12
    │   └ div.button.ds-brand-button.ds-brand-button__back-to-top
    │     └ button.cmp-button[type=button] > span.cmp-button__text            (text is empty; the arrow is CSS)
    ├ div.container.responsivegrid.ds-brand-footer__middle.aem-Grid--12.aem-Grid--default--12   (optional)
    │ └ div.cmp-container > div.aem-Grid... > div.container.responsivegrid.grid-col-4.aem-Grid--12.aem-Grid--default--12
    │   └ div.cmp-container > div.aem-Grid...
    │     └ per column: div.container.responsivegrid.aem-Grid--12.aem-Grid--default--12
    │       └ div.cmp-container > div.aem-Grid...
    │         ├ div.title > div.cmp-title > h6.cmp-title__text            (text, or a.cmp-title__link around the text)
    │         ├ div.text > div.cmp-text                                    (optional)
    │         └ div.list.ds-brand-list.ds-brand-vertical-card.aem-GridColumn.aem-GridColumn--default--12
    │           └ ul.cmp-list > li.cmp-list__item
    │             └ a.cmp-list__item-link[href][target?] > span.cmp-list__item-title + span.cmp-list__item-subtitle
    └ div.container.responsivegrid.ds-brand-footer__bottom.aem-Grid--12.aem-Grid--default--12
      └ div.cmp-container
        ├ div.container.responsivegrid.ds-brand-footer__social.aem-Grid--12.aem-Grid--default--12   (optional)
        │ └ div.cmp-container > div.image > div.cmp-image
        │     └ a.cmp-image__link[href] > img[alt][width=32][height=32][src]       (one per social channel)
        └ div.container.responsivegrid.ds-brand-footer__legal.aem-Grid--12.aem-Grid--default--12   (optional)
          └ div.cmp-container > div.aem-Grid...
            ├ div.button.ds-brand-footer-link.aem-GridColumn.aem-GridColumn--default--12
            │ └ a.cmp-button[href] > span.cmp-button__text
            └ div.text.aem-GridColumn.aem-GridColumn--default--12 > div.cmp-text      (one per bottom link, cookie settings, copyright)
```

## Content that comes from the footer fragment

| Part | Source in the fragment |
|---|---|
| Back-to-top | Present or not; no text. |
| Column title, optional text, link list | One column per heading plus its list of links. |
| Social images | One link per channel with an icon image. The icons are SVG files in the site, at 32 by 32. |
| Legal notice | One link. |
| Bottom links, cookie settings, copyright | One line each. |

## Labels

The labels are English, as in AEM: the back-to-top button has no text, and the footer fragment
carries the rest. Nothing is translated by the bundle.

## Wiring left to the site

- The **cookie settings** button (`#ot-sdk-btn`, class `ot-sdk-show-settings` in the AEM footer) is
  rendered as a plain button. It opens the consent dialog only when a consent script is on the page.
- The **social icons** are images the site hosts. The bundle does not ship them.
