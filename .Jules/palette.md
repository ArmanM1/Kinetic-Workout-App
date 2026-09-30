## 2025-02-18 - Native Search Keyboard Trigger
**Learning:** Using `type="search"` on inputs triggers the native mobile OS-level 'Search' key instead of the generic 'Return' key, drastically improving iOS search UX. The native webkit search cancel button can clash with custom UI, so it should be hidden with `[&::-webkit-search-cancel-button]:hidden`.
**Action:** Always use `type="search"` for search inputs and ensure they have an explicit `aria-label` for screen reader accessibility when a visible label is missing.
