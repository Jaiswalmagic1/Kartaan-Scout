# Manual QA — KARTAAN Scout v0.1.3

## Install and baseline
- Download/extract the versioned build ZIP and confirm `manifest.json` is at the folder root.
- In `chrome://extensions`, disable any older Scout copy, enable Developer mode and use Load unpacked on the extracted folder.
- Reload Meesho after installing/updating.
- Record browser/OS, date, branch/build and results.

## Capture checks
- Capture Meesho buyer product page. Verify title, primary product price, URL, page type, similar-product count and Seller Lens fields.
- Verify supplier/profile rating is not copied to product-level rating/review fields.
- Capture Meesho search results. Product-level price/rating/review fields should remain blank; each competitor row should represent a single linked product card.
- Check duplicate product IDs merge missing data without overwriting populated values.
- Check competitor CSV has one row per competitor and quotes titles correctly.
- Open seller listing/edit page and confirm visible form values are extracted without password/OTP or unrelated account content.
- Open seller performance page and verify each metric is labeled with its visible source.
- Open product reviews, expand/paginate, capture; unloaded review panel must not be interpreted as zero lifetime reviews.

## Full research loop
- Start a session for a single listing.
- Capture seller page, buyer product page, buyer search results and loaded review page.
- Copy consolidated prompt to an LLM; verify the response requests next missing sources and calls out conflicts.
- Capture another requested source, paste refreshed packet in the same LLM chat.
- Paste returned JSON to Scout. Invalid/non-allowlisted fields should be rejected.
- Verify proposals with unresolved key facts require seller confirmation.
- Approve one safe proposal, copy approved values, and confirm no marketplace field is auto-submitted.
- Close/reopen popup; verify session persistence.
- Export JSON, listing CSV, and competitor CSV.

## Safety and negative checks
- Restricted Chrome page should fail with a safe error.
- Confirm no hidden API requests, cookies/session extraction, credential collection, CAPTCHA solving, auto-navigation/crawling or auto-submit/publish.
- Use a disposable/test listing for any manual-entry test; seller completes submission manually.

## Current test evidence
Local automated checks passed on 2026-10-18: 24 Node tests and syntax/manifest checks. User-provided live buyer-side product-page data verified price and competitor/Seller Lens parsing for one layout. Supplier-dashboard extraction and the full live workflow remain unverified until this manual QA is performed.
