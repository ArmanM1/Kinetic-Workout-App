## 2024-03-20 - Mobile Search Input UX
**Learning:** Using type="search" on text inputs triggers the native "Search" keyboard key on mobile devices (especially iOS), improving the typing experience. However, it adds a native webkit cancel button that can conflict with custom designs.
**Action:** Always use type="search" for search fields, add 'aria-label' if there is no visible label, and use [&::-webkit-search-cancel-button]:hidden to hide the native cancel button to match custom designs.
