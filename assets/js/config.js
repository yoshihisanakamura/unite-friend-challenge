/* ==========================================================================
   UNITE Friend Challenge — deployment config
   登録データをGoogleフォームに自動送信するための設定。
   セットアップ手順は管理画面（/admin）の「Googleフォーム連携」を参照。

   1. Googleフォームを作成し、以下の質問を「記述式」で追加する:
        名前 / ニックネーム / 年齢 / 年代 / 性別 / 所属教会 /
        メールアドレス / Discord ID / Mission Type / サブタイプ
   2. フォームの「事前入力したリンクを取得」で全質問にダミー値を入れ、
      発行されたURLから entry.XXXXXXX の番号を各項目に貼り付ける。
   3. action には フォームURLの /viewform を /formResponse に
      置き換えたものを設定する。

   action が空文字のあいだ、送信は行われません（ローカル保存のみ）。

   ▼ Supabase 連携（自動グループマッチング）
   診断完了時に quiz_results へも送信する。マッチングは Supabase 側の
   pg_cron が定期実行し、Discord の 📣｜グループ発表 に自動投稿される。
   ========================================================================== */
(function (global) {
  "use strict";

  global.UFC = global.UFC || {};
  global.UFC.CONFIG = {
    uniteUrl: "https://unitejp.org/",
    discordInvite: "https://discord.gg/ShR6svdjj",
    googleForm: {
      action: "https://docs.google.com/forms/d/e/1FAIpQLSdhASyeUrCepEwweaaklC59xH7zRsH4_QIPo80UQ2TdXmrLog/formResponse",
      entries: {
        name: "entry.971612802",
        nickname: "entry.1790356309",
        age: "entry.1182500104",
        ageRange: "entry.2037889683",
        gender: "entry.217518142",
        church: "entry.1677550446",
        email: "entry.1931334954",
        discordId: "entry.1793730769",
        missionType: "entry.435264063",
        subMissionType: "entry.1492829823",
      },
    },
    supabase: {
      url: "https://bqxniqlvqdemsrozkzui.supabase.co",
      anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxeG5pcWx2cWRlbXNyb3prenVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NzUyMDQsImV4cCI6MjA5OTE1MTIwNH0.lDLCdLFWrlC1kMUZ8S9PJgpYXERJFov4QiRGDcJC80g",
    },
  };

  // Supabase quiz_results へ診断結果を送信（自動グループマッチング用）
  global.UFC.submitToSupabase = function (participant) {
    var cfg = global.UFC.CONFIG.supabase;
    if (!cfg.url || participant.supabaseSent) return;

    var age = parseInt(participant.age, 10);
    if (isNaN(age) || age < 10 || age > 99) age = null;
    var discordName =
      participant.discordId || participant.nickname || participant.name;
    if (!discordName || age === null) return; // 必須項目がなければ送らない

    fetch(cfg.url + "/rest/v1/quiz_results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: cfg.anonKey,
        Authorization: "Bearer " + cfg.anonKey,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        discord_name: String(discordName),
        age: age,
        primary_type: String(participant.missionType || ""),
        secondary_type: String(participant.subMissionType || ""),
        is_borderline: !!participant.borderline,
        scores: participant.scores || null,
      }),
    })
      .then(function (res) {
        if (res.ok) {
          global.UFC.updateParticipant(participant.id, { supabaseSent: true });
        }
      })
      .catch(function () { /* オフライン時は次回結果画面表示時に再送 */ });
  };

  // 診断完了時に result.js から呼ばれる。設定済みかつ未送信のときだけ送る。
  global.UFC.submitToGoogleForm = function (participant) {
    // Supabase（自動マッチング）にも送信
    if (global.UFC.submitToSupabase) global.UFC.submitToSupabase(participant);

    var cfg = global.UFC.CONFIG.googleForm;
    if (!cfg.action || participant.gformSent) return;

    var params = new URLSearchParams();
    Object.keys(cfg.entries).forEach(function (key) {
      var entryId = cfg.entries[key];
      if (!entryId) return;
      var value = participant[key];
      params.append(entryId, value === null || value === undefined ? "" : String(value));
    });

    fetch(cfg.action, { method: "POST", mode: "no-cors", body: params })
      .then(function () {
        global.UFC.updateParticipant(participant.id, { gformSent: true });
      })
      .catch(function () { /* オフライン時は次回結果画面表示時に再送 */ });
  };
})(window);
