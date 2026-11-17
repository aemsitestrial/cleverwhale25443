// The tabs: Tabs() with the item map it takes, the classes of the spacing lists on the root, and
// the behaviour its compiled markup leaves out (activating a tab by click and keyboard; the
// dropdown narrow tabs turn into starts with startResponsiveTabs once the root is in the page).
import { Tabs } from '../tabs.js';
import { Tab as TabsController } from './tabs-controller.js';
import buildItemsMap from './build-items-map.js';
import { buildTextBody } from './render-panel-item.js';
import { addClasses, setDataAttributes } from './eds-component.js';
import uniqueId from './unique-id.js';

// The class the brand's tabs stylesheet is scoped under.
const BASE_CLASS = 'ds-brand-tabs';
const CLASS_LISTS = /** @type {const} */ (['spacingMy', 'spacingMb']);

/**
 * One tab and its panel: the label, and the text as HTML.
 *
 * @typedef {{ 'cq:panelTitle'?: string, content?: string }} TabsItem
 */

/**
 * What a site fills in for tabs: `items` are the panels, `useResponsiveSelect` false leaves out the
 * dropdown, and `useBrandClassName` false leaves out the class the brand's tabs stylesheet is
 * scoped under (the design system's Tabs prop of the same name). The component's id and class are
 * the wrapper's, and the spacing is an option.
 *
 * @typedef {{
 *   items?: ReadonlyArray<TabsItem>, useResponsiveSelect?: boolean, useBrandClassName?: boolean,
 * }} TabsContent
 */

/** @typedef {import('./eds-component.js').OptionsInput<(typeof CLASS_LISTS)[number]>} TabsOptions */

/**
 * The elements the editable attributes of tabs go on, by key: the item (`items.<n>`), its title
 * and text, and its panel. They are places inside the items, not props of the content, so the keys
 * are not content paths.
 *
 * @typedef {`items.${number}` | `items.${number}.${'cq:panelTitle' | 'content' | 'panel'}`} TabsEditable
 */
const RESPONSIVE_HOOK = 'ds-brand-responsive-select-run-js';
const CONTAINER_QUERY = 'ds-container-query';

// The controller writes a tab's markup into the dropdown button as text, so a label with an
// ampersand or a wrapping element would show as source. This gives it the label's text.
class DropdownTabs extends TabsController {
  // eslint-disable-next-line no-underscore-dangle
  _getParsedFirstTabItem(index) {
    const link = this.tabLinks[index || 0];
    return { id: link.getAttribute('id'), text: link.textContent.trim() };
  }
}

/**
 * The tab and panel elements of a rendered tabs, in item order.
 *
 * @param {Element} root
 * @returns {{ tab: Element, panel: Element }[]}
 */
export function itemElements(root) {
  const tabs = [...root.querySelectorAll('.cmp-tabs__tablist > *')];
  const panels = [...root.querySelectorAll('.cmp-tabs__tabpanel')];
  return tabs.map((tab, index) => ({ tab, panel: panels[index] }));
}

/** @param {TabsItem} item */
function entryOf(item) {
  const id = uniqueId('titem');
  return {
    id,
    props: {
      'cq:panelTitle': item['cq:panelTitle'] || '',
      ':itemsOrder': ['custom-component'],
      ':items': { 'custom-component': buildTextBody(item.content) },
      columnClassNames: {},
      // TabItem requires these three, and Tabs() reads none of them.
      gridClassNames: '',
      columnCount: 1,
      ':type': 'ac-core/components/tabs/item',
    },
  };
}

// What the content of each rendered tabs said for itself: a value given there wins over the
// settings the place gives (startResponsiveTabs).
/** @type {WeakMap<Element, { useBrandClassName: boolean, useResponsiveSelect: boolean }>} */
const given = new WeakMap();

/**
 * The `content` settings tabs take from where they sit. No Dekker composition holds plain tabs, so
 * every place gives nothing and the tabs render as before; the function is kept so a site calls the
 * same API on every brand package. `startResponsiveTabs` applies the settings to tabs a site did not
 * give them, once the root is in its place (see there).
 *
 * @param {Element} element
 * @returns {{ useBrandClassName?: false, useResponsiveSelect?: false }}
 */
// eslint-disable-next-line no-unused-vars
export function tabsSettingsIn(element) {
  return {};
}

// The brand's Tabs policy puts the responsive hook and the container query on every tabs, so the
// dropdown reads the width of the tabs themselves, not of the window. A block can be decorated
// while its section is still hidden, so the width reads 0 and the dropdown would mount at every
// window width. The controller then starts once the tabs have a width. Constructing it starts it.
/** @param {HTMLElement} tabs */
function startDropdown(tabs) {
  const start = () => new DropdownTabs({ el: tabs });
  if (tabs.offsetWidth > 0) {
    start();
    return;
  }
  if (typeof ResizeObserver === 'undefined') return;
  const observer = new ResizeObserver(() => {
    if (!tabs.offsetWidth) return;
    observer.disconnect();
    start();
  });
  observer.observe(tabs);
}

/**
 * Starts the dropdown the tabs turn into when they are narrower than a phone. It measures the
 * tabs, so the caller runs it once the root is in its place in the page; a detached root has no
 * width. Tabs rendered with `useResponsiveSelect: false` carry no hook and start nothing.
 *
 * It is also the step that applies the settings of the place (tabsSettingsIn), which give nothing
 * in the Dekker package, unless its content gave `useBrandClassName` or `useResponsiveSelect` itself.
 * Rendering returns a detached root, so the place is not known earlier. Call it in the same task
 * that places the root, before the browser paints.
 *
 * @param {HTMLElement} root
 */
export function startResponsiveTabs(root) {
  const said = given.get(root);
  const place = tabsSettingsIn(root);
  if (place.useBrandClassName === false && !said?.useBrandClassName) root.classList.remove(BASE_CLASS);
  if (place.useResponsiveSelect === false && !said?.useResponsiveSelect) root.classList.remove(RESPONSIVE_HOOK, CONTAINER_QUERY);
  if (root.classList.contains(RESPONSIVE_HOOK)) startDropdown(root);
}

// The one place a tab becomes active, for click and keyboard alike. Tabs() renders the active
// panel with tabindex 1, which jumps the tab order ahead of the page; a panel with no focusable
// content of its own sits in the order as 0, and only the visible one.
/** @param {Element} root */
function wireBehaviour(root) {
  const cmpTabs = /** @type {Element} */ (root.querySelector('.cmp-tabs'));
  const tablist = /** @type {Element} */ (root.querySelector('.cmp-tabs__tablist'));
  const tabEls = [...tablist.children];
  const panelEls = [...cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')];

  /** @param {Element} tab */
  function activate(tab) {
    const targetPanel = cmpTabs.querySelector(`#${tab.getAttribute('aria-controls')}`);
    tabEls.forEach((otherTab) => {
      const isTarget = otherTab === tab;
      otherTab.classList.toggle('cmp-tabs__tab--active', isTarget);
      otherTab.setAttribute('aria-selected', String(isTarget));
      otherTab.setAttribute('tabindex', isTarget ? '0' : '-1');
    });
    panelEls.forEach((otherPanel) => {
      const isTarget = otherPanel === targetPanel;
      otherPanel.classList.toggle('cmp-tabs__tabpanel--active', isTarget);
      otherPanel.setAttribute('aria-hidden', String(!isTarget));
      if (isTarget) otherPanel.setAttribute('tabindex', '0');
      else otherPanel.removeAttribute('tabindex');
    });
  }
  const activeTab = tabEls.find((tab) => tab.classList.contains('cmp-tabs__tab--active'));
  if (activeTab) activate(activeTab);

  tablist.addEventListener('click', (event) => {
    const tab = /** @type {Element} */ (event.target).closest('.cmp-tabs__tab');
    if (!tab || !tablist.contains(tab)) return;
    activate(tab);
  });

  // Arrow keys, Home and End move between tabs and activate the one they land on; Enter and Space
  // activate the focused tab. The tabs are list items, so nothing does this natively.
  tablist.addEventListener('keydown', (event) => {
    const { key } = /** @type {KeyboardEvent} */ (event);
    const tab = /** @type {Element} */ (event.target).closest('.cmp-tabs__tab');
    if (!tab || !tablist.contains(tab)) return;
    const index = tabEls.indexOf(tab);
    const last = tabEls.length - 1;
    /** @type {Element} */
    let target;
    if (key === 'ArrowRight') target = tabEls[index === last ? 0 : index + 1];
    else if (key === 'ArrowLeft') target = tabEls[index === 0 ? last : index - 1];
    else if (key === 'Home') [target] = tabEls;
    else if (key === 'End') target = tabEls[last];
    else if (key === 'Enter' || key === ' ') target = tab;
    else return;
    event.preventDefault();
    activate(target);
    /** @type {HTMLElement} */ (target).focus();
  });
}

// The attributes given for the item (`items.<n>`), its title and text (`items.<n>.cq:panelTitle`,
// `items.<n>.content`) and its panel (`items.<n>.panel`). The item is its panel: the tab sits in
// the tab list, outside it, so the title's label is the one element that can carry the item's
// resource next to the title's own attributes. A title or text goes on its element only when it
// has a value.
/**
 * @param {Element} root
 * @param {ReadonlyArray<TabsItem>} items
 * @param {import('./eds-component.js').EditableInput<TabsEditable>} editable
 */
function applyEditable(root, items, editable) {
  const elements = itemElements(root);
  items.forEach((item, index) => {
    const { tab, panel } = elements[index] || {};
    if (!tab || !panel) return;
    const key = /** @type {const} */ (`items.${index}`);
    setDataAttributes(panel, editable[key]);
    setDataAttributes(panel, editable[`${key}.panel`]);
    if (item['cq:panelTitle']) setDataAttributes(tab.querySelector('.cmp-tabs__tab-label'), editable[`${key}.cq:panelTitle`]);
    if (item.content) setDataAttributes(panel.querySelector('.cmp-text'), editable[`${key}.content`]);
  });
}

// The tab's content goes inside a label, so the label can carry the editable attributes of the
// title on its own.
/** @param {Element} root */
function wrapLabels(root) {
  root.querySelectorAll('.cmp-tabs__tablist > *').forEach((tab) => {
    const label = document.createElement('span');
    label.className = 'cmp-tabs__tab-label';
    label.append(...tab.childNodes);
    tab.append(label);
  });
}

/**
 * Renders one tabs. `content.items` are the panels ({ 'cq:panelTitle', content }, `content` being
 * HTML). The root carries the responsive hook and the container query, as the brand's Tabs policy
 * gives them, unless `content.useResponsiveSelect` is false, and the brand class `ds-brand-tabs`,
 * unless `content.useBrandClassName` is false. The `spacingMy` and `spacingMb`
 * options are classes on the root. See renderComponent for `options`
 * and `editable`; the keys of `editable` here are given above, at applyEditable.
 *
 * @param {import('./eds-component.js').RenderInput<TabsContent, TabsOptions, TabsEditable>} [input]
 * @returns {HTMLElement}
 */
export default function renderTabs({
  content = {}, options = {}, editable = {},
} = {}) {
  const items = content.items || [];
  const entries = items.map(entryOf);
  const responsive = content.useResponsiveSelect !== false;

  const classHolder = document.createElement('div');
  if (content.useBrandClassName !== false) classHolder.className = BASE_CLASS;
  addClasses(classHolder, CLASS_LISTS.map((list) => options[list]));

  const root = Tabs({
    id: uniqueId('tabs'),
    className: classHolder.className,
    activeItem: entries[0]?.id,
    useResponsiveSelect: responsive,
    useWindowResizeType: false,
    useResponsiveType: responsive ? 'container' : 'window',
    ':type': 'ac-core/components/tabs',
    dataLayer: {},
    ...buildItemsMap(entries),
  });
  given.set(root, {
    useBrandClassName: content.useBrandClassName !== undefined,
    useResponsiveSelect: content.useResponsiveSelect !== undefined,
  });
  wrapLabels(root);
  wireBehaviour(root);
  applyEditable(root, items, editable);
  return root;
}
