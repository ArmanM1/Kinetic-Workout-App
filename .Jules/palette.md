## 2026-11-10 - Enhance Mobile Keyboard UX for Search Inputs
**Learning:** Inputs intended for searching on mobile (especially iOS) do not trigger the native "Search" keyboard key unless they explicitly use `type="search"`. Without it, users get the generic "Return" key, which feels less native. Also, unlabelled utility inputs should have `aria-label` for screen readers.
**Action:** Always use `type="search"` and hide the native cancel button via `[&::-webkit-search-cancel-button]:hidden` for custom-styled search inputs, and ensure they have an explicit `aria-label`.
