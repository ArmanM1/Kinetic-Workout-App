## UX Journal
## 2024-05-18 - Mobile Native Search Key & Input Accessibility
**Learning:** For a mobile-focused application, using `type="search"` on search inputs is critical for triggering the native 'Search' or 'Go' key on iOS and Android keyboards, enhancing the user experience. Furthermore, grid-based or inline utility inputs (like weight/reps inside an active workout context) often lack visible `<label>` elements to save space, but still require an `aria-label` for screen reader accessibility.
**Action:** Always verify that search fields have `type="search"` instead of the default `text` type. Additionally, ensure all form inputs that omit a visible `<Label>` component have an explicit `aria-label` attribute describing their purpose.
