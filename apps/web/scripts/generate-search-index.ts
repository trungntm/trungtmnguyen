import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { allBlogs } from 'content-collections';

import { createSearchIndex } from '@repo/search';

async function main() {
  const { docsById, indexJson } = createSearchIndex(allBlogs);
  const publicDirectory = path.join(process.cwd(), 'public');

  // Generate the serialized search assets ahead of runtime so search stays client-only.
  await mkdir(publicDirectory, { recursive: true });
  await Promise.all([
    writeFile(
      path.join(publicDirectory, 'search-index.json'),
      JSON.stringify(indexJson, null, 2),
      'utf8',
    ),
    writeFile(
      path.join(publicDirectory, 'search-docs.json'),
      JSON.stringify(docsById, null, 2),
      'utf8',
    ),
  ]);
}

void main();
