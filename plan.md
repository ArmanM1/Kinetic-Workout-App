1. **Identify the UX Opportunity:**
   - Found two inputs used for searching exercises: one in `src/components/exercises/exercise-browser.tsx` and another in `src/components/workout/active-workout-client.tsx`.
   - Currently, they are standard text inputs without explicit ARIA labels and lack the iOS-friendly native "Search" key trigger.

2. **Apply Mobile UX Enhancements:**
   - Update both `<Input>` components to include `type="search"`. This will optimize the keyboard layout on mobile devices (specifically iOS) by replacing the default "Return" key with a "Search" key.
   - Add `aria-label="Search exercises"` to both inputs for better screen reader accessibility.
   - Add `[&::-webkit-search-cancel-button]:hidden` to their `className`s to hide the default browser clear button so it does not conflict with the app's custom UI.

3. **Verify the Changes:**
   - Run `pnpm lint` to ensure code quality is maintained.
   - Run `pnpm build` to verify the production build completes successfully.

4. **Complete Pre-Commit Steps:**
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.

5. **Log UX Journal & Submit PR:**
   - Add the learning to `.Jules/palette.md`.
   - Create a PR with a description detailing the what, why, before/after, and accessibility improvements using the `submit` tool.
