## 2026-10-31 - Mobile search input UX
**Learning:** Adding type="search" to search inputs on mobile devices triggers the native 'Search' keyboard key (especially on iOS), drastically improving the typing and submission experience. However, this often adds a native cancel button that disrupts custom UI.
**Action:** Always use type="search" combined with [&::-webkit-search-cancel-button]:hidden for custom search inputs to get the best of both worlds. Additionally, ensure icon-only inputs have an aria-label.
