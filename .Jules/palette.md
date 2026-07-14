## 2024-07-14 - Improve Search Input Mobile UX and Accessibility
**Learning:** Search inputs relying solely on placeholders and icons lack proper screen reader context, and standard text inputs do not trigger the optimal native mobile keyboard (like the "Search" key on iOS/Android).
**Action:** Add type="search" to search inputs for better mobile keyboard integration and aria-label to ensure screen reader accessibility.
