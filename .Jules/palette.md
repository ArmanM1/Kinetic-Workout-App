## 2024-05-22 - Mobile Search Keyboard & A11y
**Learning:** Adding `type="search"` to inputs triggers the native "Search" key on mobile keyboards (iOS/Android), but often introduces an unwanted native cancel button in Webkit. Utility inputs without visible labels (like search bars) need explicit `aria-label`s for screen readers.
**Action:** Always use `type="search"` with `[&::-webkit-search-cancel-button]:hidden` in Tailwind for custom search inputs, and ensure an `aria-label` is present.
