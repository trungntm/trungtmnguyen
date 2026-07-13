export type AnalyticsEventPrimitive = string | number | boolean;

export type AnalyticsEventPayload = Record<string, AnalyticsEventPrimitive | undefined>;
