# Manual QA
- Load unpacked in chrome://extensions.
- Capture a public product page; inspect title, URL and fields.
- Check history survives popup reopen.
- Export JSON and CSV; inspect CSV quoting.
- Copy prompt; confirm it treats page data as untrusted and forbids invented facts.
- Try restricted/internal Chrome page; expect a safe error.
- Confirm no cookie/session access, hidden API calls, CAPTCHA solving or auto-submit.
- Test future field filling only on a disposable listing; seller must submit manually.
- For each marketplace, record test date, page type, fields mapped, selector confidence, tester and outcome.
