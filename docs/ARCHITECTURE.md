# Architecture (draft)

1. **Tool library** (`data/`): curated and tagged. The source of truth for every recommendation.
2. **Roadmap engine**: takes an idea type or a free-text description, asks an AI model to pick stops and tools, and checks the answer against the library. Any tool id not in `data/tools.json` is dropped, so the engine cannot invent tools.
3. **Front end**: home (pick or describe an idea), roadmap (stops, chips, code-tree panel), remix (swap a tool at any stop).

Open questions: where the library is edited long term (JSON in git vs a database), and how often links and pricing models are re-checked.
