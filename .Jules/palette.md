## 2025-03-05 - Accessibility: Icon-Only Buttons
**Learning:** Icon-only buttons (like the Play button in workout splits) must have ARIA labels to be usable by screen-reader users, otherwise the button's action is completely opaque.
**Action:** Always add `aria-label` or `.sr-only` text to any `<button>` that lacks visible text content.
