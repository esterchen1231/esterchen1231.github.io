# News year filter

Add a compact, labeled native selector beside the News heading, above the
existing scrollbox. Keep the heading and selector on the same line when space
permits, wrapping on narrow screens. Preserve the existing `#-news` anchor.
The default is All years; options come from the year groups already present,
in their existing newest-first order. Selecting a year hides the other groups
and resets the news scroll position. The selected year expands to its full
height so readers do not need to navigate a second scrollbar. All years retains
the current compact scrollbox. News text, dates, links, and order stay intact.

Use the site's existing typography and lilac theme token, including dark mode.
The label is View by year; the selector remains outside the scrolling region.
Provide visible keyboard focus and a polite result count. Without JavaScript,
hide the inactive selector and show every update as before.

Verify each year and All years, focus/keyboard operation, scroll reset, complete
existing content, mobile width, both themes, and no-JavaScript fallback. Combine
the final build with the five new square gallery photos once they are ready.

Verification passed for all four years and All years, all nine retained updates,
keyboard type-ahead selection, announced counts, scroll reset, full selected-year
height, same-row desktop heading/control alignment, both color themes, 390px and
320px layouts, and the no-JavaScript fallback. Screenshots were reviewed.
