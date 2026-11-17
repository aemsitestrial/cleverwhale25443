// dekker-button: one component, renderButton() of the design system.
// GENERATED once by tools/ds-blocks/generate.mjs from ds-eds-assets-dekker (render-button);
// the site's from now on: the generator does not write it again. The fields are the model in
// _dekker-button.json; dekker-button-fields.js says what each fills.
import renderButton from '../../ds-eds-assets-dekker/js/vendor/render-button.js';
import { decorateComponentBlock } from '../../scripts/ds-dekker.js';
import * as fields from './dekker-button-fields.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  decorateComponentBlock(block, { bundle: 'dekker-button', render: renderButton, fields });
}
