# iPhone Responsive UI and Day/Night Mode Design

## Goal

Make every public page usable in an iPhone browser with minimal visual changes, and add a day/night mode toggle with a moon/sun icon on every page.

## Scope

Pages covered:

- Homepage at `/`
- Booking page at `/book-a-meeting/`
- Product design page at `/product-design/`

The implementation should preserve the current desktop layout and visual identity. Mobile changes should focus on preventing horizontal overflow, improving readability, keeping controls tappable, and making existing layouts adapt cleanly to narrow screens.

## Chosen Approach

Use a CSS-first mobile hardening approach.

This keeps the existing HTML structure and desktop appearance where possible. Shared Jekyll pages receive global responsive rules through the SCSS source. The standalone product design page receives matching local CSS and a local copy of the theme toggle markup/script because it uses `layout: null`.

## Responsive Design

### Shared Jekyll Layout

The shared layout should:

- Keep `meta viewport` behavior as-is.
- Keep the masthead sticky.
- Let the main content use the full phone width with smaller side padding.
- Stack the sidebar and page content on small screens.
- Prevent long links, publication titles, email addresses, and inline content from forcing horizontal page overflow.
- Keep images, embeds, tables, and code blocks inside the viewport or give them controlled horizontal scrolling.

### Masthead Navigation

The navigation should keep the current greedy navigation behavior. On iPhone widths:

- The visible links should not push the page wider than the viewport.
- The menu button should remain tappable.
- The new theme toggle should sit in the masthead without changing desktop spacing materially.

### Homepage

The homepage should keep the current content order:

1. Author/sidebar profile
2. About text
3. News
4. Publications
5. Education

Mobile-specific adjustments should only make the existing content fit:

- News box should keep its scrollable behavior but use phone-safe padding and width.
- Publication entries and DOI/arXiv links should wrap instead of overflowing.
- Headings should scale down enough to avoid cramped text.

### Booking Page

The booking page should preserve the weekly calendar model.

On phones:

- The hero and control panel stack vertically.
- Select controls fill available width.
- The legend wraps naturally.
- The calendar remains horizontally scrollable instead of being redesigned into a different agenda view.
- The horizontal scroll container should use iOS-friendly scrolling and an explicit visual note/status is not required.
- Calendar block labels remain readable enough and do not resize the grid.

### Product Design Page

The product design page is standalone and should keep its current portfolio look.

On phones:

- The hero content and contact links stack.
- Layout grids collapse to one column.
- Cards and buttons fit within the viewport.
- The email button wraps or shrinks without forcing horizontal scrolling.
- Spacing tightens modestly while preserving the desktop visual style.

## Day/Night Mode

### Behavior

Every page gets a compact icon button:

- Moon icon when switching to night mode.
- Sun icon when switching back to day mode.
- Accessible label updates with the current action.

Theme selection rules:

1. If the visitor has a saved preference in `localStorage`, use it.
2. Otherwise, follow `prefers-color-scheme`.
3. The toggle updates the saved preference immediately.

### Shared Pages

The shared Jekyll pages should add the toggle to `_includes/masthead.html` and load a small script through the shared includes or layout.

Theme colors should be implemented with CSS custom properties and a `data-theme` attribute on `document.documentElement`. Existing colors can remain as fallbacks.

### Product Design Page

Because `/product-design/` does not use the shared layout, it needs the same day/night behavior inside that standalone file.

The product design page already uses CSS variables, so the dark palette can be applied by overriding those variables under `[data-theme="dark"]`.

## Error Handling and Edge Cases

- If `localStorage` is unavailable, the toggle still changes the current page theme for the session.
- If JavaScript is unavailable, pages remain usable in the default light theme.
- If `prefers-color-scheme` is unsupported, default to light theme.
- No content should depend on the theme script to be readable.

## Testing

Manual verification should cover:

- Jekyll build succeeds.
- Homepage, booking page, and product design page render at iPhone-width viewports.
- No page-level horizontal scrolling appears except inside the booking calendar scroll area and any intentional overflow containers.
- Theme toggle appears on every page.
- Theme preference persists after reload.
- Light and dark themes keep text contrast readable.

Browser verification should use local Jekyll output or a local server, with at least one narrow viewport around iPhone size.

## Out of Scope

- Redesigning the booking calendar into a mobile agenda.
- Changing the content hierarchy or writing new copy.
- Reworking the desktop layout.
- Adding a full settings panel or multiple color themes.
