## 2024-05-18 - Improve mobile search keyboard and utility inputs a11y
**Learning:** Using `type="search"` on search input fields triggers the native iOS 'Search' keyboard key, providing a better user experience on mobile. Utility inputs missing visual label components must have `aria-label` attributes for accessibility.
**Action:** Always verify search inputs have `type="search"` set. Always check utility inputs/textareas to ensure they are accessible via `aria-label` if no direct label element is associated.
