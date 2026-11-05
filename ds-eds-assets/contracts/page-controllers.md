# Page controllers

`js/vendor/start-page-controllers.js` of `@ac-brandsframework/eds-assets` starts the controllers below. This file is generated from `js/vendor/page-controller-list.js`, the list the function runs.

## Calling it

```js
startPageControllers(root, { inEditor, onWarning })
```

- `root` is the page (the default) or a block. An entry applies when `root` contains a match for its `selector`.
- `inEditor`: true while the page is open in an editor. An entry whose `inEditor` is not `yes` is skipped.
- `inEditor` belongs to the call, not to the page. A site that sets it by testing the `root` it passes (for example for `[data-aue-resource]`) has controllers off in the editor for the main root only: a block that starts the controllers on its own root, such as a header or footer fragment, passes `inEditor: false`, and every entry that applies inside that root starts.
- `onWarning(problems)` is called once for each run with every problem the page has now, as `[{ element, message, source }]`, and with an empty array when there are none. A site that shows the problems adds a notice for each and removes the ones no longer listed. The runner also prints each distinct `(element, message)` once with `console.warn`.
- Call it once the blocks are decorated and nested, and again when markup is added. An entry that has started is not started again.
- An entry that fails to start is reported with `console.warn("[page-controllers] <name> did not start")` and does not stop the others. A controller whose `init()` returns a promise is not awaited, and a rejection of that promise is reported the same way.

## Fields of an entry

| Field | Meaning |
| --- | --- |
| `name` | The entry's name, used in warnings. |
| `selector` | The entry applies when the root contains a match. |
| `controllers` | The controllers, started in this order. `module` is a file of `js/vendor/`; `export` is the name of the export, or `default`. |
| `options` | The argument each controller is constructed with. A value that holds `live` is read when the controller uses it. |
| `instances` | Option sets: one controller of each kind is started for each set. |
| `inEditor` | Whether the entry also starts when the page is open in an editor. `no` where the controller rearranges or hides what an author edits. |
| `startOnce` | How the entry avoids starting twice: a mark the runner sets, or a mark the controller sets on its own root. |
| `startWhen` | A condition for the start: a quiet page, or elements that must exist. |
| `showWhileStarting` | The topmost ancestor of the match whose computed `visibility` is `hidden` is made visible for the synchronous start, and restored after it. |
| `afterStart` | An event dispatched on the document after the entry started. |
| `hook` | A named step the runner owns. |

## Entries, in start order

### teasers-with-filter

| Field | Value |
| --- | --- |
| `name` | `teasers-with-filter` |
| `selector` | `.ac-core-block-teasers-with-filter` |
| `controllers` | 1. `./teasers-with-filter-controller.js`, export `BlockTeasersWithFilterController`, constructed, then `init()` |
| `options` | none |
| `instances` | none |
| `inEditor` | no |
| `startOnce` | the controller marks its own root and does nothing when it finds the mark |
| `startWhen` | none |
| `showWhileStarting` | no |
| `afterStart` | none |
| `hook` | `teasersWithFilterStructure`: Before the entries start, checks the Teasers with filter markup of the root and reports each container that is missing a part. It starts nothing. It runs in an editor too. |

### splide-grid-carousel

| Field | Value |
| --- | --- |
| `name` | `splide-grid-carousel` |
| `selector` | `.ac-core-splide-grid-carousel` |
| `controllers` | 1. `./splide-grid-carousel-controller.js`, export `BlockSplideGridCarouselController`, constructed, then `init()` |
| `options` | none |
| `instances` | none |
| `inEditor` | no |
| `startOnce` | none |
| `startWhen` | none |
| `showWhileStarting` | no |
| `afterStart` | none |
| `hook` | none |

### ac-splide-carousel

| Field | Value |
| --- | --- |
| `name` | `ac-splide-carousel` |
| `selector` | `.ac-core-splide-carousel:not(.ds-splide-carousel--initialized)` |
| `controllers` | 1. `./ac-splide-carousel-controller.js`, export `ACSplideCarouselController`, constructed, then `init()` |
| `options` | none |
| `instances` | none |
| `inEditor` | no |
| `startOnce` | none |
| `startWhen` | none |
| `showWhileStarting` | no |
| `afterStart` | none |
| `hook` | `maskStartedCarousels`: Hides each carousel that is already mounted from the controller, by its class, for the length of the start, so the controller does not mount it a second time. |

### anchor-link

| Field | Value |
| --- | --- |
| `name` | `anchor-link` |
| `selector` | `a[href^='#']` |
| `controllers` | 1. `./anchor-link-controller.js`, export `AnchorLinkController`, constructed, then `init()` |
| `options` | `headerOffset`: `offsetHeight` of the first element that matches `.ds-v2_c-header__inner, header .nav-wrapper`, read when it is used; `0` when there is none |
| `instances` | none |
| `inEditor` | no |
| `startOnce` | `data-anchor-link-started` on the document element; set before the controllers load |
| `startWhen` | when nothing has been added to or removed from `main` (or `body`) for 250 ms, or after 3 s; the other entries do not wait |
| `showWhileStarting` | no |
| `afterStart` | none |
| `hook` | none |

### ac-footer

| Field | Value |
| --- | --- |
| `name` | `ac-footer` |
| `selector` | `.ds-brand-button__back-to-top` |
| `controllers` | 1. `./footer-controller.js`, export `FooterController`, constructed; the constructor does the work |
| `options` | none |
| `instances` | none |
| `inEditor` | yes |
| `startOnce` | `data-footer-started` on the first match; set before the controllers load |
| `startWhen` | none |
| `showWhileStarting` | no |
| `afterStart` | none |
| `hook` | none |

### ac-header

| Field | Value |
| --- | --- |
| `name` | `ac-header` |
| `selector` | `.ds-v2_c-header` |
| `controllers` | 1. `./breadcrumb-controller.js`, export `default`, constructed, then `init()`<br>2. `./burger-controller.js`, export `default`, constructed, then `init()`<br>3. `./header-controller.js`, export `default`, constructed, then `init()`<br>4. `./language-switcher-secondary-controller.js`, export `default`, constructed, then `init()`<br>5. `./language-switcher-controller.js`, export `default`, constructed, then `init()`<br>6. `./megamenu-controller.js`, export `default`, constructed, then `init()`<br>7. `./navigation-controller.js`, export `default`, constructed, then `init()`<br>8. `./skip-button-controller.js`, export `default`, constructed, then `init()` |
| `options` | none |
| `instances` | none |
| `inEditor` | no |
| `startOnce` | `data-header-started` on the first match; set before the controllers load |
| `startWhen` | none |
| `showWhileStarting` | yes |
| `afterStart` | none |
| `hook` | none |

### toc-layout

| Field | Value |
| --- | --- |
| `name` | `toc-layout` |
| `selector` | `.ds-brand-block-toc-layout` |
| `controllers` | 1. `./toc-layout-controller.js`, export `BlockTableOfContentLayoutController`, constructed, then `init()` |
| `options` | none |
| `instances` | none |
| `inEditor` | no |
| `startOnce` | the controller marks its own root and does nothing when it finds the mark |
| `startWhen` | when nothing has been added to or removed from `main` (or `body`) for 250 ms, or after 3 s; the other entries do not wait |
| `showWhileStarting` | no |
| `afterStart` | none |
| `hook` | none |
