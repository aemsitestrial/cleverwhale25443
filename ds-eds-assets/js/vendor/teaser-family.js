import { fieldsByName, valuesByName, recordApplied } from './field-rows.js';
import { componentInput, shownValues } from './component-block.js';

// What the Teaser-based blocks share when they hand their fields to the design system's family
// wrappers, which take design-system names only. The field names are the site's: a block passes
// its own field -> content prop table as `contentFields`.

/** @typedef {import('./eds-family.js').TeaserContent} TeaserContent */
/** @typedef {import('./component-block.js').Path<TeaserContent>} TeaserPath */

// The field whose content prop is `path`, in a block's field -> content prop table.
const fieldOf = (contentFields, path) => Object.keys(contentFields)
  .find((field) => contentFields[field] === path);

// The delivered page folds the heading element into the title: the editor's pipeline turns a
// `title` field with a `titleType` field beside it into one cell holding <hN>, and writes no
// titleType row. The level is read back from that tag; a block with no heading in the cell keeps
// any titleType row it was given.
const HEADING_TAG = /^h[1-5]$/i;
function headingLevel(cell) {
  const tag = cell?.firstElementChild?.tagName;
  return tag && HEADING_TAG.test(tag) ? tag.toLowerCase() : undefined;
}

/**
 * The design system's input for a Teaser-based block: componentInput with the block's content
 * fields, and the <picture> the image field holds when it holds one.
 */
/**
 * @template {Record<string, any>} O
 * @template {TeaserPath} E
 * @param {Record<string, any>} fields
 * @param {Record<string, any>} values
 * @param {{
 *   contentFields: Record<string, TeaserPath>,
 *   optionFields: Record<string, { readonly list: keyof O & string }>,
 *   editableProps: ReadonlyArray<E>,
 * }} wiring
 * @returns {import('./component-block.js').Input<TeaserContent, O, E>}
 */
export function teaserFamilyInput(fields, values, { contentFields, optionFields, editableProps }) {
  const input = componentInput(fields, values, { contentFields, optionFields, editableProps });
  const imageField = fieldOf(contentFields, 'imagePath');
  const picture = imageField && imageField in values && fields[imageField]?.row?.querySelector('picture');
  if (picture) input.content.picture = picture;
  return input;
}

/**
 * Renders one family member from a block's rows: reads the cells, hands them to `render` (the
 * design system's wrapper) under design-system names and records the fields for the test
 * template's panel. The block moves its own instrumentation onto the rendered root.
 *
 *   names, kinds   the fields in positional order and how each cell is read (fieldsByName,
 *                  valuesByName)
 *   contentFields  field -> the content prop it fills (see componentInput); the block's own table
 *   optionFields   the block model's OPTION_FIELDS in its generated <block>-fields.js
 *   conditions     the block model's FIELD_CONDITIONS: the option fields it hides are dropped
 *                  before the design system is called
 *   editableProps  the wrapper's exported editable props
 *   typeMeta       the family's typeMeta from the package's options module
 *   loadBundle     optional: (file) -> loads a bundle of the package
 */
/**
 * @template {Record<string, any>} O
 * @template {TeaserPath} E
 * @param {Array<any>} rows
 * @param {{
 *   render: (input: import('./component-block.js').Input<TeaserContent, O, E>) => HTMLElement,
 *   names: string[], kinds: Record<string, string>, conditions: Record<string, any>,
 *   contentFields: Record<string, TeaserPath>,
 *   optionFields: Record<string, { readonly list: keyof O & string }>,
 *   editableProps: ReadonlyArray<E>,
 *   typeMeta: { list: string, default: string },
 *   loadBundle?: (file: string) => unknown,
 * }} block
 */
export function renderTeaserFamilyBlock(rows, {
  render, names, kinds, contentFields, optionFields, conditions, editableProps, typeMeta, loadBundle,
}) {
  const fields = fieldsByName(rows, names);
  const stored = valuesByName(fields, kinds);
  const titleField = fieldOf(contentFields, 'title');
  const levelField = fieldOf(contentFields, 'titleTag');
  const titleLevel = titleField && levelField && headingLevel(fields[titleField]?.cell);
  if (titleLevel) stored[levelField] = titleLevel;
  // Content saved without a type is the design system's default type, and the model's conditions
  // name that type for the fields it shows, so they are judged with the default in place.
  const typeField = Object.keys(optionFields)
    .find((field) => optionFields[field].list === typeMeta.list);
  const values = shownValues(stored, {
    optionFields, conditions, typeField, defaultType: typeMeta.default,
  });
  const root = render({
    ...teaserFamilyInput(fields, values, { contentFields, optionFields, editableProps }),
    ...(loadBundle && { loadBundle }),
  });
  recordApplied(root, values, {
    ...Object.fromEntries(Object.entries(contentFields)
      .map(([field, path]) => [field, `content:${path}`])),
    ...Object.fromEntries(Object.entries(optionFields)
      .map(([field, { list }]) => [field, `option:${list}`])),
  });
  return root;
}
