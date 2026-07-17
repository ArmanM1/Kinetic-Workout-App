
## 2024-06-19 - Mobile Search Keyboards & Input Labels
**Learning:** Using `type="search"` on inputs is critical for mobile (especially iOS) because it triggers the native "Search" return key instead of a standard "Return" key, which provides a much better user experience. Additionally, inputs that lack a visible `<Label>` (like a standalone search bar with an icon) must have an explicit `aria-label` for screen reader accessibility.
**Action:** Always add `type="search"` to search inputs to ensure the correct mobile keyboard is displayed, and always pair it with an `aria-label` when there's no visible `<label>` component.
