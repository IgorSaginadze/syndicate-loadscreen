/* vig2.js - примеры: телефон с казино, банкомат, оплата картой, заправка. */
(function () {
  'use strict';
  var K = VK;
  function T(x, y, cls, s, anchor) {
    return '<text x="' + x + '" y="' + y + '" class="' + cls + '"' + (anchor ? ' text-anchor="' + anchor + '"' : '') + '>' + s + '</text>';
  }
  function toast(cls, x, y, app, col, title, text) {
    return '<g transform="translate(' + x + ',' + y + ')"><g class="toast ' + cls + '">' +
      '<rect width="214" height="64" rx="12" fill="#0E1512" stroke="#26342D"/>' +
      '<rect x="0" y="12" width="3" height="40" fill="' + col + '"/>' +
      K.appIcon(app, 14, 14, col, 28) +
      T(52, 28, 'ts-t', title) + T(200, 28, 'ts-w', 'сейчас', 'end') + T(52, 48, 'ts-x', text) + '</g></g>';
  }

  // ── 5. ТЕЛЕФОН: казино в приложении ──────────────────────────────────────
  // Краш как в synd_phone/apps/casino: точка взрыва на стороне сервера, забрал
  // раньше - получил ставку x множитель. Здесь раунд до x3,12, забор на x2,47.
  var PX = 250, PY = 29, CR = { x0: 26, x1: 204, y0: 290, h: 160, T: 2.9, M: 3.12 };
  CR.k = Math.log(CR.M) / CR.T;
  function crY(m) { return CR.y0 - (m - 1) / (CR.M - 1 + 0.08) * CR.h; }
  function crash() {
    var o = '<g class="cas">' + '<rect x="10" y="10" width="210" height="452" fill="#0A0F0D"/>' + K.statusBar() +
      '<path d="M26 56l-6 6 6 6" stroke="#DDE6E1" stroke-width="2" fill="none"/>' + T(38, 67, 'cs-h', 'КАЗИНО') +
      T(206, 67, 'cs-bal', '12 480 $', 'end');
    var tabs = [['КРАШ', 1], ['РУЛЕТКА'], ['СЛОТЫ'], ['БЛЭКДЖЕК'], ['ПОКЕР'], ['ДУРАК']], x = 20;
    for (var i = 0; i < tabs.length; i++) {
      var w = 16 + tabs[i][0].length * 7.2;
      o += '<rect x="' + x + '" y="82" width="' + w.toFixed(0) + '" height="22" rx="11" ' + (tabs[i][1] ? 'fill="#2ECC71"' : 'fill="none" stroke="#2E3F37"') + '/>' +
        T((x + w / 2).toFixed(1), 97, tabs[i][1] ? 'cs-tab on' : 'cs-tab', tabs[i][0], 'middle');
      x += w + 6;
    }
    o += '<rect x="20" y="114" width="190" height="190" rx="8" fill="#060A08" stroke="#1C2722"/>';
    for (var g = 0; g < 4; g++) o += '<path d="M20 ' + (140 + g * 44) + 'H210" stroke="#131C18"/>';
    var d = '';
    for (var s = 0; s <= 60; s++) {
      var t = CR.T * s / 60, m = Math.exp(CR.k * t);
      d += (s ? 'L' : 'M') + (CR.x0 + (CR.x1 - CR.x0) * s / 60).toFixed(1) + ' ' + crY(m).toFixed(1);
    }
    o += '<clipPath id="crClip"><rect class="cr-cl" x="20" y="110" width="0" height="200"/></clipPath>';
    o += '<g clip-path="url(#crClip)"><path class="cr-fill" d="' + d + 'L' + CR.x1 + ' ' + CR.y0 + 'L' + CR.x0 + ' ' + CR.y0 + 'Z" fill="#2ECC71" opacity=".10"/>' +
      '<path class="cr-line" d="' + d + '" fill="none" stroke="#2ECC71" stroke-width="3" stroke-linejoin="round"/></g>';
    o += '<circle class="cr-dot" cx="' + CR.x0 + '" cy="' + CR.y0 + '" r="5" fill="#F2F5F3"/>';
    o += T(115, 206, 'cr-m', '×1,00', 'middle') + T(115, 228, 'cr-s', 'РАКЕТА ЛЕТИТ', 'middle');
    var hist = [['×1,84', '#2ECC71'], ['×3,40', '#2ECC71'], ['×1,02', '#E74C3C'], ['×7,55', '#F1C40F'], ['×2,10', '#2ECC71']];
    for (i = 0; i < hist.length; i++) o += '<rect x="' + (20 + i * 38.5) + '" y="314" width="35" height="18" rx="4" fill="#111A16"/>' + T(20 + i * 38.5 + 17.5, 327, 'cs-hi', hist[i][0], 'middle').replace('class="cs-hi"', 'class="cs-hi" fill="' + hist[i][1] + '"');
    o += T(22, 358, 'cs-l', 'СТАВКА') + '<rect x="84" y="342" width="126" height="26" rx="6" fill="#111A16" stroke="#26342D"/>' + T(147, 360, 'cs-bet', '500 $', 'middle');
    o += '<g class="cr-btn"><rect x="20" y="384" width="190" height="46" rx="10"/>' + T(115, 413, 'cr-bt', 'ЗАБРАТЬ  500 $', 'middle') + '</g>';
    o += '<g class="cr-win"><rect x="18" y="38" width="194" height="40" rx="12" fill="#12251B" stroke="#2ECC71"/>' +
      T(34, 63, 'cs-wt', 'ВЫИГРЫШ ЗАЧИСЛЕН') + T(198, 63, 'cs-wv', '+1 235 $', 'end') + '</g>';
    return o + '</g>';
  }
  VIG.phone = {
    html: function () {
      var inner = '<g class="scr-home">' + K.homeGrid() + '</g><g class="scr-cas">' + crash() + '</g>' +
        K.tap('tA', 194, 148) + K.tap('tB', 115, 407);
      var o = K.DEFS;
      o += toast('ta1', 18, 70, 'bank', '#138D75', 'БАНК', 'Зарплата +2 500 $');
      o += toast('ta2', 498, 136, 'taxi', '#D4AC0D', 'ТАКСИ', 'Водитель в пути, 2 мин');
      o += toast('ta3', 18, 318, 'gov', '#2E5CB8', 'СИНУСЛУГИ', 'Идут выборы мэра');
      o += toast('ta4', 498, 380, 'food', '#CA6F1E', 'ЕДА', 'Курьер забрал заказ');
      o += K.phone(PX, PY, inner);
      o += T(365, 522, 'v-d', 'ИГРЫ: КРАШ · РУЛЕТКА · СЛОТЫ · БЛЭКДЖЕК · ПОКЕР · ДУРАК', 'middle');
      return o;
    },
    run: function (root, TL) {
      var cl = root.querySelector('.cr-cl'), dot = root.querySelector('.cr-dot'), mt = root.querySelector('.cr-m');
      var bt = root.querySelector('.cr-bt'), st = root.querySelector('.cr-s'), paid = false;
      TL.cls(root, 500, 'p1');
      TL.cls(root, 1300, 'tapA');
      TL.cls(root, 1600, 'p2');
      TL.anim(2200, CR.T * 1000, function (e) {
        var t = CR.T * e, m = Math.exp(CR.k * t), x = CR.x0 + (CR.x1 - CR.x0) * e;
        cl.setAttribute('width', (x - 20 + 2).toFixed(1));
        dot.setAttribute('cx', x.toFixed(1)); dot.setAttribute('cy', crY(m).toFixed(1));
        mt.textContent = '×' + K.dec(Math.floor(m * 100) / 100, 2);
        if (!paid) bt.textContent = 'ЗАБРАТЬ  ' + K.money(500 * m) + ' $';
        if (!paid && m >= 2.47) {
          paid = true; root.classList.add('p3', 'tapB');
          bt.textContent = 'ЗАБРАНО  1 235 $'; st.textContent = 'ВЫ ЗАБРАЛИ НА ×2,47';
        }
        if (e >= 1) { root.classList.add('p4'); mt.textContent = '×3,12'; st.textContent = 'ВЗРЫВ · ВЫ УСПЕЛИ'; }
      });
      TL.cls(root, 6000, 'p5');
      TL.cls(root, 6800, 'p6');
      TL.cls(root, 7600, 'p7');
      TL.cls(root, 8700, 'p8');
    }
  };

  // ── 6. БАНКОМАТ: карта, ПИН, сумма, пачка, чек ───────────────────────────
  // Как synd_atm (build/atm.py): квадратный экран, по 4 боковые клавиши,
  // стальные клавиши с чёрными цифрами, справа ОТМЕНА/СТЕРЕТЬ/ВВОД, шторка
  // выдачи внутри горла, щель чека пустая, пока чек не нужен.
  function key(x, y, w, h, label, cls, fill, tcls) {
    return '<g class="key ' + (cls || '') + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" fill="' + (fill || 'url(#steel)') + '" stroke="#0B0F0D" stroke-width="1"/>' +
      T(x + w / 2, y + h / 2 + 5, tcls || 'k-d', label, 'middle') + '</g>';
  }
  VIG.atm = {
    html: function () {
      var o = K.DEFS, i;
      // корпус
      o += '<rect x="40" y="30" width="292" height="484" rx="10" fill="url(#body)" stroke="#3A4C43" stroke-width="1.5"/>';
      o += '<rect x="52" y="36" width="268" height="4" fill="#2ECC71" opacity=".85"/>';
      o += '<rect x="52" y="46" width="268" height="48" rx="4" fill="#0A0F0D"/>';
      o += '<g transform="translate(78,70)">' + K.mark(0, 0, 15, '#2ECC71', '#0B100D') + '</g>';
      o += T(102, 67, 'at-bn', 'СИНДИКАТ БАНК') + T(102, 84, 'v-d', 'БАНКОМАТ · 24 ЧАСА');
      // экран и боковые клавиши
      o += '<rect x="88" y="106" width="196" height="170" rx="6" fill="#0A0F0D" stroke="#3A4C43"/>';
      o += '<rect x="102" y="116" width="168" height="150" fill="url(#scr)"/>';
      for (i = 0; i < 4; i++) {
        o += '<rect class="sk skl' + i + '" x="60" y="' + (128 + i * 34) + '" width="22" height="14" rx="3" fill="url(#steel)"/>';
        o += '<rect class="sk skr' + i + '" x="290" y="' + (128 + i * 34) + '" width="22" height="14" rx="3" fill="url(#steel)"/>';
      }
      // экраны
      o += '<g class="as as0">' + T(186, 170, 'as-s', 'ДОБРО ПОЖАЛОВАТЬ', 'middle') + T(186, 194, 'as-b', 'ВСТАВЬТЕ КАРТУ', 'middle') +
        '<rect x="170" y="210" width="32" height="20" rx="3" fill="none" stroke="#2ECC71" stroke-width="1.5"/><path d="M186 234v12m-5-5 5 5 5-5" stroke="#2ECC71" stroke-width="1.5" fill="none"/></g>';
      o += '<g class="as as1">' + T(186, 156, 'as-b', 'ВВЕДИТЕ ПИН-КОД', 'middle');
      for (i = 0; i < 4; i++) o += '<rect x="' + (136 + i * 26) + '" y="176" width="20" height="26" rx="3" fill="none" stroke="#2E3F37"/><circle class="pd pd' + i + '" cx="' + (146 + i * 26) + '" cy="189" r="4.5" fill="#2ECC71"/>';
      o += T(186, 236, 'as-s', 'ВВОД — ПОДТВЕРДИТЬ', 'middle') + '</g>';
      o += '<g class="as as2">' + T(186, 136, 'as-b', 'СНЯТЬ НАЛИЧНЫЕ', 'middle') +
        T(108, 172, 'as-o', '1 000 $') + T(108, 206, 'as-o as-sel', '5 000 $') + T(264, 172, 'as-o', '10 000 $', 'end') + T(264, 206, 'as-o', 'ДРУГАЯ', 'end') +
        T(186, 250, 'as-s', 'ВЫБЕРИТЕ СУММУ', 'middle') + '</g>';
      o += '<g class="as as3">' + T(186, 170, 'as-b', 'ОПЕРАЦИЯ', 'middle') + T(186, 190, 'as-b', 'ВЫПОЛНЯЕТСЯ', 'middle') +
        '<g class="as-spin"><path d="M186 208a14 14 0 1 1-14 14" stroke="#2ECC71" stroke-width="3" fill="none" stroke-linecap="round"/></g></g>';
      o += '<g class="as as4">' + T(186, 178, 'as-b', 'ЗАБЕРИТЕ', 'middle') + T(186, 198, 'as-b', 'НАЛИЧНЫЕ', 'middle') +
        '<path d="M186 214v22m-8-8 8 8 8-8" stroke="#2ECC71" stroke-width="2" fill="none"/></g>';
      o += '<g class="as as5">' + T(186, 178, 'as-b', 'ЗАБЕРИТЕ КАРТУ', 'middle') + T(186, 202, 'as-s', 'СПАСИБО, ЧТО С НАМИ', 'middle') + '</g>';
      // клавиатура
      var labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
      for (i = 0; i < 12; i++) o += key(92 + (i % 3) * 46, 294 + ((i / 3) | 0) * 30, 40, 24, labels[i], 'kd' + labels[i].replace('*', 's').replace('#', 'h'));
      o += key(236, 294, 64, 24, 'ОТМЕНА', 'kcan', '#B03A2E', 'k-f');
      o += key(236, 324, 64, 24, 'СТЕРЕТЬ', 'kclr', '#C9A227', 'k-f');
      o += key(236, 354, 64, 24, 'ВВОД', 'kent', '#27AE60', 'k-f');
      o += key(236, 384, 64, 24, '', 'kbl');
      // щель чека, картоприёмник, выдача
      o += '<rect x="92" y="428" width="70" height="8" rx="2" fill="#030504"/>';
      o += '<g class="at-rcp"><rect x="100" y="436" width="54" height="0" fill="#E9E5D8"/></g>';
      o += '<rect x="228" y="424" width="80" height="16" rx="4" fill="#141B18" stroke="#3A4C43"/><rect x="236" y="430" width="64" height="4" fill="#030504"/>';
      o += '<rect class="at-lamp" x="236" y="444" width="64" height="3" fill="#2ECC71"/>';
      o += '<g class="at-edge"><rect x="240" y="410" width="56" height="22" rx="3" fill="#16201B" stroke="#2B3B33"/><rect x="240" y="410" width="10" height="22" fill="#2ECC71"/></g>';
      o += '<rect x="86" y="458" width="222" height="40" rx="5" fill="#0A0F0D" stroke="#3A4C43"/>';
      o += '<clipPath id="atCash"><rect x="86" y="466" width="222" height="80"/></clipPath>';
      o += '<g clip-path="url(#atCash)"><g class="at-cash"><rect x="126" y="440" width="140" height="30" rx="2" fill="#CFE0D3" stroke="#6F9B7E"/>' +
        '<rect x="126" y="446" width="140" height="3" fill="#9EC4AA"/><rect x="186" y="440" width="18" height="30" fill="#2ECC71"/>' + T(150, 462, 'at-den', '1000') + '</g></g>';
      o += '<rect class="at-shut" x="98" y="466" width="198" height="24" rx="2" fill="#56645D"/>';
      // справа: карта крупно и чек
      o += '<g class="at-card"><g transform="translate(398,64)">' + K.card(290, '4276 3800 1204 0417', 'IVAN KARPOV') + '</g></g>';
      o += '<g class="at-cl">' + T(398, 48, 'v-d', 'ВАША КАРТА') + '</g>';
      o += '<g class="at-bill"><clipPath id="atBill"><rect class="at-bcl" x="440" y="284" width="210" height="0"/></clipPath><g clip-path="url(#atBill)">' +
        '<path d="M446 284H646V494l-10 8-10-8-10 8-10-8-10 8-10-8-10 8-10-8-10 8-10-8-10 8-10-8-10 8-10-8-10 8-10-8-10 8-10-8-10 8-10-8V270z" fill="url(#paperG)"/>';
      var rc = [['СИНДИКАТ БАНК', ''], ['БАНКОМАТ № 0102', ''], ['29.09.2026', '21:47'], ['КАРТА', '•0417'], ['ВЫДАЧА', '5 000 $'], ['ОСТАТОК', '48 215 $'], ['', ''], ['СПАСИБО', '']];
      for (i = 0; i < rc.length; i++) o += T(462, 310 + i * 23, i === 0 ? 'rc-h' : 'rc-t', rc[i][0]) + T(630, 310 + i * 23, 'rc-t', rc[i][1], 'end');
      o += '</g></g>';
      return o;
    },
    run: function (root, TL) {
      var bcl = root.querySelector('.at-bcl'), rcp = root.querySelector('.at-rcp rect');
      function scr(n) { var a = root.querySelectorAll('.as'); for (var i = 0; i < a.length; i++) a[i].classList.toggle('on', i === n); }
      function press(sel, ms) { TL.at(ms, function () { var k = root.querySelector(sel); if (!k) return; k.classList.add('kp'); setTimeout(function () { k.classList.remove('kp'); }, 220); }); }
      scr(0);
      TL.cls(root, 1000, 'p1');
      TL.at(2100, function () { scr(1); });
      var ks = ['.kd4', '.kd7', '.kd1', '.kd9'];
      for (var i = 0; i < 4; i++) { press(ks[i], 2500 + i * 350); TL.cls(root.querySelector('.pd' + i), 2500 + i * 350, 'on'); }
      press('.kent', 3950);
      TL.at(4250, function () { scr(2); });
      press('.skl2', 4950);
      TL.at(5150, function () { scr(3); });
      TL.at(6000, function () { scr(4); root.classList.add('p5'); });
      TL.at(6800, function () { root.classList.add('p6'); });
      TL.anim(6800, 1300, function (e) { bcl.setAttribute('height', (226 * e).toFixed(1)); rcp.setAttribute('height', (22 * e).toFixed(1)); });
      TL.at(7900, function () { scr(5); root.classList.add('p7'); });
    }
  };

  // ── 7. ОПЛАТА КАРТОЙ: касанием до 10 000 $, дороже - чип и ПИН ────────────
  // A.TAPMAX = 10000, A.TAPTIME = 1.2 с (synd_term/shared.lua).
  VIG.term = {
    html: function () {
      var o = K.DEFS, i;
      o += '<path d="M60 506H690" stroke="#26342D" stroke-width="2"/>';
      // карта, которую вставляют снизу (за корпусом)
      o += '<g class="tm-cb"><rect x="172" y="440" width="96" height="100" rx="6" fill="#121A16" stroke="#2B3B33"/><rect x="172" y="440" width="9" height="100" fill="#2ECC71"/>' +
        '<path d="M196 512h56M196 520h40" stroke="#56645D" stroke-width="3"/></g>';
      // чек растёт из щели сверху
      o += '<clipPath id="tmBill"><rect class="tm-bcl" x="150" y="118" width="140" height="0"/></clipPath>';
      o += '<g class="tm-bill" clip-path="url(#tmBill)"><rect x="158" y="18" width="124" height="104" fill="url(#paperG)"/>' +
        T(220, 38, 'rc-h', 'РЕСТОРАН', 'middle') + T(166, 60, 'rc-t', 'ЗАКАЗ № 2231') + T(274, 60, 'rc-t', '21:47', 'end') +
        T(166, 80, 'rc-t', 'КАРТА') + T(274, 80, 'rc-t', '•0417', 'end') + T(166, 100, 'rc-t', 'ИТОГО') + T(274, 100, 'rc-t', '1 250 $', 'end') + '</g>';
      // корпус терминала
      o += '<rect x="120" y="112" width="200" height="390" rx="26" fill="url(#body)" stroke="#3A4C43" stroke-width="1.5"/>';
      o += '<rect x="150" y="116" width="140" height="6" rx="3" fill="#030504"/>';
      o += '<rect x="138" y="138" width="164" height="146" rx="8" fill="#0A0F0D" stroke="#2A3731"/><rect x="146" y="146" width="148" height="130" rx="4" fill="url(#scr)"/>';
      // экраны терминала
      var nfc = '<g fill="none" stroke="#2ECC71" stroke-width="2" stroke-linecap="round"><path d="M214 232a6 6 0 0 1 0 12"/><path d="M219 228a12 12 0 0 1 0 20"/><path d="M224 224a18 18 0 0 1 0 28"/></g>';
      o += '<g class="ts ts0">' + T(220, 170, 'ts-l', 'К ОПЛАТЕ', 'middle') + T(220, 204, 'ts-sum', '1 250 $', 'middle') + nfc + T(220, 268, 'ts-l', 'ПРИЛОЖИТЕ КАРТУ', 'middle') + '</g>';
      o += '<g class="ts ts1">' + T(220, 196, 'ts-l', 'ЧТЕНИЕ КАРТЫ', 'middle') + '<rect x="166" y="212" width="108" height="6" fill="#131B18"/><rect class="ts-bar" x="166" y="212" width="108" height="6" fill="#2ECC71"/></g>';
      o += '<g class="ts ts2"><circle cx="220" cy="196" r="22" fill="none" stroke="#2ECC71" stroke-width="3"/><path d="M209 196l8 8 14-15" stroke="#2ECC71" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' + T(220, 246, 'ts-ok', 'ОДОБРЕНО', 'middle') + '</g>';
      o += '<g class="ts ts3">' + T(220, 170, 'ts-l', 'К ОПЛАТЕ', 'middle') + T(220, 204, 'ts-sum', '12 400 $', 'middle') + T(220, 236, 'ts-l', 'ДОРОЖЕ 10 000 $', 'middle') + T(220, 258, 'ts-l', 'ВСТАВЬТЕ КАРТУ', 'middle') + '</g>';
      o += '<g class="ts ts4">' + T(220, 180, 'ts-l', 'ВВЕДИТЕ ПИН-КОД', 'middle');
      for (i = 0; i < 4; i++) o += '<circle class="tp tp' + i + '" cx="' + (190 + i * 20) + '" cy="210" r="5"/>';
      o += T(220, 252, 'ts-l', '12 400 $', 'middle') + '</g>';
      o += '<g class="ts ts5"><circle cx="220" cy="196" r="22" fill="none" stroke="#2ECC71" stroke-width="3"/><path d="M209 196l8 8 14-15" stroke="#2ECC71" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' + T(220, 246, 'ts-ok', 'ОДОБРЕНО', 'middle') + '</g>';
      // клавиши
      var lb = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', ''];
      for (i = 0; i < 12; i++) if (lb[i]) o += key(146 + (i % 3) * 52, 300 + ((i / 3) | 0) * 30, 44, 24, lb[i], 'tk' + lb[i]);
      o += key(146, 424, 44, 26, '✕', 'tkx', '#B03A2E', 'k-f') + key(198, 424, 44, 26, '←', 'tkc', '#C9A227', 'k-f') + key(250, 424, 44, 26, '✓', 'tko', '#27AE60', 'k-f');
      o += T(220, 480, 'tm-brand', 'СИНДИКАТ БАНК', 'middle');
      // волна касания
      o += '<g class="tm-wave" fill="none" stroke="#2ECC71" stroke-width="2.5"><path d="M190 128a40 40 0 0 1 60 0"/><path d="M178 114a58 58 0 0 1 84 0"/><path d="M166 100a76 76 0 0 1 108 0"/></g>';
      // карта для касания (над корпусом)
      o += '<g class="tm-cf"><g transform="translate(418,108)">' + K.card(250, '4276 3800 1204 0417', 'IVAN KARPOV') + '</g></g>';
      // три правила справа
      var rows = [['nfc', 'ДО 10 000 $', 'приложил карту — и пошёл'], ['chip', 'ДОРОЖЕ 10 000 $', 'карту в терминал и ПИН-код'], ['cash', 'НАЛИЧНЫЕ', 'для тёмных дел: мет, даркнет, принтеры']];
      var ic = {
        nfc: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 14a6 6 0 0 1 0 12"/><path d="M15 10a12 12 0 0 1 0 20"/><path d="M20 6a18 18 0 0 1 0 28"/></g>',
        chip: '<rect x="4" y="9" width="28" height="22" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 20h28M18 9v22" stroke="currentColor" stroke-width="2"/>',
        cash: '<rect x="2" y="11" width="32" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="20" r="4" fill="none" stroke="currentColor" stroke-width="2"/>'
      };
      for (i = 0; i < rows.length; i++) {
        o += '<g class="tr tr' + i + '" transform="translate(410,' + (338 + i * 58) + ')"><rect x="0" y="0" width="300" height="48" fill="#0C1210" stroke="#22302A"/><rect class="tr-rail" x="0" y="0" width="3" height="48"/>' +
          '<g transform="translate(14,4)" class="tr-ic">' + ic[rows[i][0]] + '</g>' + T(62, 20, 'tr-t', rows[i][1]) + T(62, 38, 'tr-x', rows[i][2]) + '</g>';
      }
      return o;
    },
    run: function (root, TL) {
      var bcl = root.querySelector('.tm-bcl');
      function scr(n) { var a = root.querySelectorAll('.ts'); for (var i = 0; i < a.length; i++) a[i].classList.toggle('on', i === n); }
      function row(n) { var a = root.querySelectorAll('.tr'); for (var i = 0; i < a.length; i++) a[i].classList.toggle('on', i === n); }
      function press(sel, ms) { TL.at(ms, function () { var k = root.querySelector(sel); if (!k) return; k.classList.add('kp'); setTimeout(function () { k.classList.remove('kp'); }, 220); }); }
      scr(0); row(-1);
      TL.at(900, function () { root.classList.add('p1'); row(0); });
      TL.at(1750, function () { root.classList.add('p2'); scr(1); });
      TL.at(3050, function () { root.classList.add('p3'); scr(2); });
      TL.anim(3300, 1200, function (e) { bcl.setAttribute('height', (104 * e).toFixed(1)); bcl.setAttribute('y', (118 - 104 * e).toFixed(1)); });
      TL.at(5100, function () { root.classList.add('p4'); scr(3); row(1); });
      TL.at(5900, function () { root.classList.add('p5'); scr(4); });
      for (var i = 0; i < 4; i++) { press('.tk' + [3, 8, 1, 5][i], 6200 + i * 300); TL.cls(root.querySelector('.tp' + i), 6200 + i * 300, 'on'); }
      press('.tko', 7450);
      TL.at(7700, function () { root.classList.add('p6'); scr(5); });
      TL.at(8700, function () { root.classList.add('p7'); row(2); });
    }
  };

  // ── 8. ЗАПРАВКИ: расход, колонка, подвоз ─────────────────────────────────
  // Четыре сорта (Vault.Fuel 1..4), бак ядра АЗС - 10 000 л на сорт,
  // рейс бензовоза - бочки по 100 л (город -> бак той АЗС, где выгрузились).
  var FX = 560, FY = 214, FR = 104;
  function fpt(v, r) { var a = Math.PI * (1 - v); return [FX + r * Math.cos(a), FY - r * Math.sin(a)]; }
  VIG.fuel = {
    html: function () {
      var o = K.DEFS, i;
      // колонка
      o += '<rect x="36" y="44" width="206" height="440" rx="10" fill="url(#body)" stroke="#3A4C43" stroke-width="1.5"/>';
      o += '<rect x="36" y="44" width="206" height="54" rx="10" fill="#0E1512"/><rect x="36" y="92" width="206" height="4" fill="#2ECC71"/>';
      o += T(56, 80, 'fu-az', 'АЗС') + T(222, 76, 'v-d', 'СИНДИКАТ', 'end');
      o += '<rect x="56" y="110" width="166" height="150" rx="4" fill="#050A08" stroke="#2A3731"/>';
      o += T(68, 132, 'v-d', 'СУММА') + T(210, 168, 'fu-sum', '0', 'end') + T(210, 132, 'v-d', '$', 'end');
      o += T(68, 190, 'v-d', 'ЛИТРЫ') + T(210, 222, 'fu-l', '0,00', 'end');
      o += T(68, 248, 'v-d', 'ЗА ЛИТР') + T(210, 249, 'fu-p', '50 $', 'end');
      var gr = ['92', '95', '100', 'ДТ'];
      for (i = 0; i < 4; i++) {
        o += '<g class="fg fg' + i + '"><rect x="' + (56 + i * 42) + '" y="276" width="36" height="42" rx="5" fill="#141B18" stroke="#2E3F37"/>' +
          (i < 3 ? T(74 + i * 42, 292, 'fg-s', 'АИ', 'middle') : '') + T(74 + i * 42, i < 3 ? 309 : 302, 'fg-n', gr[i], 'middle') + '</g>';
      }
      o += '<text class="fu-paid" x="139" y="344" text-anchor="middle">ОПЛАЧЕНО КАРТОЙ</text>';
      // пистолет и шланг
      o += '<path class="fu-hose" d="M242 430C300 430 300 330 262 330" fill="none" stroke="#1A1F1D" stroke-width="9"/><path class="fu-hose fu-flow" d="M242 430C300 430 300 330 262 330" fill="none" stroke="#2ECC71" stroke-width="2"/>';
      o += '<path d="M242 316h26l6 8-6 22h-26z" fill="#2A3731" stroke="#48565E"/>';
      o += '<rect x="36" y="484" width="206" height="16" fill="#141B18"/>';
      // прибор топлива машины
      o += T(452, 60, 'v-t', 'БАК МАШИНЫ') + '<text x="708" y="60" text-anchor="end" class="fu-st">МАШИНА ЕДЕТ · РАСХОД</text>';
      o += '<path d="M' + (FX - FR - 14) + ' ' + FY + 'A' + (FR + 14) + ' ' + (FR + 14) + ' 0 0 1 ' + (FX + FR + 14) + ' ' + FY + '" fill="none" stroke="#22302A" stroke-width="1.5"/>';
      for (i = 0; i <= 8; i++) {
        var v = i / 8, a = fpt(v, FR), b = fpt(v, FR - (i % 4 === 0 ? 16 : 9));
        o += '<path d="M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1) + '" stroke="' + (v < 0.2 ? '#E74C3C' : '#8E9A94') + '" stroke-width="' + (i % 4 === 0 ? 2.5 : 1.5) + '"/>';
      }
      var e0 = fpt(0, FR - 32), e1 = fpt(1, FR - 32), eh = fpt(0.5, FR - 32);
      o += T(e0[0].toFixed(0), (e0[1] + 6).toFixed(0), 'fu-ef', 'E', 'middle') + T(e1[0].toFixed(0), (e1[1] + 6).toFixed(0), 'fu-ef', 'F', 'middle') + T(eh[0].toFixed(0), (eh[1] + 6).toFixed(0), 'fu-ef', '½', 'middle');
      o += '<g transform="translate(' + (FX - 11) + ',' + (FY - 58) + ')" class="fu-ico"><path d="M2 20V3h12v17M0 20h16M4 7h8M14 6l5 4v9a2 2 0 0 1-4 0v-5h-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></g>';
      o += '<g class="fu-needle"><path d="M' + FX + ' ' + FY + 'L' + (FX - FR + 20) + ' ' + FY + '" stroke="#F2F5F3" stroke-width="3" stroke-linecap="round"/><circle cx="' + FX + '" cy="' + FY + '" r="8" fill="#2A3731" stroke="#8E9A94"/></g>';
      o += '<circle class="fu-low" cx="' + (FX - 30) + '" cy="' + (FY + 34) + '" r="6"/>' + T(FX - 18, FY + 39, 'v-d', 'МАЛО ТОПЛИВА');
      // бак АЗС
      o += T(452, 272, 'v-t', 'БАК АЗС · АИ-95') + T(708, 272, 'fu-tank', '7 420 / 10 000 л', 'end');
      o += '<rect x="452" y="284" width="256" height="10" fill="#131B18"/><rect class="fu-tb" x="452" y="284" width="' + (256 * 0.742).toFixed(1) + '" height="10" fill="#2ECC71"/>';
      // подвоз
      o += '<path d="M300 452H710" stroke="#1C2722" stroke-width="22"/><path d="M300 452H710" stroke="#56645D" stroke-width="1.5" stroke-dasharray="10 10"/>';
      o += '<g transform="translate(300,382)"><rect x="0" y="12" width="44" height="40" rx="6" fill="#141B18" stroke="#3A4C43"/><ellipse cx="22" cy="12" rx="22" ry="6" fill="#1A2320" stroke="#3A4C43"/></g>' + T(300, 350, 'v-d', 'ХРАНИЛИЩЕ ГОРОДА');
      o += '<g transform="translate(672,388)"><rect x="0" y="0" width="30" height="44" rx="4" fill="#141B18" stroke="#3A4C43"/><rect x="6" y="8" width="18" height="10" fill="#2ECC71" opacity=".6"/></g>' + T(708, 376, 'v-d', 'АЗС', 'end');
      o += '<g class="fu-truck"><g transform="translate(350,424)"><rect x="0" y="4" width="84" height="26" rx="10" fill="#C9D3CD"/><path d="M8 16H76" stroke="#8E9A94" stroke-width="2"/>' +
        '<path d="M86 10h18l10 12v10H86z" fill="#2ECC71"/><rect x="94" y="13" width="10" height="7" fill="#0B120F"/><circle cx="18" cy="34" r="6" fill="#0B0F0D" stroke="#56645D" stroke-width="2"/><circle cx="68" cy="34" r="6" fill="#0B0F0D" stroke="#56645D" stroke-width="2"/><circle cx="102" cy="34" r="6" fill="#0B0F0D" stroke="#56645D" stroke-width="2"/></g></g>';
      o += T(505, 500, 'fu-run', 'РЕЙС БЕНЗОВОЗА · 8 БОЧЕК · 800 л', 'middle');
      return o;
    },
    run: function (root, TL) {
      var nd = root.querySelector('.fu-needle'), st = root.querySelector('.fu-st');
      var sum = root.querySelector('.fu-sum'), lit = root.querySelector('.fu-l'), tank = root.querySelector('.fu-tank'), tb = root.querySelector('.fu-tb');
      function setN(v) { nd.setAttribute('transform', 'rotate(' + (180 * v).toFixed(2) + ' ' + FX + ' ' + FY + ')'); }
      function setT(l) { tank.textContent = K.money(l) + ' / 10 000 л'; tb.setAttribute('width', (256 * l / 10000).toFixed(1)); }
      setN(0.72);
      TL.anim(300, 1900, function (e) { setN(0.72 - 0.6 * e); }, K.eio);
      TL.cls(root, 1900, 'p1');
      TL.at(2500, function () { root.classList.add('p2'); st.textContent = 'ЗАПРАВКА · АИ-95'; });
      TL.anim(2900, 3000, function (e) {
        var l = 42.7 * e;
        lit.textContent = K.dec(l, 2); sum.textContent = K.money(l * 50);
        setN(0.12 + 0.72 * e); setT(7420 - 43 * e);
      }, function (k) { return k; });
      TL.at(6000, function () { root.classList.add('p3'); st.textContent = 'ПОЛНЫЙ БАК'; });
      TL.cls(root, 6500, 'p4');
      TL.anim(8500, 900, function (e) { setT(7377 + 800 * e); }, K.eout);
      TL.at(8500, function () { root.classList.add('p5'); root.querySelector('.fu-run').textContent = 'РЕЙС ПРИШЁЛ · +800 л В БАК АЗС'; });
    }
  };
})();
