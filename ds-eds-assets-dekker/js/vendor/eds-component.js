// What every design-system render wrapper shares: the id, the classes the option lists choose and
// the attributes set on editable props. A wrapper (render-separator.js) names its component, how
// content props become the component's props, the option lists whose values are classes on the
// root, and the elements the editable props render on. renderComponent() applies them around the
// unchanged component. Its input uses design-system names only: content props, option list names
// and, for the editable elements, the attributes to set. It knows nothing of how a site stores or
// edits content.
import uniqueId from './unique-id.js';

/**
 * @typedef {import('./option-values').OptionValues} OptionValues
 */

/**
 * The options a wrapper takes: the option lists `L`, each optional and valued from the list's own
 * values (options/*.js). A list that takes several values is typed as those values joined by
 * commas.
 *
 * @template {keyof OptionValues} L
 * @typedef {{ [P in L]?: OptionValues[P] | undefined }} OptionsInput
 */

/**
 * The dotted paths to the values inside content `C`: a prop is 'title', a place inside a prop is
 * 'buttonLink.url', and an item of a list prop is 'actions.0.title'. The DOM nodes content may
 * hold are values, not places.
 *
 * @template T
 * @typedef {T extends Node ? never : T extends readonly (infer U)[] ? `${number}` | `${number}.${ContentPath<U>}` : T extends Record<string, any> ? { [K in keyof T & string]-?: K | (NonNullable<T[K]> extends Record<string, any> ? `${K}.${ContentPath<NonNullable<T[K]>>}` : never) }[keyof T & string] : never} ContentPath
 */

/**
 * How a site maps its fields to a wrapper's content: field name -> the content path it fills.
 *
 * @template C
 * @typedef {Record<string, ContentPath<C>>} ContentFields
 */

/**
 * The editable input of a wrapper: for each editable content prop `E`, the data-* attributes to
 * set on the element that prop renders on.
 *
 * @template {string} E
 * @typedef {{ [P in E]?: Record<string, string> }} EditableInput
 */

/**
 * @template {Record<string, any>} [C=Record<string, any>] the component's content
 * @template {Record<string, any>} [O=Record<string, string | undefined>] the options, by option list
 * @template {string} [E=string] the content props that are editable in place
 * @typedef {object} RenderInput
 * @property {C} [content] the component's content props, under the design system's names
 * @property {O} [options] option list name -> chosen value
 * @property {EditableInput<E>} [editable] content prop -> the data-* attributes to set on the
 *   element that prop renders on
 * @property {(file: string) => unknown} [loadBundle] loads a CSS bundle. `file` is the bundle's
 *   name in css/bundles.json with `.css` after it. The consumer adds a stylesheet link for each
 *   part of the bundle (css/graph/<part>.css), placed by the part's position in the `order` of
 *   css/bundles.json
 */

/**
 * Adds the CSS classes in each value. A value may hold several, separated by whitespace; with
 * `list` they are also separated by commas, as a multiple choice delivers them.
 *
 * @param {Element} root
 * @param {Array<string | undefined>} values
 * @param {boolean} [list]
 */
export function addClasses(root, values, list) {
  const separator = list ? /[\s,]+/ : /\s+/;
  values.forEach((value) => {
    (value || '').split(separator).filter(Boolean).forEach((token) => root.classList.add(token));
  });
}

// The value at a dotted path of the content ('actions.0.title').
const valueAt = (content, path) => path.split('.').reduce((value, key) => value?.[key], content);

// Only data-* attributes are set from `editable`; any other name could change the element's
// behaviour or look.
const DATA_ATTRIBUTE = /^data-[\w.-]+$/;

/**
 * Sets the data-* attributes of `attributes` on `target`; either may be missing.
 *
 * @param {Element | null | undefined} target
 * @param {Record<string, string> | undefined} attributes
 */
export function setDataAttributes(target, attributes) {
  if (!target || !attributes) return;
  Object.entries(attributes).filter(([name]) => DATA_ATTRIBUTE.test(name))
    .forEach(([name, value]) => target.setAttribute(name, value));
}

/**
 * Sets the attributes given for each editable prop on the element that prop renders on. They go
 * on the element only when the prop rendered: a prop that is empty, or that the component does not
 * show, has no element of its own. `elements` is [content prop, selector] pairs; a selector may be
 * a function of the id.
 *
 * @param {Element} root
 * @param {string} id
 * @param {ReadonlyArray<readonly [string, string | ((id: string) => string)]>} elements
 * @param {Record<string, any>} content
 * @param {Record<string, Record<string, string> | undefined>} editable
 */
export function applyEditable(root, id, elements, content, editable) {
  elements.forEach(([prop, selector]) => {
    if (!editable[prop] || !valueAt(content, prop)) return;
    setDataAttributes(
      root.querySelector(typeof selector === 'function' ? selector(id) : selector),
      editable[prop],
    );
  });
}

/**
 * What a wrapper says about its component (see renderComponent).
 *
 * @template {Record<string, any>} C the content type
 * @template {Record<string, any>} O the options type
 * @template {ContentPath<C>} E the editable content props
 * @typedef {object} ComponentConfig
 * @property {string} idPrefix
 * @property {(props: any) => HTMLElement} component
 * @property {(content: C, id: string, options: O) => any} props
 * @property {Record<string, { multiple?: boolean }>} [optionMeta]
 * @property {Record<string, string>} [defaults]
 * @property {ReadonlyArray<string>} classLists
 * @property {ReadonlyArray<readonly [E, string | ((id: string) => string)]>} editable
 */

/**
 * Renders one component.
 *
 * `config`:
 *   idPrefix     prefix of the component id
 *   component    the design-system component function
 *   props        (content, id, options) -> the component's props, id included
 *   optionMeta   the option module's `optionMeta`: a multiple list's value is split on commas too
 *   defaults     value of an option list the input leaves empty
 *   classLists   option lists whose values are classes on the root, in class order
 *   editable     [content prop, selector] pairs: the element each editable prop renders on
 *
 * `input`:
 *   content     the component's content props, under the design system's names
 *   options     option list name -> chosen value
 *   editable    content prop -> data-* attributes to set on the element that prop renders on
 *
 * @template {Record<string, any>} C
 * @template {Record<string, any>} O
 * @template {ContentPath<C>} E
 * @param {ComponentConfig<C, O, E>} config
 * @param {RenderInput<C, O, E>} [input]
 * @returns {HTMLElement}
 */
export function renderComponent(config, {
  content = /** @type {C} */ ({}), options: given = /** @type {O} */ ({}), editable = {},
} = {}) {
  const id = uniqueId(config.idPrefix);
  const options = /** @type {O} */ ({
    ...given,
    ...Object.fromEntries(Object.entries(config.defaults || {})
      .map(([list, value]) => [list, given[list] ?? value])),
  });
  const root = config.component(config.props(content, id, options));
  config.classLists.forEach((list) => addClasses(
    root,
    [options[list]],
    config.optionMeta?.[list]?.multiple,
  ));
  applyEditable(root, id, config.editable, content, editable);
  return root;
}
