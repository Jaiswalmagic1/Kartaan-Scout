# KARTAAN Scout

Browser-first marketplace listing research extension. AI workflow: **Scout Intelligence**.

## Install locally
1. Download or clone this repository.
2. Open `chrome://extensions` in Chrome and enable **Developer mode**.
3. Click **Load unpacked** and select the repository folder.
4. Open a normal product page and click **Capture current page**.

## Current features
- Rendered-page capture for title, price, rating/review count when visible, brand, description, availability, headings and links.
- Local history, JSON/CSV export and copy/paste AI research prompt.
- Proposal allowlist and explicit approval payload helper.
- Automated Node.js tests and GitHub Actions workflow.

## Safety
Data is read from the visible DOM of the current tab. No marketplace APIs, cookie/session extraction, server crawling, or access-control bypass. Research stays in Chrome local storage until the user exports or copies it. Never auto-submit or publish a listing.

## Status
This is a starter foundation, not yet the full deep-research agent. Meesho is the first adapter target. Live seller-account testing is still required before claiming platform-specific support.

Run tests with `npm test`. See [BUILD_PLAN.md](BUILD_PLAN.md), [manual QA](docs/MANUAL_QA.md) and [security notes](docs/SECURITY.md).
