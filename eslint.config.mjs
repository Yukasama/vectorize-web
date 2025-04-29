import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import n from 'eslint-plugin-n';
import perfectionist from 'eslint-plugin-perfectionist';
import playwright from 'eslint-plugin-playwright';
import preferArrows from 'eslint-plugin-prefer-arrow-functions';
import prettier from 'eslint-plugin-prettier/recommended';
import promise from 'eslint-plugin-promise';
import regexp from 'eslint-plugin-regexp';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = tseslint.config(
  js.configs.recommended,
  comments.recommended,
  prettier,
  promise.configs['flat/recommended'],
  regexp.configs['flat/recommended'],
  n.configs['flat/recommended-script'],
  perfectionist.configs['recommended-natural'],
  security.configs.recommended,
  sonarjs.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  unicorn.configs.recommended,
  ...compat.extends('next', 'next/core-web-vitals', 'next/typescript'),
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    ignores: [
      '**/test-results',
      '**/playwright-report',
      '**/.vercel',
      '**/node_modules',
      '**/.next',
    ],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@stylistic': stylistic,
      'prefer-arrow-functions': preferArrows,
    },
    rules: {
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/indent': 'off',
      '@stylistic/indent-binary-ops': 'off',
      '@stylistic/member-delimiter-style': 'off',
      '@stylistic/multiline-ternary': 'off',
      '@stylistic/no-tabs': 'off',
      '@stylistic/operator-linebreak': 'off',
      '@stylistic/quote-props': ['error', 'as-needed'],
      '@stylistic/quotes': 'off',
      '@stylistic/semi': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      curly: 'warn',
      'n/no-extraneous-import': 'off',
      'n/no-missing-import': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
      'perfectionist/sort-imports': 'off',
      'prefer-arrow-functions/prefer-arrow-functions': [
        'warn',
        {
          allowedNames: [],
          allowNamedFunctions: false,
          allowObjectProperties: false,
          classPropertiesAllowed: false,
          disallowPrototype: false,
          returnStyle: 'unchanged',
          singleReturnOnly: false,
        },
      ],
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'security/detect-object-injection': 'off',
      'sonarjs/cognitive-complexity': 'warn',
      'sonarjs/no-nested-conditional': 'warn',
      'unicorn/no-nested-ternary': 'warn',
      'unicorn/numeric-separators-style': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
    settings: {
      'import/resolver': {
        alwaysTryTypes: true,
        node: true,
        project: import.meta.url,
        typescript: true,
      },
      react: {
        version: 'detect',
      },
    },
  },
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**'],
    rules: playwright.configs['flat/recommended'].rules,
  },
);

export default eslintConfig;
