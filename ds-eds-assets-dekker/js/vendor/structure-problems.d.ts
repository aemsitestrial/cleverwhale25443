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
