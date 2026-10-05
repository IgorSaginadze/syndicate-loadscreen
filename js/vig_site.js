/* КОПИЯ С САЙТА (site/js/vig_site.js) - build/lssite.py; здесь не править, cqw переведены в px */
/* vig_site.js - живые схемы, которых нет на экране загрузки: шахта и метлаба.
 *
 * Тот же договор, что у shared/js/vig1.js: VIG[id].html() отдаёт SVG 730x530,
 * run(root, T) расставляет классы по времени (VK.Timeline), CSS - css/vig_site.css.
 * Цифры - из игры: шахта - Рудник-инструкция.md (6 шпуров, сирена 10 с, куча 9 т,
 * цепочка урана дробилка-мельница-стол-бак, бочка кека 17 кг), метлаба -
 * МЕТЛАБ-инструкция.md (цепочка ЯС-1 -> Р-20 -> Т-4 -> КШ-4 -> СФ-1, пороги
 * сортов 75/90/97 %, цены скупщика $/г). Химия в игре вымышленная - здесь тоже.
 */
var VIG_SITE = (function () {
  'use strict';
  var K = VK;
  function f1(v) { return v.toFixed(1).replace('.', ','); }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }

  // ── ШАХТА: забой -> взрыв -> вагонетка -> опрокидыватель -> завод -> АЭС ─────
  // Разрез штрека: порода сверху и снизу, крепь со стойками и раскосами, две лампы
  // со светом на рельсы, пыль в воздухе. Взрыв - вспышка, ударная волна, облако пыли
  // и отступивший забой (выемка). Бункер под опрокидывателем, лента в дробилку сверху.
  var FACE = 468, RAIL = 292, TIPX = 70, TIPY = 258, PILEX = 300;
  var HOLES = [135, 155, 175, 195, 215, 235];
  function cartSVG() {
    return '<g class="mn-cart" transform="translate(' + TIPX + ',' + RAIL + ')">' +
      '<clipPath id="mnCartClip"><path d="M-33-40H33L24-9H-24Z"/></clipPath>' +
      '<g clip-path="url(#mnCartClip)"><g class="mn-load" transform="translate(0,38)"><rect x="-36" y="-40" width="72" height="34" fill="url(#mnOre)"/>' +
      '<path d="M-36-40l7-5 6 4 8-6 7 5 9-5 6 4 8-5 7 4 6-3V-36H-36Z" fill="#D9EA66"/></g></g>' +
      '<path d="M-36-42H36L26-8H-26Z" fill="rgba(20,28,24,.35)" stroke="#8E9A94" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M-20-41L-15-9M0-41V-9M20-41L15-9" stroke="#56645D" stroke-width="1.2"/>' +
      '<path d="M-37-42H37" stroke="#DDE6E1" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M-22-8V-2M22-8V-2" stroke="#56645D" stroke-width="2"/>' +
      '<g class="mn-wh"><circle cx="-16" cy="-4" r="5" fill="#2A3731" stroke="#AEB8B3" stroke-width="1.5"/><path d="M-19-4h6" stroke="#AEB8B3"/></g>' +
      '<g class="mn-wh"><circle cx="16" cy="-4" r="5" fill="#2A3731" stroke="#AEB8B3" stroke-width="1.5"/><path d="M13-4h6" stroke="#AEB8B3"/></g>' +
      '<text x="0" y="-50" text-anchor="middle" class="mn-cl">ВГ-0,3 · <tspan class="mn-cw">0,0</tspan> т</text></g>';
  }
  function plantNode(x, name, sub, icon, i) {
    return '<g class="mn-n mn-n' + i + '"><rect class="mn-nb" x="' + (x - 54) + '" y="368" width="108" height="66" rx="3" fill="#0A100D" stroke="#2E3F37" stroke-width="1.5"/>' +
      '<rect class="mn-ng" x="' + (x - 54) + '" y="368" width="108" height="66" rx="3" fill="url(#mnNode)"/>' +
      icon + '<circle class="mn-led" cx="' + (x + 44) + '" cy="378" r="3.5" fill="#2A3731"/>' +
      '<text x="' + x + '" y="452" text-anchor="middle" class="mn-nl">' + name + '</text>' +
      '<text x="' + x + '" y="466" text-anchor="middle" class="v-d">' + sub + '</text></g>';
  }
  function timber(x) {
    return '<g class="mn-tb"><path d="M' + (x - 18) + ' 66V' + RAIL + 'M' + (x + 18) + ' 64V' + RAIL + '" stroke="#4A3626" stroke-width="6"/>' +
      '<path d="M' + (x - 20) + ' 66V' + RAIL + 'M' + (x + 16) + ' 64V' + RAIL + '" stroke="#6B4E35" stroke-width="1"/>' +
      '<path d="M' + (x - 26) + ' 68H' + (x + 26) + '" stroke="#4A3626" stroke-width="7"/><path d="M' + (x - 26) + ' 65H' + (x + 26) + '" stroke="#6B4E35" stroke-width="1"/>' +
      '<path d="M' + (x - 18) + ' 96L' + (x - 4) + ' 71M' + (x + 18) + ' 96L' + (x + 4) + ' 71" stroke="#3E2D20" stroke-width="4"/></g>';
  }
  function lamp(x, cls) {
    return '<g class="mn-lamp-g ' + (cls || '') + '"><path d="M' + (x - 5) + ' 104L' + (x - 70) + ' ' + RAIL + 'H' + (x + 70) + 'L' + (x + 5) + ' 104Z" fill="url(#mnCone)"/>' +
      '<ellipse cx="' + x + '" cy="' + (RAIL + 1) + '" rx="64" ry="5" fill="#FFC46E" opacity=".08"/>' +
      '<path d="M' + x + ' 89V98" stroke="#3C4742" stroke-width="1.5"/><circle cx="' + x + '" cy="103" r="22" fill="url(#mnLampG)"/>' +
      '<path d="M' + (x - 6) + ' 98H' + (x + 6) + 'L' + (x + 4) + ' 104H' + (x - 4) + 'Z" fill="#3C4742"/><circle cx="' + x + '" cy="105" r="3" fill="#FFE2A8"/></g>';
  }
  VIG.mine = {
    html: function () {
      var o = K.DEFS + '<defs>' +
        '<linearGradient id="mnOre" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D3E35A"/><stop offset="1" stop-color="#6E8128"/></linearGradient>' +
        '<linearGradient id="mnTunBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A0F0C"/><stop offset=".7" stop-color="#070A08"/><stop offset="1" stop-color="#0C110E"/></linearGradient>' +
        '<linearGradient id="mnCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFC46E" stop-opacity=".2"/><stop offset="1" stop-color="#FFC46E" stop-opacity="0"/></linearGradient>' +
        '<radialGradient id="mnLampG"><stop offset="0" stop-color="#FFD08A" stop-opacity=".55"/><stop offset="1" stop-color="#FFD08A" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="mnGlowU"><stop offset="0" stop-color="#C8DC4E" stop-opacity=".55"/><stop offset="1" stop-color="#C8DC4E" stop-opacity="0"/></radialGradient>' +
        '<linearGradient id="mnNode" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2ECC71" stop-opacity=".14"/><stop offset="1" stop-color="#2ECC71" stop-opacity="0"/></linearGradient>' +
        '<filter id="mnBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>' +
        '<pattern id="mnRock" width="28" height="24" patternUnits="userSpaceOnUse"><rect width="28" height="24" fill="#0D1411"/>' +
        '<path d="M0 8l10-4 7 6 11-3M2 20l8-3 6 4 12-4" stroke="#18241E" fill="none"/><circle cx="21" cy="15" r="1" fill="#1D2A23"/><circle cx="6" cy="13" r=".8" fill="#1D2A23"/></pattern>' +
        '<pattern id="mnSeam" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#28320F"/><path d="M3 5l2-2 2 2-2 2Z" fill="#C8DC4E"/><circle cx="12" cy="11" r="1.2" fill="#A9BE3C"/><circle cx="10" cy="3" r=".9" fill="#E4F07A"/><circle cx="5" cy="13" r=".7" fill="#8FA232"/></pattern>' +
        '<clipPath id="mnTun"><path d="M22 300V70Q245 48 ' + (FACE + 60) + ' 66V300Z"/></clipPath>' +
        '</defs>';
      o += K.head('УЧАСТОК № 4 · ЗАБОЙ → ВАГОНЕТКА → ЗАВОД', '<tspan class="mn-st">РАЗВЕДКА: Cu? Fe? U!</tspan>');
      // массив породы и выработка в нём
      o += '<rect x="22" y="42" width="686" height="274" fill="url(#mnRock)"/>';
      o += '<path class="mn-seam" d="M' + (FACE - 3) + ' 146Q590 136 708 150V228Q590 236 ' + (FACE - 3) + ' 226Z" fill="url(#mnSeam)"/>';
      o += '<path d="M' + (FACE - 3) + ' 146Q590 136 708 150M' + (FACE - 3) + ' 226Q590 236 708 228" stroke="#C8DC4E" stroke-opacity=".35" fill="none"/>';
      o += '<rect x="574" y="156" width="128" height="32" fill="#050706" opacity=".78"/><text x="696" y="168" text-anchor="end" class="mn-sl">ПЛАСТ · U 0,9 %</text><text x="696" y="182" text-anchor="end" class="mn-sl2">720 т ДО КОНЦА ЖИЛЫ</text>';
      o += '<path d="M22 300V70Q245 48 ' + (FACE + 2) + ' 66L' + (FACE + 2) + ' 104L' + (FACE - 3) + ' 150L' + (FACE + 3) + ' 205L' + (FACE - 4) + ' 250L' + FACE + ' 300Z" fill="url(#mnTunBg)"/>';
      o += '<path d="M22 70Q245 48 ' + (FACE + 2) + ' 66" stroke="#2E3F37" stroke-width="2" fill="none"/>';
      o += '<path d="M' + (FACE + 2) + ' 66L' + (FACE + 2) + ' 104L' + (FACE - 3) + ' 150L' + (FACE + 3) + ' 205L' + (FACE - 4) + ' 250L' + FACE + ' 300" stroke="#3C4742" stroke-width="1.5" fill="none"/>';
      // затяжка кровли между рамами
      for (var lg = 40; lg < FACE - 10; lg += 14) o += '<path d="M' + lg + ' ' + (64 - 9 * Math.sin((lg - 22) / (FACE - 20) * Math.PI)).toFixed(1) + 'v6" stroke="#3E2D20" stroke-width="3"/>';
      // свет ламп - под крепью, чтобы стойки ложились тенью
      o += lamp(225, 'mn-lit') + lamp(352, '');
      [160, 290, 410].forEach(function (x) { o += timber(x); });
      // воздух
      o += '<path d="M22 86H' + (FACE - 8) + '" stroke="#56645D" stroke-width="5"/><path d="M22 85H' + (FACE - 8) + '" stroke="#8E9A94" stroke-width="1"/>';
      o += '<g transform="translate(398,86)"><rect x="-5" y="-9" width="10" height="18" fill="#2A3731" stroke="#6E7A74"/><path d="M-9-9H9" stroke="#E74C3C" stroke-width="2.5"/></g>';
      o += '<text x="34" y="80" class="v-d">ВОЗДУХ 6 АТМ</text>';
      // пыль в воздухе
      o += '<g class="mn-motes">';
      for (var m = 0; m < 14; m++) o += '<circle class="mn-mote" cx="' + (40 + (m * 97) % 410) + '" cy="' + (120 + (m * 53) % 160) + '" r="' + (0.8 + (m % 3) * 0.4) + '" style="animation-delay:-' + (m * 0.7).toFixed(1) + 's"/>';
      o += '</g>';
      // сирена на стойке и красный отсвет на время отсчёта
      o += '<rect class="mn-wash" x="22" y="56" width="' + (FACE - 22) + '" height="' + (RAIL - 52) + '" fill="#E74C3C" clip-path="url(#mnTun)"/>';
      o += '<g class="mn-siren"><rect x="296" y="104" width="12" height="9" fill="#2A3731"/><circle cx="302" cy="118" r="7" class="mn-lamp" fill="#3A2A18"/></g>';
      // опасная зона: 8,5 м от забоя
      o += '<g class="mn-zone" clip-path="url(#mnTun)"><circle cx="' + FACE + '" cy="200" r="150" fill="rgba(231,76,60,.06)" stroke="#E74C3C" stroke-width="1.5" stroke-dasharray="6 6"/></g>';
      o += '<text class="mn-zl" x="' + (FACE - 158) + '" y="150" text-anchor="end">8,5 М — НИКОГО</text>';
      // шпуры
      o += '<g class="mn-holes">' + HOLES.map(function (y, i) {
        return '<g class="mn-h mn-h' + i + '"><path d="M' + (FACE + 2) + ' ' + y + 'H' + (FACE + 64) + '" stroke="#050706" stroke-width="5" stroke-linecap="round"/>' +
          '<path class="mn-chg" d="M' + (FACE + 34) + ' ' + y + 'H' + (FACE + 62) + '" stroke="#E67E22" stroke-width="3" stroke-linecap="round"/></g>';
      }).join('') + '</g>';
      // выемка после взрыва: забой отступил
      o += '<path class="mn-crater" d="M' + (FACE - 4) + ' 70L' + (FACE + 26) + ' 76L' + (FACE + 38) + ' 118L' + (FACE + 30) + ' 160L' + (FACE + 44) + ' 204L' + (FACE + 32) + ' 252L' + (FACE + 40) + ' 300H' + (FACE - 4) + 'Z" fill="url(#mnTunBg)" stroke="#3C4742" stroke-width="1.5"/>';
      // перфоратор: шланг от магистрали
      o += '<g class="mn-drill" transform="translate(0,' + HOLES[0] + ')"><path d="M398 -40Q400 -10 420 0" stroke="#3C4742" stroke-width="2.5" fill="none"/>' +
        '<rect x="414" y="-7" width="36" height="14" rx="2" fill="#56645D" stroke="#8E9A94"/><rect x="420" y="-11" width="8" height="5" fill="#8E9A94"/>' +
        '<path class="mn-bit" d="M450 0H' + (FACE + 6) + '" stroke="#C9D1CD" stroke-width="2.5"/></g>';
      // подошва и рельсы (заходят в люльку опрокидывателя)
      o += '<path d="M22 297H' + (FACE + 2) + 'V302H22Z" fill="#141B17"/>';
      for (var s = 26; s < FACE; s += 22) o += '<path d="M' + s + ' ' + (RAIL + 4) + 'h13" stroke="#3E2D20" stroke-width="4"/>';
      o += '<path d="M22 ' + RAIL + 'H' + FACE + '" stroke="#8E9A94" stroke-width="3"/><path d="M22 ' + (RAIL - 1) + 'H' + FACE + '" stroke="#C9D1CD" stroke-width=".8"/>';
      // машинка и провод
      o += '<path class="mn-wire" d="M213 ' + (RAIL - 10) + 'Q330 ' + (RAIL - 2) + ' ' + (FACE + 30) + ' 236" stroke="#E74C3C" stroke-width="1.5" fill="none" stroke-dasharray="4 4"/>';
      o += '<g class="mn-box"><rect x="196" y="' + (RAIL - 20) + '" width="28" height="18" fill="#3B2E22" stroke="#8C6D2C"/><path class="mn-plg" d="M210 ' + (RAIL - 20) + 'V' + (RAIL - 32) + 'M202 ' + (RAIL - 32) + 'H218" stroke="#C9D1CD" stroke-width="2.5"/></g>';
      o += '<text x="210" y="' + (RAIL - 40) + '" text-anchor="middle" class="mn-cnt"></text>';
      // куча после взрыва: глыбы поверх осыпи
      o += '<g class="mn-pile"><path d="M' + (PILEX + 40) + ' ' + RAIL + 'Q' + (PILEX + 70) + ' 262 ' + (PILEX + 100) + ' 250Q' + (FACE - 10) + ' 226 ' + (FACE + 30) + ' 236V' + RAIL + 'Z" fill="url(#mnOre)"/>' +
        '<path d="M' + (PILEX + 70) + ' 286l9-10 10 2 4 8ZM' + (PILEX + 104) + ' 270l8-12 12 3 2 10ZM' + (PILEX + 136) + ' 258l10-9 9 4-1 8ZM' + (PILEX + 158) + ' 278l7-8 9 3 1 6Z" fill="#4E5A1C"/>' +
        '<path d="M' + (PILEX + 82) + ' 268l4-3M' + (PILEX + 122) + ' 250l5-2M' + (PILEX + 148) + ' 244l4-3" stroke="#E4F07A" stroke-width="1.5"/></g>';
      o += '<text class="mn-pl" x="' + (PILEX + 128) + '" y="222" text-anchor="middle">КУЧА 9 т</text>';
      // взрыв: осколки, волна, пыль, вспышка
      o += '<g class="mn-deb">';
      for (var d = 0; d < 9; d++) {
        var dy = 140 + d * 11, dx = FACE - 6;
        o += '<path class="mn-d mn-d' + d + '" d="M' + dx + ' ' + dy + 'l7-3 5 6-6 5-7-2Z" fill="' + (d % 3 ? '#8FA24A' : '#56645D') + '"/>';
      }
      o += '</g><g clip-path="url(#mnTun)"><circle class="mn-wave" cx="' + FACE + '" cy="190" r="0" fill="none" stroke="#FFE7A0" stroke-width="3" opacity="0"/>' +
        '<g class="mn-dust" opacity="0" filter="url(#mnBlur)"><circle cx="' + (FACE - 20) + '" cy="200" r="34" fill="#8C8A70"/><circle cx="' + (FACE - 60) + '" cy="170" r="28" fill="#6E6C58"/>' +
        '<circle cx="' + (FACE - 50) + '" cy="236" r="32" fill="#7A7862"/><circle cx="' + (FACE - 95) + '" cy="210" r="24" fill="#5E5C4A"/><circle cx="' + (FACE - 30) + '" cy="140" r="22" fill="#6E6C58"/></g></g>';
      o += '<rect class="mn-flash" x="22" y="42" width="686" height="' + (RAIL - 38) + '" fill="#FFF6D8" opacity="0"/>';
      // опрокидыватель (люлька-кольцо на роликах) и бункер
      o += '<path d="M30 326H110L96 354H44Z" fill="#0A100D" stroke="#56645D" stroke-width="1.5"/><path d="M36 332H104" stroke="#2E3F37"/>';
      o += '<text x="118" y="340" class="v-d">БУНКЕР</text><text x="118" y="353" class="v-d mn-bk">0 т</text>';
      o += '<g class="mn-fall">' + [0, 1, 2, 3, 4].map(function (i) { return '<circle cx="' + (52 + i * 9) + '" cy="306" r="3.2" fill="#C8DC4E"/>'; }).join('') + '</g>';
      o += '<g class="mn-tip" transform="rotate(0 ' + TIPX + ' ' + TIPY + ')"><circle cx="' + TIPX + '" cy="' + TIPY + '" r="50" fill="none" stroke="#56645D" stroke-width="6"/>' +
        '<circle cx="' + TIPX + '" cy="' + TIPY + '" r="50" fill="none" stroke="#8E9A94" stroke-width="1.2" stroke-dasharray="3 9"/>' +
        '<circle cx="' + TIPX + '" cy="' + TIPY + '" r="44" fill="none" stroke="#2E3F37" stroke-width="1.5"/>' +
        '<path d="M' + (TIPX - 40) + ' ' + RAIL + 'H' + (TIPX + 40) + '" stroke="#8E9A94" stroke-width="3"/>' + cartSVG() + '</g>';
      o += '<circle cx="' + (TIPX - 28) + '" cy="' + (TIPY + 47) + '" r="6" fill="#2A3731" stroke="#8E9A94" stroke-width="1.5"/><circle cx="' + (TIPX + 28) + '" cy="' + (TIPY + 47) + '" r="6" fill="#2A3731" stroke="#8E9A94" stroke-width="1.5"/>';
      o += '<path d="M' + (TIPX - 40) + ' ' + (TIPY + 55) + 'H' + (TIPX + 40) + '" stroke="#3C4742" stroke-width="3"/>';
      // завод участка: лента из бункера сверху в дробилку, дальше от машины к машине
      var BELT = 'M70 354V360H104V368M174 401H196M304 401H326M434 401H456M564 401H586';
      o += '<path class="mn-belt" d="' + BELT + '" stroke="#2E3F37" stroke-width="7" fill="none"/>';
      o += '<path class="mn-flow" d="' + BELT + '" stroke="#C8DC4E" stroke-width="2.5" fill="none" stroke-dasharray="3 6"/>';
      var crush = '<path d="M96 380L120 422L144 380" stroke="#8E9A94" stroke-width="3" fill="none"/><path d="M104 380L120 410" stroke="#56645D" stroke-width="2"/>' +
        '<g class="mn-rot"><circle cx="128" cy="394" r="8" fill="none" stroke="#C9D1CD" stroke-width="2" stroke-dasharray="4 3"/></g><g class="mn-bits"><path d="M116 424l3 4M122 426l-2 5M126 423l3 3" stroke="#C8DC4E" stroke-width="2"/></g>';
      var mill = '<g class="mn-rot"><circle cx="250" cy="401" r="21" fill="#121B17" stroke="#8E9A94" stroke-width="2"/><circle cx="250" cy="401" r="15" fill="none" stroke="#2E3F37"/>' +
        '<path d="M250 380V422M229 401H271M235 386L265 416M265 386L235 416" stroke="#3C4742" stroke-width="2"/><circle cx="250" cy="401" r="4" fill="#8E9A94"/></g>';
      var table = '<g class="mn-shake"><path d="M336 412L424 392" stroke="#8E9A94" stroke-width="5"/><path d="M344 405l6-2M362 401l6-2M380 397l6-2M398 393l6-2" stroke="#C8DC4E" stroke-width="2"/></g>' +
        '<path d="M346 414V426M414 398V426" stroke="#3C4742" stroke-width="3"/><path class="mn-waste" d="M424 396l8 10" stroke="#6E7A74" stroke-width="2" stroke-dasharray="2 3"/>';
      var tank = '<rect x="482" y="378" width="56" height="46" rx="5" fill="#0F1A14" stroke="#8E9A94" stroke-width="2"/><rect class="mn-liq" x="485" y="398" width="50" height="23" rx="2" fill="#1E6B43" opacity=".7"/>' +
        '<g class="mn-rot"><path d="M510 390V420M497 412H523" stroke="#C9D1CD" stroke-width="2.5"/></g><path d="M482 386H538" stroke="#56645D"/>';
      var drum = '<circle class="mn-glow" cx="640" cy="403" r="40" fill="url(#mnGlowU)"/>' +
        '<g class="mn-drum"><rect x="618" y="378" width="44" height="50" rx="5" fill="#13261B" stroke="#C8DC4E" stroke-width="2"/><ellipse cx="640" cy="380" rx="20" ry="3" fill="#C8DC4E" opacity=".6"/>' +
        '<path d="M618 390H662M618 416H662" stroke="#C8DC4E" stroke-width="1.5"/><text x="640" y="408" text-anchor="middle" class="mn-u">U₃O₈</text></g>';
      o += plantNode(120, 'ДРОБИЛКА', 'КУСОК → ЩЕБЕНЬ', crush, 0) + plantNode(250, 'МЕЛЬНИЦА', 'ЩЕБЕНЬ → ПЕСОК', mill, 1) +
        plantNode(380, 'СТОЛ', 'ПОРОДА В ОТВАЛ', table, 2) + plantNode(510, 'БАК', 'ВЫЩЕЛАЧИВАНИЕ', tank, 3) + plantNode(640, 'ЯЩИК', 'БОЧКА КЕКА 17 КГ', drum, 4);
      // руды и выход урана на АЭС: стрелка от фишки «U» к значку станции, подпись правее значка
      var ores = [['Cu', 'МЕДЬ'], ['Fe', 'ЖЕЛЕЗО'], ['Pb', 'СВИНЕЦ'], ['Au', 'ЗОЛОТО'], ['U', 'УРАН']];
      o += '<g class="mn-ores">' + ores.map(function (r, i) {
        var x = 22 + i * 72;
        return '<g class="mn-o' + (r[0] === 'U' ? ' on' : '') + '"><rect x="' + x + '" y="492" width="66" height="26" fill="none" stroke="#2E3F37"/>' +
          '<text x="' + (x + 7) + '" y="510" class="mn-os">' + r[0] + '</text><text x="' + (x + 60) + '" y="509" text-anchor="end" class="mn-on">' + r[1] + '</text></g>';
      }).join('') + '</g>';
      o += '<g class="mn-aes"><path class="mn-aesl" d="M392 505H472" stroke="#5BC8FF" stroke-width="2" stroke-dasharray="5 4"/><path d="M466 499l7 6-7 6" stroke="#5BC8FF" stroke-width="2" fill="none"/>' +
        '<path d="M484 520V506A17 17 0 0 1 518 506V520Z" fill="#0B1A22" stroke="#5BC8FF" stroke-width="1.6"/><path d="M480 520H522" stroke="#5BC8FF" stroke-width="1.6"/>' +
        '<circle cx="501" cy="509" r="3" fill="#5BC8FF"/><ellipse cx="501" cy="509" rx="9" ry="3.4" fill="none" stroke="#5BC8FF" stroke-width="1"/>' +
        '<text x="532" y="503" class="mn-at">АЭС ГОРОДА</text><text x="532" y="518" class="v-d">ТВЭЛ ИЗ ВАШЕГО УРАНА</text></g>';
      return o;
    },
    run: function (root, T) {
      var st = root.querySelector('.mn-st'), drill = root.querySelector('.mn-drill'), cnt = root.querySelector('.mn-cnt');
      var cart = root.querySelector('.mn-cart'), load = root.querySelector('.mn-load'), cw = root.querySelector('.mn-cw');
      var tip = root.querySelector('.mn-tip'), pile = root.querySelector('.mn-pile'), pl = root.querySelector('.mn-pl'), bk = root.querySelector('.mn-bk');
      var wheels = root.querySelectorAll('.mn-wh');
      function cartAt(x) {
        cart.setAttribute('transform', 'translate(' + x.toFixed(1) + ',' + RAIL + ')');
        var a = ((x - TIPX) / 5 * 57.3).toFixed(0); // колесо r 5 катится по рельсу
        wheels[0].setAttribute('transform', 'rotate(' + a + ' -16 -4)'); wheels[1].setAttribute('transform', 'rotate(' + a + ' 16 -4)');
      }
      function loadT(t) { load.setAttribute('transform', 'translate(0,' + (38 * (1 - t / 9)).toFixed(1) + ')'); cw.textContent = f1(t); }
      T.cls(root, 150, 'p1');
      HOLES.forEach(function (y, i) {
        var t0 = 450 + i * 360, y0 = i ? HOLES[i - 1] : y;
        T.anim(t0, 160, function (e) { drill.setAttribute('transform', 'translate(0,' + (y0 + (y - y0) * e).toFixed(1) + ')'); });
        T.at(t0 + 170, function () { root.querySelector('.mn-h' + i).classList.add('on'); st.textContent = 'ШПУРЫ ' + (i + 1) + ' / 6'; });
      });
      T.at(2750, function () { root.classList.add('p2'); st.textContent = 'ЗАРЯДЫ 6 / 6'; });
      T.at(3250, function () { root.classList.add('p3'); st.textContent = 'СИРЕНА · ОТОЙДИ НА 11 М'; });
      T.anim(3500, 1500, function (e) { var n = Math.ceil(10 * (1 - e)); cnt.textContent = n > 0 ? n + ' С' : ''; });
      T.at(5000, function () { root.classList.add('p4'); st.textContent = 'ВЗРЫВ · КУЧА 9 т'; });
      // вспышка, волна и пыль ведёт JS: CSS-анимации залипали в кадрах без видеокарты
      var flash = root.querySelector('.mn-flash'), wave = root.querySelector('.mn-wave'), dust = root.querySelector('.mn-dust');
      T.anim(5000, 900, function (e) { flash.setAttribute('opacity', (0.95 * (1 - e)).toFixed(3)); });
      T.anim(5000, 800, function (e) { wave.setAttribute('r', (10 + 300 * e).toFixed(1)); wave.setAttribute('opacity', (0.9 * (1 - e)).toFixed(3)); }, K.eout);
      T.anim(5050, 3000, function (e) {
        dust.setAttribute('opacity', (e < 0.15 ? e / 0.15 * 0.75 : 0.75 * (1 - (e - 0.15) / 0.85)).toFixed(3));
        dust.setAttribute('transform', 'translate(' + (-150 * e).toFixed(1) + ',' + (-20 * e).toFixed(1) + ')');
      }, K.eout);
      T.at(5900, function () { root.classList.add('p5'); st.textContent = 'ВАГОНЕТКА К КУЧЕ'; });
      T.anim(5900, 1300, function (e) { cartAt(TIPX + (PILEX - TIPX) * e); }, K.eio);
      T.at(7250, function () { st.textContent = 'ЛОПАТОЙ · 250 КГ ЗА ЧЕРПАК'; });
      T.anim(7250, 1500, function (e) {
        loadT(9 * e);
        pile.style.transform = 'scaleY(' + (1 - 0.9 * e).toFixed(3) + ')';
        var fade = e > 0.75 ? (1 - (e - 0.75) / 0.25) : 1; // последний черпак - куча уходит целиком
        pile.style.opacity = fade.toFixed(3); pl.style.opacity = (fade * (e < 0.5 ? 1 : 0)).toFixed(3);
      }, function (t) { return t; });
      T.at(8800, function () { st.textContent = 'К ОПРОКИДЫВАТЕЛЮ'; });
      T.anim(8800, 1300, function (e) { cartAt(PILEX - (PILEX - TIPX) * e); }, K.eio);
      T.at(10150, function () { root.classList.add('p6'); st.textContent = 'ОПРОКИДЫВАНИЕ'; });
      T.anim(10150, 700, function (e) { tip.setAttribute('transform', 'rotate(' + (135 * e).toFixed(1) + ' ' + TIPX + ' ' + TIPY + ')'); }, K.eio);
      T.anim(10700, 400, function (e) { loadT(9 * (1 - e)); bk.textContent = f1(9 * e) + ' т'; });
      T.anim(11300, 700, function (e) { tip.setAttribute('transform', 'rotate(' + (135 * (1 - e)).toFixed(1) + ' ' + TIPX + ' ' + TIPY + ')'); }, K.eio);
      T.at(11100, function () { root.classList.add('p7'); st.textContent = 'ЗАВОД УЧАСТКА'; });
      for (var i = 0; i < 5; i++) T.cls(root.querySelector('.mn-n' + i), 11200 + i * 380, 'on');
      T.anim(11400, 1800, function (e) { bk.textContent = f1(9 * (1 - e)) + ' т'; });
      T.at(13200, function () { root.classList.add('p8'); st.textContent = 'БОЧКА КЕКА · 17 КГ U'; });
    }
  };

  // ── МЕТЛАБА: сперва Кухня на плитке, потом цепочка до Голубого ─────────────
  // Порядок и действия - МЕТЛАБ-инструкция.md (игровые названия, химия вымышленная):
  // Кухня - баллон в гнездо, смесь в кастрюлю, вентиль, пьезо, на противень, корка.
  // Голубой - ДВ-5 три промывки основы (90 -> 98,75 %), Р-20 загрузка (горловина,
  // дозатор активатора на 6 порций), варка: ручка ХОЛОД/НАГРЕВ по тренду, ПОРЦИЯ x6,
  // пена, клапан; Т-4 слив через картридж; КШ-4 «медленно», помутнение и затравка;
  // СФ-1 молоток, весы, пакет. Сцены - группы .mx-sc, видна одна (класс on).
  var GR = [ // сорт, порог %, цена $/г, цвет
    ['КУХНЯ', 0, '1,00', '#9AA39E'], ['ЯНТАРЬ', 60, '1,75', '#D9963A'], ['РОЗОВЫЙ', 75, '2,05', '#E77FB0'],
    ['ЛЁД', 90, '3,20', '#D6ECF5'], ['ГОЛУБОЙ', 97, '4,00', '#4FA8F0']];
  var MCX0 = 252, MCX1 = 700, MCY0 = 268, MCY1 = 140; // график варки: 0..15 мин, 20..100 °C
  function mcy(t) { return MCY0 - (t - 20) / 80 * (MCY0 - MCY1); }
  function tempAt(k) { // ход партии: разогрев, окно 64..72, пена (перегрев), остывание
    var t;
    if (k < 0.22) t = 24 + 44 * Math.sin(k / 0.22 * Math.PI / 2);
    else t = 68 + 2.6 * Math.sin(k * 41) + 1.4 * Math.sin(k * 97);
    t += 13 * Math.exp(-Math.pow((k - 0.44) / 0.035, 2));
    if (k > 0.9) t -= (k - 0.9) / 0.1 * 18;
    return t;
  }
  function knobAt(k) { // ручка ХОЛОД(-1) .. НАГРЕВ(+1): игрок крутит по тренду, заранее
    var lead = tempAt(Math.min(1, k + 0.035));
    if (k < 0.18) return 0.9;
    return Math.max(-1, Math.min(1, -(lead - 68) / 7));
  }
  function mix(a, b, t) {
    var x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16), o = '#';
    for (var s = 16; s >= 0; s -= 8) { var v = Math.round(((x >> s) & 255) * (1 - t) + ((y >> s) & 255) * t); o += (v < 16 ? '0' : '') + v.toString(16); }
    return o;
  }
  function grade(p) { for (var i = GR.length - 1; i > 0; i--) if (p >= GR[i][1]) return i; return 1; }
  function mpx(p) { return 22 + (Math.max(60, Math.min(100, p)) - 60) / 40 * 440; }
  function flame(x, s) {
    return '<path d="M' + x + ' 352q-' + (5 * s) + '-' + (9 * s) + ' 0-' + (20 * s) + 'q' + (5 * s) + ' ' + (11 * s) + ' 0 ' + (20 * s) + 'Z" fill="#4FA8F0"/>' +
      '<path d="M' + x + ' 352q-' + (2.5 * s) + '-' + (5 * s) + ' 0-' + (11 * s) + 'q' + (2.5 * s) + ' ' + (6 * s) + ' 0 ' + (11 * s) + 'Z" fill="#FFD34E"/>';
  }
  function sceneK() {
    var o = '<g class="mx-sc mx-k on">';
    o += '<path d="M40 402H690" stroke="#3C4742" stroke-width="3"/><path d="M60 404V440M670 404V440" stroke="#2A3731" stroke-width="4"/>';
    // таблица огня (инструкция: малый ~6 мин 78 %, средний ~2,5 мин 71 %, большой ~2 мин 67 %)
    o += '<g class="mx-ft"><text x="470" y="146" class="mx-cap">ОГОНЬ · ГОТОВО · ЧИСТОТА</text>' +
      [['МАЛЫЙ', '~6 мин', '78 %', 'не пригорит'], ['СРЕДНИЙ', '~2,5 мин', '71 %', 'пригорит через 7'], ['БОЛЬШОЙ', '~2 мин', '67 %', 'убегает пена']].map(function (r, i) {
        var y = 166 + i * 22;
        return '<g class="mx-fr' + (i ? '' : ' on') + '"><text x="470" y="' + y + '" class="mx-fn">' + r[0] + '</text><text x="548" y="' + y + '" class="mx-fv">' + r[1] + '</text>' +
          '<text x="610" y="' + y + '" class="mx-fv">' + r[2] + '</text></g>';
      }).join('') + '<text x="470" y="236" class="mx-note">малый огонь — дольше, но чище</text></g>';
    // баллон и шланг
    o += '<g class="mx-gas" transform="translate(-160,0)"><rect x="92" y="284" width="52" height="116" rx="16" fill="#A8322A" stroke="#6E1F19" stroke-width="2"/>' +
      '<rect x="92" y="318" width="52" height="8" fill="#C9D1CD" opacity=".8"/><rect x="106" y="268" width="24" height="18" rx="3" fill="#6E7A74"/>' +
      '<circle cx="118" cy="264" r="6" fill="#AEB8B3"/><text x="118" y="366" text-anchor="middle" class="mx-gl">ГАЗ</text></g>';
    o += '<path class="mx-hose" d="M128 268C176 236 200 352 230 376" stroke="#141414" stroke-width="5" fill="none" stroke-linecap="round"/>';
    // плитка ПГ-1: конфорка, вентиль, пьезо
    o += '<rect x="196" y="352" width="232" height="48" rx="6" fill="#2A3731" stroke="#56645D" stroke-width="1.5"/>';
    o += '<ellipse cx="310" cy="352" rx="48" ry="6" fill="#0A0E0C" stroke="#3C4742"/>';
    o += '<g class="mx-fl" style="transform-origin:310px 352px">' + flame(286, 1) + flame(298, 1.25) + flame(310, 1.45) + flame(322, 1.25) + flame(334, 1) + '</g>';
    o += '<g class="mx-knob" transform="rotate(-120 232 378)"><circle cx="232" cy="378" r="13" fill="#8E9A94" stroke="#C9D1CD"/><path d="M232 378V367" stroke="#0A0E0C" stroke-width="3" stroke-linecap="round"/></g>';
    o += '<text x="216" y="382" text-anchor="end" class="mx-kl">МАЛ</text><text x="248" y="382" class="mx-kl">БОЛ</text>';
    o += '<circle class="mx-piezo" cx="402" cy="378" r="9" fill="#B03A2E" stroke="#E74C3C"/><text x="402" y="397" text-anchor="middle" class="mx-kl">ПЬЕЗО</text>';
    o += '<path class="mx-spark" d="M296 344l6-8 2 6 6-9" stroke="#FFE7A0" stroke-width="2.5" fill="none"/>';
    o += '<text x="312" y="420" text-anchor="middle" class="mx-cap">ПЛИТКА ПГ-1 · 900 $</text>';
    // кастрюля (наклоняется над противнем), пар, пакет смеси
    o += '<g class="mx-pot"><rect x="252" y="284" width="116" height="64" rx="8" fill="url(#steel)" stroke="#56645D" stroke-width="1.5"/>' +
      '<rect x="238" y="296" width="16" height="7" rx="3" fill="#56645D"/><rect x="366" y="296" width="16" height="7" rx="3" fill="#56645D"/>' +
      '<g class="mx-lid"><rect x="246" y="276" width="128" height="9" rx="4" fill="#C9D1CD" stroke="#8E9A94"/><rect x="302" y="268" width="16" height="9" rx="3" fill="#3C4742"/></g></g>';
    o += '<g class="mx-steam">' + [282, 310, 338].map(function (x) { return '<path d="M' + x + ' 262c-8-12 8-18 0-30s8-18 0-30" stroke="#DDE6E1" stroke-width="2.5" fill="none"/>'; }).join('') + '</g>';
    o += '<g class="mx-pack" transform="translate(0,-60)"><rect x="290" y="150" width="40" height="52" rx="3" fill="#C9B48A" stroke="#8C6D2C"/><rect x="290" y="150" width="40" height="8" fill="#8C6D2C"/>' +
      '<text x="310" y="180" text-anchor="middle" class="mx-pk">СМЕСЬ</text><text x="310" y="192" text-anchor="middle" class="mx-pk2">КУХОННАЯ</text></g>';
    // противень и ящик
    // кромка кастрюли (368,284) после поворота 62° вокруг (310,316) и сдвига (226,-8) - в точке (591,344):
    // смесь выходит из щели под приоткрытой крышкой, переваливает через край и падает на противень (верх 386)
    o += '<path class="mx-pour" d="M591 344C597 344 600 352 599 362L598 387" stroke="#B9B3A4" stroke-width="6" stroke-linecap="round" fill="none" opacity="0"/>';
    o += '<rect x="468" y="384" width="176" height="16" rx="3" fill="#3C4742" stroke="#6E7A74"/><rect class="mx-tf" x="472" y="386" width="0" height="10" fill="#B9B3A4"/>';
    o += '<path class="mx-crack" d="M490 391l14 3 10-4 16 5 14-4 18 4 12-3 22 3 16-4 18 3" stroke="#6E7A74" stroke-width="1.5" fill="none"/>';
    o += '<text x="556" y="420" text-anchor="middle" class="mx-cap">ПРОТИВЕНЬ</text>';
    o += '<rect x="650" y="358" width="48" height="42" fill="#6B4E35" stroke="#8C6D2C"/><text x="674" y="384" text-anchor="middle" class="mx-pk2" fill="#E8DCC0">ЯЩИК</text>';
    o += '<g class="mx-crumb">' + [0, 1, 2, 3, 4].map(function (i) { return '<rect x="' + (644 + i * 5) + '" y="' + (378 - i * 3) + '" width="4" height="4" fill="#B9B3A4"/>'; }).join('') + '</g>';
    o += '<text class="mx-timer" x="312" y="252" text-anchor="middle">00:00</text>';
    return o + '</g>';
  }
  function sceneA() { // делительная воронка ДВ-5
    var o = '<g class="mx-sc mx-a">';
    o += '<clipPath id="mxFunC"><path d="M292 152H308V170C358 186 372 262 330 308L308 330H292L270 308C228 262 242 186 292 170Z"/></clipPath>';
    o += '<rect x="150" y="402" width="160" height="8" fill="#3C4742"/><rect x="168" y="140" width="6" height="262" fill="#56645D"/><path d="M174 170H290" stroke="#56645D" stroke-width="5"/>';
    o += '<g class="mx-fun" transform="rotate(0 300 170)">';
    o += '<g clip-path="url(#mxFunC)"><rect x="220" y="150" width="160" height="200" fill="#08100C"/>' +
      '<rect class="mx-l1" x="220" y="196" width="160" height="80" fill="#8FD3F0" opacity=".55"/>' +
      '<rect class="mx-l2" x="220" y="276" width="160" height="60" fill="#8A6A3A" opacity=".85"/>' +
      '<rect class="mx-mixl" x="220" y="196" width="160" height="140" fill="#B79A6A"/></g>';
    o += '<path d="M292 152H308V170C358 186 372 262 330 308L308 330H292L270 308C228 262 242 186 292 170Z" fill="url(#mtGlass)" stroke="#9FB4AC" stroke-width="1.6"/>';
    o += '<rect x="294" y="140" width="12" height="14" rx="2" fill="#2A3731"/>';
    o += '<path d="M294 330V346H306V330" fill="#2A3731"/><g class="mx-tap"><rect x="286" y="336" width="28" height="5" rx="2" fill="#C79A3A"/></g>';
    o += '<path d="M276 314H324" stroke="#E74C3C" stroke-width="1.2" stroke-dasharray="3 3"/><text x="326" y="317" class="mx-kl" fill="#E74C3C">ЧЕРТА</text>';
    o += '</g>';
    o += '<rect class="mx-drip" x="297" y="346" width="6" height="40" fill="#8A6A3A" opacity="0"/>';
    o += '<path d="M268 374H332L326 404H274Z" fill="#2A3731" stroke="#56645D"/><text x="300" y="424" text-anchor="middle" class="mx-cap">ВЕДРО — ГРЯЗЬ</text>';
    o += '<text x="430" y="166" class="mx-cap">ЧИСТОТА ОСНОВЫ</text><text x="430" y="222" class="mx-big"><tspan class="mx-bv">90</tspan> %</text>';
    o += [['ПРОМЫВКА 1', '90 → 95 %'], ['ПРОМЫВКА 2', '95 → 97,5 %'], ['ПРОМЫВКА 3', '97,5 → 98,75 %']].map(function (r, i) {
      var y = 262 + i * 26;
      return '<g class="mx-w mx-w' + i + '"><circle cx="436" cy="' + (y - 4) + '" r="6" fill="none" stroke="#2E3F37" stroke-width="1.5"/><path d="M433 ' + (y - 4) + 'l2.5 2.5 4-5" stroke="#2ECC71" stroke-width="1.6" fill="none" class="mx-wk"/>' +
        '<text x="450" y="' + y + '" class="mx-fn">' + r[0] + '</text><text x="560" y="' + y + '" class="mx-fv">' + r[1] + '</text></g>';
    }).join('');
    o += '<text x="430" y="358" class="mx-note">тряхнуть, подождать слои, слить грязь до черты:</text><text x="430" y="374" class="mx-note">окно ±1,5 с — рано: грязь осталась, поздно: ушла основа</text>';
    o += '<text x="430" y="400" class="mx-note2">основа для Голубого — 370 $ вместо 700</text>';
    return o + '</g>';
  }
  function sceneB() { // реактор Р-20: загрузка и варка
    var o = '<g class="mx-sc mx-b">';
    o += '<clipPath id="mxVes"><path d="M54 206H168V316Q168 362 111 362Q54 362 54 316Z"/></clipPath>';
    // вытяжка: гофра от колонны вверх
    o += '<path d="M111 152V128" stroke="#56645D" stroke-width="12" stroke-dasharray="3 2"/><text x="122" y="136" class="mx-kl">ВЫТЯЖКА ВВ-2</text>';
    o += '<path d="M40 150V404M182 150V404M40 162H182M40 392H182" stroke="#56645D" stroke-width="3"/>';
    o += '<rect x="95" y="152" width="32" height="34" rx="4" fill="#2F6FB0" stroke="#7FB2E0"/><path d="M111 186V342" stroke="#C9D1CD" stroke-width="2.5"/>';
    o += '<path d="M48 200H174V318Q174 370 111 370Q48 370 48 318Z" fill="none" stroke="#3C4742" stroke-width="5" opacity=".7"/>';
    o += '<g clip-path="url(#mxVes)"><rect x="54" y="206" width="114" height="160" fill="#08100C"/><rect class="mx-rl" x="54" y="372" width="114" height="0" fill="#E8E4DA" opacity=".85"/>' +
      '<path class="mx-foam" d="M54 250q10-12 20 0t20 0 20 0 20 0 20 0 20 0V236H54Z" fill="#F4EFE2"/>' +
      '<g class="mt-bub"><circle cx="80" cy="344" r="2.5"/><circle cx="130" cy="340" r="2"/><circle cx="104" cy="350" r="1.8"/><circle cx="150" cy="344" r="2.2"/></g>' +
      '<g class="mx-stir"><path d="M93 338H129" stroke="#C9D1CD" stroke-width="4" stroke-linecap="round"/></g></g>';
    o += '<path d="M54 206H168V316Q168 362 111 362Q54 362 54 316Z" fill="url(#mtGlass)" stroke="#9FB4AC" stroke-width="1.5"/>';
    // горловина, дозатор активатора (6 рисок), клапан на крышке
    o += '<rect x="66" y="190" width="18" height="16" fill="#3C4742"/><text x="62" y="224" class="mx-kl">↑ ГОРЛОВИНА</text>';
    // дозатор - трапеция (134..160 сверху на y176, 142..152 снизу на y198); 6 рисок ГОРИЗОНТАЛЬНО, как у мерного
    // стакана: длина каждой - ширина трапеции на её высоте минус зазор 2 с каждой стороны; mx-dm0 - нижняя
    o += '<path d="M134 176H160L152 198H142Z" fill="#141B18" stroke="#8E9A94"/><g class="mx-dose">' + [0, 1, 2, 3, 4, 5].map(function (i) {
      var y = 194 - i * 3.1, l = 134 + 8 * (y + 0.8 - 176) / 22 + 2, r = 160 - 8 * (y + 0.8 - 176) / 22 - 2;
      return '<rect class="mx-dm mx-dm' + i + '" x="' + l.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + (r - l).toFixed(1) + '" height="1.7" fill="#2A3731"/>';
    }).join('') + '</g>';
    o += '<g class="mx-valve"><rect x="150" y="194" width="9" height="11" fill="#C79A3A"/><path class="mt-steam" d="M154 188c-6-8 6-12 0-20s6-12 0-20" stroke="#DDE6E1" stroke-width="2" fill="none"/></g>';
    o += '<path d="M111 370V386H140" stroke="#8E9A94" stroke-width="3" fill="none"/>';
    o += '<text x="111" y="424" text-anchor="middle" class="mx-cap">РЕАКТОР Р-20 · 6 500 $</text>';
    // канистры и банка (загрузка)
    // горлышко канистры (63,120) после поворота 55° вокруг (48,155) и сдвига (-16,0) - в точке (69,147):
    // жидкость переваливает через горлышко и падает в горловину реактора (x 66-84, верх 190)
    o += '<path class="mx-st1" d="M69 147C75 147 77 156 76 168L75 192" stroke="#8FD3F0" stroke-width="5" stroke-linecap="round" fill="none" opacity="0"/>';
    o += '<g class="mx-c1" transform="translate(-120,0)"><rect x="26" y="128" width="44" height="54" rx="4" fill="#2F6FB0" stroke="#7FB2E0"/><rect x="58" y="120" width="10" height="10" fill="#7FB2E0"/><rect class="mx-cc" x="56" y="114" width="14" height="7" rx="2" fill="#1B3F66"/><text x="48" y="160" text-anchor="middle" class="mx-pk2" fill="#fff">ОСНОВА</text></g>';
    o += '<g class="mx-c2" transform="translate(-120,0)"><rect x="26" y="128" width="44" height="54" rx="4" fill="#6E7A74" stroke="#AEB8B3"/><rect x="58" y="120" width="10" height="10" fill="#AEB8B3"/><rect class="mx-cc" x="56" y="114" width="14" height="7" rx="2" fill="#3C4742"/><text x="48" y="160" text-anchor="middle" class="mx-pk2" fill="#fff">РАСТВОР</text></g>';
    o += '<g class="mx-jar" transform="translate(0,-80)"><rect x="138" y="132" width="20" height="28" rx="3" fill="#D9963A" stroke="#8C6D2C"/><rect x="138" y="128" width="20" height="6" fill="#56645D"/><text x="148" y="150" text-anchor="middle" class="mx-pk3">АКТ</text></g>';
    // график варки и окно
    o += '<rect x="236" y="128" width="472" height="152" fill="#070C0A" stroke="#22302A"/>';
    [40, 60, 80].forEach(function (t) { o += '<path d="M' + MCX0 + ' ' + mcy(t).toFixed(1) + 'H' + MCX1 + '" stroke="#16201C"/><text x="' + (MCX0 - 4) + '" y="' + (mcy(t) + 4).toFixed(1) + '" text-anchor="end" class="mt-ax">' + t + '</text>'; });
    o += '<rect x="' + MCX0 + '" y="' + mcy(74).toFixed(1) + '" width="' + (MCX1 - MCX0) + '" height="' + (mcy(62) - mcy(74)).toFixed(1) + '" fill="rgba(46,204,113,.1)"/>';
    o += '<text x="' + (MCX1 - 6) + '" y="' + (mcy(74) - 5).toFixed(1) + '" text-anchor="end" class="mt-win">ОКНО 62–74 °C</text>';
    var d = '';
    for (var i = 0; i <= 140; i++) { var k = i / 140; d += (i ? 'L' : 'M') + (MCX0 + (MCX1 - MCX0) * k).toFixed(1) + ' ' + mcy(tempAt(k)).toFixed(1); }
    o += '<path class="mt-curve" d="' + d + '" stroke="#2ECC71" stroke-width="2.2" fill="none" stroke-linejoin="round"/><circle class="mt-head" cx="' + MCX0 + '" cy="' + mcy(24).toFixed(1) + '" r="4.5" fill="#2ECC71"/>';
    var kx = MCX0 + (MCX1 - MCX0) * 0.44, kx2 = MCX0 + (MCX1 - MCX0) * 0.7;
    o += '<g class="mt-ev mt-e1"><text x="' + (kx + 8).toFixed(1) + '" y="150" class="mt-evt" fill="#F1C40F">ПЕНА — РУЧКУ В ХОЛОД</text></g>';
    o += '<g class="mt-ev mt-e2"><text x="' + (kx2 - 6).toFixed(1) + '" y="268" text-anchor="end" class="mt-evt" fill="#E74C3C">МАНОМЕТР В КРАСНОМ — КЛАПАН ЗА 10 С</text></g>';
    // пульт: ручка ХОЛОД/НАГРЕВ, ПОРЦИЯ, лампы, манометр
    o += '<rect x="236" y="290" width="472" height="146" fill="#0A100D" stroke="#22302A"/>';
    o += '<text x="318" y="310" text-anchor="middle" class="mx-cap">ХОЛОД ⟷ НАГРЕВ</text>';
    o += '<path d="M' + (318 + 40 * Math.cos(Math.PI * 1.22)).toFixed(1) + ' ' + (368 - 40 * Math.sin(Math.PI * 1.22)).toFixed(1) + 'A40 40 0 1 1 ' + (318 + 40 * Math.cos(-Math.PI * 0.22)).toFixed(1) + ' ' + (368 - 40 * Math.sin(-Math.PI * 0.22)).toFixed(1) + '" stroke="url(#mxArc)" stroke-width="6" fill="none" stroke-linecap="round"/>';
    o += '<g class="mx-rk" transform="rotate(0 318 368)"><circle cx="318" cy="368" r="27" fill="#2A3731" stroke="#8E9A94" stroke-width="2"/><circle cx="318" cy="368" r="20" fill="#1A2420"/><path d="M318 368V344" stroke="#EEF2EF" stroke-width="4" stroke-linecap="round"/></g>';
    o += '<text x="318" y="428" text-anchor="middle" class="mx-hint">E + КОЛЕСО</text>';
    o += '<g class="mx-por"><circle class="mx-pb" cx="430" cy="364" r="22" fill="#1E8449" stroke="#2ECC71" stroke-width="2"/><text x="430" y="368" text-anchor="middle" class="mx-pk3" fill="#fff">ПОРЦИЯ</text></g>';
    o += '<text x="430" y="410" text-anchor="middle" class="mx-pv"><tspan class="mx-pn">0</tspan> / 6</text>';
    [['РАБОТА', '#F1C40F'], ['ГОТОВО', '#2ECC71'], ['АВАРИЯ', '#E74C3C']].forEach(function (l, k) {
      var x = 510 + k * 42;
      o += '<circle class="mx-lamp mx-lp' + k + '" cx="' + x + '" cy="316" r="8" fill="#1A2420" data-c="' + l[1] + '"/><text x="' + x + '" y="338" text-anchor="middle" class="mx-kl">' + l[0] + '</text>';
    });
    o += '<text x="500" y="384" class="mt-big"><tspan class="mt-t">24</tspan><tspan class="mt-u" dx="5">°C</tspan></text><text class="mx-trend" x="604" y="380">→</text>';
    o += '<text x="500" y="414" class="mx-kl">КОНВЕРСИЯ <tspan class="mt-k">0</tspan> %</text>';
    o += '<circle cx="668" cy="372" r="30" fill="#1A2420" stroke="#56645D"/><path d="M' + (668 + 26 * Math.cos(Math.PI * 0.25)).toFixed(1) + ' ' + (372 - 26 * Math.sin(Math.PI * 0.25)).toFixed(1) + 'A26 26 0 0 1 ' + (668 + 26 * Math.cos(-Math.PI * 0.1)).toFixed(1) + ' ' + (372 - 26 * Math.sin(-Math.PI * 0.1)).toFixed(1) + '" stroke="#E74C3C" stroke-width="5" fill="none"/>';
    o += '<g class="mx-man" transform="rotate(-60 668 372)"><path d="M668 372V348" stroke="#EEF2EF" stroke-width="2.5"/></g><circle cx="668" cy="372" r="3" fill="#EEF2EF"/><text x="668" y="420" text-anchor="middle" class="mx-kl">ДАВЛЕНИЕ</text>';
    return o + '</g>';
  }
  function sceneC() { // слив в тележку Т-4 через картридж
    var o = '<g class="mx-sc mx-c">';
    o += '<path d="M240 128H420V176H340V214" stroke="#8E9A94" stroke-width="6" fill="none"/><rect x="398" y="120" width="40" height="18" fill="#B03A2E"/><text x="418" y="160" text-anchor="middle" class="mx-kl">КРАН СЛИВА</text>';
    o += '<path d="M322 214H358L354 262H326Z" fill="url(#mtGlass)" stroke="#9FB4AC"/><rect x="330" y="224" width="20" height="30" fill="#2A2E2B"/><text x="372" y="244" class="mx-kl">КАРТРИДЖ С УГЛЁМ</text>';
    o += '<rect class="mx-cs" x="337" y="262" width="6" height="58" fill="#CFE3EA" opacity="0"/>';
    o += '<rect x="180" y="320" width="320" height="50" rx="4" fill="#2A3731" stroke="#56645D"/>';
    for (var i = 0; i < 4; i++) {
      var x = 192 + i * 76;
      o += '<rect x="' + x + '" y="328" width="68" height="16" fill="#0A100D" stroke="#56645D"/><rect class="mx-tr mx-tr' + i + '" x="' + (x + 2) + '" y="340" width="64" height="0" fill="#CFE3EA" opacity=".85"/>';
    }
    o += '<path d="M500 330H540V300" stroke="#8E9A94" stroke-width="4" fill="none"/><circle cx="210" cy="384" r="12" fill="#1A2420" stroke="#8E9A94" stroke-width="2"/><circle cx="470" cy="384" r="12" fill="#1A2420" stroke="#8E9A94" stroke-width="2"/>';
    o += '<text x="340" y="424" text-anchor="middle" class="mx-cap">ТЕЛЕЖКА Т-4 · 4 ЛОТКА</text>';
    o += '<text x="560" y="250" class="mx-note">картридж убирает 60 % грязи,</text><text x="560" y="266" class="mx-note">слив — 40 с вместо 15</text>';
    return o + '</g>';
  }
  function sceneD() { // шкаф КШ-4, затравка; чиллер ХЛ-1
    var o = '<g class="mx-sc mx-d">';
    o += '<rect x="190" y="132" width="280" height="272" rx="6" fill="#1E2A25" stroke="#56645D" stroke-width="2"/>';
    o += '<rect x="214" y="140" width="232" height="26" fill="#050A08" stroke="#2A3731"/><text class="mx-disp" x="330" y="158" text-anchor="middle">МЕДЛЕННО · 10:00</text>';
    o += '<rect x="214" y="176" width="232" height="168" fill="#08100C" stroke="#3C4742"/>';
    for (var i = 0; i < 4; i++) {
      var y = 196 + i * 38;
      o += '<rect x="226" y="' + (y + 14) + '" width="208" height="6" fill="#3C4742"/><rect class="mx-cl mx-cl' + i + '" x="230" y="' + (y + 4) + '" width="200" height="10" fill="#CFE3EA" opacity=".55"/>';
      o += '<g class="mx-xt mx-xt' + i + '">' + [0, 1, 2, 3, 4, 5, 6].map(function (j) {
        var x = 238 + j * 28;
        return '<path d="M' + x + ' ' + (y + 14) + 'l6-14 5 8 4-11 7 17Z" fill="#4FA8F0" stroke="#BFE6FF" stroke-width=".8"/>';
      }).join('') + '</g>';
    }
    o += '<rect class="mx-haze" x="214" y="176" width="232" height="168" fill="#E8F4FA" opacity="0"/>';
    o += '<g class="mx-spk">' + [[250, 200], [300, 236], [380, 214], [410, 280], [270, 300], [340, 320], [420, 190]].map(function (p) {
      return '<path d="M' + p[0] + ' ' + (p[1] - 5) + 'V' + (p[1] + 5) + 'M' + (p[0] - 5) + ' ' + p[1] + 'H' + (p[0] + 5) + '" stroke="#FFFFFF" stroke-width="1.6"/>';
    }).join('') + '</g>';
    o += '<rect x="446" y="232" width="18" height="30" fill="#2A3731" stroke="#8E9A94"/><text x="474" y="274" class="mx-kl">ЗАТРАВКА</text>';
    o += '<g class="mx-vial" transform="translate(0,80)"><rect x="449" y="236" width="12" height="22" rx="3" fill="#BFE6FF" stroke="#4FA8F0"/><rect x="449" y="232" width="12" height="6" fill="#56645D"/></g>';
    o += '<rect x="214" y="360" width="232" height="8" fill="#16201C"/><rect class="mx-prog" x="214" y="360" width="0" height="8" fill="#4FA8F0"/><text x="214" y="386" class="mx-kl">ПРОГРАММА <tspan class="mx-pp">0</tspan> %</text>';
    o += '<text x="330" y="424" text-anchor="middle" class="mx-cap">ШКАФ КШ-4 · 4 500 $</text>';
    // чиллер
    o += '<rect x="540" y="300" width="96" height="100" rx="6" fill="#16323F" stroke="#5BC8FF" stroke-width="1.5"/><text x="588" y="330" text-anchor="middle" class="mx-pk2" fill="#BFE6FF">ХЛ-1</text>' +
      '<path d="M556 350h64M556 362h64M556 374h64" stroke="#5BC8FF" stroke-opacity=".5"/>';
    o += '<path class="mx-hoses" d="M540 330C510 330 500 300 470 300M540 350C506 350 496 320 470 320" stroke="#5BC8FF" stroke-width="3.5" fill="none" stroke-dasharray="6 5"/>';
    o += '<text x="520" y="180" class="mx-note">МЕДЛЕННО — крупный кристалл</text><text x="520" y="198" class="mx-note">на 40 % — помутнение, блёстки:</text><text x="520" y="214" class="mx-note">затравку — в окно 15 секунд</text>';
    o += '<text x="520" y="248" class="mx-note2">чиллер: на 25 % быстрее</text>';
    return o + '</g>';
  }
  function sceneE() { // стол фасовки СФ-1: молоток, весы, пакет
    var o = '<g class="mx-sc mx-e">';
    o += '<rect x="110" y="362" width="440" height="14" fill="#3C4742"/><path d="M130 376V430M530 376V430" stroke="#2A3731" stroke-width="5"/>';
    o += '<rect x="170" y="346" width="160" height="16" fill="#56645D"/><rect class="mx-sheet" x="176" y="340" width="148" height="10" fill="#4FA8F0" opacity=".9"/>';
    o += '<path class="mx-ck1" d="M210 340l12 10M250 340l-8 10" stroke="#0A2F4A" stroke-width="2"/><path class="mx-ck2" d="M290 340l10 10M230 340l6 10M270 340l-10 10" stroke="#0A2F4A" stroke-width="2"/>';
    o += '<g class="mx-shards">' + [0, 1, 2, 3, 4, 5, 6, 7].map(function (j) { var x = 182 + j * 18; return '<path d="M' + x + ' 340l7-8 6 6-3 6Z" fill="#7CC4FF" stroke="#BFE6FF" stroke-width=".7"/>'; }).join('') + '</g>';
    o += '<g class="mx-ham" transform="rotate(-40 360 250)"><rect x="356" y="250" width="8" height="96" rx="3" fill="#6B4E35"/><rect x="330" y="236" width="60" height="22" rx="3" fill="#8E9A94" stroke="#C9D1CD"/></g>';
    o += '<rect x="390" y="344" width="110" height="18" fill="#2A3731" stroke="#56645D"/><rect x="404" y="320" width="82" height="24" fill="#6B4E35" stroke="#8C6D2C"/><text x="445" y="337" text-anchor="middle" class="mx-pk2" fill="#E8DCC0">ЯЩИК ПАРТИИ</text>';
    o += '<text class="mx-scale" x="445" y="358" text-anchor="middle">0 г</text>';
    o += '<text x="330" y="424" text-anchor="middle" class="mx-cap">СТОЛ ФАСОВКИ СФ-1 · 1 500 $</text>';
    // пакет 5 г со штампом
    o += '<g class="mx-bag"><rect x="574" y="170" width="120" height="150" rx="5" fill="rgba(200,215,210,.08)" stroke="rgba(200,215,210,.4)"/><rect x="574" y="170" width="120" height="6" fill="#2ECC71" opacity=".8"/>' +
      '<rect x="586" y="186" width="96" height="22" fill="#E3DED1"/><text x="634" y="201" text-anchor="middle" class="mx-pk" fill="#2F6FB0">ГОЛУБОЙ</text>' +
      '<path d="M598 300l14-30 18 10 14-26 20 18 14-6 6 34Z" fill="#4FA8F0" stroke="#BFE6FF"/><text x="634" y="338" text-anchor="middle" class="mx-kl">ПАКЕТ 5 Г</text></g>';
    o += '<g class="mx-stamp" transform="translate(634,250) rotate(-12)"><rect x="-56" y="-17" width="112" height="34" fill="none" stroke="#E74C3C" stroke-width="3"/><text x="0" y="7" text-anchor="middle" class="mt-sp">97,6 %</text></g>';
    o += '<text x="180" y="160" class="mx-note">три удара молотком:</text><text x="180" y="176" class="mx-note">трещина, трещина, осколки</text>';
    return o + '</g>';
  }
  VIG.meth = {
    html: function () {
      var o = K.DEFS + '<defs>' +
        '<linearGradient id="mtGlass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".35" stop-color="#fff" stop-opacity=".02"/><stop offset="1" stop-color="#fff" stop-opacity=".1"/></linearGradient>' +
        '<linearGradient id="mxArc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4FA8F0"/><stop offset=".5" stop-color="#8E9A94"/><stop offset="1" stop-color="#E74C3C"/></linearGradient></defs>';
      o += K.head('МЕТЛАБОРАТОРИЯ · ОТ КУХНИ ДО ГОЛУБОГО', '<tspan class="mt-st">ГОТОВ</tspan>');
      // цепочка: Кухня отдельно, дальше станки Голубого
      o += '<g class="mt-c mx-ch mx-ch0"><rect x="22" y="50" width="104" height="32" fill="none" stroke="#22302A"/><text x="32" y="71" class="mt-cn">ПГ-1</text><text x="118" y="70" text-anchor="end" class="mt-cs">КУХНЯ</text></g>';
      o += '<text x="136" y="70" class="mx-chl">ГОЛУБОЙ →</text>';
      [['ДВ-5', 'ВОРОНКА'], ['Р-20', 'РЕАКТОР'], ['Т-4', 'ТЕЛЕЖКА'], ['КШ-4', 'ШКАФ'], ['СФ-1', 'ФАСОВКА']].forEach(function (c, i) {
        var x = 216 + i * 98;
        o += '<g class="mt-c mx-ch mx-ch' + (i + 1) + '"><rect x="' + x + '" y="50" width="92" height="32" fill="none" stroke="#22302A"/>' +
          '<text x="' + (x + 8) + '" y="71" class="mt-cn">' + c[0] + '</text><text x="' + (x + 86) + '" y="70" text-anchor="end" class="mt-cs">' + c[1] + '</text></g>';
      });
      o += '<text class="mx-stp" x="22" y="110">1 · БАЛЛОН В ГНЕЗДО</text><text class="mx-key" x="708" y="110" text-anchor="end">E</text>';
      o += sceneK() + sceneA() + sceneB() + sceneC() + sceneD() + sceneE();
      o += '<g class="mx-intro"><rect x="22" y="92" width="686" height="350" fill="#050706" opacity=".88"/><text x="365" y="262" text-anchor="middle" class="mx-it">А ТЕПЕРЬ — ГОЛУБОЙ</text>' +
        '<text x="365" y="292" text-anchor="middle" class="mx-is">пять станков, три промывки, затравка — и 97 % чистоты</text></g>';
      // низ: чистота и сорт
      o += '<path d="M22 448H708" stroke="#22302A"/>';
      o += '<text x="22" y="466" class="v-d">ЧИСТОТА ПАРТИИ</text><text x="462" y="466" text-anchor="end" class="mt-pv"><tspan class="mt-pp">—</tspan> %</text>';
      for (var g = 1; g < GR.length; g++) {
        var a = mpx(GR[g][1]), b = g + 1 < GR.length ? mpx(GR[g + 1][1]) : mpx(100);
        o += '<rect class="mt-seg mt-s' + g + '" x="' + a.toFixed(1) + '" y="486" width="' + (b - a - 2).toFixed(1) + '" height="8" fill="' + GR[g][3] + '"/>';
        if (g > 1) o += '<text x="' + a.toFixed(1) + '" y="510" class="mt-ax">' + GR[g][1] + '</text>';
      }
      o += '<path class="mt-mark" d="M' + mpx(60).toFixed(1) + ' 483l-6-9h12Z" fill="#EEF2EF" opacity="0"/>';
      o += '<rect x="486" y="458" width="222" height="58" fill="none" stroke="#22302A"/><text x="498" y="478" class="v-d">СОРТ ПАРТИИ</text>' +
        '<text class="mx-gn" x="498" y="504">—</text><text class="mx-gp" x="700" y="504" text-anchor="end"></text>';
      return o;
    },
    run: function (root, T) {
      var $q = function (s) { return root.querySelector(s); };
      var st = $q('.mt-st'), stp = $q('.mx-stp'), key = $q('.mx-key'), gn = $q('.mx-gn'), gp = $q('.mx-gp'), pp = $q('.mt-pp'), mark = $q('.mt-mark');
      function step(t, k) { stp.textContent = t; key.textContent = k || ''; }
      function scene(n) { ['k', 'a', 'b', 'c', 'd', 'e'].forEach(function (s) { $q('.mx-' + s).classList.toggle('on', s === n); }); }
      function chain(i) { for (var c = 0; c < 6; c++) $q('.mx-ch' + c).classList.toggle('on', c === i); }
      function pur(p, gi) {
        pp.textContent = p.toFixed(1).replace('.', ','); mark.setAttribute('opacity', 1);
        mark.setAttribute('transform', 'translate(' + (mpx(p) - mpx(60)).toFixed(1) + ',0)');
        var g = gi === undefined ? grade(p) : gi;
        gn.textContent = GR[g][0]; gn.setAttribute('fill', GR[g][3]); gp.textContent = GR[g][2] + ' $/г';
        for (var s = 1; s < GR.length; s++) $q('.mt-s' + s).classList.toggle('on', gi === undefined && s <= g);
      }
      function tr(sel, f) { var el = $q(sel); return function (e) { el.setAttribute('transform', f(e)); }; }
      // ── АКТ 1: КУХНЯ ──
      T.at(100, function () { chain(0); scene('k'); st.textContent = 'КУХНЯ · НА ЧИЛЛЕ'; step('1 · БАЛЛОН В ГНЕЗДО', 'E'); });
      T.anim(250, 550, tr('.mx-gas', function (e) { return 'translate(' + (-160 * (1 - e)).toFixed(1) + ',0)'; }), K.eout);
      var hose = $q('.mx-hose'), hl = hose.getTotalLength(); hose.style.strokeDasharray = hl; hose.style.strokeDashoffset = hl;
      T.anim(800, 400, function (e) { hose.style.strokeDashoffset = (hl * (1 - e)).toFixed(1); });
      T.at(1300, function () { step('2 · СМЕСЬ В КАСТРЮЛЮ', 'E'); });
      T.anim(1300, 600, tr('.mx-pack', function (e) { return 'translate(0,' + (-60 + 150 * e).toFixed(1) + ') scale(1,' + (1 - 0.6 * Math.max(0, e - 0.7) / 0.3).toFixed(2) + ')'; }), function (t) { return t * t; });
      T.anim(1500, 500, tr('.mx-lid', function (e) { return 'translate(0,' + (-14 * Math.sin(Math.PI * e)).toFixed(1) + ')'; }));
      T.at(1950, function () { $q('.mx-pack').setAttribute('opacity', 0); });
      T.at(2200, function () { step('3 · ВЕНТИЛЬ — МАЛЫЙ ОГОНЬ, ПЬЕЗО', 'E + КОЛЕСО'); });
      T.anim(2200, 450, tr('.mx-knob', function (e) { return 'rotate(' + (-120 + 70 * e).toFixed(1) + ' 232 378)'; }), K.eio);
      T.at(2700, function () { root.classList.add('k-spark'); });
      T.at(2850, function () { root.classList.remove('k-spark'); root.classList.add('k-fire'); });
      T.at(3100, function () { step('4 · ВАРКА: КРЫШКА ДРЕБЕЗЖИТ, ИДЁТ ПАР', ''); root.classList.add('k-boil'); });
      var tm = $q('.mx-timer');
      T.anim(3100, 1400, function (e) { var s = Math.round(360 * e); tm.textContent = '0' + Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }, function (t) { return t; });
      T.anim(3300, 1200, tr('.mx-lid', function (e) { return 'translate(0,' + (-3 * Math.abs(Math.sin(e * 40))).toFixed(1) + ')'; }), function (t) { return t; });
      T.at(4500, function () { step('5 · НА ПРОТИВЕНЬ — ЧЕРЕЗ 2 МИНУТЫ КОРКА', 'E'); root.classList.remove('k-fire', 'k-boil'); });
      T.anim(4500, 700, tr('.mx-pot', function (e) { return 'translate(' + (226 * e).toFixed(1) + ',' + (-8 * e).toFixed(1) + ') rotate(' + (62 * Math.max(0, e - 0.4) / 0.6).toFixed(1) + ' 310 316)'; }), K.eio);
      T.anim(4950, 250, tr('.mx-lid', function (e) { return 'rotate(' + (-7 * e).toFixed(2) + ' 246 281)'; }));
      var pour = $q('.mx-pour'), tf = $q('.mx-tf');
      pour.style.strokeDasharray = '7 4';
      T.at(5180, function () { pour.setAttribute('opacity', 0.95); });
      T.anim(5180, 720, function (e) {
        pour.style.strokeDashoffset = (-90 * e).toFixed(1);                       // струя течёт вниз
        tf.setAttribute('x', (598 - 126 * e).toFixed(1)); tf.setAttribute('width', (Math.min(168, 168 * e * 1.0)).toFixed(1));
      }, function (t) { return t; });
      T.at(5900, function () { pour.setAttribute('opacity', 0); root.classList.add('k-crust'); pur(78, 0); });
      T.anim(5900, 250, tr('.mx-lid', function (e) { return 'rotate(' + (-7 * (1 - e)).toFixed(2) + ' 246 281)'; }));
      T.at(6300, function () { root.classList.add('k-box'); });
      // ── ЗАСТАВКА ──
      T.at(7000, function () { root.classList.add('intro'); st.textContent = 'ГОЛУБОЙ'; });
      T.at(8200, function () { root.classList.remove('intro'); });
      // ── АКТ 2: ГОЛУБОЙ ──
      // ДВ-5: три промывки
      var bv = $q('.mx-bv');
      function wash(t0, sh, idx, from, to) {
        T.anim(t0, sh, tr('.mx-fun', function (e) { return 'rotate(' + (14 * Math.sin(e * Math.PI * 6)).toFixed(1) + ' 300 170)'; }), function (t) { return t; });
        T.at(t0, function () { $q('.mx-mixl').setAttribute('opacity', 1); $q('.mx-l2').setAttribute('height', 60 - idx * 12); $q('.mx-l2').setAttribute('y', 276 + idx * 12); });
        T.anim(t0 + sh, 350, function (e) { $q('.mx-mixl').setAttribute('opacity', (1 - e).toFixed(2)); });
        T.at(t0 + sh + 380, function () { $q('.mx-drip').setAttribute('opacity', 0.9); $q('.mx-tap').setAttribute('transform', 'rotate(90 300 338)'); });
        T.anim(t0 + sh + 380, 400, function (e) {
          var h = (60 - idx * 12) * (1 - e) + 4 * e; $q('.mx-l2').setAttribute('height', h.toFixed(1)); $q('.mx-l2').setAttribute('y', (336 - h).toFixed(1));
          bv.textContent = String(Math.round((from + (to - from) * e) * 100) / 100).replace('.', ',');
        });
        T.at(t0 + sh + 800, function () { $q('.mx-drip').setAttribute('opacity', 0); $q('.mx-tap').setAttribute('transform', ''); $q('.mx-w' + idx).classList.add('on'); });
      }
      T.at(8250, function () { chain(1); scene('a'); step('ДВ-5 · ПРОМЫВКА ОСНОВЫ — ТРЯХНУТЬ, СЛИТЬ ДО ЧЕРТЫ', 'E + МЫШЬ'); pp.textContent = '—'; mark.setAttribute('opacity', 0); gn.textContent = '—'; gn.setAttribute('fill', '#6E7A74'); gp.textContent = ''; for (var s = 1; s < GR.length; s++) $q('.mt-s' + s).classList.remove('on'); });
      wash(8400, 500, 0, 90, 95); wash(9300, 280, 1, 95, 97.5); wash(9950, 280, 2, 97.5, 98.75);
      // Р-20: загрузка
      T.at(10800, function () { chain(2); scene('b'); st.textContent = 'Р-20 · ЗАГРУЗКА'; step('Р-20 · ОСНОВА И РАСТВОРИТЕЛЬ — В ГОРЛОВИНУ', 'E'); });
      var rl = $q('.mx-rl');
      var st1 = $q('.mx-st1'); st1.style.strokeDasharray = '6 4';
      function pourCan(sel, t0, h0, h1) {
        var cc = $q(sel + ' .mx-cc');
        T.anim(t0, 300, tr(sel, function (e) { return 'translate(' + (-16 - 104 * (1 - e)).toFixed(1) + ',0)'; }), K.eout);
        // крышечка откручивается и отлетает с горлышка
        T.anim(t0 + 300, 220, function (e) { cc.setAttribute('transform', 'translate(' + (10 * e).toFixed(1) + ',' + (-16 * e).toFixed(1) + ') rotate(' + (40 * e).toFixed(1) + ' 63 117)'); cc.setAttribute('opacity', (1 - e).toFixed(2)); });
        T.anim(t0 + 420, 250, tr(sel, function (e) { return 'translate(-16,0) rotate(' + (55 * e).toFixed(1) + ' 48 155)'; }));
        T.at(t0 + 670, function () { st1.setAttribute('opacity', 0.9); });
        T.anim(t0 + 670, 420, function (e) {
          st1.style.strokeDashoffset = (-60 * e).toFixed(1);
          var h = h0 + (h1 - h0) * e; rl.setAttribute('height', h.toFixed(1)); rl.setAttribute('y', (372 - h).toFixed(1));
        }, function (t) { return t; });
        T.at(t0 + 1090, function () { st1.setAttribute('opacity', 0); $q(sel).setAttribute('opacity', 0); });
      }
      pourCan('.mx-c1', 10900, 0, 70); pourCan('.mx-c2', 11950, 70, 120);
      T.at(13000, function () { step('АКТИВАТОР — В ДОЗАТОР: 6 РИСОК = 6 ПОРЦИЙ', 'E'); });
      T.anim(13000, 450, tr('.mx-jar', function (e) { return 'translate(0,' + (-80 + 72 * e).toFixed(1) + ')'; }), K.eout);
      for (var dm = 0; dm < 6; dm++) T.cls($q('.mx-dm' + dm), 13450 + dm * 50, 'on');
      T.at(13800, function () { $q('.mx-jar').setAttribute('opacity', 0); });
      // варка: потеть
      var curve = $q('.mt-curve'), head = $q('.mt-head'), len = curve.getTotalLength(), tt = $q('.mt-t'), kk = $q('.mt-k');
      var rk = $q('.mx-rk'), man = $q('.mx-man'), pn = $q('.mx-pn'), trend = $q('.mx-trend');
      curve.style.strokeDasharray = len; curve.style.strokeDashoffset = len;
      var PORT = [0.16, 0.29, 0.42, 0.55, 0.66, 0.78], ported = 0;
      T.at(13900, function () { st.textContent = 'Р-20 · ВАРКА'; root.classList.add('b-cook'); lamp(0, true); });
      function lamp(i, on) { var l = $q('.mx-lp' + i); l.setAttribute('fill', on ? l.getAttribute('data-c') : '#1A2420'); l.classList.toggle('lit', on); }
      T.anim(13900, 5600, function (e) {
        var k = e, t = tempAt(k), kn = knobAt(k), p = 60 + 36 * (1 - Math.pow(1 - Math.min(1, k / 0.95), 2)) - 2.2 * Math.exp(-Math.pow((k - 0.47) / 0.05, 2));
        var pres = 1.1 + 0.15 * Math.sin(k * 23) + 1.5 * Math.exp(-Math.pow((k - 0.7) / 0.03, 2));
        curve.style.strokeDashoffset = (len * (1 - k)).toFixed(1);
        head.setAttribute('cx', (MCX0 + (MCX1 - MCX0) * k).toFixed(1)); head.setAttribute('cy', mcy(t).toFixed(1));
        tt.textContent = Math.round(t); kk.textContent = Math.round(100 * Math.min(1, k / 0.9));
        rk.setAttribute('transform', 'rotate(' + (kn * 120).toFixed(1) + ' 318 368)');
        man.setAttribute('transform', 'rotate(' + (-60 + (pres - 1) * 75).toFixed(1) + ' 668 372)');
        var dT = tempAt(Math.min(1, k + 0.02)) - t; trend.textContent = dT > 0.6 ? '↗' : dT < -0.6 ? '↘' : '→';
        rl.setAttribute('fill', mix('#E8E4DA', '#CFE3EA', Math.min(1, k / 0.8)));
        while (ported < PORT.length && k >= PORT[ported]) { ported++; pn.textContent = ported; $q('.mx-dm' + (6 - ported)).classList.remove('on'); root.classList.add('b-press'); (function () { T.at(160, function () { root.classList.remove('b-press'); }); })(); }
        root.classList.toggle('foam', k > 0.41 && k < 0.5); root.classList.toggle('e1', k > 0.41);
        root.classList.toggle('hot', pres > 2); root.classList.toggle('e2', k > 0.67);
        lamp(2, pres > 2);
        if (k > 0.41 && k < 0.5) step('ПЕНА ПОЛЗЁТ — РУЧКУ В ХОЛОД!', 'E + КОЛЕСО');
        else if (pres > 2) step('МАНОМЕТР В КРАСНОМ — КЛАПАН ЗА 10 СЕКУНД!', 'E');
        else if (k < 0.2) step('НАГРЕВ — И ПОРЦИИ ТОЛЬКО В ТЁПЛОЕ', 'E + КОЛЕСО');
        else step('КРУТИ ПО СТРЕЛКЕ ТРЕНДА, А НЕ ПО ФАКТУ', 'E + КОЛЕСО');
        pur(p);
      }, function (x) { return x; });
      T.at(19550, function () { lamp(0, false); lamp(2, false); lamp(1, true); root.classList.remove('b-cook'); step('ЛАМПА ГОТОВО — СМЕСЬ ПРОЗРАЧНАЯ', ''); });
      // Т-4: слив через картридж
      T.at(20300, function () { chain(3); scene('c'); st.textContent = 'Т-4 · СЛИВ'; step('ТЕЛЕЖКУ ПОД КРАН — СЛИВ ЧЕРЕЗ КАРТРИДЖ', 'E'); $q('.mx-cs').setAttribute('opacity', 0.85); });
      for (var q = 0; q < 4; q++) (function (q) { T.anim(20400 + q * 260, 300, function (e) { var r = $q('.mx-tr' + q); r.setAttribute('height', (12 * e).toFixed(1)); r.setAttribute('y', (340 - 12 * e).toFixed(1)); }); })(q);
      T.at(21500, function () { $q('.mx-cs').setAttribute('opacity', 0); });
      // КШ-4: программа, помутнение, затравка
      var prog = $q('.mx-prog'), ppv = $q('.mx-pp'), disp = $q('.mx-disp');
      T.at(21700, function () { chain(4); scene('d'); st.textContent = 'КШ-4 · КРИСТАЛЛИЗАЦИЯ'; step('ШКАФ: МЕДЛЕННО, ДВЕРЬ ЗАКРЫТА', 'E'); });
      T.anim(21800, 3300, function (e) {
        prog.setAttribute('width', (232 * e).toFixed(1)); ppv.textContent = Math.round(100 * e);
        var left = Math.round(600 * (1 - e)); if (!root.classList.contains('d-seed')) disp.textContent = 'МЕДЛЕННО · ' + Math.floor(left / 60) + ':' + ('0' + left % 60).slice(-2);
        $q('.mx-haze').setAttribute('opacity', (e > 0.38 && e < 0.62 ? 0.28 : 0).toFixed(2));
        for (var i = 0; i < 4; i++) {
          var g = Math.max(0, Math.min(1, (e - 0.55) / 0.4));
          $q('.mx-xt' + i).setAttribute('transform', 'translate(0,' + (14 * (1 - g)).toFixed(1) + ')');
          $q('.mx-xt' + i).setAttribute('opacity', g.toFixed(2)); $q('.mx-cl' + i).setAttribute('opacity', (0.55 * (1 - g)).toFixed(2));
        }
        pur(96 + 1.6 * Math.max(0, Math.min(1, (e - 0.5) / 0.5)));
      }, function (x) { return x; });
      T.at(23050, function () { root.classList.add('d-seed'); disp.textContent = 'ЗАТРАВКА!'; step('ПОМУТНЕНИЕ — ЗАТРАВКУ В ДОЗАТОР, ОКНО 15 С', 'E'); });
      T.anim(23200, 450, tr('.mx-vial', function (e) { return 'translate(0,' + (80 * (1 - e)).toFixed(1) + ')'; }), K.eout);
      T.at(23800, function () { root.classList.remove('d-seed'); $q('.mx-vial').setAttribute('opacity', 0); step('РАСТЁТ КРУПНЫЙ ГОЛУБОЙ КРИСТАЛЛ', ''); });
      // СФ-1: молоток, весы, пакет
      T.at(25300, function () { chain(5); scene('e'); st.textContent = 'СФ-1 · ФАСОВКА'; step('МОЛОТОК: ТРЕЩИНА, ТРЕЩИНА, ОСКОЛКИ', 'ЛКМ'); });
      [25500, 25850, 26200].forEach(function (t0, i) {
        T.anim(t0, 300, tr('.mx-ham', function (e) { return 'rotate(' + (-40 + 46 * Math.sin(Math.PI * e)).toFixed(1) + ' 360 250)'; }));
        T.at(t0 + 150, function () { root.classList.add('e-h' + (i + 1)); });
      });
      var sc = $q('.mx-scale');
      T.at(26700, function () { step('ОСКОЛКИ НА ВЕСЫ — В ЯЩИК ПАРТИИ', 'E'); root.classList.add('e-scale'); });
      T.anim(26700, 600, function (e) { sc.textContent = Math.round(860 * e) + ' г'; });
      T.at(27500, function () { step('ПАКЕТ 5 Г СО ШТАМПОМ СОРТА', 'E'); root.classList.add('e-bag'); pur(97.6); st.textContent = 'ГОЛУБОЙ · 97,6 %'; });
    }
  };

  // ── ДЕНЕЖНЫЙ ЦЕХ: настоящая купюра HELIX (build/sitebill.py из presstex) ───
  // Порядок - как в игре (synd_press): P-40 печатает лист 2 x 3 с пластины;
  // водяной знак не печатается - он в бумаге с фабрики, его видно на просвет;
  // D-20 одним ударом через ленту ставит красные номера и вдавливает фольгу-
  // голограмму с гербом, потом сушит под ИК-лампами; C-15 режет и собирает
  // пачку в бандероль. Номиналы и пороги листа - H.DENOM (sh_core.lua).
  // Эта схема заменяет на сайте VIG.press из экрана загрузки.
  var NW = 205, NH = 94, SX = 26, SY = 102, GX = 211, GY = 99;
  var HO = [0.87, 0.96, 0.35, 0.65];                    // presstex.HOLO: где фольга на купюре
  var STK = [600, 352];                                  // центр верхней купюры пачки
  function cellXY(i) { return [SX + (i % 2) * GX, SY + ((i / 2) | 0) * GY]; }
  function holoRect(x, y, w, h, cls) {
    return '<rect class="' + cls + '" x="' + (x + w * HO[0]).toFixed(1) + '" y="' + (y + h * HO[2]).toFixed(1) + '" width="' + (w * (HO[1] - HO[0])).toFixed(1) +
      '" height="' + (h * (HO[3] - HO[2])).toFixed(1) + '" fill="url(#pbRain)"/>';
  }
  function bill(x, y, w, h, src, cls) {
    return '<image class="' + (cls || '') + '" href="img/' + src + '.webp" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" preserveAspectRatio="none"/>';
  }
  var PB_CONS = [['КРАСКА', 64], ['ПЛАСТИНА', 81], ['ФОЛЬГА', 52], ['НОЖ', 23], ['БАНДЕРОЛЬ', 58]];
  VIG.press = {
    html: function () {
      var rain = ['#FF5A7A', '#FFD34E', '#7CF29A', '#5BD8FF', '#8C7BFF', '#FF6BD6', '#FF5A7A'];
      var o = K.DEFS + '<defs>' +
        '<linearGradient id="pbRain" x1="0" y1="0" x2="1" y2="1" spreadMethod="repeat">' +
        rain.map(function (c, i) { return '<stop offset="' + (i / (rain.length - 1)).toFixed(3) + '" stop-color="' + c + '"/>'; }).join('') +
        '<animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="1 1" dur="1.8s" repeatCount="indefinite"/></linearGradient>' +
        '<clipPath id="pbPrint"><rect class="pb-clip" x="20" y="96" width="424" height="0"/></clipPath>' +
        '<clipPath id="pbLensC"><circle cx="0" cy="0" r="44"/></clipPath>' +
        '<linearGradient id="pbHead" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2ECC71" stop-opacity="0"/><stop offset="1" stop-color="#B9F5D2" stop-opacity=".9"/></linearGradient>' +
        '</defs>';
      o += K.head('ЛИНИЯ HELIX · ЛИСТ 2 × 3 КУПЮРЫ', '<tspan class="pb-st">ГОТОВ</tspan>');
      // станки линии
      var CH = [['P-40', 'ПЕЧАТЬ С ПЛАСТИНЫ'], ['D-20', 'НОМЕР · ФОЛЬГА · СУШКА'], ['C-15', 'РЕЗКА · ПАЧКА']];
      o += CH.map(function (c, i) {
        var x = 22 + i * 232;
        return '<g class="mt-c pb-ch pb-ch' + i + '"><rect x="' + x + '" y="52" width="222" height="34" fill="none" stroke="#22302A"/>' +
          '<text x="' + (x + 10) + '" y="74" class="mt-cn">' + c[0] + '</text><text x="' + (x + 214) + '" y="73" text-anchor="end" class="mt-cs">' + c[1] + '</text>' +
          (i < 2 ? '<path d="M' + (x + 224) + ' 69h6l-3-3M' + (x + 230) + ' 69l-3 3" stroke="#3C4742" fill="none" stroke-width="1.5"/>' : '') + '</g>';
      }).join('');
      // лист: чистая бумага, оттиск пластины проявляется под головкой
      o += '<rect x="20" y="96" width="424" height="304" fill="none" stroke="#2E3F37" stroke-dasharray="4 5"/><rect class="pb-paper" x="20" y="96" width="424" height="304" fill="#D8DDD0"/>';
      o += '<g class="pb-printl" clip-path="url(#pbPrint)">';
      for (var i = 0; i < 6; i++) { var p = cellXY(i); o += bill(p[0], p[1], NW, NH, 'bill_print'); }
      o += '</g>';
      // пронумерованные купюры (после D-20): каждая - своя группа, её режут и уносят в пачку
      for (i = 0; i < 6; i++) {
        var q = cellXY(i);
        o += '<g class="pb-cell pb-c' + i + '">' + bill(q[0], q[1], NW, NH, 'bill_full', 'pb-num') + holoRect(q[0], q[1], NW, NH, 'pb-holo') + '</g>';
      }
      o += '<g class="pb-head"><rect x="16" y="94" width="432" height="10" fill="url(#pbHead)"/><rect x="16" y="102" width="432" height="2" fill="#E8FFF1"/></g>';
      // D-20: головка с пятью нумераторами, лента, удар
      o += '<g class="pb-nhead" transform="translate(0,' + SY + ')"><rect x="16" y="-14" width="432" height="10" fill="#2A3731" stroke="#56645D"/>' +
        [60, 140, 230, 320, 400].map(function (x) { return '<rect x="' + x + '" y="-4" width="26" height="6" fill="#56645D"/>'; }).join('') +
        '<rect x="16" y="2" width="432" height="3" fill="#B03A2E" opacity=".9"/></g>';
      o += '<rect class="pb-strike" x="20" y="96" width="424" height="' + NH + '" fill="#FFFFFF" opacity="0"/>';
      // сушка: ИК-лампы над листом
      o += '<g class="pb-ir">' + [70, 170, 280, 390].map(function (x) {
        return '<path d="M' + x + ' 392c-8-14 8-22 0-36s8-22 0-36s8-22 0-36"/>';
      }).join('') + '</g>';
      o += '<path class="pb-cut" d="M232 92V404M16 199H448M16 298H448" stroke="#E74C3C" stroke-width="1.6" stroke-dasharray="7 5"/>';
      // лупа на окне водяного знака первой купюры (окно - 0,63..0,91 ширины, 0,14..0,86 высоты)
      var LX = SX + NW * 0.77, LY = SY + NH * 0.5;
      o += '<g class="pb-lens" transform="translate(' + LX.toFixed(1) + ',' + LY.toFixed(1) + ')"><g class="pb-lensin">' +
        '<circle r="47" fill="#050706"/><g clip-path="url(#pbLensC)"><image href="img/bill_wm.webp" x="-43" y="-51" width="86" height="101" preserveAspectRatio="none"/></g>' +
        '<circle r="46" fill="none" stroke="#EEF2EF" stroke-width="3"/><circle r="50" fill="none" stroke="#2ECC71" stroke-width="1.2"/>' +
        '<path d="M33 33L58 58" stroke="#8E9A94" stroke-width="7" stroke-linecap="round"/>' +
        '<rect x="54" y="-46" width="118" height="54" fill="#050706" opacity=".86"/><text x="62" y="-30" class="pb-ll">НА ПРОСВЕТ</text><text x="62" y="-14" class="pb-ls">знак в бумаге,</text><text x="62" y="0" class="pb-ls">а не краской</text></g></g>';
      // справа: купюра крупно и что в ней защищено
      var ZX = 462, ZY = 100, ZW = 246, ZH = 113;
      o += '<g class="pb-zoom">' + bill(ZX, ZY, ZW, ZH, 'bill_print') + bill(ZX, ZY, ZW, ZH, 'bill_full', 'pb-znum') + holoRect(ZX, ZY, ZW, ZH, 'pb-zholo') +
        '<rect x="' + ZX + '" y="' + ZY + '" width="' + ZW + '" height="' + ZH + '" fill="none" stroke="#2E3F37"/></g>';
      var MK = [[ZX + ZW * 0.77, ZY + ZH * 0.5, '1'], [ZX + ZW * 0.42, ZY + ZH * 0.13, '2'], [ZX + ZW * 0.915, ZY + ZH * 0.5, '3']];
      o += MK.map(function (m) {
        return '<g class="pb-mk pb-m' + m[2] + '"><circle cx="' + m[0].toFixed(1) + '" cy="' + m[1].toFixed(1) + '" r="10" fill="#050706" stroke="#2ECC71" stroke-width="1.6"/>' +
          '<text x="' + m[0].toFixed(1) + '" y="' + (m[1] + 4.5).toFixed(1) + '" text-anchor="middle" class="pb-mn">' + m[2] + '</text></g>';
      }).join('');
      var LG = [['ВОДЯНОЙ ЗНАК', 'в бумаге с фабрики · пластиной не подделать'], ['НОМЕР', 'D-20 · красной лентой, один удар на лист'], ['ГОЛОГРАММА', 'фольга с гербом · радуга под наклоном']];
      o += LG.map(function (l, k) {
        var y = 236 + k * 30;
        return '<g class="pb-lg pb-l' + (k + 1) + '"><circle cx="' + (ZX + 8) + '" cy="' + (y - 4) + '" r="7.5" fill="none" stroke="#2E3F37"/><text x="' + (ZX + 8) + '" y="' + (y - 0.5) + '" text-anchor="middle" class="pb-ln">' + (k + 1) + '</text>' +
          '<text x="' + (ZX + 22) + '" y="' + (y - 4) + '" class="pb-lt">' + l[0] + '</text><text x="' + (ZX + 22) + '" y="' + (y + 8) + '" class="pb-ld">' + l[1] + '</text></g>';
      }).join('');
      // пачка: срезы купюр и верхняя купюра под бандеролью
      o += '<text x="' + ZX + '" y="324" class="v-d">ПАЧКА · 100 КУПЮР</text><text x="708" y="324" text-anchor="end" class="pb-cnt">7</text>';
      o += '<g class="pb-stack">';
      for (var e = 0; e < 7; e++) o += '<rect x="' + (STK[0] - 70) + '" y="' + (382 - e * 2.2).toFixed(1) + '" width="140" height="3" fill="' + (e % 2 ? '#C9CFC2' : '#B5BDAE') + '"/>';
      o += '</g><g class="pb-bundle">' + bill(STK[0] - 70, 334, 140, 64, 'bill_full') + holoRect(STK[0] - 70, 334, 140, 64, 'pb-zholo on') +
        '<rect x="' + (STK[0] - 14) + '" y="332" width="28" height="68" fill="#CDBB8E"/><rect x="' + (STK[0] - 14) + '" y="336" width="28" height="4" fill="#295640"/><rect x="' + (STK[0] - 14) + '" y="392" width="28" height="4" fill="#295640"/>' +
        '<text x="' + STK[0] + '" y="370" text-anchor="middle" class="pb-bn">100</text></g>';
      // номиналы: своя пластина и свой порог листа
      o += '<text x="22" y="434" class="v-d">ПЛАСТИНЫ</text>';
      [['100', 45], ['500', 62], ['1000', 75], ['5000', 88]].map(function (d, k) {
        var x = 102 + k * 152;
        o += '<g class="pb-pl' + (k ? '' : ' on') + '"><rect x="' + x + '" y="414" width="142" height="30" fill="none" stroke="#2E3F37"/>' +
          '<text x="' + (x + 10) + '" y="435" class="pb-pv">$' + d[0] + '</text><text x="' + (x + 134) + '" y="434" text-anchor="end" class="pb-pq">ЛИСТ ОТ ' + d[1] + ' %</text></g>';
      });
      // расходники
      for (i = 0; i < PB_CONS.length; i++) {
        var cx = 22 + i * 140;
        o += '<g class="pr-c pb-k' + i + '"><text x="' + cx + '" y="474" class="v-d">' + PB_CONS[i][0] + '</text>' +
          '<text x="' + (cx + 124) + '" y="474" text-anchor="end" class="pr-pc">' + PB_CONS[i][1] + ' %</text>' +
          '<rect x="' + cx + '" y="482" width="124" height="6" fill="#131B18"/><rect class="pr-cb" x="' + cx + '" y="482" width="' + (124 * PB_CONS[i][1] / 100).toFixed(1) + '" height="6" fill="#2ECC71"/></g>';
      }
      o += '<text class="pb-err" x="22" y="514">C-15: НОЖ НА ИСХОДЕ · 7 % — ЗАМЕНИТЬ ДО СЛЕДУЮЩЕГО ЛИСТА</text>';
      return o;
    },
    run: function (root, T) {
      var st = root.querySelector('.pb-st'), clip = root.querySelector('.pb-clip'), head = root.querySelector('.pb-head');
      var nh = root.querySelector('.pb-nhead'), strike = root.querySelector('.pb-strike'), cnt = root.querySelector('.pb-cnt');
      function chain(k) { for (var c = 0; c < 3; c++) root.querySelector('.pb-ch' + c).classList.toggle('on', c === k); }
      function cons(k, a, b, at, dur) {
        var g = root.querySelector('.pb-k' + k), pc = g.querySelector('.pr-pc'), cb = g.querySelector('.pr-cb');
        T.anim(at, dur, function (e) { var v = a + (b - a) * e; pc.textContent = Math.round(v) + ' %'; cb.setAttribute('width', (124 * v / 100).toFixed(1)); });
      }
      function cellT(i, dx, dy, s) {
        var p = cellXY(i), cx = p[0] + NW / 2, cy = p[1] + NH / 2;
        root.querySelector('.pb-c' + i).setAttribute('transform', 'translate(' + (cx + dx).toFixed(1) + ',' + (cy + dy).toFixed(1) + ') scale(' + s.toFixed(3) + ') translate(' + (-cx) + ',' + (-cy) + ')');
      }
      // 1. P-40: оттиск пластины под зелёной головкой
      T.at(100, function () { chain(0); root.classList.add('p1'); st.textContent = 'P-40 · ПЕЧАТЬ $100'; });
      T.anim(250, 2100, function (e) {
        clip.setAttribute('height', (304 * e).toFixed(1)); head.setAttribute('transform', 'translate(0,' + (300 * e).toFixed(1) + ')');
      }, function (t) { return t; });
      cons(0, 64, 62, 300, 2000); cons(1, 81, 80, 300, 2000);
      // 2. водяной знак - лупа на окне
      T.at(2500, function () { root.classList.add('p2'); st.textContent = 'ВОДЯНОЙ ЗНАК · НА ПРОСВЕТ'; root.querySelector('.pb-m1').classList.add('on'); root.querySelector('.pb-l1').classList.add('on'); });
      T.at(4300, function () { root.classList.add('p2b'); });
      // 3. D-20: удар по каждому ряду - номера и фольга
      T.at(4500, function () { chain(1); root.classList.add('p3'); st.textContent = 'D-20 · НОМЕР И ГОЛОГРАММА'; });
      [0, 1, 2].forEach(function (r) {
        var t0 = 4600 + r * 520, y0 = SY + (r ? (r - 1) * GY : 0), y1 = SY + r * GY;
        T.anim(t0, 200, function (e) { nh.setAttribute('transform', 'translate(0,' + (y0 + (y1 - y0) * e).toFixed(1) + ')'); }, K.eio);
        T.at(t0 + 230, function () {
          strike.setAttribute('y', y1 - 2);
          root.querySelector('.pb-c' + (r * 2)).classList.add('on'); root.querySelector('.pb-c' + (r * 2 + 1)).classList.add('on');
          if (r === 0) { root.classList.add('znum'); root.querySelector('.pb-m2').classList.add('on'); root.querySelector('.pb-l2').classList.add('on'); }
          if (r === 1) { root.querySelector('.pb-m3').classList.add('on'); root.querySelector('.pb-l3').classList.add('on'); }
        });
        T.anim(t0 + 230, 260, function (e) { strike.setAttribute('opacity', (0.7 * (1 - e)).toFixed(3)); });
      });
      cons(2, 52, 51, 4800, 1200);
      // 4. сушка
      T.at(6300, function () { root.classList.add('p4'); st.textContent = 'D-20 · СУШКА ПОД ИК-ЛАМПАМИ'; });
      // 5. C-15: резка и в пачку
      T.at(7500, function () { chain(2); root.classList.add('p5'); st.textContent = 'C-15 · РЕЗКА'; });
      T.anim(8000, 400, function (e) {
        for (var i = 0; i < 6; i++) cellT(i, ((i % 2) ? 6 : -6) * e, (((i / 2) | 0) - 1) * 6 * e, 1);
      }, K.eout);
      cons(3, 23, 7, 7700, 900);
      T.at(8600, function () { st.textContent = 'C-15 · В ПАЧКУ'; });
      for (var c = 0; c < 6; c++) (function (i) {
        var p = cellXY(i), cx = p[0] + NW / 2, cy = p[1] + NH / 2, ex = (i % 2) ? 6 : -6, ey = (((i / 2) | 0) - 1) * 6;
        T.anim(8650 + i * 110, 520, function (e) {
          cellT(i, ex + (STK[0] - cx - ex) * e, ey + (STK[1] - cy - ey) * e + 24 * Math.sin(Math.PI * e), 1 - 0.32 * e);
          root.querySelector('.pb-c' + i).style.opacity = (e > 0.7 ? (1 - e) / 0.3 : 1).toFixed(3);
        }, K.eio);
      })(c);
      T.at(9700, function () { root.classList.add('p6'); st.textContent = 'ПАЧКА · 100 КУПЮР В БАНДЕРОЛИ'; cnt.textContent = '8'; });
      cons(4, 58, 57, 9700, 400);
      T.at(10300, function () { root.classList.add('p7'); });
    }
  };


  // ── карта СИНДИКАТ БАНК: настоящий облик из игры (build/sitecard.py из cardskin.py) ──
  // VK.card из экрана загрузки рисовал карту сам; на сайте схемы банкомата и терминала
  // (vig2.js зовёт K.card при сборке) получают лицо той карты, что в руке в игре.
  // Голограмма-ромб на ней переливается, как фольга на купюре.
  var cardN = 0;
  VK.card = function (w) {
    var h = w * 323 / 522, id = 'sdCard' + (++cardN), r = (w * 0.035).toFixed(1);
    return '<g class="card"><defs><clipPath id="' + id + 'c"><rect width="' + w + '" height="' + h.toFixed(1) + '" rx="' + r + '"/></clipPath>' +
      '<linearGradient id="' + id + 'g" x1="0" y1="0" x2="1" y2="1" spreadMethod="repeat"><stop offset="0" stop-color="#FF7AA0"/><stop offset=".33" stop-color="#7CF29A"/>' +
      '<stop offset=".66" stop-color="#7FA8FF"/><stop offset="1" stop-color="#FF7AA0"/>' +
      '<animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="1 1" dur="2.4s" repeatCount="indefinite"/></linearGradient></defs>' +
      '<g clip-path="url(#' + id + 'c)"><image href="img/card_std.webp" width="' + w + '" height="' + h.toFixed(1) + '" preserveAspectRatio="none"/>' +
      '<rect x="' + (w * 406 / 522).toFixed(1) + '" y="' + (h * 100 / 323).toFixed(1) + '" width="' + (w * 60 / 522).toFixed(1) + '" height="' + (h * 60 / 323).toFixed(1) +
      '" fill="url(#' + id + 'g)" opacity=".4" style="mix-blend-mode:screen"/></g>' +
      '<rect width="' + w + '" height="' + h.toFixed(1) + '" rx="' + r + '" fill="none" stroke="#000" stroke-opacity=".5"/></g>';
  };


  // ── карта входит в щель и выходит из неё: банкомат и терминал ──────────────────────────
  // Карта та же (VK.card выше), её группа переезжает в обёртку с маской щели: что зашло за
  // кромку щели - не видно. Чип на левом краю лицевой стороны, им карта и входит: в банкомат
  // она поворачивается на 90° (левый край - вверх, в горизонтальную щель), в терминал входит
  // слева направо в боковую щель - без поворота. Положение - центр карты, угол и масштаб.
  function slotCard(root, sel, cw, cx0, cy0, clipId, box) {
    var g = root.querySelector(sel), ch = cw * 323 / 522;
    var ns = 'http://www.w3.org/2000/svg', svg = root.ownerSVGElement || root;
    var cp = document.createElementNS(ns, 'clipPath'), cr = document.createElementNS(ns, 'rect');
    cp.setAttribute('id', clipId); cp.appendChild(cr); svg.appendChild(cp);
    var wrap = document.createElementNS(ns, 'g');
    svg.appendChild(wrap); wrap.appendChild(g);           // поверх всей схемы: летит над табличками
    wrap.setAttribute('clip-path', 'url(#' + clipId + ')');
    g.style.transition = 'none'; g.style.opacity = 1;
    g.style.transformOrigin = '0 0'; g.style.transformBox = 'view-box';   // vig.css ставит своё начало
    var c0 = [cx0 + cw / 2, cy0 + ch / 2];          // центр карты в покое
    function clip(on) {
      var b = on ? box : [0, 0, 730, 530];
      cr.setAttribute('x', b[0]); cr.setAttribute('y', b[1]); cr.setAttribute('width', b[2]); cr.setAttribute('height', b[3]);
    }
    function put(p) {
      g.style.transform = 'translate(' + p[0].toFixed(2) + 'px,' + p[1].toFixed(2) + 'px) rotate(' + p[2].toFixed(2) + 'deg) scale(' + p[3].toFixed(4) +
        ') translate(' + (-c0[0]).toFixed(2) + 'px,' + (-c0[1]).toFixed(2) + 'px)';
    }
    function mv(T, at, dur, a, b, ease) {
      T.anim(at, dur, function (e) { put([a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e, a[2] + (b[2] - a[2]) * e, a[3] + (b[3] - a[3]) * e]); }, ease || K.eio);
    }
    clip(false);
    put([c0[0], c0[1], 0, 1]);
    return { REST: [c0[0], c0[1], 0, 1], clip: clip, mv: mv, ch: ch, put: put };
  }

  // Банкомат: щель картоприёмника - x 236..300, кромка y = 432 (vig2.js). Карта ребром 58 ед.
  var atm0 = VIG.atm;
  VIG.atm = {
    html: function () { return atm0.html(); },
    run: function (root, TL) {
      atm0.run(root, TL);
      var SY = 432, S = 58 / (290 * 323 / 522), L = 290 * S;           // масштаб и длина карты в щели
      var c = slotCard(root, '.at-card', 290, 398, 64, 'atSlot', [0, SY, 730, 530 - SY]);
      var NEAR = [268, SY + L / 2 + 8, 90, S], IN = [268, SY - L / 2 - 4, 90, S], OUT = [268, SY + L / 2 - 30, 90, S];
      c.mv(TL, 200, 800, c.REST, NEAR);                                 // к щели, чипом вперёд
      TL.at(1000, function () { c.clip(true); });
      c.mv(TL, 1000, 600, NEAR, IN, function (k) { return k * k; });  // щель затягивает
      c.mv(TL, 7900, 500, IN, OUT, K.eout);                             // «ЗАБЕРИТЕ КАРТУ»: выезжает
      c.mv(TL, 9300, 300, OUT, NEAR, K.eio);                            // её вынимают
      TL.at(9600, function () { c.clip(false); });
      c.mv(TL, 9600, 800, NEAR, c.REST);
    }
  };

  // Терминал: дороже 10 000 $ - карту в терминал. Боковая щель на правом боку корпуса: x = 320,
  // y 366..446 (рядом с клавишами). Карта входит левым краем (чип) на 60 % и торчит, пока вводят ПИН.
  var term0 = VIG.term;
  VIG.term = {
    html: function () {
      return term0.html().replace('<g class="tm-wave"',
        '<rect x="317" y="364" width="6" height="84" rx="3" fill="#030504" stroke="#3A4C43"/><g class="tm-wave"');
    },
    run: function (root, TL) {
      term0.run(root, TL);
      var SX = 320, S = 80 / (250 * 323 / 522), L = 250 * S, cy = 406;
      // до 5,1 с карту водит CSS (касание); дальше - щель, поэтому и обёртку ставим только тогда
      TL.at(5100, function () {
        var c = slotCard(root, '.tm-cf', 250, 418, 108, 'tmSlot', [SX, 0, 730 - SX, 530]);
        var NEAR = [SX + L / 2 + 10, cy, 0, S], IN = [SX + L / 2 - L * 0.6, cy, 0, S];
        c.mv(TL, 0, 700, c.REST, NEAR);
        TL.at(700, function () { c.clip(true); });
        c.mv(TL, 700, 350, NEAR, IN, function (k) { return k * k; });
        c.mv(TL, 2900, 350, IN, NEAR, K.eout);                          // «ОДОБРЕНО» - вынули
        TL.at(3250, function () { c.clip(false); });
        c.mv(TL, 3250, 800, NEAR, c.REST);
      });
    }
  };


  // ── ЭКОНОМИКА: казна города за час игры ─────────────────────────────────────
  // Статьи и правила - addon/synd_mayor/.../sh_city_budget.lua (C.TAX, C.ARTICLES,
  // оклад только C.GOV, пособие 30, бюджет 25 000 при запуске карты). Суммы -
  // build/budgetsim.py --lines 20 (20 игроков, ставки по умолчанию): модель читает
  // те же числа из Lua. Указ мэра: подоходный 20 -> 30 % = доход статьи x1,5.
  var ECO_IN = [['Транспортный налог', 9360, 'машины, раз в 30 мин'], ['Подоходный налог', 8400, 'ферма, нефть, кухня, бизнес'],
    ['Электроэнергия', 6900, 'приборы в городской сети'], ['Лицензии и штрафы', 5500, 'штрафы, залоги, пошлины'],
    ['Аренда недвижимости', 4800, 'двери, раз в 15 мин'], ['Транзитный налог', 3520, 'рейсы курьеров'],
    ['Топливо на АЗС', 3343, 'вся выручка АЗС'], ['Гос. цех банкира', 3240, '30 % напечатанного'],
    ['Коммерческий налог', 3000, 'сверху на покупки в F4'], ['Промышленный налог', 2800, 'руда и слитки'],
    ['Казино', 500, 'доля с дохода заведения']];
  var ECO_OUT = [['Оклады госслужбе', 22100, 'мэр, полиция, медики, банкир'], ['Тюрьма и КПЗ', 4000, '50 $ в минуту за человека'],
    ['Госзаказы', 3600, 'медикаменты и амуниция'], ['Больница', 2500, 'реанимация'], ['Пособие', 2400, 'безработным, 30 $'],
    ['АЭС: энергия', 920, 'инженерам за МВт·ч'], ['Уран для АЭС', 720, 'курьерам'], ['Служебный транспорт', 225, 'полиция и медики'],
    ['Топливо для АЗС', 216, 'курьерам']];
  var EC = { x0: 22, x1: 232, o0: 498, o1: 708, y0: 64, rh: 21.5, vx: 365, vy: 168 };
  function money(v) { return Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function ecoRow(r, i, out) {
    var x0 = out ? EC.o0 : EC.x0, x1 = out ? EC.o1 : EC.x1, y = EC.y0 + i * EC.rh, max = out ? 22100 : 9360;
    var w = (x1 - x0) * r[1] / max, col = out ? '#E2725B' : '#2ECC71';
    return '<g class="ec-r ec-' + (out ? 'o' : 'i') + i + '" style="transition-delay:' + (i * 55) + 'ms">' +
      '<text x="' + x0 + '" y="' + (y + 9) + '" class="ec-n">' + r[0] + '</text>' +
      '<text x="' + x1 + '" y="' + (y + 9) + '" text-anchor="end" class="ec-v ' + (out ? 'out' : 'in') + '">' + money(r[1]) + '</text>' +
      '<rect x="' + x0 + '" y="' + (y + 13) + '" width="' + (x1 - x0) + '" height="3" fill="#131B18"/>' +
      '<rect class="ec-bar" x="' + (out ? x1 - w : x0).toFixed(1) + '" y="' + (y + 13) + '" width="' + w.toFixed(1) + '" height="3" fill="' + col + '"/>' +
      '<title>' + r[2] + '</title></g>';
  }
  function ecoFlow(i, out, v, max) {
    var y = EC.y0 + i * EC.rh + 14, sw = (1 + 7 * v / max).toFixed(1);
    var d = out ? 'M' + (EC.vx + 78) + ' ' + EC.vy + 'C' + (EC.vx + 112) + ' ' + EC.vy + ' ' + (EC.o0 - 34) + ' ' + y + ' ' + (EC.o0 - 4) + ' ' + y
                : 'M' + (EC.x1 + 4) + ' ' + y + 'C' + (EC.x1 + 34) + ' ' + y + ' ' + (EC.vx - 112) + ' ' + EC.vy + ' ' + (EC.vx - 78) + ' ' + EC.vy;
    return '<path class="ec-f ec-f' + (out ? 'o' : 'i') + i + '" d="' + d + '" stroke="' + (out ? '#E2725B' : '#2ECC71') + '" stroke-width="' + sw + '" fill="none" stroke-opacity=".28"/>' +
      '<path class="ec-fd" d="' + d + '" stroke="' + (out ? '#FFB199' : '#9BF0BE') + '" stroke-width="' + Math.max(1.2, sw * 0.45).toFixed(1) + '" fill="none" stroke-dasharray="2 11" stroke-linecap="round"/>';
  }
  // Минута часа: [приход, расход]. Как берёт игра (sh_city_budget.lua, казначейство):
  // получка раз в 3 мин (PAYDAY 180 с) - оклады госслужбе и пособия, (22 100 + 2 400) / 20,
  // с ней же тариф на свет 6 900 / 20; аренда раз в 15 мин 4 800 / 4; транспортный раз в
  // 30 мин 9 360 / 2; остальное ровно по минутам. Сумма за час = строкам модели выше.
  var ECB = { y: 466, slot: 686 / 60, w: 8, c: 40 / Math.sqrt(6730) };
  function ecoMin(m) {
    var inc = 30303 / 60, out = 12181 / 60;
    if (m % 3 === 0) { inc += 345; out += 1225; }
    if (m % 15 === 0) inc += 1200;
    if (m % 30 === 0) inc += 4680;
    return [inc, out];
  }
  VIG.eco = {
    html: function () {
      var o = K.DEFS + '<defs><radialGradient id="ecGlow"><stop offset="0" stop-color="#2ECC71" stop-opacity=".22"/><stop offset="1" stop-color="#2ECC71" stop-opacity="0"/></radialGradient></defs>';
      o += K.head('КАЗНА ГОРОДА · ОДИН ЧАС ИГРЫ', '<tspan class="ec-st">МОДЕЛЬ: 20 ИГРОКОВ</tspan>');
      o += '<text x="' + EC.x0 + '" y="56" class="ec-h in">ДОХОДЫ · $ В ЧАС</text><text x="' + EC.o1 + '" y="56" text-anchor="end" class="ec-h out">РАСХОДЫ · $ В ЧАС</text>';
      var i;
      for (i = 0; i < ECO_IN.length; i++) o += ecoFlow(i, false, ECO_IN[i][1], 9360);
      for (i = 0; i < ECO_OUT.length; i++) o += ecoFlow(i, true, ECO_OUT[i][1], 22100);
      for (i = 0; i < ECO_IN.length; i++) o += ecoRow(ECO_IN[i], i, false);
      for (i = 0; i < ECO_OUT.length; i++) o += ecoRow(ECO_OUT[i], i, true);
      // казна: шестигранник знака города
      var hx = '', r = 78;
      for (i = 0; i < 6; i++) { var a = i * Math.PI / 3; hx += (i ? 'L' : 'M') + (EC.vx + r * Math.cos(a)).toFixed(1) + ' ' + (EC.vy + r * Math.sin(a)).toFixed(1); }
      o += '<circle cx="' + EC.vx + '" cy="' + EC.vy + '" r="120" fill="url(#ecGlow)" class="ec-glow"/>';
      o += '<path class="ec-hx" d="' + hx + 'Z" fill="#08100C" stroke="#2ECC71" stroke-width="2"/><path d="' + hx + 'Z" fill="none" stroke="#2ECC71" stroke-opacity=".25" stroke-width="9" class="ec-ring"/>';
      o += '<text x="' + EC.vx + '" y="' + (EC.vy - 34) + '" text-anchor="middle" class="ec-vt">КАЗНА</text>';
      o += '<text x="' + EC.vx + '" y="' + (EC.vy + 6) + '" text-anchor="middle" class="ec-cash"><tspan class="ec-cv">25 000</tspan> $</text>';
      o += '<text x="' + EC.vx + '" y="' + (EC.vy + 26) + '" text-anchor="middle" class="ec-clk">МИНУТА <tspan class="ec-min">00</tspan> / 60</text>';
      o += '<text x="' + EC.vx + '" y="' + (EC.vy + 44) + '" text-anchor="middle" class="ec-sub">старт карты: 25 000</text>';
      // итоги часа
      o += '<g class="ec-tot"><text x="' + (EC.vx - 70) + '" y="282" class="ec-tl">ДОХОД</text><text x="' + (EC.vx - 70) + '" y="300" class="ec-tv in"><tspan class="ec-ti">51 363</tspan></text>' +
        '<text x="' + (EC.vx + 70) + '" y="282" text-anchor="end" class="ec-tl">РАСХОД</text><text x="' + (EC.vx + 70) + '" y="300" text-anchor="end" class="ec-tv out">36 681</text></g>';
      // указ мэра: три ползунка, двигается подоходный (ползунки уже - надпись указа справа не наезжает)
      o += '<path d="M22 322H708" stroke="#22302A"/>';
      o += '<text x="22" y="344" class="ec-h">УКАЗ МЭРА · СТАВКИ В КОРИДОРАХ</text><text x="708" y="344" text-anchor="end" class="ec-h">САЛЬДО ЧАСА</text>';
      var SL = [['Подоходный налог', 0, 35, 20, '%'], ['Аренда двери', 0, 600, 300, '$/ч'], ['Тариф на свет', 0, 600, 300, '$/ч']];
      SL.forEach(function (s, k) {
        var x = 22 + k * 150, w = 130, p = (s[3] - s[1]) / (s[2] - s[1]);
        o += '<g class="ec-sl ec-s' + k + '"><text x="' + x + '" y="368" class="ec-n">' + s[0] + '</text>' +
          '<text x="' + (x + w) + '" y="368" text-anchor="end" class="ec-sv"><tspan class="ec-svv">' + s[3] + '</tspan> ' + s[4] + '</text>' +
          '<rect x="' + x + '" y="378" width="' + w + '" height="4" rx="2" fill="#16201C"/><rect class="ec-sf" x="' + x + '" y="378" width="' + (w * p).toFixed(1) + '" height="4" rx="2" fill="#2ECC71"/>' +
          '<circle class="ec-th" cx="' + (x + w * p).toFixed(1) + '" cy="380" r="7" fill="#EEF2EF" stroke="#2ECC71" stroke-width="2"/>' +
          '<text x="' + x + '" y="398" class="ec-lim">' + s[1] + '</text><text x="' + (x + w) + '" y="398" text-anchor="end" class="ec-lim">' + s[2] + '</text></g>';
      });
      o += '<text x="708" y="386" text-anchor="end" class="ec-saldo">+<tspan class="ec-sv2">14 682</tspan> $/ч</text>';
      o += '<text class="ec-dec" x="708" y="404" text-anchor="end">УКАЗ: ПОДОХОДНЫЙ 30 % · +4 200 $/ч</text>';
      // приход и расход по минутам: зелёное вверх, красное вниз (высота - корень суммы)
      o += '<path d="M22 412H708" stroke="#16201C"/>';
      o += '<text x="22" y="428" class="ec-h">ПРИХОД И РАСХОД ПО МИНУТАМ</text>';
      o += '<path d="M22 ' + ECB.y + 'H708" stroke="#3C4742"/>';
      for (var m = 1; m <= 60; m++) {
        var f = ecoMin(m), x = 22 + (m - 1) * ECB.slot + (ECB.slot - ECB.w) / 2, hu = ECB.c * Math.sqrt(f[0]), hd = ECB.c * Math.sqrt(f[1]);
        o += '<g class="ec-b ec-b' + m + '"><rect x="' + x.toFixed(1) + '" y="' + (ECB.y - hu).toFixed(1) + '" width="' + ECB.w + '" height="' + hu.toFixed(1) + '" fill="' + (f[0] > 1000 ? '#7CF29A' : '#2ECC71') + '"/>' +
          '<rect x="' + x.toFixed(1) + '" y="' + (ECB.y + 1) + '" width="' + ECB.w + '" height="' + hd.toFixed(1) + '" fill="' + (f[1] > 1000 ? '#FF6A4D' : '#B84A35') + '"/></g>';
      }
      [['#FF6A4D', 'получка госслужбе −1 225 · каждые 3 мин'], ['#7CF29A', 'аренда +1 200 · раз в 15 мин'], ['#7CF29A', 'транспортный +4 680 · раз в 30 мин']].forEach(function (l, k) {
        var x = 22 + k * 232;
        o += '<rect x="' + x + '" y="510" width="8" height="8" fill="' + l[0] + '"/><text x="' + (x + 14) + '" y="518" class="ec-lg">' + l[1] + '</text>';
      });
      return o;
    },
    run: function (root, T) {
      var cv = root.querySelector('.ec-cv'), mn = root.querySelector('.ec-min'), sv = root.querySelector('.ec-sv2'), ti = root.querySelector('.ec-ti');
      var svg = root.ownerSVGElement || root, NS = 'http://www.w3.org/2000/svg';
      T.cls(root, 100, 'p1');
      // час по минутам: казна дышит - капает приход, каждые 3 минуты уходит получка
      function float(txt, good) {
        var t = document.createElementNS(NS, 'text');
        t.setAttribute('x', EC.vx); t.setAttribute('y', good ? EC.vy - 86 : EC.vy + 92); t.setAttribute('text-anchor', 'middle'); // приход - над казной, расход - под ней
        t.setAttribute('class', 'ec-fl ' + (good ? 'in' : 'out')); t.textContent = txt;
        root.appendChild(t);
        T.anim(0, 1100, function (e) {
          t.setAttribute('transform', 'translate(0,' + (good ? -14 * e : 10 * e).toFixed(1) + ')');
          t.setAttribute('opacity', (e < 0.15 ? e / 0.15 : 1 - (e - 0.15) / 0.85).toFixed(3));
          if (e >= 1 && t.parentNode) t.parentNode.removeChild(t);
        });
      }
      function pulse(cls, ms) { root.classList.add(cls); T.at(ms, function () { root.classList.remove(cls); }); }
      var bal = 25000, DT = 7000 / 60;
      for (var m = 1; m <= 60; m++) (function (m) {
        T.at(1300 + m * DT, function () {
          var f = ecoMin(m);
          bal += f[0] - f[1];
          cv.textContent = money(bal); mn.textContent = ('0' + m).slice(-2);
          root.querySelector('.ec-b' + m).classList.add('on');
          if (m % 30 === 0) { float('+4 680 транспортный', true); pulse('pi0', 380); pulse('gain', 300); }
          else if (m % 15 === 0) { float('+1 200 аренда', true); pulse('pi4', 380); pulse('gain', 300); }
          if (m % 3 === 0) { if (m % 15) float('−880 получка', false); pulse('po', 300); pulse('pay', 260); pulse('pi2', 300); }
        });
      })(m);
      T.at(3600, function () { root.classList.add('p2'); });
      // указ мэра: подоходный 20 -> 30 %
      var s0 = root.querySelector('.ec-s0'), th = s0.querySelector('.ec-th'), sf = s0.querySelector('.ec-sf'), svv = s0.querySelector('.ec-svv');
      var row = root.querySelector('.ec-i1'), rv = row.querySelector('.ec-v'), rb = row.querySelector('.ec-bar');
      T.at(8600, function () { root.classList.add('p3'); });
      T.anim(8700, 1300, function (e) {
        var pct = 20 + 10 * e, inc = 8400 * pct / 20;
        th.setAttribute('cx', (22 + 130 * pct / 35).toFixed(1)); sf.setAttribute('width', (130 * pct / 35).toFixed(1)); svv.textContent = Math.round(pct);
        rv.textContent = money(inc); rb.setAttribute('width', Math.min(210, 210 * inc / 9360).toFixed(1));
        ti.textContent = money(51363 + (inc - 8400)); sv.textContent = money(14682 + (inc - 8400));
      }, K.eio);
    }
  };

  // ── НАВЫКИ: витрина вкладки F4 «НАВЫКИ» ─────────────────────────────────────
  // Лист навыков и сцены - те же, что в игре: shared/js/skills_data.js и skillart.js
  // (build/siteskills.py из sh_syn_skills.lua и cl_f4_art.lua). Не SVG, а HTML:
  // VIG.skills.box() - runVig кладёт его в рамку схемы как есть, размеры - в cqw рамки.
  // Персонаж - пример (уровни ниже), подписан на витрине.
  var SK_DEMO = { Energy: 3, Mining: 4, Logistics: 2, Medicine: 1, Forensics: 4, Cooking: 2, Oil: 1, Farming: 3,
    Trade: 2, Law: 4, Chemistry: 6, Botany: 2, printing: 5, Crime: 3, Survival: 4 };
  var SK_ORDER = ['Forensics', 'Energy', 'Mining', 'Chemistry', 'printing', 'Law', 'Medicine', 'Logistics', 'Survival', 'Crime',
    'Cooking', 'Oil', 'Farming', 'Trade', 'Botany'];
  var skN = 0;
  function rgb(h) { var n = parseInt(h.slice(1), 16); return ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255); }
  function sten(t, hcq) { hcq *= 7.3;          // число трафаретом сервера (как SYN.SK.sten в F4), высота в cqw
    var S = window.SYN && SYN.STEN; t = String(t);
    if (!S || !S.g) return '<b>' + t + '</b>';
    var x = 0, d = '';
    for (var i = 0; i < t.length; i++) { var g = S.g[t.charAt(i)]; if (!g) continue; d += '<path transform="translate(' + x.toFixed(1) + ' 0)" d="' + g[1] + '"/>'; x += g[0] + 5; }
    x = Math.max(1, x - 5);
    return '<svg class="sten" viewBox="0 ' + S.top + ' ' + x.toFixed(1) + ' ' + S.h + '" fill="currentColor" style="height:' + hcq + 'px;width:' + (hcq * x / S.h).toFixed(2) + 'px">' + d + '</svg>';
  }
  function master(hcq) { hcq *= 7.3;
    var S = window.SYN && SYN.STEN;
    if (!S || !S.master) return '<b>МАСТЕР</b>';
    return '<svg class="sten" viewBox="0 ' + S.top + ' ' + S.master[0] + ' ' + S.h + '" fill="currentColor" style="height:' + hcq + 'px;width:' + (hcq * S.master[0] / S.h).toFixed(2) + 'px"><path d="' + S.master[1] + '"/></svg>';
  }
  function art(id) { var a = window.SYN && SYN.ART && SYN.ART[id]; skN++; return a ? a.replace(/@/g, 'w' + skN + '_') : ''; }
  function skById(id) { var L = window.SYN_SK || []; for (var i = 0; i < L.length; i++) if (L[i].id === id) return L[i]; return null; }
  VIG.skills = {
    box: function () {
      var L = window.SYN_SK || [], sum = 0, tot = 0, i;
      for (i = 0; i < L.length; i++) { sum += SK_DEMO[L[i].id] || 1; tot += L[i].cap; }
      var eq = L.map(function (s) {
        var lv = SK_DEMO[s.id] || 1;
        return '<div class="sk-eqc" data-id="' + s.id + '" style="--c:' + s.col + ';--h:' + (100 * lv / s.cap).toFixed(1) + '%" title="' + s.name + '"><i></i>' +
          ((window.SYN && SYN.GLYPH && SYN.GLYPH[s.id]) || '') + '</div>';
      }).join('');
      var grid = L.map(function (s) {
        return '<div class="sk-t" data-id="' + s.id + '" style="--c:' + s.col + ';--cr:' + rgb(s.col) + '"><div class="sk-ta">' + art(s.id) + '</div><b>' + s.name + '</b></div>';
      }).join('');
      return '<div class="skw">' +
        '<div class="sk-top"><div class="sk-sum"><s>СУММА УРОВНЕЙ</s><div class="sk-big"><span class="sk-sumv">' + sten(sum, 5.2) + '</span><i>/ ' + tot + '</i></div>' +
        '<div class="sk-pct">путь к мастерству <b class="sk-pctv">' + Math.round(100 * sum / tot) + ' %</b></div><div class="sk-meter"><i style="width:' + (100 * sum / tot).toFixed(1) + '%"></i></div></div>' +
        '<div class="sk-eq">' + eq + '</div><div class="sk-who">ПРИМЕР<br>ПЕРСОНАЖА</div></div>' +
        '<div class="sk-main"><div class="sk-feat"></div><div class="sk-grid">' + grid + '</div>' +
        '<div class="sk-hint"><i></i>Нажми на любой навык — откроется его страница</div></div></div>';
    },
    feat: function (root, id, lv) {
      var s = skById(id); if (!s) return;
      var box = root.querySelector('.sk-feat'), steps = s.steps.map(function (st, k) {
        return '<li class="' + (k < lv ? 'on' : '') + (k === lv - 1 ? ' cur' : '') + '"><b>' + (k + 1) + '</b><span>' + st.n + '</span></li>';
      }).join('');
      var cur = s.steps[lv - 1] || s.steps[0];
      box.style.setProperty('--c', s.col); box.style.setProperty('--cr', rgb(s.col));
      box.innerHTML = '<div class="sk-art">' + art(s.id) + '<div class="sk-lv"><span class="sk-lvv">' + sten(lv, 4.6) + '</span><em>/' + s.cap + '</em></div>' +
        '<div class="sk-mst">' + master(2.2) + '</div><div class="sk-up">НОВАЯ СТУПЕНЬ</div></div>' +
        '<div class="sk-hd"><b>' + s.name + '</b><span class="sk-side ' + s.side + '">' + (s.side === 'illegal' ? 'ТЕНЬ' : s.side === 'common' ? 'ВСЕ ЖИТЕЛИ' : 'ЗАКОН') + '</span></div>' +
        '<div class="sk-job"><em class="sk-rank">' + cur.n + '</em> · ' + s.job + '</div>' +
        '<div class="sk-xp"><i></i></div>' +
        '<ol class="sk-steps" style="--n:' + s.cap + '">' + steps + '</ol>' +
        '<p class="sk-desc">' + cur.d + '</p>' +
        (s.vip ? '<p class="sk-vip"><b>VIP · ' + s.vip.t + '</b> ' + s.vip.d + '</p>' : '');
      var t = root.querySelectorAll('.sk-t');
      for (var i = 0; i < t.length; i++) t[i].classList.toggle('on', t[i].getAttribute('data-id') === id);
      var q = root.querySelectorAll('.sk-eqc');
      for (i = 0; i < q.length; i++) q[i].classList.toggle('on', q[i].getAttribute('data-id') === id);
      return s;
    },
    run: function (root, T) {
      var self = this, lv = {}, k, tok = 0, IDLE = 9000;
      for (k in SK_DEMO) lv[k] = SK_DEMO[k];
      var sumEl = root.querySelector('.sk-sumv'), pct = root.querySelector('.sk-pctv'), meter = root.querySelector('.sk-meter i');
      function total() { var a = 0, b = 0, L = window.SYN_SK || []; for (var i = 0; i < L.length; i++) { a += lv[L[i].id] || 1; b += L[i].cap; } return [a, b]; }
      // показать навык; grow - пройти шкалу опыта до новой ступени (автопоказ), иначе просто открыть страницу
      // my - номер показа: нажал посетитель - старый показ больше ничего не трогает
      function play(id, my, grow) {
        var s = self.feat(root, id, lv[id]);
        var f = root.querySelector('.sk-feat'); f.classList.remove('in', 'lvl', 'max'); void f.offsetWidth; f.classList.add('in');
        if (s && lv[id] >= s.cap) f.classList.add('max');
        var x0 = root.querySelector('.sk-xp i');
        if (!grow) { if (x0) x0.style.width = '45%'; return; }
        T.anim(700, 1700, function (e) {
          if (my !== tok) return;
          var x = root.querySelector('.sk-xp i'); if (x) x.style.width = (25 + 75 * e).toFixed(1) + '%';
        }, K.eio);
        T.at(2450, function () {
          if (my !== tok || !s || lv[id] >= s.cap) return;
          lv[id]++;
          self.feat(root, id, lv[id]);
          var f2 = root.querySelector('.sk-feat'); f2.classList.add('in', 'lvl');
          if (lv[id] >= s.cap) f2.classList.add('max');
          var x = root.querySelector('.sk-xp i'); if (x) x.style.width = '4%';
          var eqc = root.querySelector('.sk-eqc[data-id="' + id + '"]'); if (eqc) eqc.style.setProperty('--h', (100 * lv[id] / s.cap).toFixed(1) + '%');
          var tt = total(); sumEl.innerHTML = sten(tt[0], 5.2); pct.textContent = Math.round(100 * tt[0] / tt[1]) + ' %'; meter.style.width = (100 * tt[0] / tt[1]).toFixed(1) + '%';
        });
      }
      // автопоказ: навык за навыком, по кругу
      function auto(i, my) {
        if (my !== tok) return;
        play(SK_ORDER[i % SK_ORDER.length], my, true);
        T.at(4600, function () { auto(i + 1, my); });
      }
      // посетитель нажал карточку или столбик - открыть навык; без нажатий 9 с - автопоказ дальше с него
      root.addEventListener('click', function (e) {
        var el = e.target.closest ? e.target.closest('.sk-t, .sk-eqc') : null;
        if (!el) return;
        var id = el.getAttribute('data-id'), my = ++tok;
        root.classList.add('manual');
        play(id, my, false);
        T.at(IDLE, function () { if (my === tok) { root.classList.remove('manual'); auto(SK_ORDER.indexOf(id) + 1, my); } });
      });
      T.at(200, function () { auto(0, tok); });
    }
  };
  // ── АЭС: блок № 1 · ИР-60 → БС-1 → К-2,5-35 → ТГ-2,5 → город ─────────────────
  // Перекрывает VIG.npp из shared/js/vig1.js (тот файл - копия экрана загрузки).
  // Схема одноконтурная, как в игре (addon/nuclear_console): вода кипит прямо в
  // каналах ИР-60, пароводяная смесь идёт в барабан-сепаратор БС-1, пар - через
  // главный паровой клапан в ЦВД и ЦНД турбины К-2,5-35, отработавший пар - в
  // конденсатор, конденсатный насос КН гонит воду обратно в барабан, ГЦН-1 и
  // ГЦН-2 - из барабана в зону. Режим считается ФОРМУЛАМИ ИГРЫ, время сжато:
  //   nuke_console_main/shared.lua  NOMINAL_P 70, NOMINAL_T 284, MAX_T 400, MAX_P 100,
  //                                 CORE_FULL 12 ТВЭЛ на полную мощность, 60 каналов
  //   nuke_console_main/init.lua    Think: давление 70 x уставка x (1 + 0,12 x уставка x
  //                                 лишний пар), температура 284 x уставка + 55 °C на
  //                                 каждый стоящий ГЦН + 30 без вентиляции; мощность =
  //                                 давление/70 x уставка; АЗ при 92 % предела (368 °C,
  //                                 92 кгс/см2), сигнал при 80 % (320 °C)
  //   nc_turbine/shared.lua, init   пар от 30 кгс/см2, 3000 об/мин, окно сети ±60,
  //                                 разнос 3300, вакуум 0,95 (срыв 0,40), нагрузка
  //                                 3,0 x мощность x мин(1, давл/50) x (0,55 + 0,45 вак/0,95)
  //   sv_nc_city_bridge.lua         ТВЭЛ по заказу мэра 250 $, бочка ОЯТ 550 $ за ТВЭЛ
  //   build/console_top_marks.py    ваттметры 0..3 МВт, красное от 2,6
  (function () {
    var DT = 0.02, TEND = 21, FOUL = 0.06, CITY = 0.375;   // город: 75 приборов x 5 кВт (день)
    var T_RUN = 1.6, T_G2OFF = 12.0, T_G2ON = 17.4, T_UP = 10.4, T_DOWN = 14.6;
    var D_KEYS = [[0, 0], [T_RUN, 0], [3.4, 0.92], [T_UP, 0.92], [11.0, 1.0], [T_DOWN, 1.0], [15.3, 0.70], [T_G2ON, 0.70], [18.1, 0.92]];
    var KX = 50, KY = 450;                        // ручка УСТАВКА
    var MX0 = 288, MW = 126;                      // шкала ваттметров 0..3 МВт
    var BX = 554, BW = 100;                       // полосы приборов справа
    var SWX = [140, 176, 212, 248], SWN = ['ГЦН-1', 'ГЦН-2', 'ВЕНТ', 'ЗАЩ'];
    var ROWS = [['ТЕМП. ЗОНЫ', 400, [[320, '#F1C40F'], [368, '#E74C3C']]], ['ДАВЛ. БС-1', 100, [[30, '#2ECC71'], [92, '#E74C3C']]],
      ['ОБОРОТЫ', 3600, [[2940, '#2ECC71'], [3060, '#2ECC71'], [3300, '#E74C3C']]], ['ВАКУУМ', 1, [[0.40, '#E74C3C']]]];
    var CHAIN = [['U · СЛИТОК', 'уран с рудника'], ['ЗАКАЗ МЭРА', '250 $ за ТВЭЛ'], ['ЯЩИК ТВЭЛ', 'по 6 шт.'],
      ['ДОСЫЛАТЕЛЬ', 'У-2М → в канал'], ['ЗОНА ИР-60', '12 из 60 каналов'], ['БОЧКА ОЯТ', '550 $ за ТВЭЛ']];
    var BUB = [0, 1, 3, 4, 6, 7, 9, 10];
    var PATH = {
      riser: 'M158 190H218V112H248', down1: 'M330 128V178H276V206', down2: 'M330 178H362V206',
      out1: 'M276 222V330', out2: 'M362 222V330H158',
      steam: 'M364 96V66H446V160', cross: 'M472 156V122H532V156',
      feed: 'M490 318H404V112H372', hot: 'M500 282V308', coolOut: 'M552 282V354', coolIn: 'M566 354V282',
      stack: 'M300 96V74', line: 'M636 180H668V150H708'
    };

    function key(keys, t) {
      if (t <= keys[0][0]) return keys[0][1];
      for (var i = 0; i < keys.length - 1; i++) {
        var a = keys[i], b = keys[i + 1];
        if (t < b[0]) { var k = (t - a[0]) / (b[0] - a[0]); k = k * k * (3 - 2 * k); return a[1] + (b[1] - a[1]) * k; }
      }
      return keys[keys.length - 1][1];
    }
    function toward(v, tgt, step) { return v < tgt ? Math.min(tgt, v + step) : Math.max(tgt, v - step); }
    function lag(v, tgt, tau) { return v + (tgt - v) * (1 - Math.exp(-DT / tau)); }
    function mix(a, b, k) {
      var A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16), o = '#';
      for (var s = 16; s >= 0; s -= 8) { var c = Math.round(((A >> s) & 255) * (1 - k) + ((B >> s) & 255) * k); o += (c < 16 ? '0' : '') + c.toString(16); }
      return o;
    }

    // Режим блока по секундам - те же формулы, что в Think пульта и турбины
    var SIM = null;
    function simulate() {
      var out = [], T = 20, P = 0, rpm = 0, vac = 0, mw = 0, tV = -1, tS = -1, tG = -1, k;
      var ph = { core: 0, steam: 0, feed: 0, cool: 0, pw: 0, blade: 0, rot: 0, p1: 0, p2: 0, kn: 0, bub: 0, puff: 0 };
      var n = Math.round(TEND / DT);
      for (var i = 0; i <= n; i++) {
        var t = i * DT, d = key(D_KEYS, t), run = t >= T_RUN;
        var g1 = t >= 0.4, g2 = t >= 0.7 && !(t >= T_G2OFF && t < T_G2ON), vent = t >= 1.0, guard = t >= 1.25;
        var pumps = (g1 ? 1 : 0) + (g2 ? 1 : 0);
        if (tV < 0 && P >= 30) tV = t + 0.1;                         // NCT.P_ROLL: пар есть - штурвал
        var wheel = tV < 0 ? 0 : clamp((t - tV) / 0.6, 0, 1);
        if (tS < 0 && wheel >= 1) tS = t + 0.25;                      // ПУСК турбины
        var steam = tS >= 0 && t >= tS, grid = tG >= 0 && t >= tG;
        var take = steam ? (grid ? 1 : 0.25) : 0;                    // ENT:SteamTake
        var tgtP = run ? 70 * Math.max(d, 0.15) * (1 + 0.12 * d * (1 - take)) : 0;
        var tgtT = run ? 284 * Math.max(d, 0.3) + (2 - pumps) * 55 + (vent ? 0 : 30) : 20;
        P = lag(P, tgtP, 0.7); T = lag(T, tgtT, 0.9);
        var power = run ? clamp(P / 70, 0, 1) * d : 0;
        var flow = steam ? clamp(P / 70, 0, 1.3) : 0;
        if (grid) rpm = toward(rpm, 3000, 2000 * DT);
        else if (flow > 0) { var tg = 3000 * Math.min(1, flow / 0.45); rpm = toward(rpm, tg, (tg > rpm ? 1100 : 600) * DT); }
        else rpm = toward(rpm, 0, 600 * DT);
        if (tG < 0 && steam && Math.abs(rpm - 3000) <= 60) tG = t + 0.3; // окно ±60 - выключатель СЕТЬ
        vac = lag(vac, steam && P > 18 ? 0.95 * (1 - 0.6 * FOUL) : 0, 0.8);
        var load = grid && rpm > 2850 ? 3.0 * power * clamp(P / 50, 0, 1) * (0.55 + 0.45 * vac / 0.95) : 0;
        mw = lag(mw, load, 0.3);
        var vS = 120 * power * take;
        var rate = { core: 30 * pumps, steam: vS, feed: 0.45 * vS, cool: steam ? 24 : 0, pw: grid ? 20 + 25 * mw : 0,
          blade: 70 * rpm / 3000, rot: 330 * rpm / 3000, p1: g1 ? 480 : 0, p2: g2 ? 480 : 0, kn: steam ? 480 : 0,
          bub: 12 + 46 * power, puff: 1.2 };
        for (k in rate) ph[k] += rate[k] * DT;
        var s = { t: t, d: d, run: run, g1: g1, g2: g2, vent: vent, guard: guard, pumps: pumps, wheel: wheel, steam: steam, grid: grid,
          take: take, P: P, T: T, power: power, rpm: rpm, vac: vac, mw: mw, out: run ? power * (1 - take) : 0, rate: rate, ph: {} };
        for (k in ph) s.ph[k] = ph[k];
        out.push(s);
      }
      return out;
    }
    function at(t) {
      if (t < TEND) return SIM[Math.max(0, Math.min(SIM.length - 1, Math.floor(t / DT)))];
      var L = SIM[SIM.length - 1], o = {}, k;
      for (k in L) o[k] = L[k];
      o.ph = {}; for (k in L.ph) o.ph[k] = L.ph[k] + L.rate[k] * (t - TEND);
      o.t = t;
      return o;
    }

    // ── рисунок ──
    function pipe(d, w) {
      return '<path d="' + d + '" fill="none" stroke="#46564E" stroke-width="' + (w + 4) + '" stroke-linejoin="round"/>' +
        '<path d="' + d + '" fill="none" stroke="#0A110E" stroke-width="' + w + '" stroke-linejoin="round"/>';
    }
    function flow(d, cls, col, w, dash) {
      return '<path class="np-f ' + cls + '" d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="' + dash + '" opacity="0"/>';
    }
    function pump(x, y, cls, motorDx) {
      return '<rect x="' + (x + motorDx - 5) + '" y="' + (y - 9) + '" width="10" height="18" rx="2" fill="#26322D" stroke="#56645D"/>' +
        '<path d="M' + (x + (motorDx > 0 ? 13 : -13)) + ' ' + y + 'H' + (x + motorDx + (motorDx > 0 ? -5 : 5)) + '" stroke="#56645D" stroke-width="3"/>' +
        '<circle class="' + cls + 'b" cx="' + x + '" cy="' + y + '" r="14" fill="#101814" stroke="#8E9A94" stroke-width="2"/>' +
        '<g class="' + cls + '"><path d="M' + x + ' ' + y + 'l0-10M' + x + ' ' + y + 'l8.7 5M' + x + ' ' + y + 'l-8.7 5" stroke="#C9D1CD" stroke-width="2.2" stroke-linecap="round"/></g>' +
        '<circle cx="' + x + '" cy="' + y + '" r="2.6" fill="#8E9A94"/>';
    }
    function bladeRows(xs, top, bot) {
      return xs.map(function (x) {
        return '<path class="np-bld" d="M' + x + ' ' + (top(x) + 4).toFixed(1) + 'V' + (bot(x) - 4).toFixed(1) + '" stroke="#9FB3A8" stroke-width="3" stroke-dasharray="2.5 2"/>';
      }).join('');
    }
    function tick(cx, cy, a, r0, r1, col, w) {
      var s = Math.sin(a * Math.PI / 180), c = Math.cos(a * Math.PI / 180);
      return '<path d="M' + (cx + r0 * s).toFixed(1) + ' ' + (cy - r0 * c).toFixed(1) + 'L' + (cx + r1 * s).toFixed(1) + ' ' + (cy - r1 * c).toFixed(1) + '" stroke="' + col + '" stroke-width="' + w + '"/>';
    }
    function meter(y0, cls) {
      var o = '<rect x="282" y="' + y0 + '" width="138" height="24" rx="2" fill="#D6D2C0" stroke="#3C4742" stroke-width="1.5"/>';
      o += '<rect x="' + (MX0 + MW * 2.6 / 3).toFixed(1) + '" y="' + (y0 + 2) + '" width="' + (MW * 0.4 / 3).toFixed(1) + '" height="3.5" fill="#C0392B"/>';
      for (var i = 0; i <= 30; i++) {
        var x = MX0 + MW * i / 30, L = i % 10 === 0 ? 9 : i % 5 === 0 ? 6.5 : 4.5;
        o += '<path d="M' + x.toFixed(1) + ' ' + (y0 + 2) + 'v' + L + '" stroke="#2B2A24" stroke-width="' + (i % 10 === 0 ? 1.3 : 0.8) + '"/>';
        if (i % 10 === 0) o += '<text x="' + x.toFixed(1) + '" y="' + (y0 + 22) + '" text-anchor="middle" class="np-mt">' + (i / 10) + '</text>';
      }
      return o + '<g class="' + cls + '"><path d="M' + MX0 + ' ' + (y0 + 1) + 'V' + (y0 + 23) + '" stroke="#141414" stroke-width="1.8"/></g>';
    }

    VIG.npp = {
      html: function () {
        var o = K.DEFS + '<defs>' +
          '<pattern id="npConc" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="#151D19"/><path d="M0 0V10" stroke="#1F2A25" stroke-width="3"/></pattern>' +
          '<linearGradient id="npPool" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B2230"/><stop offset="1" stop-color="#06131C"/></linearGradient>' +
          '<linearGradient id="npTank" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#26322D"/><stop offset=".45" stop-color="#3A4842"/><stop offset="1" stop-color="#1C2622"/></linearGradient>' +
          '<radialGradient id="npCher" cx=".5" cy=".55" r=".5"><stop offset="0" stop-color="#8FE0FF" stop-opacity=".9"/><stop offset=".45" stop-color="#2F8FE0" stop-opacity=".45"/><stop offset="1" stop-color="#1B4F8A" stop-opacity="0"/></radialGradient>' +
          '<linearGradient id="npRod" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3FA6F0"/><stop offset=".5" stop-color="#D6F4FF"/><stop offset="1" stop-color="#3FA6F0"/></linearGradient>' +
          '<clipPath id="npPoolC"><rect x="34" y="116" width="160" height="256"/></clipPath>' +
          '<clipPath id="npDrumC"><rect x="240" y="92" width="140" height="40" rx="20"/></clipPath>' +
          '</defs>';
        o += K.head('АЭС · БЛОК № 1 · ИР-60 · К-2,5-35', '<tspan class="np-hs">ПОДГОТОВКА</tspan>');
        // подпись шага сценария - правый верх, над турбинным залом
        o += '<text class="np-cap" x="708" y="60" text-anchor="end"></text><text class="np-sub" x="708" y="77" text-anchor="end"></text>';

        // ── реактор в бассейне ──
        o += '<text x="22" y="62" class="v-t">РЕАКТОР ИР-60</text><text x="22" y="78" class="np-lb">12 ТВЭЛ · 60 КАНАЛОВ</text>';
        o += '<rect x="22" y="108" width="184" height="272" fill="url(#npConc)" stroke="#2E3F37" stroke-width="1.5"/>';
        o += '<rect x="34" y="116" width="160" height="256" fill="url(#npPool)" stroke="#2E3F37"/>';
        o += '<rect x="34" y="116" width="160" height="12" fill="#070C0A"/><path d="M34 128.5H194" stroke="#5BC8FF" stroke-opacity=".45"/>';
        o += '<path d="M40 133h14M70 136h10M150 133h18M118 137h8" stroke="#5BC8FF" stroke-opacity=".18"/>';
        // проходки труб сквозь стену бассейна
        o += '<rect x="190" y="181" width="20" height="18" rx="2" fill="#26322D" stroke="#56645D"/><rect x="190" y="321" width="20" height="18" rx="2" fill="#26322D" stroke="#56645D"/>';
        // черенковское свечение в воде вокруг бака
        o += '<g clip-path="url(#npPoolC)"><ellipse class="np-cher" cx="114" cy="262" rx="80" ry="104" fill="url(#npCher)" opacity=".05"/></g>';

        // ── трубы (под корпусами: концы уходят в патрубки) ──
        o += pipe(PATH.riser, 6) + pipe('M330 128V178M276 178H362M276 178V206M362 178V206', 6) + pipe(PATH.out1, 6) + pipe(PATH.out2, 6);
        o += pipe(PATH.steam, 8) + pipe(PATH.cross, 8) + pipe(PATH.feed, 5) + pipe(PATH.hot, 5) + pipe(PATH.coolOut, 5) + pipe(PATH.coolIn, 5) + pipe(PATH.stack, 5);
        o += flow(PATH.riser, 'np-fr', '#5BC8FF', 3.2, '3 7') + flow(PATH.down1, 'np-fd1', '#5BC8FF', 3.4, '0.1 9') + flow(PATH.down2, 'np-fd2', '#5BC8FF', 3.4, '0.1 9') +
          flow(PATH.out1, 'np-fo1', '#5BC8FF', 3.4, '0.1 9') + flow(PATH.out2, 'np-fo2', '#5BC8FF', 3.4, '0.1 9');
        o += flow(PATH.steam, 'np-fs', '#EEF5F2', 3.4, '7 9') + flow(PATH.cross, 'np-fx', '#EEF5F2', 3.4, '7 9') + flow(PATH.feed, 'np-ff', '#8FD3F0', 3, '0.1 8') +
          flow(PATH.hot, 'np-fh', '#8FD3F0', 3, '0.1 8') + flow(PATH.coolOut, 'np-fco', '#7FB6DA', 3, '0.1 8') + flow(PATH.coolIn, 'np-fci', '#3E8ED0', 3, '0.1 8');

        // ── бак реактора, активная зона, ТВЭЛ ──
        o += '<rect x="74" y="340" width="7" height="32" fill="#3A4842"/><rect x="147" y="340" width="7" height="32" fill="#3A4842"/>';
        o += '<rect x="66" y="160" width="96" height="186" rx="14" fill="url(#npTank)" stroke="#8E9A94" stroke-width="1.5"/>';
        o += '<rect x="72" y="168" width="84" height="172" rx="8" fill="#061018"/>';
        o += '<rect class="np-core" x="76" y="226" width="76" height="86" fill="#0B2235" stroke="#2E6C8F"/>';
        o += '<rect class="np-coreg" x="76" y="226" width="76" height="86" fill="#7FD8FF" opacity="0"/>';
        var i, x;
        for (i = 0; i < 12; i++) { x = 80 + i * 6.2; o += '<path d="M' + (x + 1.8).toFixed(1) + ' 168V226" stroke="#1B3A52" stroke-width="1.2"/>'; }
        o += '<g class="np-rods" opacity=".4">';
        for (i = 0; i < 12; i++) { x = 80 + i * 6.2; o += '<rect x="' + x.toFixed(1) + '" y="229" width="3.6" height="80" rx="1.5" fill="url(#npRod)"/>'; }
        o += '</g>';
        for (i = 0; i < BUB.length; i++) o += '<circle class="np-bub" cx="' + (80 + BUB[i] * 6.2 + 4.9).toFixed(1) + '" cy="220" r="1.5" fill="#DDEFF7" opacity="0"/>';
        o += '<rect x="60" y="154" width="108" height="8" rx="2" fill="#56645D" stroke="#8E9A94"/>';
        for (i = 0; i < 12; i++) o += '<rect x="' + (80 + i * 6.2).toFixed(1) + '" y="148" width="3.6" height="6" fill="#8E9A94"/>';
        // перегрузочный кран над бассейном
        o += '<rect x="22" y="94" width="184" height="6" fill="#3A4842" stroke="#56645D"/><rect x="104" y="86" width="22" height="8" rx="1.5" fill="#56645D" stroke="#8E9A94"/>';
        o += '<rect x="112.5" y="100" width="5" height="46" fill="#46564E"/><rect x="109" y="144" width="12" height="4" fill="#8E9A94"/>';
        o += '<rect class="np-pit" x="22.75" y="108.75" width="182.5" height="270.5" fill="none" stroke="#E74C3C" stroke-width="2" opacity="0"/>';
        o += '<text x="226" y="160" class="np-lb">ПАР + ВОДА</text><text x="226" y="350" class="np-lb">ВОДА</text>';

        // ── барабан-сепаратор БС-1 и сброс ──
        o += '<rect x="293" y="64" width="14" height="12" rx="2" fill="#3A4842" stroke="#8E9A94"/>';
        for (i = 0; i < 4; i++) o += '<circle class="np-puff" cx="300" cy="60" r="4" fill="#DDE6E1" opacity="0"/>';
        o += '<text x="312" y="75" class="np-lb">СБРОС</text>';
        o += '<rect x="240" y="92" width="140" height="40" rx="20" fill="#121A17"/>';
        o += '<g clip-path="url(#npDrumC)"><rect class="np-dst" x="240" y="92" width="140" height="20" fill="#DDE6E1" opacity="0"/><rect x="240" y="112" width="140" height="20" fill="#1E5F86" opacity=".6"/>' +
          '<path class="np-lvl" d="M240 112H380" stroke="#8FD3F0" stroke-width="1.5" stroke-dasharray="6 3"/></g>';
        o += '<rect x="240" y="92" width="140" height="40" rx="20" fill="none" stroke="#8E9A94" stroke-width="2"/>';
        o += '<text x="256" y="108" class="np-dl">БС-1</text>';
        // главный паровой клапан со штурвалом
        o += '<path class="np-vlv" d="M397 59L413 73V59L397 73Z" fill="#2A3731" stroke="#C9D1CD" stroke-width="1.2"/><path d="M405 57V62" stroke="#8E9A94" stroke-width="2"/>';
        o += '<g class="np-whl"><circle cx="405" cy="50" r="7" fill="none" stroke="#D0453A" stroke-width="2.2"/><path d="M398 50H412M405 43V57" stroke="#D0453A" stroke-width="1.4"/></g>';
        o += '<text x="418" y="59" class="np-lb">ПАР</text>';

        // ── ГЦН-1, ГЦН-2 ──
        o += pump(276, 214, 'np-p1', -20) + pump(362, 214, 'np-p2', 20);
        o += '<text x="266" y="270" text-anchor="end" class="np-lb">ГЦН-1</text><text x="354" y="270" text-anchor="end" class="np-lb">ГЦН-2</text>';

        // ── турбина К-2,5-35: ЦВД + ЦНД, конденсатор, КН ──
        o += '<path d="M418 180H594" stroke="#8E9A94" stroke-width="4"/>';
        o += '<rect x="412" y="185" width="12" height="11" fill="#3A4842" stroke="#56645D"/><rect x="481" y="185" width="10" height="11" fill="#3A4842" stroke="#56645D"/><rect x="578" y="185" width="10" height="11" fill="#3A4842" stroke="#56645D"/>';
        o += '<path d="M504 214H560L566 242H498Z" fill="#1A2420" stroke="#56645D"/>';
        var hpT = function (x) { return 158 - (x - 426) * 10 / 54; }, hpB = function (x) { return 202 + (x - 426) * 10 / 54; };
        var lpT = function (x) { return x <= 532 ? 140 + (x - 490) * 10 / 42 : 150 - (x - 532) * 10 / 42; }, lpB = function (x) { return 360 - lpT(x); };
        o += '<path d="M426 158L480 148V212L426 202Z" fill="#16201C" stroke="#8E9A94" stroke-width="1.5"/>';
        o += '<path d="M490 140L532 150L574 140V220L532 210L490 220Z" fill="#16201C" stroke="#8E9A94" stroke-width="1.5"/>';
        o += '<rect x="428" y="176.5" width="50" height="7" fill="#3A4842"/><rect x="492" y="176.5" width="80" height="7" fill="#3A4842"/>';
        o += bladeRows([436, 445, 454, 463, 472], hpT, hpB) + bladeRows([500, 510, 520, 544, 554, 564], lpT, lpB);
        o += '<rect x="483" y="175" width="6" height="10" fill="#C9D1CD"/><rect x="579" y="175" width="6" height="10" fill="#C9D1CD"/>';
        o += '<text x="458" y="106" class="v-t">ТУРБИНА К-2,5-35</text>';
        o += '<text x="453" y="232" text-anchor="middle" class="np-lb">ЦВД</text><text x="580" y="232" class="np-lb">ЦНД</text>';
        o += '<rect x="490" y="240" width="84" height="44" rx="6" fill="#121A17" stroke="#8E9A94" stroke-width="1.5"/>';
        for (i = 0; i < 6; i++) o += '<path d="M498 ' + (249 + i * 5.5) + 'H566" stroke="#2E3F37" stroke-width="1.6"/>';
        o += '<text x="588" y="264" class="np-lb">КОНДЕНСАТОР</text>';
        o += '<rect x="545" y="354" width="28" height="6" rx="1.5" fill="#26322D" stroke="#56645D"/><text x="580" y="360" class="np-lb">ОХЛАЖДЕНИЕ</text>';
        o += '<circle class="np-knb" cx="500" cy="318" r="12" fill="#101814" stroke="#8E9A94" stroke-width="2"/>' +
          '<g class="np-kn"><path d="M500 318l0-8M500 318l6.9 4M500 318l-6.9 4" stroke="#C9D1CD" stroke-width="2" stroke-linecap="round"/></g><circle cx="500" cy="318" r="2.2" fill="#8E9A94"/>';
        o += '<text x="500" y="350" text-anchor="middle" class="np-lb">КН</text><text x="412" y="309" class="np-lb">КОНДЕНСАТ</text>';

        // ── генератор ТГ-2,5, выключатель, ЛЭП ──
        o += '<rect x="590" y="156" width="50" height="48" rx="8" fill="url(#body)" stroke="#8E9A94" stroke-width="1.5"/>';
        for (i = 0; i < 7; i++) o += '<path d="M' + (596 + i * 6.3).toFixed(1) + ' 159v7M' + (596 + i * 6.3).toFixed(1) + ' 194v7" stroke="#3C4742" stroke-width="1.5"/>';
        o += '<circle class="np-gw" cx="615" cy="180" r="13" fill="#0A110E" stroke="#56645D" stroke-width="1.5"/>';
        o += '<g class="np-rot"><circle cx="615" cy="180" r="8.5" fill="none" stroke="#2ECC71" stroke-width="1.6" stroke-dasharray="5 3.9"/><path d="M615 172V188M607 180H623" stroke="#8E9A94" stroke-width="1.6"/></g>';
        o += '<text x="615" y="148" text-anchor="middle" class="np-lb">ТГ-2,5</text>';
        o += '<path d="M680 236L689 134M706 236L697 134M672 144H708M682 136H704" stroke="#56645D" stroke-width="2" fill="none"/>';
        var zz = 'M', yy;
        for (yy = 236, i = 0; yy > 140; yy -= 16, i++) {
          var dl = (236 - yy) * 9 / 102;
          zz += (i ? 'L' : '') + (i % 2 ? (706 - dl).toFixed(1) : (680 + dl).toFixed(1)) + ' ' + yy;
        }
        o += '<path d="' + zz + '" stroke="#3C4742" stroke-width="1.2" fill="none"/>';
        o += '<path d="M676 144V150M704 144V150" stroke="#C9D1CD" stroke-width="2"/>';
        o += '<path d="M636 180H646M660 180H668V150H708" stroke="#1E4B31" stroke-width="5" fill="none" stroke-linejoin="round"/>';
        o += flow(PATH.line, 'np-fp', '#2ECC71', 2.6, '6 10');
        o += '<circle cx="646" cy="180" r="2.6" fill="#C9D1CD"/><circle cx="660" cy="180" r="2.6" fill="#C9D1CD"/>';
        o += '<g class="np-brk"><path d="M646 180H661" stroke="#C9D1CD" stroke-width="2.4" stroke-linecap="round"/></g>';
        o += '<path class="np-arw" d="M701 144l7 6-7 6" stroke="#2ECC71" stroke-width="2" fill="none" opacity=".35"/>';
        o += '<text x="708" y="126" text-anchor="end" class="np-lbw">В ГОРОД</text>';

        // ── низ: пульт, ваттметры, приборы ──
        o += '<path d="M22 390.5H708M22 488.5H708M268.5 398V482M484.5 398V482" stroke="#22302A"/>';
        o += '<text x="22" y="409" class="np-lb">УСТАВКА МОЩНОСТИ</text>';
        o += '<circle cx="' + KX + '" cy="' + KY + '" r="18" fill="#141B18" stroke="#56645D" stroke-width="1.5"/>';
        for (i = 0; i <= 20; i++) {
          var v = i / 20, big = i % 10 === 0;
          o += tick(KX, KY, -120 + 240 * v, 21, big ? 28 : i % 2 === 0 ? 25.5 : 24, v > 0.75 ? '#E74C3C' : '#8E9A94', big ? 1.6 : 1);
        }
        o += '<g class="np-knob"><path d="M' + KX + ' ' + KY + 'V' + (KY - 15) + '" stroke="#F2F5F3" stroke-width="2.6" stroke-linecap="round"/></g><circle cx="' + KX + '" cy="' + KY + '" r="4" fill="#3A4842"/>';
        o += '<text x="84" y="457" fill="#EEF2EF" class="np-kv">0 %</text>';
        for (i = 0; i < 4; i++) {
          x = SWX[i];
          o += '<circle class="np-lmp' + i + '" cx="' + x + '" cy="421" r="4.5" fill="#1A2420" stroke="#3C4742"/>' +
            '<rect x="' + (x - 9) + '" y="430" width="18" height="28" rx="3" fill="#141B18" stroke="#3C4742"/>' +
            '<g class="np-sw' + i + '" transform="rotate(180 ' + x + ' 444)"><path d="M' + x + ' 444V434" stroke="#C9D1CD" stroke-width="2.4" stroke-linecap="round"/><circle cx="' + x + '" cy="433" r="2.8" fill="#C9D1CD"/></g>' +
            '<circle cx="' + x + '" cy="444" r="3" fill="#56645D"/>' +
            '<text x="' + x + '" y="476" text-anchor="middle" class="np-swl">' + SWN[i] + '</text>';
        }
        o += '<text x="276" y="409" class="np-lb">ВЫРАБОТКА ТГ-2,5 · МВт</text>' + meter(414, 'np-n1') + '<text x="476" y="434" text-anchor="end" fill="#EEF2EF" class="np-mv np-m1">0,00</text>';
        o += '<text x="276" y="453" class="np-lb">ПОТРЕБЛЕНИЕ ГОРОДА · МВт</text>' + meter(458, 'np-n2') + '<text x="476" y="478" text-anchor="end" fill="#EEF2EF" class="np-mv np-m2">0,38</text>';
        for (i = 0; i < ROWS.length; i++) {
          var y = 412 + i * 23, rw = ROWS[i];
          o += '<text x="490" y="' + y + '" class="np-rl">' + rw[0] + '</text>' +
            '<rect x="' + BX + '" y="' + (y - 8) + '" width="' + BW + '" height="7" fill="#101814" stroke="#2A3731"/>' +
            '<rect class="np-bar' + i + '" x="' + BX + '" y="' + (y - 8) + '" width="0" height="7" fill="#2ECC71"/>';
          for (var m = 0; m < rw[2].length; m++) {
            var mx = BX + BW * rw[2][m][0] / rw[1];
            o += '<path d="M' + mx.toFixed(1) + ' ' + (y - 11) + 'V' + (y + 2) + '" stroke="' + rw[2][m][1] + '" stroke-width="1.5"/>';
          }
          o += '<text x="708" y="' + y + '" text-anchor="end" fill="#EEF2EF" class="np-rv np-val' + i + '">0</text>';
        }
        // цепочка топлива: от рудника до бочки
        for (i = 0; i < CHAIN.length; i++) {
          x = 22 + i * 117.2;
          o += '<g class="np-ch np-ch' + i + '"><rect x="' + x.toFixed(1) + '" y="494" width="100" height="32" fill="none" stroke="#22302A"/>' +
            '<text x="' + (x + 7).toFixed(1) + '" y="507.5" class="np-cn">' + CHAIN[i][0] + '</text><text x="' + (x + 7).toFixed(1) + '" y="521" class="np-cs">' + CHAIN[i][1] + '</text></g>';
          if (i < CHAIN.length - 1) o += '<path d="M' + (x + 106).toFixed(1) + ' 504l5 6-5 6" stroke="#3C4742" stroke-width="1.6" fill="none"/>';
        }
        return o;
      },
      run: function (root, T) {
        if (!SIM) SIM = simulate();
        var q = function (s) { return root.querySelector(s); }, qa = function (s) { return root.querySelectorAll(s); };
        var F = {}, names = ['fr', 'fd1', 'fd2', 'fo1', 'fo2', 'fs', 'fx', 'ff', 'fh', 'fco', 'fci', 'fp'];
        names.forEach(function (n) { F[n] = q('.np-' + n); });
        var cher = q('.np-cher'), coreg = q('.np-coreg'), rods = q('.np-rods'), bubs = qa('.np-bub'), puffs = qa('.np-puff');
        var dst = q('.np-dst'), lvl = q('.np-lvl'), whl = q('.np-whl'), vlv = q('.np-vlv'), blds = qa('.np-bld'), rot = q('.np-rot'), gw = q('.np-gw');
        var p1 = q('.np-p1'), p2 = q('.np-p2'), p2b = q('.np-p2b'), kn = q('.np-kn'), brk = q('.np-brk'), arw = q('.np-arw'), pit = q('.np-pit');
        var knob = q('.np-knob'), kv = q('.np-kv'), n1 = q('.np-n1'), n2 = q('.np-n2'), m1 = q('.np-m1'), m2 = q('.np-m2');
        var hs = q('.np-hs'), cap = q('.np-cap'), sub = q('.np-sub');
        var sw = [0, 1, 2, 3].map(function (i) { return q('.np-sw' + i); }), lmp = [0, 1, 2, 3].map(function (i) { return q('.np-lmp' + i); });
        var bars = [0, 1, 2, 3].map(function (i) { return q('.np-bar' + i); }), vals = [0, 1, 2, 3].map(function (i) { return q('.np-val' + i); });
        var chain = qa('.np-ch');
        function txt(el, s) { if (el._v !== s) { el.textContent = s; el._v = s; } }
        function att(el, a, v) { var k = '_' + a; if (el[k] !== v) { el.setAttribute(a, v); el[k] = v; } }
        function cls(el, c) { if (el._c !== c) { el.setAttribute('class', c); el._c = c; } }
        function fl(el, off, op) { att(el, 'stroke-dashoffset', (-off).toFixed(1)); att(el, 'opacity', op.toFixed(2)); }
        function step(s) {
          if (s.t < T_RUN) return 0;
          if (!s.steam && s.wheel <= 0) return 1;
          if (!s.grid) return 2;
          if (s.t < T_UP) return 3;
          if (s.t < T_G2OFF) return 4;
          if (s.t < T_DOWN) return 5;
          if (s.t < T_G2ON) return 6;
          return 7;
        }
        function draw(t) {
          var s = at(t), ph = s.ph, a = s.T > 320, st = step(s);
          var pk = s.pumps > 0 ? 1 : 0, sk = clamp(s.rate.steam / 20, 0, 1);
          // контур: ГЦН гонят воду из БС-1 в зону, из зоны - пароводяная смесь
          att(F.fr, 'stroke', mix('#5BC8FF', '#E6F3F8', clamp(s.power / 0.4, 0, 1)));
          fl(F.fr, ph.core, pk); fl(F.fd1, ph.core, s.g1 ? 1 : 0); fl(F.fd2, ph.core, s.g2 ? 1 : 0);
          fl(F.fo1, ph.core, s.g1 ? 1 : 0); fl(F.fo2, ph.core, pk);
          fl(F.fs, ph.steam, sk); fl(F.fx, ph.steam, sk); fl(F.ff, ph.feed, sk); fl(F.fh, ph.feed, sk);
          fl(F.fco, ph.cool, s.steam ? 1 : 0); fl(F.fci, ph.cool, s.steam ? 1 : 0); fl(F.fp, ph.pw, s.grid ? 1 : 0);
          // зона: свечение, ТВЭЛ, пузыри кипения
          att(cher, 'opacity', (0.05 + 0.9 * s.power).toFixed(3));
          att(coreg, 'opacity', (0.3 * s.power).toFixed(3));
          att(rods, 'opacity', (0.4 + 0.6 * clamp(s.power / 0.8, 0, 1)).toFixed(3));
          for (var i = 0; i < bubs.length; i++) {
            var u = ((ph.bub + i * 6.5 + (i % 3) * 17) % 52) / 52;
            att(bubs[i], 'cy', (222 - 52 * u).toFixed(1));
            att(bubs[i], 'opacity', (clamp(s.power * 2, 0, 1) * (1 - u) * 0.9).toFixed(2));
          }
          // барабан: паровое пространство, лишний пар - в сброс
          att(dst, 'opacity', (0.22 * s.P / 70).toFixed(3));
          att(lvl, 'stroke-dashoffset', (-ph.core * 0.3).toFixed(1));
          for (i = 0; i < puffs.length; i++) {
            var pp = (ph.puff + i / puffs.length) % 1;
            att(puffs[i], 'cy', (62 - 20 * pp).toFixed(1)); att(puffs[i], 'cx', (300 + 4 * Math.sin(pp * 5 + i)).toFixed(1));
            att(puffs[i], 'r', (3 + 5 * pp).toFixed(1)); att(puffs[i], 'opacity', (clamp(s.out * 1.4, 0, 0.85) * (1 - pp)).toFixed(2));
          }
          att(whl, 'transform', 'rotate(' + (s.wheel * 720).toFixed(1) + ' 405 50)');
          att(vlv, 'fill', s.wheel >= 1 ? '#DDE6E1' : '#2A3731');
          // насосы
          att(p1, 'transform', 'rotate(' + (ph.p1 % 360).toFixed(1) + ' 276 214)');
          att(p2, 'transform', 'rotate(' + (ph.p2 % 360).toFixed(1) + ' 362 214)');
          att(p2b, 'stroke', s.t >= T_G2OFF && !s.g2 ? '#E74C3C' : '#8E9A94');
          att(kn, 'transform', 'rotate(' + (ph.kn % 360).toFixed(1) + ' 500 318)');
          // турбина и генератор
          for (i = 0; i < blds.length; i++) att(blds[i], 'stroke-dashoffset', (-(ph.blade % 4.5)).toFixed(2));
          att(rot, 'transform', 'rotate(' + (ph.rot % 360).toFixed(1) + ' 615 180)');
          att(gw, 'stroke', s.grid ? '#2ECC71' : '#56645D');
          att(brk, 'transform', s.grid ? '' : 'rotate(-35 646 180)');
          att(arw, 'opacity', s.grid ? '1' : '.35');
          // авария: рамка шахты мигает
          att(pit, 'opacity', a ? (0.35 + 0.55 * Math.abs(Math.sin(t * 5))).toFixed(2) : '0');
          // пульт
          att(knob, 'transform', 'rotate(' + (-120 + 240 * s.d).toFixed(1) + ' ' + KX + ' ' + KY + ')');
          txt(kv, Math.round(s.d * 100) + ' %');
          att(kv, 'fill', s.d > 0.995 ? '#E74C3C' : '#EEF2EF');
          var on = [s.g1, s.g2, s.vent, s.guard];
          for (i = 0; i < 4; i++) {
            att(sw[i], 'transform', on[i] ? '' : 'rotate(180 ' + SWX[i] + ' 444)');
            att(lmp[i], 'fill', on[i] ? '#2ECC71' : (i === 1 && s.t >= T_G2OFF ? '#7A2A22' : '#1A2420'));
          }
          att(n1, 'transform', 'translate(' + (MW * clamp(s.mw / 3, 0, 1)).toFixed(1) + ',0)');
          var city = CITY + 0.006 * Math.sin(t * 1.7);
          att(n2, 'transform', 'translate(' + (MW * city / 3).toFixed(1) + ',0)');
          txt(m1, K.dec(s.mw, 2)); att(m1, 'fill', s.mw > 2.6 ? '#E74C3C' : '#EEF2EF');
          txt(m2, K.dec(city, 2));
          // приборы
          var vv = [s.T, s.P, s.rpm, s.vac], mx = [400, 100, 3600, 1];
          var col = [a ? '#E74C3C' : s.T > 300 ? '#F1C40F' : '#2ECC71', '#2ECC71', Math.abs(s.rpm - 3000) <= 60 ? '#2ECC71' : '#8FD3F0', '#2ECC71'];
          for (i = 0; i < 4; i++) { att(bars[i], 'width', (BW * clamp(vv[i] / mx[i], 0, 1)).toFixed(1)); att(bars[i], 'fill', col[i]); }
          txt(vals[0], Math.round(s.T) + ' °C'); att(vals[0], 'fill', a ? '#E74C3C' : '#EEF2EF');
          txt(vals[1], Math.round(s.P) + ' КГС');
          txt(vals[2], String(Math.round(s.rpm / 10) * 10));
          txt(vals[3], Math.round(s.vac * 100) + ' %');
          // шаги сценария
          var C = [
            ['ПОДГОТОВКА', '1 · ЩИТ, ГЦН-1, ГЦН-2, ВЕНТИЛЯЦИЯ', 'ЗАЩИТА ВЗВЕДЕНА · РЕЖИМ «РАБОТА»'],
            ['ПУСК РЕАКТОРА', '2 · ПУСК: УСТАВКА 0 → 92 %', 'ДАВЛЕНИЕ РАСТЁТ · ПАР ИДЁТ В СБРОС'],
            ['ПУСК ТУРБИНЫ', '3 · КЛАПАН ОТКРЫТ, ПУСК ТУРБИНЫ', 'РАЗГОН ДО 3000 ОБ/МИН (В ИГРЕ ~40 С)'],
            ['● В СЕТИ', '4 · 3000 ± 60 ОБ/МИН → В СЕТЬ', 'ГЕНЕРАТОР ДАЁТ ТОК ГОРОДУ'],
            ['● В СЕТИ', '5 · УСТАВКА 100 % — В КРАСНОМ', 'ПОТОЛОК ~3 МВт · ТВЭЛ ГОРЯТ БЫСТРЕЕ'],
            ['● В СЕТИ', '6 · ГЦН-2 ОТКЛЮЧЁН: +55 °C', a ? 'ПРИ 368 °C СРАБОТАЕТ АЗ-5' : 'ОДНОГО НАСОСА МАЛО ДЛЯ 100 %'],
            ['● В СЕТИ', '7 · ОПЕРАТОР: УСТАВКА → 70 %', a ? 'ЖДЁМ: ТЕМПЕРАТУРА НИЖЕ 320 °C' : 'СИГНАЛ СНЯТ · МЕНЬШЕ МВт'],
            ['● В СЕТИ', '8 · ГЦН-2 В РАБОТЕ, УСТАВКА 92 %', 'БЛОК В НОРМЕ']][st];
          txt(hs, a ? '▲ СИГНАЛ: T > 320 °C' : C[0]);
          cls(hs, 'np-hs' + (a ? ' red' : ''));
          txt(cap, C[1]); txt(sub, C[2]);
          cls(cap, 'np-cap' + (a || st === 5 ? ' red' : st === 4 || st === 6 ? ' amb' : ''));
          for (i = 0; i < chain.length; i++) cls(chain[i], 'np-ch np-ch' + i + (t >= 0.15 + 0.2 * i ? ' on' : ''));
        }
        draw(0);
        var BIG = 600000;                  // 10 минут: дальше блок стоит в установившемся режиме
        T.anim(0, BIG, function (e, k) { draw(k * BIG / 1000); });
      }
    };
  })();

  return { ok: true };
})();
