## 2026-06-21 - iOS Search Keyboard Optimization
**Learning:** Using `type="search"` on search inputs triggers the native "Search" key on the iOS keyboard, improving mobile user experience. Search inputs also require explicit `aria-label` attributes if there is no visible label.
**Action:** Always add `type="search"` and `aria-label` to search inputs in mobile-first applications.
