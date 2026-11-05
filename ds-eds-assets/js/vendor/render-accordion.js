// The accordion: Accordion() with the item map it takes, the spacing lists as classes on the root,
// and the behaviour its compiled markup leaves out. The markup must stay importable into classic
// AEM, which owns aria-hidden and aria-expanded and the expanding itself at runtime; Accordion()
// therefore renders every panel aria-hidden="false" and no aria-expanded on the buttons, and
// nothing in the package expands a panel without React. This wrapper sets both attributes for a
// page where every item starts collapsed and toggles the classes the stylesheet keys off.
import { Accordion } from '../accordion.js';
import buildItemsMap from './build-items-map.js';
import { buildTextBody } from './render-panel-item.js';
import { addClasses, setDataAttributes } from './eds-component.js';
import uniqueId from './unique-id.js';

/**
 * One panel: its title, and its text as HTML.
 *
 * @typedef {{ 'cq:panelTitle'?: string, content?: string }} AccordionItem
 */

/**
 * What a site fills in for an accordion. `items` are the panels; `singleExpansion` (true unless it
 * is false) closes the open panel when another opens. The component's id and class are the
 * wrapper's, and the spacing is options.
 *
 * @typedef {{ items?: ReadonlyArray<AccordionItem>, singleExpansion?: boolean }} AccordionContent
 */

// The option lists whose values are classes on the root, in class order.
const CLASS_LISTS = /** @type {const} */ (['spacingMy', 'spacingMb']);

/** @typedef {import('./eds-component.js').OptionsInput<(typeof CLASS_LISTS)[number]>} AccordionOptions */

/**
 * The elements an accordion's editable attributes go on, by key: the item (`items.<n>`), its title
 * and text, and the panel the text sits in. They are places inside the items, not props of the
 * content, so the keys are not content paths.
 *
 * @typedef {`items.${number}` | `items.${number}.${'cq:panelTitle' | 'content' | 'panel'}`} AccordionEditable
 */

const EXPANDED = 'cmp-accordion__button--expanded';
const PANEL_EXPANDED = 'cmp-accordion__panel--expanded';
const PANEL_HIDDEN = 'cmp-accordion__panel--hidden';

/**
 * The item elements of a rendered accordion, in item order.
 *
 * @param {Element} root
 * @returns {Element[]}
 */
export function itemElements(root) {
  const accordion = root.querySelector('.cmp-accordion');
  return accordion ? [...accordion.querySelectorAll('.cmp-accordion__item')] : [];
}

/** @param {AccordionItem} item */
function entryOf(item) {
  const id = uniqueId('text');
  return {
    id,
    props: {
      id,
      'cq:panelTitle': item['cq:panelTitle'] || '',
      ':itemsOrder': ['custom-component'],
      // A style-primary text gives a table in the panel its borders and colours.
      ':items': { 'custom-component': buildTextBody(item.content, true) },
      columnClassNames: {},
    },
  };
}

/** @param {Element} button */
function collapse(button) {
  const panel = /** @type {Element} */ (/** @type {Element} */ (button.closest('.cmp-accordion__item')).querySelector('.cmp-accordion__panel'));
  button.classList.remove(EXPANDED);
  button.setAttribute('aria-expanded', 'false');
  panel.classList.add(PANEL_HIDDEN);
  panel.classList.remove(PANEL_EXPANDED);
  panel.setAttribute('aria-hidden', 'true');
}

/**
 * @param {Element} accordion
 * @param {boolean} singleExpansion
 */
function wireBehaviour(accordion, singleExpansion) {
  accordion.querySelectorAll('.cmp-accordion__button').forEach((button) => {
    button.setAttribute('aria-expanded', 'false');
  });
  accordion.querySelectorAll('.cmp-accordion__panel').forEach((panel) => {
    panel.setAttribute('aria-hidden', 'true');
  });
  // A nested accordion's own handler has already toggled its button; this one ignores it.
  const owns = (/** @type {Element} */ el) => el.closest('.cmp-accordion') === accordion;
  accordion.addEventListener('click', (event) => {
    const button = /** @type {Element} */ (event.target).closest('.cmp-accordion__button');
    if (!button || !owns(button)) return;
    const panel = /** @type {Element} */ (/** @type {Element} */ (button.closest('.cmp-accordion__item')).querySelector('.cmp-accordion__panel'));
    const willExpand = !button.classList.contains(EXPANDED);
    if (singleExpansion && willExpand) {
      [...accordion.querySelectorAll(`.${EXPANDED}`)].filter(owns).forEach(collapse);
    }
    button.classList.toggle(EXPANDED, willExpand);
    button.setAttribute('aria-expanded', String(willExpand));
    panel.classList.toggle(PANEL_EXPANDED, willExpand);
    panel.classList.toggle(PANEL_HIDDEN, !willExpand);
    panel.setAttribute('aria-hidden', String(!willExpand));
  });
}

// The attributes given for the item (`items.<n>`), its title and text (`items.<n>.cq:panelTitle`,
// `items.<n>.content`) and the panel the text sits in (`items.<n>.panel`). A title or text goes
// on its element only when it has a value.
/**
 * @param {Element} root
 * @param {ReadonlyArray<AccordionItem>} items
 * @param {import('./eds-component.js').EditableInput<AccordionEditable>} editable
 */
function applyEditable(root, items, editable) {
  const elements = itemElements(root);
  items.forEach((item, index) => {
    const element = elements[index];
    if (!element) return;
    const key = /** @type {const} */ (`items.${index}`);
    setDataAttributes(element, editable[key]);
    if (item['cq:panelTitle']) setDataAttributes(element.querySelector('.cmp-accordion__title'), editable[`${key}.cq:panelTitle`]);
    if (item.content) setDataAttributes(element.querySelector('.cmp-text'), editable[`${key}.content`]);
    setDataAttributes(element.querySelector('.cmp-accordion__panel'), editable[`${key}.panel`]);
  });
}

/**
 * Renders one accordion. `content.items` are the panels ({ 'cq:panelTitle', content }, `content` being
 * HTML); `content.singleExpansion` (true unless it is false) closes the open panel when another
 * opens. The `spacingMy` and `spacingMb` options are classes on the root. See renderComponent for
 * `options` and `editable`; the keys of `editable` here are given above, at applyEditable.
 *
 * @param {import('./eds-component.js').RenderInput<AccordionContent, AccordionOptions, AccordionEditable>} [input]
 * @returns {HTMLElement}
 */
export default function renderAccordion({
  content = {}, options = {}, editable = {},
} = {}) {
  const items = content.items || [];
  const entries = items.map(entryOf);
  const root = Accordion({
    id: uniqueId('accordion'),
    className: 'ac-core-accordion',
    typeAccordion: 'default',
    expandedItems: [],
    // AccordionProps requires these three, and Accordion() reads none of them: the expanding is
    // wireBehaviour's.
    singleExpansion: content.singleExpansion !== false,
    ':type': 'ac-core/components/accordion',
    dataLayer: {},
    ...buildItemsMap(entries),
  });
  addClasses(root, [options.spacingMy, options.spacingMb]);
  wireBehaviour(
    /** @type {Element} */ (root.querySelector('.cmp-accordion')),
    content.singleExpansion !== false,
  );
  applyEditable(root, items, editable);
  return root;
}
