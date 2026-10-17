## 2026-10-17 - Mobile Search Input UX
**Learning:** Using `type="search"` on text inputs triggers the native iOS "Search" keyboard key, but introduces an unwanted native cancel button in WebKit browsers that must be hidden with `[&::-webkit-search-cancel-button]:hidden` for custom designs. Additionally, search inputs without a visible `<Label>` must have an `aria-label`.
**Action:** Always add `type="search"`, `aria-label`, and the webkit cancel button hiding class to search inputs for mobile apps.
