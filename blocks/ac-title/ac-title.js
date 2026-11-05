// ac-title: one heading, Title() from the design system. The model's title and titleType fields are
// folded by the editor into one <hN> element, so the level is read from the heading's tag (h2 when
// the title is plain text) and fills the headingTag list.
import renderTitle from '../../ds-eds-assets/js/vendor/render-title.js';
import { fieldsByName, valuesByName } from '../../ds-eds-assets/js/vendor/field-rows.js';
import { componentInput } from '../../ds-eds-assets/js/vendor/component-block.js';
import { loadBundle, readBlock, replaceBlock } from '../../scripts/ds.js';
import * as fields from './ac-title-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-title');
  const { own, wrapper } = readBlock(block, fields.NAMES);
  const found = fieldsByName(own, fields.NAMES);
  const values = valuesByName(found, fields.KINDS);
  const heading = found.title?.cell?.querySelector('h1,h2,h3,h4,h5,h6');
  if (heading) values.titleType = heading.localName;
  const root = renderTitle({
    ...componentInput(found, values, {
      contentFields: fields.CONTENT_FIELDS,
      optionFields: fields.OPTION_FIELDS,
      editableProps: fields.EDITABLE_PROPS,
    }),
    loadBundle,
  });
  replaceBlock(block, root, wrapper);
}
