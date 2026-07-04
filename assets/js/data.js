/* ==========================================================================
   UNITE Friend Challenge — core data module
   Namespaced under window.UFC. No build step, no backend: everything is
   persisted to localStorage so the prototype is fully usable standalone.
   ========================================================================== */
(function (global) {
  "use strict";

  var STORAGE_KEYS = {
    participants: "ufc_participants",
    currentId: "ufc_current_participant_id",
    groups: "ufc_groups",
  };

  // ---------------------------------------------------------------------
  // Mission Types (6)
  // ---------------------------------------------------------------------
  var MISSION_TYPES = {
    Spark: {
      key: "Spark",
      nameJa: "火をつける人",
      role: "最初の一歩を踏み出し、友達に声をかける人。",
      catch: "あなたは、最初の一歩に火をつける人です。",
      description:
        "Sparkは、新しい人に自然に声をかけたり、友達を誘うきっかけを作れる人です。あなたの一言が、誰かの人生に新しい扉を開くことがあります。",
      strengths: [
        "最初の一歩が早い",
        "人に声をかけられる",
        "場の空気を明るくできる",
        "誘う勇気がある",
      ],
      cautions: [
        "相手のペースを大切にする",
        "勢いだけで進めすぎない",
        "断られても落ち込みすぎない",
      ],
      weeklyChallenge: "祈っている友達のうち1人に、軽く連絡してみよう。",
      verseText: "あなたがたの光を人々の前で輝かせなさい。",
      verseRef: "マタイ5:16",
      bibleFigure: "アンデレ",
      bibleFigureDesc:
        "アンデレは、イエスに出会ってすぐ兄弟シモン（ペテロ）のところへ行き、「メシアに会った」と伝えて連れてきました（ヨハネ1:40-42）。立派な説明ではなく、「会ったよ、来てみて」という最初の一歩が、後の大きな働きにつながりました。",
      accent: "orange",
    },
    Bridge: {
      key: "Bridge",
      nameJa: "つなぐ人",
      role: "人と人、人と場所、人と神様へのきっかけを自然につなぐ人。",
      catch: "あなたは、人と人をつなぐ橋のような人です。",
      description:
        "Bridgeは、友達を自然に会話やコミュニティにつなげることが得意です。一人では来づらい人も、あなたがいることで安心して一歩を踏み出せます。",
      strengths: [
        "人を紹介できる",
        "空気をやわらかくできる",
        "誰かを孤立させない",
        "コミュニティに招き入れるのが上手",
      ],
      cautions: [
        "自分が抱え込みすぎない",
        "相手の関係性を急がせない",
        "つなげた後のフォローも大切にする",
      ],
      weeklyChallenge:
        "祈っている友達を、クリスチャンの友人やユースの仲間と自然につなげる方法を考えてみよう。",
      verseText: "私たちはキリストの使節なのです。",
      verseRef: "2コリント5:20",
      bibleFigure: "バルナバ",
      bibleFigureDesc:
        "バルナバは、回心したばかりで周囲に警戒されていたサウロ（パウロ）を使徒たちに引き合わせ、居場所を作った人です（使徒9:26-27）。人と人をつなぐその働きが、のちのパウロの宣教を支えました。",
      accent: "blue",
    },
    Shepherd: {
      key: "Shepherd",
      nameJa: "寄り添う人",
      role: "一人ひとりを大切にし、話を聞き、継続的にフォローする人。",
      catch: "あなたは、一人に寄り添うことができる人です。",
      description:
        "Shepherdは、相手の話をよく聞き、急がず、丁寧に関係を築ける人です。あなたの存在によって、友達は「自分は大切にされている」と感じることができます。",
      strengths: [
        "聞く力がある",
        "相手の小さな変化に気づける",
        "継続的に関われる",
        "優しくフォローできる",
      ],
      cautions: [
        "すべてを自分で背負いすぎない",
        "相手の問題を自分だけで解決しようとしない",
        "必要な時はリーダーや先生に相談する",
      ],
      weeklyChallenge:
        "祈っている友達の近況を聞いてみよう。アドバイスよりも、まず聞くことを大切に。",
      verseText: "わたしは良い牧者です。わたしはわたしのものを知っています。",
      verseRef: "ヨハネ10:14",
      bibleFigure: "ルツ",
      bibleFigureDesc:
        "ルツは、悲しみの中にいたナオミのそばを離れず、「あなたが行かれる所に私も行きます」と寄り添い続けました（ルツ1:16）。そばにいるという選択が、ナオミの人生に希望を取り戻しました。",
      accent: "green",
    },
    Story: {
      key: "Story",
      nameJa: "伝える人",
      role: "自分の言葉で、神様がしてくださったことや信仰のストーリーを分かち合う人。",
      catch: "あなたは、自分の言葉でストーリーを伝える人です。",
      description:
        "Storyは、難しい言葉ではなく、自分の経験やリアルな言葉で信仰を伝えることができる人です。あなたのストーリーは、誰かが神様を知るきっかけになります。",
      strengths: [
        "自分の経験を言葉にできる",
        "SNSや会話で伝えられる",
        "相手に共感を届けられる",
        "証しを分かち合える",
      ],
      cautions: [
        "盛りすぎない",
        "かっこよく見せようとしすぎない",
        "相手を説得しようとしすぎない",
        "正直であることを大切にする",
      ],
      weeklyChallenge: "「自分が神様を知って変わったこと」を3文で書いてみよう。",
      verseText: "来て、見てください。",
      verseRef: "ヨハネ4:29",
      bibleFigure: "サマリアの女性",
      bibleFigureDesc:
        "ヨハネ4章のサマリアの女性は、イエスに出会った体験をそのまま「来て、見てください」と町の人々に伝えました。うまい言葉ではなく、正直な体験の分かち合いを通して、多くの人がイエスに出会いました（ヨハネ4:39）。",
      accent: "pink",
    },
    Builder: {
      key: "Builder",
      nameJa: "整える人",
      role: "グループを支え、予定を整え、チャレンジが続くようにサポートする人。",
      catch: "あなたは、みんなが進みやすいように道を整える人です。",
      description:
        "Builderは、計画を立てたり、リマインドしたり、グループが続くように支えることが得意です。見えにくい働きでも、チームにとってとても大切な存在です。",
      strengths: ["整理できる", "リマインドできる", "計画を立てられる", "グループを支えられる"],
      cautions: ["完璧を求めすぎない", "人を管理しすぎない", "柔軟さを大切にする"],
      weeklyChallenge: "グループの中で、今週の祈りやチャレンジをリマインドしてみよう。",
      verseText: "すべてのことを適切に、秩序をもって行いなさい。",
      verseRef: "1コリント14:40",
      bibleFigure: "ネヘミヤ",
      bibleFigureDesc:
        "ネヘミヤは、祈りながら計画を立て、人々の持ち場を整え、エルサレムの城壁再建という大きな働きをやり遂げました（ネヘミヤ記）。目立ちにくい段取りと支えが、みんなの働きを可能にしました。",
      accent: "purple",
    },
    Prayer: {
      key: "Prayer",
      nameJa: "祈る人",
      role: "見えないところで祈り、友達とチームを霊的に支える人。",
      catch: "あなたは、祈りで人を支える人です。",
      description:
        "Prayerは、目立つ場所ではなくても、祈りによって友達やチームを支えることができる人です。神様は、あなたの静かな祈りを用いてくださいます。",
      strengths: ["深く祈れる", "人のために心を向けられる", "目に見えない働きを大切にできる", "継続できる"],
      cautions: ["祈るだけで終わらず、小さな行動にもつなげる", "孤立しすぎない", "不安を一人で抱え込まない"],
      weeklyChallenge: "祈っている3人の名前を見ながら、1日1回短く祈ってみよう。",
      verseText: "たゆみなく祈りなさい。",
      verseRef: "コロサイ4:2",
      bibleFigure: "エパフラス",
      bibleFigureDesc:
        "エパフラスは、離れた場所にいる仲間のために「いつも祈りに励んでいる」と紹介されています（コロサイ4:12）。聖書に残る記録は多くありませんが、その静かな祈りが教会を支えていました。",
      accent: "navy",
    },
  };

  var TYPE_ORDER = ["Spark", "Bridge", "Shepherd", "Story", "Builder", "Prayer"];

  // ---------------------------------------------------------------------
  // Quiz (8 questions x 4 options)
  // ---------------------------------------------------------------------
  // 24-item Likert bank (5-point). Item wording follows the revised
  // specification (evidence-based; no reverse-coded items; church jargon
  // avoided). Items are interleaved by type so same-scale items are
  // never adjacent.
  var LIKERT_LABELS = [
    "全くあてはまらない",
    "あまりあてはまらない",
    "どちらともいえない",
    "ややあてはまる",
    "とてもあてはまる",
  ];

  var ITEM_BANK = {
    Spark: [
      "初めて会った人にも、自分から話しかけられる",
      "新しいクラスやグループでも、わりとすぐ誰かと話し始める",
      "「話してみたいな」と思う人がいたら、自分から声をかける",
      "みんなが黙っているとき、最初に口を開くのは自分のことが多い",
    ],
    Bridge: [
      "自分の友達同士を紹介して、仲良くさせたことがある",
      "グループに新しい人が入ってきたら、なじめるように声をかける",
      "「あの子とあの子、気が合いそう」と思ったら、実際に会わせてみる",
      "タイプの違ういくつかのグループに、どちらにも顔を出している",
    ],
    Shepherd: [
      "友達の悩みごとを、じっくり聞くのが好きだ",
      "一度仲良くなった友達とは、ずっと仲が続くことが多い",
      "落ち込んでいる人がいると、そばにいてあげたくなる",
      "友達が前に話してくれたことを、あとになっても覚えている",
    ],
    Story: [
      "「あなたの話はわかりやすい」と言われることがある",
      "自分の失敗や恥ずかしかった話も、わりとオープンに話せる",
      "何かを伝えるとき、「自分のときはこうだった」と体験談で話すことが多い",
      "「あのとき自分はこう感じた」を、言葉にするのが得意だ",
    ],
    Builder: [
      "イベントや集まりでは、準備や裏方の仕事が得意だ",
      "遊びの計画を立てるとき、集合時間や持ち物まで細かく考えるのが好きだ",
      "気づいたら、手伝いや片付けを自分からやっている",
      "みんなが盛り上がっていても、「ちゃんと進んでいるかな」が気になる",
    ],
    Prayer: [
      "友達や家族のことを思って、ひとり静かに過ごす時間がある",
      "心配な友達がいるとき、その人のために祈ることが多い",
      "誰にも知られなくても、友達のために祈り続けるのは苦じゃない",
      "誰かの力になりたいとき、まず祈ることから始める",
    ],
  };

  // interleave: S1,B1,Sh1,St1,Bu1,P1, S2,B2,... so no two same-type
  // items appear consecutively
  var QUIZ_ITEMS = [];
  for (var _i = 0; _i < 4; _i++) {
    TYPE_ORDER.forEach(function (t) {
      QUIZ_ITEMS.push({ id: t.slice(0, 2) + (_i + 1), type: t, text: ITEM_BANK[t][_i] });
    });
  }

  // ---------------------------------------------------------------------
  // 6-Week Challenge
  // ---------------------------------------------------------------------
  var CHALLENGE_WEEKS = [
    {
      week: 1,
      title: "祈る",
      summary: "3人の友達の名前を書き、毎日短く祈る。神様の愛が届くように。",
      encouragement: "祈りは、見えないところで働いています。",
      checklist: [
        "祈っている3人の名前を書いた",
        "今日、短く祈った",
        "神様の愛がその人たちに届くように祈った",
      ],
    },
    {
      week: 2,
      title: "声をかける",
      summary: "1人に自然に連絡してみよう。「最近どう？」と聞くだけでいい。無理に誘わなくて大丈夫。",
      encouragement: "小さな一歩も、神様は用いてくださいます。",
      checklist: ["1人に自然に連絡した", "「最近どう？」と聞いてみた"],
    },
    {
      week: 3,
      title: "つながる",
      summary: "一緒にご飯やカフェ、学校・仕事帰りなどで会おう。ちゃんと話を聞いて、相手の状況を知る時間に。",
      encouragement: "一緒に過ごす時間そのものが、贈り物になります。",
      checklist: ["一緒に会った(ご飯・カフェなど)", "ちゃんと話を聞いた", "相手の状況を知ることができた"],
    },
    {
      week: 4,
      title: "シェアする",
      summary: "自分のストーリーを短く話してみよう。神様がしてくださったことを、自分の言葉で。説得しようとしなくて大丈夫。",
      encouragement: "あなたの正直な言葉が、誰かの心に届きます。",
      checklist: ["自分のストーリーを短く話した", "神様がしてくれたことを自分の言葉で伝えた"],
    },
    {
      week: 5,
      title: "教会へ",
      summary: "自分の教会やユース、バイブルスタディに誘ってみよう。難しければ、クリスチャンの友人を紹介するだけでもいい。自分の教会がまだ決まっていない人は、友達と一緒に行けそうな教会を探してみるのも立派な一歩。",
      encouragement: "一歩ずつでいい。焦らなくて大丈夫。",
      checklist: [
        "教会・ユース・バイブルスタディに誘った",
        "難しい時はクリスチャンの友人を紹介した",
        "必要に応じて牧師先生やリーダーに相談した",
      ],
    },
    {
      week: 6,
      title: "UNITEへ",
      summary: "UNITEに一緒に行こうと誘おう。一人で来づらい友達のために、一緒に行こう。当日も一緒に過ごそう。UNITEはゴールではなく、火がつく場所。",
      encouragement: "ここまでの歩み、ひとつひとつを神様は見ていてくださいます。",
      checklist: ["UNITEに誘った", "一緒に行く予定を立てた", "当日、一緒に過ごした"],
    },
    {
      week: 7,
      title: "教会に根づく",
      summary: "UNITEのあとが、本当の始まり。友達が地域の教会に根づき、留まり続けられるように、一緒に通い、つながり続けよう。あなた自身が教会を探している途中なら、友達と一緒に、根づける場所を見つけていこう。",
      encouragement: "本当の目的地は、大会ではなく、地元の教会。あなたはもう、一人で歩いていません。",
      checklist: [
        "UNITEのあとも連絡を取り合った",
        "地域の教会・ユースに一緒に通った（または橋渡しした）",
        "友達がその教会に居場所を見つけられるよう気にかけた",
      ],
    },
  ];

  // ---------------------------------------------------------------------
  // Resources
  // ---------------------------------------------------------------------
  var RESOURCES = [
    {
      title: "Alpha Youth",
      description:
        "人生、信仰、イエスについて、友達と自然に話し始めるためのシリーズ。初めての人にも入りやすい構成。",
      target: "中高生、大学生、初めて信仰に触れる友達、ユースグループ",
      caution: "教会によって受け止め方が異なるテーマが含まれる場合があります。使用前に、必要に応じて牧師先生やユースリーダーに相談してください。",
      link: "",
    },
    {
      title: "KGK",
      description: "学生向けの聖書研究や信仰の学びに役立つ教材。少人数で聖書を読む時の参考になります。",
      target: "大学生、学生バイブルスタディ、少人数グループ",
      caution: "使用前に、必要に応じて牧師先生やユースリーダーに相談してください。",
      link: "",
    },
    {
      title: "Hi-b.a.",
      description: "中高生・若者向けの聖書の学びや交わりに役立つリソース。",
      target: "中高生、ユース、学生グループ",
      caution: "使用前に、必要に応じて牧師先生やユースリーダーに相談してください。",
      link: "",
    },
    {
      title: "JCCC",
      description: "信仰の基本、伝道、弟子訓練などに関するリソースの参考候補。",
      target: "大学生、若者、信仰の基礎を学びたい人",
      caution: "使用前に、必要に応じて牧師先生やユースリーダーに相談してください。",
      link: "",
    },
    {
      title: "Your Church Resources",
      description: "あなたの教会やユースで普段使っている教材があるなら、まずはそれを大切にしてください。",
      target: "あなたの教会・ユースグループ",
      caution: "迷ったら、先生やリーダーに相談しよう。",
      link: "",
    },
  ];

  var AGE_RANGES = ["中学生", "高校生", "大学生", "社会人(20代)", "社会人(30代以上)"];
  var GENDERS = ["男性", "女性", "回答しない"];

  // ---------------------------------------------------------------------
  // Storage helpers
  // ---------------------------------------------------------------------
  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getParticipants() {
    return readJSON(STORAGE_KEYS.participants, []);
  }
  function saveParticipants(list) {
    writeJSON(STORAGE_KEYS.participants, list);
  }
  function getCurrentId() {
    return localStorage.getItem(STORAGE_KEYS.currentId);
  }
  function setCurrentId(id) {
    localStorage.setItem(STORAGE_KEYS.currentId, id);
  }
  function getCurrentParticipant() {
    var id = getCurrentId();
    if (!id) return null;
    var list = getParticipants();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }
  function updateParticipant(id, patch) {
    var list = getParticipants();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        list[i] = Object.assign({}, list[i], patch);
        break;
      }
    }
    saveParticipants(list);
  }
  function getGroups() {
    return readJSON(STORAGE_KEYS.groups, []);
  }
  function saveGroups(groups) {
    writeJSON(STORAGE_KEYS.groups, groups);
  }

  function genId(prefix) {
    return (prefix || "id") + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function emptyChallengeProgress() {
    var progress = {};
    CHALLENGE_WEEKS.forEach(function (w) {
      progress["week" + w.week] = w.checklist.map(function () {
        return false;
      });
    });
    return progress;
  }

  function currentActiveWeek(participant) {
    for (var i = 0; i < CHALLENGE_WEEKS.length; i++) {
      var w = CHALLENGE_WEEKS[i];
      var arr = (participant.challengeProgress && participant.challengeProgress["week" + w.week]) || [];
      var done = arr.filter(Boolean).length;
      if (done < w.checklist.length) return w;
    }
    return CHALLENGE_WEEKS[CHALLENGE_WEEKS.length - 1];
  }

  function scoreQuiz(answers) {
    // answers: { Sp1: 1..5, Br1: 1..5, ... } (24 Likert responses)
    // Continuous scoring: per-type mean (1.0-5.0). Primary = highest
    // mean; secondary shown when the gap is < 1.0; gaps <= 0.3 are
    // flagged as borderline (both tendencies equally strong).
    var means = {};
    TYPE_ORDER.forEach(function (t) {
      var ids = QUIZ_ITEMS.filter(function (it) { return it.type === t; });
      var sum = 0;
      ids.forEach(function (it) { sum += Number(answers[it.id]) || 3; });
      means[t] = Math.round((sum / ids.length) * 100) / 100;
    });
    var sorted = TYPE_ORDER.slice().sort(function (a, b) { return means[b] - means[a]; });
    var top = sorted[0];
    var second = sorted[1];
    var gap = means[top] - means[second];
    return {
      scores: means,
      missionType: top,
      subMissionType: gap < 1.0 ? second : null,
      borderline: gap <= 0.3,
    };
  }

  function ageToRangeLabel(range) {
    return range || "-";
  }

  function csvEscape(value) {
    var s = value === undefined || value === null ? "" : String(value);
    if (/[",\n]/.test(s)) {
      s = '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  function toCSV(rows) {
    return rows.map(function (row) {
      return row.map(csvEscape).join(",");
    }).join("\r\n");
  }

  function downloadCSV(filename, rows) {
    var csv = "﻿" + toCSV(rows); // BOM for Excel/Japanese
    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  global.UFC = {
    KEYS: STORAGE_KEYS,
    MISSION_TYPES: MISSION_TYPES,
    TYPE_ORDER: TYPE_ORDER,
    QUIZ_ITEMS: QUIZ_ITEMS,
    LIKERT_LABELS: LIKERT_LABELS,
    CHALLENGE_WEEKS: CHALLENGE_WEEKS,
    RESOURCES: RESOURCES,
    AGE_RANGES: AGE_RANGES,
    GENDERS: GENDERS,
    getParticipants: getParticipants,
    saveParticipants: saveParticipants,
    getCurrentId: getCurrentId,
    setCurrentId: setCurrentId,
    getCurrentParticipant: getCurrentParticipant,
    updateParticipant: updateParticipant,
    getGroups: getGroups,
    saveGroups: saveGroups,
    genId: genId,
    emptyChallengeProgress: emptyChallengeProgress,
    currentActiveWeek: currentActiveWeek,
    scoreQuiz: scoreQuiz,
    ageToRangeLabel: ageToRangeLabel,
    downloadCSV: downloadCSV,
  };
})(window);
