## 2024-07-19 - Mobile Search Keyboard Support
**Learning:** Search inputs lacking `type="search"` fail to trigger the native "Search" or "Go" key on mobile virtual keyboards (especially iOS), leading to a frustrating user experience when looking up items like exercises.
**Action:** Always apply `type="search"` to search-specific `<Input>` or `<input>` fields to ensure the mobile keyboard displays the correct submission key and provides a native, app-like feel.
