(function () {
  "use strict";

  function overallProgress(participant) {
    var total = 0, done = 0;
    UFC.CHALLENGE_WEEKS.forEach(function (w) {
      var arr = participant.challengeProgress["week" + w.week] || [];
      total += w.checklist.length;
      done += arr.filter(Boolean).length;
    });
    return total ? Math.round((done / total) * 100) : 0;
  }

  function weekProgress(participant, week) {
    var arr = participant.challengeProgress["week" + week.week] || [];
    var done = arr.filter(Boolean).length;
    return { done: done, total: week.checklist.length, complete: done === week.checklist.length };
  }

  function renderPrayerList(participant) {
    var names = (participant.friends || []).filter(Boolean);
    var el = document.getElementById("prayerList");
    if (!names.length) {
      el.innerHTML = '<p class="small muted">登録時に友達の名前を入力していません。マイページ情報は今のところ編集できません。</p>';
      return;
    }
    el.innerHTML =
      "<ol style=\"padding-left:20px; margin:0;\">" +
      names.map(function (n) { return "<li style=\"margin-bottom:6px; font-weight:700;\">" + n + "</li>"; }).join("") +
      "</ol>";
  }

  function renderWeeks(participant, openWeek) {
    var wrap = document.getElementById("weekList");
    wrap.innerHTML = UFC.CHALLENGE_WEEKS.map(function (w) {
      var p = weekProgress(participant, w);
      var progressArr = participant.challengeProgress["week" + w.week] || [];
      var isOpen = w.week === openWeek;
      var checklistHTML = w.checklist
        .map(function (item, i) {
          var checked = progressArr[i] ? "checked" : "";
          var doneClass = progressArr[i] ? "done" : "";
          return (
            '<label class="checklist-item ' + doneClass + '">' +
            '<input type="checkbox" data-week="' + w.week + '" data-idx="' + i + '" ' + checked + '/>' +
            "<span>" + item + "</span>" +
            "</label>"
          );
        })
        .join("");

      return (
        '<div class="card week-card ' + (p.complete ? "complete" : "") + " " + (isOpen ? "open" : "") + '" data-week="' + w.week + '">' +
        '<div class="week-head">' +
        '<div class="week-head-left">' +
        '<div class="week-num">' + (p.complete ? "✓" : w.week) + "</div>" +
        "<div>" +
        '<div class="week-title">Week ' + w.week + " ・ " + w.title + "</div>" +
        '<div class="week-sub">' + p.done + " / " + p.total + " 完了</div>" +
        "</div>" +
        "</div>" +
        '<svg class="week-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>' +
        "</div>" +
        '<div class="week-body">' +
        '<p class="small" style="margin-bottom:14px;">' + w.summary + "</p>" +
        checklistHTML +
        '<p class="small" style="margin-top:14px; font-weight:700;">' + w.encouragement + "</p>" +
        (w.week === 4 ? '<a href="testimony.html" class="btn btn-ghost btn-sm" style="margin-top:12px;">自分のストーリーを書いてみる →</a>' : "") +
        (w.week === 6 ? '<a href="https://unitejp.org/" target="_blank" rel="noopener" class="btn btn-ghost btn-sm" style="margin-top:12px;">UNITE公式サイトで開催情報を見る →</a>' : "") +
        "</div>" +
        "</div>"
      );
    }).join("");

    wrap.querySelectorAll(".week-head").forEach(function (head) {
      head.addEventListener("click", function () {
        head.parentElement.classList.toggle("open");
      });
    });

    wrap.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
      cb.addEventListener("click", function (e) {
        e.stopPropagation();
        var week = cb.getAttribute("data-week");
        var idx = Number(cb.getAttribute("data-idx"));
        var p = UFC.getCurrentParticipant();
        var arr = p.challengeProgress["week" + week] || [];
        arr[idx] = cb.checked;
        p.challengeProgress["week" + week] = arr;
        UFC.updateParticipant(p.id, { challengeProgress: p.challengeProgress });
        refresh(false);
      });
    });
  }

  function refresh(reopen) {
    var participant = UFC.getCurrentParticipant();
    var pct = overallProgress(participant);
    document.getElementById("overallProgressFill").style.width = pct + "%";
    document.getElementById("overallProgressLabel").textContent = pct + "%";
    var celebrateBox = document.getElementById("celebrateBox");
    if (celebrateBox) celebrateBox.style.display = pct === 100 ? "block" : "none";
    var openWeek = reopen === false ? getOpenWeek() : UFC.currentActiveWeek(participant).week;
    renderWeeks(participant, openWeek);
  }

  function getOpenWeek() {
    var openCard = document.querySelector(".week-card.open");
    return openCard ? Number(openCard.getAttribute("data-week")) : null;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var participant = UFC.getCurrentParticipant();
    if (!participant) {
      window.location.href = "start.html";
      return;
    }
    document.getElementById("nickname").textContent = participant.nickname || participant.name;
    if (participant.missionType) {
      var type = UFC.MISSION_TYPES[participant.missionType];
      document.getElementById("typeBadge").textContent = type.key + "（" + type.nameJa + "）";
      document.getElementById("typeBadge").style.display = "inline-block";
    }
    renderPrayerList(participant);
    refresh(true);
  });
})();
