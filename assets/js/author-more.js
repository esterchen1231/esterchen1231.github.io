(function() {
  "use strict";

  function initialize() {
    var disclosures = document.querySelectorAll(".author-more");

    function closeOutside(target) {
      disclosures.forEach(function(disclosure) {
        if (disclosure.open && !disclosure.contains(target)) disclosure.open = false;
      });
    }

    disclosures.forEach(function(disclosure) {
      disclosure.addEventListener("toggle", function() {
        if (disclosure.open) closeOutside(disclosure);
      });
    });

    document.addEventListener("click", function(event) {
      closeOutside(event.target);
    });

    document.addEventListener("focusin", function(event) {
      closeOutside(event.target);
    });

    document.addEventListener("keydown", function(event) {
      if (event.key !== "Escape") return;
      disclosures.forEach(function(disclosure) {
        if (!disclosure.open) return;
        event.preventDefault();
        disclosure.open = false;
        if (disclosure.contains(document.activeElement)) {
          disclosure.querySelector("summary").focus({ preventScroll: true });
        }
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize);
  else initialize();
})();
