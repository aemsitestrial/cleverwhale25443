// Option lists for the button component. Data only: each entry is { value, label },
// where value is the CSS class (several classes are space separated) or the plain value the component accepts.

export const buttonIcon = [
  { value: 'chevron-right', label: 'Chevron right' },
  { value: 'chevron-up', label: 'Chevron up' },
  { value: 'close', label: 'Close' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'play', label: 'Play' },
  { value: 'chevron-left', label: 'Chevron left' },
  { value: 'chevron-down', label: 'Chevron down' },
  { value: 'contact', label: 'Contact' },
  { value: 'launch', label: 'Launch' },
  { value: 'download', label: 'Download' },
  { value: 'arrow-right', label: 'Arrow right' },
  { value: 'planet', label: 'Planet' },
];

// Leading is the default layout, so modifier-leading has no CSS of its own: it marks the choice.
// Only modifier-trailing changes the layout.
export const buttonIconPosition = [
  { value: 'modifier-leading', label: 'Leading' },
  { value: 'modifier-trailing', label: 'Trailing' },
];

export const buttonTheme = [
  { value: 'style-primary-positive', label: 'Primary positive' },
  { value: 'style-primary-negative', label: 'Primary negative' },
  { value: 'style-secondary-positive', label: 'Secondary positive' },
  { value: 'style-secondary-negative', label: 'Secondary negative' },
];

// The "Grid-Carousel switch" button styles: the two buttons a Splide Grid carousel block carries
// to switch between grid and carousel. Each value is the class that hooks the button up in the
// block's controller, plus the class that styles it. Grid starts active, as AEM's style does.
export const buttonGridCarouselSwitch = [
  { value: 'ac-core-grid-button active text-capitalize', label: 'Grid' },
  { value: 'ac-core-carousel-button text-capitalize', label: 'Carousel' },
];
