import { useEffect, useState } from "react";
import type { IdeaType, Roadmap, RoadmapResponse, Stage, Stop, Tool } from "../shared/types";
import { Home } from "./screens/Home";
import { Questions } from "./screens/Questions";
import { RoadmapView } from "./screens/RoadmapView";
import { ToolDetail } from "./screens/ToolDetail";

export type Library = { tools: Tool[]; stages: Stage[]; ideaTypes: IdeaType[] };
export type Form = {
  ideaType: string; description: string; region: string; experience: string; budget: string; device: string;
};
const initial: Form = { ideaType: "", description: "", region: "everywhere", experience: "some", budget: "small", device: "computer" };

export default function App() {
  const [lib, setLib] = useState<Library | null>(null);
  const [form, setForm] = useState<Form>(initial);
  const [step, setStep] = useState<"home" | "questions" | "roadmap">("home");
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [detail, setDetail] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/library").then((r) => r.json()).then(setLib).catch(() => setError("Could not load the tool library."));
  }, []);

  const change = (p: Partial<Form>) => setForm((f) => ({ ...f, ...p }));

  async function generate() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ideaType: form.ideaType || undefined }),
      });
      const data = (await res.json()) as RoadmapResponse;
      if (data.ok) { setRoadmap(data.roadmap); setStep("roadmap"); }
      else { setError(data.message); setStep("home"); }
    } catch {
      setError("Something went wrong. Try again.");
    }
    setBusy(false);
  }

  /** Remix: make `id` the main pick of a stop; the old main pick becomes an alternative. */
  function swap(stage: string, id: string) {
    const next = (s: Stop): Stop => {
      if (s.stage !== stage) return s;
      const old = s.picks[0];
      const rest = s.picks.slice(1).filter((x) => x !== id);
      const alternatives = [...s.alternatives.filter((x) => x !== id), old].filter((x, i, a) => !rest.includes(x) && a.indexOf(x) === i);
      return { ...s, picks: [id, ...rest], alternatives };
    };
    setRoadmap((rm) => (rm ? { ...rm, stops: rm.stops.map(next) } : rm));
  }

  if (!lib) return <p>{error || "Loading the tool library…"}</p>;
  const tool = detail ? lib.tools.find((t) => t.id === detail) ?? null : null;

  return (
    <main>
      {error && <p role="alert">{error}</p>}
      {step === "home" && <Home lib={lib} form={form} onChange={change} onNext={() => { setError(""); setStep("questions"); }} />}
      {step === "questions" && <Questions form={form} busy={busy} onChange={change} onBack={() => setStep("home")} onGenerate={generate} />}
      {step === "roadmap" && roadmap && (
        <RoadmapView lib={lib} roadmap={roadmap} onOpen={setDetail} onSwap={swap} onBack={() => setStep("questions")} />
      )}
      {tool && <ToolDetail tool={tool} onClose={() => setDetail(null)} />}
    </main>
  );
}
