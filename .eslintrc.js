module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'plugin:json/recommended',
    'plugin:xwalk/recommended',
  ],
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    'import/extensions': ['error', { js: 'always' }], // require js file extensions in imports
    'linebreak-style': ['error', 'unix'], // enforce unix linebreaks
    'no-param-reassign': [2, { props: false }], // allow modifying properties of param
    // The items of the design system's carousels and list (ac-*-item) have one cell per field,
    // which their blocks read by position: six for a carousel item; twenty for a list item, which
    // has every field of the card it can be. The section's design-system fields are section
    // metadata: with the Dekker package's Composition and Background lists there are fourteen.
    'xwalk/max-cells': ['error', {
      '*': 4,
      section: 14,
      'ac-carousel-item': 6,
      'ac-list-item': 20,
      'ac-splide-carousel-item': 6,
      'dekker-carousel-item': 6,
      // A card of the Dekker News block: image, title, description, date and link.
      'dekker-block-news-item': 5,
      // The items of the AC Block Table Of Content Layout: a "kind" cell, the fields of the
      // component they render, one cell each, and a "Place" cell.
      'ac-block-table-of-content-layout-title': 7,
      'ac-block-table-of-content-layout-text': 9,
      'ac-block-table-of-content-layout-card': 26,
      'ac-block-table-of-content-layout-text-content': 19,
      'ac-block-table-of-content-layout-image': 6,
      'ac-block-table-of-content-layout-button': 12,
      'ac-block-table-of-content-layout-link': 10,
      'ac-block-table-of-content-layout-table': 6,
      'ac-block-table-of-content-layout-separator': 6,
      'ac-block-table-of-content-layout-download': 14,
    }],
  },
};
