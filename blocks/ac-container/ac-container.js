// ac-container: the design system's container (ContainerLayout) with its grid, content width,
// theme,
// spacing and composition styles. It holds the blocks that name it in their "Nest inside" field
// (scripts.js nests them once the blocks are decorated, nest-by-parent.js): its "Name" field is the
// name they give. A composition style (Block Containers, Filter block, Carousel, TOC) loads its
// bundle.
import renderContainerBlock from '../../ds-eds-assets/js/vendor/render-container-block.js';
import { fieldsByName, valuesByName } from '../../ds-eds-assets/js/vendor/field-rows.js';
import { componentInput } from '../../ds-eds-assets/js/vendor/component-block.js';
import { loadBundle, readBlock, replaceBlock } from '../../scripts/ds.js';
import * as fields from './ac-container-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  // ac-container has no bundle of its own: its cards use ac-card.
  loadBundle('ac-card');
  const { own, wrapper } = readBlock(block, fields.NAMES);
  const found = fieldsByName(own, fields.NAMES);
  const input = componentInput(found, valuesByName(found, fields.KINDS), {
    contentFields: fields.CONTENT_FIELDS,
    optionFields: fields.OPTION_FIELDS,
    editableProps: [],
  });
  const { root } = renderContainerBlock({
    ...input, content: { ...input.content, children: [] }, loadBundle,
  });
  replaceBlock(block, root, wrapper);
}
