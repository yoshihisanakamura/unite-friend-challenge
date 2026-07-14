(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    var wrap = document.getElementById("resourceList");
    wrap.innerHTML = UFC.RESOURCES.map(function (r) {
      var iconHtml;
      if (r.icon) {
        iconHtml =
          '<div class="r-icon">' +
          '<img src="' + r.icon + '" alt="" loading="lazy" ' +
          'onerror="this.parentNode.classList.add(\'fallback\')" />' +
          '<span class="r-initial">' + (r.initial || r.title.charAt(0)) + "</span>" +
          "</div>";
      } else if (r.emoji) {
        iconHtml = '<div class="r-icon r-icon-emoji">' + r.emoji + "</div>";
      } else {
        iconHtml =
          '<div class="r-icon fallback"><span class="r-initial">' +
          (r.initial || r.title.charAt(0)) +
          "</span></div>";
      }
      return (
        '<div class="card resource-card">' +
        '<div class="r-head">' +
        iconHtml +
        '<div class="r-titles">' +
        '<div class="r-title">' + r.title + "</div>" +
        (r.sub ? '<div class="r-sub">' + r.sub + "</div>" : "") +
        "</div>" +
        "</div>" +
        '<p class="small" style="margin-top:12px;">' + r.description + "</p>" +
        '<p class="small r-target"><strong>対象：</strong>' + r.target + "</p>" +
        '<div class="resource-caution">' + r.caution + "</div>" +
        (r.link
          ? '<a class="resource-link" href="' + r.link + '" target="_blank" rel="noopener">' + (r.linkLabel || "公式サイトを見る →") + "</a>"
          : '<p class="small muted" style="margin-top:12px;">公式リンク：ユースリーダーや教会に確認してみよう</p>') +
        '<p class="small muted" style="margin-top:10px;">迷ったら、牧師先生・ユースリーダー・信頼できるクリスチャンの先輩に相談しよう。</p>' +
        "</div>"
      );
    }).join("");
  });
})();
