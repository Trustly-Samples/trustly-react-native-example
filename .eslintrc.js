// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'plugin:ft-flow/recommended', 'prettier'],
  overrides: [
    {
      // Tests
      files: ['**/__tests__/**/*.jsx?', '**/?(*.)+(spec|test).jsx?'],
      extends: ['plugin:testing-library/react'],
    },
  ],
  parser: 'hermes-eslint',
  plugins: ['ft-flow', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
