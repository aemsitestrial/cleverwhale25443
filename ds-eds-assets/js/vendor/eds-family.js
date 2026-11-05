// The part of rendering a Teaser-based family (banner, card, teaser) that is design-system
// presentation logic rather than authoring-format parsing. A family wrapper (render-banner.js)
// describes its class rules and editable elements in a config, and the family's option module
// (options/banner.js) describes its types as data; renderTeaserFamily() applies both around an
// unchanged Teaser(). Its input uses design-system names only: content props, option list names
// and, for the editable elements, the attributes to set. It knows nothing of how a site stores or
// edits content.
import { Teaser } from '../teaser.js';
import uniqueId from './unique-id.js';
import { patchPicture } from './patch-picture.js';
import { addClasses, applyEditable } from './eds-component.js';

/** @typedef {import('../teaser.js').TeaserProps} TeaserProps */
/** @typedef {import('./eds-component.js').OptionValues} OptionValues */
/** @typedef {Omit<NonNullable<TeaserProps['link']>, 'valid'>} TeaserLink */

/**
 * The Teaser props the family builds from the content and the options. The family adds `id`,
 * `imageLinkHidden` and `titleLinkHidden` itself.
 * @typedef {Partial<Omit<TeaserProps, 'id' | 'imageLinkHidden' | 'titleLinkHidden' | 'actionsEnabled'>>
 *   & { actionsEnabled: boolean }} FamilyProps
 */

/**
 * One action of the content: the Teaser action's own `title` and `link`. The id is the family's,
 * and a link is given as `{ url }`; the family sets `valid`.
 * @typedef {Partial<Pick<NonNullable<TeaserProps['actions']>[number], 'title'>> & { link?: TeaserLink }} TeaserActionContent
 */

/**
 * What a site fills in for a Teaser-family block: Teaser props under their own names. `picture`
 * is the family's own addition and not a Teaser prop: a <picture> that replaces the plain image of
 * `imagePath`. `titleTag` is Teaser's prop of that name, limited to the levels the block offers.
 * @typedef {Partial<Pick<TeaserProps, 'imagePath' | 'pretitle' | 'title' | 'description' | 'date'>> & {
 *   link?: TeaserLink,
 *   actions?: ReadonlyArray<TeaserActionContent | undefined>,
 *   picture?: HTMLElement,
 *   titleTag?: OptionValues['teaserTitleType'],
 * }} TeaserContent
 */

/**
 * What a family wrapper says about its family (see renderTeaserFamily).
 *
 * @template {Record<string, any>} [O=Record<string, string | undefined>] the options, by list
 * @template {string} [E=string] the content props that are editable in place
 * @typedef {object} TeaserFamilyConfig
 * @property {string} idPrefix
 * @property {{
 *   list: string,
 *   default: string,
 *   types: Record<string, { omit?: ReadonlyArray<string>, options?: ReadonlyArray<string> }>,
 * }} typeMeta
 * @property {ReadonlyArray<{ value: string }>} [titleTypes]
 * @property {TeaserProps['titleTag']} [defaultTitleTag]
 * @property {Record<string, { multiple?: boolean }>} [optionMeta]
 * @property {{ [K in keyof O]?: O[K] }} [defaults]
 * @property {{ [K in keyof O]?: O[K] }} [required]
 * @property {ReadonlyArray<string> | ((type: string) => ReadonlyArray<string>)} baseClasses
 * @property {Record<string, string>} [buttonsClass]
 * @property {ReadonlyArray<keyof O & string>} classLists
 * @property {(type: string) => string | undefined} [bundle]
 * @property {(
 *   props: FamilyProps, content: TeaserContent, options: O, type: string, id: string,
 * ) => FamilyProps} [adjustProps]
 * @property {boolean} [patchPicture]
 * @property {ReadonlyArray<readonly [E, string | ((id: string) => string)]>} editable
 */

// The Teaser's action list from the `actions` content prop. Each action needs a title; a URL alone
// makes no action. Link ids follow the block's own id and the action's position, so they are
// unique on a page whenever block ids are.
/**
 * @param {string} blockId
 * @param {number} index
 */
/**
 * @param {string} blockId
 * @param {number} index
 */
export const actionId = (blockId, index) => (index === 0
  ? `${blockId}-action`
  : `${blockId}-action-${index + 1}`);

/**
 * @param {string} blockId
 * @param {ReadonlyArray<TeaserActionContent | undefined>} [given]
 */
export function teaserActions(blockId, given = []) {
  const actions = given.flatMap((action, index) => (action?.title
    ? [{
      id: actionId(blockId, index),
      title: action.title,
      // An action without a URL has a link without one: the anchor renders without an href.
      link: /** @type {NonNullable<TeaserProps['link']>} */ ({ ...action.link, valid: true }),
    }]
    : []));
  return { actionsEnabled: actions.length > 0, actions };
}

// The "Card action" switch decides which of the whole-card link and the action buttons applies,
// whatever else was authored. An empty value (content from before the field existed) leaves both
// as the fields gave them.
/**
 * @param {FamilyProps} props
 * @param {string | undefined} cardAction
 * @returns {FamilyProps}
 */
export function applyCardAction(props, cardAction) {
  if (cardAction === 'link') return { ...props, actions: [], actionsEnabled: false };
  if (cardAction === 'buttons') return { ...props, link: undefined };
  if (cardAction === 'none') {
    return {
      ...props, actions: [], actionsEnabled: false, link: undefined,
    };
  }
  return props;
}

// The element an action's editable title renders on: the action link of that position in
// `actions`, found by the id teaserActions gives it, so a lone second action is found too.
/** @param {number} index */
export const actionLink = (index) => (/** @type {string} */ blockId) => `[id="${actionId(blockId, index)}"]`;

// What the chosen type keeps. A content prop that some type omits, and an option list that some
// type names, count only for the types that keep or name them. A type not in the metadata keeps
// only what every type keeps.
/**
 * @param {TeaserFamilyConfig['typeMeta']} typeMeta
 * @param {string} type
 * @param {Record<string, any>} content
 * @param {Record<string, any>} options
 */
function keepForType(typeMeta, type, content, options) {
  const all = Object.values(typeMeta.types);
  const meta = typeMeta.types[type];
  const omitted = new Set(meta ? meta.omit || [] : all.flatMap((t) => t.omit || []));
  const scopedLists = new Set(all.flatMap((t) => t.options || []));
  return {
    content: /** @type {TeaserContent} */ (Object.fromEntries(
      Object.entries(content).filter(([prop]) => !omitted.has(prop)),
    )),
    options: Object.fromEntries(Object.entries(options)
      .filter(([list]) => !scopedLists.has(list) || !!meta?.options?.includes(list))),
  };
}

/**
 * Renders one family member.
 *
 * `config`:
 *   idPrefix       prefix of the Teaser id
 *   typeMeta       the family's per-type metadata (options/<family>.js `typeMeta`)
 *   optionMeta     the family's option metadata (`optionMeta`): a multiple list's value is split
 *                  on commas as well
 *   defaults       value of an option list the input leaves out; an empty string counts as given
 *   required       value of an option list that has no empty choice: an empty or missing input
 *                  gets it, so content saved before the empty choice left the list still renders
 *   defaultTitleTag optional: title tag of a type whose content sets no heading level (Teaser()
 *                  draws h2 without it); a level in `content.titleTag` replaces it
 *   titleTypes     optional: the option list ({ value, label }) of heading levels the block offers.
 *                  A block that does not pass it ignores `content.titleTag`
 *   baseClasses    classes of every root, or a function of the type returning them
 *   classLists     option lists whose values are classes on the root, in class order
 *   bundle         (type) -> CSS bundle file name, or nothing when the block loads it already
 *   buttonsClass   optional: type -> class the root gets when the card action is Buttons. A type
 *                  not named gets none
 *   adjustProps    optional: (props, content, options, type, id) -> props, before the card action
 *   patchPicture   whether content.picture replaces the plain image Teaser() renders
 *   editable       [content prop, selector] pairs: the element each editable prop renders on; a
 *                  selector may be a function of the Teaser id
 *
 * `input`:
 *   content     Teaser content props: imagePath, pretitle, title, description, date, link
 *               ({ url }), actions ([{ title, link: { url } }]); picture (a <picture> for imagePath);
 *               titleTag (the title's heading level, one of options/common.js `teaserTitleType`; anything else
 *               leaves the type's own tag)
 *   options     option list name -> chosen value (several values comma separated)
 *   editable    content prop -> data-* attributes to set on the element that prop renders on
 *   loadBundle  (file) -> loads that CSS bundle. `file` is the bundle's name in css/bundles.json
 *               with `.css` after it. The consumer adds a stylesheet link for each part of the
 *               bundle (css/graph/<part>.css), placed by the part's position in the `order` of
 *               css/bundles.json
 *
 * @template {Record<string, any>} [C=TeaserContent]
 * @template {Record<string, any>} [O=Record<string, string | undefined>]
 * @template {import('./eds-component.js').ContentPath<C>} [E=any]
 * @param {TeaserFamilyConfig<O, E>} config
 * @param {import('./eds-component.js').RenderInput<C, O, E>} input
 * @returns {HTMLElement}
 */
export function renderTeaserFamily(config, {
  content: givenContent = /** @type {C} */ ({}),
  options: givenOptions = /** @type {O} */ ({}),
  editable = {},
  loadBundle,
}) {
  const { typeMeta } = config;
  const chosen = /** @type {Record<string, any>} */ (givenOptions);
  const type = chosen[typeMeta.list] ?? typeMeta.default;
  const withDefaults = {
    ...chosen,
    ...Object.fromEntries(Object.entries(config.defaults || {})
      .map(([list, value]) => [list, chosen[list] ?? value])),
    ...Object.fromEntries(Object.entries(config.required || {})
      .map(([list, value]) => [list, chosen[list] || value])),
    [typeMeta.list]: type,
  };
  const { content, options } = keepForType(typeMeta, type, givenContent, withDefaults);

  const id = uniqueId(config.idPrefix);
  const baseProps = {
    imagePath: content.imagePath,
    pretitle: content.pretitle,
    title: content.title,
    description: content.description,
    date: content.date,
    link: content.link?.url ? { ...content.link, valid: true } : undefined,
    ...teaserActions(id, content.actions),
  };
  const props = applyCardAction(
    config.adjustProps ? config.adjustProps(baseProps, content, /** @type {O} */ (options), type, id) : baseProps,
    options.cardAction,
  );
  // An empty or unknown level keeps the family's default tag.
  const titleTag = config.titleTypes?.some((level) => level.value === content.titleTag)
    ? content.titleTag
    : config.defaultTitleTag;
  const root = Teaser({
    id,
    imageLinkHidden: true,
    titleLinkHidden: true,
    ...(titleTag && { titleTag: /** @type {TeaserProps['titleTag']} */ (titleTag) }),
    ...props,
  });

  const bundle = config.bundle?.(type);
  if (bundle) /** @type {(file: string) => unknown} */ (loadBundle)(bundle);

  root.classList.add(...(typeof config.baseClasses === 'function'
    ? config.baseClasses(type)
    : config.baseClasses));
  config.classLists.forEach((list) => addClasses(
    root,
    [options[list]],
    config.optionMeta?.[list]?.multiple,
  ));

  const buttonsClass = options.cardAction === 'buttons' && config.buttonsClass?.[type];
  if (buttonsClass) root.classList.add(buttonsClass);

  applyEditable(root, id, config.editable, content, editable);
  if (config.patchPicture && content.picture) {
    // patchPicture takes the element that holds the picture.
    const holder = document.createElement('div');
    holder.append(content.picture);
    patchPicture(holder, root);
  }
  return root;
}
