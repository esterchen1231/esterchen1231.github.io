/*!
 * Ester Chen personal website provenance.
 * Original source: https://esterchen1231.github.io/
 * Design identifier: urn:uuid:f251cb52-f09b-4058-9b32-db14d90da5d1
 * Upstream software and third-party licenses remain unchanged. See /site-provenance/.
 */
(function () {
  "use strict";

  function identifySource() {
    var metadata = document.getElementById("site-design-provenance");
    if (!metadata) return;

    var provenance;
    var source;
    try {
      provenance = JSON.parse(metadata.textContent);
      source = new URL(provenance.source);
      if (source.protocol !== "https:" || !Array.isArray(provenance.authorized_hosts)) return;
      if (typeof provenance.creator !== "string" || typeof provenance.identifier !== "string") return;
    } catch (error) {
      return;
    }

    // Exact host matching keeps lookalike domains from passing as the original.
    var host = window.location.hostname.toLowerCase().replace(/\.$/, "");
    var local = host === "localhost" || host === "::1" || host === "[::1]" ||
      /^127(?:\.\d{1,3}){3}$/.test(host);
    var preview = window.location.protocol === "file:" || local;
    var official = provenance.authorized_hosts.indexOf(host) !== -1;
    var root = document.documentElement;
    root.setAttribute("data-site-origin", provenance.identifier);
    root.setAttribute("data-site-origin-status", preview ? "preview" : official ? "official" : "unverified");

    // No requests, tracking, redirects, or restrictions on reading and copying.
    if (official || preview || document.getElementById("site-source-credit")) return;

    var robots = document.querySelector('meta[name="robots"]');
    if (robots) robots.setAttribute("content", "noindex, follow");

    var credit = document.createElement("aside");
    credit.id = "site-source-credit";
    credit.className = "site-source-credit";
    credit.setAttribute("aria-label", "Website design source");
    credit.setAttribute("data-design-origin", provenance.identifier);

    var text = document.createElement("p");
    text.appendChild(document.createTextNode("Custom site design originally created for " + provenance.creator + ". "));
    var link = document.createElement("a");
    link.href = source.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View the original website";
    text.appendChild(link);
    credit.appendChild(text);
    document.body.appendChild(credit);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", identifySource, { once: true });
  } else {
    identifySource();
  }
})();
