## 2024-10-27 - Mobile Search Inputs & ARIA labels
**Learning:** Custom search inputs need `type="search"` to trigger the native iOS "Search" key, and `[&::-webkit-search-cancel-button]:hidden` to hide the native cancel button if it interferes with custom designs. Utility inputs without visible labels must have `aria-label`.
**Action:** Always use `type="search"` on search inputs and ensure all utility inputs have explicit `aria-label` attributes.
