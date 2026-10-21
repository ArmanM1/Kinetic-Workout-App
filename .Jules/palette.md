## 2026-10-21 - Mobile Search UX
**Learning:** Using `type="search"` on inputs triggers the native "Search" key on mobile keyboards (especially iOS), improving the app-like feel.
**Action:** Always add `type="search"` to search inputs, hide the native cancel button with `[&::-webkit-search-cancel-button]:hidden` to preserve custom design, and ensure they have `aria-label` if no visible label is present.
