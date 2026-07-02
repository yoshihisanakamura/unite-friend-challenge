/* ==========================================================================
   UNITE Friend Challenge — character illustrations v2
   Refined contour line-art: proper proportions (neck, shoulders, tapered
   limbs), solid ink hair shapes for six distinct people, one spot-color
   garment each. Limbs use an outlined-tube technique (ink stroke under a
   paper stroke) for confident single-weight curves.
   ========================================================================== */
(function (global) {
  "use strict";

  var INK = "#201d17";
  var PAPER = "#fffdf6";
  var C = { tomato: "#e8552f", yellow: "#f0b53c", green: "#2f6b4f", pink: "#ef9ebc", sage: "#8fa98a", deep: "#24523c" };

  function tube(d, w) {
    return (
      '<path d="' + d + '" stroke="' + INK + '" stroke-width="' + (w + 4.5) + '" fill="none"/>' +
      '<path d="' + d + '" stroke="' + PAPER + '" stroke-width="' + w + '" fill="none"/>'
    );
  }

  /* ---- hair blobs (drawn UNDER the face so the face ellipse cuts the
     hairline cleanly) ---- */
  var HAIR = {
    crop: '<path d="M83 40 Q80 17 101 16 Q122 17 119 40 Q120 47 113 51 Q101 55 89 51 Q82 47 83 40 Z" fill="' + INK + '"/>',
    bob: '<path d="M83 40 Q80 16 101 15 Q122 16 119 40 Q121 57 113 64 Q101 69 89 64 Q81 57 83 40 Z" fill="' + INK + '"/>',
    pony:
      '<path d="M83 40 Q80 17 101 16 Q122 17 119 40 Q120 48 113 52 Q101 56 89 52 Q82 48 83 40 Z" fill="' + INK + '"/>' +
      '<path d="M117 32 Q131 38 129 55 Q127 67 119 68 Q125 54 116 42 Z" fill="' + INK + '"/>',
    bun:
      '<path d="M83 40 Q80 17 101 16 Q122 17 119 40 Q120 47 113 51 Q101 55 89 51 Q82 47 83 40 Z" fill="' + INK + '"/>' +
      '<circle cx="101" cy="13" r="7" fill="' + INK + '"/>',
    cap:
      '<path d="M83 40 Q80 18 101 17 Q122 18 119 40 Q120 46 114 49 Q101 53 88 49 Q82 46 83 40 Z" fill="' + INK + '"/>' +
      '<path d="M114 31 L136 36 Q138 41 131 41 L112 38 Z" fill="' + INK + '"/>' +
      '<circle cx="101" cy="22" r="2.2" fill="' + PAPER + '"/>',
    curl:
      '<path d="M83 40 Q80 17 101 16 Q122 17 119 40 Q120 47 113 51 Q101 55 89 51 Q82 47 83 40 Z" fill="' + INK + '"/>' +
      '<path d="M85 22 q-7 1 -5 9" stroke="' + INK + '" stroke-width="3" fill="none"/>',
  };

  function head(hairKey) {
    return (
      HAIR[hairKey] +
      '<ellipse cx="101" cy="44" rx="15.5" ry="17.5" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="3"/>' +
      (hairKey === "bob"
        ? '<path d="M86 36 Q94 28 108 30 Q114 32 116 37 Q106 31 96 33 Q90 34 86 40 Z" fill="' + INK + '"/>'
        : '<path d="M87 34 Q95 27 107 29 Q113 31 115 36 Q105 30 96 32 Q90 33 87 38 Z" fill="' + INK + '"/>')
    );
  }

  var NECK = tube("M101 60 L101 70", 7);
  var TEE =
    '<path d="M83 71 Q101 65 119 71 Q127 75 126 86 L124 116 Q101 122 78 116 L76 86 Q75 75 83 71 Z" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="3"/>';

  function pants(color) {
    return (
      '<path d="M82 116 L120 116 Q123 140 121 163 L105 163 L102 136 L99 163 L83 163 Q79 140 82 116 Z" fill="' + color + '" stroke="' + INK + '" stroke-width="2.5"/>' +
      '<path d="M82 163 Q80 171 88 171 L98 171 Q101 167 99 163 Z" fill="' + INK + '"/>' +
      '<path d="M104 163 Q102 171 110 171 L120 171 Q123 167 121 163 Z" fill="' + INK + '"/>'
    );
  }

  var ARM_L_DOWN = tube("M84 76 C78 88 76 102 79 114", 5.5);
  var ARM_R_DOWN = tube("M118 76 C124 88 126 102 123 114", 5.5);

  /* ---- per-type figures ---- */
  var TYPES = {};

  TYPES.Spark = function () {
    return (
      head("crop") + NECK + TEE + pants(C.tomato) +
      ARM_L_DOWN +
      tube("M118 76 C127 68 131 56 131 44", 5.5) +
      '<path d="M131 34 L131 24 M123 36 L116 29 M139 36 L146 29 M123 44 L114 46 M139 44 L148 46" stroke="' + C.tomato + '" stroke-width="3.2" fill="none"/>'
    );
  };

  TYPES.Bridge = function () {
    return (
      head("curl") + NECK + TEE + pants(C.yellow) +
      ARM_L_DOWN +
      tube("M118 76 C126 86 121 95 111 97", 5.5) +
      '<rect x="103" y="87" width="11" height="19" rx="2.5" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="2.5"/>' +
      '<line x1="106" y1="101" x2="111" y2="101" stroke="' + INK + '" stroke-width="1.8"/>' +
      '<path d="M129 70 h19 a5 5 0 0 1 5 5 v7 a5 5 0 0 1 -5 5 h-8 l-6 7 v-7 h-5 a5 5 0 0 1 -5 -5 v-7 a5 5 0 0 1 5 -5 z" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="2.3"/>' +
      '<circle cx="133" cy="78.5" r="1.6" fill="' + INK + '"/><circle cx="139" cy="78.5" r="1.6" fill="' + INK + '"/><circle cx="145" cy="78.5" r="1.6" fill="' + INK + '"/>'
    );
  };

  TYPES.Shepherd = function () {
    return (
      head("bob") + NECK + TEE + pants(C.green) +
      tube("M84 76 C80 90 86 99 95 101", 5.5) +
      tube("M118 76 C122 90 116 99 107 101", 5.5) +
      '<path d="M92 97 L110 97 L108 112 Q101 115 94 112 Z" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="2.5"/>' +
      '<rect x="93" y="100" width="16" height="4" fill="' + C.green + '"/>' +
      '<path d="M97 91 q2 -5 0 -9 M105 91 q2 -5 0 -9" stroke="' + INK + '" stroke-width="2" fill="none"/>'
    );
  };

  TYPES.Story = function () {
    return (
      head("pony") + NECK + TEE + pants(C.pink) +
      tube("M84 76 C80 90 87 98 96 100", 5.5) +
      tube("M118 76 C122 90 115 98 106 100", 5.5) +
      '<path d="M101 97 Q92 93 84 97 L86 111 Q94 107 101 111 Q108 107 116 111 L118 97 Q110 93 101 97 Z" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="2.5"/>' +
      '<line x1="101" y1="97" x2="101" y2="111" stroke="' + INK + '" stroke-width="2"/>'
    );
  };

  TYPES.Builder = function () {
    return (
      head("cap") + NECK + TEE + pants(C.sage) +
      tube("M84 76 C77 86 76 96 80 106", 5.5) +
      ARM_R_DOWN +
      '<g transform="rotate(-8 84 104)">' +
      '<rect x="71" y="87" width="26" height="34" rx="3" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="2.5"/>' +
      '<rect x="79" y="83" width="10" height="7" rx="2" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="2.2"/>' +
      '<path d="M76 98 h16 M76 105 h12" stroke="' + INK + '" stroke-width="2" fill="none"/>' +
      '<path d="M76 112 l3 3 5 -6" stroke="' + INK + '" stroke-width="2" fill="none"/>' +
      "</g>"
    );
  };

  TYPES.Prayer = function () {
    return (
      head("bun") + NECK + TEE + pants(C.deep) +
      tube("M84 76 C79 92 86 102 97 105", 5.5) +
      tube("M118 76 C123 92 116 102 105 105", 5.5) +
      '<path d="M95 99 Q101 94 107 99 L104 112 Q101 115 98 112 Z" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="2.5"/>' +
      '<line x1="101" y1="99" x2="101" y2="112" stroke="' + INK + '" stroke-width="1.8"/>' +
      '<path d="M83 20 l0 -6 M77 26 l-5 -4 M125 24 l5 -5" stroke="' + C.yellow + '" stroke-width="2.6" fill="none"/>'
    );
  };

  function renderInner(typeKey) {
    var fn = TYPES[typeKey];
    return fn ? fn() : "";
  }

  function render(typeKey) {
    var inner = renderInner(typeKey);
    if (!inner) return "";
    return (
      '<svg viewBox="0 0 200 190" xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
      '<g transform="translate(0,4)">' + inner + "</g></svg>"
    );
  }

  global.UFC = global.UFC || {};
  global.UFC.Characters = { render: render, renderInner: renderInner };
})(window);
