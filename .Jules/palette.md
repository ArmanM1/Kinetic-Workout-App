## 2024-05-24 - Search Input Keyboard & Screen Reader UX
**Learning:** Mobile web views don't show the "Search" enter key without type="search", and custom-styled search inputs look broken with native webkit cancel buttons. Furthermore, standalone inputs like workout titles lack context for screen readers.
**Action:** Use type="search" with hidden webkit cancel buttons for mobile search fields, and ensure all standalone utility inputs have an explicit aria-label.
