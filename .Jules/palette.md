## 2024-10-24 - Initial Journal\n**Learning:** Started tracking UX improvements.\n**Action:** Will look for a11y issues like missing aria-labels on search inputs and icon buttons.

## 2024-10-24 - Search Input Optimization
**Learning:** Using type="search" on inputs triggers the native "Search" keyboard on mobile (iOS), but requires [&::-webkit-search-cancel-button]:hidden to hide the native clear button if it conflicts with custom styling.
**Action:** Always use type="search" for search inputs for better mobile UX, apply the webkit hidden utility class, and ensure they have aria-labels.
