/*
 * Shows the structure problems the page controllers report (see page-controllers.js and
 * start-page-controllers.js) as a visible banner on the element each problem belongs to, in an
 * authoring/editor render. A site passes showStructureProblems as the runner's onWarning there;
 * a published page never calls it.
 */
const STRUCTURE_WARNING = 'twf-structure-warning';

function setWarning(element, text) {
  let warning = element.querySelector(`:scope > .${STRUCTURE_WARNING}`);
  if (!warning) {
    warning = document.createElement('div');
    warning.className = STRUCTURE_WARNING;
    warning.setAttribute('contenteditable', 'false');
    warning.style.cssText = 'display:block;background:#fff3cd;color:#664d03;'
      + 'border:1px solid #ffe69c;border-radius:4px;padding:8px 12px;'
      + 'margin:0 0 8px;font:600 13px/1.4 sans-serif;';
    element.prepend(warning);
  }
  // Rewriting identical text still replaces the text node, which the editor's
  // MutationObserver sees as a change and answers with another run.
  if (warning.textContent !== text) warning.textContent = text;
}

/**
 * Shows each structure problem the page controllers report as a banner on its element and takes
 * a banner away once its problem is gone. Authoring renders pass this as the runner's onWarning.
 * @param {ParentNode} root
 * @param {Array<{ element: Element, message: string }>} problems
 */
export function showStructureProblems(root, problems) {
  root.querySelectorAll(`.${STRUCTURE_WARNING}`).forEach((banner) => {
    if (!problems.some(({ element }) => element === banner.parentElement)) banner.remove();
  });
  problems.forEach(({ element, message }) => setWarning(element, message));
}
