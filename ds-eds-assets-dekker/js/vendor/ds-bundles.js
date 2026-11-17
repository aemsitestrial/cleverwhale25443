/**
 * Loads the design system's CSS bundles as parts.
 *
 * <assets>/css/bundles.json lists the parts (css/graph/<part>.css, each holding only its own
 * rules), the order of all parts, and for each bundle the parts it is made of. A part used by
 * several bundles is one stylesheet link, added once. The cascade follows the order of the links
 * in the document, so each missing part's link is inserted at once at its place in the manifest
 * order: before the first design system link that comes later in the order, else after the last
 * design system link, else at the end of head (after styles.css). Links already in the document
 * are never moved, cloned or waited for, so every pair of parts is in manifest order on every
 * page, whichever blocks ask first. loadBundle resolves when every part of the bundle has loaded
 * and rejects when one fails or the bundle is unknown; a bundle without parts resolves at once.
 *
 * A site can hold the css of more than one package, each in its own folder with its own
 * bundles.json, parts and order. loadBundle(name, assets) takes the folder, relative to the code
 * base, as its second argument; it is the site's to name, because the package does not know
 * where it was installed. One manifest is fetched per folder and kept for the page. Every link carries data-ds-part (the part) and data-ds-assets (the
 * folder), and the position search, the adoption of hand-written links and the lookup of a part
 * only consider links of the same folder, because both packages ship parts of the same name. A
 * page that loads parts of both folders keeps each folder's links in that folder's manifest
 * order; a folder with no link yet is appended at the end of head.
 *
 * Module state (the manifests, the bundles asked for) is per copy of this file, so a page's code
 * loads one copy: the package of the page's brand.
 *
 * A name can be a bundle name (card), a file name (card.css) or a path (bundles/card.css).
 */
// One manifest promise per asset folder.
const manifestPromises = new Map();
// One promise per stylesheet link; an adopted or inserted link is looked up here, not by href.
const loads = new WeakMap();

// Bundles asked for and not yet loaded.
const pending = new Set();

// For tests: the manifest is fetched once per page, so a test that swaps the page starts over.
export function resetForTests() {
  manifestPromises.clear();
  pending.clear();
}

const codeBase = () => window.hlx?.codeBasePath || '';

function loadManifest(assets) {
  if (!manifestPromises.has(assets)) {
    const promise = fetch(`${codeBase()}/${assets}/css/bundles.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`ds-bundles: ${assets}/css/bundles.json answered ${response.status}`);
        return response.json();
      })
      .catch((error) => {
        manifestPromises.delete(assets); // a later call tries again
        throw error;
      });
    manifestPromises.set(assets, promise);
  }
  return manifestPromises.get(assets);
}

function watch(link) {
  const promise = new Promise((resolve, reject) => {
    link.addEventListener('load', () => resolve(), { once: true });
    link.addEventListener('error', () => reject(new Error(`ds-bundles: ${link.getAttribute('href')} failed to load`)), { once: true });
  });
  loads.set(link, promise);
  return promise;
}

// The design system links of one asset folder, in document order.
const linksOf = (assets) => [...document.head.querySelectorAll('link[data-ds-part]')]
  .filter((link) => link.dataset.dsAssets === assets);

// Where a part's link goes, by the manifest order of the links of its own folder already there.
function insertLink(link, part, order, assets) {
  const own = order.indexOf(part);
  const known = linksOf(assets);
  const later = known.find((other) => order.indexOf(other.dataset.dsPart) > own);
  if (later) later.before(link);
  else if (known.length) known[known.length - 1].after(link);
  else document.head.append(link);
}

const partHref = (part, manifest, assets) => `${codeBase()}/${assets}/css/${manifest.parts[part].file}`;

// A part link that is in head without the attributes (written by hand or by an earlier loader) is
// marked first, so it counts as a position when the other parts are placed.
function adoptLinks(manifest, assets) {
  const byHref = new Map(Object.keys(manifest.parts)
    .map((part) => [partHref(part, manifest, assets), part]));
  document.head.querySelectorAll('link[rel="stylesheet"]:not([data-ds-part])').forEach((link) => {
    const part = byHref.get(link.getAttribute('href'));
    if (part) {
      link.dataset.dsPart = part;
      link.dataset.dsAssets = assets;
    }
  });
}

function loadPart(part, manifest, assets) {
  const present = linksOf(assets).find((link) => link.dataset.dsPart === part);
  if (present) {
    if (loads.has(present)) return loads.get(present);
    // A link this module did not create was in the page before it ran, so its load or error event
    // may be past and waiting for one can hang for good. aem.js loadCSS treats an existing link the
    // same way.
    return Promise.resolve();
  }
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = partHref(part, manifest, assets);
  link.dataset.dsPart = part;
  link.dataset.dsAssets = assets;
  const promise = watch(link);
  insertLink(link, part, manifest.order, assets);
  return promise;
}

const bundleName = (name) => String(name).split('/').pop().replace(/\.css$/, '');

async function load(name, assets) {
  const manifest = await loadManifest(assets);
  const bundle = manifest.bundles[bundleName(name)];
  if (!bundle) throw new Error(`ds-bundles: no bundle named ${bundleName(name)} in ${assets}`);
  adoptLinks(manifest, assets);
  // No await from here to the end: two blocks asking at once cannot interleave in this section.
  const loading = bundle.parts.map((part) => loadPart(part, manifest, assets));
  return Promise.all(loading).then(() => undefined);
}

export function loadBundle(name, assets) {
  if (!assets) throw new Error(`ds-bundles: loadBundle(${name}) needs the asset folder as its second argument`);
  const promise = load(name, assets);
  pending.add(promise);
  const done = () => pending.delete(promise);
  promise.then(done, done);
  return promise;
}

// Resolves when every bundle asked for so far, and any asked for while waiting, has loaded or
// failed. A block that starts loadBundle without waiting for it is decorated before its stylesheet
// is in; a section that waits for this is shown styled.
export async function bundlesSettled() {
  while (pending.size) {
    // eslint-disable-next-line no-await-in-loop
    await Promise.allSettled([...pending]);
  }
}

// Resolves when every foundational stylesheet link head.html inserted (data-ds-foundational) has
// loaded or failed. head.html marks a link data-settled when its load or error comes, so one that
// came before this ran is not missed. link.sheet says nothing: a stylesheet that imports others has
// its sheet before its load event, and the page is not styled until the event. A page whose
// head.html does not insert the links (they are in the markup and block the first paint) has none,
// and this resolves at once. There is no timeout: a link that errors settles, so a failed
// stylesheet does not hold the page.
export function foundationalSettled() {
  const links = [...document.head.querySelectorAll('link[data-ds-foundational]')];
  return Promise.all(links.map((link) => new Promise((resolve) => {
    if (link.dataset.settled !== undefined) {
      resolve();
      return;
    }
    link.addEventListener('load', resolve, { once: true });
    link.addEventListener('error', resolve, { once: true });
  }))).then(() => undefined);
}

export function loadBundles(names, assets) {
  return Promise.all(names.map((name) => loadBundle(name, assets)));
}
