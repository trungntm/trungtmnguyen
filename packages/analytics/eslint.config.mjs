import { createNextAppEslintConfig } from '../../packages/config/eslint/next-app.mjs';

const config = [
  ...createNextAppEslintConfig({
    rootDir: import.meta.dirname,
  }),
  {
    settings: {
      react: {
        version: '19.2',
      },
    },
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
];

export default config;
