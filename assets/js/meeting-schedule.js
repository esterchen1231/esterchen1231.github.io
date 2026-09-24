(function (root) {
  "use strict";

  var dayMilliseconds = 24 * 60 * 60 * 1000;

  function parseDate(dateText) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateText || ""))) {
      return null;
    }
    var date = new Date(dateText + "T00:00:00Z");
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === dateText ? date : null;
  }

  function currentMonday(timezone, now) {
    var parts = {};
    new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(now || new Date()).forEach(function (part) {
      if (part.type !== "literal") {
        parts[part.type] = part.value;
      }
    });
    var date = parseDate(parts.year + "-" + parts.month + "-" + parts.day);
    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 6) % 7);
    return date.toISOString().slice(0, 10);
  }

  function normalize(data, now) {
    if (!data || data.repeat_weekly !== true) {
      return data;
    }
    var savedStart = parseDate(data.week_start);
    if (!savedStart || savedStart.getUTCDay() !== 1) {
      return data;
    }
    var monday = currentMonday(data.source_timezone || "America/New_York", now);
    var shift = parseDate(monday).getTime() - savedStart.getTime();
    if (shift <= 0) {
      return data;
    }

    // Shift calendar dates, keeping local clock times unchanged across DST.
    var unavailable = Array.isArray(data.unavailable) ? data.unavailable : [];
    return Object.assign({}, data, {
      week_start: monday,
      unavailable: unavailable.map(function (block) {
        var date = block && parseDate(block.date);
        if (!date) {
          return block;
        }
        return Object.assign({}, block, {
          date: new Date(date.getTime() + shift).toISOString().slice(0, 10)
        });
      })
    });
  }

  function updateCard() {
    var element = document.getElementById("author-booking-data");
    var card = document.querySelector(".author-booking-card");
    if (!element || !card) {
      return;
    }
    var data = normalize(JSON.parse(element.textContent));
    var start = parseDate(data.week_start);
    if (!start) {
      return;
    }
    var end = new Date(start.getTime() + 6 * dayMilliseconds);
    var acrossYears = start.getUTCFullYear() !== end.getUTCFullYear();
    var startOptions = { timeZone: "UTC", month: "short", day: "numeric" };
    var endOptions = { timeZone: "UTC", day: "numeric" };
    if (start.getUTCMonth() !== end.getUTCMonth() || acrossYears) {
      endOptions.month = "short";
    }
    if (acrossYears) {
      startOptions.year = "numeric";
      endOptions.year = "numeric";
    }
    var range = new Intl.DateTimeFormat("en-US", startOptions).format(start) + "–" +
      new Intl.DateTimeFormat("en-US", endOptions).format(end);
    var isCurrentWeek = data.week_start === currentMonday(data.source_timezone || "America/New_York");
    card.querySelector(".author-booking-card__label").textContent = isCurrentWeek ? "This week" : "Week of";
    card.querySelector(".author-booking-card__dates").textContent = range;
    card.setAttribute("aria-label", "Book a meeting: " + range);
  }

  root.MeetingSchedule = { normalize: normalize };
  if (typeof document !== "undefined") {
    updateCard();
  }
})(typeof window !== "undefined" ? window : globalThis);
