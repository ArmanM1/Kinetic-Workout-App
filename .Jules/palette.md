## 2024-05-24 - Better iOS Search Inputs
**Learning:** Using `type="search"` on search inputs dramatically improves mobile UX (especially iOS) by replacing the default 'Return' key with a prominent blue 'Search' key. However, WebKit injects a native cancel button that can clash with custom UI, which requires CSS masking.
**Action:** Always pair `type="search"` with `[&::-webkit-search-cancel-button]:hidden` in Tailwind, and ensure standalone search inputs have explicit `aria-label` attributes.
