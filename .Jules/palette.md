
## 2024-05-24 - Enhance mobile inputs with search type and ARIA labels
**Learning:** Utilizing type="search" triggers the native "Search" key on mobile keyboards (especially iOS), improving the user experience during searches. Additionally, inputs lacking a visible Label component must use explicit aria-labels to guarantee screen reader accessibility.
**Action:** Ensure utility inputs, especially search bars, utilize the appropriate type attribute and possess aria-labels when visual labels are absent.
