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
  var QUIZ_QUESTIONS = [
    {
      id: "q1",
      text: "友達をUNITEに誘うとしたら、あなたに一番近いのは？",
      options: [
        { label: "とにかくまず声をかけてみる", type: "Spark" },
        { label: "共通の友達と一緒に誘う", type: "Bridge" },
        { label: "まずゆっくり話を聞く", type: "Shepherd" },
        { label: "自分の経験をシェアする", type: "Story" },
      ],
    },
    {
      id: "q2",
      text: "グループの中で自然とやりがちなことは？",
      options: [
        { label: "みんなに声をかける", type: "Spark" },
        { label: "人を紹介する", type: "Bridge" },
        { label: "落ち込んでいる人に寄り添う", type: "Shepherd" },
        { label: "予定やタスクを整理する", type: "Builder" },
      ],
    },
    {
      id: "q3",
      text: "友達が信仰について質問してきたら？",
      options: [
        { label: "自分の言葉で体験を話す", type: "Story" },
        { label: "一緒に聖書を読んでみる", type: "Shepherd" },
        { label: "先生やリーダーにつなげる", type: "Bridge" },
        { label: "まず祈る", type: "Prayer" },
      ],
    },
    {
      id: "q4",
      text: "あなたが得意なのは？",
      options: [
        { label: "最初の一歩を踏み出す", type: "Spark" },
        { label: "人と人をつなぐ", type: "Bridge" },
        { label: "一人を大切にする", type: "Shepherd" },
        { label: "裏で支える", type: "Prayer" },
      ],
    },
    {
      id: "q5",
      text: "6週間のチャレンジで、あなたが一番やりやすそうなのは？",
      options: [
        { label: "友達に連絡する", type: "Spark" },
        { label: "一緒にカフェに行く", type: "Shepherd" },
        { label: "グループの進捗を整える", type: "Builder" },
        { label: "祈り続ける", type: "Prayer" },
      ],
    },
    {
      id: "q6",
      text: "SNSや会話で、自分の信仰をシェアすることについてどう感じる？",
      options: [
        { label: "わりとできる", type: "Story" },
        { label: "誰かと一緒ならできる", type: "Bridge" },
        { label: "まず個人的に話したい", type: "Shepherd" },
        { label: "少し苦手だけど祈りたい", type: "Prayer" },
      ],
    },
    {
      id: "q7",
      text: "チームに必要だと思うものは？",
      options: [
        { label: "勢い", type: "Spark" },
        { label: "つながり", type: "Bridge" },
        { label: "ケア", type: "Shepherd" },
        { label: "整理", type: "Builder" },
      ],
    },
    {
      id: "q8",
      text: "あなたが友達に届けたいものは？",
      options: [
        { label: "きっかけ", type: "Spark" },
        { label: "居場所", type: "Bridge" },
        { label: "安心", type: "Shepherd" },
        { label: "希望のストーリー", type: "Story" },
      ],
    },
    {
      id: "q9",
      text: "友達のために何かするなら、一番自然にできそうなのは？",
      options: [
        { label: "毎日1分でも祈り続ける", type: "Prayer" },
        { label: "会う日や場所をセッティングする", type: "Builder" },
        { label: "自分の体験をメッセージで送る", type: "Story" },
        { label: "まず「最近どう？」と連絡する", type: "Spark" },
      ],
    },
    {
      id: "q10",
      text: "UNITE当日、あなたがしていそうなことは？",
      options: [
        { label: "集合時間や行き方をみんなに共有している", type: "Builder" },
        { label: "友達同士を紹介してつなげている", type: "Bridge" },
        { label: "始まる前に、友達のために静かに祈っている", type: "Prayer" },
        { label: "自分がどう感じたかを友達に話している", type: "Story" },
      ],
    },
  ];

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
      summary: "自分の教会やユース、バイブルスタディに誘ってみよう。難しければ、クリスチャンの友人を紹介するだけでもいい。",
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
      summary: "UNITEに一緒に行こうと誘おう。一人で来づらい友達のために、一緒に行こう。当日も一緒に過ごそう。",
      encouragement: "ここまでの歩み、ひとつひとつを神様は見ていてくださいます。",
      checklist: ["UNITEに誘った", "一緒に行く予定を立てた", "当日、一緒に過ごした"],
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
    // answers: { q1: "Spark", q2: "Bridge", ... }
    // Raw counts are normalized by how often each type appears as an option,
    // so types with fewer chances to be picked aren't structurally penalized.
    var scores = {};
    var appearances = {};
    TYPE_ORDER.forEach(function (t) {
      scores[t] = 0;
      appearances[t] = 0;
    });
    QUIZ_QUESTIONS.forEach(function (q) {
      q.options.forEach(function (opt) {
        if (appearances[opt.type] !== undefined) appearances[opt.type] += 1;
      });
    });
    Object.keys(answers).forEach(function (qId) {
      var t = answers[qId];
      if (scores[t] !== undefined) scores[t] += 1;
    });
    var normalized = {};
    TYPE_ORDER.forEach(function (t) {
      normalized[t] = appearances[t] ? scores[t] / appearances[t] : 0;
    });
    var sorted = TYPE_ORDER.slice().sort(function (a, b) {
      if (normalized[b] !== normalized[a]) return normalized[b] - normalized[a];
      return scores[b] - scores[a];
    });
    var top = sorted[0];
    var second = sorted[1];
    var subType = null;
    if (scores[second] > 0 && normalized[second] >= normalized[top] * 0.75 && second !== top) {
      subType = second;
    }
    return { scores: scores, missionType: top, subMissionType: subType };
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
    QUIZ_QUESTIONS: QUIZ_QUESTIONS,
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
