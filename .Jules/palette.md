## 2024-05-18 - Mobile Search Input UX
**Learning:** Using `type="search"` on inputs is critical for mobile UX, as it triggers the native "Search" key on iOS keyboards instead of "Return" or "Done". Utility inputs without visible labels also need explicit `aria-label` attributes for accessibility.
**Action:** Always add `type="search"` and `aria-label` to standalone search inputs to improve both keyboard experience and screen reader accessibility.
