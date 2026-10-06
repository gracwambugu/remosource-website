export type ConversionEventName =
  | "homepage_cta_clicked"
  | "form_submission_completed"
  | "hero_visual_changed"
  | "ai_role_brief_generation_started"
  | "ai_role_brief_generation_completed"
  | "ai_role_brief_generation_failed"
  | "ai_role_brief_applied";

export type ConversionEventProperties = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackConversion(
  event: ConversionEventName,
  properties: ConversionEventProperties,
) {
  if (typeof window === "undefined") return;

  const detail = { event, ...properties };
  window.dataLayer?.push(detail);
  window.dispatchEvent(new CustomEvent("remosource:analytics", { detail }));
}