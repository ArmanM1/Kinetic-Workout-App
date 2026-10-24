## 2026-10-24 - Native Mobile Search Keyboard & Accessibility
**Learning:** Using `type="search"` on search inputs triggers the native "Search" keyboard key on iOS, vastly improving the mobile feel. Native cancel buttons often conflict with custom designs, and inputs without visible labels fail screen readers.
**Action:** Always use `type="search"`, hide the native cancel button with `[&::-webkit-search-cancel-button]:hidden`, and add explicit `aria-label`s on utility inputs for mobile web parity and accessibility.
