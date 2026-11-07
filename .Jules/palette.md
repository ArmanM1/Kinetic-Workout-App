## 2026-11-07 - Mobile Keyboard Search UX
**Learning:** Using `type="search"` on search input fields triggers the native "Search" keyboard key on mobile devices (especially iOS), greatly improving the mobile-first UX compared to a generic "Return" key.
**Action:** Always add `type="search"`, `aria-label`, and `[&::-webkit-search-cancel-button]:hidden` (to hide the native cancel button if it interferes with custom designs) for search inputs, particularly those missing visible text labels.
