import js from '@eslint/js';
import globals from 'globals';
import nextVitals from 'eslint-config-next/core-web-vitals';

const config = [
  js.configs.recommended,
  ...nextVitals,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    ignores: ['.next/**', 'node_modules/**'],
  },
];

export default config;
