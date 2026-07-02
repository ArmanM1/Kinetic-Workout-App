## 2024-05-23 - Mobile Search Input Enhancements
**Learning:** Using `type="search"` is critical for triggering the native 'Search' keyboard key on mobile devices, greatly improving mobile UX. Additionally, inputs that use icons for labels instead of visible text must have explicit `aria-label` attributes for screen reader accessibility.
**Action:** Always add `type="search"` and descriptive `aria-label` attributes to search inputs in mobile-first applications.
