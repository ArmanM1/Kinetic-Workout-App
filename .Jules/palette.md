## 2024-08-04 - Search Input UX on Mobile
**Learning:** Using `type="search"` on input fields drastically improves the mobile keyboard UX (especially on iOS) by showing a native "Search" return key instead of a generic "Go" or "Enter". Also, utility inputs wrapped with just an icon need explicit `aria-label`s for screen readers when no `<label>` is present.
**Action:** Always add `type="search"` and `aria-label` to search inputs lacking a visible label.
