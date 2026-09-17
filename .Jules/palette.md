## 2025-02-18 - Improve search input UX
**Learning:** Mobile keyboards (especially iOS) provide a native "Search" action key when inputs have type="search". Adding this attribute creates a more familiar interaction without needing layout changes.
**Action:** Add type="search", aria-label for accessibility, and hide default webkit search cancel button using [&::-webkit-search-cancel-button]:hidden to all search inputs.
