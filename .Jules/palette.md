
## 2024-10-24 - iOS Search Keyboard UX
**Learning:** Using `type="search"` on inputs is critical for mobile apps to trigger the native "Search" keyboard key (specifically on iOS), significantly improving UX. The native cancel button can interfere with custom styling.
**Action:** Always add `type="search"` and `[&::-webkit-search-cancel-button]:hidden` to search inputs to ensure native keyboard optimization without visual bugs. Additionally, search inputs need explicit `aria-label` attributes if there is no visible `<label>`.
