## 2025-02-18 - Native iOS Search Keyboards
**Learning:** Using `type="search"` on input fields triggers the native "Search" key on iOS keyboards instead of a generic "Return" key, significantly improving the mobile feel. The default webkit cancel button can interfere with custom styling.
**Action:** Always add `type="search"` and `[&::-webkit-search-cancel-button]:hidden` to search inputs, along with `aria-label` when visible labels are omitted.
