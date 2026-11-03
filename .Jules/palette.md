## 2026-11-03 - Native Mobile Keyboard Hints
**Learning:** Using `type="search"` on search input fields triggers the native 'Search' key on iOS and Android software keyboards, significantly improving the mobile UX. When doing so, it's critical to add `[&::-webkit-search-cancel-button]:hidden` to hide the browser's default cancel button to maintain custom design consistency. Additionally, standalone search inputs require `aria-label` for screen readers.
**Action:** Always add `type="search"`, `aria-label`, and hide the webkit cancel button for custom search inputs.
