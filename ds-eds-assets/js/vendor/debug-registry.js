/**
 * Per-render field data for a page's field hover panel. A renderer that reads a block's fields
 * records what it read against the element it rendered; the page's own code reads it back with
 * getRecord().
 *
 * Recording is gated on a body.test (or body.test-off) class, which the site sets from the
 * page's template metadata before blocks decorate. Pages without the test template run one
 * class check per rendered root and keep no data, and nothing is ever written to the markup.
 */
const records = new WeakMap();
const itemBlocks = new WeakMap();

function testPageActive() {
  if (typeof document === 'undefined') return false;
  const list = document.body?.classList;
  return !!list && (list.contains('test') || list.contains('test-off'));
}

export function recordFields(root, values, FIELDS) {
  if (!testPageActive()) return;
  records.set(root, {
    values: { ...values },
    fields: FIELDS.map(({
      name, read, apply, selector,
    }) => ({
      name, read, apply, selector,
    })),
    classes: [...root.classList],
  });
}

export function getRecord(root) {
  return records.get(root);
}

/**
 * A container renders its items without a .block of their own, so the container says which block
 * each item is (for instance a card) and the panel can link that block's Storybook story.
 */
export function noteItemBlock(root, blockName) {
  if (!testPageActive()) return;
  itemBlocks.set(root, blockName);
}

export function getItemBlock(root) {
  return itemBlocks.get(root);
}
