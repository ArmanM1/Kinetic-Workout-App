## 2026-10-05 - Trigger native mobile search keyboard
**Learning:** Using `type="search"` on search inputs triggers the native iOS "Search" keyboard key, but introduces an unwanted native cancel button.
**Action:** Added `type="search"` and `aria-label` for a11y, along with `[&::-webkit-search-cancel-button]:hidden` to hide the native cancel button while keeping the improved mobile keyboard UX.
