## 2026-10-30 - Mobile Search Inputs & Keyboard UX
**Learning:** Using `type="search"` on inputs triggers the native OS "Search" key on mobile keyboards (especially iOS), providing a more native app feel. However, the browser's default cancel button can interfere with custom styling. Additionally, standalone search inputs often lack visible labels.
**Action:** Always add `type="search"` to search inputs for mobile UX, hide the native cancel button with `[&::-webkit-search-cancel-button]:hidden` if it disrupts the design, and ensure `aria-label` is present for accessibility.
