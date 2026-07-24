## 2024-05-18 - Mobile Search Input UX
**Learning:** Search inputs in this app lacked `type="search"`, missing out on the native 'Search' keyboard key on mobile devices (especially iOS). Also, inputs without visible labels needed `aria-label`s.
**Action:** Always add `type="search"` to search inputs to trigger the correct native mobile keyboard and improve accessibility.
