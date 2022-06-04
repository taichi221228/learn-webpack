module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/jsx-runtime',
    'plugin:react/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  overrides: [
    {
      files: '**/*.ts',
      plugins: ['@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      extends: ['plugin:@typescript-eslint/recommended'],
    },
  ],
  settings: {
    react: {
      createClass: 'createReactClass',
      pragma: 'React',
      fragment: 'Fragment',
      version: 'detect',
      flowVersion: '0.53',
    },
    propWrapperFunctions: [
      'forbidExtraProps',
      { property: 'freeze', object: 'Object' },
      { property: 'myFavoriteWrapper' },

      { property: 'forbidExtraProps', exact: true },
    ],
    componentWrapperFunctions: [
      'observer',
      { property: 'styled' },
      { property: 'observer', object: 'Mobx' },
      { property: 'observer', object: '<pragma>' },
    ],
    formComponents: ['CustomForm', { name: 'Form', formAttribute: 'endpoint' }],
    linkComponents: ['Hyperlink', { name: 'Link', linkAttribute: 'to' }],
  },
};
