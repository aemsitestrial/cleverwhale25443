/**
 * @param {Document | Element} [root] The page, or the block that was just built.
 * @param {import('./page-controllers.js').PageControllerOptions} [options]
 * @returns {Promise<void>}
 */
export function startPageControllers(root?: Document | Element, { inEditor, onWarning }?: import('./page-controllers.js').PageControllerOptions): Promise<void>;
export default startPageControllers;
