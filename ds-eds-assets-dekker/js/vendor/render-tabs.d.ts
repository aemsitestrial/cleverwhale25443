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
 * The `content` settings tabs take from where they sit. No Dekker composition holds plain tabs, so
 * every place gives nothing and the tabs render as before; the function is kept so a site calls the
 * same API on every brand package. `startResponsiveTabs` applies the settings to tabs a site did not
 * give them, once the root is in its place (see there).
 *
 * @param {Element} element
 * @returns {{ useBrandClassName?: false, useResponsiveSelect?: false }}
 */
export function tabsSettingsIn(element: Element): {
    useBrandClassName?: false;
    useResponsiveSelect?: false;
};
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
export function startResponsiveTabs(root: HTMLElement): void;
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
export default function renderTabs({ content, options, editable, }?: import('./eds-component.js').RenderInput<TabsContent, TabsOptions, TabsEditable>): HTMLElement;
/**
 * One tab and its panel: the label, and the text as HTML.
 */
export type TabsItem = {
    'cq:panelTitle'?: string;
    content?: string;
};
/**
 * What a site fills in for tabs: `items` are the panels, `useResponsiveSelect` false leaves out the
 * dropdown, and `useBrandClassName` false leaves out the class the brand's tabs stylesheet is
 * scoped under (the design system's Tabs prop of the same name). The component's id and class are
 * the wrapper's, and the spacing is an option.
 */
export type TabsContent = {
    items?: ReadonlyArray<TabsItem>;
    useResponsiveSelect?: boolean;
    useBrandClassName?: boolean;
};
export type TabsOptions = import('./eds-component.js').OptionsInput<(typeof CLASS_LISTS)[number]>;
/**
 * The elements the editable attributes of tabs go on, by key: the item (`items.<n>`), its title
 * and text, and its panel. They are places inside the items, not props of the content, so the keys
 * are not content paths.
 */
export type TabsEditable = `items.${number}` | `items.${number}.${'cq:panelTitle' | 'content' | 'panel'}`;
declare const CLASS_LISTS: readonly ["spacingMy", "spacingMb"];
export {};
