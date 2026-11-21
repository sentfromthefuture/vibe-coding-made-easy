import assert from "node:assert/strict";
import { buildRoadmap, library, matchIdeaType, needsFromText, withExtras } from "../src/worker/engine";
import { memoryLimiter } from "../src/worker/limit";

const ids = new Set(library.tools.map((t) => t.id));
const byId = new Map(library.tools.map((t) => [t.id, t]));
const regions = ["everywhere", "africa", "europe", "india", "latin-america"];
let roadmaps = 0;

for (const idea of library.ideaTypes) {
  for (const region of regions) {
    for (const device of ["phone", "computer"] as const) {
      const rm = await buildRoadmap({ ideaType: idea.id, region, experience: "some", budget: "free", device });
      assert.ok(rm, `${idea.id} produced a roadmap`);
      assert.deepEqual(rm.stops.map((s) => s.stage), idea.stages, "stops follow the idea type order");
      for (const s of rm.stops) {
        assert.ok(s.picks.length >= 1, `${idea.id}/${region}/${s.stage} has a pick`);
        for (const id of [...s.picks, ...s.alternatives]) {
          assert.ok(ids.has(id), `${id} exists`);
          const t = byId.get(id)!;
          assert.notEqual(t.status, "sunsetting", `${id} is not sunsetting`);
          assert.ok(t.region === "global" || t.region === region, `${id} matches region ${region}`);
          assert.equal(t.stage, s.stage, `${id} is in stage ${s.stage}`);
        }
      }
      roadmaps++;
    }
  }
}

const phoneBuild = (await buildRoadmap({ ideaType: "saas", region: "everywhere", experience: "beginner", budget: "free", device: "phone" }))!;
assert.ok(["lovable", "bolt-new", "replit-agent"].includes(phoneBuild.stops.find((s) => s.stage === "build")!.picks[0]), "phone beginners get a browser builder first");
const africa = (await buildRoadmap({ ideaType: "marketplace", region: "africa", experience: "some", budget: "small", device: "computer" }))!;
assert.ok(africa.stops.find((s) => s.stage === "payments")!.picks.includes("flutterwave"), "africa surfaces Flutterwave");
assert.equal(matchIdeaType("a chrome extension that saves tabs"), "extension");
assert.equal(matchIdeaType("zzz"), null);
assert.equal(await buildRoadmap({ description: "zzz", region: "everywhere", experience: "some", budget: "small", device: "computer" }), null);

// Ranking: curated order breaks ties, and a regional match gets a boost
const pay = async (region: string) => (await buildRoadmap({ ideaType: "saas", region, experience: "some", budget: "small", device: "computer" }))!.stops.find((x) => x.stage === "payments")!.picks;
assert.equal((await pay("everywhere"))[0], "stripe", "stripe leads for a global audience");
assert.deepEqual((await pay("europe")).slice(0, 2), ["mollie", "stripe"]);
assert.equal((await pay("india"))[0], "razorpay");
const dataPick = (await buildRoadmap({ ideaType: "saas", region: "everywhere", experience: "some", budget: "small", device: "computer" }))!.stops.find((x) => x.stage === "data")!.picks[0];
assert.equal(dataPick, "supabase");

// Free-text needs
assert.deepEqual(needsFromText("subscriptions with login and image uploads").sort(), ["auth", "payments", "storage"]);
assert.deepEqual(withExtras(["design", "build", "ship"], ["ai", "ai", "nope", "build"]), ["design", "build", "ai", "ship"]);
const text = (await buildRoadmap({ description: "a marketplace for dog walkers with payments, login and voice notes", region: "everywhere", experience: "some", budget: "small", device: "computer" }))!;
assert.equal(text.ideaType, "marketplace");
assert.deepEqual(text.added, ["ai"]);
const order = text.stops.map((s) => s.stage);
assert.ok(order.indexOf("ai") < order.indexOf("ship"), "added stops come before ship");

// Rate limiter fallback
let clock = 0;
const lim = memoryLimiter(2, 1000, () => clock);
assert.equal((await lim.limit({ key: "a" })).success, true);
assert.equal((await lim.limit({ key: "a" })).success, true);
assert.equal((await lim.limit({ key: "a" })).success, false);
assert.equal((await lim.limit({ key: "b" })).success, true, "keys are separate");
clock = 1001;
assert.equal((await lim.limit({ key: "a" })).success, true, "window resets");

// AI path with a fake model: bad output must be dropped, good output used
const env = { OPENROUTER_API_KEY: "test", OPENROUTER_MODEL: "test" };
const realFetch = globalThis.fetch;
globalThis.fetch = (async (_u: unknown, init?: RequestInit) => {
  const system: string = JSON.parse(String(init?.body)).messages[0].content;
  const reply = system.includes("classify")
    ? { ideaType: "game", extra_stages: ["nonexistent", "payments"] }
    : { stops: [{ stage: "design", picks: ["v0", "not-a-tool", "lemon-squeezy"] }, { stage: "payments", picks: ["stripe"] }] };
  return new Response(JSON.stringify({ choices: [{ message: { content: "```json\n" + JSON.stringify(reply) + "\n```" } }] }));
}) as typeof fetch;
const viaAi = (await buildRoadmap({ description: "something fun", region: "everywhere", experience: "some", budget: "small", device: "computer" }, env))!;
assert.equal(viaAi.mode, "ai");
assert.equal(viaAi.ideaType, "game");
assert.deepEqual(viaAi.added, ["payments"], "unknown extra stage dropped, known one kept");
assert.deepEqual(viaAi.stops.find((s) => s.stage === "design")!.picks, ["v0"], "invented and sunsetting tools dropped");
assert.equal(viaAi.stops.find((s) => s.stage === "payments")!.picks[0], "stripe");
globalThis.fetch = (async () => { throw new Error("model down"); }) as typeof fetch;
const down = (await buildRoadmap({ ideaType: "saas", region: "everywhere", experience: "some", budget: "small", device: "computer" }, env))!;
assert.equal(down.mode, "rules", "falls back to rules when the model fails");
globalThis.fetch = realFetch;

console.log(`ok: ${roadmaps} roadmaps checked, plus text, limiter and AI-path checks`);
