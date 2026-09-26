## 2024-05-15 - Native Mobile Keyboard for Search Inputs
**Learning:** iOS and mobile browsers do not trigger the native "Search" action key on the software keyboard unless an input explicitly uses type="search".
**Action:** Always use type="search" on search input fields for better mobile UX, and combine it with [&::-webkit-search-cancel-button]:hidden if the native cancel button interferes with custom designs.
