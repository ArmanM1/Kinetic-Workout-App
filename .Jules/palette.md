## 2026-11-01 - Mobile Search Input UX
**Learning:** Adding type="search" to search inputs improves mobile UX by triggering the native "Search" keyboard key on iOS, but it can introduce an unwanted default cancel button in WebKit browsers that interferes with custom styling.
**Action:** Always pair type="search" with a CSS class like [&::-webkit-search-cancel-button]:hidden when using custom input styling, and ensure an aria-label is present for accessibility.
