## 2024-03-24 - Enhance Search Inputs
**Learning:** Search inputs without an explicit label need `aria-label`. Using `type="search"` significantly improves the mobile UX by triggering the native OS 'Search' keyboard button (especially on iOS).
**Action:** Always use `type="search"` on search inputs and hide the native cancel button using `[&::-webkit-search-cancel-button]:hidden` to match custom dark mode designs. Always add `aria-label` to standalone inputs.
