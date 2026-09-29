/* vig3.js - примеры: Синуслуги, бизнесы, экономика, «и это не всё». */
(function () {
  'use strict';
  var K = VK;
  function T(x, y, cls, s, anchor) {
    return '<text x="' + x + '" y="' + y + '" class="' + cls + '"' + (anchor ? ' text-anchor="' + anchor + '"' : '') + '>' + s + '</text>';
  }
  var GB = '#1F4FA3', GI = '#5B8FEA';

  // ── 9. СИНУСЛУГИ ─────────────────────────────────────────────────────────
  // Разделы - как в synd_phone/apps/gov: Паспорт, Штрафы, Лицензии, Законы,
  // Обращение, Выборы мэра (голос 120 с, считает syndicate_mayor_sv.lua).
  var GLYPH = {
    pass: '<rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="8" cy="11" r="2.5"/><path d="M4.5 17c1-2 6-2 7 0M14 9h5M14 13h5"/>',
    fine: '<path d="M5 2h14v20l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
    lic: '<rect x="3" y="3" width="18" height="14" rx="1"/><path d="M7 8h10M7 12h6"/><circle cx="16" cy="18" r="3"/><path d="M14.5 20.5 14 23l2-1 2 1-.5-2.5"/>',
    vote: '<path d="M3 11h18v10H3zM7 11l4-8 6 3-2 5"/><path d="M9 16h6"/>',
    law: '<path d="M12 3v18M6 21h12M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/>',
    mail: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 7l10 7 10-7"/>'
  };
  function glyph(k, x, y, col) {
    return '<g transform="translate(' + x + ',' + y + ')" fill="none" stroke="' + (col || GI) + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + GLYPH[k] + '</g>';
  }
  function gHead(title, back) {
    return '<rect x="10" y="10" width="210" height="' + (back ? 68 : 94) + '" fill="' + GB + '"/>' + K.statusBar() +
      (back ? '<path d="M28 50l-6 6 6 6" stroke="#fff" stroke-width="2" fill="none"/>' + T(38, 61, 'gv-ht', title) :
        T(24, 64, 'gv-h', 'СИНУСЛУГИ') + T(24, 84, 'gv-hs', 'госуслуги города «Синдикат»') + '<g transform="translate(198,60)">' + K.mark(0, 0, 11, '#FFFFFF') + '</g>');
  }
  function silhouette(cx, cy, r, col) {
    return '<circle cx="' + cx + '" cy="' + (cy - r * 0.25) + '" r="' + (r * 0.42) + '" fill="' + col + '"/><path d="M' + (cx - r * 0.78) + ' ' + (cy + r * 0.95) + 'c0-' + (r * 0.8) + ' ' + (r * 1.56) + '-' + (r * 0.8) + ' ' + (r * 1.56) + ' 0z" fill="' + col + '"/>';
  }
  function govScreens() {
    var o = '', i;
    // главная
    o += '<g class="gv-s gv0"><rect x="10" y="10" width="210" height="452" fill="#0A0F0D"/>' + gHead() +
      '<rect x="20" y="104" width="190" height="38" rx="8" fill="#111A16"/><circle cx="39" cy="123" r="11" fill="#22302A"/>' + silhouette(39, 124, 10, '#56645D') +
      T(58, 120, 'gv-un', 'Карпов Иван') + T(58, 134, 'gv-ud', 'ПАСПОРТ 45 12 418207');
    var tiles = [['pass', 'Паспорт'], ['fine', 'Штрафы'], ['lic', 'Лицензии'], ['vote', 'Выборы мэра'], ['law', 'Законы'], ['mail', 'Обращение']];
    for (i = 0; i < 6; i++) {
      var x = 20 + (i % 2) * 98, y = 152 + ((i / 2) | 0) * 78;
      o += '<rect x="' + x + '" y="' + y + '" width="92" height="70" rx="10" fill="#101815" stroke="#1E2A25"/>' + glyph(tiles[i][0], x + 12, y + 10) + T(x + 12, y + 56, 'gv-tl', tiles[i][1]);
    }
    o += '<rect x="85" y="446" width="60" height="4" rx="2" fill="#DDE6E1" opacity=".5"/></g>';
    // паспорт
    o += '<g class="gv-s gv1"><rect x="10" y="10" width="210" height="452" fill="#0A0F0D"/>' + gHead('ПАСПОРТ', true) +
      '<rect x="20" y="92" width="190" height="214" rx="10" fill="url(#paperG)"/><rect x="20" y="92" width="190" height="22" rx="10" fill="#8E2E2E"/><rect x="20" y="104" width="190" height="10" fill="#8E2E2E"/>' +
      T(115, 107, 'gv-pp', 'ПАСПОРТ ЖИТЕЛЯ · ГОРОД СИНДИКАТ', 'middle') +
      '<rect x="30" y="124" width="58" height="74" fill="#CFC9B8"/>' + silhouette(59, 166, 26, '#8D877A') +
      T(98, 134, 'gv-pl', 'ФАМИЛИЯ') + T(98, 149, 'gv-pv', 'КАРПОВ') + T(98, 166, 'gv-pl', 'ИМЯ') + T(98, 181, 'gv-pv', 'ИВАН') +
      T(98, 198, 'gv-pl', 'ОТЧЕСТВО') + T(98, 213, 'gv-pv', 'СЕРГЕЕВИЧ') +
      T(30, 234, 'gv-pl', 'ПРОФЕССИЯ') + T(30, 249, 'gv-pv', 'СУДМЕДЭКСПЕРТ') + T(130, 234, 'gv-pl', 'ЛИЦЕНЗИИ') + T(130, 249, 'gv-pv', 'НА ОРУЖИЕ') +
      T(30, 268, 'gv-pl', 'ГРАЖДАНИН ГОРОДА СИНДИКАТ') +
      T(30, 298, 'gv-num', '45 12 № 418207') +
      T(115, 330, 'gv-note', 'ВЫДАН ПАСПОРТНЫМ СТОЛОМ МЭРИИ', 'middle') + '</g>';
    // штрафы
    o += '<g class="gv-s gv2"><rect x="10" y="10" width="210" height="452" fill="#0A0F0D"/>' + gHead('ШТРАФЫ', true) +
      T(22, 104, 'gv-pl', 'К ОПЛАТЕ') + T(208, 106, 'gv-due', '1 500 $', 'end') +
      '<rect x="20" y="116" width="190" height="112" rx="10" fill="#111A16" stroke="#1E2A25"/>' +
      T(32, 138, 'gv-ft', 'ПРЕВЫШЕНИЕ СКОРОСТИ') + T(32, 156, 'gv-fd', 'Дорожный кодекс · 21:32') + T(198, 184, 'gv-fs', '1 500 $', 'end') +
      '<g class="gv-pay"><rect x="30" y="192" width="170" height="26" rx="6" fill="' + GB + '"/>' + T(115, 209, 'gv-pb', 'ОПЛАТИТЬ КАРТОЙ', 'middle') + '</g>' +
      '<g class="gv-paid"><rect x="30" y="192" width="170" height="26" rx="6" fill="#0E2A1B" stroke="#2ECC71"/>' + T(115, 209, 'gv-pd', 'ОПЛАЧЕНО ✓', 'middle') + '</g>' +
      '<rect x="20" y="238" width="190" height="62" rx="10" fill="#111A16" stroke="#1E2A25"/>' +
      T(32, 260, 'gv-ft', 'ПАРКОВКА У МЭРИИ') + T(32, 278, 'gv-fd', 'Дорожный кодекс · вчера') + T(198, 292, 'gv-ok', 'ОПЛАЧЕН', 'end') + '</g>';
    // выборы
    o += '<g class="gv-s gv3"><rect x="10" y="10" width="210" height="452" fill="#0A0F0D"/>' + gHead('ВЫБОРЫ МЭРА', true) +
      '<rect x="20" y="90" width="190" height="34" rx="8" fill="#10213F"/>' + T(32, 111, 'gv-live', 'ИДЁТ ГОЛОСОВАНИЕ') + T(198, 113, 'gv-cd', '01:47', 'end');
    var cand = [['Соколов А. В.', 'дороги и свет', 46], ['Беляева М. Д.', 'больница и полиция', 38], ['Громов К. С.', 'налоги ниже', 16]];
    for (i = 0; i < 3; i++) {
      var cy = 140 + i * 74;
      o += '<g class="gv-c gv-c' + i + '"><rect x="20" y="' + cy + '" width="190" height="64" rx="10" fill="#111A16" stroke="#1E2A25"/>' +
        '<circle cx="42" cy="' + (cy + 24) + '" r="14" fill="#22302A"/>' + silhouette(42, cy + 25, 13, '#6E7A74') +
        T(64, cy + 21, 'gv-cn', cand[i][0]) + T(64, cy + 36, 'gv-fd', cand[i][1]) +
        '<rect x="30" y="' + (cy + 46) + '" width="140" height="6" rx="3" fill="#1C2722"/><rect class="gv-bar" x="30" y="' + (cy + 46) + '" width="' + (140 * cand[i][2] / 100).toFixed(1) + '" height="6" rx="3" fill="' + (i ? '#56645D' : GI) + '"/>' +
        T(200, cy + 53, 'gv-pc', cand[i][2] + ' %', 'end') + '</g>';
    }
    o += '<g class="gv-vb"><rect x="20" y="370" width="190" height="40" rx="10" fill="' + GB + '"/>' + T(115, 395, 'gv-pb', 'ГОЛОСОВАТЬ: СОКОЛОВ', 'middle') + '</g>' +
      '<g class="gv-vd"><rect x="20" y="370" width="190" height="40" rx="10" fill="#0E2A1B" stroke="#2ECC71"/>' + T(115, 395, 'gv-pd', 'ВАШ ГОЛОС УЧТЁН ✓', 'middle') + '</g>' +
      T(115, 434, 'gv-note', 'ОДИН ЖИТЕЛЬ — ОДИН ГОЛОС', 'middle') + '</g>';
    return o;
  }
  function callout(cls, x, y, w, side, title, l1, l2) {
    var lx = side < 0 ? x + w : x, ex = side < 0 ? 250 : 480;
    return '<g class="gc ' + cls + '"><path class="gc-l" d="M' + lx + ' ' + (y + 22) + 'H' + ex + '"/><circle class="gc-d" cx="' + ex + '" cy="' + (y + 22) + '" r="3.5"/>' +
      '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="74" fill="#0C1210" stroke="#22302A"/><rect class="gc-r" x="' + x + '" y="' + y + '" width="3" height="74"/>' +
      T(x + 16, y + 24, 'gc-t', title) + T(x + 16, y + 46, 'gc-x', l1) + T(x + 16, y + 64, 'gc-x', l2) + '</g>';
  }
  VIG.gov = {
    html: function () {
      var inner = govScreens() + K.tap('tA', 66, 187) + K.tap('tB', 115, 205) + K.tap('tC', 115, 390);
      var o = K.DEFS;
      o += callout('c1', 16, 76, 214, -1, 'ПАСПОРТ', 'Серия и номер — как в книжке', 'с паспортного стола.');
      o += callout('c2', 500, 186, 214, 1, 'ШТРАФЫ', 'Выписывает полиция', 'по законам города.');
      o += callout('c3', 16, 330, 214, -1, 'ВЫБОРЫ МЭРА', 'Голосуют только здесь:', '120 секунд, один голос.');
      o += '<g class="gc gc-more"><rect x="500" y="380" width="214" height="74" fill="#0C1210" stroke="#22302A"/>' +
        T(516, 404, 'gc-t', 'ЕЩЁ В ПРИЛОЖЕНИИ') + T(516, 426, 'gc-x', 'Лицензии, законы, досье,') + T(516, 444, 'gc-x', 'обращения в мэрию.') + '</g>';
      o += K.phone(250, 29, inner);
      return o;
    },
    run: function (root, TL) {
      var cd = root.querySelector('.gv-cd');
      function scr(n) { var a = root.querySelectorAll('.gv-s'); for (var i = 0; i < a.length; i++) a[i].classList.toggle('on', i === n); }
      function co(n) { var a = root.querySelectorAll('.gc'); for (var i = 0; i < a.length; i++) a[i].classList.toggle('on', i === n); }
      scr(0); co(-1);
      TL.cls(root, 600, 'tapA');
      TL.at(850, function () { scr(1); co(0); });
      TL.at(3300, function () { scr(2); co(1); });
      TL.cls(root, 4500, 'tapB');
      TL.cls(root, 4700, 'p3');
      TL.at(6000, function () { scr(3); co(2); });
      for (var s = 1; s <= 4; s++) (function (s) { TL.at(6000 + s * 1000, function () { cd.textContent = '01:' + (47 - s); }); })(s);
      TL.cls(root, 7600, 'tapC');
      TL.at(7800, function () {
        root.classList.add('p5');
        var bars = root.querySelectorAll('.gv-bar'), pcs = root.querySelectorAll('.gv-pc'), v = [47, 37, 16];
        for (var i = 0; i < 3; i++) { bars[i].setAttribute('width', (140 * v[i] / 100).toFixed(1)); pcs[i].textContent = v[i] + ' %'; }
      });
    }
  };

  // ── 10. БИЗНЕСЫ ──────────────────────────────────────────────────────────
  // sh_business.lua: пять отраслей на сессию, лицензия 150 000 $ навсегда,
  // доля владельца 25 % с живых платежей (SynPay_Charged / Deposited).
  var BG = {
    azs: '<path d="M3 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M1 21h16M6 8h6M15 9l4 3v6a1.5 1.5 0 0 1-3 0v-3h-1"/>',
    oil: '<path d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11z"/>',
    farm: '<path d="M12 21v-9M12 12c0-4 3-6 7-6 0 4-3 6-7 6zM12 15c0-3-2-5-6-5 0 3 2 5 6 5z"/>',
    mine: '<path d="M4 20l9-9M11 5c3-2 7-1 9 1-3 0-6 1-8 3zM13 11l-2-2"/>',
    log: '<path d="M2 7h11v10H2zM13 10h4l4 4v3h-8zM6 19a2 2 0 1 0 0-.1M17 19a2 2 0 1 0 0-.1"/>'
  };
  var FEED = [['АЗС: топливо · АИ-95 · 42,7 л', 2135], ['АЗС: топливо · ДТ · 60 л', 2700], ['АЗС: топливо · АИ-92 · 18 л', 720],
    ['АЗС: топливо · АИ-100 · 35 л', 2100], ['АЗС: топливо · АИ-95 · 12 л', 600], ['АЗС: топливо · ДТ · 44 л', 1980], ['АЗС: топливо · АИ-95 · 30 л', 1500]];
  VIG.biz = {
    html: function () {
      var o = K.DEFS, i;
      // лицензия
      o += '<rect x="22" y="56" width="320" height="244" fill="#0D1411" stroke="#2E3F37"/><rect x="30" y="64" width="304" height="228" fill="none" stroke="#1E2A25"/>';
      o += '<g opacity=".08" fill="none" stroke="#2ECC71">';
      for (i = 0; i < 7; i++) o += '<path d="M30 ' + (130 + i * 22) + 'c50-20 100 20 150 0s100-20 154 0"/>';
      o += '</g><g transform="translate(52,90)">' + K.mark(0, 0, 17, '#2ECC71', '#0B100D') + '</g>';
      o += T(80, 90, 'bz-h', 'БИЗНЕС-ЛИЦЕНЗИЯ') + T(80, 108, 'v-d', '№ 000017 · ВЫДАНА МЭРИЕЙ');
      var f = [['ВЛАДЕЛЕЦ', 'Карпов Иван Сергеевич'], ['ОТРАСЛЬ', 'Заправки, 3 АЗС'], ['СРОК', 'бессрочно'], ['ПОШЛИНА', '150 000 $']];
      for (i = 0; i < 4; i++) o += T(44, 146 + i * 34, 'v-d', f[i][0]) + T(140, 147 + i * 34, 'bz-v', f[i][1]);
      o += '<path id="bzArc" d="M246 250a40 40 0 1 1 80 0a40 40 0 1 1-80 0" fill="none"/>';
      o += '<g class="bz-stamp"><g transform="rotate(-14 286 250)"><circle cx="286" cy="250" r="44" fill="none" stroke="#2ECC71" stroke-width="2.5"/><circle cx="286" cy="250" r="30" fill="none" stroke="#2ECC71" stroke-width="1.2"/>' +
        '<text class="bz-st"><textPath href="#bzArc">МЭРИЯ ГОРОДА · ОПЛАЧЕНО · 2026 ·</textPath></text>' +
        '<g transform="translate(286,250)">' + K.mark(0, 0, 16, '#2ECC71') + '</g></g></g>';
      // отрасли
      o += T(364, 72, 'v-t', 'ОТРАСЛИ ГОРОДА') + T(708, 72, 'v-d', 'ВЫКУП НА СЕССИЮ', 'end');
      var ind = [['azs', 'ЗАПРАВКИ', 'СВОБОДНА'], ['oil', 'НЕФТЬ', 'ЕСТЬ ВЛАДЕЛЕЦ'], ['farm', 'ФЕРМА', 'СВОБОДНА'], ['mine', 'ШАХТА', 'ЕСТЬ ВЛАДЕЛЕЦ'], ['log', 'ЛОГИСТИКА', 'СВОБОДНА']];
      for (i = 0; i < 5; i++) {
        var y = 86 + i * 43;
        o += '<g class="bz-r bz-r' + i + '"><rect x="364" y="' + y + '" width="344" height="36" fill="#0C1210" stroke="#1C2722"/>' +
          '<g transform="translate(376,' + (y + 6) + ')" fill="none" stroke="#56645D" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="bz-ic">' + BG[ind[i][0]] + '</g>' +
          T(412, y + 23, 'bz-n', ind[i][1]) + T(696, y + 23, 'bz-s', ind[i][2], 'end') + '</g>';
      }
      // поступления
      o += '<path d="M22 316.5H708" stroke="#22302A"/>';
      o += T(22, 342, 'v-t', 'ДОЛЯ ВЛАДЕЛЬЦА — 25 % С КАЖДОГО ПЛАТЕЖА') + T(708, 342, 'v-d', 'ДОХОД ЗА СЕССИЮ', 'end');
      o += T(708, 392, 'bz-inc', '0 $', 'end');
      for (i = 0; i < 5; i++) {
        var ry = 374 + i * 30;
        o += '<g class="bz-f bz-f' + i + '">' + T(22, ry, 'bz-ft', '') + T(100, ry, 'bz-fx', '') + T(470, ry, 'bz-fp', '', 'end') + T(540, ry, 'bz-fs', '', 'end') + '</g>';
      }
      return o;
    },
    run: function (root, TL) {
      var inc = root.querySelector('.bz-inc'), rows = root.querySelectorAll('.bz-f'), got = [], total = 0;
      TL.cls(root, 400, 'p1');
      TL.at(1300, function () { root.classList.add('p2'); root.querySelector('.bz-r0 .bz-s').textContent = 'ВАША · 25 %'; });
      function paint() {
        for (var i = 0; i < rows.length; i++) {
          var r = rows[i], e = got[i], t = r.querySelectorAll('text');
          t[0].textContent = e ? e.t : ''; t[1].textContent = e ? e.x : ''; t[2].textContent = e ? K.money(e.p) + ' $' : ''; t[3].textContent = e ? '+' + K.money(e.s) + ' $' : '';
        }
        rows[0].classList.remove('new'); void rows[0].getBoundingClientRect(); rows[0].classList.add('new');
      }
      FEED.forEach(function (f, k) {
        TL.at(2000 + k * 1050, function () {
          var sh = Math.round(f[1] * 0.25), sec = 3 + k * 38;
          got.unshift({ t: '21:' + (47 + ((sec / 60) | 0)) + ':' + ('0' + (sec % 60)).slice(-2), x: f[0], p: f[1], s: sh });
          got = got.slice(0, 5);
          paint();
          var a = total; total += sh;
          TL.count(inc, 0, 600, a, total, function (v) { return K.money(v) + ' $'; });
        });
      });
    }
  };

  // ── 11. ЖИВАЯ ЭКОНОМИКА ──────────────────────────────────────────────────
  // Курс скупщиков - случайный 75..125 % раз в 600 с (как у руды, топлива и
  // пачек, press-line-economy), налоги - в Syn_City_Budget.
  var GOODS = [['Слиток урана', 520, 108], ['Нефть, бочка 100 л', 1240, 91], ['Урожай, ящик', 310, 117], ['Руда, мешок', 95, 84], ['Пачка «1000»', 60, 112]];
  function walk() { // один и тот же «день» при каждом показе
    var v = 100, out = [], seed = 7;
    for (var i = 0; i < 25; i++) {
      seed = (seed * 16807) % 2147483647;
      v += ((seed / 2147483647) - 0.5) * 14 + (100 - v) * 0.12;
      v = Math.max(78, Math.min(122, v));
      out.push(v);
    }
    return out;
  }
  VIG.eco = {
    html: function () {
      var o = K.DEFS, i;
      o += T(22, 72, 'v-t', 'КАЗНА ГОРОДА') + T(22, 128, 'ec-tr', '1 284 530 $') + T(22, 154, 'v-d', 'ЗА ЧАС: <tspan class="ec-h">+42 310 $</tspan>');
      o += '<g class="ec-fly">' + T(300, 96, 'ec-fl', '+1 250 $', 'end') + '</g>';
      var tax = ['ТАРИФ НА СВЕТ', 'НАЛОГ НА КАЗИНО', 'БИРЖЕВОЙ СБОР', 'БИЗНЕС-ЛИЦЕНЗИИ', 'ЕЩЁ 4'], x = 22, y = 176;
      for (i = 0; i < tax.length; i++) {
        var w = 18 + tax[i].length * 7.4;
        if (x + w > 350) { x = 22; y += 30; }
        o += '<g class="ec-tx ec-tx' + i + '"><rect x="' + x + '" y="' + y + '" width="' + w.toFixed(0) + '" height="22" rx="3"/>' + T((x + w / 2).toFixed(1), y + 15, 'ec-tt', tax[i], 'middle') + '</g>';
        x += w + 8;
      }
      // скупщики
      o += T(372, 72, 'v-t', 'СКУПЩИКИ') + T(708, 72, 'v-d', 'НОВЫЙ КУРС ЧЕРЕЗ <tspan class="ec-cd">07:42</tspan>', 'end');
      o += T(380, 98, 'v-d', 'ТОВАР') + T(612, 98, 'v-d', 'ЦЕНА', 'end') + T(700, 98, 'v-d', 'КУРС', 'end');
      for (i = 0; i < GOODS.length; i++) {
        var gy = 108 + i * 38;
        o += '<g class="ec-g ec-g' + i + '"><rect x="372" y="' + gy + '" width="336" height="32" fill="#0C1210" stroke="#1C2722"/>' +
          T(384, gy + 21, 'ec-gn', GOODS[i][0]) + T(612, gy + 22, 'ec-gp', K.money(GOODS[i][1] * GOODS[i][2] / 100) + ' $', 'end') +
          T(700, gy + 22, 'ec-gc ' + (GOODS[i][2] >= 100 ? 'up' : 'dn'), (GOODS[i][2] >= 100 ? '▲ ' : '▼ ') + GOODS[i][2] + ' %', 'end') + '</g>';
      }
      // график курса за сутки
      o += '<path d="M22 316.5H708" stroke="#22302A"/>' + T(22, 342, 'v-t', 'КУРС СКУПЩИКОВ ЗА СУТКИ');
      var X0 = 64, X1 = 700, Y = function (v) { return 425 - (v - 100) * 2.6; };
      [125, 100, 75].forEach(function (v) { o += '<path d="M' + X0 + ' ' + Y(v).toFixed(1) + 'H' + X1 + '" stroke="' + (v === 100 ? '#26342D' : '#1A2420') + '" stroke-dasharray="' + (v === 100 ? '0' : '4 4') + '"/>' + T(52, Y(v) + 5, 'ec-ax', v + ' %', 'end'); });
      var W = walk(), d = '', a = '';
      for (i = 0; i < W.length; i++) { var px = X0 + (X1 - X0) * i / (W.length - 1); d += (i ? 'L' : 'M') + px.toFixed(1) + ' ' + Y(W[i]).toFixed(1); }
      a = d + 'L' + X1 + ' 500L' + X0 + ' 500Z';
      o += '<clipPath id="ecClip"><rect class="ec-cl" x="' + X0 + '" y="340" width="0" height="170"/></clipPath>';
      o += '<g clip-path="url(#ecClip)"><path d="' + a + '" fill="#2ECC71" opacity=".07"/><path d="' + d + '" fill="none" stroke="#2ECC71" stroke-width="2.5" stroke-linejoin="round"/></g>';
      o += '<circle class="ec-dot" cx="' + X1 + '" cy="' + Y(W[W.length - 1]).toFixed(1) + '" r="5" fill="#2ECC71"/>';
      ['00:00', '06:00', '12:00', '18:00', 'СЕЙЧАС'].forEach(function (s, k) { o += T((X0 + (X1 - X0) * k / 4).toFixed(0), 518, 'ec-ax', s, k === 0 ? 'start' : k === 4 ? 'end' : 'middle'); });
      o += '<g class="ec-cr"><rect x="470" y="330" width="238" height="26" rx="4" fill="#0E2A1B" stroke="#2ECC71"/>' + T(589, 348, 'ec-crt', 'КРЕДИТ ОДОБРЕН · ДОГОВОР ПОДПИСАН', 'middle') + '</g>';
      return o;
    },
    run: function (root, TL) {
      var cl = root.querySelector('.ec-cl'), tr = root.querySelector('.ec-tr'), cd = root.querySelector('.ec-cd'), fly = root.querySelector('.ec-fly'), fl = fly.querySelector('text');
      TL.anim(300, 2800, function (e) { cl.setAttribute('width', (636 * e).toFixed(1)); }, K.eio);
      var treas = 1284530, ticks = [[1250, 1], [3400, 0], [640, 2], [15000, 3], [2100, 0], [880, 1]];
      ticks.forEach(function (t, k) {
        TL.at(900 + k * 1350, function () {
          var a = treas; treas += t[0];
          TL.count(tr, 0, 700, a, treas, function (v) { return K.money(v) + ' $'; });
          fl.textContent = '+' + K.money(t[0]) + ' $';
          fly.classList.remove('go'); void fly.getBoundingClientRect(); fly.classList.add('go');
          var c = root.querySelector('.ec-tx' + t[1]); c.classList.remove('hit'); void c.getBoundingClientRect(); c.classList.add('hit');
        });
      });
      var gi = [2, 0, 3, 1, 4, 2, 0];
      gi.forEach(function (g, k) {
        TL.at(1500 + k * 1150, function () {
          var row = root.querySelector('.ec-g' + g), G = GOODS[g];
          G[2] = Math.max(75, Math.min(125, G[2] + (k % 2 ? -1 : 1) * (2 + (k * 3) % 5)));
          row.querySelector('.ec-gp').textContent = K.money(G[1] * G[2] / 100) + ' $';
          var c = row.querySelector('.ec-gc'), up = G[2] >= 100;
          c.textContent = (up ? '▲ ' : '▼ ') + G[2] + ' %'; c.setAttribute('class', 'ec-gc ' + (up ? 'up' : 'dn'));
          row.classList.remove('hit'); void row.getBoundingClientRect(); row.classList.add('hit');
        });
      });
      for (var s = 1; s <= 9; s++) (function (s) { TL.at(s * 1000, function () { var q = 462 - s; cd.textContent = '0' + ((q / 60) | 0) + ':' + ('0' + (q % 60)).slice(-2); }); })(s);
      TL.cls(root, 5200, 'p3');
    }
  };

  // ── 12. И ЭТО НЕ ВСЁ ─────────────────────────────────────────────────────
  var MORE = [
    ['Нокаут и добивание', 'лежачего добивают ударом'], ['Оружие из рук', 'падает при нокауте и смерти'], ['Багажник машины', 'открывается через кольцо ALT'],
    ['Наручники и конвой', 'полиция ведёт задержанного'], ['Автосалон', 'цена по ТТХ машины'], ['Паспортный стол', 'имя, фото и подпись в книжке'],
    ['Выборы и импичмент', 'мэра выбирает город'], ['Законы и штрафы', 'мэр пишет, полиция выписывает'], ['Скорая и 112', 'вызов с телефона дежурным'],
    ['Радиация', 'доза, ящики ТВЭЛ, костюм'], ['Шахта и уран', 'руда, дробилка, слитки'], ['Нефтяной двор', 'вышки, бочки, скупщик'],
    ['Ферма и склад', 'урожай кормит город'], ['Логистика', 'рейсы, фуры, диспетчер'], ['Доставка еды', 'заказ в телефоне, курьер'],
    ['Доставка оружия', 'торговец и курьер'], ['Такси', 'водители и заказы'], ['Ограбление ювелирного', 'настоящие витрины магазина'],
    ['Ограбление банка', 'хранилище и фонд'], ['Метлаборатория', 'варка, противогаз, партии'], ['Даркнет', 'доска заказов за наличные'],
    ['Биржа акций', 'торги в телефоне'], ['Кредиты', 'договор с подписью'], ['15 навыков', 'растут от дела']
  ];
  VIG.more = {
    html: function () {
      var o = K.DEFS;
      o += K.head('СИСТЕМЫ СЕРВЕРА · ВЫБОРКА', '24 ИЗ МНОГИХ');
      for (var i = 0; i < MORE.length; i++) {
        var c = (i / 8) | 0, r = i % 8, x = 22 + c * 236, y = 56 + r * 58;
        o += '<g class="mo mo' + i + '"><rect class="mo-r" x="' + x + '" y="' + y + '" width="3" height="46"/>' +
          T(x + 14, y + 18, 'mo-c', (i < 9 ? '0' : '') + (i + 1)) + T(x + 42, y + 18, 'mo-t', MORE[i][0].toUpperCase()) +
          T(x + 42, y + 37, 'mo-d', MORE[i][1]) + '<path d="M' + x + ' ' + (y + 52.5) + 'H' + (x + 222) + '" stroke="#1A2420"/></g>';
      }
      return o;
    },
    run: function (root, TL) {
      var items = root.querySelectorAll('.mo'), last = null;
      for (var i = 0; i < items.length; i++) TL.cls(items[i], 150 + i * 70, 'on');
      var order = [5, 17, 9, 2, 20, 13, 0, 22, 11];
      order.forEach(function (n, k) {
        TL.at(2300 + k * 850, function () { if (last) last.classList.remove('hl'); last = items[n]; last.classList.add('hl'); });
      });
    }
  };
})();
