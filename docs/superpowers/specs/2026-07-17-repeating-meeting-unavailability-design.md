# Repeating Meeting Unavailability Design

## Goal

Allow one week of unavailable meeting blocks in `_data/meeting_unavailability.yml` to repeat across every week displayed by the booking calendar.

## Data Contract

Add this top-level setting:

```yaml
repeat_weekly: true
```

When `repeat_weekly` is `true`, each valid entry in `unavailable` is a weekly template. The calendar repeats it at seven-day intervals from its original date through the number of weeks configured by `display_weeks`.

When `repeat_weekly` is absent or not `true`, unavailable entries retain the existing exact-date behavior.

## Browser Behavior

The booking page will expand configured unavailable entries before rendering:

- Keep each original entry in its configured week.
- Clone it for each subsequent displayed week by adding 7 days per week.
- Preserve its start time, end time, and any other metadata.
- Limit generated blocks to the calendar range beginning at `week_start` and spanning `display_weeks`.
- Leave browser-local pending meeting requests as one-off entries; they never repeat.

For `display_weeks: 3`, one configured Tuesday block therefore appears on the corresponding Tuesday in all three displayed weeks.

## Error Handling

Malformed unavailable entries continue to be skipped without preventing valid entries from rendering. Invalid or missing `display_weeks` continues to use the page's existing fallback. Repetition is enabled only by the boolean value `true`, preventing accidental recurrence from truthy strings.

## Rollover Compatibility

The existing rollover script continues to shift the template dates and `week_start` together. It preserves `repeat_weekly` unchanged, so no rollover changes are required.

## Verification

- Confirm each configured weekday/time block appears in all three navigable weeks when `repeat_weekly: true`.
- Confirm `repeat_weekly: false` and an absent setting keep exact-date behavior.
- Confirm pending requests appear only on the selected date.
- Confirm malformed blocks are ignored and valid blocks still render.
- Run the existing site build or the closest available syntax/build checks.

## Out of Scope

- Calendar API integration.
- Recurrence patterns other than weekly.
- Per-entry recurrence overrides.
- Changes to the booking page layout or styling.

## September 23, 2026: runtime rollover correction

The recurring weekly template remains in `_data/meeting_unavailability.yml`.
The user supplied a replacement schedule and explicitly confirmed removal of
the old Friday entries. Times remain in `America/New_York`.

Browser verification exposed a stale-build problem: with a September 21 base
week and a simulated November 4 visit, the calendar displayed October 5–11.
The scheduled workflow advances source dates but does not itself publish a new
site build. [GitHub documents that pushes using `GITHUB_TOKEN` do not trigger
Pages builds](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

For weekly templates, normalize the saved base week and configured block dates
forward to the current Monday in the source timezone when the page loads. Shift
whole calendar weeks, preserving local start and end times through daylight
saving changes. Do not move future templates backward, mutate source data,
repeat pending requests, or change exact-date mode. Keep the three-week view.

The homepage card uses the same effective week as the booking page. Its static
fallback label is “Week of”; at runtime, the current week is labeled “This
week”. This replaces the misleading “Next week” label on a current-week card.

Verification passed: Jekyll build, focused Node regression checks, and browser
checks covering current dates, a Tokyo-Monday/New-York-Sunday boundary, New York
Monday, and a stale November visit after the daylight saving transition. All six
configured blocks repeat at the correct local times across three visible weeks,
Friday remains open, and the homepage dates agree with the booking calendar.
An existing browser-local pending request keeps its original date and time and
does not repeat into the next week.
