## 2024-10-24 - Mobile Keyboard and A11y on Search Inputs
**Learning:** On iOS, search inputs without `type="search"` do not trigger the native "Search" keyboard (which replaces the "Return" key with a blue "Search" button). Additionally, icon-only or placeholder-only search fields fail accessibility checks without an explicit `aria-label`.
**Action:** Always add `type="search"` and an explicit `aria-label` (e.g., `aria-label="Search"`) to search inputs to ensure the optimal mobile keyboard experience and screen reader accessibility.
