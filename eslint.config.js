const js = require('@eslint/js');
const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintConfigPrettier = require('eslint-config-prettier/flat');
const pluginJest = require('eslint-plugin-jest');
const preferArrowFunctions = require('eslint-plugin-prefer-arrow-functions');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const pluginReactNative = require('eslint-plugin-react-native');
const testingLibrary = require('eslint-plugin-testing-library');
const tseslint = require('typescript-eslint');
const compat = require('@eslint/compat');

module.exports = defineConfig([
  globalIgnores([
    'dist/*',
    'build/*',
    'node_modules/*',
    'android/*',
    'ios/*',
    '.expo/*',
    'web-build/*',
    'coverage/*',
  ]),
  js.configs.recommended,
  compat.fixupConfigRules(expoConfig),
  eslintPluginPrettierRecommended,
  eslintConfigPrettier,
  pluginJest.configs['flat/recommended'],
  testingLibrary.configs['flat/react'],
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: {
      js,
      'prefer-arrow-functions': preferArrowFunctions,
      'react-native': compat.fixupPluginRules(pluginReactNative),
    },
    extends: ['js/recommended'],
    languageOptions: {
      globals: {
        __DEV__: 'readonly',
        ...pluginJest.environments.globals.globals,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
      'import/ignore': ['node_modules'],
    },
    rules: {
      // typescript-eslint
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        // onPress={async () => ...} e handleSubmit() sao idiomaticos em RN;
        // o resto da regra continua ligado.
        { checksVoidReturn: { attributes: false } },
      ],

      // react
      'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
      'react/jsx-newline': ['error', { prevent: false }],
      'react/jsx-sort-props': [
        'error',
        {
          callbacksLast: true,
          shorthandFirst: true,
          noSortAlphabetically: false,
          reservedFirst: true,
          ignoreCase: true,
        },
      ],
      'react/function-component-definition': [
        2,
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/no-unstable-nested-components': [
        'error',
        {
          allowAsProps: true,
        },
      ],
      'react/style-prop-object': [
        'error',
        {
          allow: ['StatusBar'],
        },
      ],
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/self-closing-comp': 'error',
      'react/jsx-curly-brace-presence': [
        'error',
        { props: 'never', children: 'never' },
      ],

      // React Hooks
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/immutability': 'warn',

      // React Native
      'react-native/no-unused-styles': 'warn',
      'react-native/split-platform-components': 'warn',
      'react-native/no-color-literals': 'error',

      // prettier
      'prettier/prettier': 'error',

      // prefer-arrow-functions
      'prefer-arrow-functions/prefer-arrow-functions': [
        'warn',
        {
          classPropertiesAllowed: false,
          disallowPrototype: false,
          returnStyle: 'unchanged',
          singleReturnOnly: false,
        },
      ],

      //jest
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',

      // import
      'import/namespace': 'off',
      'import/no-cycle': 'error',
      'import/no-dynamic-require': 'warn',
      'import/no-nodejs-modules': 'warn',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          ts: 'never',
          tsx: 'never',
        },
      ],
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      // Quality
      curly: ['error', 'all'],
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': ['error'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'prefer-destructuring': [
        'error',
        {
          array: false,
          object: true,
        },
      ],

      // Performance
      'no-await-in-loop': 'warn',
      'require-await': 'error',

      // custom
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-native',
              importNames: ['Image'],
              message: 'Please import from @/components/ui/Image instead',
            },
            {
              name: 'expo-image',
              importNames: ['Image'],
              message: 'Please import from @/components/ui/Image instead',
            },
            {
              name: 'react-native',
              importNames: ['Pressable', 'TouchableOpacity'],
              message: 'Please import from @/components/ui/Pressable instead',
            },
            {
              name: 'zod',
              message: 'Please import from @/validation/zod instead',
            },
          ],
          patterns: [
            {
              group: ['../../../*'],
              message:
                'Relative imports with more than 2 levels are not allowed. Use absolute imports instead.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.config.*'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'src/test/**'],
    rules: {
      // In RNTL v14 render, renderHook and fireEvent.* return a Promise; the
      // rule still assumes the synchronous API of earlier versions.
      'testing-library/no-await-sync-events': 'off',
    },
  },
]);
