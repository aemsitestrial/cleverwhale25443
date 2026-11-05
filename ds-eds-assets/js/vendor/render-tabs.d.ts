/**
 * One tab and its panel: the label, and the text as HTML.
 *
 * @typedef {{ 'cq:panelTitle'?: string, content?: string }} TabsItem
 */
/**
 * What a site fills in for tabs: `items` are the panels, and `useResponsiveSelect` false leaves out
 * the dropdown the Tabs policy of AEM gives tabs by default. The component's id and class are the
 * wrapper's, and the theme, spacing and layout are options.
 *
 * @typedef {{ items?: ReadonlyArray<TabsItem>, useResponsiveSelect?: boolean }} TabsContent
 */
/** @typedef {import('./eds-component.js').OptionsInput<(typeof CLASS_LISTS)[number]>} TabsOptions */
/**
 * The elements the editable attributes of tabs go on, by key: the item (`items.<n>`), its title
 * and text, and its panel. They are places inside the items, not props of the content, so the keys
 * are not content paths.
 *
 * @typedef {`items.${number}` | `items.${number}.${'cq:panelTitle' | 'content' | 'panel'}`} TabsEditable
 */
/**
 * The tab and panel elements of a rendered tabs, in item order.
 *
 * @param {Element} root
 * @returns {{ tab: Element, panel: Element }[]}
 */
export function itemElements(root: Element): {
    tab: Element;
    panel: Element;
}[];
/**
 * Starts the dropdown the responsive layout turns the tabs into. It measures the tabs, so the
 * caller runs it once the root is in the page; a detached root has no width.
 *
 * @param {HTMLElement} root
 */
export function startResponsiveTabs(root: HTMLElement): void;
/**
 * Renders one tabs. `content.items` are the panels ({ 'cq:panelTitle', content }, `content` being
 * HTML). The `themeType`, `spacingMy`, `spacingMb` and `tabsLayout` options are classes on the
 * root; with none of them chosen the root gets the classes the Tabs policy of AEM gives, unless
 * `content.useResponsiveSelect` is false. See
 * renderComponent for `options` and `editable`; the keys of `editable` here are given above, at
 * applyEditable.
 *
 * @param {import('./eds-component.js').RenderInput<TabsContent, TabsOptions, TabsEditable>} [input]
 * @returns {HTMLElement}
 */
export default function renderTabs({ content, options, editable, }?: import('./eds-component.js').RenderInput<TabsContent, TabsOptions, TabsEditable>): HTMLElement;
/**
 * One tab and its panel: the label, and the text as HTML.
 */
export type TabsItem = {
    'cq:panelTitle'?: string;
    content?: string;
};
/**
 * What a site fills in for tabs: `items` are the panels, and `useResponsiveSelect` false leaves out
 * the dropdown the Tabs policy of AEM gives tabs by default. The component's id and class are the
 * wrapper's, and the theme, spacing and layout are options.
 */
export type TabsContent = {
    items?: ReadonlyArray<TabsItem>;
    useResponsiveSelect?: boolean;
};
export type TabsOptions = import('./eds-component.js').OptionsInput<(typeof CLASS_LISTS)[number]>;
/**
 * The elements the editable attributes of tabs go on, by key: the item (`items.<n>`), its title
 * and text, and its panel. They are places inside the items, not props of the content, so the keys
 * are not content paths.
 */
export type TabsEditable = `items.${number}` | `items.${number}.${'cq:panelTitle' | 'content' | 'panel'}`;
declare const CLASS_LISTS: readonly ["themeType", "spacingMy", "spacingMb", "tabsLayout"];
export {};
