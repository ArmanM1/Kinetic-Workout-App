## 2024-05-14 - Mobile Search UX & Input Accessibility
**Learning:** Using `type="search"` on inputs triggers the native "Search" key on iOS/mobile keyboards, improving the mobile-first experience. Additionally, utility inputs without a visible label component must have an explicit `aria-label` for screen reader accessibility.
**Action:** Always add `type="search"` and `aria-label` to search inputs lacking a visible label to enhance both mobile interaction and accessibility.
