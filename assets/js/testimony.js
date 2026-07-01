(function () {
  "use strict";

  var STORAGE_KEY = "ufc_testimony";

  // Church jargon that non-Christian friends may not understand,
  // with plain-language alternatives.
  var JARGON = [
    ["救われ", "「心が軽くなった」「生き方が変わった」など、何がどう変わったかを自分の言葉で"],
    ["恵み", "「もらう資格がないのに受け取った優しさ」など"],
    ["御言葉", "「聖書の言葉」"],
    ["みことば", "「聖書の言葉」"],
    ["聖霊", "説明が難しければ「神様の支え・力」など"],
    ["礼拝", "「教会の集まり」"],
    ["賛美", "「歌」「音楽」"],
    ["証し", "「自分の体験談」"],
    ["福音", "「イエスについての良い知らせ」"],
    ["悔い改め", "「生き方の向きを変えること」"],
    ["祝福", "「良いこと」「守られていると感じたこと」"],
    ["導かれ", "「不思議とそういう流れになって」など"],
    ["みこころ", "「神様の思い」"],
    ["御心", "「神様の思い」"],
    ["主は", "「神様は」「イエスは」"],
    ["主が", "「神様が」「イエスが」"],
    ["バプテスマ", "「クリスチャンになる決心をして受ける儀式」と一言説明を添えると親切"],
    ["洗礼", "初めて聞く人には一言説明があると親切"],
    ["デボーション", "「聖書を読む時間」"],
    ["兄弟姉妹", "「教会の仲間」"],
    ["献身", "「自分の時間や人生を神様のために使うと決めたこと」"],
  ];

  var PUSHY = ["べき", "絶対に", "しなければ", "信じないと", "ないとダメ", "ないとだめ"];

  var FRIEND_QUESTIONS = [
    {
      q: "それって、家が宗教だったからそう思い込んでるだけじゃない？",
      hint: "否定しなくて大丈夫。「そう見えるかもね」と受け止めた上で、家庭環境ではなく自分自身の体験を話してみよう。",
    },
    {
      q: "なんで目に見えない神様を信じられるの？",
      hint: "証明で答えなくていい。「わからないこともあるけど、自分にとってこの体験は本物だった」と正直に言えば十分。",
    },
    {
      q: "教会って勧誘とかノルマとかあるんでしょ？",
      hint: "不安を笑わずに受け止めよう。「不安ならいつでも帰っていいし、来て自分の目で確かめてもいいよ」と選択肢を相手に渡す。",
    },
    {
      q: "いい話だね。でも自分には関係ないかな。",
      hint: "無理に続けなくていい。「聞いてくれてありがとう」で十分。ドアは開いたまま、関係はそのまま続く。",
    },
    {
      q: "それってただの偶然じゃない？",
      hint: "「そうかもしれない。でも自分にはそう思えなかったんだ」と正直に。議論に勝つ必要はない。",
    },
    {
      q: "宗教って自由がなくなりそうなイメージがある。",
      hint: "ルールの話で返さずに、自分が何から自由になったか（不安、孤独、比べ癖など）を話してみよう。",
    },
    {
      q: "つらい時に頼るものが欲しいだけなんじゃない？",
      hint: "「最初はそうだったかも」と認めてもいい。そこから何が変わっていったかを続けて話せば、正直さが伝わる。",
    },
  ];

  function loadDraft() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }
  function saveDraft() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      before: el("tBefore").value,
      meeting: el("tMeeting").value,
      after: el("tAfter").value,
    }));
  }
  function el(id) { return document.getElementById(id); }

  function fullText() {
    return [el("tBefore").value, el("tMeeting").value, el("tAfter").value]
      .map(function (s) { return s.trim(); })
      .filter(Boolean)
      .join("\n\n");
  }

  function card(title, bodyHTML, soft) {
    return (
      '<div class="card' + (soft ? " card-soft" : "") + '" style="margin-top:14px;">' +
      '<p style="font-weight:800; font-size:0.9rem;">' + title + "</p>" +
      '<div class="small" style="margin-top:8px;">' + bodyHTML + "</div></div>"
    );
  }

  function runCheck() {
    var before = el("tBefore").value.trim();
    var meeting = el("tMeeting").value.trim();
    var after = el("tAfter").value.trim();
    var text = fullText();
    var html = "";

    if (!text) {
      el("checkResults").innerHTML = card("まだ何も書かれていません", "ざっくりでいいので、どれか1つの箱から書き始めてみよう。1〜2文でも大丈夫。", true);
      return;
    }

    // 1. Structure
    var parts = [];
    if (before.length < 10) parts.push("「出会う前」");
    if (meeting.length < 10) parts.push("「きっかけ」");
    if (after.length < 10) parts.push("「変わったこと」");
    if (parts.length === 0) {
      html += card("構成 ✓", "前・きっかけ・今の3つがそろっています。ストーリーとして聞きやすい形です。");
    } else {
      html += card("構成", parts.join("、") + " がまだ短めです。1〜2文足すと、流れがぐっと伝わりやすくなります。", true);
    }

    // 2. Length / speaking time
    var chars = text.replace(/\s/g, "").length;
    var seconds = Math.round(chars / 5.5);
    var lengthMsg = "全体で約" + chars + "文字。声に出して読むと <strong>約" + seconds + "秒</strong> です。";
    if (chars > 650) {
      lengthMsg += "<br/>少し長めかも。会話でシェアするなら、90秒（500文字前後）くらいに絞ると最後まで聞いてもらいやすいです。";
    } else if (chars < 80) {
      lengthMsg += "<br/>まだ短めです。「その時どう感じたか」を1文足すだけでも、ぐっとリアルになります。";
    } else {
      lengthMsg += "<br/>会話でシェアしやすい、ちょうどいい長さです。";
    }
    html += card("長さ", lengthMsg);

    // 3. Jargon scan
    var found = [];
    JARGON.forEach(function (pair) {
      if (text.indexOf(pair[0]) !== -1) found.push(pair);
    });
    if (found.length) {
      var rows = found.map(function (pair) {
        return "<li style='margin-bottom:6px;'><strong>「" + pair[0] + "」</strong> → " + pair[1] + "</li>";
      }).join("");
      html += card(
        "ことばチェック",
        "教会に行ったことのない友達には伝わりにくいかもしれない言葉が " + found.length + "つ見つかりました。<ul style='margin:8px 0 0; padding-left:18px;'>" + rows + "</ul><p style='margin-top:8px;'>使ってはいけないわけではありません。一言説明を添えるか、言い換えを考えてみよう。</p>",
        true
      );
    } else {
      html += card("ことばチェック ✓", "難しい教会用語は見つかりませんでした。そのままの言葉で伝わりそうです。");
    }

    // 4. Pushy phrasing
    var pushyFound = PUSHY.filter(function (p) { return text.indexOf(p) !== -1; });
    if (pushyFound.length) {
      html += card(
        "押しつけていないかチェック",
        "「" + pushyFound.join("」「") + "」という表現がありました。相手に決めさせる余白を残すと、ストーリーはもっと届きます。「自分の場合は」「私はこう感じた」に言い換えられないか見てみよう。",
        true
      );
    } else {
      html += card("押しつけていないかチェック ✓", "自分の体験として語れています。この距離感が一番伝わります。");
    }

    // 5. Friend questions (random 3)
    var pool = FRIEND_QUESTIONS.slice();
    var picked = [];
    while (picked.length < 3 && pool.length) {
      picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    }
    var qHTML = picked.map(function (item) {
      return (
        '<div style="margin-bottom:14px;">' +
        '<p style="font-weight:700;">「' + item.q + "」</p>" +
        '<p class="muted" style="margin-top:4px;">' + item.hint + "</p></div>"
      );
    }).join("");
    html += card("友達からこう聞かれたら？", qHTML + '<p class="muted">完璧に答えられなくて大丈夫。「わからない」と言える正直さも、ストーリーの一部です。</p>');

    el("checkResults").innerHTML = html;
    el("checkResults").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function copyText() {
    var text = fullText();
    if (!text) return;
    var done = function () {
      var btn = el("copyBtn");
      btn.textContent = "コピーしました ✓";
      setTimeout(function () { btn.textContent = "ストーリーをコピーする"; }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, done);
    } else {
      var ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      done();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var draft = loadDraft();
    el("tBefore").value = draft.before || "";
    el("tMeeting").value = draft.meeting || "";
    el("tAfter").value = draft.after || "";

    ["tBefore", "tMeeting", "tAfter"].forEach(function (id) {
      el(id).addEventListener("input", saveDraft);
    });
    el("checkBtn").addEventListener("click", runCheck);
    el("copyBtn").addEventListener("click", copyText);
  });
})();
