import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export function createNextAppEslintConfig({ rootDir = '.' } = {}) {
  return defineConfig([
    ...nextVitals,
    ...nextTs,
    {
      files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
      settings: {
        next: {
          rootDir,
        },
      },
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
          },
        ],
      },
    },
    globalIgnores([
      '.next/**',
      '.content-collections/**',
      'out/**',
      'build/**',
      'coverage/**',
      'next-env.d.ts',
      'node_modules/**',
    ]),
  ]);
}
