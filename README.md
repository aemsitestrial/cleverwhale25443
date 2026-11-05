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
