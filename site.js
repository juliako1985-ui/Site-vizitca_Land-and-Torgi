(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var navIds = ["services", "about", "process", "faq"];

  function initReveal() {
    var reveals = document.querySelectorAll(".reveal");
    if (!reveals.length) return;

    if (reducedMotion) {
      reveals.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    document.body.classList.add("reveal-pending");

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );

    reveals.forEach(function (el) {
      io.observe(el);
    });
  }

  function scrollYLine() {
    var header = document.querySelector(".site-header");
    var h = header ? header.offsetHeight : 72;
    return window.scrollY + h + 48;
  }

  function updateNavActive() {
    var y = scrollYLine();
    var activeId = "";
    for (var i = navIds.length - 1; i >= 0; i--) {
      var id = navIds[i];
      var el = document.getElementById(id);
      if (!el) continue;
      var top = el.getBoundingClientRect().top + window.scrollY;
      if (top <= y) {
        activeId = id;
        break;
      }
    }

    document.querySelectorAll(".nav__link").forEach(function (link) {
      var sec = link.getAttribute("data-nav-section");
      link.classList.toggle("nav__link--active", sec === activeId);
    });
  }

  function initNavSpy() {
    var links = document.querySelectorAll(".nav__link");
    if (!links.length) return;

    updateNavActive();

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        updateNavActive();
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }

  initReveal();
  initNavSpy();
})();
