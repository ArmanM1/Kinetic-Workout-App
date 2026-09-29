## 2024-05-24 - Mobile Search Keyboard & A11y
**Learning:** Using `type="search"` on inputs is critical for triggering the native 'Search' action key on mobile keyboards (especially iOS). However, it adds a native cancel button that can conflict with custom designs, so hiding it with `[&::-webkit-search-cancel-button]:hidden` is necessary. Also, search inputs without visual labels need an explicit `aria-label` for screen readers.
**Action:** Always add `type="search"`, `aria-label`, and `[&::-webkit-search-cancel-button]:hidden` to custom search inputs.
