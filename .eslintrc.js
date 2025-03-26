// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  ignorePatterns: ['/dist/*'],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'prettier/prettier': 'error',
  },
};
