## 2024-05-15 - [Mobile Search UX]
**Learning:** For better mobile UX (especially iOS), search input fields should use `type="search"` to trigger the native 'Search' keyboard key. Using `[&::-webkit-search-cancel-button]:hidden` is needed to hide the native cancel button if it interferes with custom designs. Inputs without visible labels need explicit `aria-label` attributes.
**Action:** Always add `type="search"`, hide the cancel button, and ensure `aria-label` is present for search inputs.
