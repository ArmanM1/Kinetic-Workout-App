## 2024-05-24 - Enhance mobile search inputs with type="search" and aria-labels
**Learning:** Search inputs lacking `type="search"` fail to display the "Search" key on mobile keyboards (especially iOS), leading to a less intuitive experience. Additionally, omitting `aria-label` on inputs without visible labels degrades screen reader accessibility.
**Action:** Always include `type="search"` and explicit `aria-label`s on search inputs to optimize native mobile interactions and maintain screen reader compatibility.
