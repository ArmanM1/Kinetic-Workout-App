## 2024-05-19 - Use type="search" for search inputs on mobile
**Learning:** Using `type="search"` on search input fields gives a better mobile UX (especially iOS) by triggering the native "Search" key on the keyboard, instead of a generic "Go" or "Return" key.
**Action:** Apply `type="search"` to `<Input>` components used for searching, such as `exercise-browser.tsx` and `active-workout-client.tsx`.
