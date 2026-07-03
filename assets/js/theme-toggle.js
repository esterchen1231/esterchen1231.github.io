(function() {
  "use strict";

  var storageKey = "ester-theme";

  function getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function applyTheme(theme) {
    var nextTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", nextTheme);
    document.querySelectorAll(".theme-toggle").forEach(function(button) {
      var label = nextTheme === "dark" ? "Switch to day mode" : "Switch to night mode";
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
    });
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      return;
    }
  }

  function bindThemeToggles() {
    applyTheme(getCurrentTheme());
    document.querySelectorAll(".theme-toggle").forEach(function(button) {
      button.addEventListener("click", function() {
        var nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
        saveTheme(nextTheme);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindThemeToggles);
  } else {
    bindThemeToggles();
  }
})();
