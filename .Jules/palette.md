## 2024-05-23 - Mobile search keyboard
**Learning:** Native `type="search"` improves the mobile keyboard layout (e.g. showing a Search key) on iOS, but can add unwanted native UI elements like the webkit search cancel button.
**Action:** Use `type="search"` on search inputs and pair it with `[&::-webkit-search-cancel-button]:hidden` to maintain custom styling while getting the improved keyboard, and always add `aria-label` since search inputs usually lack visible `<Label>` components.
