export type Status = "active" | "caution" | "sunsetting";

export interface Tool {
  id: string; name: string; stage: string; tier: "popular" | "niche"; status: Status;
  url: string; best_for: string; tradeoffs: string; long_term: string; watch_out: string[];
  pricing_model: string; pricing_notes?: string; region: string;
  confidence: "researched" | "partly-researched" | "general-knowledge";
  sources: string[]; last_checked: string | null; replaced_by?: string[];
}
export interface Stage { id: string; title: string; why: string }
export interface IdeaType { id: string; name: string; blurb: string; stages: string[] }

export interface Prefs {
  region: string;
  experience: "beginner" | "some" | "developer";
  budget: "free" | "small" | "flexible";
  device: "phone" | "computer";
}
export interface RoadmapRequest extends Prefs { ideaType?: string; description?: string }

/** Tool ids only: the client resolves them against the library. */
export interface Stop { stage: string; picks: string[]; alternatives: string[] }
export interface Roadmap { ideaType: string; mode: "ai" | "rules"; stops: Stop[]; added?: string[] }

export type RoadmapResponse =
  | { ok: true; roadmap: Roadmap }
  | { ok: false; error: "no_match" | "bad_request" | "rate_limited"; message: string; suggestions?: string[] };
