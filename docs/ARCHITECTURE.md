# Architecture (draft)

1. **Tool library** (`data/`): curated and tagged. The source of truth for every recommendation.
2. **Roadmap engine**: takes an idea type or a free-text description, asks an AI model to pick stops and tools, and checks the answer against the library. Any tool id not in `data/tools.json` is dropped, so the engine cannot invent tools.
3. **Front end**: home (pick or describe an idea), roadmap (stops, chips, code-tree panel), remix (swap a tool at any stop).

Open questions: where the library is edited long term (JSON in git vs a database), and how often links and pricing models are re-checked.

## Decisions (from the project owner)

- **Billing:** Dodo Payments for subscriptions. Its webhooks update subscription status in our backend.
- **AI:** the primary model API goes through a router (assumed to be OpenRouter), so models can be swapped without code changes.
- **Hosting:** Cloudflare.

## Proposed (not yet confirmed)

- One Cloudflare Worker serves the built front end (Workers Static Assets) and the API.
- Front end: React with Vite. API: Hono on the Worker. This deploys natively on Workers; Next.js on Cloudflare needs an adapter.
- Saved roadmaps and subscription state in D1 (Cloudflare's database), unless another database is preferred.
- Roadmap engine in the Worker: filter the library by region, status and idea-type stages, send only those candidates to the model through the router, validate the JSON that comes back against `data/tools.json`, and fall back to rules if it fails.
- Secrets (router key, Dodo keys) as Worker secrets, never in front-end code.
