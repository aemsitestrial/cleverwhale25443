// Option lists for the text content component. Data only: each entry is { value, label },
// where value is the CSS class (several classes are space separated) or the plain value the component accepts.

export const textContentModifier = [
  { value: 'modifier-content-center', label: 'Content center' },
  { value: 'modifier-content-right', label: 'Content right' },
  { value: 'modifier-pretitle-secondary', label: 'Pretitle secondary' },
  { value: 'modifier-pretitle-tertiary', label: 'Pretitle tertiary' },
  { value: 'modifier-transparent', label: 'Transparent' },
  { value: 'modifier-icon-phone-on-links', label: 'Icon on phone links' },
  { value: 'modifier-icon-email-on-links', label: 'Icon on email links' },
  { value: 'modifier-icon-phone-email-order-icon-links', label: 'Icons on phone and email links (order)' },
];

export const textContentType = [
  { value: 'teaser', label: 'Teaser' },
  { value: 'quote', label: 'Quote' },
  { value: 'highlight', label: 'Highlight' },
];

// How the text content types differ. Every type shows every content prop and takes the same
// option lists, so the types carry no `omit` or `options`; the type picks the base classes and the
// CSS bundle in render-text-content.js.
export const typeMeta = {
  list: 'textContentType',
  default: 'teaser',
  types: {
    teaser: {},
    quote: {},
    highlight: {},
  },
};
