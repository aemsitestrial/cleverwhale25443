// dekker-table: a table: the rich-text field holds the table, Table() styles it.
// In the Universal Editor the table is written in the field's rich text editor. Its element
// names the filter dekker-table-text (_dekker-table.json),
// whose toolbar has the table tools. An empty table has no element to write in, so in the
// editor the block gives it one.
// GENERATED once by tools/ds-blocks/generate.mjs from ds-eds-assets-dekker (render-table);
// the site's from now on: the generator does not write it again. The fields are the model in
// _dekker-table.json; dekker-table-fields.js says what each fills.
import renderTable from '../../ds-eds-assets-dekker/js/vendor/render-table.js';
import { decorateComponentBlock, isAuthoringContext } from '../../scripts/ds-dekker.js';
import * as fields from './dekker-table-fields.js';

const RTE_FILTER = 'dekker-table-text';

/** @param {HTMLElement} block */
export default function decorate(block) {
  const root = decorateComponentBlock(block, { bundle: 'dekker-table', render: renderTable, fields });
  if (!root || !isAuthoringContext(document)) return;
  let editable = root.querySelector('[data-aue-prop="text"]');
  if (!editable) {
    editable = root.querySelector('.cmp-text');
    if (!editable) return;
    editable.setAttribute('data-aue-prop', 'text');
    editable.setAttribute('data-aue-type', 'richtext');
    editable.setAttribute('data-aue-label', 'Table');
    editable.classList.add('dekker-table-empty');
  }
  editable.setAttribute('data-aue-filter', RTE_FILTER);
}
