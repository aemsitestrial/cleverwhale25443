// ac-card: One card: Teaser() as the chosen card type. The block loads ac-card; the wrapper loads
// the bundle of a type that has its own.
// The title and titleType fields are folded by the editor into one <hN>; the family reads the level
// from
// its tag. The fields of the other types are hidden by the model's conditions and dropped here too.
import renderCard from '../../ds-eds-assets/js/vendor/render-card.js';
import { renderTeaserFamilyBlock } from '../../ds-eds-assets/js/vendor/teaser-family.js';
import { loadBundle, readBlock, replaceBlock } from '../../scripts/ds.js';
import * as fields from './ac-card-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-card');
  const { own, wrapper } = readBlock(block, fields.NAMES);
  const root = renderTeaserFamilyBlock(own, {
    render: renderCard,
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
