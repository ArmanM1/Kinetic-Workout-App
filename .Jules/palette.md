## 2026-07-31 - Mobile Native Search Key Pattern
**Learning:** iOS/Android keyboards only trigger the native 'Search' action key when an input explicitly has `type="search"`. Additionally, utility inputs that lack a visible `<Label>` component cause a11y violations on screen readers.
**Action:** Always add `type="search"` and an explicit `aria-label` attribute to all utility search inputs across the application.
