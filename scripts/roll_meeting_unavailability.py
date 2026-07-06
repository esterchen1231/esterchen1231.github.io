#!/usr/bin/env python3
"""Roll meeting unavailability dates forward when the saved week is stale."""

from __future__ import annotations

import argparse
import re
import sys
from datetime import date, datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError


DEFAULT_FILE = Path("_data/meeting_unavailability.yml")
DEFAULT_TIMEZONE = "America/New_York"

WEEK_START_RE = re.compile(
    r"^(?P<prefix>\s*week_start:\s*)"
    r"(?P<quote>[\"']?)"
    r"(?P<date>\d{4}-\d{2}-\d{2})"
    r"(?P=quote)"
    r"(?P<suffix>\s*(?:#.*)?)$"
)
DATE_RE = re.compile(
    r"^(?P<prefix>\s*(?:-\s*)?date:\s*)"
    r"(?P<quote>[\"']?)"
    r"(?P<date>\d{4}-\d{2}-\d{2})"
    r"(?P=quote)"
    r"(?P<suffix>\s*(?:#.*)?)$"
)


def parse_iso_date(value: str, field_name: str) -> date:
    try:
        return date.fromisoformat(value)
    except ValueError as exc:
        raise ValueError(f"{field_name} must be an ISO date, got {value!r}") from exc


def current_new_york_date(timezone_name: str) -> date:
    try:
        timezone = ZoneInfo(timezone_name)
    except ZoneInfoNotFoundError as exc:
        raise ValueError(f"Unknown timezone: {timezone_name}") from exc

    return datetime.now(timezone).date()


def target_monday(today: date) -> date:
    if today.weekday() == 6:
        return today + timedelta(days=1)
    return today - timedelta(days=today.weekday())


def split_line_ending(line: str) -> tuple[str, str]:
    if line.endswith("\r\n"):
        return line[:-2], "\r\n"
    if line.endswith("\n"):
        return line[:-1], "\n"
    return line, ""


def replace_match_date(match: re.Match[str], new_date: date) -> str:
    quote = match.group("quote")
    return (
        f"{match.group('prefix')}"
        f"{quote}{new_date.isoformat()}{quote}"
        f"{match.group('suffix')}"
    )


def find_week_start(lines: list[str]) -> date:
    for line in lines:
        body, _line_ending = split_line_ending(line)
        match = WEEK_START_RE.match(body)
        if match:
            return parse_iso_date(match.group("date"), "week_start")

    raise ValueError("Could not find a valid top-level week_start in meeting unavailability YAML")


def roll_text(text: str, target: date) -> tuple[str, bool, str]:
    lines = text.splitlines(keepends=True)
    saved_week_start = find_week_start(lines)

    if saved_week_start.weekday() != 0:
        raise ValueError(f"week_start must be a Monday, got {saved_week_start.isoformat()}")

    if saved_week_start >= target:
        return text, False, (
            f"No rollover needed: week_start is {saved_week_start.isoformat()} "
            f"and target Monday is {target.isoformat()}."
        )

    delta = target - saved_week_start
    updated_lines: list[str] = []

    for line in lines:
        body, line_ending = split_line_ending(line)
        week_start_match = WEEK_START_RE.match(body)
        date_match = DATE_RE.match(body)

        if week_start_match:
            updated_lines.append(replace_match_date(week_start_match, target) + line_ending)
            continue

        if date_match:
            block_date = parse_iso_date(date_match.group("date"), "unavailable date")
            updated_lines.append(replace_match_date(date_match, block_date + delta) + line_ending)
            continue

        updated_lines.append(line)

    return "".join(updated_lines), True, (
        f"Rolled meeting unavailability from {saved_week_start.isoformat()} "
        f"to {target.isoformat()}."
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Roll _data/meeting_unavailability.yml forward to the target New York week."
    )
    parser.add_argument(
        "--file",
        type=Path,
        default=DEFAULT_FILE,
        help=f"YAML file to update. Defaults to {DEFAULT_FILE}.",
    )
    parser.add_argument(
        "--today",
        help=(
            "Override today's date as YYYY-MM-DD for tests. "
            "Sunday targets the next day; Monday-Saturday target the current week's Monday."
        ),
    )
    parser.add_argument(
        "--timezone",
        default=DEFAULT_TIMEZONE,
        help=f"IANA timezone used to determine today's date. Defaults to {DEFAULT_TIMEZONE}.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    try:
        today = parse_iso_date(args.today, "--today") if args.today else current_new_york_date(args.timezone)
        target = target_monday(today)

        if not args.file.exists():
            raise FileNotFoundError(f"Meeting unavailability file not found: {args.file}")

        original = args.file.read_text(encoding="utf-8")
        updated, changed, message = roll_text(original, target)

        if changed:
            args.file.write_text(updated, encoding="utf-8")

        print(message)
        return 0
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
