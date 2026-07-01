(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    var wrap = document.getElementById("resourceList");
    wrap.innerHTML = UFC.RESOURCES.map(function (r) {
      return (
        '<div class="card resource-card">' +
        '<div class="r-title">' + r.title + "</div>" +
        '<p class="small" style="margin-top:8px;">' + r.description + "</p>" +
        '<p class="small r-target"><strong>対象：</strong>' + r.target + "</p>" +
        '<div class="resource-caution">' + r.caution + "</div>" +
        (r.link
          ? '<a class="resource-link" href="' + r.link + '" target="_blank" rel="noopener">公式サイトを見る →</a>'
          : '<p class="small muted" style="margin-top:12px;">公式リンク：ユースリーダーや教会に確認してみよう</p>') +
        '<p class="small muted" style="margin-top:10px;">迷ったら、牧師先生・ユースリーダー・信頼できるクリスチャンの先輩に相談しよう。</p>' +
        "</div>"
      );
    }).join("");
  });
})();
