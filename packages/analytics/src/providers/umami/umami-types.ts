export type UmamiTrackPayload = {
  website?: string;
  hostname?: string;
  language?: string;
  referrer?: string;
  screen?: string;
  title?: string;
  url?: string;
  name?: string;
  data?: Record<string, unknown>;
  timestamp?: number;
};

export type UmamiTrackUpdater = (payload: UmamiTrackPayload) => UmamiTrackPayload;

export interface UmamiTracker {
  track(): void;
  track(payload: UmamiTrackPayload): void;
  track(eventName: string): void;
  track(eventName: string, data: Record<string, unknown>): void;
  track(updater: UmamiTrackUpdater): void;
}

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}

export {};
