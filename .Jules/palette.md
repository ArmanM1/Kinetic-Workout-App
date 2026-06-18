
## 2024-06-18 - Mobile Search Keyboard Pattern
**Learning:** When building mobile-first apps on iOS, adding `type="search"` to search inputs correctly triggers the native "Search" action key on the system keyboard instead of the generic "Return" key, significantly improving mobile UX.
**Action:** Always use `type="search"` alongside `aria-label` for any input intended for filtering or searching lists.
