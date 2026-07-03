# Book a Meeting With Ester Design

## Goal

Add a `/book-a-meeting/` subpage to the Jekyll personal website where visitors can inspect Ester's manually entered weekly unavailability and request a meeting by email.

The page must not access Google Calendar, store credentials, call a calendar API, or expose private calendar details. Ester will update a small YAML data file each week.

## User Decisions

- Data source: manual YAML file, not Google Calendar.
- Weekly display: Monday through Sunday.
- Source timezone: `America/New_York`.
- Visible source-time window: `09:00` through `17:00` each day.
- Visual encoding: unavailable blocks are light blue; blank time is available.
- Visitor control: a timezone dropdown lets visitors view the schedule in their preferred timezone.
- Selected layout: guided availability, with the calendar as the primary element and a compact explanation panel.

## Page Structure

Create a Jekyll page at `_pages/book-a-meeting.html` with:

- Front matter using `permalink: /book-a-meeting/`, `title: "Book a meeting with Ester"`, and the existing `default` layout.
- A concise intro explaining that the schedule is manually updated and that blank spaces are generally available.
- A timezone selector above the calendar.
- A Monday-Sunday calendar grid covering the configured week.
- Light blue unavailable blocks placed by day and time.
- A legend: light blue means unavailable; blank means available.
- A mail link to `esterchen@mail.rit.edu` for visitors to propose a meeting time.

Add a main navigation item in `_data/navigation.yml` titled `Book a Meeting` linking to `/book-a-meeting/`.

## Data Model

Create `_data/meeting_unavailability.yml`:

```yaml
week_start: 2026-07-06
source_timezone: America/New_York
visible_start: "09:00"
visible_end: "17:00"

unavailable:
  - date: 2026-07-06
    start: "10:00"
    end: "11:30"
    label: "Booked"
```

Rules:

- `week_start` is the Monday of the displayed week.
- `date`, `start`, and `end` values are entered in `source_timezone`.
- `start` must be earlier than `end`.
- Blocks outside `visible_start` and `visible_end` are clipped to the visible window. A block fully outside the visible window is not rendered.
- `label` defaults to `Booked` if omitted.
- Event details should remain generic; do not put private meeting names in the file.

## Timezone Behavior

The schedule is anchored to Ester's New York week and 9 AM-5 PM New York availability window. The browser converts visible labels and unavailable block labels for the selected visitor timezone.

The timezone dropdown should:

- Default to the visitor's detected timezone when available.
- Always include `America/New_York`.
- Include a fallback set of common zones if the browser cannot provide the full IANA timezone list.
- Re-render displayed day/time labels when changed.

Because the availability window is anchored to New York time, a visitor in another timezone may see local times that fall earlier or later than 9 AM-5 PM. The seven calendar columns remain the New York Monday-Sunday source week, and local time labels may show a different local date when a timezone crosses midnight. The page should communicate that the source schedule is maintained in New York time.

## Rendering Approach

Use Liquid to serialize the YAML data into a small JSON object inside the page. Use plain browser JavaScript to:

- Build the seven-day calendar grid.
- Convert source date/time values into absolute instants with browser `Intl` APIs and no external dependency.
- Render hour labels and unavailable block labels in the selected timezone.
- Position blocks proportionally within the configured source-time window.

Use CSS scoped to the booking page so existing homepage and product-design styles are not disturbed.

## Error Handling

If the data file is missing, empty, or invalid enough that the calendar cannot render, the page should show a readable fallback message asking visitors to email Ester directly.

If timezone detection fails, default to `America/New_York`.

If an unavailable block has malformed data, skip that block and keep rendering the rest of the week.

## Testing

Manual local checks:

- Build the Jekyll site successfully.
- Visit `/book-a-meeting/`.
- Confirm the page appears in navigation.
- Confirm all seven days render from Monday through Sunday.
- Confirm light blue blocks match the YAML data.
- Confirm blank time remains visually available.
- Change the timezone dropdown and verify displayed labels update.
- Check mobile width so the grid remains usable and text does not overlap.

## Out of Scope

- Google Calendar sync.
- Booking/reservation workflows.
- Backend storage.
- Visitor authentication.
- Automatic weekly calendar rollover.
- Form submissions from the website.
