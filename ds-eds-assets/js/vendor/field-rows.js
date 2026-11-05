import { moveInstrumentation } from './move-instrumentation.js';
import { recordFields } from './debug-registry.js';

// Helpers for blocks whose rows come from an xwalk model with "key-value": true: every row is
// <div><div>fieldName</div><div>value</div></div>, and the editor writes no row for an empty field.

const BLOCK_RESOURCE_ATTRS = ['data-aue-resource', 'data-aue-type', 'data-aue-behavior', 'data-aue-model', 'data-aue-label', 'data-aue-component'];

const nameOf = (row) => row.children[0]?.textContent.trim();

// A flat component's editor resource can sit on an inner wrapper instead of on the block, which
// the editor's live update does not find. It is copied onto the block, and the wrapper is
// returned so the caller can move its instrumentation onto what it renders.
export function blockRows(block) {
  const first = block.firstElementChild;
  const wrapper = first?.hasAttribute('data-aue-resource') ? first : null;
  if (wrapper && !block.hasAttribute('data-aue-resource')) {
    BLOCK_RESOURCE_ATTRS.forEach((attr) => {
      if (wrapper.hasAttribute(attr)) block.setAttribute(attr, wrapper.getAttribute(attr));
    });
  }
  return { rows: [...(wrapper || block).children], wrapper };
}

// Separates the rows of the fields the design system defines from the rows of the EDS-only fields
// named in `edsNames`. `eds` maps each EDS field name to its value cell.
export function splitRows(rows, edsNames) {
  const eds = {};
  const dsRows = rows.filter((row) => {
    const name = nameOf(row);
    if (!edsNames.includes(name)) return true;
    [, eds[name]] = row.children;
    return false;
  });
  return { dsRows, eds };
}

// The value of a field's cell as text, or '' when it was left empty.
export const textOf = (cell) => cell?.textContent.trim() || '';

// Fills the design-system field `name` with `content` (a string or a node) unless the author
// already gave it a value. Mutates `rows`, which then hold the field as the editor would have
// written it.
export function fillIfEmpty(rows, name, content) {
  if (!content) return;
  const existing = rows.find((row) => nameOf(row) === name);
  if (existing && (textOf(existing.children[1]) || existing.children[1]?.querySelector('img'))) return;
  const row = document.createElement('div');
  const label = document.createElement('div');
  const value = document.createElement('div');
  label.textContent = name;
  value.append(content);
  row.append(label, value);
  if (existing) rows.splice(rows.indexOf(existing), 1, row);
  else rows.push(row);
}

// Finds each named field's row and value cell among a block's rows. `names` lists the block's
// fields in model order. Rows are key-value pairs when the first row's label is one of the names
// (a flat block), and otherwise one row per field in `names` order (an item inside a container).
// Every name is present in the result; a field the author left empty has no row and no cell.
export function fieldsByName(rows, names) {
  const keyValue = !!rows[0] && names.includes(nameOf(rows[0]));
  const fields = {};
  names.forEach((name, index) => {
    const row = keyValue ? rows.find((r) => nameOf(r) === name) : rows[index];
    fields[name] = { row, cell: keyValue ? row?.children[1] : row };
  });
  return fields;
}

// A field's value read as text, as markup, as a link target (the anchor's href, else the text),
// as an image source and as a boolean. Each is undefined when the field is empty, so the caller
// applies its default. htmlValue is below.
export const textValue = (field) => field.cell?.textContent.trim() || undefined;

// The markup of a field's cell, without the editor's instrumentation. A rich text cell holds an
// element carrying the field's data-aue-* and data-richtext-* attributes, which instrument() and
// editorAttributes() move onto the rendered element; a value that kept them would register the
// field a second time inside it. The cell itself is not changed, because those two read its
// attributes after the value is read. An element that has a resource of its own, or sits inside
// one, keeps its attributes.
const EDITOR_ATTRIBUTE = /^data-(aue|richtext)-/;
export function htmlValue(field) {
  if (!field.cell) return undefined;
  const copy = field.cell.cloneNode(true);
  copy.querySelectorAll('*').forEach((el) => {
    if (el.closest('[data-aue-resource]')) return;
    [...el.attributes].filter(({ name }) => EDITOR_ATTRIBUTE.test(name))
      .forEach(({ name }) => el.removeAttribute(name));
  });
  return copy.innerHTML.trim() || undefined;
}

export const hrefValue = (field) => (field.cell?.querySelector('a')?.getAttribute('href')
  || field.cell?.textContent || '').trim() || undefined;

// An image field: the src of an image in the cell, else an http(s) URL given as a link or as text.
export function imageValue(field) {
  const img = field.cell?.querySelector('img');
  if (img) return img.getAttribute('src') || undefined;
  const url = (field.cell?.querySelector('a[href]')?.getAttribute('href') || field.cell?.textContent || '').trim();
  return /^https?:\/\//.test(url) ? url : undefined;
}

// A multiselect field: its values as one comma-separated string. The editor delivers two or more
// values as list items and one value as plain text.
export function listValue(field) {
  const items = [...(field.cell?.querySelectorAll('li') || [])];
  return (items.length
    ? items.map((li) => li.textContent.trim()).join(',')
    : field.cell?.textContent.trim()) || undefined;
}

export function booleanValue(field) {
  const text = field.cell?.textContent.trim().toLowerCase();
  if (text === 'true') return true;
  return text === 'false' ? false : undefined;
}

// Reads every field in `fields` (the result of fieldsByName) into a name -> value map. `kinds`
// names the reader of the fields that are not plain text: 'html', 'href', 'image', 'list' or
// 'boolean'.
const READERS = {
  html: htmlValue,
  href: hrefValue,
  image: imageValue,
  list: listValue,
  boolean: booleanValue,
  text: textValue,
};
export function valuesByName(fields, kinds = {}) {
  return Object.fromEntries(Object.entries(fields)
    .map(([name, field]) => [name, READERS[kinds[name] || 'text'](field)]));
}

// The editor's attributes of a field's row as a plain object, taken off the row so that only the
// rendered element carries them. The editor sets them on the first instrumented element in the
// row, not on the row itself. Undefined when the row has none.
export function editorAttributes(row) {
  const source = row?.querySelector('[data-aue-prop],[data-richtext-prop]') || row;
  if (!source) return undefined;
  const attributes = {};
  [...source.attributes].filter(({ name, value }) => EDITOR_ATTRIBUTE.test(name) && value)
    .forEach(({ name, value }) => {
      attributes[name] = value;
      source.removeAttribute(name);
    });
  return Object.keys(attributes).length ? attributes : undefined;
}

// The editor's attributes on the element itself (a container item's row carries its resource
// there), taken off it so that only the rendered element carries them. Undefined when it has none.
export function instrumentationOf(element) {
  const attributes = {};
  [...element.attributes].filter(({ name, value }) => EDITOR_ATTRIBUTE.test(name) && value)
    .forEach(({ name, value }) => {
      attributes[name] = value;
      element.removeAttribute(name);
    });
  return Object.keys(attributes).length ? attributes : undefined;
}

// Adds the CSS classes in each value (a value may hold several, separated by whitespace).
export function addClasses(root, ...values) {
  values.forEach((value) => {
    (value || '').split(/\s+/).filter(Boolean).forEach((token) => root.classList.add(token));
  });
}

// Adds the CSS classes of a multiselect value (separated by commas or whitespace).
export function addListClasses(root, value) {
  (value || '').split(/[\s,]+/).filter(Boolean).forEach((token) => root.classList.add(token));
}

// Puts a field's editor instrumentation on the rendered element `selector` finds under `root`.
// The editor sets the attributes on the first instrumented element in the field's row, not on
// the row itself.
export function instrument(field, root, selector) {
  const source = field.row?.querySelector('[data-aue-prop],[data-richtext-prop]') || field.row;
  const target = root.querySelector(selector);
  if (source && target) moveInstrumentation(source, target);
}

// Records what a block read, for the test template's field panel. `applied` maps each field name
// to how the block uses it (for instance 'prop:text' or 'class'), in model order. It records only
// on pages with the test template.
export function recordApplied(root, values, applied) {
  recordFields(root, values, Object.entries(applied).map(([name, apply]) => ({ name, apply })));
}
