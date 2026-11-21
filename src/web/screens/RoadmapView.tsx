import type { Roadmap } from "../../shared/types";
import type { Library } from "../App";
import { toMarkdown, toStarterPrompt, toTree } from "../share";

type Props = {
  lib: Library; roadmap: Roadmap; onOpen: (id: string) => void;
  onSwap: (stage: string, id: string) => void; onBack: () => void;
};

export function RoadmapView({ lib, roadmap, onOpen, onSwap, onBack }: Props) {
  const tool = (id: string) => lib.tools.find((t) => t.id === id);
  const copy = (text: string) => navigator.clipboard?.writeText(text);
  return (
    <div>
      <h2>Your roadmap</h2>
      <p>Built by {roadmap.mode === "ai" ? "the AI router" : "built-in rules"}.</p>
      {roadmap.stops.map((s, i) => {
        const stage = lib.stages.find((g) => g.id === s.stage);
        return (
          <section key={s.stage}>
            <h3>{i + 1}. {stage?.title}</h3>
            <p><small>{stage?.why}</small></p>
            {roadmap.added?.includes(s.stage) && <p><small>Added because of your description.</small></p>}
            {s.picks.map((id) => {
              const t = tool(id);
              if (!t) return null;
              return (
                <button key={id} onClick={() => onOpen(id)}>
                  {t.tier === "niche" ? "◆ " : ""}{t.name}
                  {t.status === "caution" && <small className="warn">Use with care</small>}
                </button>
              );
            })}
            {s.alternatives.length > 0 && (
              <select aria-label={`Swap the main pick for ${stage?.title}`} value="" onChange={(e) => e.target.value && onSwap(s.stage, e.target.value)}>
                <option value="">Swap main pick…</option>
                {s.alternatives.map((id) => <option key={id} value={id}>{tool(id)?.name ?? id}</option>)}
              </select>
            )}
          </section>
        );
      })}
      <aside><h3>Stack at a glance</h3><pre>{toTree(roadmap, lib)}</pre></aside>
      <section>
        <h3>Save and share</h3>
        <button onClick={() => copy(toMarkdown(roadmap, lib))}>Copy checklist</button>
        <button onClick={() => copy(toStarterPrompt(roadmap, lib))}>Copy starter prompt</button>
        <button disabled title="Needs storage, not built yet">Shareable link</button>
      </section>
      <button onClick={onBack}>Back</button>
    </div>
  );
}
