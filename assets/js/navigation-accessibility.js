(function () {
  "use strict";

  function initialize() {
    var skipLink = document.querySelector(".skip-link");
    var mainContent = document.getElementById("main-content");

    if (skipLink && mainContent) {
      // The legacy smooth-scroll plugin prevents native anchor focus handling.
      skipLink.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        mainContent.focus({ preventScroll: true });
        mainContent.scrollIntoView({ block: "start", behavior: "instant" });
      }, true);
    }

    var navigation = document.getElementById("site-nav");
    if (!navigation) return;

    function updateOffsets() {
      var masthead = document.querySelector(".masthead");
      if (!masthead) return;
      var header = masthead.getBoundingClientRect();
      var nav = navigation.getBoundingClientRect();
      document.documentElement.style.setProperty("--site-header-offset", Math.ceil(header.height + 16) + "px");
      navigation.style.setProperty("--site-nav-dropdown-top", Math.ceil(header.bottom - nav.top + 8) + "px");
    }
    updateOffsets();
    window.addEventListener("resize", updateOffsets);
    if (window.ResizeObserver) new ResizeObserver(updateOffsets).observe(document.querySelector(".masthead"));

    var toggle = navigation.querySelector("button[aria-controls]");
    var overflow = document.getElementById(toggle && toggle.getAttribute("aria-controls"));
    if (!toggle || !overflow) return;

    function isExpanded() {
      return overflow.children.length > 0 &&
        !overflow.classList.contains("hidden") &&
        !toggle.classList.contains("hidden");
    }

    function syncState() {
      toggle.setAttribute("aria-expanded", isExpanded() ? "true" : "false");
    }

    function closeNavigation(restoreFocus) {
      if (!isExpanded()) return;
      overflow.classList.add("hidden");
      toggle.classList.remove("close");
      syncState();
      if (restoreFocus) toggle.focus({ preventScroll: true });
    }

    // Let the bundled greedy navigation continue to own link layout and toggling.
    toggle.addEventListener("click", syncState);
    navigation.addEventListener("keydown", function (event) {
      if (event.key !== "Escape" || !isExpanded()) return;
      event.preventDefault();
      event.stopPropagation();
      closeNavigation(true);
    });

    document.addEventListener("click", function (event) {
      if (!navigation.contains(event.target)) {
        closeNavigation(overflow.contains(document.activeElement));
      }
    });
    document.addEventListener("focusin", function (event) {
      if (!navigation.contains(event.target)) closeNavigation(false);
    });

    // Resizing can move links and hide the toggle without a button click.
    new MutationObserver(syncState).observe(navigation, {
      attributes: true,
      attributeFilter: ["class"],
      childList: true,
      subtree: true
    });
    syncState();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize);
  else initialize();
}());
