/**
 * The item elements of a rendered accordion, in item order.
 *
 * @param {Element} root
 * @returns {Element[]}
 */
export function itemElements(root: Element): Element[];
/**
 * Renders one accordion. `content.items` are the panels ({ 'cq:panelTitle', content }, `content` being
 * HTML); `content.singleExpansion` (true unless it is false) closes the open panel when another
 * opens. The `spacingMy` and `spacingMb` options are classes on the root. See renderComponent for
 * `options` and `editable`; the keys of `editable` here are given above, at applyEditable.
 *
 * @param {import('./eds-component.js').RenderInput<AccordionContent, AccordionOptions, AccordionEditable>} [input]
 * @returns {HTMLElement}
 */
export default function renderAccordion({ content, options, editable, }?: import('./eds-component.js').RenderInput<AccordionContent, AccordionOptions, AccordionEditable>): HTMLElement;
/**
 * One panel: its title, and its text as HTML.
 */
export type AccordionItem = {
    'cq:panelTitle'?: string;
    content?: string;
};
/**
 * What a site fills in for an accordion. `items` are the panels; `singleExpansion` (true unless it
 * is false) closes the open panel when another opens. The component's id and class are the
 * wrapper's, and the spacing is options.
 */
export type AccordionContent = {
    items?: ReadonlyArray<AccordionItem>;
    singleExpansion?: boolean;
};
export type AccordionOptions = import('./eds-component.js').OptionsInput<(typeof CLASS_LISTS)[number]>;
/**
 * The elements an accordion's editable attributes go on, by key: the item (`items.<n>`), its title
 * and text, and the panel the text sits in. They are places inside the items, not props of the
 * content, so the keys are not content paths.
 */
export type AccordionEditable = `items.${number}` | `items.${number}.${'cq:panelTitle' | 'content' | 'panel'}`;
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
declare const CLASS_LISTS: readonly ["spacingMy", "spacingMb"];
export {};
