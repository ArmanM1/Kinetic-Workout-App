
## 2026-06-09 - Search Input Keyboard UX & Accessibility
**Learning:** Using `type="search"` on search inputs triggers the native "Search" key on mobile keyboards (especially iOS) instead of "Return", drastically improving mobile UX. Pairing this with `aria-label` ensures icon-only search inputs are accessible to screen readers.
**Action:** Always add `type="search"` and explicit `aria-label` to custom search input components, especially in mobile-first applications.
