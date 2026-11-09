// ac-block-table-of-content-layout: BlockTableOfContentLayout() from the design system, a sticky
// sidebar beside a content column, built from what follows the block in its section
// (arrangeTocLayoutBlocks in scripts/ds.js, which builds the layout before the blocks load): the
// blocks between it and the AC Table Of Content go into the sidebar under the navigation, the
// AC Table Of Content to the top of the sidebar, and what follows it into the content column.
// The toc-layout page controller makes the sidebar sticky and marks the heading in view.
//
// Blocks elsewhere on the page can still be nested in by name ("Nest inside"): the block's "Name"
// (toc-layout when empty) is the content column, "<name>-sidebar" the sidebar.
//
// The block itself shows nothing on the page; in the Universal Editor it is a small label at the
// top of the content column, so its fields can be opened.
import { fieldsByName, valuesByName } from '../../ds-eds-assets/js/vendor/field-rows.js';
import { componentInput } from '../../ds-eds-assets/js/vendor/component-block.js';
import { isAuthoringContext } from '../../ds-eds-assets/js/vendor/nest-by-parent.js';
import {
  readBlock, replaceBlock, applyNone, applyTocLayoutSettings,
} from '../../scripts/ds.js';
import * as fields from './ac-block-table-of-content-layout-fields.js';

export const DEFAULT_NAME = 'toc-layout';

/** @param {HTMLElement} block */
export default function decorate(block) {
  const { own, wrapper } = readBlock(block, fields.NAMES);
  // The name goes on the layout's two places, not on the block (applyTocLayoutSettings).
  block.dataset.layoutName = block.dataset.nestId || DEFAULT_NAME;
  delete block.dataset.nestId;
  const found = fieldsByName(own, fields.NAMES);
  const { options } = applyNone(componentInput(found, valuesByName(found, fields.KINDS), {
    contentFields: fields.CONTENT_FIELDS,
    optionFields: fields.OPTION_FIELDS,
    editableProps: [],
  }), fields);
  block.dataset.layoutClasses = Object.values(options).filter(Boolean).join(' ');

  const label = document.createElement('div');
  label.className = 'ac-toc-layout-marker';
  if (isAuthoringContext(document)) {
    label.textContent = 'Table of contents layout: the blocks between this one and the table of '
      + 'contents go under the navigation, the blocks after the table of contents into the content.';
  }
  replaceBlock(block, label, wrapper);
  applyTocLayoutSettings(block);
}
