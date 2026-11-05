// Swaps an authored <picture> (real responsive <source> sets) back in for the
// plain <img> Teaser() renders. Self-contained, DOM APIs only. Call after
// Teaser() has rendered a card and before it is appended. renderTeaserFamily
// (eds-family.js) calls it for a wrapper that takes content.picture.

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
