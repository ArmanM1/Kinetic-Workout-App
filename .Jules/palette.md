## 2024-05-18 - Mobile Input Keyboards and ARIA labels
**Learning:** Using `type="search"` on search inputs triggers the native 'Search' key on mobile keyboards, significantly improving the UX on devices like iOS. Furthermore, utility inputs without visible label components must use explicit `aria-label` attributes to be accessible.
**Action:** Always verify if an input is acting as a search bar and add `type="search"`, and ensure all icon-only or label-less inputs have `aria-label`.
