export function isAuthoringContext(root: any): boolean;
export function setWarning(child: any, text: any, className?: string): void;
/**
 * Shows each structure problem the page controllers report as a banner on its element and takes
 * a banner away once its problem is gone. Authoring renders pass this as the runner's onWarning.
 * @param {ParentNode} root
 * @param {Array<{ element: Element, message: string }>} problems
 */
export function showStructureProblems(root: ParentNode, problems: Array<{
    element: Element;
    message: string;
}>): void;
/**
 * Duplicate writes the copy of a nested layout block under the resource of the block around
 * it, so the page renders it as a stray item inside that block instead of as a block of its
 * own. It still carries the layout block's model, which a real item never does. Authoring
 * renders only, like the other warnings. Returns how many copies were flagged.
 */
export function warnMisplacedCopies(root: any, { layoutModels }: {
    layoutModels: any;
}): number;
/**
 * @param {ParentNode} root
 * @param {object} options
 * @param {string} options.layoutSelector Matches the blocks that may nest: the site's layout and
 *   nestable content blocks that carry a parentId, for example
 *   `.block.acg-tabs[data-parent-id],.block.acg-text[data-parent-id]`.
 * @param {string[]} options.layoutModels The models of the layout blocks, for the misplaced-copy
 *   warning.
 * @param {(child: Element, owner: Element) => boolean} [options.canNest] The hook for the place
 *   matrix and the depth cap; it defaults to allowing every nesting.
 */
export default function nestByParent(root: ParentNode, { layoutSelector, layoutModels, canNest }: {
    layoutSelector: string;
    layoutModels: string[];
    canNest?: (child: Element, owner: Element) => boolean;
}): number;
