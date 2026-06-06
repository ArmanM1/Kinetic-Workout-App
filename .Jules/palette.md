## 2026-06-06 - Search Input Mobile Optimization & Accessibility
**Learning:** Utility inputs like "Search" without visible text labels are common in mobile-first designs but create accessibility gaps for screen readers. Furthermore, standard text inputs lack the semantic hints required to trigger the "Search" key on mobile keyboards (especially iOS).
**Action:** Always add `type="search"` and explicit `aria-label` attributes to search input fields to simultaneously improve mobile typing UX and screen reader accessibility.
