## 2024-05-23 - Mobile Search Keyboard Optimization
**Learning:** Using `type="search"` on inputs triggers the native "Search" button on mobile keyboards (especially iOS), replacing the default "Return" key and significantly improving the mobile search experience. Additionally, standalone utility inputs like search bars without visible labels require explicit `aria-label` attributes for screen reader accessibility.
**Action:** Always apply `type="search"` and `aria-label` to all search input components throughout the application to ensure mobile-first usability and full accessibility.
