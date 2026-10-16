## 2024-05-24 - Setup Palette Journal
**Learning:** Initialize Journal
**Action:** Always document core learnings
## 2026-10-16 - Improve mobile search inputs
**Learning:** Native mobile keyboards handle search inputs better when explicitly typed, but native cancel buttons often conflict with custom UI.
**Action:** Always use `type="search"` on search inputs and hide native cancel buttons using `[&::-webkit-search-cancel-button]:hidden`. Ensure they have `aria-label` for screen readers.
