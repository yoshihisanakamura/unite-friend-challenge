(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var participant = UFC.getCurrentParticipant();
    if (!participant) {
      window.location.href = "start.html";
      return;
    }

    var groups = UFC.getGroups();
    var group = groups.find(function (g) { return g.id === participant.groupId; });

    if (!group) {
      document.getElementById("groupEmpty").style.display = "block";
      document.getElementById("groupContent").style.display = "none";
      return;
    }

    document.getElementById("groupEmpty").style.display = "none";
    document.getElementById("groupContent").style.display = "block";
    document.getElementById("groupName").textContent = group.name;
    document.getElementById("groupTag").textContent = group.genderLabel + " ・ " + group.ageLabel;

    var participants = UFC.getParticipants();
    var members = group.memberIds
      .map(function (id) { return participants.find(function (p) { return p.id === id; }); })
      .filter(Boolean);

    document.getElementById("memberList").innerHTML = members
      .map(function (m) {
        var isMe = m.id === participant.id;
        var type = m.missionType ? UFC.MISSION_TYPES[m.missionType] : null;
        var art = type && UFC.Characters
          ? UFC.Characters.render(type.key)
          : '<div style="font-size:2rem; line-height:1.4;">🙏</div>';
        return (
          '<div class="window">' +
          '<div class="window-pane">' +
          art +
          '<span class="window-name">' + m.nickname + (isMe ? " ★" : "") + "</span>" +
          '<span class="window-sub">' + (type ? type.key : "診断前") + "</span>" +
          "</div></div>"
        );
      })
      .join("");

    var week = UFC.currentActiveWeek(participant);
    document.getElementById("groupWeekTitle").textContent = "Week " + week.week + " ・ " + week.title;
    document.getElementById("groupWeekSummary").textContent = week.summary;

    document.getElementById("discordChannel").textContent = "#" + group.discordChannelName;

    var invite = window.UFC && UFC.CONFIG && UFC.CONFIG.discordInvite;
    if (invite) {
      var joinBtn = document.getElementById("discordJoinBtn");
      joinBtn.href = invite;
      joinBtn.style.display = "";
    }
  });
})();
