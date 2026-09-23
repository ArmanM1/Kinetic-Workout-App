## 2024-03-24 - Mobile Search Keyboard & A11y
**Learning:** Using `type="search"` on search inputs triggers the native iOS "Search" button on the keyboard instead of "Return", which improves the mobile UX. Furthermore, when creating custom search inputs without visible labels, explicit `aria-label`s are necessary, and hiding the native webkit search cancel button (`[&::-webkit-search-cancel-button]:hidden`) prevents UI conflicts.
**Action:** Always use `type="search"` with hidden webkit cancel buttons and `aria-label` for standalone search inputs in mobile-first applications.
