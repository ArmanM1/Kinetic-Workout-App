## 2025-01-01 - Enhance iOS Mobile Search Input
**Learning:** Search input fields lack the `type="search"` attribute which causes mobile users, specifically on iOS, to see a generic keyboard layout rather than one optimized for search (with a native "Search" button). Also, some utility `<Input>`s are lacking accessible names since they don't have visual `<label>` components.
**Action:** Always add `type="search"` and `aria-label` to search fields. Always add `aria-label`s to unlabelled utility inputs for accessibility and screen reader support.
