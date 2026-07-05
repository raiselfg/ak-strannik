import { viteReactConfig } from '@ak-strannik/eslint-config/vite-react';

export default [
  ...viteReactConfig,
  {
    files: ['src/routes/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
];
