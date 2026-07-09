## 2024-05-30 - Mobile Search Input UX
**Learning:** Search inputs on mobile devices do not show the native 'Search' key on the keyboard unless `type="search"` is explicitly provided. Adding an `aria-label` ensures screen readers understand the input's purpose when it lacks a visible label.
**Action:** Always add `type="search"` to search inputs to improve iOS UX, and `aria-label` for accessibility.
