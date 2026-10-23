## 2026-10-23 - iOS Mobile Search Inputs
**Learning:** Using `type="search"` triggers the native iOS "Search" keyboard key, improving mobile UX, but WebKit adds a native clear button that clashes with custom shadcn inputs.
**Action:** Always add `type="search"` to search inputs for mobile users, add `aria-label` for screen readers if no label exists, and hide the native cancel button using `[&::-webkit-search-cancel-button]:hidden`.
