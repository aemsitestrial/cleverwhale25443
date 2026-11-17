/**
 * Page-wide unique DOM id generator, shared by every block renderer.
 *
 * One counter per prefix, held in this module's own scope. ES modules are
 * cached by URL, so every renderer that imports this file shares the same
 * counters -- including two different renderer files that happen to use
 * the same prefix (two text renderers that both call uniqueId('text')), and
 * two instances of the same block on one page (each card or list-item render call advances the same counter,
 * rather than each block instance restarting its own loop index at 0).
 */
const counts = new Map();

export default function uniqueId(prefix) {
  const n = counts.get(prefix) ?? 0;
  counts.set(prefix, n + 1);
  return `${prefix}-${n}`;
}
