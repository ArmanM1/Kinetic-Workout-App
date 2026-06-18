## 2024-05-17 - Better Search Keyboard Support on Mobile
**Learning:** Using `type="search"` on search input fields specifically triggers the native "Search" button on mobile keyboards (especially iOS) instead of "Return", drastically improving the mobile search experience.
**Action:** Always add `type="search"` alongside `aria-label` for any component that acts as a search input.
