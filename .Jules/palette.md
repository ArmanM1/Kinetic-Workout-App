## 2024-07-27 - Mobile Search Input UX
**Learning:** Search inputs missing the `type="search"` attribute render with a generic "Return" keyboard key on iOS rather than the native "Search" key, which degrades the mobile app feel. Furthermore, inputs without visible labels lack accessibility support.
**Action:** Always add `type="search"` and an explicit `aria-label` to standalone search inputs for native mobile UX and screen reader support.
