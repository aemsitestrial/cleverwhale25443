// dekker-text: one component, renderText() of the design system.
// GENERATED once by tools/ds-blocks/generate.mjs from ds-eds-assets-dekker (render-text);
// the site's from now on: the generator does not write it again. The fields are the model in
// _dekker-text.json; dekker-text-fields.js says what each fills.
import renderText from '../../ds-eds-assets-dekker/js/vendor/render-text.js';
import { decorateComponentBlock } from '../../scripts/ds-dekker.js';
import * as fields from './dekker-text-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  decorateComponentBlock(block, { bundle: 'dekker-text', render: renderText, fields });
}
