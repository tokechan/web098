import path from 'node:path';
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import tailwind from 'eslint-plugin-tailwindcss';
import prettier from 'eslint-config-prettier';

const tailwindDesignSystem = path.resolve('app/style.css');

export default [
  js.configs.recommended,
  ...tseslint.configs['flat/recommended'],
  ...tailwind.configs['flat/recommended'],
  prettier,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      tailwindcss: tailwind,
    },
    settings: {
      tailwindcss: {
        config: tailwindDesignSystem,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-empty-object-type': 'off',
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/classnames-order': 'off',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
];
