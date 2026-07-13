import type { AnalyticsEventPayload } from './event-parameters';

function toSnakeCase(value: string) {
  return value.replace(/[A-Z]/g, (character) => `_${character.toLowerCase()}`);
}

export function normalizeEventParametersForGoogleAnalytics<TParameters extends AnalyticsEventPayload>(
  parameters: TParameters,
) {
  const normalizedEntries = Object.entries(parameters).flatMap(([key, value]) => {
    if (value === undefined) {
      return [];
    }

    return [[toSnakeCase(key), value] as const];
  });

  return Object.fromEntries(normalizedEntries) as Record<string, string | number | boolean>;
}
