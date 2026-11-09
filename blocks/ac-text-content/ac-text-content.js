// ac-text-content: Text content: Teaser() as a teaser, quote or highlight. The wrapper loads the
// bundle of the type.
// The title and titleType fields are folded by the editor into one <hN>; the family reads the level
// from
// its tag. The fields of the other types are hidden by the model's conditions and dropped here too.
import renderTextContent from '../../ds-eds-assets/js/vendor/render-text-content.js';
import { renderTeaserFamilyBlock } from '../../ds-eds-assets/js/vendor/teaser-family.js';
import {
  loadBundle, readBlock, replaceBlock, applyNone,
} from '../../scripts/ds.js';
import * as fields from './ac-text-content-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  const { own, wrapper } = readBlock(block, fields.NAMES);
  const root = renderTeaserFamilyBlock(own, {
    render: (input) => renderTextContent(applyNone(input, fields)),
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
