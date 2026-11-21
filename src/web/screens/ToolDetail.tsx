import type { Tool } from "../../shared/types";

export function ToolDetail({ tool, onClose }: { tool: Tool; onClose: () => void }) {
  return (
    <article aria-label={`${tool.name} details`}>
      <h3>{tool.name}</h3>
      {tool.status !== "active" && <p className="warn">Status: {tool.status}. {tool.replaced_by?.length ? `Consider: ${tool.replaced_by.join(", ")}.` : ""}</p>}
      <p>{tool.best_for}</p>
      <h4>Trade-offs</h4><p>{tool.tradeoffs}</p>
      <h4>Long term</h4><p>{tool.long_term}</p>
      <h4>Watch out for</h4><ul>{tool.watch_out.map((w) => <li key={w}>{w}</li>)}</ul>
      {tool.pricing_notes && (<><h4>Pricing</h4><p>{tool.pricing_notes}</p></>)}
      <p><small>
        {tool.confidence === "researched" ? `Researched, last checked ${tool.last_checked}.` : tool.confidence === "partly-researched" ? `Partly researched, last checked ${tool.last_checked}.` : "Not yet verified."}
      </small></p>
      <p><a href={tool.url} target="_blank" rel="noreferrer">Visit {tool.name}</a></p>
      {tool.sources.length > 0 && <ul>{tool.sources.map((s) => <li key={s}><a href={s} target="_blank" rel="noreferrer">{s}</a></li>)}</ul>}
      <button onClick={onClose}>Close</button>
    </article>
  );
}
