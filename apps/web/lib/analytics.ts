import type { AnalyticsConfig } from '@trungtmnguyen/analytics';

function getTrimmedEnv(name: string) {
  return process.env[name]?.trim();
}

export function buildAnalyticsConfig(): AnalyticsConfig {
  const providers: AnalyticsConfig['providers'] = [];
  const googleAnalyticsId = getTrimmedEnv('NEXT_PUBLIC_GOOGLE_ANALYTICS_ID');
  const umamiWebsiteId = getTrimmedEnv('NEXT_PUBLIC_UMAMI_WEBSITE_ID');
  const umamiScriptUrl = getTrimmedEnv('NEXT_PUBLIC_UMAMI_SCRIPT_URL');

  if (googleAnalyticsId) {
    providers.push({
      provider: 'google-analytics',
      measurementId: googleAnalyticsId,
    });
  }

  if (umamiWebsiteId && umamiScriptUrl) {
    providers.push({
      provider: 'umami',
      websiteId: umamiWebsiteId,
      scriptUrl: umamiScriptUrl,
    });
  }

  return {
    providers,
  };
}

export const analyticsConfig = buildAnalyticsConfig();
