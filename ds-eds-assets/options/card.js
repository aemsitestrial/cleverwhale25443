// Option lists for the card component. Data only: each entry is { value, label },
// where value is the CSS class (several classes are space separated) or the plain value the component accepts.

export const cardAemModifier = [
  { value: 'modifier-linked-video', label: 'Linked video' },
];

export const cardContentModifier = [
  { value: 'modifier-media-filled', label: 'Media filled' },
  { value: 'modifier-media-filled-animation', label: 'Media filled (animated)' },
  { value: 'modifier-content-center', label: 'Content center' },
  { value: 'modifier-banner', label: 'Banner' },
  { value: 'modifier-content-right', label: 'Content right' },
  { value: 'modifier-overlap-image', label: 'Overlap image' },
];

export const cardFeatureModifier = [
  { value: 'modifier-check', label: 'Check' },
  { value: 'modifier-circle-check', label: 'Circle check' },
];

export const cardIconType = [
  { value: 'modifier-vertical', label: 'Vertical' },
  { value: 'modifier-horizontal', label: 'Horizontal' },
  { value: 'modifier-centered', label: 'Centered' },
];

export const cardIconVariant = [
  { value: 'modifier-solid', label: 'Solid' },
  { value: 'modifier-outline', label: 'Outline' },
  { value: 'modifier-transparent', label: 'Transparent' },
  { value: 'modifier-transparent-filled', label: 'Transparent filled' },
];

export const cardType = [
  { value: 'ac-core-card-content', label: 'Card content' },
  { value: 'ac-core-card-aem', label: 'Card AEM' },
  { value: 'ac-core-card-feature', label: 'Card feature' },
  { value: 'ac-core-card-icon', label: 'Card icon' },
  { value: 'ac-core-card-product', label: 'Card product' },
];

export const cardImageCroppingType = [
  { value: 'modifier-no-image-crop', label: 'No image crop' },
];

// Lists a property can take several values of. A list not named here is a single choice.
export const optionMeta = {
  cardContentModifier: { multiple: true },
};

// Per type: the content props the type leaves out (`omit`) and the option lists that apply to it
// only (`options`); both may be left out. `list` is the option list that picks the type and
// `default` the type of an empty choice. An option list named under no type applies to every
// type, and a content prop is shown by every type that does not omit it.
export const typeMeta = {
  list: 'cardType',
  default: 'ac-core-card-content',
  types: {
    'ac-core-card-content': { options: ['cardContentModifier', 'cardImageCroppingType'] },
    'ac-core-card-aem': { options: ['cardAemModifier'] },
    'ac-core-card-feature': { options: ['cardFeatureModifier'] },
    'ac-core-card-icon': { options: ['cardIconVariant', 'cardIconType'] },
    'ac-core-card-product': { options: ['modifierVariant'] },
  },
};
