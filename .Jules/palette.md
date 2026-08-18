## 2024-08-18 - Search Input Mobile Keyboard
**Learning:** Using `type="search"` on inputs triggers the native "Search" button on mobile keyboards (especially iOS). However, it introduces a native cancel button that can clash with custom UI designs.
**Action:** Always add `type="search"` to search inputs, use `[&::-webkit-search-cancel-button]:hidden` in Tailwind to hide the native cancel button, and ensure an explicit `aria-label` is present if there's no visible `<Label>`.
