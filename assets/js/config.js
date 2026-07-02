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
  };

  // 診断完了時に result.js から呼ばれる。設定済みかつ未送信のときだけ送る。
  global.UFC.submitToGoogleForm = function (participant) {
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
