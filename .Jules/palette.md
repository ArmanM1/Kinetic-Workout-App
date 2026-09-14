## 2024-05-18 - Search Inputs on Mobile
**Learning:** Using `type="search"` is critical for iOS mobile web apps to trigger the native "Search" key on the virtual keyboard instead of a generic "Return" key, vastly improving the interaction feel. Hiding the native webkit cancel button (`[&::-webkit-search-cancel-button]:hidden`) is also often necessary to maintain custom design systems.
**Action:** Always use `type="search"` with appropriate aria-labels for search inputs, especially in mobile-first applications, and hide native clear buttons if they conflict with custom UI.
