## 2024-05-10 - Add Mobile Search Keys & A11y to Inputs
**Learning:** For better mobile UX, especially on iOS, search inputs should utilize `type="search"` to trigger the native "Search" keyboard key. Utility inputs like search bars that don't have a visible `<Label>` component must have an explicit `aria-label` for screen reader accessibility.
**Action:** When creating or modifying search bars or utility inputs without visible labels, always include `type="search"` (for mobile keyboards) and `aria-label` (for accessibility).
