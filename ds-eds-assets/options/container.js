// Option lists for the container component. Data only: each entry is { value, label },
// where value is the CSS class (several classes are space separated) or the plain value the component accepts.

// The widths of the content inside a container, as the design system's `ds-content-width-N`
// classes (N of 12 columns). An empty value takes the width of the section around the container.
export const contentWidth = [
  { value: '6', label: 'Narrow (6)' },
  { value: '8', label: 'Standard (8)' },
  { value: '10', label: 'Wide (10)' },
  { value: '12', label: 'Default (12)' },
];

export const gridVariant = [
  { value: 'grid-col-1', label: '1 column' },
  { value: 'grid-col-2', label: '2 columns' },
  { value: 'grid-col-3', label: '3 columns' },
  { value: 'grid-col-4', label: '4 columns' },
  { value: 'grid-col-5', label: '5 columns' },
  { value: 'grid-col-1-2', label: '1/3 + 2/3' },
  { value: 'grid-col-2-1', label: '2/3 + 1/3' },
];

// The "Variants - Filter block" container styles: the four containers a Teasers with filter is built
// from, outermost first (the outer container, its top-content container, the filter container and
// the cards container).
export const filterBlockVariant = [
  { value: 'ac-core-block-teasers-with-filter', label: 'Filter block' },
  { value: 'ac-core-block-teasers-with-filter-top-content', label: 'Top content' },
  { value: 'ac-core-filter', label: 'Filter search' },
  { value: 'ac-core-block-teasers-with-filter-cards', label: 'Cards' },
];

// The "Variants - Block Containers" container styles: whole compositions built from nested blocks.
// Each has its own class and CSS bundle; the list grows with each composition the EDS container renders.
export const blockContainerVariant = [
  { value: 'ac-core-block-quote-section', label: 'Quote Section' },
  { value: 'ac-core-block-section-banner-with-cards', label: 'Section Banner with cards' },
  { value: 'ac-core-block-content-with-splide-grid-carousel', label: 'Content with splide grid carousel' },
  { value: 'ac-core-block-content-with-splide-grid-carousel modifier-horizontal', label: 'Content with splide grid carousel horizontal' },
  { value: 'ac-core-block-splide-grid-carousel', label: 'Splide Grid carousel' },
  // Not in AEM's policy list at the time of writing; the label is the Storybook story's name (AC/Blocks/Block Country Selector).
  { value: 'ac-core-block-country-selector', label: 'Block Country Selector' },
  { value: 'ac-core-block-cta-section', label: 'CTA Section' },
  { value: 'ac-core-block-cta-section modifier-content-centered', label: 'CTA Section centered' },
];

// The "Variants - Carousel" container styles: the container whose items are the slides. The
// controller for the grid variant starts on its class (see block-splide-grid-carousel.controller.js).
export const carouselVariant = [
  { value: 'ac-core-splide-carousel ds-splide-carousel', label: 'Splide Carousel' },
  { value: 'ac-core-splide-grid-carousel ds-splide-carousel', label: 'Splide Grid Carousel' },
];

// The "Variants - Table of Contents" container styles: one class per container of a Table of
// contents layout. The root, the sidebar, the sticky container inside it and the content container
// are four nested containers, and each takes one of the four. The layout controller starts on the
// root and finds the other two by their classes (block-table-of-content-layout.controller.ts).
export const tocLayout = [
  { value: 'ds-brand-block-toc-layout', label: 'TOC' },
  { value: 'ds-brand-block-toc-layout-sidebar', label: 'Sidebar' },
  { value: 'ds-brand-sticky-container', label: 'Sticky container' },
  { value: 'TOC-content-container', label: 'TOC Content block' },
];
