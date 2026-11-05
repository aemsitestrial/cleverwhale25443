export const Fragment = Symbol.for('ds.fragment');

// Tracks every Node this runtime has already appended once. A child node is
// appended by moving it, not cloning it: a real DOM node has one parent, and
// a move -- unlike a clone -- keeps its addEventListener handlers. But some
// components (tabs.tsx's explicit-`children` branch) pass the SAME node
// reference into multiple sibling slots -- a pattern
// React handles fine (one JSX descriptor, re-rendered per slot) but a real
// DOM node cannot: moving it repeatedly leaves only the last slot holding
// it, silently dropping the other slots' content. A WeakSet keyed on node
// identity distinguishes "first time dom-runtime places this node" (move,
// which keeps its listeners) from "this exact node again" (clone, so every
// slot gets its content) without losing listeners in the normal,
// single-placement case.
const placedNodes = new WeakSet();

// aem-core-lib's StyleWrapper (libs/aem-core-lib/src/assets/components/StyleWrapper.tsx)
// wraps brand teaser/card/banner/quote components in React.Suspense+React.lazy purely to
// lazy-load the component's own SCSS for React/SPA consumers -- a concern EDS's static CSS
// delivery doesn't have. StyleWrapper's own JSX writes <React.Suspense> as a member expression,
// which the importSource swap can't redirect (only bare JSX identifiers are redirected -- same
// bug class as the React.Fragment exception the replication guide documents, Section 3.1): the
// factory would receive React's real, unredirected Suspense value as `type`, which isn't a
// string or a function this factory can build.
//
// Tried first: importing the real StyleWrapper binding into this file and comparing by
// reference (`type === StyleWrapper`), matching how `Fragment` above is compared. Rejected --
// StyleWrapper is defined in aem-core-lib, a package that itself imports this file's jsx/jsxs
// via the importSource swap; dom-runtime is marked `external` in every build-dom target (never
// bundled), so a plain `import { StyleWrapper } from '@ac-brandsframework/aem-core-lib'` here
// would only resolve at actual runtime, via that package's own `main`, which points at the
// REACT build, not the DOM build cross-package resolution (rollup-dom-resolve.js) aliases
// component source to. The object this file would import and the DOM-compiled StyleWrapper
// function a caller actually passes as `type` would never be the same reference -- the
// interception would silently never fire, and the un-fixed <React.Suspense> line would still
// run. `Fragment` above avoids this because it's this file's OWN symbol, consumed by aem-core-lib
// (one-directional); StyleWrapper is the reverse direction, so reference identity isn't
// available without a real circular package dependency.
//
// Structural name check instead: every call site compiles `<StyleWrapper ...>` to
// `jsx(StyleWrapper, props)` where `StyleWrapper` is the actual function value from whichever
// aem-core-lib build produced it -- Babel's JSX transform doesn't rename it, so `.name` survives
// compilation intact regardless of which package or build target the caller resolved it from.
// Skip calling it and build a Fragment around its children instead, so StyleWrapper's own
// <React.Suspense> body never runs.
function isStyleWrapper(type) {
  return typeof type === 'function' && type.name === 'StyleWrapper';
}

function build(type, props) {
  const { children, className, dangerouslySetInnerHTML, style, ...rest } = props || {};

  if (isStyleWrapper(type)) return build(Fragment, { children: (props || {}).children });

  if (typeof type === 'function') return type(props);

  const el = type === Fragment
    ? document.createDocumentFragment()
    : document.createElement(type);

  if (className) el.setAttribute('class', className);
  if (style) Object.assign(el.style, style);
  if (dangerouslySetInnerHTML) el.innerHTML = dangerouslySetInnerHTML.__html;

  for (const [k, v] of Object.entries(rest)) {
    if (v == null) continue;
    if (k === 'muted') { el.muted = !!v; continue; }
    if (k.startsWith('on') && typeof v === 'function') { el.addEventListener(k.slice(2).toLowerCase(), v); continue; }
    if (k.startsWith('aria-') && typeof v === 'boolean') { el.setAttribute(k, String(v)); continue; }
    if (v === false) continue;
    el.setAttribute(k, v === true ? '' : String(v));
  }

  for (const child of [children].flat(Infinity)) {
    if (child == null || child === false || child === '') continue;
    if (child instanceof Node) {
      // First placement of this exact node: move it (append() does this
      // natively), which is what keeps its listeners intact.
      // Any placement after the first is the same node reused in a second
      // slot -- move would just relocate it again and empty the first
      // slot, so clone here instead. (The clone won't carry
      // addEventListener handlers, same as any cloneNode(true) -- but for
      // this reused-node case, matching structure across every slot is the
      // requirement; keeping listeners only matters for a node's ONE placement,
      // which the `move` branch below still honors.)
      if (placedNodes.has(child)) {
        el.append(child.cloneNode(true));
      } else {
        placedNodes.add(child);
        el.append(child);
      }
    } else {
      el.append(String(child));
    }
  }
  return el;
}

export const jsx  = (type, props) => build(type, props);
export const jsxs = (type, props) => build(type, props);

export function createElement(type, props, ...children) {
  return children.length
    ? build(type, { ...props, children: children.length === 1 ? children[0] : children })
    : build(type, props);
}
