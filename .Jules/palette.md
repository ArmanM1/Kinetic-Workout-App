## 2024-05-15 - Improve Search Input Keyboard UX on iOS
**Learning:** Native software keyboard adjustments on iOS (like the 'Search' button instead of 'Return') are triggered by the HTML `type="search"` attribute on inputs. This is crucial for a native mobile feel but can introduce a native cancel button that may conflict with custom designs.
**Action:** When implementing search inputs, always add `type="search"`. If the native cancel button interferes with custom UI, hide it using `[&::-webkit-search-cancel-button]:hidden` in Tailwind.
