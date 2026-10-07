## 2026-10-07 - Native iOS Search Keyboard
**Learning:** The HTML `type="search"` attribute on inputs triggers the native iOS "Search" key on the software keyboard, improving the user experience during mobile search input. However, it also renders a native cancel button that can conflict with custom designs.
**Action:** Always use `type="search"` with `[&::-webkit-search-cancel-button]:hidden` to trigger the "Search" button without ruining custom design components.
