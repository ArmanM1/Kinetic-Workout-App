## 2024-05-18 - Search Input Mobile UX
**Learning:** For a mobile-first app, using `type="search"` on search inputs is critical as it triggers the native iOS "Search" keyboard key rather than a generic "Return" key, significantly improving mobile UX. Also, utility inputs lacking visual labels need explicit `aria-label`s for accessibility.
**Action:** Always add `type="search"`, `aria-label="Search..."`, and `[&::-webkit-search-cancel-button]:hidden` (to prevent conflict with custom designs) to search `<Input>` components.
