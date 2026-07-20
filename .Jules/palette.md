## 2024-05-24 - Improve mobile search inputs
**Learning:** Adding `type="search"` to search inputs on mobile triggers the native "Search" button on the software keyboard (particularly iOS), which significantly improves the UX for users expecting a standard search interaction rather than a simple 'return' key.
**Action:** Always add `type="search"` to `<Input>` elements that serve as search bars to improve mobile keyboard integration.
