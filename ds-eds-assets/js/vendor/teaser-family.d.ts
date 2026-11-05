/**
 * The design system's input for a Teaser-based block: componentInput with the block's content
 * fields, and the <picture> the image field holds when it holds one.
 */
/**
 * @template {Record<string, any>} O
 * @template {TeaserPath} E
 * @param {Record<string, any>} fields
 * @param {Record<string, any>} values
 * @param {{
 *   contentFields: Record<string, TeaserPath>,
 *   optionFields: Record<string, { readonly list: keyof O & string }>,
 *   editableProps: ReadonlyArray<E>,
 * }} wiring
 * @returns {import('./component-block.js').Input<TeaserContent, O, E>}
 */
export function teaserFamilyInput<O extends Record<string, any>, E extends "link" | "picture" | "title" | "description" | "titleTag" | "pretitle" | "date" | "imagePath" | "actions" | "link.url" | `actions.${number}` | `actions.${number}.link` | `actions.${number}.title` | `actions.${number}.link.url`>(fields: Record<string, any>, values: Record<string, any>, { contentFields, optionFields, editableProps }: {
    contentFields: Record<string, TeaserPath>;
    optionFields: Record<string, {
        readonly list: keyof O & string;
    }>;
    editableProps: readonly E[];
}): import("./component-block.js").Input<import("./eds-family.js").TeaserContent, O, E>;
/**
 * Renders one family member from a block's rows: reads the cells, hands them to `render` (the
 * design system's wrapper) under design-system names and records the fields for the test
 * template's panel. The block moves its own instrumentation onto the rendered root.
 *
 *   names, kinds   the fields in positional order and how each cell is read (fieldsByName,
 *                  valuesByName)
 *   contentFields  field -> the content prop it fills (see componentInput); the block's own table
 *   optionFields   the block model's OPTION_FIELDS in its generated <block>-fields.js
 *   conditions     the block model's FIELD_CONDITIONS: the option fields it hides are dropped
 *                  before the design system is called
 *   editableProps  the wrapper's exported editable props
 *   typeMeta       the family's typeMeta from the package's options module
 *   loadBundle     optional: (file) -> loads a bundle of the package
 */
/**
 * @template {Record<string, any>} O
 * @template {TeaserPath} E
 * @param {Array<any>} rows
 * @param {{
 *   render: (input: import('./component-block.js').Input<TeaserContent, O, E>) => HTMLElement,
 *   names: string[], kinds: Record<string, string>, conditions: Record<string, any>,
 *   contentFields: Record<string, TeaserPath>,
 *   optionFields: Record<string, { readonly list: keyof O & string }>,
 *   editableProps: ReadonlyArray<E>,
 *   typeMeta: { list: string, default: string },
 *   loadBundle?: (file: string) => unknown,
 * }} block
 */
export function renderTeaserFamilyBlock<O extends Record<string, any>, E extends "link" | "picture" | "title" | "description" | "titleTag" | "pretitle" | "date" | "imagePath" | "actions" | "link.url" | `actions.${number}` | `actions.${number}.link` | `actions.${number}.title` | `actions.${number}.link.url`>(rows: Array<any>, { render, names, kinds, contentFields, optionFields, conditions, editableProps, typeMeta, loadBundle, }: {
    render: (input: import("./component-block.js").Input<import("./eds-family.js").TeaserContent, O, E>) => HTMLElement;
    names: string[];
    kinds: Record<string, string>;
    conditions: Record<string, any>;
    contentFields: Record<string, TeaserPath>;
    optionFields: Record<string, {
        readonly list: keyof O & string;
    }>;
    editableProps: readonly E[];
    typeMeta: {
        list: string;
        default: string;
    };
    loadBundle?: (file: string) => unknown;
}): HTMLElement;
export type TeaserContent = import('./eds-family.js').TeaserContent;
export type TeaserPath = import('./component-block.js').Path<TeaserContent>;
