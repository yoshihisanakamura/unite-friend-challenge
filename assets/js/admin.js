(function () {
  "use strict";

  var DEMO_NAMES = [
    ["ケンタ", "けん"], ["ミサキ", "みさ"], ["ショウタ", "しょう"], ["ユイ", "ゆい"],
    ["ハルト", "はる"], ["アヤカ", "あや"], ["ダイキ", "だい"], ["サクラ", "さくら"],
    ["レン", "れん"], ["ノゾミ", "のぞ"], ["ソウタ", "そう"], ["エミ", "えみ"],
    ["カイト", "かい"], ["リナ", "りな"], ["ユウキ", "ゆうき"], ["マナミ", "まな"],
    ["タクミ", "たく"], ["コトネ", "こと"], ["リョウ", "りょう"], ["アオイ", "あおい"],
  ];
  var CHURCHES = ["グレイス教会", "恵みキリスト教会", "希望チャペル", "リバイバル教会", "コイノニア教会"];
  var AGE_RANGE_BOUNDS = {
    "中学生": [12, 15],
    "高校生": [15, 18],
    "大学生": [18, 22],
    "社会人(20代)": [22, 29],
    "社会人(30代以上)": [30, 39],
  };
  function randomAgeFor(ageRange) {
    var bounds = AGE_RANGE_BOUNDS[ageRange] || [18, 25];
    return bounds[0] + Math.floor(Math.random() * (bounds[1] - bounds[0] + 1));
  }

  function seedDemoParticipants() {
    var list = UFC.getParticipants();
    var genders = ["男性", "女性"];
    DEMO_NAMES.forEach(function (pair, i) {
      var answers = {};
      UFC.QUIZ_QUESTIONS.forEach(function (q) {
        var opt = q.options[Math.floor(Math.random() * q.options.length)];
        answers[q.id] = opt.type;
      });
      var result = UFC.scoreQuiz(answers);
      var ageRange = UFC.AGE_RANGES[Math.floor(Math.random() * UFC.AGE_RANGES.length)];
      list.push({
        id: UFC.genId("p"),
        name: pair[0] + " " + (i + 1),
        nickname: pair[1],
        age: randomAgeFor(ageRange),
        ageRange: ageRange,
        gender: genders[i % 2],
        church: CHURCHES[Math.floor(Math.random() * CHURCHES.length)],
        email: "demo" + i + "@example.com",
        discordId: "demo_" + pair[1],
        friends: ["友達A", "友達B", "友達C"],
        missionType: result.missionType,
        subMissionType: result.subMissionType,
        scores: result.scores,
        groupId: null,
        challengeProgress: UFC.emptyChallengeProgress(),
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 86400000).toISOString(),
      });
    });
    UFC.saveParticipants(list);
  }

  function fmtDate(iso) {
    var d = new Date(iso);
    return d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
  }

  function uniqueValues(list, key) {
    var s = {};
    list.forEach(function (p) { if (p[key]) s[p[key]] = true; });
    return Object.keys(s).sort();
  }

  function renderDashboard(list) {
    document.getElementById("statTotal").textContent = list.length;
    var groups = UFC.getGroups();
    document.getElementById("statGroups").textContent = groups.length;
    var diagnosed = list.filter(function (p) { return p.missionType; }).length;
    document.getElementById("statDiagnosed").textContent = diagnosed;

    // gender ratio
    var genderCounts = {};
    UFC.GENDERS.forEach(function (g) { genderCounts[g] = 0; });
    list.forEach(function (p) { genderCounts[p.gender] = (genderCounts[p.gender] || 0) + 1; });
    document.getElementById("genderBars").innerHTML = barRows(genderCounts, list.length);

    // age distribution
    var ageCounts = {};
    UFC.AGE_RANGES.forEach(function (a) { ageCounts[a] = 0; });
    list.forEach(function (p) { ageCounts[p.ageRange] = (ageCounts[p.ageRange] || 0) + 1; });
    document.getElementById("ageBars").innerHTML = barRows(ageCounts, list.length);

    // type distribution
    var typeCounts = {};
    UFC.TYPE_ORDER.forEach(function (t) { typeCounts[t] = 0; });
    list.forEach(function (p) { if (p.missionType) typeCounts[p.missionType] = (typeCounts[p.missionType] || 0) + 1; });
    document.getElementById("typeBars").innerHTML = barRows(typeCounts, list.length);
  }

  function barRows(counts, total) {
    return Object.keys(counts).map(function (label) {
      var n = counts[label];
      var pct = total ? Math.round((n / total) * 100) : 0;
      return (
        '<div class="bar-row"><span class="bar-label">' + label + '</span>' +
        '<span class="bar-track"><span class="bar-fill" style="width:' + pct + '%"></span></span>' +
        '<span class="bar-num">' + n + "</span></div>"
      );
    }).join("");
  }

  function populateFilters(list) {
    var typeSel = document.getElementById("filterType");
    UFC.TYPE_ORDER.forEach(function (t) {
      var o = document.createElement("option");
      o.value = t; o.textContent = t + "（" + UFC.MISSION_TYPES[t].nameJa + "）";
      typeSel.appendChild(o);
    });
    var ageSel = document.getElementById("filterAge");
    UFC.AGE_RANGES.forEach(function (a) {
      var o = document.createElement("option");
      o.value = a; o.textContent = a;
      ageSel.appendChild(o);
    });
    var genderSel = document.getElementById("filterGender");
    UFC.GENDERS.forEach(function (g) {
      var o = document.createElement("option");
      o.value = g; o.textContent = g;
      genderSel.appendChild(o);
    });
    var churchSel = document.getElementById("filterChurch");
    uniqueValues(list, "church").forEach(function (c) {
      var o = document.createElement("option");
      o.value = c; o.textContent = c;
      churchSel.appendChild(o);
    });
  }

  function applyFilters(list) {
    var type = document.getElementById("filterType").value;
    var age = document.getElementById("filterAge").value;
    var gender = document.getElementById("filterGender").value;
    var church = document.getElementById("filterChurch").value;
    return list.filter(function (p) {
      if (type && p.missionType !== type) return false;
      if (age && p.ageRange !== age) return false;
      if (gender && p.gender !== gender) return false;
      if (church && p.church !== church) return false;
      return true;
    });
  }

  function groupLabel(p, groups) {
    if (!p.groupId) return "-";
    var g = groups.find(function (gr) { return gr.id === p.groupId; });
    return g ? g.name : "-";
  }

  function renderTable() {
    var all = UFC.getParticipants();
    var groups = UFC.getGroups();
    var filtered = applyFilters(all);
    document.getElementById("tableCount").textContent = filtered.length + " / " + all.length + " 人";

    var rows = filtered
      .slice()
      .sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); })
      .map(function (p) {
        var type = p.missionType ? UFC.MISSION_TYPES[p.missionType].key : "未診断";
        return (
          "<tr>" +
          "<td>" + p.name + "</td>" +
          "<td>" + p.nickname + "</td>" +
          "<td>" + p.age + "</td>" +
          "<td>" + p.ageRange + "</td>" +
          "<td>" + p.gender + "</td>" +
          "<td>" + p.church + "</td>" +
          "<td>" + p.email + "</td>" +
          "<td>" + (p.discordId || "-") + "</td>" +
          "<td>" + type + "</td>" +
          "<td>" + fmtDate(p.createdAt) + "</td>" +
          "<td>" + groupLabel(p, groups) + "</td>" +
          "</tr>"
        );
      })
      .join("");
    document.getElementById("tableBody").innerHTML =
      rows || '<tr><td colspan="11" class="muted">該当する参加者がいません</td></tr>';
  }

  function refreshAll() {
    var list = UFC.getParticipants();
    renderDashboard(list);
    renderTable();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var list = UFC.getParticipants();
    populateFilters(list);
    refreshAll();

    ["filterType", "filterAge", "filterGender", "filterChurch"].forEach(function (id) {
      document.getElementById(id).addEventListener("change", renderTable);
    });

    document.getElementById("seedDemoBtn").addEventListener("click", function () {
      seedDemoParticipants();
      var newList = UFC.getParticipants();
      document.getElementById("filterType").innerHTML = '<option value="">タイプ：すべて</option>';
      document.getElementById("filterAge").innerHTML = '<option value="">年代：すべて</option>';
      document.getElementById("filterGender").innerHTML = '<option value="">性別：すべて</option>';
      document.getElementById("filterChurch").innerHTML = '<option value="">教会：すべて</option>';
      populateFilters(newList);
      refreshAll();
    });
  });
})();
