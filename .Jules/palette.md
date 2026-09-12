## 2026-09-12 - Mobile-Native Search Inputs
**Learning:** Using `type="search"` on inputs is critical for iOS mobile web apps as it triggers the native 'Search' key on the virtual keyboard, improving the tactile feel. However, Safari injects a native cancel button that can clash with custom UI designs.
**Action:** Always add `type="search"` to search fields for the native keyboard, use `[&::-webkit-search-cancel-button]:hidden` to hide the conflicting native clear button, and ensure an explicit `aria-label` is present for screen readers when no visible label exists.
