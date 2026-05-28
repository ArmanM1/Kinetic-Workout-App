## 2024-05-28 - Search Type and ARIA Labels
**Learning:** Using `type="search"` on search input fields triggers the native "Search" keyboard key on iOS, significantly improving mobile UX. Additionally, utility inputs and textareas that lack visible labels require explicit `aria-label` attributes for accessibility.
**Action:** Always add `type="search"` to search inputs and ensure all inputs without visible labels have descriptive `aria-label`s.
