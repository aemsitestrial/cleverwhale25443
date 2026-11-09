// ac-block-table-of-content-layout: BlockTableOfContentLayout() from the design system, a
// sticky sidebar beside a content column. Both are places other blocks are nested into
// ("Nest inside"; scripts.js nests them once the blocks are decorated, nest-by-parent.js): the
// block's "Name" (toc-layout when empty) is the content column, and "<name>-sidebar" the
// sidebar, where the AC Table Of Content goes, and any card under it. The toc-layout page
// controller makes the sidebar sticky and marks the heading in view.
import renderBlockTableOfContentLayout, {
  layoutSlots,
} from '../../ds-eds-assets/js/vendor/render-block-table-of-content-layout.js';
import { fieldsByName, valuesByName } from '../../ds-eds-assets/js/vendor/field-rows.js';
import { componentInput } from '../../ds-eds-assets/js/vendor/component-block.js';
import {
  loadBundle, readBlock, replaceBlock, applyNone,
} from '../../scripts/ds.js';
import * as fields from './ac-block-table-of-content-layout-fields.js';

export const DEFAULT_NAME = 'toc-layout';

/** @param {HTMLElement} block */
export default function decorate(block) {
  const { own, wrapper } = readBlock(block, fields.NAMES);
  // The name goes on the two places, not on the block: nest-by-parent.js would put the blocks
  // that name the block into its first grid, which is the layout's own.
  const name = block.dataset.nestId || DEFAULT_NAME;
  delete block.dataset.nestId;
  const found = fieldsByName(own, fields.NAMES);
  const input = applyNone(componentInput(found, valuesByName(found, fields.KINDS), {
    contentFields: fields.CONTENT_FIELDS,
    optionFields: fields.OPTION_FIELDS,
    editableProps: [],
  }), fields);
  const root = renderBlockTableOfContentLayout({ ...input, loadBundle });
  const { sidebar, content } = layoutSlots(root);
  if (content) content.dataset.nestId = name;
  if (sidebar) sidebar.dataset.nestId = `${name}-sidebar`;
  replaceBlock(block, root, wrapper);
}
