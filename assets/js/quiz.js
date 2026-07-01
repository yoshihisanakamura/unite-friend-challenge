(function () {
  "use strict";

  var current = 0;
  var answers = {};
  var questions = UFC.QUIZ_QUESTIONS;

  function render() {
    var q = questions[current];
    document.getElementById("quizProgressBar").style.width =
      Math.round((current / questions.length) * 100) + "%";
    document.getElementById("quizStep").textContent =
      "質問 " + (current + 1) + " / " + questions.length;
    document.getElementById("quizText").textContent = q.text;

    var letters = ["A", "B", "C", "D"];
    var optionsHTML = q.options
      .map(function (opt, i) {
        var selected = answers[q.id] === opt.type ? "selected" : "";
        return (
          '<div class="quiz-option ' + selected + '" data-type="' + opt.type + '">' +
          '<span class="quiz-option-letter">' + letters[i] + "</span>" +
          opt.label +
          "</div>"
        );
      })
      .join("");
    document.getElementById("quizOptions").innerHTML = optionsHTML;

    document.querySelectorAll(".quiz-option").forEach(function (el) {
      el.addEventListener("click", function () {
        answers[q.id] = el.getAttribute("data-type");
        render();
        setTimeout(function () {
          if (current < questions.length - 1) {
            current += 1;
            render();
          } else {
            finish();
          }
        }, 220);
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
    document.getElementById("quizBack").addEventListener("click", function () {
      if (current > 0) {
        current -= 1;
        render();
      }
    });
    render();
  });
})();
