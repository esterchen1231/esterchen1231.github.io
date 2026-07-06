# Meeting Unavailability Rollover Design

## Goal

Add an automated fallback that keeps `_data/meeting_unavailability.yml` current when the weekly schedule is not manually updated.

Every Sunday at 23:59 in `America/New_York`, the automation should check whether the YAML file still points to an older week. If it does, it should copy the latest saved weekly pattern forward to the current/upcoming Monday and commit the updated YAML back to the default branch.

## User Decisions

- Run time: every Sunday at 23:59 in New York time.
- If the schedule is stale by more than one week, roll it all the way forward to the current/upcoming Monday.
- Preserve the last saved weekly pattern: same times, labels, visible window, and timezone.
- Only replace date fields that encode the weekly schedule.

## Architecture

Use a small Python script for the rollover logic and a GitHub Actions workflow for scheduling and committing.

The script will live at `scripts/roll_meeting_unavailability.py` and will:

- Read `_data/meeting_unavailability.yml`.
- Parse `week_start` as an ISO date.
- Compute the target Monday from the current date in `America/New_York`.
- Exit without changes if `week_start` is already the target Monday or newer.
- Shift `week_start` and every valid `unavailable[].date` forward by the exact date delta between the saved week and the target week.
- Preserve `source_timezone`, `visible_start`, `visible_end`, `start`, `end`, `label`, and unavailable block order.
- Write the YAML file only when a rollover is needed.

The workflow will live at `.github/workflows/meeting_unavailability_rollover.yml` and will:

- Run on `schedule` at `59 23 * * 0` with `timezone: America/New_York`.
- Support `workflow_dispatch` for manual runs.
- Check out the repository with write credentials.
- Run the Python script.
- Commit `_data/meeting_unavailability.yml` only when the file changed.

## Target Monday Rule

The automation computes the next schedule week from the action run date in New York time.

- On Sunday, the target Monday is the next day.
- On Monday through Saturday manual runs, the target Monday is the Monday of the current New York week.

This keeps scheduled Sunday runs aligned with the public page wording, which shows the next week, while making manual test runs predictable.

## Error Handling

If the YAML file is missing, unreadable, or has an invalid `week_start`, the script should fail with a clear error and leave the file unchanged.

If an unavailable block has no valid `date`, the script should leave that block untouched instead of deleting it. This avoids data loss if a future manual entry adds metadata that the script does not understand.

If no rollover is needed, the script exits successfully without modifying the file, and the workflow has nothing to commit.

## Testing

Local checks:

- Run the script against a fixture-like copy or temporary git state where `week_start` is stale by one week.
- Run the script where `week_start` is stale by multiple weeks and confirm all dates move to the target Monday week.
- Run the script when `week_start` is already current and confirm no file change.
- Run a syntax check for the script.

Repository checks:

- Confirm the workflow YAML is valid enough to be parsed by GitHub Actions.
- Confirm the action commit step only runs when `_data/meeting_unavailability.yml` changed.

## Out of Scope

- Calendar API integration.
- Inferring true availability from email or calendar data.
- Changing the booking page UI.
- Changing visitor request behavior.
- Deleting old or malformed schedule blocks.
