## 2026-10-09 - Native iOS Search Interaction
**Learning:** The default text input on iOS doesn't trigger the 'Search' key on the software keyboard, making the UX feel less native and forcing users to look for the enter key or dismiss the keyboard awkwardly.
**Action:** Always use `type="search"` on search inputs and hide the native cancel button with `[&::-webkit-search-cancel-button]:hidden` if it conflicts with custom UI.
