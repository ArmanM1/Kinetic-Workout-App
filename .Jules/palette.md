## 2024-08-22 - Mobile Search Input UX
**Learning:** Using `type="search"` triggers the native iOS "Search" keyboard key, but introduces native cancel buttons that clash with custom designs. Inputs without visible labels fail accessibility checks.
**Action:** Always add `type="search"`, `[&::-webkit-search-cancel-button]:hidden`, and an explicit `aria-label` when building mobile-first search inputs without explicit `<Label>` components.
