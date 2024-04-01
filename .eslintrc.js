// @ts-check
const { translatorFunctionName } = require('./package.json').spotifi18n;
const fs = require('fs');
const path = require('path');

const zones = (() => {
  const views = fs
    .readdirSync(path.join(__dirname, 'src', 'views'))
    .filter(file =>
      fs.statSync(path.join(__dirname, 'src', 'views', file)).isDirectory(),
    );

  return {
    components: [
      {
        except: [
          '**/src/shared/helpers/**/*',
          '**/src/shared/hooks/utils/**/*',
        ],
        from: ['./src/!(shared)/**/*', './src/shared/!(components)/**/*'],
        message:
          'Shared components should only import other shared components, utility hooks and helpers, otherwise they should be placed in src/shared/patterns.',
        target: './src/shared/components/**/*',
      },
    ],
    views: views.map(view => ({
      from: [`./src/views/!(${view})/**/*`, `./src/shared/layouts/**/*`],
      message:
        'Do not cross view boundaries or import layouts, use the shared components and patterns instead.',
      target: `./src/views/${view}/**/*`,
    })),
  };
})();

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    'plugin:@next/next/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  overrides: [
    {
      excludedFiles: ['*.test.*', '*stories.*'],
      extends: ['plugin:i18next/recommended'],
      files: ['**/*.tsx'],
      plugins: ['i18next'],
      rules: {
        'i18next/no-literal-string': [
          'error',
          (include => ({
            callees: {
              exclude: ['register', translatorFunctionName],
            },
            'jsx-attributes': {
              include,
            },
            'jsx-components': {
              exclude: ['style', 'Script'],
            },
            mode: 'jsx-only',
            'object-properties': {
              include,
            },
            'should-validate-template': true,
            words: {
              exclude: ['Megaphone', '404', '-'],
            },
          }))([
            'alt',
            'aria-label',
            'body',
            'description',
            'hiddenLabel',
            'label',
            'overlay',
            'placeholder',
            'text',
            'title',
            'tooltip',
          ]),
        ],
      },
    },
    {
      env: {
        'jest/globals': true,
      },
      extends: [
        'plugin:testing-library/react',
        'plugin:jest-dom/recommended',
        'plugin:jest/recommended',
      ],
      files: ['*.test.ts', '*.test.tsx'],
      globals: {
        browser: true,
        context: true,
        page: true,
      },
      plugins: ['jest', 'jest-dom'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'i18next/no-literal-string': 'off',
        'jest/consistent-test-it': ['error', { fn: 'it' }],
        'jest/no-confusing-set-timeout': 'error',
        'jest/no-duplicate-hooks': 'error',
        'jest/no-test-return-statement': 'error',
        'jest/prefer-hooks-in-order': 'error',
        'jest/prefer-hooks-on-top': 'error',
        'jest/prefer-strict-equal': 'error',
        'jest/prefer-todo': 'error',
        'jest/require-top-level-describe': 'error',
        'jest/valid-title': [
          'error',
          {
            mustNotMatch: [
              '(^should)|(\\.$)',
              'Test titles should not start with "should" or end with a full-stop',
            ],
          },
        ],
        'megaphone/jest-hooks': 'error',
      },
    },
    {
      extends: [
        'plugin:storybook/recommended',
        'plugin:@chanzuckerberg/stories/recommended',
      ],
      files: ['*.stories.*'],
      plugins: ['@chanzuckerberg/stories'],
      rules: {
        '@chanzuckerberg/stories/no-csf-v2': 'error',
        'import/exports-last': 'off',
        'megaphone/no-explicit-bind': 'error',
        'storybook/no-title-property-in-meta': 'error',
      },
    },
    {
      excludedFiles: ['*.test.*'],
      files: ['./src/shared/components/**/*'],
      rules: {
        'import/no-restricted-paths': [
          'error',
          {
            zones: zones.components,
          },
        ],
      },
    },
    {
      excludedFiles: ['*.test.*'],
      files: ['./src/views/**/*'],
      rules: {
        'import/no-restricted-paths': [
          'error',
          {
            zones: zones.views,
          },
        ],
      },
    },
    {
      excludedFiles: ['*.test.*'],
      files: ['./src/views/**/server/*.ts'],
      rules: {
        '@typescript-eslint/no-redundant-type-constituents': 'off',
      },
    },
    {
      excludedFiles: ['*.test.*'],
      files: ['./src/shared/providers/**/*'],
      rules: {
        'import/no-restricted-paths': [
          'error',
          {
            zones: [
              {
                except: [
                  '**/src/shared/components/**/*',
                  '**/src/shared/helpers/**/*',
                  '**/src/shared/hooks/utils/**/*',
                  '**/src/shared/server/**/*',
                ],
                from: [
                  './src/!(shared)/**/*',
                  './src/shared/!(providers)/**/*',
                ],
                message:
                  'Shared providers should only import other shared providers, shared components, utility hooks and helpers.',
                target: './src/shared/providers/**/*',
              },
            ],
          },
        ],
      },
    },
    {
      excludedFiles: ['*.test.*', '*stories.*'],
      files: ['./src/**/use*', './src/**/[A-Z]*'],
      rules: {
        'megaphone/export-matching-filename': 'error',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
      modules: true,
    },
    ecmaVersion: 2018,
    project: `${__dirname}/tsconfig.json`,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  plugins: [
    '@typescript-eslint',
    'es',
    'import',
    'jsx-a11y',
    'megaphone',
    'prettier',
    'react',
    'react-hooks',
    'simple-import-sort',
    'sort-destructure-keys',
    'sort-keys-fix',
    'typescript-sort-keys',
    'unicorn',
    'unused-imports',
  ],
  rules: {
    '@typescript-eslint/ban-types': 'error',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        disallowTypeAnnotations: true,
        fixStyle: 'inline-type-imports',
        prefer: 'type-imports',
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        format: ['PascalCase'],
        selector: 'typeLike',
      },
    ],
    '@typescript-eslint/no-duplicate-enum-values': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-extra-non-null-assertion': 'error',
    '@typescript-eslint/no-import-type-side-effects': 'error',
    '@typescript-eslint/no-inferrable-types': 'error',
    '@typescript-eslint/no-invalid-void-type': 'error',
    '@typescript-eslint/no-misused-promises': [
      'error',
      { checksVoidReturn: false },
    ],
    '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
    '@typescript-eslint/no-redundant-type-constituents': 'error',
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/no-unnecessary-qualifier': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-unnecessary-type-constraint': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/prefer-includes': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-ts-expect-error': 'error',
    '@typescript-eslint/restrict-template-expressions': 'error',
    '@typescript-eslint/sort-type-constituents': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    curly: ['error', 'multi-line'],
    'es/no-regexp-lookbehind-assertions': 'error',
    'import/first': 'error',
    'import/namespace': 'off',
    'import/newline-after-import': 'error',
    'import/no-absolute-path': 'error',
    'import/no-cycle': 'error',
    'import/no-duplicates': 'error',
    'import/no-mutable-exports': 'error',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-self-import': 'error',
    'import/no-unused-modules': 'error',
    'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
    'megaphone/i18n': [
      'error',
      {
        translatorFunctionName,
      },
    ],
    'no-console': 'error',
    'no-duplicate-case': 'error',
    'no-fallthrough': 'error',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            message:
              'Ads Business components should be imported from their directory, not the index. Example: `import { VisualPicker } from @spotify-internal/encore-web/ads-business/components/VisualPicker`',
            name: '@spotify-internal/encore-web/ads-business',
          },
          {
            message:
              'Do not import lodash directly, instead specify the function you need. Example: `import startCase from lodash/startCase`',
            name: 'lodash',
          },
          {
            message:
              'The renderHook API should be imported from @testing-library/react: https://github.com/testing-library/react-hooks-testing-library#a-note-about-react-18-support',
            name: '@testing-library/react-hooks',
          },
          {
            importNames: [
              'DialogAlert',
              'DialogConfirmation',
              'DialogFullScreen',
              'Table',
              'TableRow',
              'TextLink',
              'TooltipTrigger',
            ],
            message:
              'Please use the shared component instead of importing from Encore.',
            name: '@spotify-internal/encore-web',
          },
          {
            message: 'Please import from @spotify-internal/encore-web',
            name: '@spotify-internal/encore-web/core',
          },
          {
            message:
              'Do not import from index directly as it may lead to circular imports.',
            name: '.',
          },
          {
            importNames: ['useLayoutEffect'],
            message: `Use "import { useIsomorphicLayoutEffect } from 'usehooks-ts'" instead.`,
            name: 'react',
          },
        ],
      },
    ],
    'no-unused-expressions': [
      'error',
      {
        allowTaggedTemplates: true,
      },
    ],
    'no-useless-concat': 'error',
    'no-useless-return': 'error',
    'object-shorthand': ['error', 'always'],
    'prefer-const': 'error',
    'prefer-template': 'error',
    'prettier/prettier': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-boolean-value': 'error',
    'react/jsx-curly-brace-presence': ['error', 'never'],
    'react/jsx-sort-props': [
      'error',
      {
        reservedFirst: ['key'],
      },
    ],
    'react/self-closing-comp': 'error',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          [
            // Packages. `react` related packages come first.
            '^react',
            // External packages
            '^@?\\w',
          ],
          // Side effect imports.
          ['^\\u0000'],
          // Internal packages
          ['^pages/', '^shared/', '^views/'],
          // Tests-related imports
          ['^__tests__/'],
          [
            // Parent imports. Put `..` last.
            '^\\.\\.(?!/?$)',
            '^\\.\\./?$',
          ],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // Style imports.
          ['^.+\\.s(a|c)ss$'],
        ],
      },
    ],
    'sort-destructure-keys/sort-destructure-keys': 'error',
    'sort-keys-fix/sort-keys-fix': 'error',
    'typescript-sort-keys/interface': 'error',
    'typescript-sort-keys/string-enum': 'error',
    'unicorn/no-abusive-eslint-disable': 'error',
    'unused-imports/no-unused-imports': 'error',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        project: `${__dirname}/tsconfig.json`,
      },
    },
    jest: {
      version: require('jest/package.json').version,
    },
    react: {
      version: 'detect',
    },
  },
};
