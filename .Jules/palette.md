## 2026-10-20 - Improve search input UX on mobile
**Learning:** Adding type="search" on search inputs improves mobile UX by triggering the native "Search" keyboard key instead of a generic "Return" key. Hiding the native cancel button with '[&::-webkit-search-cancel-button]:hidden' ensures it doesn't conflict with custom UI designs.
**Action:** Always use type="search" for search inputs and hide the native webkit cancel button if it interferes.
