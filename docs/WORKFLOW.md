# KARTAAN Scout — Guided Research Workflow (v0.1.3)

## Purpose
Scout collects visible page evidence and stages listing recommendations for human review. It does not run an autonomous crawler and does not publish a listing.

## One listing per session
1. Click **Start new listing research** in the extension.
2. Open the logged-in Meesho supplier dashboard or the listing edit/details page for the product. Click **Capture current page**. Scout classifies the page heuristically and records visible product-related form controls plus concise metric rows where detected.
3. Open the buyer-facing product detail page and capture it.
4. Open buyer search results for relevant terms and capture competitor cards.
5. Open the review panel/page, expand or paginate reviews where possible, and capture again. Only visible review comments and visible counts are available. A page saying `0 reviews loaded` is explicitly marked as not loaded; it is not interpreted as lifetime zero reviews.
6. Check the session checklist. A checked item means Scout observed that source/page type, not that every field was successfully extracted. Inspect each capture before relying on it.

## AI handoff
1. Choose ChatGPT, Claude or Gemini in Scout and click **Copy full-session analysis prompt**.
2. Open a new conversation on the first pass and paste the entire clipboard content. The prompt contains the instructions and the combined capture packet.
3. The LLM should return valid JSON with `status`, `summary`, `nextActions` and `proposals`. `nextActions` specifies which page to capture next and why. This guides the human; it does not mean the extension navigates automatically.
4. For each requested source, manually open the page and click **Capture current page** in the same session. Copy the refreshed full-session prompt and paste it into the same LLM conversation.
5. Copy the LLM's JSON response and paste it into **Return the AI response to Scout**. Scout parses it, drops non-allowlisted fields, displays conflicts/missing sources/next actions, and shows each proposal with evidence.
6. Approve only proposals whose evidence is adequate. If a proposal requires seller confirmation, first check the separate verification box. **Copy approved values for manual entry** copies a payload; it does not fill or publish the marketplace form.

## Seller-side extraction limits
- Scout reads the visible, rendered DOM on the active tab after the user clicks capture.
- Seller page detection and field labels are heuristic. The extension collects form fields whose labels resemble listing attributes and short visible dashboard rows that resemble seller metrics. Live QA is required to determine what the current Meesho supplier UI exposes and which fields need precise selectors.
- It cannot extract hidden API responses, information on tabs the user has not opened or data not loaded into the rendered page. Never paste passwords, OTPs or credentials into the workflow.
- A capture being listed in the checklist confirms only that a page was captured; it does not guarantee field completeness or accuracy. Inspect preview/export.

## Limits of AI integration
- Provider handoff is manual copy/paste. Scout does not automatically read ChatGPT/Claude/Gemini pages or send messages to those sites.
- Keep using the same LLM chat for follow-up packets. Scout stores captures locally but does not persist the LLM's conversation/reasoning; the user can paste the updated packet into the same chat.
- The session is intended for one product. Start a new session rather than mixing unrelated listings.
