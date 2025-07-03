// ESLINT CONFIGURATION
// linting rules for react frontend code quality
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] }, // ignore build output
  {
    files: ['**/*.{js,jsx}'], // apply to all js/jsx files
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser, // browser environment
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true }, // enable jsx parsing
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.2' } }, // react version for rules
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,      // base js rules
      ...react.configs.recommended.rules,   // react best practices
      ...react.configs['jsx-runtime'].rules, // jsx transform rules
      ...reactHooks.configs.recommended.rules, // hooks rules
      'react/jsx-no-target-blank': 'off',   // allow target="_blank" without rel
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
