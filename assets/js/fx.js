/* ==========================================================================
   UNITE Friend Challenge — playful micro-interactions
   Scroll reveal / confetti bursts / checklist pops. No markup changes
   needed: elements are tagged automatically on load.
   ========================================================================== */
(function (global) {
  "use strict";

  var COLORS = ["#e8552f", "#f0b53c", "#2f6b4f", "#ef9ebc", "#8fa98a", "#fffdf6"];
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- confetti ---------- */
  function burst(x, y, count) {
    if (reduceMotion) return;
    count = count || 22;
    for (var i = 0; i < count; i++) {
      var piece = document.createElement("span");
      piece.className = "fx-confetti";
      piece.style.left = x + "px";
      piece.style.top = y + "px";
      piece.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
      document.body.appendChild(piece);

      var angle = Math.random() * Math.PI * 2;
      var velocity = 60 + Math.random() * 130;
      var dx = Math.cos(angle) * velocity;
      var dy = Math.sin(angle) * velocity - 90;
      var rot = (Math.random() - 0.5) * 720;
      var duration = 700 + Math.random() * 600;

      piece.animate(
        [
          { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
          { transform: "translate(" + dx + "px," + (dy + 160) + "px) rotate(" + rot + "deg)", opacity: 0 },
        ],
        { duration: duration, easing: "cubic-bezier(.2,.7,.4,1)" }
      ).onfinish = (function (el) {
        return function () { el.remove(); };
      })(piece);
    }
  }

  function burstAt(el, count) {
    var r = el.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, count);
  }

  /* ---------- scroll reveal ---------- */
  function setupReveal() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    var targets = document.querySelectorAll(
      "main .card, main .notice-box, main .verse-box, main h2"
    );
    if (!targets.length) return;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("fx-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    targets.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9) return; // already visible: skip
      el.classList.add("fx-hidden");
      observer.observe(el);
    });
  }

  /* ---------- checklist pop (challenge page) ---------- */
  function setupChecklistPop() {
    document.addEventListener("change", function (e) {
      var t = e.target;
      if (t.matches && t.matches('.checklist-item input[type="checkbox"]') && t.checked) {
        burstAt(t, 10);
      }
    });
  }

  /* ---------- page-specific bursts ---------- */
  function pageBursts() {
    // result page: celebrate the reveal
    var typeLabel = document.getElementById("typeLabel");
    if (typeLabel) {
      setTimeout(function () {
        var charWrap = document.getElementById("charFrame");
        if (charWrap) burstAt(charWrap, 34);
      }, 450);
    }
    // challenge page: 100% celebration box visible → confetti
    var celebrate = document.getElementById("celebrateBox");
    if (celebrate && celebrate.style.display !== "none") {
      setTimeout(function () { burstAt(celebrate, 40); }, 400);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupReveal();
    setupChecklistPop();
    pageBursts();
  });

  global.UFC = global.UFC || {};
  global.UFC.FX = { burst: burst, burstAt: burstAt };
})(window);
