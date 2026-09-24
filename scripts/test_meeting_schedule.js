"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const context = vm.createContext({ Intl, Date });
vm.runInContext(fs.readFileSync(path.join(__dirname, "../assets/js/meeting-schedule.js"), "utf8"), context);
const normalize = context.MeetingSchedule.normalize;
const template = {
  week_start: "2026-09-21",
  repeat_weekly: true,
  display_weeks: 3,
  source_timezone: "America/New_York",
  unavailable: [
    { date: "2026-09-21", start: "12:00", end: "13:00" },
    { date: "2026-09-24", start: "10:00", end: "11:00" }
  ]
};
const snapshot = JSON.stringify(template);

// A stale deployment must recover even after all three saved weeks have passed.
const november = normalize(template, new Date("2026-11-04T17:00:00Z"));
assert.equal(november.week_start, "2026-11-02");
assert.equal(november.unavailable[0].date, "2026-11-02");
assert.equal(november.unavailable[1].date, "2026-11-05");
assert.equal(november.display_weeks, 3);
assert.equal(JSON.stringify(template), snapshot, "normalizing must not mutate the saved template");
assert.strictEqual(normalize(november, new Date("2026-11-04T17:00:00Z")), november);

// Monday in UTC is still Sunday evening in New York; advance only at local Monday.
assert.equal(normalize(template, new Date("2026-11-02T04:59:00Z")).week_start, "2026-10-26");
assert.equal(normalize(template, new Date("2026-11-02T05:00:00Z")).week_start, "2026-11-02");

// Calendar-day shifts preserve weekly local clock times over both DST transitions.
for (const instant of ["2026-11-04T17:00:00Z", "2027-03-17T16:00:00Z"]) {
  const result = normalize(template, new Date(instant));
  result.unavailable.forEach((block, index) => {
    assert.equal(block.start, template.unavailable[index].start);
    assert.equal(block.end, template.unavailable[index].end);
    assert.equal(new Date(block.date + "T00:00:00Z").getUTCDay(), index === 0 ? 1 : 4);
  });
}

const future = Object.assign({}, template, { week_start: "2026-12-07" });
assert.strictEqual(normalize(future, new Date("2026-11-04T17:00:00Z")), future);
const exactDates = Object.assign({}, template, { repeat_weekly: false });
assert.strictEqual(normalize(exactDates, new Date("2026-11-04T17:00:00Z")), exactDates);
const invalidDate = Object.assign({}, template, { week_start: "2026-02-30" });
assert.strictEqual(normalize(invalidDate, new Date("2026-11-04T17:00:00Z")), invalidDate);

console.log("Meeting schedule regression checks passed.");
