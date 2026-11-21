# Vibe Coding Made Easy

Pick the kind of thing you want to build, or describe it, and get a visual roadmap of the friendliest tools to build it with: famous ones and quietly brilliant niche ones.

**Status:** working skeleton. The library API, roadmap engine and unstyled screens run end to end. Visual design comes after the structure is settled.

```
vibe-coding-made-easy/
├─ data/        # stages.json, idea-types.json, tools.json (the tool library)
├─ src/
│  ├─ shared/   # types shared by the Worker and the front end
│  ├─ worker/   # Hono API on a Cloudflare Worker: library, roadmap engine, webhook stub
│  └─ web/      # React screens: Home, Questions, RoadmapView, ToolDetail (unstyled)
├─ scripts/     # validate.py (library checks), smoke.ts (engine checks)
├─ design/      # tokens.css (inspiration, not applied yet)
└─ docs/        # USER-FLOW.md, ARCHITECTURE.md, DESIGN.md
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

## Run and deploy

- `npm install`, then `npm test` (engine and library checks) and `npm run build`.
- `npm run dev` starts the app locally.
- Deploy: connect this repo to a Cloudflare Worker (build command `npm run build`, deploy command `npx wrangler deploy`), so every push to `main` deploys.
- Secrets: set `OPENROUTER_API_KEY` and `OPENROUTER_MODEL` as Worker secrets. Without them the engine uses its built-in rules. Never put keys in front-end code.

## What works and what does not yet

Works: library API, region and status filtering, rule-based roadmaps, free-text ideas (keywords add stops such as payments, login or AI), swap a tool, tool detail, copy checklist and starter prompt, rate limiting (10 roadmaps a minute per visitor, approximate per Cloudflare location), and optional AI through OpenRouter.

With the AI on, one call reads the description (idea type plus extra stops) and one call picks tools. Everything the model returns is validated against the library, and any failure falls back to the rules.

To turn the AI on, set `OPENROUTER_API_KEY` and `OPENROUTER_MODEL` as Worker secrets. Pick a small, fast model from OpenRouter's model list and check a few roadmaps before trusting it. Each call is capped in size and the roadmap endpoint is rate limited, but set a spending limit on the key as well.

Not built: Dodo Payments webhook (stub returns 501), accounts, saved and shareable roadmaps, any visual design. Only 14 of the 55 tool entries are researched so far.
