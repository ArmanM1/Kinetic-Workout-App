## 2024-09-09 - Search Input Keyboard on Mobile
**Learning:** Using `type="search"` on Next.js/React inputs triggers the native "Search" keyboard key on iOS, making web apps feel significantly more native. However, webkit adds a default cancel button which often clashes with custom UI designs.
**Action:** Always add `type="search"`, `aria-label`, and `[&::-webkit-search-cancel-button]:hidden` (for tailwind) when creating search inputs to ensure native keyboard feel while retaining design control.
