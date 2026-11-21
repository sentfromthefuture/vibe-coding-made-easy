import assert from "node:assert/strict";
import { buildRoadmap, library, matchIdeaType } from "../src/worker/engine";

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
console.log(`ok: ${roadmaps} roadmaps checked`);
