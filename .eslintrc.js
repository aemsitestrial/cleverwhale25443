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
    // metadata.
    'xwalk/max-cells': ['error', {
      '*': 4,
      section: 13,
      'ac-carousel-item': 6,
      'ac-list-item': 20,
      'ac-splide-carousel-item': 6,
    }],
  },
};
