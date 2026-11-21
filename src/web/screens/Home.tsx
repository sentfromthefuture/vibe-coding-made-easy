import type { Form, Library } from "../App";

export const REGIONS = [
  ["everywhere", "Everywhere"], ["africa", "Africa"], ["europe", "Europe"], ["india", "India"], ["latin-america", "Latin America"],
] as const;

type Props = { lib: Library; form: Form; onChange: (p: Partial<Form>) => void; onNext: () => void };

export function Home({ lib, form, onChange, onNext }: Props) {
  return (
    <section>
      <h1>Vibe Coding Made Easy</h1>
      <h2>What are you making?</h2>
      <div role="group" aria-label="Idea type">
        {lib.ideaTypes.map((t) => (
          <button key={t.id} aria-pressed={form.ideaType === t.id}
            onClick={() => onChange({ ideaType: form.ideaType === t.id ? "" : t.id })}>
            {t.name}<small>{t.blurb}</small>
          </button>
        ))}
      </div>
      <label>Or describe it in your own words
        <textarea rows={3} maxLength={1000} value={form.description} onChange={(e) => onChange({ description: e.target.value })} />
      </label>
      <label>Where will your customers be?
        <select value={form.region} onChange={(e) => onChange({ region: e.target.value })}>
          {REGIONS.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
        </select>
      </label>
      <button disabled={!form.ideaType && !form.description.trim()} onClick={onNext}>Next</button>
    </section>
  );
}
