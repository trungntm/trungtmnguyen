import { createSearchIndex } from '@trungtmnguyen/search';

import { createCmsSearchPayload } from '@/features/cms-blog/lib/create-cms-search-payload';

export const revalidate = 60;

export async function GET() {
  try {
    const { docsById } = await createCmsSearchPayload();

    return Response.json(docsById, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Failed to build CMS search docs.', error);

    const { docsById } = createSearchIndex([]);

    return Response.json(docsById, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=86400',
      },
    });
  }
}
