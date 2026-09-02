## 2024-09-02 - iOS Search Keyboard and A11y
**Learning:** Standard text inputs on mobile require users to press "return" instead of a contextual "Search" button, and lack explicit accessible names when labels are visually omitted.
**Action:** Use `type="search"` with `[&::-webkit-search-cancel-button]:hidden` to trigger native iOS search keyboards while maintaining custom design, and add `aria-label` to visually label-less search inputs.
