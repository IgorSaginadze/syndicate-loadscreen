/* map.js - план города rp_syndicate под экраном загрузки.
 *
 * Данные - навигатор телефона (build/lsassets.py -> data/mapdata.js): 256
 * полигонов проезжей части, 648 тротуаров, 39 воды, 2197 кварталов, 236 рёбер
 * графа улиц. Всё собирается в Path2D ОДИН раз в мировых координатах; кадр -
 * это несколько заливок под одной матрицей камеры.
 *
 * Браузер игры рисует процессором (CEF с disable-gpu): полный кадр карты -
 * ~22 мс на 1080p (замер ?bench, Chrome без видеокарты). Поэтому:
 *   - неподвижная карта не перерисовывается вовсе;
 *   - пока камера летит, холст вдвое меньше (q = 0.5, в 4 раза меньше точек),
 *     без пунктира осей и подписей; в конце - один чёткий кадр;
 *   - маршрут навигатора дорисовывается поверх готового снимка карты.
 */
var MAP = (function () {
  'use strict';
  var DATA = window.SYN_MAPDATA || null;
  var cv, ctx, W = 1, H = 1, dpr = 1, q = 1;
  var P = null, base = null, baseOk = false;
  var cam = { x: -8000, y: 7000, z: 0.035, r: 0, ax: 0, ay: 0 };
  var fly = null, rev = null, route = null, dots = null, running = false, want = true;
  var labelZ = 0.05;
  var NAMES = {
    bank: 'БАНК', motel: 'МОТЕЛЬ', house: 'ЧАСТНЫЙ СЕКТОР', hospital: 'БОЛЬНИЦА', cityhall: 'МЭРИЯ',
    parking: 'ПАРКОВКА', police: 'ПОЛИЦИЯ', powerplant: 'АЭС', garage: 'АВТОМАСТЕРСКАЯ', court: 'СУД',
    trainstation: 'ВОКЗАЛ', vault: 'ХРАНИЛИЩЕ', hotel: 'ОТЕЛЬ', hangar: 'АНГАР', cinema: 'КИНОТЕАТР',
    cardealer: 'АВТОСАЛОН', ranger: 'ЛЕСНИЧЕСТВО', restaurant: 'РЕСТОРАН', offices: 'БИЗНЕС-ЦЕНТР',
    station1: 'АЗС', station2: 'АЗС', church: 'ЦЕРКОВЬ', apartment1: 'ЖИЛОЙ ДОМ', apartment2: 'ЖИЛОЙ ДОМ',
    bar: 'БАР', club: 'КЛУБ', casino: 'КАЗИНО', fashion: 'БУТИК', jewelry: 'ЮВЕЛИРНЫЙ', farm: 'ФЕРМА',
    sawmill: 'ЛЕСОПИЛКА', prison: 'ТЮРЬМА', gunshop: 'ОРУЖЕЙНЫЙ', barn: 'АМБАР', radio: 'РАДИОВЫШКА',
    neutralshop: 'МАГАЗИН'
  };
  var DC = { 'Гос': '#2ECC71', 'Работа': '#F1C40F', 'Магазин': '#3498DB', 'Отдых': '#9B59B6', 'Инфо': '#C8C8C8', 'Жилье': '#E67E22' };

  function mkPoly(list) {
    var p = new Path2D();
    for (var i = 0; i < list.length; i++) {
      var a = list[i];
      p.moveTo(a[0], a[1]);
      for (var j = 2; j < a.length; j += 2) p.lineTo(a[j], a[j + 1]);
      p.closePath();
    }
    return p;
  }
  function mkRects(list) { // кварталы у навигатора - габариты x0,y0,x1,y1 (build/aphonemap.py)
    var p = new Path2D();
    for (var i = 0; i < list.length; i++) { var b = list[i]; p.rect(b[0], b[1], b[2] - b[0], b[3] - b[1]); }
    return p;
  }
  function mkLines(list) {
    var p = new Path2D();
    for (var i = 0; i < list.length; i++) {
      var a = list[i];
      p.moveTo(a[0], a[1]);
      for (var j = 2; j < a.length; j += 2) p.lineTo(a[j], a[j + 1]);
    }
    return p;
  }
  function build() {
    if (!DATA) return;
    P = {
      water: mkPoly(DATA.water), walks: mkPoly(DATA.walks), roads: mkPoly(DATA.roads),
      blocks: mkRects(DATA.blocks), lines: mkLines(DATA.lines), grid: new Path2D(), grid2: new Path2D()
    };
    for (var v = -16384; v <= 16384; v += 1024) {
      var g = (v % 4096 === 0) ? P.grid2 : P.grid;
      g.moveTo(v, -16384); g.lineTo(v, 16384);
      g.moveTo(-16384, v); g.lineTo(16384, v);
    }
    P.labels = [];
    for (var i = 0; i < DATA.marks.length; i++) {
      var m = DATA.marks[i], n = NAMES[m[2]];
      if (n) P.labels.push({ x: m[0], y: m[1], t: n, w: m[3] });
    }
    P.labels.sort(function (a, b) { return b.w - a.w; });
  }

  // мир -> пиксели холста (с учётом dpr и качества q)
  function mtx() {
    var k = dpr * q, c = Math.cos(cam.r), s = Math.sin(cam.r), z = cam.z * k;
    var ax = cam.ax * k, ay = cam.ay * k;
    return {
      a: z * c, b: -z * s, c: -z * s, d: -z * c,
      e: ax - z * (c * cam.x - s * cam.y), f: ay + z * (s * cam.x + c * cam.y), z: z, k: k
    };
  }
  function toScreen(x, y) { // в CSS-пикселях окна
    var M = mtx();
    return { x: (M.a * x + M.c * y + M.e) / M.k, y: (M.b * x + M.d * y + M.f) / M.k };
  }
  function setQ(v) {
    if (v === q) return;
    q = v;
    cv.width = Math.max(1, Math.round(W * q)); cv.height = Math.max(1, Math.round(H * q));
    baseOk = false; want = true;
  }

  function spaced(t, x, y, sp) {
    var cx = x;
    for (var i = 0; i < t.length; i++) {
      ctx.fillText(t[i], cx, y);
      cx += ctx.measureText(t[i]).width + sp;
    }
  }

  // сама карта: сетка, вода, здания, улицы, оси, подписи, точки мест
  function drawBase(fast) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#050706';
    ctx.fillRect(0, 0, cv.width, cv.height);
    if (!P) return;
    var M = mtx(), px = 1 / M.z;
    ctx.setTransform(M.a, M.b, M.c, M.d, M.e, M.f);
    if (fast) { // полёт: одни заливки, обводки - самое дорогое у процессора
      ctx.fillStyle = '#04111A'; ctx.fill(P.water);
      ctx.fillStyle = '#111A15'; ctx.fill(P.blocks);
      ctx.fillStyle = '#101A15'; ctx.fill(P.walks);
      ctx.fillStyle = '#15211B'; ctx.fill(P.roads);
      return;
    }
    ctx.lineWidth = px;
    ctx.strokeStyle = 'rgba(46,204,113,.035)'; ctx.stroke(P.grid);
    ctx.strokeStyle = 'rgba(46,204,113,.07)'; ctx.stroke(P.grid2);
    ctx.fillStyle = '#04111A'; ctx.fill(P.water);
    ctx.lineWidth = 1.2 * px; ctx.strokeStyle = '#0D2B3A'; ctx.stroke(P.water);
    // здания (габариты первого этажа): обводка, потом заливка поверх -
    // от обводки остаётся только наружный край, стыки соседних коробок пропадают
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.4 * px; ctx.strokeStyle = '#243830';
    ctx.stroke(P.blocks);
    ctx.fillStyle = '#0C130F'; ctx.fill(P.blocks);
    // тротуары и проезжая часть тем же приёмом
    ctx.lineWidth = 2.6 * px; ctx.strokeStyle = 'rgba(46,204,113,.24)';
    ctx.stroke(P.walks); ctx.stroke(P.roads);
    ctx.fillStyle = '#0E1713'; ctx.fill(P.walks);
    ctx.fillStyle = '#131E19'; ctx.fill(P.roads);
    ctx.setLineDash([7 * px, 11 * px]);
    ctx.lineWidth = 1.2 * px; ctx.strokeStyle = 'rgba(46,204,113,.20)'; ctx.stroke(P.lines);
    ctx.setLineDash([]);
    // подписи мест - в экранных координатах, всегда прямо
    ctx.setTransform(M.k, 0, 0, M.k, 0, 0);
    if (cam.z > labelZ) {
      ctx.font = '700 11px "Syn Narrow", Arial, sans-serif';
      ctx.textBaseline = 'middle';
      var ww = W / dpr, hh = H / dpr, taken = [];
      for (var j = 0; j < P.labels.length; j++) {
        var L = P.labels[j], s = toScreen(L.x, L.y);
        if (s.x < -200 || s.y < -40 || s.x > ww + 40 || s.y > hh + 40) continue;
        var lw = ctx.measureText(L.t).width + L.t.length * 1.6 + 10, hit = false;
        for (var u = 0; u < taken.length; u++) {
          var B = taken[u];
          if (s.x - 4 < B[2] && s.x + lw > B[0] && s.y - 9 < B[3] && s.y + 9 > B[1]) { hit = true; break; }
        }
        if (hit) continue;
        taken.push([s.x - 4, s.y - 9, s.x + lw, s.y + 9]);
        ctx.fillStyle = 'rgba(46,204,113,.55)';
        ctx.fillRect(s.x - 2, s.y - 2, 4, 4);
        ctx.fillStyle = 'rgba(190,205,197,.42)';
        spaced(L.t, s.x + 8, s.y + 0.5, 1.6);
      }
    }
    // все места навигатора (последний слайд): цвет по разделу, как в телефоне
    if (dots) {
      for (var qd = 0; qd < dots.length; qd++) {
        var G = dots[qd], sp = toScreen(G[2], G[3]), col = DC[G[0]] || '#2ECC71';
        ctx.globalAlpha = 0.22; ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(sp.x, sp.y, 9, 0, 6.2832); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillRect(sp.x - 3, sp.y - 3, 6, 6);
      }
    }
  }
  // поверх карты: маршрут навигатора и круг вступления
  function drawOver() {
    var M = mtx(), px = 1 / M.z;
    if (route && route.k > 0) {
      ctx.setTransform(M.a, M.b, M.c, M.d, M.e, M.f);
      var pts = route.pts, n = pts.length / 2, upto = route.k * route.len;
      ctx.beginPath();
      ctx.moveTo(pts[0], pts[1]);
      var acc = 0, hx = pts[0], hy = pts[1];
      for (var i = 1; i < n; i++) {
        var x0 = pts[2 * i - 2], y0 = pts[2 * i - 1], x1 = pts[2 * i], y1 = pts[2 * i + 1];
        var l = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
        if (acc + l >= upto) { var f = (upto - acc) / l; hx = x0 + (x1 - x0) * f; hy = y0 + (y1 - y0) * f; ctx.lineTo(hx, hy); break; }
        ctx.lineTo(x1, y1); acc += l; hx = x1; hy = y1;
      }
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.lineWidth = 14 * px; ctx.strokeStyle = 'rgba(46,204,113,.16)'; ctx.stroke();
      ctx.lineWidth = 4 * px; ctx.strokeStyle = '#2ECC71'; ctx.stroke();
      ctx.beginPath(); ctx.arc(pts[0], pts[1], 7 * px, 0, 6.2832); ctx.fillStyle = '#EEF2EF'; ctx.fill();
      ctx.beginPath(); ctx.arc(hx, hy, 6 * px, 0, 6.2832); ctx.fillStyle = '#2ECC71'; ctx.fill();
    }
    if (rev && rev.k < 1) {
      var k = rev.k, rad = Math.max(1, k * rev.max), K = M.k;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      if (k <= 0) { ctx.fillStyle = '#050706'; ctx.fillRect(0, 0, cv.width, cv.height); return; }
      var g = ctx.createRadialGradient(rev.x * K, rev.y * K, rad * K * 0.55, rev.x * K, rev.y * K, rad * K);
      g.addColorStop(0, 'rgba(5,7,6,0)');
      g.addColorStop(1, 'rgba(5,7,6,1)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.beginPath();
      ctx.arc(rev.x * K, rev.y * K, rad * K * 0.93, 0, 6.2832);
      ctx.lineWidth = 2 * K;
      ctx.strokeStyle = 'rgba(46,204,113,' + (0.5 * (1 - k)) + ')';
      ctx.stroke();
    }
  }
  function draw(moving) {
    if (moving) { drawBase(true); drawOver(); return; }
    if (!baseOk) {
      drawBase(false);
      if (!base) base = document.createElement('canvas');
      if (base.width !== cv.width || base.height !== cv.height) { base.width = cv.width; base.height = cv.height; }
      base.getContext('2d').drawImage(cv, 0, 0);
      baseOk = true;
    } else {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(base, 0, 0);
    }
    drawOver();
  }

  function eio(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    if (!running) return;
    var now = performance.now(), moving = false, busy = false;
    if (fly) {
      var t = Math.max(0, Math.min(1, (now - fly.t0) / fly.ms)), e = eio(t), A = fly.a, B = fly.b;
      cam.x = lerp(A.x, B.x, e); cam.y = lerp(A.y, B.y, e);
      cam.r = lerp(A.r, B.r, e);
      cam.ax = lerp(A.ax, B.ax, e); cam.ay = lerp(A.ay, B.ay, e);
      var zl = Math.exp(lerp(Math.log(A.z), Math.log(B.z), e));
      cam.z = zl * (1 - fly.dip * Math.sin(Math.PI * e));
      baseOk = false;
      if (t >= 1) fly = null; else moving = true;
    }
    if (rev && rev.t0 !== Infinity) {
      rev.k = Math.max(0, Math.min(1, (now - rev.t0) / rev.ms));
      rev.k = 1 - Math.pow(1 - rev.k, 2.2);
      if (rev.k >= 1) rev = null; else busy = true;
    }
    if (route && route.k < 1) {
      route.k = Math.max(0, Math.min(1, (now - route.t0) / route.ms));
      route.k = 1 - Math.pow(1 - route.k, 2);
      if (route.k < 1) busy = true;
    }
    setQ(moving ? 0.5 : 1);
    if (moving || busy || want) { draw(moving); want = false; }
    if (moving || busy) requestAnimationFrame(tick); else running = false;
  }
  function kick() {
    want = true;
    if (!running) { running = true; requestAnimationFrame(tick); }
  }

  return {
    init: function (canvas) { cv = canvas; ctx = cv.getContext('2d', { alpha: false }); build(); },
    ok: function () { return !!P; },
    resize: function (w, h, r) {
      dpr = r || 1; W = Math.round(w * dpr); H = Math.round(h * dpr);
      cv.width = Math.max(1, Math.round(W * q)); cv.height = Math.max(1, Math.round(H * q));
      baseOk = false;
      kick();
    },
    set: function (tg) { for (var k in tg) cam[k] = tg[k]; fly = null; baseOk = false; kick(); },
    fly: function (tg, ms) {
      var a = { x: cam.x, y: cam.y, z: cam.z, r: cam.r, ax: cam.ax, ay: cam.ay };
      var b = { x: tg.x, y: tg.y, z: tg.z, r: tg.r || 0, ax: tg.ax, ay: tg.ay };
      while (b.r - a.r > Math.PI) b.r -= 2 * Math.PI;
      while (b.r - a.r < -Math.PI) b.r += 2 * Math.PI;
      var zmin = Math.min(a.z, b.z), dist = Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)) * zmin;
      var diag = Math.sqrt(W * W + H * H) / dpr;
      fly = { a: a, b: b, t0: performance.now(), ms: ms || 2400, dip: Math.min(0.5, Math.max(0, (dist / diag - 0.3) * 0.35)) };
      kick();
    },
    reveal: function (x, y, ms) { // ms = 0 - карта закрыта, пока не позовут ещё раз
      rev = { x: x, y: y, t0: ms ? performance.now() : Infinity, ms: ms || 1, k: 0, max: Math.sqrt(W * W + H * H) / dpr * 1.05 };
      kick();
    },
    route: function (pts, ms, delay) {
      var len = 0;
      for (var i = 2; i < pts.length; i += 2) len += Math.sqrt(Math.pow(pts[i] - pts[i - 2], 2) + Math.pow(pts[i + 1] - pts[i - 1], 2));
      route = { pts: pts, len: len, t0: performance.now() + (delay || 0), ms: ms || 1800, k: 0 };
      kick();
    },
    clearRoute: function () { if (route) { route = null; kick(); } },
    labelZ: function (z) { if (z !== labelZ) { labelZ = z; baseOk = false; } },
    dots: function (list) { if (list !== dots) { dots = list; baseOk = false; kick(); } },
    bench: function (n) { // замер: полный кадр и кадр полёта (q = 0.5)
      var z0 = cam.z, x0 = cam.x, r = {}, i, t0;
      t0 = performance.now();
      for (i = 0; i < n; i++) { cam.z = z0 * (0.4 + (i % 5) * 0.3); cam.x = x0 + i * 300; drawBase(false); ctx.getImageData(0, 0, 1, 1); }
      r.full = (performance.now() - t0) / n;
      setQ(0.5); t0 = performance.now();
      for (i = 0; i < n; i++) { cam.z = z0 * (0.4 + (i % 5) * 0.3); cam.x = x0 + i * 300; drawBase(true); ctx.getImageData(0, 0, 1, 1); }
      r.fly = (performance.now() - t0) / n;
      setQ(1); cam.z = z0; cam.x = x0; baseOk = false; kick();
      return r;
    },
    toScreen: toScreen,
    cam: cam,
    redraw: kick
  };
})();
