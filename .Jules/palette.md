## 2024-05-18 - Search Inputs
**Learning:** Using `type="search"` on input fields improves mobile keyboard UX (triggering the "Search" key on iOS) but introduces native cancel buttons that can break custom styling.
**Action:** Combine `type="search"` with `[&::-webkit-search-cancel-button]:hidden` and `aria-label` to get the best of both worlds: native mobile search keyboards, consistent custom UI, and screen reader accessibility.
