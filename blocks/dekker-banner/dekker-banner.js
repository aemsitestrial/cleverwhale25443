// dekker-banner: one block of the family, Teaser() as the chosen type.
// The title and titleType fields are folded by the editor into one <hN>; the family reads the
// level from its tag.
// GENERATED once by tools/ds-blocks/generate.mjs from ds-eds-assets-dekker (render-banner);
// the site's from now on: the generator does not write it again. The fields are the model in
// _dekker-banner.json; dekker-banner-fields.js says what each fills.
import renderBanner from '../../ds-eds-assets-dekker/js/vendor/render-banner.js';
import { renderTeaserFamilyBlock } from '../../ds-eds-assets-dekker/js/vendor/teaser-family.js';
import {
  loadBundle, readBlock, replaceBlock, applyNone,
} from '../../scripts/ds-dekker.js';
import * as fields from './dekker-banner-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('dekker-banner');
  const { own, wrapper } = readBlock(block, fields.NAMES);
  const root = renderTeaserFamilyBlock(own, {
    render: (input) => renderBanner(applyNone(input, fields)),
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
