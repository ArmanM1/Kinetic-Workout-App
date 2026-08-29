## 2026-08-29 - Mobile Search Input UX
**Learning:** Using type="search" triggers the native iOS "Search" keyboard key, improving mobile UX. To prevent visual conflicts with custom UI, the native webkit cancel button must be hidden using [&::-webkit-search-cancel-button]:hidden.
**Action:** Always apply type="search", an aria-label for accessibility, and the cancel-button hiding utility class to search inputs.
