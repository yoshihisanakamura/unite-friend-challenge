(function () {
  "use strict";

  var ACCENT_BG = {
    orange: "var(--orange-soft)",
    blue: "var(--blue-soft)",
    green: "var(--green-soft)",
    pink: "var(--pink-soft)",
    purple: "var(--purple-soft)",
    navy: "var(--navy-soft)",
  };

  document.addEventListener("DOMContentLoaded", function () {
    var participant = UFC.getCurrentParticipant();
    if (!participant || !participant.missionType) {
      window.location.href = "start.html";
      return;
    }

    var type = UFC.MISSION_TYPES[participant.missionType];
    var sub = participant.subMissionType ? UFC.MISSION_TYPES[participant.subMissionType] : null;

    document.getElementById("charFrame").style.background = ACCENT_BG[type.accent];
    document.getElementById("charFrame").innerHTML = UFC.Characters.render(type.key);

    document.getElementById("typeLabel").textContent =
      sub ? type.key + " 寄りの " + sub.key : type.key;
    document.getElementById("typeJp").textContent = type.nameJa + (sub ? "（" + sub.nameJa + "の要素も少し）" : "");
    document.getElementById("typeCatch").textContent = type.catch;
    document.getElementById("typeDesc").textContent = type.description;

    document.getElementById("strengthList").innerHTML = type.strengths
      .map(function (s) { return "<li>" + s + "</li>"; })
      .join("");
    document.getElementById("cautionList").innerHTML = type.cautions
      .map(function (c) { return "<li>" + c + "</li>"; })
      .join("");
    document.getElementById("bibleFigure").textContent = type.bibleFigure;
    document.getElementById("bibleFigureDesc").textContent = type.bibleFigureDesc;
    document.getElementById("weeklyChallenge").textContent = type.weeklyChallenge;
    document.getElementById("verseText").textContent = "「" + type.verseText + "」";
    document.getElementById("verseRef").textContent = type.verseRef;
  });
})();
