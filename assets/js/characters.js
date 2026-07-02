/* ==========================================================================
   UNITE Friend Challenge — mission type motifs v3
   Abstract hand-drawn symbols (no people): one ink-outlined shape with a
   single spot color per type. Same API as before: render() returns a full
   <svg>, renderInner() returns raw markup for embedding in larger scenes.
   ========================================================================== */
(function (global) {
  "use strict";

  var INK = "#201d17";
  var PAPER = "#fffdf6";
  var C = { tomato: "#e8552f", yellow: "#f0b53c", green: "#2f6b4f", pink: "#ef9ebc", sage: "#8fa98a", deep: "#24523c" };

  var TYPES = {};

  /* Spark — a burst of light: the first move that sets things off */
  TYPES.Spark = function () {
    return (
      '<circle cx="100" cy="92" r="12" fill="' + C.tomato + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M100 66 L100 42 M100 118 L100 142 M74 92 L50 92 M126 92 L150 92" stroke="' + INK + '" stroke-width="4.5" fill="none"/>' +
      '<path d="M81 73 L66 58 M119 73 L134 58 M81 111 L66 126 M119 111 L134 126" stroke="' + INK + '" stroke-width="3.5" fill="none"/>' +
      '<circle cx="143" cy="52" r="3.5" fill="' + C.tomato + '"/>' +
      '<circle cx="57" cy="130" r="3" fill="' + C.tomato + '"/>'
    );
  };

  /* Bridge — an arch connecting two banks */
  TYPES.Bridge = function () {
    return (
      '<path d="M35 122 Q100 34 165 122 L142 122 Q100 66 58 122 Z" fill="' + C.yellow + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<circle cx="45" cy="134" r="6" fill="' + INK + '"/>' +
      '<circle cx="155" cy="134" r="6" fill="' + INK + '"/>' +
      '<path d="M72 142 q9 -6 18 0 q9 6 18 0 q9 -6 18 0" stroke="' + INK + '" stroke-width="2.5" fill="none"/>'
    );
  };

  /* Shepherd — an umbrella sheltering a small one */
  TYPES.Shepherd = function () {
    return (
      '<path d="M52 96 Q100 42 148 96 Q133 85 117 96 Q109 88 100 96 Q91 88 83 96 Q67 85 52 96 Z" fill="' + C.green + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M100 96 L100 132 q0 10 10 10 q8 0 8 -8" stroke="' + INK + '" stroke-width="4" fill="none"/>' +
      '<path d="M100 42 L100 34" stroke="' + INK + '" stroke-width="4" fill="none"/>' +
      '<circle cx="76" cy="126" r="7" fill="' + C.pink + '" stroke="' + INK + '" stroke-width="2.5"/>'
    );
  };

  /* Story — a speech bubble carrying a heart */
  TYPES.Story = function () {
    return (
      '<path d="M58 56 h84 a15 15 0 0 1 15 15 v36 a15 15 0 0 1 -15 15 h-46 l-17 20 v-20 h-21 a15 15 0 0 1 -15 -15 v-36 a15 15 0 0 1 15 -15 z" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M100 82 c-5 -10 -20 -7 -20 4 c0 9 11 15 20 22 c9 -7 20 -13 20 -22 c0 -11 -15 -14 -20 -4 z" fill="' + C.pink + '" stroke="' + INK + '" stroke-width="2.5"/>'
    );
  };

  /* Builder — balanced stones, carefully stacked */
  TYPES.Builder = function () {
    return (
      '<rect x="60" y="114" width="80" height="30" rx="15" fill="' + C.sage + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<rect x="73" y="84" width="54" height="28" rx="14" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<rect x="84" y="58" width="32" height="24" rx="12" fill="' + C.sage + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M100 46 l0 -9 M88 50 l-6 -6 M112 50 l6 -6" stroke="' + INK + '" stroke-width="2.6" fill="none"/>'
    );
  };

  /* Prayer — a quiet candle, kept burning */
  TYPES.Prayer = function () {
    return (
      '<path d="M100 44 q11 13 7 24 q-2 9 -7 9 q-5 0 -7 -9 q-4 -11 7 -24 z" fill="' + C.yellow + '" stroke="' + INK + '" stroke-width="2.5"/>' +
      '<path d="M100 84 L100 77" stroke="' + INK + '" stroke-width="3" fill="none"/>' +
      '<rect x="87" y="84" width="26" height="52" rx="6" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M72 136 h56 q3 10 -9 12 h-38 q-12 -2 -9 -12 z" fill="' + C.deep + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M70 56 l-8 -5 M130 56 l8 -5" stroke="' + C.yellow + '" stroke-width="3" fill="none"/>'
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
      inner + "</svg>"
    );
  }

  global.UFC = global.UFC || {};
  global.UFC.Characters = { render: render, renderInner: renderInner };
})(window);
