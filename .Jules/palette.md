## 2026-10-22 - Mobile Keyboard Optimization for Search Inputs
**Learning:** Adding `type="search"` to HTML input fields ensures that mobile devices (especially iOS) render the native "Search" key on their virtual keyboards, significantly improving the mobile UX. Additionally, `[&::-webkit-search-cancel-button]:hidden` must be applied to prevent native browser UI from clashing with custom designs.
**Action:** Always include `type="search"` on search-specific text inputs to trigger mobile-optimized keyboards.
