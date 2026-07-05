## 2024-05-24 - [Mobile Search Input]
**Learning:** Using `type="search"` on search inputs triggers the native 'Search' keyboard key on iOS, improving the mobile UX. Adding `aria-label` to inputs without visible labels improves accessibility.
**Action:** Always use `type="search"` for search inputs and ensure all utility inputs without a visible label have an explicit `aria-label`.
