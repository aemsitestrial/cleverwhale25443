# Locator and Locator Select (AC): markup contract for an EDS page

The Locator is the banner above the AC header that offers the visitor's own country and language. It is
not a block. The site builds the component, the country data and the logic around them; the
`ac-locator` CSS bundle styles the markup below, and `locator-select-class.js` is the dropdown the two
selects use. The markup is what `locator.tsx` and `locator-select.tsx` render, with the elements the
dropdown class adds to it; the bundle's CSS selects on it.

## What ships in `@ac-brandsframework/eds-assets` (AC package)

| File | What it is |
|---|---|
| bundle `ac-locator` | The Locator's CSS: AEM Container, ac Container, Text, ac Text, Button and ac Button rules, the ds-atlascopco Text rules narrowed to inside `.ac-core-locator` (the sentence's 28px line height; Text blocks elsewhere on the page keep their own rules), then `locator-select.scss` and `locator.scss`. The Locator Select has no bundle of its own: it is only used inside the Locator. |
| `js/vendor/locator-select-class.js` | `export class LocatorSelectClass`, copied from `locator-select.class.js`; its one import is rewritten to the sibling `locator-select-search-class.js`. |
| `js/vendor/locator-select-search-class.js` | `export class LocatorSelectSearchClass`, the search box inside a select's dropdown, copied as it is. Imports nothing. |
| `contracts/ac-locator.md` | This file. |

Not shipped, and the site's to build: the Locator's own logic (`locator.class.js` in the DS source is one
implementation to read), the country and language data (`data.json`), the lookup of the visitor's country
(`locator-api.ts`, which calls two external services with a token), and `locator-select.controller.js`,
which constructs a select without the event name and placeholder the Locator gives it.

## Page requirements

- `css/foundational.css` loaded once, and `ac-core` and `ds-atlascopco` on `<body>`. The bundle's
  selectors are scoped under those classes.
- bundle `ac-locator` loaded when the Locator is built.
- No page controller starts the dropdown: a select has no items until the site gives it some, so the
  site constructs `LocatorSelectClass` itself, once its markup is in the document (next section).

## Locator Select: what the site calls

```js
import { LocatorSelectClass } from '<package>/js/vendor/locator-select-class.js';

const country = new LocatorSelectClass({
  name: 'country',                      // free text
  el: document.querySelector('.ac-core-locator__select-country'),
  selectOptionEvent: 'countrySelectOption', // name of the CustomEvent fired on document when an item is picked
  useSearch: true,                      // adds the search box; the select must also carry .ac-core-locator-select--use-search
  searchPlaceholder: 'Search country',
  placeholder: 'Country',               // the toggler's text until something is selected
});
country.setListItems(['Sweden', 'Norway']);                       // strings, or { title, link } objects
```

- The constructor builds the dropdown (`div.ac-core-locator-select__dropdown`, with the search box and an
  empty `ul`) after the toggler button and adds `locator-select--initialization` to the root. It does
  nothing when `el` is missing or already carries that class.
- `setListItems(items)` replaces the `li` items. A string item is one `li`; a `{ title, link }` item is one
  `li` with `data-name` and `data-link`.
- `selectedOption = 'Sweden'` sets the toggler text, closes the dropdown and marks the matching item
  `.ac-core-locator-select__dropdown-list-item--active`. `resetValue()` goes back to the placeholder.
- `disableDropdown = true` adds `disable` to the toggler button: the dropdown no longer opens and the
  chevron is hidden.
- A click on an item sets the selection and fires `new CustomEvent(selectOptionEvent, { detail: { value, link } })`
  on `document`. The class does not read the page's data and does not know the other select.
- With search: the search box fires `inputSearch` (typing), `submitSearch` and `submitEnterSearch` on `document`;
  the select filters its items by the text. A value that matches no item is accepted as the selection.
- Escape and a click outside close the dropdown.

## Markup

Class names are the contract. Elements and nesting are shown as `tag.class`; attributes that matter
are named. Anything not listed (ids, `data-cmp-*`) is optional for the CSS. The CSS selects on classes
only. Everything under `.ac-core-locator-select__dropdown` is added by `LocatorSelectClass`; the site
writes the rest.

```
div.locator.aem-GridColumn.aem-GridColumn--default--12
└ div.container.responsivegrid.ac-core-locator.aem-Grid--12.aem-Grid--default--12     (+ .locator--initialization to show it)
  └ div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12
    ├ div.container.responsivegrid.ac-core-locator__left.aem-GridColumn.aem-Grid--12.aem-Grid--default--12
    │ └ div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12
    │   ├ div.text.aem-GridColumn > div.cmp-text > p                          (the sentence: "Looks like you're in:")
    │   ├ div.container.responsivegrid.ac-core-locator-select.ac-core-locator__select-country.aem-GridColumn
    │   │   .ac-core-locator-select--use-search.aem-Grid--12.aem-Grid--default--12
    │   │ └ div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12
    │   │   └ div.button.ac-core-button.ac-core-locator-select__toggler
    │   │     ├ button.cmp-button[type=button] > span.cmp-button__text          (the selected country)
    │   │     └ div.ac-core-locator-select__dropdown                            (added by the class)
    │   │       ├ div.ac-core-locator-search                                    (only with search)
    │   │       │ └ div.ac-core-locator-search__input-inner
    │   │       │   ├ input.ac-core-locator-search__input[type=text][placeholder]
    │   │       │   └ button.ac-core-locator-search__button > span.ac-core-locator-search__button-icon
    │   │       └ ul.ac-core-locator-select__dropdown-list
    │   │         └ li.ac-core-locator-select__dropdown-list-item[tabindex=0][data-name]
    │   ├ div.container.responsivegrid.ac-core-locator-select.ac-core-locator__select-language.aem-Grid--12.aem-Grid--default--12
    │   │ └ the same structure as the country select, without search; the toggler button gets .disable when the country has one language
    │   └ div.button.ac-core-button.style-primary-negative.modifier-solid.ac-core-locator__submit.aem-GridColumn
    │     └ button.cmp-button[type=button]                                      (text: "Switch to Swedish")
    └ div.container.responsivegrid.ac-core-locator__right.aem-GridColumn.aem-Grid--12.aem-Grid--default--12
      └ div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12
        └ div.linkcomponent.link.ac-core-locator__link-view-all-locations.aem-GridColumn
          └ div.cmp-link > a.cmp-link__anchor[href]                             (text: "View all locations and languages")
```

### State classes the site sets

| Class | On | Effect |
|---|---|---|
| `locator--initialization` | `.ac-core-locator` | Shows the banner. Without it the banner is `display: none` with opacity 0, so a visitor the site has no offer for never sees it. |
| `locator--loading-location` | `.ac-core-locator` | The selects are dimmed and ignore the pointer while the site looks the country up. |
| `disable` | the toggler `button.cmp-button` | The dropdown does not open; no chevron. |
| `ac-core-locator-select--opened`, `ac-core-locator-select__toggler--active`, `ac-core-locator-select__dropdown--active` | the select, the toggler `div.button`, the dropdown | Set by `LocatorSelectClass`: the dropdown shows and the chevron points up. |
| `ac-core-locator-search--focused` | `div.ac-core-locator-search` | Set by the search class while the box has focus. No rule uses it. |
| `disabled` attribute | the submit `button.cmp-button` | Set by the site until a language is chosen. |

### Rules the CSS depends on

- The select's root carries both `ac-core-locator-select` and its position class
  (`ac-core-locator__select-country` or `…__select-language`); the width of the select is on the first.
- `.ac-core-locator__submit` is a Button with the classes `style-primary-negative` and `modifier-solid`;
  the pill and the gradient come from the `ac-button` rules in the bundle.
- The select's toggler is a `.button` inside `.ac-core-locator-select__toggler`. A red asterisk after the toggler
  text is CSS.
- The dropdown is positioned against the select (`position: relative` on the root), so the select must not be
  given `overflow: hidden` by the page.

## Known issues in the DS source

- `locator-select.tsx` gives the toggler the fixed id `ac-core-select-toggler`, so a Locator holds it twice.
  The CSS does not use the id; the site's markup may leave it out.
