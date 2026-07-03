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

    // evidence-based display: never deterministic wording; show the
    // primary tendency, a secondary when the gap is small, and treat
    // near-ties as a genuine borderline profile.
    var borderline = participant.borderline && sub;
    document.getElementById("typeLabel").textContent =
      borderline ? type.key + " × " + sub.key : type.key;
    document.getElementById("typeJp").textContent =
      borderline ? type.nameJa + " × " + sub.nameJa : type.nameJa;
    document.getElementById("typeCatch").textContent = type.catch.replace(/^あなたは、/, "あなたには、").replace(/人です。$/, "人の傾向が強く出ています。");
    var tendency = document.getElementById("tendencyLine");
    if (tendency) {
      if (borderline) {
        tendency.textContent = "「" + type.nameJa + "」と「" + sub.nameJa + "」、両方の傾向が同じくらい強く出ています。";
      } else if (sub) {
        tendency.textContent = "「" + type.nameJa + "」の傾向が強く、「" + sub.nameJa + "」の要素も持ち合わせています。";
      } else {
        tendency.textContent = "「" + type.nameJa + "」の傾向が特に強く出ています。";
      }
    }
    document.getElementById("typeDesc").textContent = type.description;

    // 6-type continuous-score profile bars
    var barsEl = document.getElementById("profileBars");
    if (barsEl && participant.scores) {
      barsEl.innerHTML = UFC.TYPE_ORDER.map(function (t) {
        var v = participant.scores[t] || 0;
        var pct = Math.round(((v - 1) / 4) * 100);
        var isTop = t === type.key || (sub && t === sub.key);
        return (
          '<div class="bar-row">' +
          '<span class="bar-label" style="width:70px;">' + t + "</span>" +
          '<span class="bar-track"><span class="bar-fill" style="width:' + pct + '%;' + (isTop ? " background: var(--tomato);" : "") + '"></span></span>' +
          '<span class="bar-num" style="width:34px;">' + v.toFixed(1) + "</span></div>"
        );
      }).join("");
    }

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

    if (UFC.submitToGoogleForm) UFC.submitToGoogleForm(participant);
  });
})();
