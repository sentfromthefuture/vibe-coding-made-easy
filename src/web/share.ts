import type { Roadmap } from "../shared/types";
import type { Library } from "./App";

const names = (lib: Library, ids: string[]) => ids.map((id) => lib.tools.find((t) => t.id === id)?.name ?? id);

/** Code-tree summary, one line per stop. */
export function toTree(rm: Roadmap, lib: Library): string {
  const stops = rm.stops.map((s) => `├─ ${s.stage.padEnd(10)} # ${names(lib, s.picks).join(", ")}`);
  return ["your-idea/", ...stops].join("\n");
}

export function toMarkdown(rm: Roadmap, lib: Library): string {
  const idea = lib.ideaTypes.find((i) => i.id === rm.ideaType)?.name ?? rm.ideaType;
  const lines = rm.stops.map((s, i) => {
    const title = lib.stages.find((g) => g.id === s.stage)?.title ?? s.stage;
    return `- [ ] ${i + 1}. ${title}: ${names(lib, s.picks).join(", ")}`;
  });
  return [`# Roadmap: ${idea}`, "", ...lines].join("\n");
}

// TODO: tailor to the chosen builder. For now a plain template.
export function toStarterPrompt(rm: Roadmap, lib: Library): string {
  const idea = lib.ideaTypes.find((i) => i.id === rm.ideaType)?.name ?? rm.ideaType;
  const stack = rm.stops.map((s) => `${s.stage}: ${names(lib, s.picks.slice(0, 1)).join(", ")}`).join("; ");
  return `Help me build a ${idea.toLowerCase()}. Use this stack: ${stack}. Start with the smallest working version and explain each step.`;
}
