## 2024-05-15 - Add native iOS search keyboard and a11y label to search inputs
**Learning:** For better mobile UX (especially iOS), using `type="search"` on search input fields triggers the native "Search" keyboard key rather than a generic "Return" key, which feels much more native. Additionally, utility inputs without a visible label component need explicit `aria-label` attributes to remain accessible to screen readers.
**Action:** Always verify if search inputs use `type="search"` and include an `aria-label` when a visible label component is omitted.
