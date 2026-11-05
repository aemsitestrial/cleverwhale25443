import {
  fieldsByName, valuesByName, editorAttributes, recordApplied,
} from './field-rows.js';
import { dropHidden } from './model-conditions.js';

// What the blocks share when they hand their fields to the design system's render wrappers, which
// take design-system names only: content props, option list names and the attributes of editable
// props.

/**
 * @template {Record<string, any>} C
 * @template {Record<string, any>} O
 * @template {string} E
 * @typedef {import('./eds-component.js').RenderInput<C, O, E>} Input
 */

/**
 * @template {Record<string, any>} C
 * @typedef {import('./eds-component.js').ContentPath<C>} Path
 */

/**
 * What a block declares about its wiring to a design-system wrapper, checked against the types
 * the wrapper ships: a content field can only name a path of the wrapper's content, an option
 * field only a list the wrapper takes, and an editable prop only one it renders.
 *
 * @template {Record<string, any>} C the wrapper's content
 * @template {Record<string, any>} O the wrapper's options
 * @template {Path<C>} E
 * @typedef {object} Wiring
 * @property {Record<string, Path<C>>} contentFields
 * @property {Record<string, { readonly list: keyof O & string }>} optionFields
 * @property {ReadonlyArray<E>} editableProps
 */

function setPath(target, path, value) {
  const keys = path.split('.');
  const last = keys.pop();
  const parent = keys.reduce((node, key, index) => {
    if (!node[key]) node[key] = /^\d+$/.test(keys[index + 1] ?? last) ? [] : {};
    return node[key];
  }, target);
  parent[last] = value;
}

/**
 * The design system's input, built from a block's fields. It carries design-system names only.
 *
 *   fields         the result of fieldsByName
 *   values         the fields' values, with the option fields the model hides already dropped
 *                  (dropHidden). A dropped field's key is absent, an empty one's is undefined.
 *   contentFields  field -> the content prop it fills. A path names a place inside a prop:
 *                  'actions.0.title' is the title of the first action.
 *   optionFields   field -> { list } from the block's generated <block>-fields.js. After the
 *                  hidden fields are dropped, at most one field is left for a list (the build
 *                  checks the models), so `options` is a plain list -> value map.
 *   editableProps  the content props the design system renders an editable element for; only
 *                  their fields' editor attributes are taken off the rows
 */
/**
 * @template {Record<string, any>} C
 * @template {Record<string, any>} O
 * @template {Path<C>} E
 * @param {Record<string, any>} fields
 * @param {Record<string, any>} values
 * @param {Wiring<C, O, E>} wiring
 * @returns {Input<C, O, E>}
 */
export function componentInput(fields, values, {
  contentFields, optionFields, editableProps,
}) {
  const content = /** @type {Record<string, any>} */ ({});
  const options = /** @type {Record<string, any>} */ ({});
  const editable = /** @type {Record<string, any>} */ ({});
  Object.entries(contentFields).filter(([field]) => field in values)
    .forEach(([field, path]) => {
      if (values[field] !== undefined) setPath(content, path, values[field]);
      if (!editableProps.includes(/** @type {any} */ (path))) return;
      const attributes = editorAttributes(fields[field]?.row);
      if (attributes) editable[path] = attributes;
    });
  Object.entries(optionFields).forEach(([field, { list }]) => {
    if (values[field] !== undefined) options[list] = values[field];
  });
  return /** @type {any} */ ({ content, options, editable });
}

// The fields' values with the option fields the model hides dropped: several fields can take one
// option list, and only the one the model shows is the choice. A content field is passed as it was
// authored, hidden or not. `typeField` names the field that holds the family's type, if any;
// content saved without one is judged as the default type, because the model's conditions name
// that type for the fields they show.
export function shownValues(stored, {
  optionFields, conditions, typeField, defaultType,
}) {
  const shown = dropHidden(
    typeField ? { ...stored, [typeField]: stored[typeField] ?? defaultType } : stored,
    conditions,
  );
  return Object.fromEntries(Object.entries(stored)
    .filter(([field]) => !(field in optionFields) || field in shown)
    .map(([field, value]) => [field, field === typeField ? shown[field] : value]));
}

/**
 * Renders one component from a block's rows: reads the cells, hands them to `render` (the design
 * system's wrapper) under design-system names and records the fields for the test template's
 * panel. The block moves its own instrumentation onto the rendered root.
 *
 *   names, kinds   the fields in positional order and how each cell is read (fieldsByName,
 *                  valuesByName)
 *   contentFields, optionFields, editableProps   see componentInput
 *   conditions     the block model's FIELD_CONDITIONS: the option fields it hides are dropped
 *                  before the design system is called
 */
/**
 * @template {Record<string, any>} C
 * @template {Record<string, any>} O
 * @template {Path<C>} E
 * @param {Array<any>} rows
 * @param {Wiring<C, O, E> & {
 *   render: (input: Input<C, O, E>) => HTMLElement | undefined,
 *   names: string[], kinds: Record<string, string>, conditions: Record<string, any>,
 * }} block
 */
export function renderComponentBlock(rows, {
  render, names, kinds, contentFields, optionFields, conditions, editableProps,
}) {
  const fields = fieldsByName(rows, names);
  const values = shownValues(valuesByName(fields, kinds), { optionFields, conditions });
  const root = render(componentInput(fields, values, {
    contentFields, optionFields, editableProps,
  }));
  // A wrapper that renders nothing (a refused address, for instance) leaves the block empty.
  if (!root) return undefined;
  recordApplied(root, values, {
    ...Object.fromEntries(Object.entries(contentFields)
      .map(([field, path]) => [field, `content:${path}`])),
    ...Object.fromEntries(Object.entries(optionFields)
      .map(([field, { list }]) => [field, `option:${list}`])),
  });
  return root;
}
