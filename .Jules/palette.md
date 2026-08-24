## 2024-05-24 - iOS Search UX
**Learning:** Using `type="search"` on inputs is essential for mobile UX to trigger the native "Search" keyboard key, but requires `[&::-webkit-search-cancel-button]:hidden` to prevent native UI from overriding custom designs. Utility inputs without visible label components also require explicit `aria-label` attributes.
**Action:** Always add `type="search"`, custom styling to hide native buttons, and `aria-label` to all search inputs for a native app feel and accessibility.
