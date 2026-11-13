(function () {
  "use strict";

  var gallery = document.querySelector("[data-beyond-work]");
  if (!gallery) return;

  var rows = gallery.querySelector(".beyond-work__rows");
  var button = gallery.querySelector(".beyond-work__pause");
  var originals = Array.prototype.slice.call(gallery.querySelectorAll(".beyond-work__photo"));
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var paused = false;
  var preloadEnabled = false;
  var resizeFrame;
  var lastWidth = 0;

  function preloadPhotos() {
    Array.prototype.forEach.call(gallery.querySelectorAll("img"), function (image) {
      image.loading = "eager";
    });
  }

  function decorativeCopy(element) {
    var copy = element.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    Array.prototype.forEach.call(copy.querySelectorAll("img"), function (image) {
      image.alt = "";
    });
    return copy;
  }

  function makeRow(items, index, animate) {
    if (!items.length) return;

    var row = document.createElement("div");
    row.className = "beyond-work__row";
    row.setAttribute("role", "region");
    row.setAttribute("tabindex", animate ? "-1" : "0");
    row.setAttribute("aria-label", "Personal photos, row " + (index + 1) + (animate ? "" : "; scroll horizontally to see more"));

    var track = document.createElement("div");
    track.className = "beyond-work__track";
    var group = document.createElement("ul");
    group.className = "beyond-work__group";
    group.setAttribute("role", "list");

    items.forEach(function (item) { group.appendChild(item); });
    track.appendChild(group);
    row.appendChild(track);
    rows.appendChild(row);

    if (!animate || row.clientWidth === 0) return;

    // Fill at least one viewport before duplicating the entire group. This keeps
    // even a one-photo gallery seamless on wide screens, without announcing repeats.
    var itemIndex = 0;
    while (group.getBoundingClientRect().width < row.clientWidth) {
      group.appendChild(decorativeCopy(items[itemIndex % items.length]));
      itemIndex += 1;
    }
    var distance = group.getBoundingClientRect().width;
    track.style.setProperty("--photo-distance", distance + "px");
    track.style.setProperty("--photo-duration", (distance / 18) + "s");
    track.appendChild(decorativeCopy(group));
  }

  function rebuild() {
    var animate = !motion.matches;
    gallery.classList.remove("is-animated");
    while (rows.firstChild) rows.removeChild(rows.firstChild);

    // Keep short galleries compact and distribute larger collections evenly
    // across two rows. CSS reverses the second row's direction.
    var rowCount = Math.min(2, Math.max(1, Math.floor(originals.length / 3)));
    var offset = 0;
    for (var index = 0; index < rowCount; index += 1) {
      var rowSize = Math.ceil((originals.length - offset) / (rowCount - index));
      makeRow(originals.slice(offset, offset + rowSize), index, animate);
      offset += rowSize;
    }
    if (preloadEnabled) preloadPhotos();

    gallery.classList.toggle("is-animated", animate);
    gallery.classList.toggle("is-paused", paused);
    button.hidden = !animate;
    button.textContent = paused ? "Resume photos" : "Pause photos";
    lastWidth = gallery.clientWidth;
  }

  button.addEventListener("click", function () {
    paused = !paused;
    gallery.classList.toggle("is-paused", paused);
    button.textContent = paused ? "Resume photos" : "Pause photos";
  });

  function setupPhotoDialog() {
    var viewAll = gallery.querySelector(".beyond-work__view-all");
    var dialog = document.getElementById("beyond-work-dialog");
    if (!viewAll || !dialog || typeof dialog.showModal !== "function") return;

    var grid = dialog.querySelector(".beyond-work__grid");
    var closeButton = dialog.querySelector(".beyond-work__close");
    var hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    var hoverTimer;
    var lastClosedAt = 0;
    var populated = false;
    var scrollPosition;

    function cancelHover() {
      window.clearTimeout(hoverTimer);
    }

    function openDialog() {
      cancelHover();
      if (dialog.open) return;

      // Use each original once, never the decorative repeats from the moving rows.
      if (!populated) {
        originals.forEach(function (item) {
          var copy = item.cloneNode(true);
          copy.querySelector("img").loading = "eager";
          grid.appendChild(copy);
        });
        populated = true;
      }

      scrollPosition = { left: window.scrollX, top: window.scrollY };
      gallery.classList.add("is-dialog-open");
      document.documentElement.classList.add("has-photo-dialog");
      viewAll.setAttribute("aria-expanded", "true");
      dialog.showModal();
    }

    viewAll.hidden = false;
    viewAll.setAttribute("aria-expanded", "false");
    viewAll.addEventListener("click", openDialog);
    viewAll.addEventListener("pointerenter", function (event) {
      if (!hover.matches || event.pointerType !== "mouse" || Date.now() - lastClosedAt < 500) return;
      // A short dwell avoids opening the window while the pointer passes by.
      hoverTimer = window.setTimeout(openDialog, 350);
    });
    viewAll.addEventListener("pointerleave", function () {
      cancelHover();
    });
    viewAll.addEventListener("blur", cancelHover);

    closeButton.addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (event) {
      if (event.target !== dialog) return;
      var bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener("close", function () {
      cancelHover();
      // Closing with Escape must not reopen the window beneath a stationary pointer.
      lastClosedAt = Date.now();
      document.documentElement.classList.remove("has-photo-dialog");
      gallery.classList.remove("is-dialog-open");
      viewAll.setAttribute("aria-expanded", "false");
      viewAll.focus({ preventScroll: true });
      if (scrollPosition) window.scrollTo({ left: scrollPosition.left, top: scrollPosition.top, behavior: "instant" });
    });
  }

  function scheduleRebuild() {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(rebuild);
  }

  // The gallery is usable before enhancement and whenever reduced motion is on.
  rebuild();
  setupPhotoDialog();

  // Transformed copies can remain outside the browser's native lazy-load area.
  // Load every photo once the gallery approaches the viewport, including repeats.
  if (window.IntersectionObserver) {
    var photoObserver = new IntersectionObserver(function (entries) {
      if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
      preloadEnabled = true;
      preloadPhotos();
      photoObserver.disconnect();
    }, { rootMargin: "400px 0px" });
    photoObserver.observe(gallery);
  } else {
    preloadEnabled = true;
    preloadPhotos();
  }

  if (motion.addEventListener) motion.addEventListener("change", scheduleRebuild);
  else motion.addListener(scheduleRebuild);

  if (window.ResizeObserver) {
    new ResizeObserver(function () {
      if (gallery.clientWidth !== lastWidth) scheduleRebuild();
    }).observe(gallery);
  }
  window.addEventListener("resize", scheduleRebuild);
}());
