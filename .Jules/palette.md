## 2024-05-24 - Mobile Search Input UX
**Learning:** Using `type="search"` on search inputs triggers the native iOS "Search" keyboard key, which significantly improves mobile UX. Hiding the default webkit cancel button (`[&::-webkit-search-cancel-button]:hidden`) preserves custom design. Additionally, inputs lacking visible labels need explicit `aria-label` attributes for accessibility.
**Action:** Always apply `type="search"`, `aria-label`, and `[&::-webkit-search-cancel-button]:hidden` to mobile search inputs.
