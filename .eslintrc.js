module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  overrides: [
    {
      files: '**/*.ts',
      plugins: ['@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      extends: ['plugin:@typescript-eslint/recommended'],
    },
  ],
};
