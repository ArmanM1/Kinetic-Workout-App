## 2026-10-11 - iOS Native Search Keyboard
**Learning:** Using `type="search"` on inputs triggers the native iOS "Search" key on the software keyboard, significantly improving mobile UX. However, it also introduces native WebKit cancel buttons that can clash with custom UI designs.
**Action:** Always apply `type="search"` to search inputs for better mobile keyboards, add explicit `aria-label` attributes to inputs without visual labels, and use `[&::-webkit-search-cancel-button]:hidden` to hide the native cancel button when applying custom styles.
