## 2025-01-01 - Native Search Keyboards on Mobile
**Learning:** iOS requires `type="search"` on inputs to trigger the native 'Search' keyboard key, replacing the default 'Return' key for better UX. Without explicit labels, utility inputs (like search) fail a11y checks.
**Action:** Always add `type="search"` and `aria-label` to standalone search inputs across the app.
