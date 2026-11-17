/**
 * Shared row->map assembly, used by any container block whose real DS
 * component takes its N authored items pre-assembled into a single
 * `:itemsOrder`/`:items` map and is called ONCE (e.g. a carousel's
 * Carousel()), rather than the one-call-per-row shape (N independently-built
 * DOM elements appended in a loop). Kept generic and reusable here rather
 * than inlined into one block.
 *
 * Takes `entries`, an array of `{ id, props }` in authoring order (id
 * unique per entry, props the object the target component expects for
 * that one item -- this helper doesn't know or care what shape props
 * is), and returns `{ ':itemsOrder': [...ids], ':items': { [id]: props } }`
 * -- exactly the two keys AemCarouselProps (and AccordionProps/TabsProps,
 * which share the same `:itemsOrder`/`:items` convention) expect.
 *
 * @template P
 * @param {ReadonlyArray<{ id: string, props: P }>} entries
 * @returns {{ ':itemsOrder': string[], ':items': Record<string, P> }}
 */
export default function buildItemsMap(entries) {
  const itemsOrder = entries.map((entry) => entry.id);
  /** @type {Record<string, P>} */
  const items = {};
  entries.forEach((entry) => {
    items[entry.id] = entry.props;
  });
  return { ':itemsOrder': itemsOrder, ':items': items };
}
