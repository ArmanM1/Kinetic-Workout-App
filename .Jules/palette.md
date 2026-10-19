## 2026-10-19 - Mobile Search Inputs & Accessibility
**Learning:** Search input fields lack the `type="search"` attribute, which prevents mobile OS (like iOS) from showing the native "Search" keyboard key, and they lack `aria-label` when visual labels are omitted.
**Action:** Added `type="search"`, `[&::-webkit-search-cancel-button]:hidden` to custom search inputs, and explicit `aria-label` attributes to ensure iOS-like feel and screen reader support.
