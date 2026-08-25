## 2025-01-08 - Mobile Search Input Enhancements
**Learning:** Using `type="search"` on inputs triggers the native "Search" keyboard key on mobile devices (especially iOS), but introduces native cancel buttons that can conflict with custom designs. Inputs relying solely on placeholders lack sufficient accessibility context for screen readers.
**Action:** Use `type="search"` alongside `[&::-webkit-search-cancel-button]:hidden` to remove default browser UI, and always pair search inputs with an explicit `aria-label`.
