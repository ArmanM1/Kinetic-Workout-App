## 2026-05-07 - Mobile-Optimized Search Inputs
**Learning:** Using `type="search"` on search inputs triggers the native 'Search' keyboard key on iOS, improving the mobile typing experience. Adding `aria-label` ensures screen readers can identify utility inputs lacking a visible label component.
**Action:** Always include `type="search"` for search fields and `aria-label` when a visible `Label` component is not present, particularly for utility inputs like exercise search.
