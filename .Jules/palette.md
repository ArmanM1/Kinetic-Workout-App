## 2024-05-14 - iOS Search Keyboard & Utility Input A11y
**Learning:** Using `type="search"` on search inputs triggers the native iOS "Search" key on the virtual keyboard, significantly improving mobile UX. Visually label-less utility inputs need explicit `aria-label`s for screen reader support. The native cancel button can be hidden with `[&::-webkit-search-cancel-button]:hidden` to preserve custom designs.
**Action:** Always apply `type="search"`, hide the native cancel button, and ensure an `aria-label` is present for all mobile search inputs.
