## 2024-05-24 - Mobile Search Inputs
**Learning:** Using `type="search"` on inputs is critical for triggering the correct native keyboard (especially on iOS), but the default WebKit styling adds a native cancel button that often conflicts with custom UI designs. Search inputs without visible labels also frequently lack ARIA labels.
**Action:** When adding search functionality, always use `type="search"` for keyboard UX, add `[&::-webkit-search-cancel-button]:hidden` to Tailwind classes to preserve custom design, and ensure `aria-label` is present.
