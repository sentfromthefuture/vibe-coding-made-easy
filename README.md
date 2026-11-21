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
- `tools.json`: one entry per tool: stage, `tier` (`popular` or `niche`), `pricing_model` (coarse), `region`, and a one-line `best_for`.

`last_checked` is `null` on every tool: links and pricing models were written from general knowledge and still need a verification pass.

Run `python3 scripts/validate.py` after editing the data.
