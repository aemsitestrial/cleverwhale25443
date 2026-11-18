# Page controllers

`js/vendor/start-page-controllers.js` of `@ac-brandsframework/eds-assets-dekker` starts the controllers below. This file is generated from `js/vendor/page-controller-list.js`, the list the function runs.

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
| `hook` | A named step the runner owns, or a list of them: every step that wraps the start does so in the order listed, and every check runs. |
| `hookOptions` | The brand's own selectors and classes a hook works with, keyed by the hook's name. The runner is shared by every brand and names no brand class. |

## Entries, in start order
