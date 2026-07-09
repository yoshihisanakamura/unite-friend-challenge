/* ==========================================================================
   UNITE Friend Challenge — AIストーリーコーチ
   Supabase Edge Function (testimony-ai) 経由で Gemini に接続。
   APIキーはサーバー側にのみ保存され、このファイルには含まれない。
   ========================================================================== */
(function () {
  "use strict";

  var FN_URL = "https://bqxniqlvqdemsrozkzui.supabase.co/functions/v1/testimony-ai";
  var ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxeG5pcWx2cWRlbXNyb3prenVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NzUyMDQsImV4cCI6MjA5OTE1MTIwNH0.lDLCdLFWrlC1kMUZ8S9PJgpYXERJFov4QiRGDcJC80g";

  function el(id) { return document.getElementById(id); }

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function softCard(msg) {
    return '<div class="card card-soft" style="margin-top:14px;"><div class="small">' + msg + "</div></div>";
  }

  function render(text) {
    var html = esc(text)
      .replace(/【([^】]+)】/g, '<p style="font-weight:800; margin-top:14px;">【$1】</p>')
      .replace(/\n/g, "<br/>");
    return (
      '<div class="card" style="margin-top:14px;">' +
      '<p style="font-weight:800; font-size:0.9rem;">🤖 AIコーチからのフィードバック</p>' +
      '<div class="small" style="margin-top:8px; line-height:1.9;">' + html + "</div>" +
      '<p class="muted small" style="margin-top:10px;">AIの提案はあくまでヒント。最終的には、あなた自身の言葉がいちばん伝わります。</p>' +
      "</div>"
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = el("aiBtn");
    var out = el("aiResults");
    if (!btn || !out) return;

    btn.addEventListener("click", function () {
      var before = el("tBefore").value.trim();
      var meeting = el("tMeeting").value.trim();
      var after = el("tAfter").value.trim();

      if ((before + meeting + after).replace(/\s/g, "").length < 20) {
        out.innerHTML = softCard("もう少し書けたら、AIコーチに見てもらおう。どれか1つの箱に1〜2文でも大丈夫！");
        return;
      }

      btn.disabled = true;
      var orig = btn.textContent;
      btn.textContent = "AIコーチが読んでいます…";

      fetch(FN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + ANON_KEY,
          apikey: ANON_KEY,
        },
        body: JSON.stringify({ before: before, meeting: meeting, after: after }),
      })
        .then(function (r) {
          return r.json().then(function (d) { return { ok: r.ok, d: d }; });
        })
        .then(function (res) {
          if (res.ok && res.d && res.d.feedback) {
            out.innerHTML = render(res.d.feedback);
          } else {
            out.innerHTML = softCard("AIコーチにつながりませんでした。少し時間をおいて、もう一度試してみてください。");
          }
          out.scrollIntoView({ behavior: "smooth", block: "nearest" });
        })
        .catch(function () {
          out.innerHTML = softCard("通信エラーが起きました。電波の良いところで、もう一度試してみてください。");
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = orig;
        });
    });
  });
})();
