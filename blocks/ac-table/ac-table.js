// ac-table: A table: the rich-text field holds the table, Table() from the design system styles it.
// The fields are the model in _ac-table.json; ac-table-fields.js says what each fills.
//
// In the Universal Editor the table is written in the field's rich text editor. Its element names
// the filter ac-table-text (_ac-table.json), whose toolbar has the table tools: without it the
// editor offers no table. An empty table has no element to write in, so in the editor the block
// gives it one.
import renderTable from '../../ds-eds-assets/js/vendor/render-table.js';
import { isAuthoringContext } from '../../ds-eds-assets/js/vendor/nest-by-parent.js';
import { decorateComponentBlock } from '../../scripts/ds.js';
import * as fields from './ac-table-fields.js';

const RTE_FILTER = 'ac-table-text';

/** @param {HTMLElement} block */
export default function decorate(block) {
  const root = decorateComponentBlock(block, { bundle: 'ac-table', render: renderTable, fields });
  if (!root || !isAuthoringContext(document)) return;
  let editable = root.querySelector('[data-aue-prop="text"]');
  if (!editable) {
    editable = root.querySelector('.cmp-text');
    if (!editable) return;
    editable.setAttribute('data-aue-prop', 'text');
    editable.setAttribute('data-aue-type', 'richtext');
    editable.setAttribute('data-aue-label', 'Table');
    editable.classList.add('ac-table-empty');
  }
  editable.setAttribute('data-aue-filter', RTE_FILTER);
}
