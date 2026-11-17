/**
 * The design system's input, built from a block's fields. It carries design-system names only.
 *
 *   fields         the result of fieldsByName
 *   values         the fields' values, with the option fields the model hides already dropped
 *                  (dropHidden). A dropped field's key is absent, an empty one's is undefined.
 *   contentFields  field -> the content prop it fills. A path names a place inside a prop:
 *                  'actions.0.title' is the title of the first action.
 *   optionFields   field -> { list } from the block's generated <block>-fields.js. After the
 *                  hidden fields are dropped, at most one field is left for a list (the build
 *                  checks the models), so `options` is a plain list -> value map.
 *   editableProps  the content props the design system renders an editable element for; only
 *                  their fields' editor attributes are taken off the rows
 */
/**
 * @template {Record<string, any>} C
 * @template {Record<string, any>} O
 * @template {Path<C>} E
 * @param {Record<string, any>} fields
 * @param {Record<string, any>} values
 * @param {Wiring<C, O, E>} wiring
 * @returns {Input<C, O, E>}
 */
export function componentInput<C extends Record<string, any>, O extends Record<string, any>, E extends import("./eds-component.js").ContentPath<C>>(fields: Record<string, any>, values: Record<string, any>, { contentFields, optionFields, editableProps, }: Wiring<C, O, E>): Input<C, O, E>;
export function shownValues(stored: any, { optionFields, conditions, typeField, defaultType, }: {
    optionFields: any;
    conditions: any;
    typeField: any;
    defaultType: any;
}): {
    [k: string]: any;
};
/**
 * Renders one component from a block's rows: reads the cells, hands them to `render` (the design
 * system's wrapper) under design-system names and records the fields for the test template's
 * panel. The block moves its own instrumentation onto the rendered root.
 *
 *   names, kinds   the fields in positional order and how each cell is read (fieldsByName,
 *                  valuesByName)
 *   contentFields, optionFields, editableProps   see componentInput
 *   conditions     the block model's FIELD_CONDITIONS: the option fields it hides are dropped
 *                  before the design system is called
 */
/**
 * @template {Record<string, any>} C
 * @template {Record<string, any>} O
 * @template {Path<C>} E
 * @param {Array<any>} rows
 * @param {Wiring<C, O, E> & {
 *   render: (input: Input<C, O, E>) => HTMLElement | undefined,
 *   names: string[], kinds: Record<string, string>, conditions: Record<string, any>,
 * }} block
 */
export function renderComponentBlock<C extends Record<string, any>, O extends Record<string, any>, E extends import("./eds-component.js").ContentPath<C>>(rows: Array<any>, { render, names, kinds, contentFields, optionFields, conditions, editableProps, }: Wiring<C, O, E> & {
    render: (input: Input<C, O, E>) => HTMLElement | undefined;
    names: string[];
    kinds: Record<string, string>;
    conditions: Record<string, any>;
}): HTMLElement;
export type Input<C extends Record<string, any>, O extends Record<string, any>, E extends string> = import('./eds-component.js').RenderInput<C, O, E>;
export type Path<C extends Record<string, any>> = import('./eds-component.js').ContentPath<C>;
/**
 * What a block declares about its wiring to a design-system wrapper, checked against the types
 * the wrapper ships: a content field can only name a path of the wrapper's content, an option
 * field only a list the wrapper takes, and an editable prop only one it renders.
 */
export type Wiring<C extends Record<string, any>, O extends Record<string, any>, E extends import("./eds-component.js").ContentPath<C>> = {
    contentFields: Record<string, Path<C>>;
    optionFields: Record<string, {
        readonly list: keyof O & string;
    }>;
    editableProps: ReadonlyArray<E>;
};
