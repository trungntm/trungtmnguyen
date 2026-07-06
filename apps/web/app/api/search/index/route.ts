import { createSearchIndex } from '@repo/search';

import { createCmsSearchPayload } from '@/features/cms-blog/lib/create-cms-search-payload';

export const revalidate = 60;

export async function GET() {
  try {
    const { indexJson } = await createCmsSearchPayload();

    return Response.json(indexJson, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Failed to build CMS search index.', error);

    const { indexJson } = createSearchIndex([]);

    return Response.json(indexJson, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=86400',
      },
    });
  }
}
