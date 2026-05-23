## 2024-05-18 - Mobile Search Enhancements
**Learning:** Native mobile keyboards can be triggered to show a "Search" button by setting `type="search"` on input fields, vastly improving the UX for mobile users who otherwise have to tap a generic "Return" or "Go" key. Additionally, adding an `aria-label` to these search fields ensures accessibility and context without needing a visible label.
**Action:** When implementing search fields in mobile-first applications, always include `type="search"` and `aria-label` or `aria-labelledby`.
