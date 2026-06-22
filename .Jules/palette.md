
## 2024-06-22 - Search Input Mobile Keyboard UX
**Learning:** For mobile-first apps, standard text inputs for search don't trigger the native iOS 'Search' key on the software keyboard, leading to a suboptimal UX. Also, utility inputs (like search) often lack visible labels, causing screen reader accessibility issues.
**Action:** Always use `type="search"` on search inputs to trigger the correct mobile keyboard layout, and pair it with an `aria-label` when a visible `<label>` is omitted.
