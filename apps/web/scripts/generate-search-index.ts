import path from 'node:path';

import { createBuilder } from '@content-collections/core';

async function main() {
  const builder = await createBuilder(path.join(process.cwd(), 'content-collections.ts'));
  await builder.build();
}

await main();
