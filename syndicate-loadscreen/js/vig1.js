/* vig1.js - примеры: судмедэксперт, АЭС, городская сеть, денежные принтеры. */
(function () {
  'use strict';
  var K = VK;

  // ── 1. СУДМЕДЭКСПЕРТ: лаборатория, потом совпадение отпечатка ───────────────
  // Действие 1 - стол эксперта (FXLW.SETS: на каждом столе 9 приборов - камера
  // КЦА-45, центрифуга, ПЦР-амплификатор, секвенатор, горелка, мешалка, весы,
  // сравнительный и биологический микроскопы). Действие 2 - наезд камерой в
  // КЦА-45, где проявился след, и сравнение с дактокартой.
  // Отпечаток и минуции - build/fingerprint.py (петля, seed 11): те же функции,
  // что кладут узор на улики в игре. След - кусок того же пальца, повёрнутый
  // на -17 градусов, поэтому линии совпадения идут наискось, как в жизни.
  var TX = 37, TY = 90, TS = 1.25, CX = 449, CY = 99, CS = 0.45;
  function tag(x, t, cls) {
    return '<text x="' + x + '" y="416" text-anchor="middle" class="fx-tag ' + (cls || '') + '">' + t + '</text>';
  }
  var STEP_X0 = 22, STEP_X1 = 708, STEP_PAD = 8;
  function stepsLayout(ws) { // ширины текста шагов -> левые края рамок и центры стрелок
    var sum = 0, i;
    for (i = 0; i < ws.length; i++) sum += ws[i] + 2 * STEP_PAD;
    var gap = (STEP_X1 - STEP_X0 - sum) / (ws.length - 1), x = STEP_X0, out = { left: [], width: [], arrow: [] };
    for (i = 0; i < ws.length; i++) {
      var bw = ws[i] + 2 * STEP_PAD;
      out.left.push(+x.toFixed(1)); out.width.push(+bw.toFixed(1));
      if (i < ws.length - 1) out.arrow.push(+(x + bw + gap / 2).toFixed(1));
      x += bw + gap;
    }
    return out;
  }
  function arrow(cx) { return 'M' + (cx - 6) + ' 457h12m-4-4 4 4-4 4'; }
  function layoutSteps(root) { // по настоящим размерам текста в браузере
    var g = root.querySelectorAll('.fx-st');
    if (g.length !== 5) return;
    var ws = [], bb = [], i;
    for (i = 0; i < g.length; i++) {
      var b; try { b = g[i].getBBox(); } catch (e) { return; }
      if (!b || !b.width) return;
      bb.push(b); ws.push(b.width);
    }
    var L = stepsLayout(ws);
    for (i = 0; i < g.length; i++) g[i].setAttribute('transform', 'translate(' + (L.left[i] + STEP_PAD - bb[i].x).toFixed(1) + ',0)');
    for (i = 0; i < 4; i++) root.querySelector('.fx-arr' + i).setAttribute('d', arrow(L.arrow[i]));
    var box = root.querySelector('.fx-stbox');
    box.setAttribute('x', L.left[2]); box.setAttribute('width', L.width[2]);
    box.setAttribute('y', (bb[2].y - 7).toFixed(1)); box.setAttribute('height', (bb[2].height + 14).toFixed(1));
  }
  function labBench() {
    var o = '<defs><linearGradient id="brass" x1="0" x2="1"><stop offset="0" stop-color="#7A5C22"/><stop offset=".5" stop-color="#E8C766"/><stop offset="1" stop-color="#7A5C22"/></linearGradient>' +
      '<linearGradient id="glassG" x1="0" x2="1"><stop offset="0" stop-color="#CFE7F2" stop-opacity=".10"/><stop offset=".35" stop-color="#CFE7F2" stop-opacity=".03"/><stop offset=".8" stop-color="#CFE7F2" stop-opacity=".12"/></linearGradient></defs>';
    o += K.head('ЛАБОРАТОРИЯ СМЭ · СТОЛ ЭКСПЕРТА', '9 ПРИБОРОВ НА СТОЛЕ');
    // полка с реактивами
    o += '<path d="M20 104.5H592" stroke="#3A4C43" stroke-width="3"/>';
    var bt = [[40, '#8A5A1E', 'НИНГИДРИН'], [104, '#CFE7F2', 'СПИРТ 70%'], [168, '#5B4DB0', 'ГИМЗА'], [232, '#E9E6DC', 'CHELEX']];
    for (var i = 0; i < bt.length; i++) {
      var x = bt[i][0];
      o += '<rect x="' + (x + 9) + '" y="56" width="14" height="10" rx="2" fill="#2A3731"/><path d="M' + (x + 6) + ' 66h20v6l4 5v25a2 2 0 0 1-2 2H' + (x + 4) + 'a2 2 0 0 1-2-2V77l4-5z" fill="' + bt[i][1] + '" fill-opacity=".55" stroke="#9FB3A8" stroke-width="1"/>' +
        '<rect x="' + (x + 2) + '" y="82" width="28" height="12" fill="#E9E6DC"/><text x="' + (x + 16) + '" y="91" text-anchor="middle" class="fx-lbl">' + bt[i][2] + '</text>';
    }
    o += '<ellipse cx="310" cy="100" rx="26" ry="4" fill="none" stroke="#9FB3A8"/><ellipse cx="310" cy="94" rx="26" ry="4" fill="none" stroke="#9FB3A8"/><ellipse cx="310" cy="88" rx="26" ry="4" fill="none" stroke="#9FB3A8"/>';
    o += '<text x="310" y="78" text-anchor="middle" class="fx-lbl2">ЧАШКИ ПЕТРИ</text>';
    o += '<rect x="360" y="74" width="62" height="30" rx="2" fill="#1E4C9A" fill-opacity=".7" stroke="#48565E"/><text x="391" y="93" text-anchor="middle" class="fx-lbl3">НИТРИЛ</text>';
    // экран сравнительного микроскопа (на кронштейне справа)
    o += '<rect x="604" y="54" width="108" height="118" rx="5" fill="#0B100E" stroke="#3A4C43" stroke-width="1.5"/>';
    o += '<clipPath id="fxScr"><rect x="610" y="60" width="96" height="92"/></clipPath><g clip-path="url(#fxScr)"><rect x="610" y="60" width="96" height="92" fill="#1A1206"/>';
    var st = [4, 9, 12, 18, 21, 27, 31, 36, 40, 47, 52, 58, 63, 67, 74, 79, 85];
    var sL = '', sR = '';
    for (i = 0; i < st.length; i++) {
      var w = (i * 7) % 3 + 1, y = 60 + st[i] * 1.05;
      sL += '<rect x="610" y="' + y.toFixed(1) + '" width="48" height="' + w + '" fill="#C9A24E" fill-opacity="' + (0.35 + (i % 4) * 0.15).toFixed(2) + '"/>';
      sR += '<rect x="658" y="' + y.toFixed(1) + '" width="48" height="' + w + '" fill="#C9A24E" fill-opacity="' + (0.35 + (i % 4) * 0.15).toFixed(2) + '"/>';
    }
    o += '<g>' + sL + '</g><g class="fx-half">' + sR + '</g><path d="M658 60V152" stroke="#F2F5F3" stroke-width="1.5"/></g>';
    o += '<text x="658" y="164" text-anchor="middle" class="fx-scrt">СРАВНЕНИЕ БОРОЗД</text>';
    o += '<path d="M658 172V252" stroke="#3A4C43" stroke-width="3"/>';
    // столешница и тумба
    o += '<rect x="10" y="392" width="710" height="8" fill="#26342D"/><rect x="10" y="392" width="710" height="1.5" fill="#56645D"/>';
    o += '<rect x="16" y="400" width="698" height="30" fill="#0C1210" stroke="#1E2A25"/>';
    // 1. камера паров клея КЦА-45
    o += '<rect x="18" y="200" width="114" height="192" rx="6" fill="url(#body)" stroke="#3A4C43" stroke-width="1.5"/>';
    o += '<rect x="28" y="212" width="94" height="112" rx="3" fill="#081218" stroke="#48565E"/>';
    o += '<g class="fx-fume" fill="none" stroke="#CFE7F2" stroke-width="1.5" stroke-linecap="round"><path d="M44 316c-5-9 5-14 0-23s5-14 0-23"/><path d="M104 316c-5-9 5-14 0-23s5-14 0-23"/><path d="M60 316c-5-9 5-14 0-23"/></g>';
    o += '<path d="M75 212v14" stroke="#8E9A94" stroke-width="2"/><rect x="69" y="224" width="12" height="7" rx="1" fill="#8E9A94"/>';
    o += '<rect x="68" y="231" width="14" height="46" rx="3" fill="url(#brass)"/><ellipse cx="75" cy="277" rx="7" ry="2.5" fill="#6B5020"/>';
    o += '<image class="fx-print" href="img/fp_trace.webp" x="68" y="240" width="14" height="15"/>';
    o += '<rect x="46" y="312" width="58" height="8" rx="2" fill="#3A4C43"/><rect x="66" y="306" width="18" height="6" rx="1" fill="#8E9A94"/>';
    o += '<rect x="28" y="336" width="94" height="44" rx="3" fill="#050A08" stroke="#2A3731"/>' +
      '<text x="36" y="352" class="fx-dl">ПАРЫ КЛЕЯ</text><text x="114" y="373" text-anchor="end" class="fx-dv fx-kca">04:10</text>';
    // 2. горелка и колба
    o += '<path d="M150 392L162 302M218 392L206 302" stroke="#56645D" stroke-width="3"/><rect x="150" y="298" width="68" height="4" rx="1" fill="#8E9A94"/>';
    o += '<path d="M168 274h32l16 22H152z" fill="#D9A441" fill-opacity=".7"/>';
    o += '<g class="fx-bub"><circle cx="175" cy="292" r="2.4"/><circle cx="186" cy="289" r="2"/><circle cx="196" cy="293" r="2.6"/><circle cx="182" cy="294" r="1.6"/></g>';
    o += '<path d="M178 230h12v30l26 36H152l26-36z" fill="url(#glassG)" stroke="#9FB3A8" stroke-width="1.5"/><rect x="176" y="226" width="16" height="5" rx="2" fill="none" stroke="#9FB3A8"/>';
    o += '<g class="fx-steam" fill="none" stroke="#CFE7F2" stroke-width="1.3" stroke-linecap="round"><path d="M184 222c-4-7 4-11 0-18"/><path d="M190 220c-4-7 4-11 0-18"/></g>';
    o += '<g class="fx-flame"><path d="M184 352c-10-12-8-28 0-46 8 18 10 34 0 46z" fill="#F39C12" fill-opacity=".85"/><path d="M184 352c-5-8-4-18 0-30 4 12 5 22 0 30z" fill="#5BC8FF"/></g>';
    o += '<rect x="174" y="352" width="20" height="34" rx="3" fill="#2A3731" stroke="#56645D"/><rect x="164" y="384" width="40" height="8" rx="2" fill="#3A4C43"/><circle cx="200" cy="370" r="4" fill="#8E9A94"/>';
    // 3. пробирки и дозатор (Кастле - Мейер: капля крови - розовый)
    o += '<rect x="238" y="344" width="64" height="7" rx="1" fill="#56645D"/><path d="M242 351V386M298 351V386" stroke="#3A4C43" stroke-width="3"/><rect x="238" y="384" width="64" height="8" rx="1" fill="#3A4C43"/>';
    var tb = [[250, '#CFE7F2', ' fx-km'], [264, '#E8C766', ''], [278, '#5BC8FF', ''], [292, '#CFE7F2', '']];
    for (i = 0; i < 4; i++) {
      o += '<rect class="fx-liq' + tb[i][2] + '" x="' + (tb[i][0] - 4) + '" y="338" width="8" height="34" rx="4" fill="' + tb[i][1] + '" fill-opacity=".55"/>' +
        '<rect x="' + (tb[i][0] - 5) + '" y="300" width="10" height="74" rx="5" fill="url(#glassG)" stroke="#9FB3A8" stroke-width="1.2"/>';
    }
    o += '<g class="fx-pip"><rect x="247" y="212" width="6" height="14" fill="#8E9A94"/><rect x="244" y="224" width="12" height="54" rx="4" fill="#DDE6E1"/><rect x="244" y="240" width="12" height="6" fill="#2ECC71"/><path d="M247 278h6l-2 18h-2z" fill="#F4E27A"/></g>';
    o += '<circle class="fx-drop" cx="250" cy="300" r="2.8" fill="#B03A2E"/>';
    // 4. магнитная мешалка
    o += '<path d="M322 296h52v68a4 4 0 0 1-4 4h-44a4 4 0 0 1-4-4z" fill="url(#glassG)" stroke="#9FB3A8" stroke-width="1.5"/>';
    o += '<path d="M324 316h48v48a3 3 0 0 1-3 3h-42a3 3 0 0 1-3-3z" fill="#3E8ED0" fill-opacity=".5"/>';
    o += '<path class="fx-vortex" d="M326 316Q348 322 348 350Q348 322 370 316" fill="none" stroke="#B7DCF7" stroke-width="1.5"/>';
    o += '<rect class="fx-bar" x="340" y="359" width="16" height="4" rx="2" fill="#F2F5F3"/>';
    o += '<rect x="310" y="368" width="78" height="24" rx="4" fill="url(#body)" stroke="#3A4C43"/><rect x="318" y="374" width="32" height="12" rx="1" fill="#050A08"/><text x="346" y="384" text-anchor="end" class="fx-dv2">250</text><circle cx="372" cy="380" r="5" fill="#56645D"/>';
    // 5. центрифуга: ротор под прозрачной крышкой, в перспективе
    o += '<path d="M398 392V330a14 14 0 0 1 14-14h80a14 14 0 0 1 14 14v62z" fill="url(#body)" stroke="#3A4C43" stroke-width="1.5"/>';
    o += '<ellipse cx="452" cy="318" rx="46" ry="12" fill="#081218" stroke="#48565E"/>';
    o += '<g transform="translate(452,318) scale(1,.26)"><g class="fx-rotor"><circle r="38" fill="#1A2320" stroke="#56645D" stroke-width="3"/>';
    for (i = 0; i < 6; i++) { var a = i * Math.PI / 3; o += '<circle cx="' + (27 * Math.cos(a)).toFixed(1) + '" cy="' + (27 * Math.sin(a)).toFixed(1) + '" r="6" fill="' + (i % 2 ? '#B03A2E' : '#E8C766') + '"/>'; }
    o += '<circle r="7" fill="#8E9A94"/></g></g>';
    o += '<ellipse class="fx-blur" cx="452" cy="318" rx="30" ry="8" fill="none" stroke="#CFE7F2" stroke-width="1" stroke-dasharray="3 4"/>';
    o += '<rect x="412" y="336" width="80" height="32" rx="3" fill="#050A08" stroke="#2A3731"/><text x="418" y="346" class="fx-dl">ОБ/МИН</text><text x="486" y="363" text-anchor="end" class="fx-dv fx-rpm">0</text>';
    o += '<circle cx="420" cy="378" r="4" fill="#27AE60"/><circle cx="434" cy="378" r="4" fill="#B03A2E"/>';
    // 6. ПЦР-амплификатор
    o += '<rect x="512" y="298" width="88" height="94" rx="8" fill="url(#body)" stroke="#3A4C43" stroke-width="1.5"/><rect x="516" y="288" width="80" height="16" rx="5" fill="#141B18" stroke="#3A4C43"/>';
    o += '<rect x="522" y="312" width="68" height="36" rx="3" fill="#050A08" stroke="#2A3731"/><text x="528" y="327" class="fx-dv3 fx-cyc">ЦИКЛ 01/35</text><text x="528" y="342" class="fx-dv3 fx-tmp">95 °C</text>';
    for (i = 0; i < 12; i++) o += '<rect class="fx-well fw' + i + '" x="' + (523 + i * 5.6).toFixed(1) + '" y="356" width="4" height="10" rx="1"/>';
    // 7. сравнительный микроскоп
    o += '<rect x="612" y="378" width="92" height="14" rx="3" fill="#2A3731" stroke="#48565E"/><rect x="690" y="252" width="12" height="126" fill="#3A4C43"/>';
    o += '<rect x="618" y="340" width="30" height="5" fill="#8E9A94"/><rect x="654" y="340" width="30" height="5" fill="#8E9A94"/>';
    o += '<rect x="628" y="330" width="10" height="10" rx="2" fill="url(#brass)"/><rect x="664" y="330" width="10" height="10" rx="2" fill="url(#brass)"/>';
    o += '<rect x="628" y="296" width="10" height="28" fill="#56645D"/><rect x="664" y="296" width="10" height="28" fill="#56645D"/>';
    o += '<rect x="620" y="270" width="76" height="26" rx="4" fill="#1A2320" stroke="#48565E"/><path d="M644 270l-6-24h20l-4 24z" fill="#3A4C43"/><circle cx="700" cy="330" r="7" fill="#56645D"/>';
    // таблички на тумбе
    o += tag(75, 'КЦА-45') + tag(184, 'ГОРЕЛКА') + tag(270, 'ПРОБИРКИ', 'fx-tkm') + tag(349, 'МЕШАЛКА') + tag(452, 'ЦЕНТРИФУГА') + tag(556, 'ПЦР') + tag(658, 'МИКРОСКОП', 'fx-tal');
    // путь улики: ширина шага - по тексту, стрелки посередине промежутков, рамка
    // вокруг «Лаборатории» с полями 8 px. Здесь - по замеру шрифтов (fontTools),
    // в игре layout() перемеряет getBBox и поправит, если шрифт лёг иначе
    var steps = [['МЕСТО', 'номерки и фото'], ['УЛИКИ', 'в кейс, по описи'], ['ЛАБОРАТОРИЯ', '9 приборов на столе'], ['КАРТОТЕКА', 'отпечатки и ДНК'], ['ЗАКЛЮЧЕНИЕ', '13 листов с печатью']];
    var L = stepsLayout([90, 92, 115, 95, 113]);
    for (i = 0; i < steps.length; i++) {
      var sx = L.left[i] + STEP_PAD;
      o += '<g class="fx-st fx-st' + i + (i === 2 ? ' on' : '') + '"><text x="' + sx + '" y="462" class="fx-sn">0' + (i + 1) + '</text><text x="' + (sx + 20) + '" y="462" class="fx-stt">' + steps[i][0] + '</text>' +
        '<text x="' + sx + '" y="482" class="fx-sd">' + steps[i][1] + '</text></g>';
    }
    for (i = 0; i < steps.length - 1; i++) o += '<path class="fx-arr fx-arr' + i + '" d="' + arrow(L.arrow[i]) + '" stroke="#3A4C43" stroke-width="1.5" fill="none"/>';
    o += '<rect class="fx-stbox" x="' + L.left[2] + '" y="444" width="' + L.width[2] + '" height="48" fill="none" stroke="#2ECC71" stroke-opacity=".5"/>';
    return o;
  }
  function printMatch() {
    var F = window.SYN_FP || { trace: { w: 216, h: 228 }, card: { w: 468, h: 600 }, pts: [] };
    var o = K.head('ДАКТИЛОСКОПИЯ · СЛЕД № 3', 'ДЕЛО № 0417');
    o += '<text x="22" y="68" class="v-t">СЛЕД С ГИЛЬЗЫ <tspan class="v-d">· 9×19 · ПРОЯВЛЕН В КЦА-45</tspan></text>';
    o += '<rect x="22" y="80" width="300" height="306" fill="#020403" stroke="#22302A"/>';
    o += '<image class="fx-trace" href="img/fp_trace.webp" x="' + TX + '" y="' + TY + '" width="' + (F.trace.w * TS) + '" height="' + (F.trace.h * TS) + '"/>';
    o += '<g class="fx-scale"><path d="M37 404h150M37 399v10M67 401v6M97 401v6M127 401v6M157 401v6M187 399v10" stroke="#6E7A74" stroke-width="1.2"/>' +
      '<text x="196" y="408" class="v-d">5 мм</text></g>';
    o += '<text x="400" y="68" class="v-t">ДАКТОКАРТА <tspan class="v-d">· ПРАВЫЙ УКАЗАТЕЛЬНЫЙ</tspan></text>';
    o += '<g class="fx-card"><rect x="400" y="80" width="308" height="306" fill="url(#paperG)"/>' +
      '<rect x="416" y="92" width="276" height="278" fill="none" stroke="#A39D90"/>' +
      '<text x="420" y="382" class="fx-cardtx">КАРПОВ И. С. · КАРТА № 5518 · ОТПЕЧАТОК № 2</text></g>';
    o += '<image href="img/fp_card.webp" x="' + CX + '" y="' + CY + '" width="' + (F.card.w * CS) + '" height="' + (F.card.h * CS) + '"/>';
    o += '<g class="fx-scan"><rect x="416" y="52" width="276" height="42" fill="url(#scanG)"/><rect x="416" y="92" width="276" height="2" fill="#B9F5D2"/></g>';
    var pts = F.pts, i;
    for (i = 0; i < pts.length; i++) {
      var p = pts[i], lx = TX + p[2] * TS, ly = TY + p[3] * TS, rx = CX + p[0] * CS, ry = CY + p[1] * CS;
      var L = Math.sqrt((rx - lx) * (rx - lx) + (ry - ly) * (ry - ly)).toFixed(1);
      o += '<g class="mn m' + i + '">' +
        '<path class="ml" d="M' + lx.toFixed(1) + ' ' + ly.toFixed(1) + 'L' + rx.toFixed(1) + ' ' + ry.toFixed(1) + '" style="stroke-dasharray:' + L + ';stroke-dashoffset:' + L + '"/>' +
        '<circle class="mc" cx="' + lx.toFixed(1) + '" cy="' + ly.toFixed(1) + '" r="8"/>' +
        '<circle class="mc mc2" cx="' + rx.toFixed(1) + '" cy="' + ry.toFixed(1) + '" r="6"/>' +
        '<text class="mnum" x="' + (lx + 10).toFixed(1) + '" y="' + (ly - 9).toFixed(1) + '">' + (i + 1) + '</text></g>';
    }
    o += '<text x="22" y="446" class="v-t">СОВПАДАЮЩИХ ДЕТАЛЕЙ УЗОРА</text>';
    for (i = 0; i < 12; i++) o += '<rect class="cell c' + i + '" x="' + (22 + i * 25) + '" y="458" width="19" height="19"/>';
    o += '<text x="322" y="478" class="fx-cnt"><tspan class="fx-n">00</tspan><tspan class="fx-of"> / 12</tspan></text>';
    // итог: две строки стенсила по 23 px - 6,82 em «УСТАНОВЛЕНО» = 157 px, рамка 272
    o += '<g class="fx-verd"><rect x="436" y="424" width="272" height="82" fill="rgba(46,204,113,.08)" stroke="#2ECC71"/>' +
      '<text x="454" y="458" class="fx-v1">СОВПАДЕНИЕ</text><text x="454" y="488" class="fx-v1">УСТАНОВЛЕНО</text>' +
      '<circle cx="668" cy="465" r="20" fill="none" stroke="#2ECC71" stroke-width="2.5"/><path d="M658 465l7 7 12-13" fill="none" stroke="#2ECC71" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>';
    return o;
  }
  VIG.forensic = {
    html: function () {
      return K.DEFS + '<g class="fx-a1">' + labBench() + '</g><g class="fx-a2">' + printMatch() + '</g>';
    },
    layout: layoutSteps,
    run: function (root, T) {
      layoutSteps(root);
      var n = root.querySelector('.fx-n'), F = window.SYN_FP || { pts: [] };
      var rpm = root.querySelector('.fx-rpm'), cyc = root.querySelector('.fx-cyc'), tmp = root.querySelector('.fx-tmp'), kca = root.querySelector('.fx-kca');
      var tkm = root.querySelector('.fx-tkm'), tal = root.querySelector('.fx-tal');
      T.cls(root, 50, 'a1on');
      T.count(rpm, 300, 2400, 0, 4000, function (v) { return K.money(Math.round(v / 10) * 10); });
      var TT = ['95 °C', '60 °C', '72 °C'];
      for (var c = 1; c <= 22; c++) (function (c) {
        T.at(300 + c * 230, function () {
          cyc.textContent = 'ЦИКЛ ' + (c < 10 ? '0' : '') + c + '/35'; tmp.textContent = TT[c % 3];
          var w = root.querySelector('.fw' + Math.min(11, Math.floor(c * 12 / 35))); if (w) w.classList.add('on');
        });
      })(c);
      for (var s = 1; s <= 10; s++) (function (s) { T.at(300 + s * 500, function () { var q = 250 + s; kca.textContent = '0' + ((q / 60) | 0) + ':' + ('0' + (q % 60)).slice(-2); }); })(s);
      T.cls(root, 900, 'drop');
      T.at(1500, function () { root.classList.add('km'); tkm.textContent = 'КРОВЬ: ДА'; });
      T.at(2600, function () { root.classList.add('al'); tal.textContent = 'БОРОЗДЫ СОВПАЛИ'; });
      // наезд камерой в КЦА-45: след проявился - сравнение с дактокартой
      T.cls(root, 5600, 'act2');
      T.cls(root, 6700, 'a1off');
      T.cls(root, 6500, 'p2');
      var cnt = Math.min(12, F.pts.length);
      for (var i = 0; i < cnt; i++) (function (i) {
        T.at(7500 + i * 200, function () {
          var m = root.querySelector('.m' + i), cc = root.querySelector('.c' + i);
          if (m) m.classList.add('on');
          if (cc) cc.classList.add('on');
          n.textContent = (i + 1 < 10 ? '0' : '') + (i + 1);
        });
      })(i);
      T.cls(root, 7500 + cnt * 200 + 250, 'p4');
    }
  };

  // ── 2. АЭС: реактор ИР-60, турбина К-2,5-35, ваттметр пульта ───────────────
  // Ваттметр размечен как на пульте (build/console_top_marks.py): 0..3 МВт,
  // красное от 2,6. Активная зона - 12 ТВЭЛ (NC.CORE_FULL).
  var GX = 505, GY = 468, GR = 128;
  function gpt(v, r) { var a = Math.PI * (1 - v / 3); return [GX + r * Math.cos(a), GY - r * Math.sin(a)]; }
  VIG.npp = {
    html: function () {
      var o = K.DEFS + K.head('БЛОК № 1 · РЕАКТОР ИР-60 · ТУРБИНА К-2,5-35', '<tspan class="np-st">ПУСК</tspan>');
      // корпус реактора
      o += '<path d="M80 96h112a44 44 0 0 1 44 44v246a44 44 0 0 1-44 44H80a44 44 0 0 1-44-44V140a44 44 0 0 1 44-44z" fill="#0A0F0D" stroke="#3A4C43" stroke-width="2"/>';
      o += '<path d="M84 106h104a36 36 0 0 1 36 36v242a36 36 0 0 1-36 36H84a36 36 0 0 1-36-36V142a36 36 0 0 1 36-36z" fill="none" stroke="#22302A" stroke-width="1.5"/>';
      // приводы стержней на крышке
      for (var d = 0; d < 5; d++) o += '<rect x="' + (78 + d * 25) + '" y="80" width="14" height="18" fill="#1B2521" stroke="#33443C"/>';
      o += '<rect x="60" y="212" width="152" height="196" fill="#050F18" stroke="#1B3A52"/>';
      o += '<ellipse class="np-glow" cx="136" cy="318" rx="92" ry="118" fill="url(#cher)"/>';
      var i, x;
      for (i = 0; i < 12; i++) {
        x = 66 + i * 12;
        if (i === 6) {
          o += '<g class="np-r7"><rect class="rod" x="' + x + '" y="220" width="7" height="180" rx="2" fill="url(#rodG)"/></g>' +
            '<g class="np-r7n"><rect x="' + x + '" y="220" width="7" height="180" rx="2" fill="url(#rodG)"/></g>';
        } else o += '<rect class="rod" x="' + x + '" y="220" width="7" height="180" rx="2" fill="url(#rodG)"/>';
      }
      o += '<clipPath id="npVes"><rect x="52" y="100" width="168" height="316"/></clipPath><g clip-path="url(#npVes)"><g class="np-ctl">';
      for (i = 0; i < 5; i++) { x = 83 + i * 25; o += '<rect x="' + x + '" y="98" width="4" height="302" fill="#27332E"/><rect x="' + (x - 1) + '" y="392" width="6" height="8" fill="#6E7A74"/>'; }
      o += '</g></g>';
      o += '<text x="136" y="452" text-anchor="middle" class="v-t">РЕАКТОР ИР-60</text>';
      o += '<text class="np-spent" x="136" y="200" text-anchor="middle">ТВЭЛ № 7 ОТРАБОТАН</text>';
      // паропровод и возврат конденсата
      o += '<path d="M236 158H300" stroke="#3A4C43" stroke-width="10" fill="none"/><path class="np-steam" d="M236 158H300" stroke="#DDEFF7" stroke-width="3" fill="none"/>';
      o += '<path d="M300 240H236" stroke="#3A4C43" stroke-width="8" fill="none"/><path class="np-cond" d="M300 240H236" stroke="#5BC8FF" stroke-width="2.5" fill="none"/>';
      o += '<text x="268" y="146" text-anchor="middle" class="v-d">ПАР</text><text x="268" y="262" text-anchor="middle" class="v-d">ВОДА</text>';
      // турбина
      o += '<path d="M300 126L520 92V258L300 224Z" fill="url(#body)" stroke="#3A4C43" stroke-width="1.5"/>';
      o += '<path d="M292 175H548" stroke="#56645D" stroke-width="4"/>';
      var bl = [330, 362, 396, 432, 470, 506];
      for (i = 0; i < bl.length; i++) {
        var hh = 30 + i * 11;
        o += '<path class="np-bl" d="M' + bl[i] + ' ' + (175 - hh) + 'V' + (175 + hh) + '" stroke="#8FA39A" stroke-width="' + (5 + i) + '"/>';
      }
      o += '<text x="410" y="286" text-anchor="middle" class="v-t">ТУРБИНА К-2,5-35</text>';
      // генератор и линия в город
      o += '<rect x="548" y="130" width="78" height="90" rx="6" fill="#141C19" stroke="#3A4C43" stroke-width="1.5"/>';
      o += '<text x="587" y="170" text-anchor="middle" class="np-g">Г</text><path d="M569 190c6-10 12-10 18 0s12 10 18 0" stroke="#2ECC71" stroke-width="2" fill="none"/>';
      o += '<path d="M626 175H708" stroke="#1E4B31" stroke-width="6"/><path class="np-pw" d="M626 175H708" stroke="#2ECC71" stroke-width="2.5"/>';
      o += '<path d="M700 168l8 7-8 7" stroke="#2ECC71" stroke-width="2" fill="none"/>';
      o += '<text x="667" y="160" text-anchor="middle" class="v-d">В ГОРОД</text>';
      // ваттметр
      var tk = '';
      for (i = 0; i <= 30; i++) {
        var v = i / 10, big = i % 5 === 0, a = gpt(v, GR), b = gpt(v, GR - (big ? 16 : 8));
        tk += '<path d="M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1) + '" stroke="' + (v >= 2.6 ? '#E74C3C' : '#8E9A94') + '" stroke-width="' + (big ? 2 : 1) + '"/>';
        if (big) { var t = gpt(v, GR - 32); tk += '<text x="' + t[0].toFixed(1) + '" y="' + (t[1] + 5).toFixed(1) + '" text-anchor="middle" class="np-sc">' + (v === 0 ? '0' : K.dec(v, 1)) + '</text>'; }
      }
      var r0 = gpt(2.6, GR - 4), r1 = gpt(3.0, GR - 4);
      o += '<path d="M' + (GX - GR - 12) + ' ' + GY + 'A' + (GR + 12) + ' ' + (GR + 12) + ' 0 0 1 ' + (GX + GR + 12) + ' ' + GY + '" fill="none" stroke="#22302A" stroke-width="1.5"/>';
      o += '<path d="M' + r0[0].toFixed(1) + ' ' + r0[1].toFixed(1) + 'A' + (GR - 4) + ' ' + (GR - 4) + ' 0 0 1 ' + r1[0].toFixed(1) + ' ' + r1[1].toFixed(1) + '" fill="none" stroke="#E74C3C" stroke-width="7"/>';
      o += tk + '<text x="' + GX + '" y="' + (GY - 58) + '" text-anchor="middle" class="v-d">ВАТТМЕТР · МВт</text>';
      o += '<g class="np-needle"><path d="M' + GX + ' ' + GY + 'L' + (GX - GR + 20) + ' ' + GY + '" stroke="#F2F5F3" stroke-width="3" stroke-linecap="round"/><circle cx="' + GX + '" cy="' + GY + '" r="9" fill="#2A3731" stroke="#8E9A94"/></g>';
      o += '<text x="' + GX + '" y="' + (GY + 42) + '" text-anchor="middle" class="np-read"><tspan class="np-mw">0,00</tspan><tspan class="np-u"> МВт</tspan></text>';
      // сводка блока
      o += '<g class="np-rows"><text x="36" y="480" class="v-d">ТВЭЛ В ЗОНЕ</text><text x="236" y="480" text-anchor="end" class="np-v np-tv">12 / 12</text>' +
        '<text x="36" y="503" class="v-d">ТОПЛИВО ЗОНЫ</text><text x="236" y="503" text-anchor="end" class="np-v np-fuel">04:52</text>' +
        '<text x="36" y="526" class="v-d">УСТАВКА ТУРБИНЫ</text><text x="236" y="526" text-anchor="end" class="np-v">92 %</text></g>';
      return o;
    },
    run: function (root, T) {
      var nd = root.querySelector('.np-needle'), mw = root.querySelector('.np-mw');
      var st = root.querySelector('.np-st'), fu = root.querySelector('.np-fuel'), tv = root.querySelector('.np-tv');
      function setN(v) { nd.setAttribute('transform', 'rotate(' + (180 * v / 3).toFixed(2) + ' ' + GX + ' ' + GY + ')'); }
      setN(0);
      T.cls(root, 300, 'p1');
      T.cls(root, 1300, 'p2');
      T.at(2000, function () { root.classList.add('p3'); st.textContent = '● В РАБОТЕ'; });
      T.anim(2000, 2300, function (e) { setN(2.48 * e); mw.textContent = K.dec(2.48 * e, 2); }, K.eout);
      T.anim(4300, 5600, function (e, k) { var v = 2.48 + 0.035 * Math.sin(k * 19) * (1 - k * 0.3); setN(v); mw.textContent = K.dec(v, 2); });
      var sec = 292;
      for (var s = 1; s <= 7; s++) (function (s) {
        T.at(2600 + s * 500, function () { var q = sec - s * 7; fu.textContent = '0' + ((q / 60) | 0) + ':' + ('0' + (q % 60)).slice(-2); });
      })(s);
      T.at(6400, function () { root.classList.add('p4'); tv.textContent = '11 / 12'; st.textContent = 'ПЕРЕГРУЗКА ТВЭЛ № 7'; });
      T.at(7700, function () { root.classList.add('p5'); tv.textContent = '12 / 12'; fu.textContent = '15:00'; });
      T.at(8900, function () { st.textContent = '● В РАБОТЕ'; });
    }
  };

  // ── 3. ГОРОДСКАЯ СЕТЬ: вилка, розетка, перегрузка и блэкаут ─────────────────
  // Блэкаут - (нагрузка > выработки) или выработка 0 (sv_nc_city_bridge.lua);
  // прибор = 5 кВт (Syn_Power_Offsets), резерв мэрии 400 кВт, минимум 50 кВт.
  var BAR0 = 180, BARW = 420;
  function bw(v) { return BARW * v / 3; }
  function cable(px) { // вилка стоит в px; кабель уходит к входу станка (486, 426)
    var x = px + 60;
    return 'M' + x + ' 330C' + (x + 90) + ' 330 ' + (x + 60) + ' 450 ' + 330 + ' 452S446 426 486 426';
  }
  VIG.grid = {
    html: function () {
      var o = K.DEFS + '<defs><pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V10" stroke="#1A2521" stroke-width="3"/></pattern></defs>';
      o += K.head('ГОРОДСКАЯ СЕТЬ · ТАРИФ НА СВЕТ', 'ИСТОЧНИК: <tspan class="gr-src">АЭС</tspan>');
      // баланс сети
      o += '<text x="22" y="76" class="v-d">ВЫРАБОТКА</text><rect x="' + BAR0 + '" y="66" width="' + BARW + '" height="10" fill="#131B18"/>' +
        '<rect class="gr-gen" x="' + BAR0 + '" y="66" width="' + bw(2.48).toFixed(1) + '" height="10" fill="#2ECC71"/>' +
        '<text x="708" y="77" text-anchor="end" class="gr-v"><tspan class="gr-genv">2,48</tspan> МВт</text>';
      o += '<text x="22" y="108" class="v-d">ПОТРЕБЛЕНИЕ</text><rect x="' + BAR0 + '" y="98" width="' + BARW + '" height="10" fill="#131B18"/>' +
        '<rect class="gr-use" x="' + BAR0 + '" y="98" width="' + bw(1.92).toFixed(1) + '" height="10" fill="#A9B4AE"/>' +
        '<text x="708" y="109" text-anchor="end" class="gr-v"><tspan class="gr-usev">1,92</tspan> МВт</text>';
      o += '<path class="gr-lim" d="M' + (BAR0 + bw(2.48)).toFixed(1) + ' 58V116" stroke="#F2F5F3" stroke-width="1.5" stroke-dasharray="3 3"/>';
      o += '<text x="22" y="142" class="v-d">ПРИБОРОВ В РОЗЕТКАХ</text><text x="' + BAR0 + '" y="143" class="gr-v gr-dev">384</text>';
      o += '<text x="708" y="143" text-anchor="end" class="gr-warn">ПЕРЕГРУЗКА СЕТИ</text>';
      o += '<path d="M0 160.5H730" stroke="#22302A"/>';
      // стена с розеткой (разрез сбоку)
      o += '<rect x="22" y="182" width="70" height="300" fill="url(#hatch)"/><rect x="22" y="182" width="70" height="300" fill="none" stroke="#2A3731"/>';
      o += '<rect x="92" y="286" width="12" height="88" rx="3" fill="#1F2925" stroke="#3A4C43"/>';
      o += '<rect x="70" y="316" width="22" height="28" fill="#030504"/><circle cx="84" cy="322" r="2.5" fill="#56645D"/><circle cx="84" cy="338" r="2.5" fill="#56645D"/>';
      o += '<text x="57" y="504" text-anchor="middle" class="v-d">СТЕНА</text><text x="98" y="278" text-anchor="middle" class="v-d">РОЗЕТКА</text>';
      // кабель
      o += '<path class="gr-cab" d="' + cable(190) + '" fill="none" stroke="#1A1F1D" stroke-width="9" stroke-linecap="round"/>';
      o += '<path class="gr-cab gr-cab2" d="' + cable(190) + '" fill="none" stroke="#33413A" stroke-width="5" stroke-linecap="round"/>';
      o += '<path class="gr-cab gr-flow" d="' + cable(190) + '" fill="none" stroke="#2ECC71" stroke-width="2" stroke-linecap="round"/>';
      // вилка (сбоку): штыри влево
      o += '<g class="gr-plug" transform="translate(190,330)"><path d="M-30 -9H0M-30 9H0" stroke="url(#steel)" stroke-width="4.5" stroke-linecap="round"/>' +
        '<path d="M0 -24H46a14 14 0 0 1 14 14V10a14 14 0 0 1-14 14H0z" fill="#20282B" stroke="#48565E" stroke-width="1.5"/>' +
        '<path d="M14 -24V24M22 -24V24M30 -24V24" stroke="#2D373B" stroke-width="2"/></g>';
      o += '<g class="gr-spark" transform="translate(96,330)"><path d="M0 -26V-12M0 12V26M-22 -14L-11 -6M-22 14L-11 6M12 -18L6 -8M12 18L6 8" stroke="#FFF6C8" stroke-width="2.5" stroke-linecap="round"/><circle r="9" fill="#FFF6C8"/></g>';
      // станок
      o += '<rect x="486" y="188" width="222" height="294" rx="6" fill="url(#body)" stroke="#3A4C43" stroke-width="1.5"/>';
      o += '<rect x="480" y="414" width="8" height="24" fill="#48565E"/>';
      o += '<rect x="506" y="210" width="150" height="54" rx="3" fill="#050A08" stroke="#2A3731"/>';
      o += '<text x="520" y="233" class="gr-d1">НЕТ ПИТАНИЯ</text><text x="520" y="255" class="gr-d2">—</text>';
      o += '<circle class="gr-lamp" cx="684" cy="237" r="10" fill="#2A3731" stroke="#48565E"/>';
      o += '<circle cx="597" cy="358" r="58" fill="#0A0F0D" stroke="#3A4C43" stroke-width="2"/>';
      o += '<g class="gr-fan">';
      for (var i = 0; i < 5; i++) o += '<path d="M597 358c10-14 30-22 44-18-6 12-24 22-44 18z" fill="#56645D" transform="rotate(' + (i * 72) + ' 597 358)"/>';
      o += '<circle cx="597" cy="358" r="8" fill="#8E9A94"/></g>';
      o += '<path d="M520 440H676M520 452H676M520 464H676" stroke="#2A3731" stroke-width="3"/>';
      o += '<text x="597" y="504" text-anchor="middle" class="v-d">СТАНОК · 5 кВт</text>';
      // блэкаут
      o += '<rect class="gr-dark" x="0" y="161" width="730" height="369" fill="#000"/>';
      o += '<text class="gr-bo" x="365" y="352" text-anchor="middle">БЛЭКАУТ</text>';
      o += '<text class="gr-bo2" x="365" y="384" text-anchor="middle">Город взял больше, чем даёт станция</text>';
      return o;
    },
    run: function (root, T) {
      var plug = root.querySelector('.gr-plug'), cabs = root.querySelectorAll('.gr-cab');
      var use = root.querySelector('.gr-use'), usev = root.querySelector('.gr-usev'), dev = root.querySelector('.gr-dev');
      var gen = root.querySelector('.gr-gen'), genv = root.querySelector('.gr-genv'), lim = root.querySelector('.gr-lim');
      var d1 = root.querySelector('.gr-d1'), d2 = root.querySelector('.gr-d2'), src = root.querySelector('.gr-src');
      T.anim(400, 600, function (e) {
        var px = 190 - 86 * e;
        plug.setAttribute('transform', 'translate(' + px.toFixed(1) + ',330)');
        for (var i = 0; i < cabs.length; i++) cabs[i].setAttribute('d', cable(px));
      }, K.eio);
      T.at(1000, function () { root.classList.add('p2'); d1.textContent = 'ПИТАНИЕ ЕСТЬ'; d2.textContent = '220 В · 5,0 кВт'; });
      T.anim(1800, 2400, function (e) {
        var v = 1.92 + (2.61 - 1.92) * e;
        use.setAttribute('width', bw(v).toFixed(1));
        use.setAttribute('fill', v > 2.48 ? '#E74C3C' : v > 2.3 ? '#F1C40F' : '#A9B4AE');
        usev.textContent = K.dec(v, 2);
        dev.textContent = Math.round(384 + 138 * e);
      }, K.eio);
      T.cls(root, 4000, 'p4');
      T.at(4700, function () {
        root.classList.add('p5'); document.body.classList.add('blackout');
        d1.textContent = 'НЕТ ПИТАНИЯ'; d2.textContent = 'СЕТЬ ОТКЛЮЧЕНА';
      });
      T.at(6100, function () { document.body.classList.remove('blackout'); root.classList.add('p6'); src.textContent = 'АЭС · УСТАВКА 98 %'; });
      T.anim(6200, 1300, function (e) {
        var v = 2.48 + 0.45 * e, x = (BAR0 + bw(v)).toFixed(1);
        gen.setAttribute('width', bw(v).toFixed(1)); genv.textContent = K.dec(v, 2);
        lim.setAttribute('d', 'M' + x + ' 58V116');
        use.setAttribute('fill', v >= 2.61 ? '#2ECC71' : '#E74C3C');
      }, K.eio);
      T.at(7600, function () { root.classList.add('p7'); d1.textContent = 'ПИТАНИЕ ЕСТЬ'; d2.textContent = '220 В · 5,0 кВт'; });
    },
    stop: function () { document.body.classList.remove('blackout'); }
  };

  // ── 4. ДЕНЕЖНЫЕ ПРИНТЕРЫ: линия HELIX ───────────────────────────────────────
  // Лист - 2 x 3 купюры (note_grid), печать 11 с, сушка 9, резка 9 (H.T),
  // 8 расходников (H.CONS), E-95/E-96 - коды корзины и схода.
  function note(x, y, i) {
    return '<g class="pr-note pr-n' + i + '"><rect x="' + x + '" y="' + y + '" width="118" height="54" fill="#CFE0D3" stroke="#6F9B7E" stroke-width="1"/>' +
      '<rect x="' + (x + 4) + '" y="' + (y + 4) + '" width="110" height="46" fill="none" stroke="#8DB59A" stroke-width=".8"/>' +
      '<path d="M' + (x + 30) + ' ' + (y + 40) + 'c12-18 26 10 38-8s26 10 38-6" stroke="#9EC4AA" fill="none"/>' +
      '<g transform="translate(' + (x + 17) + ',' + (y + 27) + ')">' + K.mark(0, 0, 11, '#1E6B43') + '</g>' +
      '<text x="' + (x + 110) + '" y="' + (y + 24) + '" text-anchor="end" class="pr-den">1000</text>' +
      '<text x="' + (x + 34) + '" y="' + (y + 16) + '" class="pr-bn">СИНДИКАТ</text>' +
      '<text x="' + (x + 110) + '" y="' + (y + 45) + '" text-anchor="end" class="pr-ser">АБ 0417 29' + (30 + i) + '</text></g>';
  }
  function machine(x, name, job, extra) {
    return '<g class="pr-m pr-' + name.replace('-', '') + '"><rect x="' + x + '" y="252" width="204" height="178" rx="5" fill="url(#body)" stroke="#3A4C43" stroke-width="1.5"/>' +
      extra +
      '<rect x="' + (x + 16) + '" y="392" width="118" height="26" rx="2" fill="#050A08" stroke="#2A3731"/>' +
      '<text x="' + (x + 24) + '" y="410" class="pr-disp">' + name + ' · ' + job + '</text>' +
      '<circle class="pr-led" cx="' + (x + 184) + '" cy="405" r="6" fill="#2A3731"/></g>';
  }
  VIG.press = {
    html: function () {
      var o = K.DEFS + K.head('ЛИНИЯ HELIX · ПЕЧАТЬ → СУШКА → РЕЗКА', 'ПАЧЕК В КОРЗИНЕ: <tspan class="pr-cnt">7</tspan>');
      // лист 2 x 3
      o += '<clipPath id="prClip"><rect class="pr-clip" x="235" y="52" width="260" height="184"/></clipPath>';
      o += '<g class="pr-sheet"><g clip-path="url(#prClip)"><rect class="pr-bg" x="241" y="56" width="248" height="176" fill="#B9CDBE"/>';
      var i, c, r;
      for (i = 0; i < 6; i++) { c = i % 2; r = (i / 2) | 0; o += note(245 + c * 122, 60 + r * 57, i); }
      o += '<rect class="pr-wet" x="241" y="56" width="248" height="176" fill="#0B1F14" opacity=".35"/></g>';
      o += '<g class="pr-head"><rect x="235" y="52" width="260" height="3" fill="#B9F5D2"/><rect x="235" y="44" width="260" height="8" fill="#2ECC71" opacity=".18"/></g>';
      o += '<path class="pr-cut" d="M365 50V238M233 115H497M233 172H497" stroke="#E74C3C" stroke-width="1.5" stroke-dasharray="6 5"/>';
      o += '<g class="pr-heat"><path d="M270 236c-8-14 8-22 0-36s8-22 0-36" /><path d="M330 236c-8-14 8-22 0-36s8-22 0-36"/><path d="M400 236c-8-14 8-22 0-36s8-22 0-36"/><path d="M460 236c-8-14 8-22 0-36s8-22 0-36"/></g>';
      o += '<rect class="pr-band" x="352" y="112" width="26" height="64" fill="#2ECC71"/></g>';
      o += '<text x="22" y="66" class="v-d">ЛИСТ</text><text x="22" y="108" class="pr-big">2 × 3</text><text x="22" y="130" class="v-d">КУПЮРЫ НА ЛИСТЕ</text>';
      o += '<text x="708" y="66" text-anchor="end" class="v-d">ТЕМП ЛИНИИ</text><text x="708" y="108" text-anchor="end" class="pr-big">327</text><text x="708" y="130" text-anchor="end" class="v-d">ЛИСТОВ В ЧАС</text>';
      // станки
      var roll = '<g class="pr-roll"><circle cx="70" cy="252" r="24" fill="#DCE6E0" stroke="#8E9A94"/><path d="M70 232V272M50 252H90" stroke="#8E9A94" stroke-width="2"/><circle cx="70" cy="252" r="6" fill="#56645D"/></g>' +
        '<rect x="38" y="296" width="172" height="58" fill="#070C0A" stroke="#2A3731"/><rect class="pr-carr" x="44" y="306" width="26" height="38" fill="#8E9A94"/>' +
        '<rect x="170" y="370" width="48" height="10" fill="#2A3731"/><rect class="pr-stack" x="174" y="362" width="40" height="8" fill="#CFE0D3"/>';
      var dry = '<path d="M290 262h40M350 262h40M410 262h40" stroke="#050A08" stroke-width="6"/>' +
        '<g class="pr-dryh"><path d="M300 248c-5-8 5-12 0-20M370 248c-5-8 5-12 0-20M430 248c-5-8 5-12 0-20" stroke="#F1C40F" stroke-width="2" fill="none"/></g>' +
        '<rect x="276" y="296" width="176" height="58" fill="#070C0A" stroke="#2A3731"/>' +
        [310, 364, 418].map(function (x) {
          return '<g class="pr-rol"><circle cx="' + x + '" cy="325" r="14" fill="#56645D"/><path d="M' + x + ' 313V337M' + (x - 12) + ' 325H' + (x + 12) + '" stroke="#2A3731" stroke-width="3"/></g>';
        }).join('');
      var cut = '<rect x="516" y="296" width="176" height="58" fill="#070C0A" stroke="#2A3731"/>' +
        '<g class="pr-blade"><rect x="522" y="298" width="164" height="12" fill="url(#steel)"/><path d="M522 310H686" stroke="#fff" stroke-width="1.2"/></g>' +
        '<rect x="522" y="340" width="164" height="6" fill="#2A3731"/>' +
        '<rect x="646" y="360" width="46" height="22" fill="none" stroke="#56645D" stroke-width="1.5"/>' +
        '<rect x="652" y="370" width="16" height="8" fill="#CFE0D3"/><rect x="670" y="370" width="16" height="8" fill="#CFE0D3"/><rect class="pr-b8" x="661" y="362" width="16" height="8" fill="#CFE0D3"/>';
      o += machine(22, 'P-40', 'ПЕЧАТЬ', roll) + machine(262, 'D-20', 'СУШКА', dry) + machine(502, 'C-15', 'РЕЗКА', cut);
      o += '<path d="M228 325h28M468 325h28" stroke="#6E7A74" stroke-width="1.5" stroke-dasharray="4 4"/><path d="M250 320l6 5-6 5M490 320l6 5-6 5" stroke="#6E7A74" fill="none" stroke-width="1.5"/>';
      o += '<text x="242" y="444" text-anchor="middle" class="v-d">РУКАМИ</text><text x="482" y="444" text-anchor="middle" class="v-d">РУКАМИ</text>';
      // расходники
      var cons = [['КРАСКА', 64], ['ВАЛИК', 41], ['ФИЛЬТР', 77], ['НОЖ', 23], ['ЛЕНТА', 58]];
      for (i = 0; i < cons.length; i++) {
        var x = 22 + i * 140;
        o += '<g class="pr-c pr-c' + i + '"><text x="' + x + '" y="478" class="v-d">' + cons[i][0] + '</text>' +
          '<text x="' + (x + 124) + '" y="478" text-anchor="end" class="pr-pc">' + cons[i][1] + ' %</text>' +
          '<rect x="' + x + '" y="488" width="124" height="6" fill="#131B18"/><rect class="pr-cb" x="' + x + '" y="488" width="' + (124 * cons[i][1] / 100).toFixed(1) + '" height="6" fill="#2ECC71"/></g>';
      }
      o += '<text class="pr-err" x="22" y="522">C-15: ЗАМЕНИТЕ НОЖ · КРОМКА 7 %</text>';
      return o;
    },
    run: function (root, T) {
      var clip = root.querySelector('.pr-clip'), head = root.querySelector('.pr-head'), cnt = root.querySelector('.pr-cnt');
      clip.setAttribute('height', '0');
      T.cls(root, 250, 'p1');
      T.anim(300, 2300, function (e) { clip.setAttribute('height', (184 * e).toFixed(1)); head.setAttribute('transform', 'translate(0,' + (180 * e).toFixed(1) + ')'); });
      T.cls(root, 2750, 'p2');
      T.cls(root, 4450, 'p3');
      T.at(5700, function () { root.classList.add('p4'); });
      T.at(6500, function () { cnt.textContent = '8'; root.classList.add('p4b'); });
      var knife = root.querySelector('.pr-c3'), kp = knife.querySelector('.pr-pc'), kb = knife.querySelector('.pr-cb');
      T.anim(4500, 2000, function (e) { var v = 23 - 16 * e; kp.textContent = Math.round(v) + ' %'; kb.setAttribute('width', (124 * v / 100).toFixed(1)); });
      T.cls(root, 6900, 'p5');
      // следующий лист: сброс без обратной анимации, печать заново
      T.at(7700, function () {
        root.classList.add('rs');
        ['p1', 'p2', 'p3', 'p4', 'p4b'].forEach(function (c) { root.classList.remove(c); });
        clip.setAttribute('height', '0'); head.setAttribute('transform', 'translate(0,0)');
        void root.getBoundingClientRect();
        root.classList.remove('rs'); root.classList.add('p1');
      });
      T.anim(7750, 2300, function (e) { clip.setAttribute('height', (184 * e).toFixed(1)); head.setAttribute('transform', 'translate(0,' + (180 * e).toFixed(1) + ')'); });
    }
  };
})();
