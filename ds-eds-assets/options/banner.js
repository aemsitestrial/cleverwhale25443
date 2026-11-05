// Option lists for the banner component. Data only: each entry is { value, label },
// where value is the CSS class (several classes are space separated) or the plain value the component accepts.

export const bannerContentAlignment = [
  { value: 'modifier-content-center', label: 'Content center' },
  { value: 'modifier-content-right', label: 'Content right' },
];

export const bannerReverseContent = [
  { value: 'modifier-reverse-content', label: 'Reverse' },
];

export const bannerType = [
  { value: 'ac-core-content-banner', label: 'Content banner' },
  { value: 'ac-core-innovation-banner', label: 'Innovation banner' },
  { value: 'ac-core-innovation-hero-banner', label: 'Innovation hero banner' },
  { value: 'ac-core-product-banner', label: 'Product banner' },
  { value: 'ac-core-promo-banner', label: 'Promo banner' },
  { value: 'ac-core-section-banner', label: 'Section banner' },
  { value: 'ac-core-section-teaser', label: 'Section teaser' },
  { value: 'ac-core-startpage-banner', label: 'Startpage banner' },
  { value: 'ac-core-sticky-banner', label: 'Sticky banner' },
];

export const promoBannerStyle = [
  { value: 'modifier-boxed', label: 'Boxed' },
  { value: 'modifier-card', label: 'Card' },
];

export const sectionTeaserImage = [
  { value: 'modifier-image-primary', label: 'Image primary' },
  { value: 'modifier-image-secondary', label: 'Image secondary' },
  { value: 'modifier-image-tertiary', label: 'Image tertiary' },
  { value: 'modifier-image-quaternary', label: 'Image quaternary' },
];

export const startpageBannerModifier = [
  { value: 'modifier-reverse-content', label: 'Reverse' },
  { value: 'modifier-no-icons', label: 'No icon' },
];

export const stickyBannerContentType = [
  { value: 'modifier-contact', label: 'Contact' },
  { value: 'modifier-e-learning', label: 'E-learning' },
  { value: 'modifier-download', label: 'Download' },
];

// Per type: the option lists that apply to it only. See options/card.js for the shape.
export const typeMeta = {
  list: 'bannerType',
  default: 'ac-core-content-banner',
  types: {
    'ac-core-content-banner': { options: ['bannerContentAlignment'] },
    'ac-core-innovation-banner': { options: ['bannerReverseContent'] },
    'ac-core-innovation-hero-banner': { options: ['bannerReverseContent'] },
    'ac-core-product-banner': { options: ['bannerReverseContent'] },
    'ac-core-promo-banner': { options: ['promoBannerStyle'] },
    'ac-core-section-banner': {},
    'ac-core-section-teaser': { options: ['sectionTeaserImage'] },
    'ac-core-startpage-banner': { options: ['startpageBannerModifier'] },
    'ac-core-sticky-banner': { options: ['stickyBannerContentType'] },
  },
};
