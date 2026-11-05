// Option lists shared by several components. Data only: each entry is { value, label },
// where value is the CSS class (several classes are space separated) or the plain value the component accepts.

export const cardAction = [
  { value: 'none', label: 'None' },
  { value: 'link', label: 'Whole-card link' },
  { value: 'buttons', label: 'Buttons' },
];

export const descriptionLineClamp = [
  { value: 'teaser-description-line-clamp-2', label: '2 lines' },
  { value: 'teaser-description-line-clamp-4', label: '4 lines' },
  { value: 'teaser-description-line-clamp-6', label: '6 lines' },
  { value: 'teaser-description-line-clamp-8', label: '8 lines' },
  { value: 'teaser-description-line-clamp-10', label: '10 lines' },
  { value: 'teaser-description-line-clamp-12', label: '12 lines' },
];

export const headingTag = [
  { value: 'h1', label: 'H1' },
  { value: 'h2', label: 'H2' },
  { value: 'h3', label: 'H3' },
  { value: 'h4', label: 'H4' },
  { value: 'h5', label: 'H5' },
  { value: 'h6', label: 'H6' },
];

export const headlineLineClamp = [
  { value: 'teaser-headline-line-clamp-1', label: '1 line' },
  { value: 'teaser-headline-line-clamp-2', label: '2 lines' },
];

export const linkTarget = [
  { value: '_self', label: 'Same tab' },
  { value: '_blank', label: 'New tab' },
];

export const modifierVariant = [
  { value: 'modifier-solid', label: 'Solid' },
  { value: 'modifier-outline', label: 'Outline' },
  { value: 'modifier-ghost', label: 'Ghost' },
];

export const spacingMb = [
  { value: 'mb-4', label: 'mb-4 (1rem)' },
  { value: 'mb-8', label: 'mb-8 (2rem)' },
  { value: 'mb-12', label: 'mb-12 (3rem)' },
  { value: 'mb-16', label: 'mb-16 (4rem)' },
  { value: 'mb-20', label: 'mb-20 (5rem)' },
];

export const spacingMt = [
  { value: 'mt-4', label: 'mt-4 (1rem)' },
  { value: 'mt-8', label: 'mt-8 (2rem)' },
  { value: 'mt-12', label: 'mt-12 (3rem)' },
  { value: 'mt-16', label: 'mt-16 (4rem)' },
  { value: 'mt-20', label: 'mt-20 (5rem)' },
];

export const spacingMy = [
  { value: 'my-4', label: 'my-4 (1rem)' },
  { value: 'my-8', label: 'my-8 (2rem)' },
  { value: 'my-12', label: 'my-12 (3rem)' },
  { value: 'my-16', label: 'my-16 (4rem)' },
  { value: 'my-20', label: 'my-20 (5rem)' },
];

export const spacingPb = [
  { value: 'pb-4', label: 'pb-4 (1rem)' },
  { value: 'pb-8', label: 'pb-8 (2rem)' },
  { value: 'pb-12', label: 'pb-12 (3rem)' },
  { value: 'pb-16', label: 'pb-16 (4rem)' },
  { value: 'pb-20', label: 'pb-20 (5rem)' },
];

export const spacingPt = [
  { value: 'pt-4', label: 'pt-4 (1rem)' },
  { value: 'pt-8', label: 'pt-8 (2rem)' },
  { value: 'pt-12', label: 'pt-12 (3rem)' },
  { value: 'pt-16', label: 'pt-16 (4rem)' },
  { value: 'pt-20', label: 'pt-20 (5rem)' },
];

export const spacingPy = [
  { value: 'py-4', label: 'py-4 (1rem)' },
  { value: 'py-8', label: 'py-8 (2rem)' },
  { value: 'py-12', label: 'py-12 (3rem)' },
  { value: 'py-16', label: 'py-16 (4rem)' },
  { value: 'py-20', label: 'py-20 (5rem)' },
];

// The heading level of a teaser title. Same values as the AEM core Teaser's titleType; the
// policy's own list varies per site, so this is the widest one.
export const teaserTitleType = [
  { value: 'h1', label: 'H1' },
  { value: 'h2', label: 'H2' },
  { value: 'h3', label: 'H3' },
  { value: 'h4', label: 'H4' },
  { value: 'h5', label: 'H5' },
];

export const themeType = [
  { value: 'style-primary', label: 'Primary' },
  { value: 'style-secondary', label: 'Secondary' },
  { value: 'style-tertiary', label: 'Tertiary' },
  { value: 'style-quaternary', label: 'Quaternary' },
];
