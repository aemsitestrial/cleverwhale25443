# Privacy notice (AC): markup contract for an EDS page

The privacy notice page holds a OneTrust notice. It is not a block. The OneTrust script fills the notice
and runs its two selects and its button; the `ac-block-privacy-notice` CSS bundle styles the page around
them. The markup is what `block-privacy-notice.tsx` renders; the bundle's CSS selects on its ids and classes.
The package ships no controller for it: nothing here is presentation behaviour of the design system.

## What ships in `@ac-brandsframework/eds-assets` (AC package)

| File | What it is |
|---|---|
| bundle `ac-block-privacy-notice` | AEM Container and ac Container rules, the base Privacy Policy rules (`.privacy-policy-secure` selects and buttons), then `block-privacy-notice.scss`: the styling of `#legalnoticeDropdown`, `#otnotice-language-dropdown` (box, border, chevron) and `#otnotice-bundle-button` (the primary solid negative button). |
| `contracts/ac-privacy-notice.md` | This file. |

The notice's own typography (`h2`, `h3`, `p`, `ul` inside `.otnotice-section-content`) is not in the
bundle: the page's foundational CSS and the text the OneTrust script returns decide it.

## Page requirements

- `css/foundational.css` loaded once, and `ac-core` and `ds-atlascopco` on `<body>`.
- bundle `ac-block-privacy-notice` loaded when the page is built.
- The OneTrust notice script, which the site loads and configures. It writes the region select's options,
  the language select's options and the notice sections, and it handles the Update button. The design
  system does not ship, call or configure it.

## Markup

Class names and ids are the contract. Elements and nesting are shown as `tag.class` or `tag#id`.

```
div.container.responsivegrid.max-w-full.aem-GridColumn.aem-GridColumn--default--12
└ div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12
  └ div.privacy-policy-secure.aem-GridColumn.aem-GridColumn--default--12
    └ div.privacy-policy > div.c-parsys-divider__item
      ├ select#regionDropdown                                      (the region choice; the DS styles #legalnoticeDropdown, see below)
      ├ button#otnotice-bundle-button                              (text: "Update")
      └ div#otnotice-bundle-container.otnotice
        ├ div.otnotice-language-dropdown-container > select#otnotice-language-dropdown[aria-label]
        └ div.otnotice-content > div.otnotice-sections
          └ section.otnotice-section[id] > h2.otnotice-section-header + div.otnotice-section-content
        div.otnotice-version
```

### Rules the CSS depends on

- Every `select` inside `.privacy-policy-secure` gets the base Privacy Policy rules (black 1px border, chevron,
  40px high), so the region select is styled whatever its id. The ids `#legalnoticeDropdown`,
  `#otnotice-language-dropdown` and `#otnotice-bundle-button` carry the AC rules on top of that (grey border,
  wider right padding; the button is the primary solid negative button). The element that carries
  `.privacy-policy-secure` is what ties the selects to the bundle: without it the selects keep the browser's look.
- The button's look is the AC primary solid negative button, written into the rule through the Button's
  placeholder selectors, so no Button bundle is needed beside it.

## Known issues in the DS source

- `block-privacy-notice.scss` styles `#legalnoticeDropdown`, the id of the base component, while the AC block
  renders `#regionDropdown`. The AC border and padding therefore do not reach the region select: it gets the
  base rules only. The language select has the AC rules.
