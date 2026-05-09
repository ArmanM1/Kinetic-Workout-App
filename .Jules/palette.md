## 2026-05-09 - Mobile Keyboard and A11y Inputs
**Learning:** Using type='search' significantly improves mobile UX by triggering native search keyboards with 'Search' return keys. Additionally, inline utility inputs frequently lack semantic labels, requiring explicit aria-label attributes.
**Action:** Always check input fields on mobile interfaces to ensure they use the correct type for the appropriate keyboard, and verify that all inputs without an explicit label have an aria-label.
