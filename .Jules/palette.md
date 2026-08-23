## 2024-05-18 - [Input Types on Mobile]
**Learning:** Using `type="search"` on inputs greatly improves mobile UX by triggering native search keyboard behaviors (like replacing the return key with a Search/Go key), but requires hiding the default webkit clear button `[&::-webkit-search-cancel-button]:hidden` to avoid visual bugs with custom styling.
**Action:** Always prefer `type="search"` for utility search bars, ensure the cancel button is hidden if custom clear buttons/padding are used, and explicitly add `aria-label` to utility inputs without visible labels.
