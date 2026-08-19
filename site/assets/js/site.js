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
    var toggleLabel = toggle.querySelector(".visually-hidden");

    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      // The header has to sit above the sheet and stay pinned while it is open;
      // CSS keys off this class rather than off the panel, which is a sibling.
      document.body.classList.toggle("nav-open", open);
      document.body.style.overflow = open ? "hidden" : "";
      // The same button closes the panel, so its name has to say so.
      if (toggleLabel) toggleLabel.textContent = open ? "Close menu" : "Menu";

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

  /* Everything below is per-content: it must be able to run again whenever the
     document's main content is replaced. Each block marks what it has already
     wired so a second call is harmless. */
  function initContent(scope) {
    scope = scope || document;

    /* ---------------------------------------------------------- Scroll reveal

       Blocks mask up as they enter the viewport. Each element is unobserved once
       revealed — this never re-runs on scroll-back, and the observer does no
       work after the first pass. */

    var revealTargets = scope.querySelectorAll("[data-reveal], [data-reveal-stagger]");

    if (revealTargets.length) {
      if (!("IntersectionObserver" in window) || reduced.matches) {
        revealTargets.forEach(function (el) {
          if (el.dataset.revealWired) return;
          el.dataset.revealWired = "1";
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
          if (el.dataset.revealWired) return;
          el.dataset.revealWired = "1";
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

    scope.querySelectorAll(".marquee__track").forEach(function (track) {
      if (track.dataset.marqueeWired) return;
      track.dataset.marqueeWired = "1";
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

    /* --------------------------------------------------- Testimonial carousel

       Enhancement only: without this script every quote is stacked and readable.
       The script hides all but one, then steps through them. It wraps in both
       directions, so the arrows never dead-end. */

    scope.querySelectorAll("[data-carousel]").forEach(function (root) {
      if (root.dataset.carouselWired) return;
      root.dataset.carouselWired = "1";
      var slides = Array.prototype.slice.call(root.querySelectorAll(".testimonial__slide"));
      if (slides.length < 2) return;

      var prev = root.querySelector("[data-carousel-prev]");
      var next = root.querySelector("[data-carousel-next]");
      var fill = root.querySelector(".testimonial__progress span");
      var status = root.querySelector("[data-carousel-status]");
      var index = 0;

      document.documentElement.classList.add("js-carousel");

      var viewport = root.querySelector(".testimonial__viewport");

      /* Reserve the height of the tallest quote so stepping never jumps the page,
         and never leaves dead space either. Guessing a fixed min-height in CSS
         does one or the other depending on the copy. */
      function fitHeight() {
        if (!viewport) return;
        viewport.style.minHeight = "";
        var tallest = 0;
        slides.forEach(function (s) {
          var wasHidden = s.hasAttribute("hidden");
          if (wasHidden) s.removeAttribute("hidden");
          tallest = Math.max(tallest, s.getBoundingClientRect().height);
          if (wasHidden) s.setAttribute("hidden", "");
        });
        // box-sizing is border-box, so min-height must include the viewport's own
        // vertical padding or it floors below the real content height.
        var cs = getComputedStyle(viewport);
        var pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
        viewport.style.minHeight = Math.ceil(tallest + pad) + "px";
      }

      var resizeTimer;
      window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(fitHeight, 150);
      });

      function show(i) {
        index = (i + slides.length) % slides.length;
        slides.forEach(function (s, n) {
          if (n === index) s.removeAttribute("hidden");
          else s.setAttribute("hidden", "");
        });
        if (fill) fill.style.width = ((index + 1) / slides.length) * 100 + "%";
        // Announced rather than shown, so screen-reader users know where they are.
        if (status) status.textContent = "Testimonial " + (index + 1) + " of " + slides.length;
      }

      if (prev)
        prev.addEventListener("click", function () {
          show(index - 1);
        });
      if (next)
        next.addEventListener("click", function () {
          show(index + 1);
        });

      // Left/right arrows step the carousel when focus is inside it.
      root.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft") {
          show(index - 1);
        } else if (event.key === "ArrowRight") {
          show(index + 1);
        } else return;
        event.preventDefault();
      });

      show(0);
      fitHeight();
      // Images arrive after first paint and change the measurement.
      window.addEventListener("load", fitHeight);
    });

    /* ---------------------------------------------------------------- Rail

       A horizontally scrolled row of cards. The scrolling itself is native, so
       the row is swipeable and keyboard-scrollable with this script blocked;
       all the script adds is a pair of arrows, which stay hidden in CSS until
       it runs. */

    scope.querySelectorAll("[data-rail]").forEach(function (root) {
      if (root.dataset.railWired) return;
      root.dataset.railWired = "1";

      var viewport = root.querySelector(".rail__viewport");
      var track = root.querySelector(".rail__track");
      if (!viewport || !track || track.children.length < 2) return;

      var prev = root.querySelector("[data-rail-prev]");
      var next = root.querySelector("[data-rail-next]");

      document.documentElement.classList.add("js-rail");

      // Measured rather than assumed: the card width is a percentage of the
      // viewport and changes at every breakpoint.
      function step() {
        var first = track.children[0];
        var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return first.getBoundingClientRect().width + gap;
      }

      function sync() {
        var max = viewport.scrollWidth - viewport.clientWidth;
        // Sub-pixel scroll positions mean an exact comparison never fires at
        // the ends, so both edges get a pixel of tolerance.
        if (prev) prev.disabled = viewport.scrollLeft <= 1;
        if (next) next.disabled = viewport.scrollLeft >= max - 1;
      }

      function go(direction) {
        viewport.scrollBy({
          left: direction * step(),
          behavior: reduced.matches ? "auto" : "smooth",
        });
      }

      if (prev)
        prev.addEventListener("click", function () {
          go(-1);
        });
      if (next)
        next.addEventListener("click", function () {
          go(1);
        });

      viewport.addEventListener("scroll", sync, { passive: true });
      window.addEventListener("resize", sync);
      sync();
    });

    /* ----------------------------------------------------------- Map facade

       The Google Maps iframe is not requested until the visitor asks for it. On
       a metered rural connection an unrequested third-party embed on every page
       view is a real cost. */

    scope.querySelectorAll(".map-facade").forEach(function (button) {
      if (button.dataset.mapWired) return;
      button.dataset.mapWired = "1";
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
  }

  window.PSBSite = { initContent: initContent };
  initContent(document);
})();
