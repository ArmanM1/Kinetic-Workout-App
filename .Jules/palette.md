## 2024-05-20 - Mobile Search Input UX
**Learning:** Using type="search" on inputs triggers the native "Search" keyboard key on iOS, significantly improving mobile UX. Hiding the native cancel button with [&::-webkit-search-cancel-button]:hidden is necessary to prevent UI conflicts.
**Action:** Always use type="search" for search fields and ensure explicit aria-labels are present for screen readers.
