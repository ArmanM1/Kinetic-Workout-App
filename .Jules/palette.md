## 2024-05-20 - Mobile Search Input UX
**Learning:** iOS keyboards provide a native "Search" return key only when inputs explicitly set `type="search"`. Standard text inputs show "Return" which feels less polished for filtering lists.
**Action:** Always use `type="search"` with `[&::-webkit-search-cancel-button]:hidden` (to prevent default ugly cross) and an `aria-label` for screen readers on standalone search fields.
