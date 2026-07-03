(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var ageRangeSelect = document.getElementById("ageRange");
    UFC.AGE_RANGES.forEach(function (r) {
      var opt = document.createElement("option");
      opt.value = r;
      opt.textContent = r;
      ageRangeSelect.appendChild(opt);
    });

    var genderWrap = document.getElementById("genderOptions");
    UFC.GENDERS.forEach(function (g, i) {
      var id = "gender_" + i;
      genderWrap.insertAdjacentHTML(
        "beforeend",
        '<label class="radio-pill"><input type="radio" name="gender" id="' + id + '" value="' + g + '" ' + (i === 0 ? "required" : "") + '/><span>' + g + "</span></label>"
      );
    });

    var form = document.getElementById("registerForm");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var gender = fd.get("gender");
      if (!gender) {
        alert("性別を選択してください。");
        return;
      }

      var participant = {
        id: UFC.genId("p"),
        name: fd.get("name").trim(),
        nickname: fd.get("nickname").trim(),
        age: Number(fd.get("age")),
        ageRange: fd.get("ageRange"),
        gender: gender,
        church: fd.get("church").trim() || "探し中",
        email: fd.get("email").trim(),
        discordId: fd.get("discordId").trim(),
        friends: [
          (fd.get("friend1") || "").trim(),
          (fd.get("friend2") || "").trim(),
          (fd.get("friend3") || "").trim(),
        ],
        missionType: null,
        subMissionType: null,
        scores: null,
        groupId: null,
        challengeProgress: UFC.emptyChallengeProgress(),
        createdAt: new Date().toISOString(),
      };

      var list = UFC.getParticipants();
      list.push(participant);
      UFC.saveParticipants(list);
      UFC.setCurrentId(participant.id);

      window.location.href = "quiz.html";
    });
  });
})();
