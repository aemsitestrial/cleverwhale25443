// ac-table: A table: the rich-text field holds the table, Table() from the design system styles it.
// The fields are the model in _ac-table.json; ac-table-fields.js says what each fills.
import renderTable from '../../ds-eds-assets/js/vendor/render-table.js';
import { decorateComponentBlock } from '../../scripts/ds.js';
import * as fields from './ac-table-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  decorateComponentBlock(block, { bundle: 'ac-table', render: renderTable, fields });
}
