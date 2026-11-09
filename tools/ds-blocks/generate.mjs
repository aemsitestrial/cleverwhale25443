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
// The block JS (blocks/<block>/<block>.js) is written by hand and is not touched.
import {
  readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PACKAGE = join(ROOT, 'ds-eds-assets');
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
const IMAGE_PROPS = ['imagePath', 'poster'];
const URL_PROPS = ['assetPathWithQueryParams', 'url'];
const HTML_PROPS = ['description', 'content'];
const HTML_TEXT_BLOCKS = ['ac-text', 'ac-table'];
// Content props a site does not author: the wrapper or the block fills them.
// `sidebar` and `children` are a layout's slots: the blocks nested into it.
const SKIPPED_PROPS = ['picture', 'children', 'sidebar', 'items', 'titleTag'];

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
    } else if (spec.kind === 'enum' && ['startLevel', 'stopLevel'].includes(prop)) {
      add({
        component: 'select', name: prop, label: label(prop), options: [NONE_OPTION, ...HEADINGS],
      }, prop, 'text');
    } else if (spec.kind === 'enum') {
      // container gridVariant/contentWidth: selects, added with the options
    } else if (IMAGE_PROPS.includes(prop) || (prop === 'src' && block === 'ac-image')) {
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

const NEST_FIELD = {
  component: 'text',
  name: 'parentId',
  label: 'Nest inside',
  description: 'The name of the AC Container (or AC Block Table Of Content Layout) this block is '
    + 'moved into; <name>-sidebar for the sidebar of a table of contents layout, under the '
    + 'navigation (toc-sidebar in a section with the table of contents layout). Empty: it stays '
    + 'where it is.',
};
const NAME_FIELD = {
  component: 'text',
  name: 'nestId',
  label: 'Name',
  description: 'The name blocks give in "Nest inside" to be moved into this container.',
};
// The table of contents layout has two places to nest into: the content column (its name) and the
// sidebar under the navigation (its name + "-sidebar").
const TOC_LAYOUT_BLOCK = 'ac-block-table-of-content-layout';
const TOC_NAME_FIELD = {
  ...NAME_FIELD,
  description: 'The name blocks give in "Nest inside": <name> for the content column, '
    + '<name>-sidebar for the sidebar under the navigation (put the AC Table Of Content there). '
    + 'Empty: toc-layout.',
};
const nameFieldOf = (block) => ({ 'ac-container': NAME_FIELD, [TOC_LAYOUT_BLOCK]: TOC_NAME_FIELD })[block];

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
  if (block === 'ac-title') {
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
    .sort(([a], [b]) => (b === meta?.list) - (a === meta?.list))
    .map(([list, s]) => {
      if (block === 'ac-title' && list === 'headingTag') {
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
  // ac-container: its grid and content width are content props of render-container-block, with the
  // choices of options/container.js.
  const containerEnums = block === 'ac-container'
    ? ['gridVariant', 'contentWidth'].map((prop) => selectField(prop, label(prop), containerLists[prop]))
    : [];

  const modelFields = [
    ...content.map((c) => c.field), ...containerEnums, ...options.map((o) => o.field),
    ...(nameFieldOf(block) ? [nameFieldOf(block)] : []), NEST_FIELD,
  ];
  const title = `AC ${block.replace(/^ac-/, '').split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')}`;
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
    if (block === 'ac-list') {
      item.push({ field: selectField('itemStyle', 'Item type', spec.options.listItemType.values), path: 'itemStyle', kind: 'text' });
    }
    // The item's own option lists (a list item's are the card's), after its content.
    const itemNames = item.map((c) => c.field.name);
    const itemOptions = Object.entries(itemSpec.options || {}).map(([list, s]) => {
      const name = fieldName(list, { select: true, base: itemNames });
      const none = takesNone(list, s.values);
      return { list, s, field: selectField(name, label(list), s.values, s.multiple, { none }) };
    });
    const itemConditions = block === 'ac-list'
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
    '// GENERATED by tools/ds-blocks/generate.mjs from ds-eds-assets/contracts/field-contract.json',
    ...wrapLine(`// (${spec.wrapper}). Do not edit: run the generator again after the package changes.`),
  ];
  Object.entries(table).forEach(([name, value]) => {
    lines.push('', `// ${COMMENTS[name]}`, `export const ${name} = ${toJs(value)};`);
  });
  return `${lines.join('\n')}\n`;
}

const written = [];
Object.entries(contract).filter(([, spec]) => !spec.itemOf).forEach(([block, spec]) => {
  const dir = join(ROOT, 'blocks', block);
  mkdirSync(dir, { recursive: true });
  const { json, table } = blockFiles(block, spec);
  writeFileSync(join(dir, `_${block}.json`), `${JSON.stringify(json, null, 2)}\n`);
  writeFileSync(join(dir, `${block}-fields.js`), fieldsModule(block, spec, table));
  const css = join(dir, `${block}.css`);
  if (!existsSync(css)) writeFileSync(css, `/* The CSS of ${block} comes from the design system package (loadBundle in ${block}.js). */\n`);
  written.push(block);
});
console.log(`ds-blocks: ${written.length} blocks (${written.join(', ')})`);

// The section: its model gets the design system's section fields, which decorateContainerSections
// (ds-eds-assets/js/vendor/page-glue.js) reads, and its filter allows every ac-* block.
const sectionFile = join(ROOT, 'models/_section.json');
const section = JSON.parse(readFileSync(sectionFile, 'utf8'));
const sectionFields = [
  {
    component: 'text', name: 'backgroundColor', label: 'Background colour', description: 'A CSS colour, e.g. #f5f2ef',
  },
  {
    component: 'reference', name: 'backgroundImageReference', label: 'Background image', multi: false,
  },
  selectField('gridVariant', 'Grid', containerLists.gridVariant),
  // The table of contents layout (decorateTocSections in scripts/ds.js): the section's
  // AC Table Of Content blocks in a sticky sidebar beside the rest of the section.
  {
    ...selectField('layout', 'Layout', [{ value: 'toc', label: 'Table of contents beside the content' }]),
    description: 'Table of contents: the section\'s AC Table Of Content goes into a sticky sidebar beside the rest of the section',
  },
  // No None: a section without a width is the default width (12).
  selectField('contentWidth', 'Content width', [
    ...containerLists.contentWidth, { value: 'bleed', label: 'Full bleed' },
  ], false, { none: false }),
  selectField('padding', 'Padding (top and bottom)', commonLists.spacingPy),
  selectField('paddingTop', 'Padding top', commonLists.spacingPt),
  selectField('paddingBottom', 'Padding bottom', commonLists.spacingPb),
  selectField('margin', 'Margin (top and bottom)', commonLists.spacingMy),
  selectField('marginTop', 'Margin top', commonLists.spacingMt),
  selectField('marginBottom', 'Margin bottom', commonLists.spacingMb),
];
const sectionModel = section.models.find((m) => m.id === 'section');
const sectionNames = sectionFields.map((f) => f.name);
sectionModel.fields = [
  ...sectionModel.fields.filter((f) => !sectionNames.includes(f.name)), ...sectionFields,
];
const sectionFilter = section.filters.find((f) => f.id === 'section');
sectionFilter.components = [
  ...sectionFilter.components.filter((c) => !written.includes(c)), ...written,
];
writeFileSync(sectionFile, `${JSON.stringify(section, null, 2)}\n`);
console.log(`ds-blocks: models/_section.json has the design system's section fields and allows the ${written.length} ac-* blocks`);
