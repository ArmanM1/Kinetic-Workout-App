## 2025-02-27 - Mobile Search Inputs
**Learning:** Search inputs on iOS/mobile require `type="search"` to trigger the native "Search" key on the software keyboard, providing a familiar app-like experience. Additionally, utility inputs without visible labels must have `aria-label` for screen reader accessibility. The native webkit cancel button can interfere with custom styling and should be hidden using `[&::-webkit-search-cancel-button]:hidden`.
**Action:** Always use `type="search"` for search inputs, include `aria-label`, and hide the native cancel button if it conflicts with the design.
