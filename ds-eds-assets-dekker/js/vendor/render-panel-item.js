import { Image } from '../image.js';
import { Teaser } from '../teaser.js';
import uniqueId from './unique-id.js';

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
// A text panel body. style-primary is what gives a table inside it its head, cell and border
// colours: table.scss only defines the --table-*-color custom properties under
// .text.style-primary/.style-secondary, so without one a table's cell border falls back to
// none. text.scss has no style-primary/-secondary rule, so for plain text it changes nothing.
/**
 * @param {string | undefined} html
 * @param {boolean} [styled]
 * @returns {HTMLElement}
 */
export function buildTextBody(html, styled) {
  const text = document.createElement('div');
  text.className = styled ? 'text style-primary' : 'text';
  const content = document.createElement('div');
  content.id = uniqueId('panel');
  content.className = 'cmp-text';
  content.innerHTML = html || '';
  text.append(content);
  return text;
}

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
export default function buildPanelBody(values) {
  const kind = values.itemType || 'text';

  if (kind === 'image') {
    const wrapper = document.createElement('div');
    wrapper.className = 'image';
    const id = uniqueId('panel');
    // Image() types its other props as required too, and an item with no image or alt gives
    // undefined for them, so the props are asserted rather than completed.
    const image = Image(/** @type {import('../image.js').ImageProps} */ ({
      id,
      uuid: id,
      src: values.src,
      alt: values.alt,
    }));
    wrapper.append(image);
    return wrapper;
  }

  if (kind === 'teaser') {
    // Teaser() types `actionsEnabled` and the texts as required. They are left unset, so the props
    // are asserted rather than completed. Teaser() draws its whole-card link only when
    // `actionsEnabled` is false (it tests `=== false`), so a teaser with a link sets it; one without
    // keeps it unset.
    return Teaser(/** @type {import('../teaser.js').TeaserProps} */ ({
      id: uniqueId('panel'),
      imageLinkHidden: true,
      titleLinkHidden: true,
      pretitle: values.pretitle,
      title: values.title,
      description: values.content,
      ...(values.link?.url && { actionsEnabled: false, link: { url: values.link.url, valid: true } }),
    }));
  }

  if (kind === 'embed-video') {
    const wrapper = document.createElement('div');
    wrapper.className = 'embed';
    const id = uniqueId('panel');
    const cmpEmbed = document.createElement('div');
    cmpEmbed.id = id;
    cmpEmbed.className = 'cmp-embed';
    const videoWrapper = document.createElement('div');
    const video = document.createElement('video');
    video.autoplay = true;
    video.controls = true;
    video.loop = true;
    video.muted = true;
    video.setAttribute('playsinline', '');
    (values.source || []).forEach(({ url, type }) => {
      if (!url) return;
      const source = document.createElement('source');
      source.src = url;
      if (type) source.type = type;
      video.append(source);
    });
    videoWrapper.append(video);
    cmpEmbed.append(videoWrapper);
    wrapper.append(cmpEmbed);
    return wrapper;
  }

  // 'text' and 'table' -- identical rendering, see this file's own header.
  // 'table' also gets style-primary, see buildTextBody.
  return buildTextBody(values.content, kind === 'table');
}
