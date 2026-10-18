# KARTAAN Scout

Browser-first marketplace listing research extension. AI workflow: **Scout Intelligence**.

## Workbench branch
The current working state is tracked on `workbench/v0.1.3-guided-research-handoff`. Start with [the handoff](docs/HANDOFF-2026-10-18.md), [guided workflow](docs/WORKFLOW.md), [AI contract](docs/AI_CONTRACT.md), and [build plan](BUILD_PLAN.md).

## Product intent
Scout is a research and approval workspace, not an autonomous listing bot. It gathers visible seller-side and buyer-side evidence for one product, assembles a consolidated packet for the user's selected LLM, asks the LLM to name missing research steps and return schema-shaped proposals, and then validates those proposals for seller review.

## Intended workflow
1. Start a session for one listing/SKU.
2. Capture the seller-side listing details and any visible seller metrics.
3. Capture the buyer-facing product page, relevant search results/competitors, and buyer reviews only when loaded.
4. Copy a consolidated evidence packet into ChatGPT, Claude, Gemini, or another chosen LLM.
5. Follow `nextActions` by opening the requested page and capturing it manually; paste an updated packet into the same chat.
6. Paste the LLM's JSON response back into Scout, inspect evidence/conflicts, approve selected proposals, then copy approved values for manual entry.
7. Seller submits/publishes manually. Scout must never auto-submit or claim a listing changed.

## Validation status
The local v0.1.3 package passed `npm test` (24 tests) and `npm run check` on 2026-10-18. User-provided live Meesho page evidence verified the primary price (₹207), 20 visible similar-product records, clean listing age (9 days), clean return-shipping estimate (₹157), and that supplier/profile rating must not be attributed to product rating for that tested layout.

**Not yet verified:** extraction on the user's logged-in Meesho supplier listing/edit/performance pages, all review layouts, other Meesho layouts, and end-to-end AI conversation response across providers. See the handoff document for precise next steps.

## Safety
Rendered DOM only after explicit user action. No marketplace APIs, hidden response collection, cookies/session extraction, credential collection, remote crawling, CAPTCHA solving, or access-control bypass. Captures remain local until the user exports/copies them. Missing values stay missing; estimates stay labeled as estimates; seller approval is required.
