/* ==========================================================================
   UNITE Friend Challenge — character illustrations
   Minimal black line-art placeholders, one component per Mission Type.
   Swap the markup inside each function later for final artwork without
   touching any page markup — every page only calls UFC.Characters.render().
   ========================================================================== */
(function (global) {
  "use strict";

  var STROKE = '#111111';

  function svgOpen(extra) {
    return (
      '<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" fill="none" ' +
      'stroke="' + STROKE + '" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" ' +
      (extra || '') + '>'
    );
  }
  var SVG_CLOSE = '</svg>';

  // shared head + torso silhouette
  function base(faceInner) {
    return (
      '<circle cx="100" cy="56" r="26"/>' +
      (faceInner || '') +
      '<path d="M72,196 L72,142 Q72,97 100,97 Q128,97 128,142 L128,196"/>'
    );
  }

  var faces = {
    open: '<circle cx="90" cy="54" r="1.8" fill="' + STROKE + '" stroke="none"/><circle cx="110" cy="54" r="1.8" fill="' + STROKE + '" stroke="none"/>',
    closed: '<path d="M85,54 q5,4 10,0" stroke-width="3.5"/><path d="M105,54 q5,4 10,0" stroke-width="3.5"/>',
  };

  var TYPES = {};

  // ---- Spark: hand raised, small spark near it, other arm relaxed ----
  TYPES.Spark = function () {
    return (
      svgOpen() +
      base(faces.open) +
      '<path d="M76,122 Q68,145 70,172"/>' + // left arm down
      '<path d="M126,116 Q146,100 152,74"/>' + // right arm raised
      '<path d="M152,60 L152,50 M144,58 L136,50 M160,58 L168,50 M144,66 L134,70 M160,66 L170,70"/>' + // spark burst
      SVG_CLOSE
    );
  };

  // ---- Bridge: phone in both hands, chat bubble above ----
  TYPES.Bridge = function () {
    return (
      svgOpen() +
      base(faces.open) +
      '<path d="M78,120 Q86,140 92,152"/>' +
      '<path d="M122,118 Q112,138 108,152"/>' +
      '<rect x="88" y="150" width="24" height="38" rx="6"/>' +
      '<line x1="96" y1="180" x2="104" y2="180"/>' +
      '<path d="M120,96 h30 a6,6 0 0 1 6,6 v16 a6,6 0 0 1 -6,6 h-16 l-8,9 v-9 h-6 a6,6 0 0 1 -6,-6 v-16 a6,6 0 0 1 6,-6 z" stroke-width="4.5"/>' +
      '<line x1="128" y1="110" x2="146" y2="110" stroke-width="3.5"/>' +
      '<line x1="128" y1="117" x2="140" y2="117" stroke-width="3.5"/>' +
      SVG_CLOSE
    );
  };

  // ---- Shepherd: coffee cup held with both hands, listening tilt ----
  TYPES.Shepherd = function () {
    return (
      svgOpen() +
      base(faces.open) +
      '<path d="M80,118 Q86,138 90,150"/>' +
      '<path d="M120,118 Q114,138 110,150"/>' +
      '<rect x="86" y="148" width="30" height="26" rx="5"/>' +
      '<path d="M116,153 q14,-2 12,12 q-2,10 -12,8" stroke-width="4"/>' +
      '<path d="M92,138 q3,-8 0,-14 M102,138 q3,-8 0,-14" stroke-width="3.5"/>' +
      SVG_CLOSE
    );
  };

  // ---- Story: arm out mid-gesture, speech heart nearby ----
  TYPES.Story = function () {
    return (
      svgOpen() +
      base(faces.open) +
      '<path d="M78,120 Q70,142 74,168"/>' +
      '<path d="M124,114 Q146,108 162,100"/>' +
      '<path d="M160,92 a9,9 0 0 1 18,0 q0,9 -9,16 q-9,-7 -9,-16 z" stroke-width="4"/>' +
      '<path d="M84,150 h20 M84,158 h14" stroke-width="3.5"/>' +
      SVG_CLOSE
    );
  };

  // ---- Builder: clipboard with checklist, pen hand ----
  TYPES.Builder = function () {
    return (
      svgOpen() +
      base(faces.open) +
      '<path d="M78,120 Q84,140 90,150"/>' +
      '<path d="M122,118 Q130,132 138,140"/>' +
      '<rect x="80" y="140" width="40" height="50" rx="6"/>' +
      '<rect x="92" y="134" width="16" height="10" rx="3"/>' +
      '<line x1="88" y1="160" x2="112" y2="160" stroke-width="3.5"/>' +
      '<path d="M88,171 l4,4 l7,-8" stroke-width="3.5"/>' +
      '<line x1="102" y1="172" x2="112" y2="172" stroke-width="3.5"/>' +
      '<line x1="136" y1="140" x2="146" y2="128"/>' +
      SVG_CLOSE
    );
  };

  // ---- Prayer: closed eyes, hands together, quiet star above ----
  TYPES.Prayer = function () {
    return (
      svgOpen() +
      base(faces.closed) +
      '<path d="M80,120 Q88,140 98,150"/>' +
      '<path d="M120,120 Q112,140 102,150"/>' +
      '<path d="M100,148 L100,180 M92,152 L100,180 L108,152" stroke-width="4"/>' +
      '<path d="M100,22 L100,12 M94,18 L88,12 M106,18 L112,12" stroke-width="3.5"/>' +
      SVG_CLOSE
    );
  };

  function render(typeKey) {
    var fn = TYPES[typeKey];
    return fn ? fn() : '';
  }

  global.UFC = global.UFC || {};
  global.UFC.Characters = { render: render };
})(window);
