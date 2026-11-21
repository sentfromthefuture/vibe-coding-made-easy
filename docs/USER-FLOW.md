# User flow

The product turns an idea into a visual roadmap of tools. Six screens, one straight path, with a way back at every step.

## Inputs the flow collects

| Input | Where | Why it matters |
|---|---|---|
| Idea type, or a free-text description | Home | Picks the stops (`data/idea-types.json`) or lets the model infer them |
| Customer region | Home | Filters tools by `region`, mainly in payments |
| Experience level (never coded, some, developer) | Quick questions | Prompt-only builders for beginners, editors and agents for developers |
| Budget (free, small, flexible) | Quick questions | Prefers free tiers or open-source tools, and flags usage-based pricing |
| Device (phone only, or computer) | Quick questions | Browser-based builders for phone-only, terminal tools only with a computer |

## Screens

1. **Home.** Pick one of eight idea types or describe the idea in a text box. Pick a customer region (default: everywhere). One button: Generate roadmap.
2. **Quick questions.** Experience, budget and device as tappable choices. Skippable, and every question has a sensible default. A chosen idea type plus these answers is enough to generate.
3. **Roadmap.** Numbered stops, each with a one-line comment, tool chips (niche picks marked), and a code-tree summary panel. Warnings appear inline on `caution` tools. `sunsetting` tools never appear.
4. **Tool detail.** Opens from any chip: best for, trade-offs, long-term use, watch-outs, pricing notes, sources, last-checked date, and how reliable the entry is (`confidence`).
5. **Remix.** Swap a tool at any stop from the alternatives for that stage, or compare two tools side by side. The code-tree panel updates as you swap.
6. **Save and share.** Shareable link, export as a checklist (Markdown), and a starter prompt written for the builder you picked. Saving a roadmap to an account is where sign-in appears.

## Rules the roadmap must follow

- Only tools from `data/tools.json` can appear. Anything the model returns that is not in the library is dropped.
- Never recommend `status: sunsetting`. Show `caution` tools only with their warning.
- Filter by `region`: global tools always qualify, regional ones only when the chosen region matches.
- Every stop shows at least one popular option, and a niche option where one exists.
- Show how reliable each entry is. `general-knowledge` entries carry a small "not yet verified" mark.

## States to design

- **No match:** the description does not map to an idea type. Offer the closest types and let the person pick.
- **Thin stop:** no tool fits the region for a stop (for example payments). Say so and link to the regional options.
- **Generation failed:** fall back to a rule-based roadmap from the idea type, with a note.
- **Stale data:** tools last checked long ago show their date.
- **Offline or slow:** the roadmap skeleton appears first and chips fill in.

## Open questions

- What is free and what needs a subscription (number of roadmaps, saving, exports, remix)?
- Is sign-in required to generate, or only to save?
- Where does the paywall sit in the flow?
