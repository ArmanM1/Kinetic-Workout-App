## 2026-10-10 - Mobile search UX and accessibility
**Learning:** Using `type="search"` on inputs is a critical mobile optimization that triggers the native OS "Search" keyboard key, significantly improving the native feel on iOS/Android. The native cancel button can conflict with custom UI, so it needs `[&::-webkit-search-cancel-button]:hidden`. Also, utility inputs lacking a visible `<Label>` require explicit `aria-label` attributes for screen readers.
**Action:** Always add `type="search"`, `aria-label`, and the webkit hidden pseudo-class to utility search inputs across the app.
