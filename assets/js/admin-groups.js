(function () {
  "use strict";

  // Group names are assigned by the group's dominant Mission Type —
  // each type has its own themed pool (9 names x 6 = 54). Stylish
  // English words, interdenominationally safe.
  var TYPE_NAME_POOLS = {
    Spark:    ["Ember", "Flare", "Lumen", "Daybreak", "Sunrise", "Comet", "Firefly", "Golden Hour", "North Star"],
    Bridge:   ["Compass", "Harbor", "Atlas", "Meridian", "Ripple", "Lighthouse", "Wavelength", "Caravan", "Crossroads"],
    Shepherd: ["Haven", "Hearth", "Willow", "Nest", "Fireside", "Shelter", "Meadow", "Homeward", "Gentle Rain"],
    Story:    ["Echo", "Chapter", "Ink", "Verse", "Chorus", "Melody", "Postcard", "Campfire", "Anthem"],
    Builder:  ["Keystone", "Cornerstone", "Timber", "Atelier", "Blueprint", "Workshop", "Trellis", "Beehive", "Studio"],
    Prayer:   ["Vigil", "Stillwater", "Quiet Hour", "Moonrise", "Lantern", "Blue Hour", "Dewfall", "Whisper", "Anchor"],
  };

  function dominantType(members) {
    var counts = {};
    members.forEach(function (m) {
      if (m.missionType) counts[m.missionType] = (counts[m.missionType] || 0) + 1;
    });
    var best = null;
    UFC.TYPE_ORDER.forEach(function (t) {
      if (counts[t] && (!best || counts[t] > counts[best])) best = t;
    });
    return best;
  }

  function slugify(name) {
    return "team-" + name.toLowerCase().replace(/\s+/g, "-");
  }

  function pickIdentity(members, used, counter) {
    var dom = dominantType(members);
    // try the dominant type's pool first, then the others in order
    var order = dom
      ? [dom].concat(UFC.TYPE_ORDER.filter(function (t) { return t !== dom; }))
      : UFC.TYPE_ORDER.slice();
    for (var i = 0; i < order.length; i++) {
      var pool = TYPE_NAME_POOLS[order[i]];
      for (var j = 0; j < pool.length; j++) {
        if (!used[pool[j]]) {
          used[pool[j]] = true;
          return { name: "Team " + pool[j], channel: slugify(pool[j]) };
        }
      }
    }
    var n = String(counter).padStart(2, "0");
    return { name: "Group " + n, channel: "group-" + n };
  }

  var GENDER_LABEL = { "男性": "男子", "女性": "女子", "回答しない": "参加者" };

  function computeGroupSizes(n) {
    if (n <= 0) return [];
    if (n <= 4) return [n];
    var sizes = [];
    var remaining = n;
    while (remaining > 4) {
      if (remaining - 4 === 1 || remaining - 4 === 2) {
        sizes.push(3);
        remaining -= 3;
      } else {
        sizes.push(4);
        remaining -= 4;
      }
    }
    sizes.push(remaining);
    return sizes;
  }

  function interleaveByType(members) {
    var buckets = {};
    UFC.TYPE_ORDER.forEach(function (t) { buckets[t] = []; });
    var noType = [];
    members.forEach(function (m) {
      if (m.missionType && buckets[m.missionType]) buckets[m.missionType].push(m);
      else noType.push(m);
    });
    var order = [];
    var remaining = true;
    while (remaining) {
      remaining = false;
      UFC.TYPE_ORDER.forEach(function (t) {
        if (buckets[t].length) {
          order.push(buckets[t].shift());
          remaining = true;
        }
      });
    }
    return order.concat(noType);
  }

  function assignToGroups(members, sizes) {
    var groups = sizes.map(function () { return []; });
    var order = interleaveByType(members);
    order.forEach(function (m) {
      var candidates = [];
      groups.forEach(function (g, i) {
        if (g.length < sizes[i]) candidates.push({ g: g, i: i });
      });
      if (!candidates.length) {
        groups.reduce(function (min, g) { return g.length < min.length ? g : min; }).push(m);
        return;
      }
      candidates.sort(function (a, b) {
        var aHasType = a.g.some(function (x) { return x.missionType === m.missionType; }) ? 1 : 0;
        var bHasType = b.g.some(function (x) { return x.missionType === m.missionType; }) ? 1 : 0;
        if (aHasType !== bHasType) return aHasType - bHasType;
        var aChurch = a.g.filter(function (x) { return x.church === m.church; }).length;
        var bChurch = b.g.filter(function (x) { return x.church === m.church; }).length;
        if (aChurch !== bChurch) return aChurch - bChurch;
        return a.g.length - b.g.length;
      });
      candidates[0].g.push(m);
    });
    return groups;
  }

  function buildGroupMeta(members) {
    var ages = members.map(function (m) { return m.age; }).filter(function (a) { return !isNaN(a); });
    var ageLabel = ages.length ? Math.min.apply(null, ages) + "-" + Math.max.apply(null, ages) : "-";
    var types = [];
    members.forEach(function (m) {
      if (m.missionType && types.indexOf(m.missionType) === -1) types.push(m.missionType);
    });
    var genders = {};
    members.forEach(function (m) { genders[m.gender] = true; });
    var genderKeys = Object.keys(genders);
    var genderLabel = genderKeys.length === 1 ? (GENDER_LABEL[genderKeys[0]] || genderKeys[0]) : "混合";
    return { ageLabel: ageLabel, types: types, genderLabel: genderLabel };
  }

  function generateAllGroups() {
    var participants = UFC.getParticipants();
    var byGender = {};
    participants.forEach(function (p) {
      byGender[p.gender] = byGender[p.gender] || [];
      byGender[p.gender].push(p);
    });

    var allGroups = [];
    var usedNames = {};
    var counter = 1;
    var BLOCK_SIZE = 12;

    Object.keys(byGender).forEach(function (genderKey) {
      var list = byGender[genderKey].slice().sort(function (a, b) { return a.age - b.age; });
      for (var start = 0; start < list.length; start += BLOCK_SIZE) {
        var block = list.slice(start, start + BLOCK_SIZE);
        var sizes = computeGroupSizes(block.length);
        var groupedMembers = assignToGroups(block, sizes);
        groupedMembers.forEach(function (members) {
          if (!members.length) return;
          var meta = buildGroupMeta(members);
          var identity = pickIdentity(members, usedNames, counter);
          var typeLabels = meta.types.map(function (t) { return t; }).join(" / ") || "診断待ち";
          allGroups.push({
            id: UFC.genId("g"),
            name: identity.name,
            genderLabel: meta.genderLabel,
            ageLabel: meta.ageLabel,
            types: meta.types,
            typeLabel: typeLabels,
            memberIds: members.map(function (m) { return m.id; }),
            discordChannelName: identity.channel,
            createdAt: new Date().toISOString(),
          });
          counter += 1;
        });
      }
    });

    UFC.saveGroups(allGroups);
    var updatedParticipants = UFC.getParticipants();
    updatedParticipants.forEach(function (p) { p.groupId = null; });
    allGroups.forEach(function (g) {
      g.memberIds.forEach(function (id) {
        var p = updatedParticipants.find(function (x) { return x.id === id; });
        if (p) p.groupId = g.id;
      });
    });
    UFC.saveParticipants(updatedParticipants);
    return allGroups;
  }

  function recomputeGroupMeta(group, participants) {
    var members = group.memberIds
      .map(function (id) { return participants.find(function (p) { return p.id === id; }); })
      .filter(Boolean);
    var meta = buildGroupMeta(members);
    group.genderLabel = meta.genderLabel;
    group.ageLabel = meta.ageLabel;
    group.types = meta.types;
    group.typeLabel = meta.types.join(" / ") || "診断待ち";
  }

  function renderGroups() {
    var groups = UFC.getGroups();
    var participants = UFC.getParticipants();
    var wrap = document.getElementById("groupGrid");

    if (!groups.length) {
      wrap.innerHTML = '<div class="empty-state">まだグループがありません。上のボタンから自動生成しよう。</div>';
    } else {
      wrap.innerHTML = groups
        .map(function (g) {
          var members = g.memberIds
            .map(function (id) { return participants.find(function (p) { return p.id === id; }); })
            .filter(Boolean);
          var options = groups
            .map(function (og) { return '<option value="' + og.id + '">' + og.name + "</option>"; })
            .join("");
          var rows = members
            .map(function (m) {
              var type = m.missionType ? UFC.MISSION_TYPES[m.missionType].key : "未診断";
              return (
                '<div class="group-member-row">' +
                "<span>" + m.nickname + ' <span class="tag" style="margin-left:4px;">' + type + "</span></span>" +
                '<select data-participant="' + m.id + '" data-current="' + g.id + '" class="move-select">' +
                options +
                '<option value="">未所属にする</option>' +
                "</select>" +
                "</div>"
              );
            })
            .join("");
          return (
            '<div class="card">' +
            '<div style="display:flex; justify-content:space-between; align-items:baseline;">' +
            "<h3 style=\"font-size:1rem;\">" + g.name + "</h3>" +
            '<span class="small muted">' + members.length + "人</span>" +
            "</div>" +
            '<p class="small muted" style="margin-top:2px;">' + g.genderLabel + " ・ " + g.ageLabel + "歳</p>" +
            '<p class="small" style="margin-top:6px; font-weight:700;">' + g.typeLabel + "</p>" +
            '<div style="margin-top:10px;">' + rows + "</div>" +
            "</div>"
          );
        })
        .join("");

      wrap.querySelectorAll(".move-select").forEach(function (sel) {
        sel.value = sel.getAttribute("data-current");
        sel.addEventListener("change", function () {
          moveParticipant(sel.getAttribute("data-participant"), sel.getAttribute("data-current"), sel.value);
        });
      });
    }

    renderUngrouped(groups, participants);
  }

  function renderUngrouped(groups, participants) {
    var ungrouped = participants.filter(function (p) { return !p.groupId; });
    var box = document.getElementById("ungroupedBox");
    if (!ungrouped.length) {
      box.innerHTML = '<p class="small muted">未所属の参加者はいません。</p>';
      return;
    }
    var options = groups.map(function (g) { return '<option value="' + g.id + '">' + g.name + "</option>"; }).join("");
    box.innerHTML = ungrouped
      .map(function (p) {
        var type = p.missionType ? UFC.MISSION_TYPES[p.missionType].key : "未診断";
        return (
          '<div class="group-member-row">' +
          "<span>" + p.nickname + ' <span class="tag">' + type + "</span></span>" +
          '<select data-participant="' + p.id + '" data-current="" class="move-select">' +
          '<option value="">未所属のまま</option>' + options +
          "</select>" +
          "</div>"
        );
      })
      .join("");
    box.querySelectorAll(".move-select").forEach(function (sel) {
      sel.addEventListener("change", function () {
        moveParticipant(sel.getAttribute("data-participant"), "", sel.value);
      });
    });
  }

  function moveParticipant(participantId, fromGroupId, toGroupId) {
    var groups = UFC.getGroups();
    var participants = UFC.getParticipants();

    if (fromGroupId) {
      var fromGroup = groups.find(function (g) { return g.id === fromGroupId; });
      if (fromGroup) fromGroup.memberIds = fromGroup.memberIds.filter(function (id) { return id !== participantId; });
    }
    if (toGroupId) {
      var toGroup = groups.find(function (g) { return g.id === toGroupId; });
      if (toGroup && toGroup.memberIds.indexOf(participantId) === -1) toGroup.memberIds.push(participantId);
    }
    groups.forEach(function (g) { recomputeGroupMeta(g, participants); });

    var p = participants.find(function (x) { return x.id === participantId; });
    if (p) p.groupId = toGroupId || null;

    UFC.saveGroups(groups);
    UFC.saveParticipants(participants);
    renderGroups();
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderGroups();
    document.getElementById("generateBtn").addEventListener("click", function () {
      var existing = UFC.getGroups();
      if (existing.length && !confirm("既存のグループ分けは上書きされます。よろしいですか？")) return;
      generateAllGroups();
      renderGroups();
    });
  });
})();
