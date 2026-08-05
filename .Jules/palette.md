## 2024-08-05 - Native Mobile Keyboard Optimization
**Learning:** Using `type="search"` on inputs is essential for mobile-first web apps, as it triggers the native OS "Search" key instead of the generic "Return" key, bridging the gap between web and native iOS app feel.
**Action:** Always use `type="search"` for search inputs and pair them with explicit `aria-label` attributes when a visible label isn't present to satisfy both usability and accessibility.
