(function () {
  "use strict";

  function exportParticipants() {
    var list = UFC.getParticipants();
    var groups = UFC.getGroups();
    var header = ["名前", "ニックネーム", "年齢", "年代", "性別", "教会", "メールアドレス", "Discord ID", "Mission Type", "サブタイプ", "登録日時", "グループ"];
    var rows = [header];
    list.forEach(function (p) {
      var group = groups.find(function (g) { return g.id === p.groupId; });
      rows.push([
        p.name, p.nickname, p.age, p.ageRange, p.gender, p.church, p.email, p.discordId || "",
        p.missionType || "", p.subMissionType || "", p.createdAt, group ? group.name : "",
      ]);
    });
    UFC.downloadCSV("ufc_participants.csv", rows);
  }

  function exportGroups() {
    var groups = UFC.getGroups();
    var participants = UFC.getParticipants();
    var header = ["グループ名", "性別", "年齢層", "Mission Type構成", "Discordチャンネル", "メンバー(ニックネーム)", "メンバー(Discord ID)"];
    var rows = [header];
    groups.forEach(function (g) {
      var members = g.memberIds
        .map(function (id) { return participants.find(function (p) { return p.id === id; }); })
        .filter(Boolean);
      rows.push([
        g.name, g.genderLabel, g.ageLabel, g.typeLabel, "#" + g.discordChannelName,
        members.map(function (m) { return m.nickname; }).join(" / "),
        members.map(function (m) { return m.discordId || "-"; }).join(" / "),
      ]);
    });
    UFC.downloadCSV("ufc_groups.csv", rows);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var participants = UFC.getParticipants();
    var groups = UFC.getGroups();
    document.getElementById("countParticipants").textContent = participants.length + " 人";
    document.getElementById("countGroups").textContent = groups.length + " グループ";
    document.getElementById("exportParticipantsBtn").addEventListener("click", exportParticipants);
    document.getElementById("exportGroupsBtn").addEventListener("click", exportGroups);
  });
})();
