// The Locator above the header (ds-eds-assets/contracts/ac-locator.md): "Looks like you're in:"
// with a country select and a language select, a button that goes to the chosen page, and a link to
// all locations. The package ships its CSS (bundle ac-locator) and the selects' dropdown
// (LocatorSelectClass); the site builds the markup, the data and the logic, which are here.
//
// The data is the AC Nav Locator block of the nav page (scripts/nav-blocks.js): one entry per
// country and language with the page to go to. The visitor's country is the region of the
// browser's languages (sv-SE -> SE); no service is called. The Locator shows:
//   auto     when that country has an entry and the page is not one of its pages
//   always   on every page, with the visitor's country chosen when there is one
import { LocatorSelectClass } from '../ds-eds-assets/js/vendor/locator-select-class.js';
import { el, pathOf, currentPath } from './chrome.js';

const COUNTRY_EVENT = 'acLocatorCountrySelect';
const LANGUAGE_EVENT = 'acLocatorLanguageSelect';

const grid = (...children) => el('div', { class: 'aem-Grid aem-Grid--12 aem-Grid--default--12' }, ...children);
const container = (cls, ...children) => el(
  'div',
  { class: `container responsivegrid ${cls} aem-Grid--12 aem-Grid--default--12` },
  el('div', { class: 'cmp-container' }, grid(...children)),
);

const select = (position, search) => el(
  'div',
  {
    class: `container responsivegrid ac-core-locator-select ac-core-locator__select-${position}`
      + `${search ? ' aem-GridColumn ac-core-locator-select--use-search' : ''} aem-Grid--12 aem-Grid--default--12`,
  },
  el('div', { class: 'cmp-container' }, grid(el(
    'div',
    { class: 'button ac-core-button ac-core-locator-select__toggler' },
    el('button', { class: 'cmp-button', type: 'button' }, el('span', { class: 'cmp-button__text' })),
  ))),
);

/** The visitor's country codes, from the browser's languages (sv-SE -> SE), in order. */
function visitorCountries() {
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language || ''];
  return langs.map((lang) => (lang.split('-')[1] || '').toUpperCase()).filter(Boolean);
}

/**
 * The Locator for `config` (readNavBlocks().locator), or null when it has nothing to offer the
 * visitor on this page.
 * @param {object} config
 * @returns {{ root: HTMLElement, start: () => void } | null}
 */
export default function buildLocator(config) {
  if (!config || !config.entries.length) return null;
  const countries = [...new Set(config.entries.map((e) => e.country))];
  const languagesOf = (country) => config.entries.filter((e) => e.country === country);
  const codes = visitorCountries();
  const visitor = config.entries.find((e) => codes.includes(e.code))?.country;
  const here = currentPath();
  const onVisitorPage = visitor && languagesOf(visitor).some((e) => pathOf(e.href) === here);
  if (config.display !== 'always' && (!visitor || onVisitorPage)) return null;

  const countrySelect = select('country', true);
  const languageSelect = select('language', false);
  const submitButton = el('button', { class: 'cmp-button', type: 'button', disabled: true });
  const submit = el(
    'div',
    { class: 'button ac-core-button style-primary-negative modifier-solid ac-core-locator__submit aem-GridColumn' },
    submitButton,
  );
  const locator = el('div', { class: 'container responsivegrid ac-core-locator aem-Grid--12 aem-Grid--default--12' }, el(
    'div',
    { class: 'cmp-container' },
    grid(
      el(
        'div',
        { class: 'container responsivegrid ac-core-locator__left aem-GridColumn aem-Grid--12 aem-Grid--default--12' },
        el('div', { class: 'cmp-container' }, grid(
          el('div', { class: 'text aem-GridColumn' }, el('div', { class: 'cmp-text' }, el('p', {}, config.sentence))),
          countrySelect,
          languageSelect,
          submit,
        )),
      ),
      config.viewAll ? container(
        'ac-core-locator__right aem-GridColumn',
        el(
          'div',
          { class: 'linkcomponent link ac-core-locator__link-view-all-locations aem-GridColumn' },
          el('div', { class: 'cmp-link' }, el('a', { class: 'cmp-link__anchor', href: config.viewAll.href }, config.viewAll.label)),
        ),
      ) : null,
    ),
  ));
  const root = el('div', { class: 'locator aem-GridColumn aem-GridColumn--default--12' }, locator);

  // Once the markup is in the document: the selects, their items and the button.
  const start = () => {
    const country = new LocatorSelectClass({
      name: 'country',
      el: countrySelect,
      selectOptionEvent: COUNTRY_EVENT,
      useSearch: true,
      searchPlaceholder: config.searchPlaceholder,
      placeholder: config.countryPlaceholder,
    });
    const language = new LocatorSelectClass({
      name: 'language',
      el: languageSelect,
      selectOptionEvent: LANGUAGE_EVENT,
      placeholder: config.languagePlaceholder,
    });
    let target = null;
    const choose = (entry) => {
      target = entry;
      submitButton.textContent = entry ? config.submitLabel.replace('{language}', entry.language) : '';
      if (entry) submitButton.removeAttribute('disabled');
      else submitButton.setAttribute('disabled', '');
    };
    const showCountry = (name) => {
      const entries = languagesOf(name);
      language.setListItems(entries.map((e) => ({ title: e.language, link: e.href })));
      language.disableDropdown = entries.length < 2;
      if (entries.length) {
        language.selectedOption = entries[0].language;
        language.selectedDataLinkOption = entries[0].href;
      } else language.resetValue();
      choose(entries[0] || null);
    };
    country.setListItems(countries);
    if (visitor) {
      country.selectedOption = visitor;
      showCountry(visitor);
    } else {
      country.resetValue();
      language.resetValue();
      language.disableDropdown = true;
    }
    document.addEventListener(COUNTRY_EVENT, (e) => showCountry(e.detail.value));
    document.addEventListener(LANGUAGE_EVENT, (e) => {
      const name = country.selectedOption;
      choose(languagesOf(name).find((entry) => entry.language === e.detail.value) || null);
    });
    submitButton.addEventListener('click', () => {
      if (target) window.location.href = target.href;
    });
    locator.classList.add('locator--initialization');
  };
  return { root, start };
}
