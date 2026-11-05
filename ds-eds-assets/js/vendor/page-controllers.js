// The page-controller runner: starts the controllers a page needs from a list of plain data (the
// package's page-controller-list.js, described in contracts/page-controllers.md). Plain DOM
// APIs only, so a site calls it with no build step. The runner holds the two named hooks a list
// entry may name; everything else an entry does is a field of the entry.
//
// An entry applies when `root` holds a match for its selector, and when the page is not open in
// an editor (or the entry says it runs there). One entry that fails to start does not stop the
// others.

/**
 * A value read when it is used: the `property` of the first element that matches `selector`, or
 * `fallback` when there is none.
 * @typedef {{ live: { selector: string, property: string, fallback?: unknown } }} LiveValue
 */

/**
 * One controller of an entry. `module` is a path relative to the list file; `export` is the name
 * of the export that holds the class, or "default". `call` is "init" (construct, then `init()`),
 * "constructor" (the constructor does the work) or a method called once for each element that
 * matches the entry's selector.
 * @typedef {{ module: string, export: string, call?: 'init' | 'constructor' | { method: string, per: 'match' } }} ControllerSpec
 */

/**
 * How an entry starts only once. `on: "document"` sets `attribute` on the document element;
 * `on: "match"` sets it on the first match of the selector. "controller": the controller marks
 * its own root and does nothing when it finds the mark.
 * @typedef {{ on: 'document' | 'match', attribute: string } | 'controller'} StartOnce
 */

/**
 * An event dispatched on the document after the entry started. `when` is a selector that must
 * match for the event to be dispatched. A value of `detail` may be a LiveValue.
 * @typedef {{ event: string, detail?: Record<string, unknown>, when?: string }} AfterStart
 */

/**
 * @typedef {object} PageControllerEntry
 * @property {string} name Used in warnings.
 * @property {string} selector The entry applies when the root contains a match.
 * @property {ControllerSpec[]} controllers Started in this order.
 * @property {Record<string, unknown>} [options] The constructor argument of each controller. A value may be a LiveValue.
 * @property {Record<string, unknown>[]} [instances] Option sets: one controller of each spec for each set.
 * @property {boolean} [inEditor] True only where the controller does not rearrange or hide what an author edits.
 * @property {StartOnce} [startOnce]
 * @property {{ quiet?: boolean, waitFor?: string[] }} [startWhen] `quiet`: start once nothing has been added to or removed from the page for 250 ms (3 s at most), without holding back the other entries. `waitFor`: selectors that must match inside the entry's first match, else nothing starts this run.
 * @property {boolean} [showWhileStarting] Make the topmost hidden ancestor of the match visible for the synchronous start.
 * @property {AfterStart} [afterStart]
 * @property {'maskStartedCarousels' | 'teasersWithFilterStructure'} [hook]
 */

/**
 * @typedef {{ element: Element, message: string, source: string }} PageControllerProblem
 */

/**
 * @typedef {object} PageControllerOptions
 * @property {boolean} [inEditor] True while the page is open in an editor.
 * @property {(problems: PageControllerProblem[]) => void} [onWarning] Called once for each run with every problem the page has now.
 */

const QUIET_MS = 250;
const QUIET_LIMIT_MS = 3000;

// Hook: teasersWithFilterStructure. The two ways Teasers with filter is placed at the wrong level;
// each message names what is missing. A block whose controller has started has had its Title and
// Text taken out on purpose.
const FILTER_BLOCK = '.ac-core-block-teasers-with-filter';
const FILTER_PARTS = [
  ['Top content', '.ac-core-block-teasers-with-filter-top-content'],
  ['Filter search', '.ac-core-filter'],
  ['Cards', '.ac-core-block-teasers-with-filter-cards'],
];

/**
 * @param {Document | Element} root
 * @returns {[Element, string][]}
 */
function structureProblems(root) {
  /** @type {[Element, string][]} */
  const problems = [];
  root.querySelectorAll(FILTER_BLOCK).forEach((block) => {
    const missing = FILTER_PARTS.filter(([, selector]) => !block.querySelector(selector))
      .map(([label]) => label);
    if (missing.length) {
      problems.push([block, 'Filter block: this container needs a Top content, a Filter search and a Cards '
        + `container nested inside it. Missing: ${missing.join(', ')}. Check which container carries each style.`]);
    }
  });
  root.querySelectorAll('.ac-core-filter').forEach((filter) => {
    if (filter.closest(`${FILTER_BLOCK}.block-teasers-with-filter--initialized`)) return;
    const missing = [['Title', '.title'], ['Text', '.text']]
      .filter(([, selector]) => !filter.querySelector(`.cmp-container ${selector}`)).map(([label]) => label);
    if (missing.length) {
      problems.push([filter, 'Filter search: this container needs a Title (the placeholder) and a Text '
        + `(the "no results" message). Missing: ${missing.join(', ')}.`]);
    }
  });
  return problems;
}

// Hook: maskStartedCarousels. The Splide carousel controller of a container style selects every
// element with the class and would wrap the slides of a carousel that is already mounted a second time. A mounted
// carousel is hidden from it by its class for the length of the start, which is synchronous, and
// gets the class back.
const CAROUSEL_CLASS = 'ac-core-splide-carousel';
const CAROUSEL_STARTED = 'ds-splide-carousel--initialized';

/**
 * @param {() => void} run
 * @param {Document} doc
 */
function maskStartedCarousels(run, doc) {
  const mounted = [...doc.querySelectorAll(`.${CAROUSEL_CLASS}.${CAROUSEL_STARTED}`)];
  mounted.forEach((el) => el.classList.remove(CAROUSEL_CLASS));
  try {
    run();
  } finally {
    mounted.forEach((el) => el.classList.add(CAROUSEL_CLASS));
  }
}

const HOOKS = {
  teasersWithFilterStructure: { check: structureProblems },
  maskStartedCarousels: { around: maskStartedCarousels },
};

// An element and a message already printed: a run prints a problem once, however many runs see it.
const printed = new WeakMap();

// Resolves once nothing has been added to or removed from `root` for `quiet` ms (or after `limit`
// ms, so a page that keeps changing still starts). The Table of contents block redraws its list a
// moment after the page changes, because it reads the headings of blocks that decorate after it.
/**
 * @param {Element} root
 * @param {number} [quiet]
 * @param {number} [limit]
 * @returns {Promise<void>}
 */
function whenQuiet(root, quiet = QUIET_MS, limit = QUIET_LIMIT_MS) {
  return new Promise((resolve) => {
    /** @type {ReturnType<typeof setTimeout>} */
    let timer;
    /** @type {ReturnType<typeof setTimeout>} */
    let cap;
    const view = /** @type {any} */ (root.ownerDocument.defaultView);
    const observer = new view.MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(done, quiet);
    });
    function done() {
      clearTimeout(timer);
      clearTimeout(cap);
      observer.disconnect();
      resolve();
    }
    cap = setTimeout(done, limit);
    timer = setTimeout(done, quiet);
    observer.observe(root, { childList: true, subtree: true });
  });
}

// Runs `run` with the topmost hidden ancestor of `element` made visible. A page keeps a block
// hidden until it has loaded, and a controller that copies labels with innerText gets "" from text
// inside a hidden element. The controllers run synchronously, so the ancestor is shown for their
// run only and no frame is painted with it. Nothing is changed when nothing is hidden.
/**
 * @param {Element | null} element
 * @param {() => void} run
 */
function whileShown(element, run) {
  const view = element && element.ownerDocument.defaultView;
  /** @type {HTMLElement | null} */
  let top = null;
  if (view) {
    for (let el = /** @type {HTMLElement | null} */ (element); el && view.getComputedStyle(el).visibility === 'hidden'; el = el.parentElement) {
      top = el;
    }
  }
  if (!top) {
    run();
    return;
  }
  const value = top.style.getPropertyValue('visibility');
  const priority = top.style.getPropertyPriority('visibility');
  top.style.setProperty('visibility', 'visible');
  try {
    run();
  } finally {
    if (value) top.style.setProperty('visibility', value, priority);
    else top.style.removeProperty('visibility');
  }
}

/**
 * @param {unknown} value
 * @param {Document} doc
 */
function resolveValue(value, doc) {
  if (!value || typeof value !== 'object' || !('live' in value)) return value;
  const { selector, property, fallback } = /** @type {LiveValue} */ (value).live;
  const element = /** @type {Record<string, unknown> | null} */ (/** @type {unknown} */ (doc.querySelector(selector)));
  return element?.[property] ?? fallback;
}

// The options object of a controller. A live value is a getter, so it is read each time the
// controller reads the option, not when the controller is made.
/**
 * @param {Record<string, unknown> | undefined} base
 * @param {Record<string, unknown> | undefined} set
 * @param {Document} doc
 */
function buildOptions(base, set, doc) {
  /** @type {Record<string, unknown>} */
  const options = {};
  Object.entries({ ...base, ...set }).forEach(([key, value]) => {
    if (value && typeof value === 'object' && 'live' in value) {
      Object.defineProperty(options, key, { enumerable: true, get: () => resolveValue(value, doc) });
    } else {
      options[key] = value;
    }
  });
  return options;
}

/**
 * A controller may start asynchronously. Its promise is not awaited, so the other controllers do not wait
 * for it; a rejection is reported like any other failure to start.
 * @param {PageControllerEntry} entry
 * @param {unknown} result what the call returned
 */
function reportRejection(entry, result) {
  if (result && typeof (/** @type {Promise<unknown>} */ (result).catch) === 'function') {
    /** @type {Promise<unknown>} */ (result).catch((e) => {
      // eslint-disable-next-line no-console
      console.warn(`[page-controllers] ${entry.name} did not start`, e);
    });
  }
}

/**
 * @param {PageControllerEntry} entry
 * @param {any[]} modules the modules of `entry.controllers`, in the same order
 * @param {Document} doc
 */
function runControllers(entry, modules, doc) {
  const sets = entry.instances || [undefined];
  entry.controllers.forEach((spec, index) => {
    const Controller = modules[index][spec.export];
    if (typeof Controller !== 'function') throw new Error(`${spec.module} has no export ${spec.export}`);
    const call = spec.call || 'init';
    sets.forEach((set) => {
      const args = entry.options || set ? [buildOptions(entry.options, set, doc)] : [];
      const controller = new Controller(...args);
      if (call === 'init') {
        reportRejection(entry, controller.init());
      } else if (call !== 'constructor') {
        doc.querySelectorAll(entry.selector).forEach((el) => reportRejection(entry, controller[call.method](el)));
      }
    });
  });
}

/**
 * @param {PageControllerEntry} entry
 * @param {Document | Element} root
 * @param {Document} doc
 */
async function startEntry(entry, root, doc) {
  const hook = entry.hook ? HOOKS[entry.hook] : null;
  if (entry.hook && !hook) throw new Error(`unknown hook ${entry.hook}`);
  // The first match in the document: a controller finds its elements in the document, not in `root`.
  const first = doc.querySelector(entry.selector) || root.querySelector(entry.selector);
  const once = entry.startOnce;
  const mark = once && once !== 'controller' ? once : null;
  const markOn = /** @type {Element} */ (mark && (mark.on === 'document' ? doc.documentElement : first));
  if (mark && markOn.hasAttribute(mark.attribute)) return;
  const waitFor = entry.startWhen?.waitFor;
  if (waitFor && !waitFor.every((selector) => first && first.querySelector(selector))) return;
  if (mark) markOn.setAttribute(mark.attribute, '');

  // Imported together, started in order.
  const modules = await Promise.all(entry.controllers.map((spec) => import(spec.module)));

  const start = () => {
    const match = doc.querySelector(entry.selector);
    // A controller that marks its own root has nothing to do when the root is gone.
    if (once === 'controller' && !match) return;
    const before = match ? [...match.classList] : [];
    whileShown(entry.showWhileStarting ? match : null, () => {
      if (hook && 'around' in hook) hook.around(() => runControllers(entry, modules, doc), doc);
      else runControllers(entry, modules, doc);
    });
    const after = (once === 'controller' && match) ? [...match.classList] : null;
    // A controller that marks its own root has started when the mark is new.
    if (after && after.every((name) => before.includes(name))) return;
    const { afterStart } = entry;
    if (!afterStart || (afterStart.when && !doc.querySelector(afterStart.when))) return;
    const detail = afterStart.detail && Object.fromEntries(
      Object.entries(afterStart.detail).map(([key, value]) => [key, resolveValue(value, doc)]),
    );
    doc.dispatchEvent(new /** @type {any} */ (doc.defaultView).CustomEvent(afterStart.event, { detail }));
  };

  if (entry.startWhen?.quiet) {
    // Not awaited: the other entries do not wait for the page to be quiet.
    whenQuiet(doc.querySelector('main') || doc.body).then(start).catch((e) => {
      // eslint-disable-next-line no-console
      console.warn(`[page-controllers] ${entry.name} did not start`, e);
    });
    return;
  }
  start();
}

/**
 * Starts the entries of `list` that apply to `root`.
 * @param {PageControllerEntry[]} list
 * @param {Document | Element} [root]
 * @param {PageControllerOptions} [options]
 * @returns {Promise<void>} Settles when every entry has started, except the entries that wait for a quiet page.
 */
export async function runPageControllers(list, root = document, options = {}) {
  const doc = /** @type {Document} */ (root.ownerDocument || root);

  /** @type {PageControllerProblem[]} */
  let problems = [];
  try {
    problems = list.flatMap((entry) => {
      const hook = entry.hook ? HOOKS[entry.hook] : null;
      return hook && 'check' in hook
        ? hook.check(root).map(([element, message]) => ({ element, message, source: entry.name }))
        : [];
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[page-controllers] structure check failed', e);
  }
  problems.forEach(({ element, message, source }) => {
    if (printed.get(element) === message) return;
    printed.set(element, message);
    // eslint-disable-next-line no-console
    console.warn(`[${source}] ${message}`, element);
  });
  if (options.onWarning) {
    try {
      options.onWarning(problems);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[page-controllers] onWarning failed', e);
    }
  }

  await Promise.all(list.map(async (entry) => {
    if ((options.inEditor && entry.inEditor !== true) || !root.querySelector(entry.selector)) return;
    try {
      await startEntry(entry, root, doc);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`[page-controllers] ${entry.name} did not start`, e);
    }
  }));
}

export default runPageControllers;
