type CmsRedirect = {
  source: string;
  destination: string;
};

function isCmsRedirect(value: unknown): value is CmsRedirect {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const { source, destination } = value as Partial<CmsRedirect>;

  return (
    typeof source === 'string' &&
    typeof destination === 'string' &&
    source.trim().length > 0 &&
    destination.trim().length > 0 &&
    source !== destination
  );
}

export async function getRedirects() {
  try {
    const cmsBaseUrl = process.env.CMS_BASE_URL?.trim();

    if (!cmsBaseUrl) {
      throw new Error('Missing CMS_BASE_URL environment variable.');
    }

    const response = await fetch(
      `${cmsBaseUrl.replace(/\/+$/, '')}/api/public/redirects`,
      { signal: AbortSignal.timeout(5000) },
    );

    if (!response.ok) {
      throw new Error(`CMS API request failed with status ${response.status}.`);
    }

    const payload = (await response.json()) as unknown;
    const redirects =
      payload &&
      typeof payload === 'object' &&
      'data' in payload &&
      Array.isArray(payload.data)
        ? payload.data
        : [];

    return redirects.filter(isCmsRedirect).map(({ source, destination }) => ({
      source,
      destination,
      permanent: true,
    }));
  } catch (error) {
    console.warn('Failed to load redirects from CMS. Building without redirects.', error);
    return [];
  }
}
