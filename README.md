# Your Project's Title...
Your project's description...

## Environments
- Preview: https://main--cleverwhale25443--aemsitestrial.aem.page/
- Live: https://main--cleverwhale25443--aemsitestrial.aem.live/

## Documentation

Before using the aem-boilerplate, we recommand you to go through the documentation on [www.aem.live](https://www.aem.live/docs/) and [experienceleague.adobe.com](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/authoring), more specifically:
1. [Getting Started](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/edge-dev-getting-started), [Creating Blocks](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/create-block), [Content Modelling](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/content-modeling)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

Furthremore, we encourage you to watch the recordings of any of our previous presentations or sessions:
- [Getting started with AEM Authoring and Edge Delivery Services](https://experienceleague.adobe.com/en/docs/events/experience-manager-gems-recordings/gems2024/aem-authoring-and-edge-delivery)

## Design system (ds-eds-assets)

The `ac-*` blocks render the Atlas Copco design system from the package `@ac-brandsframework/eds-assets`,
installed as plain files in `ds-eds-assets/` (built in the atlascopco-core-components repo with
`nx run ac-core-lib:build-eds` and `yarn pack:eds-assets`).

- `head.html` loads the package's reset, brand file, fonts and `page-glue.css` before `styles/styles.css`.
- `scripts/scripts.js` adds the brand body classes, builds the design system's container on each section
  (section fields: background, grid, content width, spacing), nests blocks into an AC Container
  ("Nest inside" = the container's "Name") and starts the package's page controllers.
- `scripts/ds.js` holds what the blocks share; each `blocks/ac-*/ac-*.js` reads its rows and calls the
  package's render wrapper, which loads the block's CSS bundle.
- `blocks/ac-*/_ac-*.json` (models) and `blocks/ac-*/ac-*-fields.js` (which field fills which prop or
  option list) are generated from the package's `contracts/field-contract.json`.

To update the package and the models:

```sh
# copies the package into ds-eds-assets/ (the archive is not committed and not a dependency)
npx --yes --package ./ac-brandsframework-eds-assets-<version>.tgz eds-assets-install --to ds-eds-assets
npm run ds:blocks    # regenerates the ac-* models and field tables, then component-*.json
```

The site serves the files in `ds-eds-assets/`, which are committed; the package is not an npm
dependency, so `npm ci` does not need the archive.

### The None choice

Every select starts with **None** (stored as `_none`; `tools/ds-blocks/generate.mjs` adds it), so an
author can clear a choice. `applyNone` and `clearNoneSectionFields` in `scripts/ds.js` handle it:

- **Class lists** (theme, modifiers, spacing, clamps): None adds no class, and it also replaces the
  component's default. For example, a card with theme None has no `style-primary`.
- **Lists the component takes as a prop** (icon, link target)
  and a list item's "Item type": None leaves the value out, so the component's own default
  (or the list's item type) applies.
- **Section fields** (grid, padding, margin): None adds nothing.

Some selects have no None:

- the type of a family (card type, banner type, text content type);
- the heading level folded into a title;
- the section's content width (empty means the default width);
- the banner's section teaser image and promo banner style, which cannot be empty;
- the card action, which has its own "None".

### AC List items

An AC List Item whose type is a card type (Card content, Card AEM or Card icon) is that card. Its type is
the item's own "Item type", or the list's when the item has none. The package's `render-list` renders it
with `renderCard`, as the AC Card block would.

- The item has all of the card's fields: content (heading level, date, two actions) and options (card
  action, the modifiers of each card type, image cropping, line clamps, theme).
- The model shows each card field only for the item types it applies to, and the block drops an option
  that belongs to another card type.
- A card without a theme of its own takes the list's.
- Teasers and Key figure items stay plain teasers.

### Header and footer

`blocks/header` and `blocks/footer` build the AC header (with mega menu and breadcrumb) and the AC footer
from the `/nav` and `/footer` fragments, following the package's `contracts/ac-header.md` and
`contracts/ac-footer.md`. They load the `ac-chrome-header`, `ac-chrome-breadcrumb` and `ac-chrome-footer`
bundles and start the `ac-header` and `ac-footer` page controllers. Both fragments are default content
(text, lists, images); the order of the content decides what it becomes.

`/nav`, four sections in this order:

1. **Brand**: the logo image and its link (the home page when there is no link).
2. **Navigation**: a nested list, up to four levels deep. It feeds the middle bar (level 0) and the mega
   menu. A second list holds the mega menu's secondary links.
3. **Top bar**:
   - the first list is the local links and the second list is the global links;
   - links in paragraphs are global link buttons (`:globe:` in the text marks the locations link, bold pins
     it);
   - a list whose items hold lists is the language switcher (region, then its languages; a link's title is
     its `lang`).
4. **Tools**: links named by an icon (`:search:`) or by their first word (Search, Profile, Cart, Stock,
   Statistic). The rest of the text is the label. The cart's label is its count. The stock link's title is
   the change (`+1.2%` or `-0.4%` sets the state).

The breadcrumb is the page's branch of the navigation. Page metadata `breadcrumb: off` hides it, and
`breadcrumb-title` names the current page.

`/footer`:

- Each heading starts a column. The paragraphs after it are the column's text. The list after it is the
  column's links; a link's title is its subtitle.
- A paragraph whose links all hold an icon (`:linkedin:` is `/icons/linkedin.svg`) holds the social links.
- Any other paragraph is a bottom line:
  - a paragraph with a single link becomes a link button;
  - a link to `#cookie-settings` opens the consent dialog;
  - anything else is text.

Page metadata `back-to-top: off` removes the back-to-top button.

## Prerequisites

- nodejs 18.3.x or newer
- AEM Cloud Service release 2024.8 or newer (>= `17465`)

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `aem-boilerplate` template and add a mountpoint in the `fstab.yaml`
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)
