/**
 * Shared body-builder for accordion and tabs panel items (all five item
 * types share one discriminated-type pattern, matching List/Card). Both
 * blocks' item models carry the SAME 9 fields regardless of itemType --
 * this builds the BODY only (what goes inside the panel/tabpanel), since
 * that part is identical between the two blocks; each caller builds its own
 * outer wrapper (accordion's .cmp-accordion__panel vs tabs'
 * .cmp-tabs__tabpanel/responsivegrid/aem-Grid) and supplies its own
 * panelTitle placement (accordion: a title span inside the trigger button;
 * tabs: the toggler <li>'s own text -- neither is part of this shared body).
 *
 * `text` and `table` render identically -- AEM stores an authored table
 * as raw HTML in the very same richtext property a plain text body uses --
 * so there is deliberately no separate branch for 'table'.
 *
 * `image` and `teaser` call the SAME compiled DOM builds (../image.js,
 * ../teaser.js) a standalone image or teaser-based block uses, so those two
 * kinds render with the exact same markup (and get the exact same CSS).
 *
 * `embed-video` is hand-built (matching the design system's own EmbedVideo
 * markup) rather than calling a compiled component, and scope is kept to
 * what a first cut needs: a single source URL, no
 * poster/loop/autoplay/controls authoring (the design system's own defaults
 * apply).
 */
/**
 * @param {string | undefined} html
 * @param {boolean} [styled]
 * @returns {HTMLElement}
 */
export function buildTextBody(html: string | undefined, styled?: boolean): HTMLElement;
/**
 * The fields of a panel item. `itemType` picks the body: 'text' (also none), 'table', 'image',
 * 'teaser' or 'embed-video'; the other fields are the ones that body reads, under the names of the
 * component's own props: `src` and `alt` for Image(), `pretitle`, `title` and `link` (`{ url }`)
 * for Teaser() with `content` as its description, and `source` (`[{ url, type }]`) for EmbedVideo.
 *
 * @typedef {{
 *   itemType?: string, content?: string, src?: string, alt?: string, pretitle?: string,
 *   title?: string, link?: { url?: string },
 *   source?: ReadonlyArray<{ url?: string, type?: string }>,
 * }} PanelItemValues
 */
/**
 * @param {PanelItemValues} values
 * @returns {HTMLElement}
 */
export default function buildPanelBody(values: PanelItemValues): HTMLElement;
/**
 * The fields of a panel item. `itemType` picks the body: 'text' (also none), 'table', 'image',
 * 'teaser' or 'embed-video'; the other fields are the ones that body reads, under the names of the
 * component's own props: `src` and `alt` for Image(), `pretitle`, `title` and `link` (`{ url }`)
 * for Teaser() with `content` as its description, and `source` (`[{ url, type }]`) for EmbedVideo.
 */
export type PanelItemValues = {
    itemType?: string;
    content?: string;
    src?: string;
    alt?: string;
    pretitle?: string;
    title?: string;
    link?: {
        url?: string;
    };
    source?: ReadonlyArray<{
        url?: string;
        type?: string;
    }>;
};
