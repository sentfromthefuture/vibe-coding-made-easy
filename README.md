# Vibe Coding Made Easy

Pick the kind of thing you want to build, or describe it, and get a visual roadmap of the friendliest tools to build it with: famous ones and quietly brilliant niche ones.

**Status:** design language settled, tool library started, app not built yet.

```
vibe-coding-made-easy/
├─ data/      # stages.json, idea-types.json, tools.json (the tool library)
├─ design/    # tokens.css (palette, type, chamfered corners)
├─ docs/      # DESIGN.md, ARCHITECTURE.md
└─ scripts/   # validate.py (checks the library hangs together)
```

## Tool library

- `stages.json`: the stops a roadmap can include (design, build, data, auth, payments, and so on).
- `idea-types.json`: each idea type and which stops it passes through, in order.
- `tools.json`: one entry per tool:
  - `stage`, `tier` (`popular` or `niche`), `pricing_model` (coarse)
  - `region`: `global` unless a tool is focused on one market (for example `africa`, `india`, `europe`). The library is built for a global audience, so the engine should filter by the builder's market instead of assuming one.
  - `best_for`: the one-line pitch
  - `tradeoffs`: what you give up by choosing it
  - `long_term`: what living with it for months looks like (lock-in, ownership, exit paths)
  - `watch_out`: short list of gotchas
  - `pricing_notes`: dated specifics, only where checked
  - `status`: `active`, `caution` (still works, risky as a new pick) or `sunsetting` (do not recommend; see `replaced_by`)
  - `confidence`: `researched`, `partly-researched` or `general-knowledge`
  - `sources` and `last_checked`: required for anything researched

## How reliable is it?

Researched live on 2026-11-21: Lovable, Bolt.new, Replit Agent, v0, Cursor, Supabase, Stripe, Lemon Squeezy, Flutterwave, Cloudflare Workers and Pages, WXT, Plasmo and Vercel (Netlify partly). The other tools carry `general-knowledge` entries: architecture-level trade-offs that rarely change, but no live pricing. They need the same verification pass, and prices on every tool will go stale, so re-check before relying on a number.

What the research changed: v0 moved to v0.app, Cloudflare now recommends Workers over Pages for new projects, Plasmo is reported to be in maintenance mode, and Lemon Squeezy is reported to be shutting down (payments stop 31 March 2027).

The roadmap engine must not recommend `sunsetting` tools and should show a warning on `caution` ones.

Run `python3 scripts/validate.py` after editing the data.
