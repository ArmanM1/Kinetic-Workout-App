## 2024-05-24 - iOS Mobile Experience Enhancements
**Learning:** Users on iOS rely heavily on the native 'Search' keyboard key when filling out search inputs. If `type="search"` is not used, the typical enter/return key is shown instead, which is unintuitive. Also, the native cancel button can interfere with custom UI elements.
**Action:** Always add `type="search"` and `[&::-webkit-search-cancel-button]:hidden` (or similar) to search inputs on mobile-focused sites like Kinetic.
