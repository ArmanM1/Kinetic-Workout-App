## YYYY-MM-DD - Mobile Search Input UX
**Learning:** Using `type="search"` on search input fields greatly improves the mobile user experience (especially on iOS) by triggering the native "Search" keyboard return key. However, this introduces a default browser cancel button which can interfere with custom styling.
**Action:** Always add `type="search"` to search inputs and use `[&::-webkit-search-cancel-button]:hidden` to hide the native cancel button. Additionally, ensure inputs without a visible label have `aria-label` for screen reader accessibility.
