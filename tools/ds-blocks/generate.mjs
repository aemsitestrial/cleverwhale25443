#!/usr/bin/env node
/* eslint-disable no-console */
// Generates, for every block of the design system package in /ds-eds-assets, the Universal Editor
// model of the block and the field table its JS reads:
//
//   blocks/<block>/_<block>.json      definitions (the block and, for a container, its item),
// models
//                                     and filters; models/_component-*.json pick them up
//   blocks/<block>/<block>-fields.js  NAMES, KINDS, CONTENT_FIELDS, OPTION_FIELDS,
// FIELD_CONDITIONS,
//                                     EDITABLE_PROPS (and ITEM_* for a container block)
//   blocks/<block>/<block>.css        empty, written once; aem.js requests it, the CSS comes from
// the
//                                     package (loadBundle)
//
// and adds the design system's section fields and every ac-* block to models/_section.json.
//
// The source is the package's contracts/field-contract.json (each wrapper's content props, option
// lists with their values, editable props) and its options/*.js (typeMeta: which option lists
// belong to which type). Field names are the design system's prop and option-list names, so a field
// reads as what it fills; a name that ends like an editor collapse suffix (Type, Text, Title, Alt)
// is
// changed, so that the editor does not fold it into another field. Run it again after installing a
// new version of the package:
//
//   node tools/ds-blocks/generate.mjs && npm run build:json
//
// The block JS (blocks/<block>/<block>.js) is written once, when the block has none, from the
// recipe of its kind (a component, a family, a title, a table, a container of items). After that it
// is the site's: the generator does not touch it again.
//
// One run handles one package. The Atlas Copco package (ac-*) is the default; another brand's
// package names its folder, its block prefix and its display name:
//
//   node tools/ds-blocks/generate.mjs --package ds-eds-assets-dekker --prefix dekker --title Dekker
//
// The section's filter offers the blocks of the package of the last run (the site's brand); the
// blocks another package generated stay in the repository, out of the filter.
import {
  readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// --package <folder> --prefix <block prefix> --title <display name> [--ds <scripts/ module>]
const ARGS = {};
for (let i = 2; i < process.argv.length; i += 2) {
  const flag = process.argv[i];
  const value = process.argv[i + 1];
  if (!['--package', '--prefix', '--title', '--ds'].includes(flag) || !value || value.startsWith('--')) {
    console.error(`ds-blocks: unknown or empty argument ${flag}. Use --package <folder> --prefix <prefix> --title <name> [--ds <module>].`);
    process.exit(2);
  }
  ARGS[flag.slice(2)] = value;
}
// The package folder, the block prefix (<prefix>-title), the name in block titles ("AC Title") and
// the module of scripts/ the blocks share (scripts/ds.js for AC, scripts/ds-<prefix>.js otherwise).
const PACKAGE_DIR = ARGS.package || 'ds-eds-assets';
const P = ARGS.prefix || 'ac';
const BRAND = ARGS.title || (P === 'ac' ? 'AC' : P.charAt(0).toUpperCase() + P.slice(1));
const DS_MODULE = ARGS.ds || (P === 'ac' ? 'ds.js' : `ds-${P}.js`);

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PACKAGE = join(ROOT, PACKAGE_DIR);
if (!existsSync(join(PACKAGE, 'contracts/field-contract.json'))) {
  console.error(`ds-blocks: ${PACKAGE_DIR}/contracts/field-contract.json does not exist; install the package first.`);
  process.exit(1);
}
const contract = JSON.parse(readFileSync(join(PACKAGE, 'contracts/field-contract.json'), 'utf8')).blocks;
const importOptions = (file) => import(pathToFileURL(join(PACKAGE, 'options', file)).href);

// The typeMeta of each options module, by its type list: { list, default, types }.
const metas = {};
await Promise.all(readdirSync(join(PACKAGE, 'options')).filter((f) => f.endsWith('.js'))
  .map(async (file) => {
    const { typeMeta } = await importOptions(file);
    if (typeMeta) metas[typeMeta.list] = typeMeta;
  }));
const containerLists = await importOptions('container.js');
const commonLists = await importOptions('common.js');

// ---------------------------------------------------------------------------------------------
// Names and fields

// The value of the "None" choice a select starts with: the field adds nothing. scripts/ds.js
// (applyNone, clearNoneSectionFields) reads it: an option list chosen as None is given empty, so it
// adds no class and replaces the wrapper's default; a content prop or a list the wrapper takes as a
// prop (PROP_LISTS) is left out, so the component's own default applies.
const NONE = '_none';
const NONE_OPTION = { name: 'None', value: NONE };

const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((h) => ({ name: h.toUpperCase(), value: h }));
const label = (name) => name
  .replace(/^cq:/, '')
  .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  .replace(/^./, (c) => c.toUpperCase());

// The editor folds a field named <base>Alt, <base>Text, <base>Title or <base>Type into <base> (the
// alt of an image, the text or title of a link, the level of a heading). A field that only looks
// like one gets another name; its table entry still says which prop or list it fills.
const COLLAPSE_SUFFIX = /(Alt|Text|Title|Type)$/;
const RENAMES = { panelTitle: 'panelLabel', actionText: 'actionLabel', videoMimeType: 'videoFormat' };
function fieldName(name, { select = false, base = [] } = {}) {
  if (!COLLAPSE_SUFFIX.test(name) || base.includes(name.replace(COLLAPSE_SUFFIX, ''))) return name;
  if (RENAMES[name]) return RENAMES[name];
  return select ? `${name}Option` : `${name}Value`;
}

// Content props that are images, addresses or rich text, by block or for every block.
const IMAGE_PROPS = ['imagePath', 'poster', 'backgroundImagePath'];
const URL_PROPS = ['assetPathWithQueryParams', 'url'];
const HTML_PROPS = ['description', 'content'];
const HTML_TEXT_BLOCKS = [`${P}-text`, `${P}-table`];
// Content props a site does not author: the wrapper or the block fills them.
const SKIPPED_PROPS = ['picture', 'children', 'items', 'titleTag'];

// What the site does not offer of the package: the table of contents block, and the container's
// table of contents styles (tocLayout). The site builds its table of contents another way.
const SKIPPED_BLOCKS = ['ac-table-of-content'];
// Blocks whose models this generator writes by a recipe of its own (below), not from their content.
const COMPOSITE_BLOCKS = ['ac-block-table-of-content-layout'];
const SKIPPED_OPTIONS = { 'ac-container': ['tocLayout'] };
// The blocks of the nav page, written by hand (not from the package's contract).
const NAV_BLOCKS = ['ac-nav-header', 'ac-nav-links', 'ac-nav-languages', 'ac-nav-locator'];
// What earlier runs of this generator wrote into models/_section.json and no longer do.
const DROPPED_SECTION_FIELDS = ['layout'];

/**
 * The fields of a set of content props: [{ field (model field), path (content prop), kind }].
 * `kind` is how field-rows.js reads the cell: text, html, href, image, boolean, list.
 */
function contentFields(block, content) {
  const fields = [];
  const add = (field, path, kind) => fields.push({ field, path, kind });
  const text = (name, fieldLabel) => ({
    component: 'text', name, label: fieldLabel || label(name), valueType: 'string',
  });
  Object.entries(content).forEach(([prop, spec]) => {
    if (SKIPPED_PROPS.includes(prop)) return;
    if (prop === 'cq:panelTitle') {
      add(text(fieldName('panelTitle'), 'Title'), prop, 'text');
    } else if (prop === 'actions') {
      [1, 2].forEach((n) => {
        add(text(`action${n}Label`, `Action ${n} text`), `actions.${n - 1}.title`, 'text');
        add({ component: 'aem-content', name: `action${n}Link`, label: `Action ${n} link` }, `actions.${n - 1}.link.url`, 'href');
      });
    } else if (prop === 'source') { // embed-video: one source
      add({ component: 'aem-content', name: 'videoUrl', label: 'Video' }, 'source.0.url', 'href');
      add(text(fieldName('videoMimeType'), 'Video MIME type (e.g. video/mp4)'), 'source.0.type', 'text');
    } else if (prop === 'image' && spec.kind === 'object') { // download: image.src
      add({
        component: 'reference', name: 'image', label: 'Image', multi: false,
      }, 'image.src', 'image');
    } else if (spec.kind === 'link') {
      add({ component: 'aem-content', name: prop, label: label(prop) }, `${prop}.url`, 'href');
    } else if (spec.kind === 'boolean') {
      add({
        component: 'boolean', name: prop, label: label(prop), valueType: 'boolean',
      }, prop, 'boolean');
    } else if (spec.kind === 'enum') {
      // container gridVariant/contentWidth: selects, added with the options
    } else if (IMAGE_PROPS.includes(prop) || (prop === 'src' && block === `${P}-image`)) {
      add({
        component: 'reference', name: prop, label: label(prop), multi: false,
      }, prop, 'image');
    } else if (URL_PROPS.includes(prop)) {
      add({ component: 'aem-content', name: prop, label: label(prop) }, prop, 'href');
    } else if (HTML_PROPS.includes(prop) || (prop === 'text' && HTML_TEXT_BLOCKS.includes(block))) {
      add({
        component: 'richtext', name: prop, label: label(prop), valueType: 'string',
      }, prop, 'html');
    } else {
      add(text(fieldName(prop)), prop, 'text');
      // A Teaser-family title gets its heading level beside it; the editor folds the two into one
      // <hN>.
      if (prop === 'title' && 'titleTag' in content) {
        add({
          component: 'select', name: 'titleType', label: 'Title type', options: HEADINGS.slice(0, 5),
        }, 'titleTag', 'text');
      }
    }
  });
  return fields;
}

// The option lists that cannot be empty: the wrapper puts its first value in place of an empty
// one (`required` in render-banner.js), so a None choice would not add nothing.
const NO_EMPTY_LISTS = ['sectionTeaserImage', 'promoBannerStyle'];

// Whether an option list's select gets the None choice: not the type list of a family (the type
// decides the fields), not a list that cannot be empty, and not a list that has a value of its own
// for "none" (cardAction).
const takesNone = (list, values, typeList) => list !== typeList
  && !NO_EMPTY_LISTS.includes(list)
  && !values.some(({ value }) => value === 'none');

// A select (a multiselect for several values, which the author clears by deselecting). A single
// select starts with the None choice unless `none` is false.
const selectField = (name, fieldLabel, values, multiple = false, { none = true } = {}) => ({
  component: multiple ? 'multiselect' : 'select',
  name,
  label: fieldLabel,
  options: [
    ...(none && !multiple ? [NONE_OPTION] : []),
    ...values.map(({ value, label: optionLabel }) => ({ name: optionLabel, value })),
  ],
});

// A JsonLogic condition (the subset model-conditions.js evaluates) that shows a field only for the
// types it belongs to, or undefined when it belongs to all.
function typeCondition(typeField, meta, types) {
  const all = Object.keys(meta.types);
  if (types.length === all.length) return undefined;
  const others = all.filter((t) => !types.includes(t));
  // A block saved without a type is the default type, so a field of the default type is shown when
  // the type is none of the others.
  if (types.includes(meta.default)) return { '!': { in: [{ var: typeField }, others] } };
  return types.length === 1
    ? { '==': [{ var: typeField }, types[0]] }
    : { in: [{ var: typeField }, types] };
}

// The Universal Editor's rich text toolbar for a field that holds a table (Configuring the RTE
// for the Universal Editor): the table tools, with the row and cell dialogs (a header row or
// header cells), and the text tools a table cell needs. A filter with an `rte` config applies to
// the field's element when the element names it in data-aue-filter (the block's JS sets it).
const TABLE_RTE = {
  toolbar: {
    format: ['bold', 'italic', 'underline', 'strike'],
    blocks: ['paragraph', 'h2', 'h3', 'h4'],
    list: ['bullet_list', 'ordered_list'],
    insert: ['link', 'unlink', 'table'],
    editor: ['removeformat', 'paste_text'],
    sections: ['insert', 'format', 'blocks', 'list', 'editor'],
  },
  actions: {
    table: {
      wrapInParagraphs: false,
      showTableProperties: true,
      showRowProperties: true,
      showCellProperties: true,
    },
  },
};
const RTE_FILTERS = {
  [`${P}-table`]: { id: `${P}-table-text`, rte: TABLE_RTE, components: ['richtext'] },
};

// Nesting ("Nest inside", a container's "Name") is for a package with a container block.
const NESTING = `${P}-container` in contract;
const NEST_FIELD = {
  component: 'text',
  name: 'parentId',
  label: 'Nest inside',
  description: `The name of the ${BRAND} Container this block is moved into. Empty: it stays where it is.`,
};
const NAME_FIELD = {
  component: 'text',
  name: 'nestId',
  label: 'Name',
  description: 'The name blocks give in "Nest inside" to be moved into this container.',
};

// Whether the editor folds a field into another field of the model (and so writes no cell of its
// own): <base>Alt, <base>Text, <base>Title or <base>Type beside a field <base>.
const isFolded = (name, names) => COLLAPSE_SUFFIX.test(name)
  && names.includes(name.replace(COLLAPSE_SUFFIX, ''));

// The card type of a list item type: the class of the type that is a value of the cardType list
// (as render-list.js decides it), or undefined for a type that is no card.
const cardTypeOf = (itemType) => (itemType || '').split(/\s+/)
  .find((cls) => cls in metas.cardType.types);

// The conditions of a list item's fields: a card's content (date, actions, heading level) and
// options are shown for the item types that are cards, and a card option only for the card types
// it belongs to (the card's typeMeta). An item without a type takes the list's, which the model
// cannot see, so it shows them all.
function listItemConditions(item, itemOptions, itemTypes) {
  const cardMeta = metas.cardType;
  const scoped = new Set(Object.values(cardMeta.types).flatMap((t) => t.options || []));
  const conditions = {};
  const hideFor = (field, shown) => {
    const hidden = itemTypes.map((t) => t.value).filter((t) => !shown(cardTypeOf(t)));
    if (!hidden.length) return;
    const condition = { '!': { in: [{ var: 'itemStyle' }, hidden] } };
    field.condition = condition;
    conditions[field.name] = condition;
  };
  const CARD_CONTENT = ['date', 'titleTag'];
  item.filter((c) => CARD_CONTENT.includes(c.path) || c.path.startsWith('actions.'))
    .forEach((c) => hideFor(c.field, (cardType) => !!cardType));
  itemOptions.forEach(({ list, field }) => hideFor(field, (cardType) => !!cardType
    && (!scoped.has(list) || (cardMeta.types[cardType].options || []).includes(list))));
  return conditions;
}

// ---------------------------------------------------------------------------------------------
// One block

function blockFiles(block, spec) {
  const meta = Object.keys(spec.options || {}).map((list) => metas[list]).find(Boolean);
  let content;
  if (block === `${P}-title`) {
    // The heading level is the titleType field beside title (the editor folds the two into one
    // <hN>), which fills the headingTag list; ac-title.js reads it from the heading's tag.
    content = [
      { field: { component: 'text', name: 'title', label: 'Title' }, path: 'text', kind: 'text' },
      { field: { component: 'aem-content', name: 'link', label: 'Link' }, path: 'link.url', kind: 'href' },
    ];
  } else {
    content = contentFields(block, spec.content);
  }
  const contentNames = content.map((c) => c.field.name);

  // The option lists, the type list of a family first: the fields after it depend on it.
  const options = Object.entries(spec.options || {})
    .filter(([list]) => !(SKIPPED_OPTIONS[block] || []).includes(list))
    .sort(([a], [b]) => (b === meta?.list) - (a === meta?.list))
    .map(([list, s]) => {
      if (block === `${P}-title` && list === 'headingTag') {
        return { list, s, field: selectField('titleType', 'Title type', s.values, false, { none: false }) };
      }
      const name = fieldName(list, { select: true, base: contentNames });
      const none = takesNone(list, s.values, meta?.list);
      return { list, s, field: selectField(name, label(list), s.values, s.multiple, { none }) };
    });
  const typeField = meta && options.find((o) => o.list === meta.list).field.name;
  const conditions = {};
  options.forEach(({ list, field }) => {
    if (!meta || list === meta.list) return;
    const types = Object.entries(meta.types)
      .filter(([, t]) => (t.options || []).includes(list)).map(([t]) => t);
    const condition = types.length && typeCondition(typeField, meta, types);
    if (condition) {
      field.condition = condition;
      conditions[field.name] = condition;
    }
  });
  // <prefix>-container: its grid and content width are content props of
  // render-container-block, with the choices of options/container.js.
  const containerEnums = block === `${P}-container`
    ? ['gridVariant', 'contentWidth'].map((prop) => selectField(prop, label(prop), containerLists[prop]))
    : [];

  const modelFields = [
    ...content.map((c) => c.field), ...containerEnums, ...options.map((o) => o.field),
    ...(block === `${P}-container` ? [NAME_FIELD] : []), ...(NESTING ? [NEST_FIELD] : []),
  ];
  const title = `${BRAND} ${block.slice(P.length + 1).split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')}`;
  const definitions = [{
    title,
    id: block,
    plugins: {
      xwalk: {
        page: {
          resourceType: 'core/franklin/components/block/v1/block',
          template: {
            name: title, model: block, 'key-value': true, ...(spec.itemBlock && { filter: block }),
          },
        },
      },
    },
  }];
  const models = [{ id: block, fields: modelFields }];
  const filters = [];
  // The table's rich text field: an editor toolbar with the table tools (scripts/ds.js
  // RTE_FILTERS puts the filter on the field's element).
  if (RTE_FILTERS[block]) filters.push(RTE_FILTERS[block]);

  const table = {
    NAMES: modelFields.map((f) => f.name).filter((n) => !['parentId', 'nestId'].includes(n)),
    KINDS: Object.fromEntries([
      ...content.filter((c) => c.kind !== 'text').map((c) => [c.field.name, c.kind]),
      ...options.filter((o) => o.s.multiple).map((o) => [o.field.name, 'list']),
    ]),
    CONTENT_FIELDS: Object.fromEntries([
      ...content.map((c) => [c.field.name, c.path]),
      ...containerEnums.map((f) => [f.name, f.name]),
    ]),
    OPTION_FIELDS: Object.fromEntries(options.map((o) => [o.field.name, { list: o.list }])),
    FIELD_CONDITIONS: conditions,
    EDITABLE_PROPS: (spec.editable || []).map((e) => e.prop).filter((p) => !p.startsWith('`')),
    PROP_LISTS: Object.entries(spec.options || {})
      .filter(([, o]) => o.appliedAs === 'prop').map(([list]) => list).sort(),
  };
  if (meta) table.TYPE_META = { list: meta.list, default: meta.default };

  if (spec.itemBlock) {
    const itemSpec = contract[spec.itemBlock];
    const item = contentFields(spec.itemBlock, itemSpec.content);
    // A list item's own type (itemStyle) is a select of the list's item types.
    if (block === `${P}-list`) {
      item.push({ field: selectField('itemStyle', 'Item type', spec.options.listItemType.values), path: 'itemStyle', kind: 'text' });
    }
    // The item's own option lists (a list item's are the card's), after its content.
    const itemNames = item.map((c) => c.field.name);
    const itemOptions = Object.entries(itemSpec.options || {}).map(([list, s]) => {
      const name = fieldName(list, { select: true, base: itemNames });
      const none = takesNone(list, s.values);
      return { list, s, field: selectField(name, label(list), s.values, s.multiple, { none }) };
    });
    const itemConditions = block === `${P}-list`
      ? listItemConditions(item, itemOptions, spec.options.listItemType.values)
      : {};
    const itemTitle = `${title} Item`;
    definitions.push({
      title: itemTitle,
      id: spec.itemBlock,
      plugins: {
        xwalk: {
          page: {
            resourceType: 'core/franklin/components/block/v1/block/item',
            template: { name: itemTitle, model: spec.itemBlock },
          },
        },
      },
    });
    const itemFields = [...item, ...itemOptions].map((c) => c.field);
    models.push({ id: spec.itemBlock, fields: itemFields });
    filters.push({ id: block, components: [spec.itemBlock] });
    const itemPrefix = '`items.${number}.'; // eslint-disable-line no-template-curly-in-string
    Object.assign(table, {
      // One cell per field, except a field the editor folds into another (titleType into title).
      ITEM_NAMES: [...item, ...itemOptions].map((c) => c.field.name)
        .filter((name) => !isFolded(name, itemNames)),
      ITEM_KINDS: Object.fromEntries([
        ...item.filter((c) => c.kind !== 'text').map((c) => [c.field.name, c.kind]),
        ...itemOptions.filter((o) => o.s.multiple).map((o) => [o.field.name, 'list']),
      ]),
      ITEM_CONTENT_FIELDS: Object.fromEntries(item.map((c) => [c.field.name, c.path])),
      ITEM_PROP_LISTS: itemOptions.filter((o) => o.s.appliedAs === 'prop').map((o) => o.list).sort(),
      ITEM_OPTION_FIELDS: Object.fromEntries(itemOptions
        .map((o) => [o.field.name, { list: o.list }])),
      ITEM_FIELD_CONDITIONS: itemConditions,
      ITEM_EDITABLE_PROPS: [...new Set((spec.editable || []).map((e) => e.prop)
        .filter((p) => p.startsWith(itemPrefix))
        .map((p) => p.slice(itemPrefix.length, -1))
        .filter((p) => p !== 'panel'))],
    });
  }
  return { json: { definitions, models, filters }, table };
}

// ---------------------------------------------------------------------------------------------
// Writing

// A value as JavaScript in the site's lint style: single quotes, keys quoted only when needed,
// short values on one line and long ones one entry per line with a trailing comma.
function toJs(value, indent = '') {
  const inner = `${indent}  `;
  if (Array.isArray(value)) {
    const items = value.map((v) => toJs(v, inner));
    const flat = `[${items.join(', ')}]`;
    return flat.length + indent.length < 80 && !flat.includes('\n') ? flat : `[\n${items.map((i) => `${inner}${i},`).join('\n')}\n${indent}]`;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value).map(([k, v]) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : toJs(k)}: ${toJs(v, inner)}`);
    if (!entries.length) return '{}';
    const flat = `{ ${entries.join(', ')} }`;
    return flat.length + indent.length < 80 && !flat.includes('\n') && entries.length < 4 ? flat : `{\n${entries.map((e) => `${inner}${e},`).join('\n')}\n${indent}}`;
  }
  if (typeof value === 'string') return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  return String(value);
}

const COMMENTS = {
  NAMES: 'The fields of the model, in model order.',
  KINDS: 'How field-rows.js reads a field that is not plain text.',
  CONTENT_FIELDS: 'Field -> content prop of the wrapper (a dotted path).',
  OPTION_FIELDS: 'Field -> option list of the wrapper.',
  FIELD_CONDITIONS: 'The option fields the model shows only for some types (as in the model).',
  EDITABLE_PROPS: 'The content props the wrapper renders an editable element for.',
  PROP_LISTS: 'The option lists the wrapper takes as a prop, not a class (a None choice leaves them out).',
  ITEM_PROP_LISTS: 'The item option lists taken as a prop, not a class (a None choice leaves them out).',
  TYPE_META: 'The type list of the family and its default type (options typeMeta).',
  ITEM_NAMES: 'The item\'s fields, one cell each, in model order.',
  ITEM_KINDS: 'How field-rows.js reads an item field that is not plain text.',
  ITEM_CONTENT_FIELDS: 'Item field -> item prop.',
  ITEM_OPTION_FIELDS: 'Item field -> option list of the item (`options` of the item).',
  ITEM_FIELD_CONDITIONS: 'The item fields the model shows only for some item types (as in the model).',
  ITEM_EDITABLE_PROPS: 'The item props the wrapper renders an editable element for.',
};

// A comment line within the line length, broken before the last word that does not fit.
function wrapLine(line, max = 100) {
  if (line.length <= max) return [line];
  const cut = line.lastIndexOf(' ', max);
  return [line.slice(0, cut), ...wrapLine(`// ${line.slice(cut + 1)}`, max)];
}

function fieldsModule(block, spec, table) {
  const lines = [
    `// GENERATED by tools/ds-blocks/generate.mjs from ${PACKAGE_DIR}/contracts/field-contract.json`,
    ...wrapLine(`// (${spec.wrapper}). Do not edit: run the generator again after the package changes.`),
  ];
  Object.entries(table).forEach(([name, value]) => {
    lines.push('', `// ${COMMENTS[name]}`, `export const ${name} = ${toJs(value)};`);
  });
  return `${lines.join('\n')}\n`;
}

// ---------------------------------------------------------------------------------------------
// The block JS, written once (when the block has none) by the recipe of its kind

// The CSS bundles of the package (css/bundles.json): a block loads its own when there is one.
const bundlesFile = JSON.parse(readFileSync(join(PACKAGE, 'css/bundles.json'), 'utf8'));
const BUNDLES = new Set(Object.keys(bundlesFile.bundles || bundlesFile));
const VENDOR = `../../${PACKAGE_DIR}/js/vendor`;
const camel = (name) => name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

/** The text of blocks/<block>/<block>.js for a block of the package. */
function blockJs(block, spec, table) {
  const render = camel(spec.wrapper);
  const wrapperFile = `${VENDOR}/${spec.wrapper}.js`;
  // The file's comment: what the block is (`what`, then `more` lines), then where it came from.
  const head = (what, more = []) => [
    `// ${block}: ${what}`,
    ...more.map((line) => `// ${line}`),
    `// GENERATED once by tools/ds-blocks/generate.mjs from ${PACKAGE_DIR} (${spec.wrapper});`,
    '// the site\'s from now on: the generator does not write it again. The fields are the model in',
    `// _${block}.json; ${block}-fields.js says what each fills.`,
  ].join('\n');
  const ownBundle = BUNDLES.has(block) ? `  loadBundle('${block}');\n` : '';
  if (table.TYPE_META) {
    return `${head('one block of the family, Teaser() as the chosen type.', [
      'The title and titleType fields are folded by the editor into one <hN>; the family reads the',
      'level from its tag.',
    ])}
import ${render} from '${wrapperFile}';
import { renderTeaserFamilyBlock } from '${VENDOR}/teaser-family.js';
import {
  loadBundle, readBlock, replaceBlock, applyNone,
} from '../../scripts/${DS_MODULE}';
import * as fields from './${block}-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
${ownBundle}  const { own, wrapper } = readBlock(block, fields.NAMES);
  const root = renderTeaserFamilyBlock(own, {
    render: (input) => ${render}(applyNone(input, fields)),
    names: fields.NAMES,
    kinds: fields.KINDS,
    contentFields: fields.CONTENT_FIELDS,
    optionFields: fields.OPTION_FIELDS,
    conditions: fields.FIELD_CONDITIONS,
    editableProps: fields.EDITABLE_PROPS,
    typeMeta: fields.TYPE_META,
    loadBundle,
  });
  replaceBlock(block, root, wrapper);
}
`;
  }
  if (block === `${P}-title`) {
    return `${head('one heading, Title().', [
      'The model\'s title and titleType fields are folded by the editor into one <hN> element, so',
      'the level is read from the heading\'s tag (h2 when the title is plain text) and fills the',
      'headingTag list.',
    ])}
import ${render} from '${wrapperFile}';
import { fieldsByName, valuesByName } from '${VENDOR}/field-rows.js';
import { componentInput } from '${VENDOR}/component-block.js';
import {
  loadBundle, readBlock, replaceBlock, applyNone,
} from '../../scripts/${DS_MODULE}';
import * as fields from './${block}-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
${ownBundle}  const { own, wrapper } = readBlock(block, fields.NAMES);
  const found = fieldsByName(own, fields.NAMES);
  const values = valuesByName(found, fields.KINDS);
  const heading = found.title?.cell?.querySelector('h1,h2,h3,h4,h5,h6');
  if (heading) values.titleType = heading.localName;
  const root = ${render}({
    ...applyNone(componentInput(found, values, {
      contentFields: fields.CONTENT_FIELDS,
      optionFields: fields.OPTION_FIELDS,
      editableProps: fields.EDITABLE_PROPS,
    }), fields),
    loadBundle,
  });
  replaceBlock(block, root, wrapper);
}
`;
  }
  if (spec.itemBlock) {
    // A container of items: the controller the wrapper exports (startCarousel, startResponsiveTabs)
    // measures the rendered items, so it starts once the root is in the page.
    const source = readFileSync(join(PACKAGE, 'js/vendor', `${spec.wrapper}.js`), 'utf8');
    const start = (source.match(/export function (start\w+)/) || [])[1];
    const itemBundle = BUNDLES.has(spec.itemBlock) ? `  loadBundle('${spec.itemBlock}');\n` : '';
    return `${head('a container, one entry per item.', [
      'The block\'s own fields are key-value rows; each item is a row with one cell per item field.',
    ])}
import ${render}${start ? `, { ${start} }` : ''} from '${wrapperFile}';
import {
  loadBundle, readBlock, replaceBlock, containerInput,
} from '../../scripts/${DS_MODULE}';
import * as fields from './${block}-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
${ownBundle}${itemBundle}  const { own, items, wrapper } = readBlock(block, fields.NAMES);
  const root = ${render}({ ...containerInput(own, items, fields), loadBundle });
  replaceBlock(block, root, wrapper);
${start ? `  if (root.isConnected) ${start}(root);\n  else requestAnimationFrame(() => ${start}(root));\n` : ''}}
`;
  }
  if (RTE_FILTERS[block]) {
    const filter = RTE_FILTERS[block].id;
    return `${head('a table: the rich-text field holds the table, Table() styles it.', [
      'In the Universal Editor the table is written in the field\'s rich text editor. Its element',
      `names the filter ${filter} (_${block}.json),`,
      'whose toolbar has the table tools. An empty table has no element to write in, so in the',
      'editor the block gives it one.',
    ])}
import ${render} from '${wrapperFile}';
import { decorateComponentBlock, isAuthoringContext } from '../../scripts/${DS_MODULE}';
import * as fields from './${block}-fields.js';

const RTE_FILTER = '${filter}';

/** @param {HTMLElement} block */
export default function decorate(block) {
  const root = decorateComponentBlock(block, { bundle: '${block}', render: ${render}, fields });
  if (!root || !isAuthoringContext(document)) return;
  let editable = root.querySelector('[data-aue-prop="text"]');
  if (!editable) {
    editable = root.querySelector('.cmp-text');
    if (!editable) return;
    editable.setAttribute('data-aue-prop', 'text');
    editable.setAttribute('data-aue-type', 'richtext');
    editable.setAttribute('data-aue-label', 'Table');
    editable.classList.add('${block}-empty');
  }
  editable.setAttribute('data-aue-filter', RTE_FILTER);
}
`;
  }
  return `${head(`one component, ${render}() of the design system.`)}
import ${render} from '${wrapperFile}';
import { decorateComponentBlock } from '../../scripts/${DS_MODULE}';
import * as fields from './${block}-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  decorateComponentBlock(block, { bundle: '${block}', render: ${render}, fields });
}
`;
}

// A block whose content is a list of `items` with no item block in the contract has nothing an
// author can fill (the item fields come from the item block): it is left out, with the reason.
const unauthorable = (spec) => spec.content?.items?.kind === 'list' && !spec.itemBlock;

const written = [];
const jsWritten = [];
const leftOut = [];
// The model fields of each block written, for the items of the table of contents layout.
const blockModels = {};
Object.entries(contract)
  .filter(([block, spec]) => !spec.itemOf && !SKIPPED_BLOCKS.includes(block)
    && !COMPOSITE_BLOCKS.includes(block))
  .forEach(([block, spec]) => {
    if (unauthorable(spec)) {
      leftOut.push(`${block} (its items have no item block in the contract)`);
      return;
    }
    const dir = join(ROOT, 'blocks', block);
    mkdirSync(dir, { recursive: true });
    const { json, table } = blockFiles(block, spec);
    writeFileSync(join(dir, `_${block}.json`), `${JSON.stringify(json, null, 2)}\n`);
    writeFileSync(join(dir, `${block}-fields.js`), fieldsModule(block, spec, table));
    blockModels[block] = json.models[0].fields;
    const css = join(dir, `${block}.css`);
    if (!existsSync(css)) writeFileSync(css, `/* The CSS of ${block} comes from the design system package (loadBundle in ${block}.js). */\n`);
    const js = join(dir, `${block}.js`);
    if (!existsSync(js)) {
      writeFileSync(js, blockJs(block, spec, table));
      jsWritten.push(block);
    }
    written.push(block);
  });
console.log(`ds-blocks: ${written.length} ${P}-* blocks (${written.join(', ')})`);
if (jsWritten.length) console.log(`ds-blocks: block JS written for ${jsWritten.join(', ')} (the site's from now on)`);
if (leftOut.length) console.log(`ds-blocks: left out ${leftOut.join(', ')}`);

// ---------------------------------------------------------------------------------------------
// AC Block Table Of Content Layout: the package's render-block-table-of-content-layout, the design
// system's BlockTableOfContentLayout (a sticky sidebar beside a content column, as on the wiki page
// of ac-core-lib). Its content is two slots (sidebar, children), which no field fills: the
// Universal Editor puts no block inside a block, so what the layout holds are its items. A Table of
// contents item, and an item of each component kind below, with the fields of that component's
// block and a "Place" field (sidebar or content). The block renders each item with that block's
// own decorator (blocks/ac-block-table-of-content-layout). The delivered page says nothing of an
// item's model, so each item model starts with a read-only "kind" field, which its template fills.
// The block's id is its title as a class name: the delivered page names a block by its title.

const TOC_LAYOUT = 'ac-block-table-of-content-layout';
const TOC_LAYOUT_TITLE = 'AC Block Table Of Content Layout';
// The component kinds an item can be: kind -> block.
const TOC_LAYOUT_KINDS = {
  title: 'ac-title',
  text: 'ac-text',
  card: 'ac-card',
  'text-content': 'ac-text-content',
  image: 'ac-image',
  button: 'ac-button',
  link: 'ac-link',
  table: 'ac-table',
  separator: 'ac-separator',
  download: 'ac-download',
};
const kindField = (kind) => ({
  component: 'text', name: 'kind', label: 'Kind', valueType: 'string', value: kind, readOnly: true,
});
const PLACE_FIELD = {
  component: 'select',
  name: 'place',
  label: 'Place',
  value: 'content',
  options: [{ name: 'Content', value: 'content' }, { name: 'Sidebar', value: 'sidebar' }],
};
const tocLayoutSpec = contract[TOC_LAYOUT];
const tocListTypes = contract['ac-table-of-content']?.options.tocListType.values || [];
const tocItems = [
  {
    id: `${TOC_LAYOUT}-toc`,
    title: 'Table of contents',
    kind: 'toc',
    fields: [
      kindField('toc'),
      {
        component: 'select', name: 'startLevel', label: 'Start level', options: [NONE_OPTION, ...HEADINGS],
      },
      {
        component: 'select', name: 'stopLevel', label: 'Stop level', options: [NONE_OPTION, ...HEADINGS],
      },
      selectField('tocListTypeOption', 'List type', tocListTypes),
    ],
  },
  ...Object.entries(TOC_LAYOUT_KINDS).filter(([, block]) => blockModels[block])
    .map(([kind, block]) => ({
      id: `${TOC_LAYOUT}-${kind}`,
      title: block.replace(/^ac-/, '').split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' '),
      kind,
      block,
      fields: [
        kindField(kind),
        ...blockModels[block].filter((f) => !['parentId', 'nestId'].includes(f.name)),
        PLACE_FIELD,
      ],
    })),
];
if (tocLayoutSpec) {
  const layoutOptions = Object.entries(tocLayoutSpec.options || {})
    .map(([list, spec]) => ({ list, field: selectField(list, label(list), spec.values) }));
  const json = {
    definitions: [
      {
        title: TOC_LAYOUT_TITLE,
        id: TOC_LAYOUT,
        plugins: {
          xwalk: {
            page: {
              resourceType: 'core/franklin/components/block/v1/block',
              template: {
                name: TOC_LAYOUT_TITLE, model: TOC_LAYOUT, 'key-value': true, filter: TOC_LAYOUT,
              },
            },
          },
        },
      },
      ...tocItems.map((item) => ({
        title: item.title,
        id: item.id,
        plugins: {
          xwalk: {
            page: {
              resourceType: 'core/franklin/components/block/v1/block/item',
              template: {
                name: item.title, model: item.id, kind: item.kind, ...(item.block && { place: 'content' }),
              },
            },
          },
        },
      })),
    ],
    models: [
      { id: TOC_LAYOUT, fields: layoutOptions.map((o) => o.field) },
      ...tocItems.map((item) => ({ id: item.id, fields: item.fields })),
    ],
    filters: [{ id: TOC_LAYOUT, components: tocItems.map((item) => item.id) }],
  };
  // Each item kind: the block that renders it, and its fields in cell order after "kind" (a field
  // the editor folds into another has no cell of its own).
  const table = {
    NAMES: layoutOptions.map((o) => o.field.name),
    KINDS: {},
    OPTION_FIELDS: Object.fromEntries(layoutOptions.map((o) => [o.field.name, { list: o.list }])),
    ITEMS: Object.fromEntries(tocItems.map((item) => {
      const names = item.fields.map((f) => f.name);
      return [item.kind, {
        ...(item.block && { block: item.block }),
        names: names.slice(1).filter((name) => !isFolded(name, names)),
      }];
    })),
  };
  const dir = join(ROOT, 'blocks', TOC_LAYOUT);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `_${TOC_LAYOUT}.json`), `${JSON.stringify(json, null, 2)}\n`);
  writeFileSync(join(dir, `${TOC_LAYOUT}-fields.js`), [
    '// GENERATED by tools/ds-blocks/generate.mjs: the fields of the AC Block Table Of Content Layout',
    '// and of its items. Do not edit: run the generator again.',
    '',
    ...Object.entries(table).map(([name, value]) => `export const ${name} = ${toJs(value)};\n`),
  ].join('\n'));
  written.push(TOC_LAYOUT);
  console.log(`ds-blocks: ${TOC_LAYOUT} with ${tocItems.length} item kinds`);
}

// The section: its model gets the design system's section fields, which decorateContainerSections
// (<package>/js/vendor/page-glue.js) reads, and its filter allows the blocks of this package. The
// blocks another package generated (the site's earlier brand) leave the filter; their folders stay.
const sectionFile = join(ROOT, 'models/_section.json');
const section = JSON.parse(readFileSync(sectionFile, 'utf8'));
// The container's composition and background lists, when the package has them: a composition
// (a class on the section, with its CSS bundle) and a background class of the brand.
const CONTAINER_CLASS_FIELDS = [
  ['wrappersVariant', 'Composition'],
  ['backgroundVariant', 'Background'],
];
const sectionFields = [
  {
    component: 'text', name: 'backgroundColor', label: 'Background colour', description: 'A CSS colour, e.g. #f5f2ef',
  },
  {
    component: 'reference', name: 'backgroundImageReference', label: 'Background image', multi: false,
  },
  selectField('gridVariant', 'Grid', containerLists.gridVariant),
  // No None: a section without a width is the default width (12).
  selectField('contentWidth', 'Content width', [
    ...containerLists.contentWidth, { value: 'bleed', label: 'Full bleed' },
  ], false, { none: false }),
  ...CONTAINER_CLASS_FIELDS.filter(([list]) => containerLists[list])
    .map(([list, fieldLabel]) => selectField(list, fieldLabel, containerLists[list])),
  selectField('padding', 'Padding (top and bottom)', commonLists.spacingPy),
  selectField('paddingTop', 'Padding top', commonLists.spacingPt),
  selectField('paddingBottom', 'Padding bottom', commonLists.spacingPb),
  selectField('margin', 'Margin (top and bottom)', commonLists.spacingMy),
  selectField('marginTop', 'Margin top', commonLists.spacingMt),
  selectField('marginBottom', 'Margin bottom', commonLists.spacingMb),
  // Nested sections (scripts/nest-sections.js): a section names itself, and another section names
  // it to move into its grid, as the parts of a composition do (the News block's carousel).
  {
    component: 'text', name: 'nestId', label: 'Name', description: 'The name sections give in "Nest inside" to be moved into this section.',
  },
  {
    component: 'text', name: 'parentId', label: 'Nest inside', description: 'The Name of the section this section is moved into, as an item of its grid. Empty: it stays where it is.',
  },
];
const sectionModel = section.models.find((m) => m.id === 'section');
// The fields this generator owns: those it writes now, and a container list another package had.
const sectionNames = [
  ...sectionFields.map((f) => f.name), ...CONTAINER_CLASS_FIELDS.map(([list]) => list),
];
sectionModel.fields = [
  ...sectionModel.fields
    .filter((f) => !sectionNames.includes(f.name) && !DROPPED_SECTION_FIELDS.includes(f.name)),
  ...sectionFields,
];
// A block this generator wrote that this run did not: one of another package (the site's earlier
// brand), or one this package no longer has (its fields module says it was generated). Its folder
// stays; the section does not offer it.
const generatedElsewhere = (name) => {
  const file = join(ROOT, 'blocks', name, `${name}-fields.js`);
  return !written.includes(name) && existsSync(file)
    && readFileSync(file, 'utf8').startsWith('// GENERATED by tools/ds-blocks/generate.mjs');
};
const sectionFilter = section.filters.find((f) => f.id === 'section');
sectionFilter.components = [
  ...sectionFilter.components
    .filter((c) => !written.includes(c) && !SKIPPED_BLOCKS.includes(c) && !NAV_BLOCKS.includes(c)
      && !['ac-toc-layout', 'ac-table-of-content-layout'].includes(c) && !generatedElsewhere(c)),
  ...written,
  // The site's own blocks of the nav page (blocks/ac-nav-*), which blocks/header/header.js reads.
  ...NAV_BLOCKS.filter((c) => !written.includes(c)),
];
writeFileSync(sectionFile, `${JSON.stringify(section, null, 2)}\n`);
console.log(`ds-blocks: models/_section.json has the design system's section fields and allows the ${written.length} ${P}-* blocks`);
