import { Hono } from "hono";
import { buildRoadmap, library } from "./engine";
import type { AiEnv } from "./engine";
import { memoryLimiter } from "./limit";
import type { Limiter } from "./limit";
import type { RoadmapRequest, RoadmapResponse } from "../shared/types";

const REGIONS = ["everywhere", "africa", "europe", "india", "latin-america"] as const;
const EXPERIENCE = ["beginner", "some", "developer"] as const;
const BUDGET = ["free", "small", "flexible"] as const;
const DEVICE = ["phone", "computer"] as const;
const oneOf = <T extends string>(v: unknown, allowed: readonly T[], d: T): T =>
  (allowed as readonly unknown[]).includes(v) ? (v as T) : d;

type Env = AiEnv & { ROADMAP_LIMITER?: Limiter };
const fallbackLimiter = memoryLimiter(10, 60_000);

const app = new Hono<{ Bindings: Env }>();

// The roadmap endpoint can call a paid model, so limit it per visitor.
app.use("/api/roadmap", async (c, next) => {
  if (c.req.method !== "POST") return next();
  const key = `roadmap:${c.req.header("cf-connecting-ip") ?? "unknown"}`;
  const { success } = await (c.env.ROADMAP_LIMITER ?? fallbackLimiter).limit({ key });
  if (!success) {
    return c.json({ ok: false, error: "rate_limited", message: "Too many roadmaps just now. Wait a minute and try again." } satisfies RoadmapResponse, 429);
  }
  await next();
});

app.get("/api/health", (c) => c.json({ ok: true }));

app.get("/api/library", (c) => {
  c.header("Cache-Control", "public, max-age=300");
  return c.json(library);
});

app.post("/api/roadmap", async (c) => {
  const body = (await c.req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") {
    return c.json({ ok: false, error: "bad_request", message: "Send a JSON body." } satisfies RoadmapResponse, 400);
  }
  const req: RoadmapRequest = {
    ideaType: typeof body.ideaType === "string" ? body.ideaType : undefined,
    description: typeof body.description === "string" ? body.description.slice(0, 1000) : undefined,
    region: oneOf(body.region, REGIONS, "everywhere"),
    experience: oneOf(body.experience, EXPERIENCE, "some"),
    budget: oneOf(body.budget, BUDGET, "small"),
    device: oneOf(body.device, DEVICE, "computer"),
  };
  const roadmap = await buildRoadmap(req, c.env);
  if (!roadmap) {
    return c.json({
      ok: false, error: "no_match",
      message: "We could not tell what you are making. Pick the closest type.",
      suggestions: library.ideaTypes.map((i) => i.id),
    } satisfies RoadmapResponse, 422);
  }
  return c.json({ ok: true, roadmap } satisfies RoadmapResponse);
});

// TODO: verify the Dodo Payments webhook signature, then update subscription state.
// Until then, refuse everything so unsigned calls cannot change anything.
app.post("/api/webhooks/dodo", (c) => c.json({ ok: false, error: "not_implemented" }, 501));

export default app;
