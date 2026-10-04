import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['dist/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        cancelAnimationFrame: 'readonly',
        clearTimeout: 'readonly',
        console: 'readonly',
        document: 'readonly',
        Image: 'readonly',
        requestAnimationFrame: 'readonly',
        setTimeout: 'readonly',
        window: 'readonly',
      },
    },
  },
];
