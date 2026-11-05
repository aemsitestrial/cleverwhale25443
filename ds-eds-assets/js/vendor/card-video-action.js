const CARD_AEM_TYPE = 'ac-core-card-aem';
const LINKED_VIDEO_MODIFIER = 'modifier-linked-video';

/**
 * Whether a Card Aem keeps an action that has a link URL but no link text.
 * A linked-video card renders its play button as the empty action link
 * (<a class="cmp-teaser__action-link"> with no text; the CSS draws the play
 * button on it), so the author only supplies the URL. buildProps() drops every
 * action without a title, which would leave such a card with no play button;
 * for any other card an empty link is invisible clutter, so it stays dropped.
 * The modifier may arrive as one value or as several separated by commas or
 * whitespace.
 *
 * @param {{ cardType?: string, cardModifier?: string, actionUrl?: string, actionText?: string }} entry
 */
export function keepsUrlOnlyVideoAction({
  cardType, cardModifier, actionUrl, actionText,
}) {
  if (cardType !== CARD_AEM_TYPE || !actionUrl || actionText) return false;
  return String(cardModifier || '').split(/[\s,]+/).includes(LINKED_VIDEO_MODIFIER);
}

/**
 * The action list for a URL-only linked-video action, shaped like the entry
 * built for a titled action, with an empty title.
 *
 * @param {string} id
 * @param {string} actionUrl
 */
export function urlOnlyVideoAction(id, actionUrl) {
  return { id, title: '', link: { url: actionUrl, valid: true } };
}
