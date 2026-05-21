## 2025-05-21 - Search Inputs & Accessible Utility Inputs
**Learning:** Search inputs on mobile devices often fail to display the native "Search" key on the virtual keyboard unless explicitly marked with `type="search"`. Additionally, utility inputs (like inline edit fields for reps/weight) that lack a visible `<Label>` component present accessibility issues for screen readers.
**Action:** Always apply `type="search"` to search inputs for better mobile UX, and ensure all utility inputs without a visible `<Label>` component have explicit `aria-label` attributes.
