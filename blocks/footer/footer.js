// The site footer: the design system's AC footer, built from the footer fragment
// (ds-eds-assets/contracts/ac-footer.md). The bundle ac-chrome-footer styles it and the ac-footer
// page controller makes the back-to-top button work.
//
// The footer fragment (/footer, or the page's "footer" metadata) is read in order:
//   - a heading starts a column: the heading is its title (a link in it links the title), the
//     paragraphs after it are its text and the list after it its links (a link's title is the
//     item's subtitle)
//   - a paragraph whose links all hold an icon or an image is the social links
//     (`:linkedin:` is /icons/linkedin.svg)
//   - any other paragraph outside a column is a bottom line: a paragraph that is one link is a
//     link button, a link to #cookie-settings opens the consent dialog, the rest is text
// Page metadata "back-to-top: off" leaves out the back-to-top button.
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { loadBundle } from '../../scripts/ds.js';
import { startPageControllers } from '../../ds-eds-assets/js/vendor/start-page-controllers.js';
import {
  el, sectionsOf, contentOf, iconOf, textOf, hrefOf, isExternal,
} from '../../scripts/chrome.js';

const GRID = 'aem-Grid aem-Grid--12 aem-Grid--default--12';
const COOKIE_SETTINGS = '#cookie-settings';

// ---- Reading the fragment ----------------------------------------------------------------------

const isHeading = (n) => /^H[1-6]$/.test(n.tagName);
const isList = (n) => n.tagName === 'UL' || n.tagName === 'OL';

function isSocial(p) {
  const links = [...p.querySelectorAll('a')];
  return links.length > 0 && links.every((a) => a.querySelector('img, picture, span.icon'));
}

function readFooter(fragment) {
  const columns = [];
  const social = [];
  const bottom = [];
  sectionsOf(fragment).forEach((section) => {
    let column = null;
    contentOf(section).forEach((node) => {
      if (isHeading(node)) {
        const a = node.querySelector('a');
        column = {
          title: textOf(node), href: a ? hrefOf(a) : null, text: [], links: [],
        };
        columns.push(column);
      } else if (node.tagName === 'P' && isSocial(node)) {
        node.querySelectorAll('a').forEach((a) => {
          const img = a.querySelector('img');
          const icon = iconOf(a);
          social.push({
            href: hrefOf(a),
            src: img?.getAttribute('src') || `${window.hlx?.codeBasePath || ''}/icons/${icon}.svg`,
            alt: img?.getAttribute('alt') || a.getAttribute('title') || icon,
          });
        });
      } else if (column && isList(node)) {
        node.querySelectorAll('a').forEach((a) => column.links.push({
          label: textOf(a), href: hrefOf(a), subtitle: a.getAttribute('title') || '',
        }));
      } else if (column && node.tagName === 'P') {
        column.text.push(node.innerHTML);
      } else if (node.tagName === 'P' || isList(node)) {
        const lines = isList(node) ? [...node.children] : [node];
        lines.forEach((line) => {
          const links = [...line.querySelectorAll('a')];
          const onlyLink = links.length === 1 && textOf(line) === textOf(links[0]);
          if (onlyLink && hrefOf(links[0]) === COOKIE_SETTINGS) bottom.push({ kind: 'cookies', label: textOf(links[0]) });
          else if (onlyLink) bottom.push({ kind: 'link', label: textOf(links[0]), href: hrefOf(links[0]) });
          else bottom.push({ kind: 'text', html: line.innerHTML });
        });
      }
    });
  });
  return { columns, social, bottom };
}

// ---- Building the markup -----------------------------------------------------------------------

/** div.container.responsivegrid.<cls> > div.cmp-container [> div.aem-Grid] > children */
const container = (cls, children, { grid = true } = {}) => el(
  'div',
  { class: `container responsivegrid ${cls} aem-Grid--12 aem-Grid--default--12`.replace(/\s+/g, ' ') },
  el('div', { class: 'cmp-container' }, grid ? el('div', { class: GRID }, children) : children),
);

const richText = (html) => {
  const text = el('div', { class: 'cmp-text' });
  text.innerHTML = html;
  return el('div', { class: 'text aem-GridColumn aem-GridColumn--default--12' }, text);
};

function columnOf({
  title, href, text, links,
}) {
  return container('', [
    el('div', { class: 'title' }, el('div', { class: 'cmp-title' }, el(
      'h6',
      { class: 'cmp-title__text' },
      href ? el('a', { class: 'cmp-title__link', href }, title) : title,
    ))),
    text.length ? richText(text.join('')) : null,
    links.length ? el(
      'div',
      { class: 'list ds-brand-list ds-brand-vertical-card aem-GridColumn aem-GridColumn--default--12' },
      el('ul', { class: 'cmp-list' }, links.map((link) => el(
        'li',
        { class: 'cmp-list__item' },
        el(
          'a',
          {
            class: 'cmp-list__item-link',
            href: link.href,
            target: isExternal(link.href) ? '_blank' : undefined,
            rel: isExternal(link.href) ? 'noopener' : undefined,
          },
          el('span', { class: 'cmp-list__item-title' }, link.label),
          el('span', { class: 'cmp-list__item-subtitle' }, link.subtitle),
        ),
      ))),
    ) : null,
  ]);
}

function bottomLine(line) {
  if (line.kind === 'link') {
    return el(
      'div',
      { class: 'button ds-brand-footer-link aem-GridColumn aem-GridColumn--default--12' },
      el('a', { class: 'cmp-button', href: line.href }, el('span', { class: 'cmp-button__text' }, line.label)),
    );
  }
  if (line.kind === 'cookies') {
    // Opens the consent dialog when a consent script (OneTrust) is on the page.
    return el(
      'div',
      { class: 'text aem-GridColumn aem-GridColumn--default--12' },
      el('div', { class: 'cmp-text' }, el('button', { id: 'ot-sdk-btn', class: 'ot-sdk-show-settings', type: 'button' }, line.label)),
    );
  }
  return richText(line.html);
}

function buildFooter({ columns, social, bottom }, backToTop) {
  return el(
    'div',
    // Not the class `footer`: styles.css hides `footer .footer` until the block has loaded.
    { class: 'container ds-brand-footer' },
    el('div', { class: 'cmp-container' }, el(
      'div',
      { class: GRID },
      backToTop ? container('ds-brand-footer__top', el(
        'div',
        { class: 'button ds-brand-button ds-brand-button__back-to-top' },
        el('button', { class: 'cmp-button', type: 'button', 'aria-label': 'Back to top' }, el('span', { class: 'cmp-button__text' })),
      )) : null,
      columns.length ? container('ds-brand-footer__middle', container('grid-col-4', columns.map(columnOf))) : null,
      container('ds-brand-footer__bottom', [
        social.length ? container('ds-brand-footer__social', el('div', { class: 'image' }, el(
          'div',
          { class: 'cmp-image' },
          social.map(({ href, src, alt }) => el(
            'a',
            {
              class: 'cmp-image__link', href, target: '_blank', rel: 'noopener',
            },
            el('img', {
              src, alt, width: '32', height: '32', loading: 'lazy',
            }),
          )),
        )), { grid: false }) : null,
        bottom.length ? container('ds-brand-footer__legal', bottom.map(bottomLine)) : null,
      ], { grid: false }),
    )),
  );
}

/**
 * Loads the footer fragment and builds the design system's footer from it.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  const backToTop = !/^(off|false|no|hide)$/i.test(getMetadata('back-to-top'));

  await loadBundle('ac-chrome-footer');
  // The root is a div inside the page's footer element, the landmark.
  block.replaceChildren(buildFooter(readFooter(fragment), backToTop));

  // The footer is not authored on the page, so its controller starts in the editor too.
  await startPageControllers(block, { inEditor: false });
}
