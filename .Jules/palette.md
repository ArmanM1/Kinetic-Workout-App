## 2026-05-03 - Mobile Search Input Enhancements
**Learning:** iOS requires `type="search"` on inputs to trigger the native 'Search' keyboard key (which changes 'Return' to 'Search'). Additionally, standalone inputs lacking a `<label>` tag require an `aria-label` for screen readers.
**Action:** Always use `type="search"` and `aria-label` on global or standalone search input elements to ensure mobile accessibility and improved UX.
