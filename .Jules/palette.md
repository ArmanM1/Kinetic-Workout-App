## 2026-09-22 - Search Inputs on Mobile
**Learning:** Using `type="search"` instead of default text input on mobile triggers the native "Search" keyboard key (especially on iOS). Hiding the native webkit cancel button (`[&::-webkit-search-cancel-button]:hidden`) is necessary when custom clear logic is used or when it clashes with the custom UI. Always add `aria-label` to search inputs lacking a visible label.
**Action:** Added `type="search"`, `aria-label`, and hidden the webkit cancel button on exercise search inputs.
