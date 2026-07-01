/* ==========================================================================
   UNITE Friend Challenge — shared chrome (top bar / bottom tab bar / SW)
   ========================================================================== */
(function (global) {
  "use strict";

  var ICONS = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/></svg>',
    quiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4.5"/><circle cx="12" cy="17.5" r=".6" fill="currentColor" stroke="none"/></svg>',
    challenge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 10h8M8 14h5"/></svg>',
    resources: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h9l5 5v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M14 4v5h5"/></svg>',
    group: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M3.5 19c.5-3.5 3-5.5 5.5-5.5s5 2 5.5 5.5"/><path d="M14.5 15c2 .2 3.7 1.7 4 4"/></svg>',
  };

  var TABS = [
    { href: "index.html", key: "home", label: "ホーム" },
    { href: "quiz.html", key: "quiz", label: "診断" },
    { href: "challenge.html", key: "challenge", label: "チャレンジ" },
    { href: "resources.html", key: "resources", label: "教材" },
    { href: "group.html", key: "group", label: "グループ" },
  ];

  function currentFile() {
    var path = global.location.pathname;
    var file = path.substring(path.lastIndexOf("/") + 1);
    return file === "" ? "index.html" : file;
  }

  function renderTabbar(activeFile) {
    var active = activeFile || currentFile();
    var html = TABS.map(function (t) {
      var isActive = t.href === active;
      return (
        '<a href="' + t.href + '" class="' + (isActive ? "active" : "") + '">' +
        ICONS[t.key] +
        "<span>" + t.label + "</span></a>"
      );
    }).join("");
    return '<nav class="tabbar">' + html + "</nav>";
  }

  function mountTabbar(activeFile) {
    var el = document.getElementById("ufc-tabbar");
    if (el) el.outerHTML = renderTabbar(activeFile);
  }

  function registerSW() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        var base = global.location.pathname.indexOf("/admin/") !== -1 ? "../" : "./";
        navigator.serviceWorker.register(base + "sw.js").catch(function () {});
      });
    }
  }

  global.UFC = global.UFC || {};
  global.UFC.Nav = { mountTabbar: mountTabbar, registerSW: registerSW };

  document.addEventListener("DOMContentLoaded", function () {
    mountTabbar();
    registerSW();
  });
})(window);
