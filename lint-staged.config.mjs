import { existsSync } from 'node:fs';

function quoteFiles(files) {
  return files.map((file) => JSON.stringify(file)).join(' ');
}

function existingFiles(files) {
  return files.filter((file) => existsSync(file));
}

export default {
  '*.{js,jsx,ts,tsx,mjs,cjs}': (files) => {
    const existing = existingFiles(files);

    if (existing.length === 0) {
      return [];
    }

    return `pnpm --filter @apps/web exec eslint --fix ${quoteFiles(existing)}`;
  },
  '*.{json,md,css}': (files) => {
    const existing = existingFiles(files);

    if (existing.length === 0) {
      return [];
    }

    return `pnpm exec prettier --write ${quoteFiles(existing)}`;
  },
};
