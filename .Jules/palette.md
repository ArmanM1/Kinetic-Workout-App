## 2026-10-18 - Improve Mobile Search Keyboard UX
**Learning:** Search inputs missing `type="search"` fallback to a generic text keyboard with a "Return" key on iOS, which feels less native. Also, missing `aria-label`s on icon-only or standalone utility inputs harm accessibility.
**Action:** Always add `type="search"` to trigger the mobile native 'Search' key and apply `[&::-webkit-search-cancel-button]:hidden` to hide the native cancel button if it conflicts with the design. Add `aria-label` to search inputs lacking a visible `<label>`.
