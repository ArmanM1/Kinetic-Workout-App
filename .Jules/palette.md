## 2024-07-30 - Search Input Optimization
**Learning:** Search inputs lacking visible labels require `aria-label` for screen reader accessibility, and using `type="search"` instead of default text input significantly improves the mobile UX by triggering the native iOS "Search" key on the virtual keyboard.
**Action:** Always verify that input fields intended for searching have both `type="search"` and a descriptive `aria-label` attribute, especially in mobile-first applications.
