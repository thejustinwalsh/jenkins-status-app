module.exports = {
  root: true,
  plugins: ['import'],
  extends: ['@react-native', 'plugin:react/jsx-runtime'],
  rules: {
    'no-void': ['error', {allowAsStatement: true}],
    'react-native/no-inline-styles': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
        allowSeparatedGroups: true,
      },
    ],
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external'],
          ['internal', 'sibling', 'parent', 'index'],
          ['object', 'unknown'],
          'type',
        ],
        pathGroups: [
          {
            pattern: 'react*',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@app/**',
            group: 'internal',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react*', '@app/*', 'type'],
        distinctGroup: false,
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  overrides: [
    {
      files: ['jest/*.js', '**/*.spec.js', '**/*.spec.jsx'],
      env: {
        jest: true,
      },
    },
  ],
};
