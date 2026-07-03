(function () {
  "use strict";

  var current = 0;
  var answers = {};
  var items = [];

  function render() {
    var it = items[current];
    document.getElementById("quizProgressBar").style.width =
      Math.round((current / items.length) * 100) + "%";
    document.getElementById("quizStep").textContent =
      "質問 " + (current + 1) + " / " + items.length;
    document.getElementById("quizText").textContent = it.text;

    document.getElementById("quizOptions").innerHTML = UFC.LIKERT_LABELS
      .map(function (label, i) {
        var value = i + 1;
        var selected = answers[it.id] === value ? "selected" : "";
        return (
          '<div class="quiz-option ' + selected + '" data-value="' + value + '">' +
          '<span class="quiz-option-letter">' + value + "</span>" +
          label +
          "</div>"
        );
      })
      .join("");

    document.querySelectorAll(".quiz-option").forEach(function (el) {
      el.addEventListener("click", function () {
        answers[it.id] = Number(el.getAttribute("data-value"));
        render();
        setTimeout(function () {
          if (current < items.length - 1) {
            current += 1;
            render();
          } else {
            finish();
          }
        }, 180);
      });
    });

    document.getElementById("quizBack").style.visibility = current === 0 ? "hidden" : "visible";
  }

  function finish() {
    var participant = UFC.getCurrentParticipant();
    var result = UFC.scoreQuiz(answers);
    if (participant) {
      UFC.updateParticipant(participant.id, {
        missionType: result.missionType,
        subMissionType: result.subMissionType,
        borderline: result.borderline,
        scores: result.scores,
      });
    }
    window.location.href = "result.html";
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!UFC.getCurrentParticipant()) {
      window.location.href = "start.html";
      return;
    }
    items = UFC.QUIZ_ITEMS;
    document.getElementById("quizBack").addEventListener("click", function () {
      if (current > 0) {
        current -= 1;
        render();
      }
    });
    render();
  });
})();
