## 2024-05-24 - Search Input Mobile Keyboard & A11y
**Learning:** iOS keyboards provide a much better UX when search inputs use `type="search"` because it replaces the default "Return" key with a "Search" key. Additionally, inputs that rely solely on `placeholder` text for context need an explicit `aria-label` for screen reader users.
**Action:** Always use `type="search"` and `aria-label` for utility search inputs that lack visible label components.
