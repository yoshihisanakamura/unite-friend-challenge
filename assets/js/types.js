(function () {
  "use strict";

  // per-type page accent (matches the one-accent-per-page system)
  var ACCENTS = { Spark: "tomato", Bridge: "yellow", Shepherd: "green", Story: "pink", Builder: "sage", Prayer: "green" };
  var SOFT = {
    Spark: "var(--orange-soft)", Bridge: "#f8ecc9", Shepherd: "var(--green-soft)",
    Story: "var(--pink-soft)", Builder: "#e2e9df", Prayer: "var(--navy-soft)",
  };

  document.addEventListener("DOMContentLoaded", function () {
    var key = new URLSearchParams(location.search).get("t");
    if (!UFC.MISSION_TYPES[key]) key = "Spark";
    var type = UFC.MISSION_TYPES[key];

    document.title = key + "（" + type.nameJa + "）| UNITE Friend Challenge";
    document.body.setAttribute("data-accent", ACCENTS[key] || "yellow");

    var frame = document.getElementById("charFrame");
    frame.style.background = SOFT[key];
    frame.innerHTML = UFC.Characters.render(key);

    document.getElementById("typeLabel").textContent = key;
    document.getElementById("typeJp").textContent = type.nameJa + " — " + type.role;
    document.getElementById("typeCatch").textContent = type.catch.replace(/^あなたは、/, "");
    document.getElementById("typeDesc").textContent = type.description;
    document.getElementById("strengthList").innerHTML = type.strengths.map(function (s) { return "<li>" + s + "</li>"; }).join("");
    document.getElementById("cautionList").innerHTML = type.cautions.map(function (c) { return "<li>" + c + "</li>"; }).join("");
    document.getElementById("bibleFigure").textContent = type.bibleFigure;
    document.getElementById("bibleFigureDesc").textContent = type.bibleFigureDesc;
    document.getElementById("weeklyChallenge").textContent = type.weeklyChallenge;
    document.getElementById("verseText").textContent = "「" + type.verseText + "」";
    document.getElementById("verseRef").textContent = type.verseRef;

    document.getElementById("otherTypes").innerHTML = UFC.TYPE_ORDER
      .filter(function (t) { return t !== key; })
      .map(function (t) {
        var ty = UFC.MISSION_TYPES[t];
        return (
          '<a class="window" href="types.html?t=' + t + '">' +
          '<div class="window-pane">' + UFC.Characters.render(t) +
          '<span class="window-name">' + t + "</span>" +
          '<span class="window-sub">' + ty.nameJa + "</span></div></a>"
        );
      }).join("");
  });
})();
