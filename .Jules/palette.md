## 2024-07-26 - Native Search Keyboards & Input Labels
**Learning:** iOS requires type="search" to display the "Search" return key. Standalone utility inputs lacking visible labels require aria-labels for screen reader support.
**Action:** Always use type="search" for search bars and assign aria-labels to all form inputs not strictly bound by <label> tags.
