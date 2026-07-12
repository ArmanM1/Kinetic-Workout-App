## 2024-10-24 - Mobile Search Keyboard & Utility Input A11y
**Learning:** Using `type="search"` on inputs triggers the native iOS 'Search' return key, significantly improving mobile UX. Also, utility inputs (like workout names or inline reps/loads) without visible labels need explicit `aria-label` attributes for screen reader accessibility.
**Action:** Always verify search inputs have `type="search"` and all utility inputs have `aria-label` when a visible label component is omitted.
