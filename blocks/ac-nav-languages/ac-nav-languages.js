// ac-nav-languages: a block of the nav page (/nav), which blocks/header/header.js reads
// (scripts/nav-blocks.js) to build the header.
// On the nav page itself it shows its fields as a labelled list, so they can be edited.
import { decorateNavConfig } from '../../scripts/chrome.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  decorateNavConfig(block, 'AC Nav Languages');
}
