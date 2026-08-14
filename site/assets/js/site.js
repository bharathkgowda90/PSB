/* Prashanth High School of Brilliance - progressive enhancement only.
   Every page works with JavaScript disabled. */

(function () {
  "use strict";

  /* ---------------------------------------------------------- Mobile nav */

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");

  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    };

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Escape closes the menu and returns focus to the button, so keyboard
    // users are never stranded inside an open menu.
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    // Reset state when the layout crosses into the desktop breakpoint,
    // otherwise the menu can be left hidden by a stale class.
    var desktop = window.matchMedia("(min-width: 62rem)");
    var sync = function () {
      if (desktop.matches) {
        setOpen(false);
      }
    };
    if (desktop.addEventListener) {
      desktop.addEventListener("change", sync);
    }
  }

  /* --------------------------------------------------------- Map facade

     The Google Maps iframe is not loaded until the visitor asks for it.
     On a metered rural connection an unrequested third-party embed on
     every page view is a real cost. */

  document.querySelectorAll(".map-facade").forEach(function (button) {
    button.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      iframe.className = "map-embed";
      iframe.src = button.getAttribute("data-map-src");
      iframe.title = button.getAttribute("data-map-title") || "Map";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.allowFullscreen = true;
      button.replaceWith(iframe);
    });
  });
})();
