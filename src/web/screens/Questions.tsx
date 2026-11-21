import type { Form } from "../App";

type Props = { form: Form; busy: boolean; onChange: (p: Partial<Form>) => void; onBack: () => void; onGenerate: () => void };

export function Questions({ form, busy, onChange, onBack, onGenerate }: Props) {
  return (
    <section>
      <h2>A few quick questions</h2>
      <label>Experience
        <select value={form.experience} onChange={(e) => onChange({ experience: e.target.value })}>
          <option value="beginner">Never coded</option><option value="some">Some</option><option value="developer">Developer</option>
        </select>
      </label>
      <label>Budget
        <select value={form.budget} onChange={(e) => onChange({ budget: e.target.value })}>
          <option value="free">Free</option><option value="small">Small</option><option value="flexible">Flexible</option>
        </select>
      </label>
      <label>Device
        <select value={form.device} onChange={(e) => onChange({ device: e.target.value })}>
          <option value="phone">Phone only</option><option value="computer">Computer</option>
        </select>
      </label>
      <button onClick={onBack}>Back</button>
      <button disabled={busy} onClick={onGenerate}>{busy ? "Working…" : "Generate roadmap"}</button>
    </section>
  );
}
