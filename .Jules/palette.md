## 2026-10-06 - Mobile native search keyboard keys and aria labels
**Learning:** Using `type="search"` on search inputs dramatically improves mobile UX by triggering the native OS "Search" key instead of "Return/Enter". Additionally, utility inputs without visual labels need `aria-label` for screen reader accessibility, and WebKit's native search cancel button must be hidden (`[&::-webkit-search-cancel-button]:hidden`) when using custom design systems.
**Action:** Always add `type="search"`, `aria-label`, and hide native cancel buttons on search inputs in Next.js apps.
