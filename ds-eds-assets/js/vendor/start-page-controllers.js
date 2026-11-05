// Starts the page controllers of this package: the entries of page-controller-list.js that apply to
// `root`. Call it once the page's blocks are decorated and nested, and again whenever markup is
// added (a block that builds its markup late); an entry that has started is not started again.
// contracts/page-controllers.md lists the entries.
import list from './page-controller-list.js';
import { runPageControllers } from './page-controllers.js';

/**
 * @param {Document | Element} [root] The page, or the block that was just built.
 * @param {import('./page-controllers.js').PageControllerOptions} [options]
 * @returns {Promise<void>}
 */
export function startPageControllers(root = document, { inEditor = false, onWarning } = {}) {
  return runPageControllers(list, root, { inEditor, onWarning });
}

export default startPageControllers;
