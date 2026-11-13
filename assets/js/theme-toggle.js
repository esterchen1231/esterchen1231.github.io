(function() {
  "use strict";

  var storageKey = "ester-theme";
  var themes = ["light", "dark", "matcha", "paper", "dusk"];
  var names = ["Day", "Night", "Matcha", "Paper", "Dusk"];
  var systemTheme = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  var hasPreference = false;

  function isTheme(theme) {
    return themes.indexOf(theme) !== -1;
  }

  function getDefaultTheme() {
    return systemTheme && systemTheme.matches ? "dark" : "light";
  }

  function getCurrentTheme() {
    var theme = document.documentElement.getAttribute("data-theme");
    return isTheme(theme) ? theme : getDefaultTheme();
  }

  function applyTheme(theme) {
    var nextTheme = isTheme(theme) ? theme : getDefaultTheme();
    var index = themes.indexOf(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);

    document.querySelectorAll(".theme-picker").forEach(function(picker) {
      var track = picker.querySelector(".theme-picker__track");
      var name = picker.querySelector(".theme-picker__name");
      if (track) track.style.setProperty("--theme-index", index);
      if (name) name.textContent = names[index];

      picker.querySelectorAll("[data-theme-option]").forEach(function(button) {
        var selected = button.getAttribute("data-theme-option") === nextTheme;
        button.setAttribute("aria-checked", selected ? "true" : "false");
        button.setAttribute("tabindex", selected ? "0" : "-1");
      });
    });

    var themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      var background = window.getComputedStyle(document.documentElement).getPropertyValue("--site-bg").trim();
      if (background) themeColor.setAttribute("content", background);
    }
  }

  function saveTheme(theme) {
    hasPreference = true;
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      // The selection still works for this page when storage is blocked.
    }
  }

  function selectTheme(theme) {
    if (!isTheme(theme)) return;
    applyTheme(theme);
    saveTheme(theme);
  }

  function bindPicker(picker) {
    var track = picker.querySelector(".theme-picker__track");
    if (!track) return;
    var gesture = null;
    var suppressClick = false;

    track.addEventListener("click", function(event) {
      if (suppressClick && event.detail !== 0) {
        suppressClick = false;
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      var button = event.target.closest("[data-theme-option]");
      if (button && track.contains(button)) selectTheme(button.getAttribute("data-theme-option"));
    }, true);

    track.addEventListener("keydown", function(event) {
      var button = event.target.closest("[data-theme-option]");
      if (!button || !track.contains(button)) return;
      var index = themes.indexOf(button.getAttribute("data-theme-option"));
      if (event.key === "ArrowRight" || event.key === "ArrowDown") index = (index + 1) % themes.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") index = (index + themes.length - 1) % themes.length;
      else if (event.key === "Home") index = 0;
      else if (event.key === "End") index = themes.length - 1;
      else return;

      event.preventDefault();
      selectTheme(themes[index]);
      track.querySelector('[data-theme-option="' + themes[index] + '"]').focus({ preventScroll: true });
    });

    function finishGesture(event, cancelled) {
      if (!gesture || event.pointerId !== gesture.pointerId) return;
      var finished = gesture;
      gesture = null;
      window.removeEventListener("pointermove", moveGesture);
      window.removeEventListener("pointerup", endGesture);
      window.removeEventListener("pointercancel", cancelGesture);
      track.classList.remove("is-dragging");

      if (track.hasPointerCapture && track.hasPointerCapture(finished.pointerId)) {
        track.releasePointerCapture(finished.pointerId);
      }
      if (!finished.dragging) return;

      suppressClick = true;
      if (cancelled) {
        applyTheme(finished.originalTheme);
      } else {
        selectTheme(themes[finished.index]);
        track.querySelector('[data-theme-option="' + themes[finished.index] + '"]').focus({ preventScroll: true });
      }
    }

    function moveGesture(event) {
      if (!gesture || event.pointerId !== gesture.pointerId) return;
      var deltaX = event.clientX - gesture.startX;
      var deltaY = event.clientY - gesture.startY;

      if (!gesture.dragging) {
        if (Math.abs(deltaY) > 8 && Math.abs(deltaY) >= Math.abs(deltaX)) {
          finishGesture(event, true);
          return;
        }
        if (Math.abs(deltaX) < 8 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
        gesture.dragging = true;
        track.classList.add("is-dragging");
        if (track.setPointerCapture) track.setPointerCapture(gesture.pointerId);
      }

      event.preventDefault();
      // Anchor movement to the pressed option, so starting near its edge does not skip an option.
      var nextIndex = Math.max(0, Math.min(themes.length - 1, gesture.startIndex + Math.round(deltaX / gesture.step)));
      if (gesture.index !== nextIndex) {
        gesture.index = nextIndex;
        applyTheme(themes[nextIndex]);
      }
    }

    function endGesture(event) {
      finishGesture(event, false);
    }

    function cancelGesture(event) {
      finishGesture(event, true);
    }

    track.addEventListener("pointerdown", function(event) {
      if (gesture || event.isPrimary === false || (event.pointerType === "mouse" && event.button !== 0)) return;
      suppressClick = false;
      var button = event.target.closest("[data-theme-option]");
      var originalTheme = getCurrentTheme();
      var index = button && track.contains(button) ? themes.indexOf(button.getAttribute("data-theme-option")) : themes.indexOf(originalTheme);
      if (index === -1) return;

      gesture = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startIndex: index,
        index: themes.indexOf(originalTheme),
        originalTheme: originalTheme,
        step: track.getBoundingClientRect().width / themes.length,
        dragging: false
      };
      window.addEventListener("pointermove", moveGesture, { passive: false });
      window.addEventListener("pointerup", endGesture);
      window.addEventListener("pointercancel", cancelGesture);
    });
  }

  function initialize() {
    try {
      hasPreference = isTheme(localStorage.getItem(storageKey));
    } catch (error) {
      hasPreference = false;
    }
    applyTheme(getCurrentTheme());
    document.querySelectorAll(".theme-picker").forEach(bindPicker);

    function followSystemTheme() {
      if (!hasPreference) applyTheme(getDefaultTheme());
    }
    if (systemTheme && systemTheme.addEventListener) systemTheme.addEventListener("change", followSystemTheme);
    else if (systemTheme && systemTheme.addListener) systemTheme.addListener(followSystemTheme);

    window.addEventListener("storage", function(event) {
      if (event.key !== storageKey && event.key !== null) return;
      hasPreference = isTheme(event.newValue);
      applyTheme(hasPreference ? event.newValue : getDefaultTheme());
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize);
  else initialize();
})();
