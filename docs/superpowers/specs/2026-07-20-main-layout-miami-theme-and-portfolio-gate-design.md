# Main-Layout Miami Theme, Current-Week Calendar, and Portfolio Gate

## Goal

Extend the Miami Beach visual direction to every page using the site's shared default layout, open the meeting calendar on the current configured week, and add a lightweight session password gate to the standalone product-design portfolio.

## Shared Main-Layout Theme

Add a dedicated class to the `<body>` in `_layouts/default.html`. Use that class to scope a shared light/dark Miami Beach theme in the global stylesheet so the masthead, page background, sidebar, primary content, headings, links, cards, and related surfaces use warm sand, turquoise, coral, and deep ocean colors.

The `/product-design/` page uses `layout: null` and must remain visually unchanged. Existing booking-page component styles remain in place and should harmonize with the shared shell without duplicating the shell background.

## Current-Week Calendar Default

On initial load, calculate today's date in the calendar's `source_timezone`, find the Monday of that week, and compare it with `week_start`. If the current Monday falls within the configured `display_weeks`, initialize the visible week to that index. If today is before or after the configured range, clamp to the first or last configured week. Manual previous/next navigation continues to work unchanged.

## Product-Design Password Gate

Add a custom gate to `/product-design/` that hides the portfolio interface until the visitor enters the user-provided password. Compare the entered value with a SHA-256 digest in browser JavaScript rather than embedding the plaintext password. After a successful check, store an unlock flag in `sessionStorage` so the portfolio remains open for the current browser session only.

The form must support keyboard submission, show a concise error for an incorrect password, and restore the portfolio immediately when a valid session flag already exists. If Web Crypto is unavailable, keep the content gated and show a browser-support error.

This is a casual-access deterrent only. Because the site is static, the HTML content and password-checking logic remain downloadable and do not provide server-side security.

## Verification

- Build the Jekyll site successfully.
- Check shared-layout pages in light and dark themes at desktop and narrow widths.
- Confirm `/product-design/` retains its existing portfolio theme behind the gate.
- Confirm an incorrect password does not unlock the portfolio.
- Confirm the correct password unlocks it and a reload in the same session remains unlocked.
- Confirm a new session requires the password again.
- Confirm the meeting page initially opens July 20–26, 2026 for the current repository data and date, with previous/next controls still correct.

## Out of Scope

- Server-side authentication or encrypted portfolio delivery.
- Restyling the standalone product-design portfolio itself.
- Changing calendar entries, repetition rules, or booking behavior.
