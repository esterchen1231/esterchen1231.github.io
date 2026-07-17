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
