// Swaps an authored <picture> (real responsive <source> sets) back in for the
// plain <img> Teaser() renders. Self-contained, DOM APIs only. Call after
// Teaser() has rendered a card and before it is appended. renderTeaserFamily
// (eds-family.js) calls it for a wrapper that takes content.picture.
// prioritiseFirstImage marks the page's first image as the one to fetch first.

/**
 * Teaser() always renders a plain <img>, so an authored <picture>
 * (responsive sources) needs to be swapped back in after the fact, carrying
 * over the <img>'s own class. The class must be added to the picture's own
 * <img> (the element actually kept) rather than to Teaser's placeholder
 * <img> (which replaceChild() below discards) -- adding it to the
 * discarded element leaves the kept one with no class at all, so none of
 * the DS repo's own `.cmp-image__image { object-fit: cover; ... }` rules
 * match it and it falls back to bare browser defaults.
 */
export function patchPicture(imageCell, card) {
  const picture = imageCell?.querySelector('picture');
  if (!picture) return;
  const el = card.querySelector('.cmp-image');
  if (!el) return;
  const img = el.querySelector('img');
  el.replaceChild(picture, img);
  picture.querySelector('img')?.classList.add('cmp-image__image');
}

/**
 * An authored <picture> carries `loading="lazy"`, and EDS (aem.js) flips the first image of the
 * first section to eager only after every block of that section has loaded. A banner at the top
 * of the page would then start its image later than the plain <img> it replaces. Called on a
 * picture that is still in the page: when its <img> is the first image of the first section of
 * <main> (the one aem.js treats as the LCP candidate), the <img> gets `loading="eager"` and
 * `fetchpriority="high"`. Any other picture is left as authored.
 */
export function prioritiseFirstImage(picture) {
  const img = picture?.querySelector('img');
  const section = picture?.closest('main > div');
  if (!img || !section || section !== section.parentElement.firstElementChild) return;
  if (section.querySelector('img') !== img) return;
  img.setAttribute('loading', 'eager');
  img.setAttribute('fetchpriority', 'high');
}
