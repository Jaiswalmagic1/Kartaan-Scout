# KARTAAN Scout — Build Plan and Status

## Product
- Extension: KARTAAN Scout
- AI workflow: Scout Intelligence
- Motto: Research first. Recommend clearly. Apply only what you approve.

## Intended product
Scout is the research orchestration and seller-approval workspace. It gathers visible data for one listing from multiple sources, builds an evidence packet for a user-selected LLM, asks that LLM to identify the next missing source, and validates structured recommendations when returned.

## Principles
- Browser-first rendered DOM only, after explicit user action.
- Evidence-backed recommendations; never invent missing facts or metrics.
- Keep listing, seller/profile, competitor and estimated Seller Lens values separate.
- Local-first data; export/copy only by user action.
- One research session per product/listing.
- Manual LLM copy/paste, with nextActions to guide iterative research.
- Explicit human approval before copying approved field values.
- Seller always performs final marketplace save/submit.
- No cookies, hidden APIs, credential collection, remote crawling, CAPTCHA solving, access-control bypass or automated marketplace publishing.

## Phases and status
1. **Foundation — implemented locally:** Manifest V3, visible DOM capture, local history, JSON/CSV, copy/paste prompt, field allowlist, approval helper and Node tests.
2. **Guided research session — implemented locally in v0.1.3:** multi-page session checklist, seller/buyer page classification, combined session prompt, AI response pasteback, next-action display.
3. **Meesho visible-page capture — partial:** buyer product page/search cards/Seller Lens parsing improved with a real user-provided capture; seller listing/edit/performance selectors remain heuristic and need live QA in the user's supplier account.
4. **Review intelligence — partial:** capture visible review comments and clearly distinguish unloaded reviews; categorize product-defect vs shipping/packaging vs listing-expectation themes after sufficient real comments exist.
5. **AI provider interface — manual handoff:** provider-neutral prompt; copy/paste fallback. No silent automation of chat UIs.
6. **Amazon/Flipkart:** separate adapters only after UI/policy verification.
7. **Release:** source package versioning, branch/source archive, SKU-level before/after history, rollback/copy-back, regression tests and manual QA.

## Current local test record (2026-10-18)
- `npm test`: 24 passed, 0 failed in the v0.1.3 package.
- `npm run check`: manifest entrypoints and JavaScript syntax validated.
- ZIP integrity and root `manifest.json` checked.
- User-supplied live Meesho page verified the primary price, 20 similar-product records and clean Seller Lens parsing for one tested layout.

## Acceptance criteria
- Chrome loads the unpacked extension.
- Missing values remain missing; estimates remain labeled.
- Page/source and confidence/evidence are visible enough to audit.
- AI conflict/limitation reporting and `nextActions` guide staged research.
- Unknown AI fields are rejected; only explicitly approved allowlisted fields are actionable.
- No publish/submit action is automated.
- Human QA is recorded for each marketplace before support is broadly claimed.

## Remaining work
Live seller dashboard/listing-editor QA; review-page coverage; full manual workflow test across capture → LLM → JSON response → approval; package source into the GitHub workbench branch; only then decide whether to merge to main.
