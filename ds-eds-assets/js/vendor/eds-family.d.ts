/**
 * @param {string} blockId
 * @param {ReadonlyArray<TeaserActionContent | undefined>} [given]
 */
export function teaserActions(blockId: string, given?: ReadonlyArray<TeaserActionContent | undefined>): {
    actionsEnabled: boolean;
    actions: {
        id: string;
        title: string;
        link: import("../types/aem-core-lib/src/interfaces/common.js").ILink;
    }[];
};
/**
 * @param {FamilyProps} props
 * @param {string | undefined} cardAction
 * @returns {FamilyProps}
 */
export function applyCardAction(props: FamilyProps, cardAction: string | undefined): FamilyProps;
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
export function renderTeaserFamily<C extends Record<string, any> = TeaserContent, O extends Record<string, any> = Record<string, string>, E extends import("./eds-component.js").ContentPath<C> = any>(config: TeaserFamilyConfig<O, E>, { content: givenContent, options: givenOptions, editable, loadBundle, }: import("./eds-component.js").RenderInput<C, O, E>): HTMLElement;
export function actionId(blockId: string, index: number): string;
export function actionLink(index: number): (blockId: string) => string;
export type TeaserProps = import('../teaser.js').TeaserProps;
export type OptionValues = import('./eds-component.js').OptionValues;
export type TeaserLink = Omit<NonNullable<TeaserProps['link']>, 'valid'>;
/**
 * The Teaser props the family builds from the content and the options. The family adds `id`,
 * `imageLinkHidden` and `titleLinkHidden` itself.
 */
export type FamilyProps = Partial<Omit<TeaserProps, 'id' | 'imageLinkHidden' | 'titleLinkHidden' | 'actionsEnabled'>> & {
    actionsEnabled: boolean;
};
/**
 * One action of the content: the Teaser action's own `title` and `link`. The id is the family's,
 * and a link is given as `{ url }`; the family sets `valid`.
 */
export type TeaserActionContent = Partial<Pick<NonNullable<TeaserProps['actions']>[number], 'title'>> & {
    link?: TeaserLink;
};
/**
 * What a site fills in for a Teaser-family block: Teaser props under their own names. `picture`
 * is the family's own addition and not a Teaser prop: a <picture> that replaces the plain image of
 * `imagePath`. `titleTag` is Teaser's prop of that name, limited to the levels the block offers.
 */
export type TeaserContent = Partial<Pick<TeaserProps, 'imagePath' | 'pretitle' | 'title' | 'description' | 'date'>> & {
    link?: TeaserLink;
    actions?: ReadonlyArray<TeaserActionContent | undefined>;
    picture?: HTMLElement;
    titleTag?: OptionValues['teaserTitleType'];
};
/**
 * What a family wrapper says about its family (see renderTeaserFamily).
 */
export type TeaserFamilyConfig<O extends Record<string, any> = Record<string, string>, E extends string = string> = {
    idPrefix: string;
    typeMeta: {
        list: string;
        default: string;
        types: Record<string, {
            omit?: ReadonlyArray<string>;
            options?: ReadonlyArray<string>;
        }>;
    };
    titleTypes?: ReadonlyArray<{
        value: string;
    }>;
    defaultTitleTag?: TeaserProps['titleTag'];
    optionMeta?: Record<string, {
        multiple?: boolean;
    }>;
    defaults?: { [K in keyof O]?: O[K]; };
    required?: { [K_1 in keyof O]?: O[K_1]; };
    baseClasses: readonly string[] | ((type: string) => ReadonlyArray<string>);
    buttonsClass?: Record<string, string>;
    classLists: ReadonlyArray<keyof O & string>;
    bundle?: (type: string) => string | undefined;
    adjustProps?: (props: FamilyProps, content: TeaserContent, options: O, type: string, id: string) => FamilyProps;
    patchPicture?: boolean;
    editable: readonly (readonly [E, string | ((id: string) => string)])[];
};
