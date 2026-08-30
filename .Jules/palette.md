## 2026-08-30 - Native Mobile Search Input UX
**Learning:** On mobile platforms, especially iOS, search utility inputs should leverage native device features to feel robust and intuitive. Standard inputs trigger a generic keyboard return key.
**Action:** Always use `type="search"` on search inputs to trigger the native "Search" keyboard key. Use `[&::-webkit-search-cancel-button]:hidden` to hide the native cancel button if it interferes with custom styling. Ensure explicit `aria-label`s are added for screen readers.
