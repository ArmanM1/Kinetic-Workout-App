
## 2026-09-19 - Mobile Search Input UX
**Learning:** Using 'type="search"' on inputs triggers the native iOS 'Search' key on mobile keyboards, providing a better native-app feel. However, it also adds a native webkit cancel button which can conflict with custom UI designs. Utility inputs without visible labels also need explicit aria-labels for accessibility.
**Action:** Always add 'type="search"', '[&::-webkit-search-cancel-button]:hidden', and an 'aria-label' to search inputs in this app.
