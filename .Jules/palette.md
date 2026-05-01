## 2024-05-24 - Mobile Keyboard Optimization for Search
**Learning:** In iOS/mobile web, using `type="search"` on search inputs is crucial as it replaces the generic "Return" key with a more contextual "Search" button on the native keyboard, improving interaction confidence. We also discovered utility inputs lacking explicit `aria-label`s when visible labels are missing.
**Action:** Always verify search-purpose inputs use `type="search"`. Add `aria-label`s to all inputs lacking visible labels.
