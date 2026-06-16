## 2024-03-21 - Mobile Search UX & Input Accessibility
**Learning:** Search inputs without `type="search"` fail to trigger the native mobile keyboard's "Search" key, reducing the native app feel. Utility inputs without visible labels rely entirely on visual context, making them inaccessible to screen readers.
**Action:** Always add `type="search"` to search inputs for better mobile keyboard integration, and add explicit `aria-label` attributes to inputs that lack a visible `<label>` component.
