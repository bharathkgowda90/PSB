/* Prashanth High School of Brilliance — progressive enhancement only.
   Every page is complete and usable with JavaScript disabled. */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* Opt in to the reveal animations only now that this script is definitely
     running. Until this line, every [data-reveal] block is plain visible, so a
     blocked or failed script degrades to a static page rather than a blank
     one. Skipped entirely when reduced motion is requested. */
  if (!reduced.matches && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js-reveal");
  }

  /* ------------------------------------------------------------- Menu panel

     The panel is a full sheet over the page. Opening it traps nothing, but it
     does hide the rest of the document from assistive tech and lock the
     background from scrolling, so the two layers never fight each other. */

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  var main = document.getElementById("main");
  var footer = document.querySelector(".site-footer");

  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";

      [main, footer].forEach(function (el) {
        if (!el) return;
        if (open) el.setAttribute("inert", "");
        else el.removeAttribute("inert");
      });

      if (open) {
        var first = nav.querySelector("a");
        if (first) first.focus();
      }
    };

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    // A link click navigates away; close first so the panel is not left open
    // behind a cross-document view transition.
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });
  }

  /* ---------------------------------------------------------- Scroll reveal

     Blocks mask up as they enter the viewport. Each element is unobserved once
     revealed — this never re-runs on scroll-back, and the observer does no
     work after the first pass. */

  var revealTargets = document.querySelectorAll("[data-reveal], [data-reveal-stagger]");

  if (revealTargets.length) {
    if (!("IntersectionObserver" in window) || reduced.matches) {
      revealTargets.forEach(function (el) {
        el.classList.add("is-visible");
      });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
      );

      revealTargets.forEach(function (el) {
        // Stagger the children of a group so a row of cards arrives in
        // sequence rather than all at once.
        if (el.hasAttribute("data-reveal-stagger")) {
          var step = Number(el.getAttribute("data-reveal-stagger")) || 60;
          Array.prototype.forEach.call(el.children, function (child, i) {
            child.style.transitionDelay = i * step + "ms";
          });
        }
        observer.observe(el);
      });
    }
  }

  /* --------------------------------------------------------------- Marquee

     The track is duplicated so the -50% keyframe lands exactly on a seam.
     Doing it here rather than in the markup keeps the duplicated set out of
     the accessibility tree and out of the HTML payload. */

  document.querySelectorAll(".marquee__track").forEach(function (track) {
    if (reduced.matches) {
      track.style.animation = "none";
      return;
    }
    var clone = track.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    Array.prototype.forEach.call(clone.children, function (child) {
      child.setAttribute("aria-hidden", "true");
    });
    while (clone.firstChild) track.appendChild(clone.firstChild);
  });

  /* ----------------------------------------------------------- Map facade

     The Google Maps iframe is not requested until the visitor asks for it. On
     a metered rural connection an unrequested third-party embed on every page
     view is a real cost. */

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
