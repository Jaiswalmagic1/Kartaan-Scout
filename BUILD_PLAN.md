# KARTAAN Scout — Build Plan

## Product
- Extension: KARTAAN Scout
- AI workflow: Scout Intelligence
- Motto: Research first. Recommend clearly. Apply only what you approve.

## Principles
Browser-first rendered DOM only; evidence-backed recommendations; no invented metrics; local-first data; explicit approval before field filling; seller always submits manually; provider-neutral AI handoff; no cookies, hidden APIs, credential collection, access-control bypass, or remote crawling.

## Phases
1. **Foundation:** Manifest V3, rendered page capture, local history, JSON/CSV, copy/paste prompt, approval allowlist, tests.
2. **Research UX:** side-panel workspace, dedupe/provenance, multi-page comparison, pause/resume for manual auth, export preview.
3. **Meesho adapter:** seller-visible listing fields and available performance metrics; public competitor pages; selectors validated by human tester; fail safely if UI changes.
4. **Review intelligence:** categorize product defects vs packaging/shipping vs unclear listing expectations, dimensions/material/capacity and image mismatch; retain evidence and uncertainty.
5. **AI provider interface:** schema-validated JSON; copy/paste fallback; explicit provider setup; no silent chat UI automation or hardcoded keys.
6. **Amazon/Flipkart:** separate adapters and rules after current UI/policy verification.
7. **Release:** SKU-level before/after history, rollback/copy-back, privacy docs, regression tests, manual QA.

## Acceptance criteria
- Chrome loads unpacked extension.
- Missing values stay missing.
- Captures stay local unless exported/copied by user.
- Unknown AI fields are rejected; only explicitly approved allowlisted fields are actionable.
- No publish/submit action is automated.
- Human QA is documented for each marketplace before claiming support.

## Current limitation
This is a starter foundation, not yet a deep-research agent. Live marketplace seller-account testing is not complete.
