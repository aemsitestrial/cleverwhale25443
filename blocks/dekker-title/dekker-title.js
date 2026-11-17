// dekker-title: one heading, Title().
// The model's title and titleType fields are folded by the editor into one <hN> element, so
// the level is read from the heading's tag (h2 when the title is plain text) and fills the
// headingTag list.
// GENERATED once by tools/ds-blocks/generate.mjs from ds-eds-assets-dekker (render-title);
// the site's from now on: the generator does not write it again. The fields are the model in
// _dekker-title.json; dekker-title-fields.js says what each fills.
import renderTitle from '../../ds-eds-assets-dekker/js/vendor/render-title.js';
import { fieldsByName, valuesByName } from '../../ds-eds-assets-dekker/js/vendor/field-rows.js';
import { componentInput } from '../../ds-eds-assets-dekker/js/vendor/component-block.js';
import {
  loadBundle, readBlock, replaceBlock, applyNone,
} from '../../scripts/ds-dekker.js';
import * as fields from './dekker-title-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('dekker-title');
  const { own, wrapper } = readBlock(block, fields.NAMES);
  const found = fieldsByName(own, fields.NAMES);
  const values = valuesByName(found, fields.KINDS);
  const heading = found.title?.cell?.querySelector('h1,h2,h3,h4,h5,h6');
  if (heading) values.titleType = heading.localName;
  const root = renderTitle({
    ...applyNone(componentInput(found, values, {
      contentFields: fields.CONTENT_FIELDS,
      optionFields: fields.OPTION_FIELDS,
      editableProps: fields.EDITABLE_PROPS,
    }), fields),
    loadBundle,
  });
  replaceBlock(block, root, wrapper);
}
