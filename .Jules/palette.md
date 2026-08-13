## 2024-08-13 - Native Mobile Search Input UX
**Learning:** Using type="search" triggers the native mobile keyboard's "Search" key (crucial for iOS feel). However, it adds a native webkit cancel button that clashes with custom styling. Missing visible labels require aria-label for accessibility.
**Action:** Add type="search" to search inputs, hide the native button with [&::-webkit-search-cancel-button]:hidden, and add aria-labels for screen readers.
