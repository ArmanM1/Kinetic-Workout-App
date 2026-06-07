## 2024-05-15 - Improve Search Input UX on Mobile
**Learning:** Search inputs in the UI should always include `type="search"` to trigger the native 'Search' keyboard key on iOS and other mobile devices, and require `aria-label` for screen reader accessibility when a visible label is missing.
**Action:** Always add `type="search"` and `aria-label` to standalone search `<Input>` components to enhance mobile and accessible UX.
