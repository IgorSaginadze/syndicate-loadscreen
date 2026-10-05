/* emblem.js - знак «СИНДИКАТ» объёмом, на Canvas 2D.
 *
 * В игре нет WebGL: html_chromium.dll запускает CEF с disable-gpu, а папки
 * swiftshader рядом с libcef.dll нет. Поэтому объём считается здесь: ~330
 * граней, отсечение задних по нормали, порядок слоями (не сортировкой по
 * центрам - та роняет букву под пластину), свет - ключ плюс отражение
 * «студии»: две полосы-софтбокса и контровой. Большие плоскости красятся
 * градиентом отражения, поэтому блик едет по ним, пока знак крутится.
 *
 * Пропорции - дословно build/syndlogo.py (badge_mark, mark_cd), в долях R:
 * шестиугольник с плоским верхом, кромка 0.050, тонкая линия 0.870/0.015,
 * буква С - центр -0.04, радиус 0.54, толщина 0.17, дуга 36..324 градусов,
 * ромб - центр 0.46, полуоси 0.15 и 0.23. Оборот знака - тот же знак
 * (повёрнут на 180 градусов вокруг вертикали, читается правильно).
 */
var EMB = (function () {
  'use strict';
  var D2R = Math.PI / 180, COS30 = Math.cos(30 * D2R);
  var EM = [46, 204, 113], ENAMEL = [10, 12, 11], LINEC = [20, 62, 39];

  var RO = 1.0, RI = RO - 0.050 / COS30;
  var LR0 = 0.870, LR1 = 0.870 - 0.015 / COS30;
  var CCX = -0.04, CRO = 0.54, CRI = 0.54 - 0.17, CA0 = 36 * D2R, CA1 = 324 * D2R;
  var DX = 0.46, DA = 0.15, DH = 0.23;
  // рельеф: кромка выше эмали, буква и ромб выше кромки
  var ZR = 0.105, ZP = 0.070, ZC = 0.140, BR = 0.022, BC = 0.026;
  var NSEG = 40;

  var W = 560, CXS = 280, CYS = 280, SCALE = 170;   // макетные единицы холста
  var cv, ctx, k = 1;
  var FACES = [];

  // ── геометрия ─────────────────────────────────────────────────────────
  function hexPt(r, i) { var a = i * 60 * D2R; return [r * Math.cos(a), r * Math.sin(a)]; }
  function nrm(v) { var l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
  function face(p, n, mat, layer, obj, grad, axis) {
    FACES.push({ p: p, n: nrm(n), m: mat, L: layer, o: obj || '', g: !!grad, ax: axis || null,
      s: 0, q: [], d: 0, vis: false, rn: [0, 0, 0], rc: [0, 0, 0] });
  }

  function buildSide(sg) {
    // sg = +1 лицо, -1 оборот (поворот на 180 градусов вокруг Y: x -> -x, z -> -z)
    function P(x, y, z) { return [x * sg, y, z * sg]; }
    var L = 'S' + sg, i, a, c, s, i2;
    for (i = 0; i < 6; i++) {
      i2 = (i + 1) % 6;
      a = (i * 60 + 30) * D2R; c = Math.cos(a); s = Math.sin(a);
      var o0 = hexPt(RO, i), o1 = hexPt(RO, i2);
      var t0 = hexPt(RO - BR / COS30, i), t1 = hexPt(RO - BR / COS30, i2);
      var u0 = hexPt(RI + BR / COS30, i), u1 = hexPt(RI + BR / COS30, i2);
      var n0 = hexPt(RI, i), n1 = hexPt(RI, i2);
      // наружная фаска кромки
      face([P(o0[0], o0[1], ZR - BR), P(o1[0], o1[1], ZR - BR), P(t1[0], t1[1], ZR), P(t0[0], t0[1], ZR)],
        P(c, s, 1.05), 'm', 'A', 'rim');
      // верх кромки
      face([P(t0[0], t0[1], ZR), P(t1[0], t1[1], ZR), P(u1[0], u1[1], ZR), P(u0[0], u0[1], ZR)],
        P(0, 0, 1), 'm', L, 'rim', true, [P((t0[0] + u0[0]) / 2, (t0[1] + u0[1]) / 2, ZR), P((t1[0] + u1[0]) / 2, (t1[1] + u1[1]) / 2, ZR)]);
      // внутренняя фаска и стенка кромки
      face([P(u0[0], u0[1], ZR), P(u1[0], u1[1], ZR), P(n1[0], n1[1], ZR - BR), P(n0[0], n0[1], ZR - BR)],
        P(-c, -s, 1.05), 'm', L, 'rim');
      face([P(n0[0], n0[1], ZR - BR), P(n1[0], n1[1], ZR - BR), P(n1[0], n1[1], ZP), P(n0[0], n0[1], ZP)],
        P(-c, -s, 0), 'm', L, 'rim');
      // тонкая линия на эмали
      var l0 = hexPt(LR0, i), l1 = hexPt(LR0, i2), m0 = hexPt(LR1, i), m1 = hexPt(LR1, i2);
      face([P(l0[0], l0[1], ZP), P(l1[0], l1[1], ZP), P(m1[0], m1[1], ZP), P(m0[0], m0[1], ZP)],
        P(0, 0, 1), 'l', L, 'line');
    }
    // эмаль
    var pl = [];
    for (i = 0; i < 6; i++) { var h = hexPt(RI, i); pl.push(P(h[0], h[1], ZP)); }
    face(pl, P(0, 0, 1), 'e', L, 'plate', true, [P(-RI, 0.25, ZP), P(RI, -0.25, ZP)]);

    // буква С
    var j, t, th0, th1, ro = CRO, ri = CRI, rob = CRO - BC, rib = CRI + BC;
    var dO = BC / rob, dI = BC / rib;
    function arc(r, a0, a1, n) {
      var out = [];
      for (var q = 0; q <= n; q++) { var th = a0 + (a1 - a0) * q / n; out.push([CCX + r * Math.cos(th), r * Math.sin(th)]); }
      return out;
    }
    var AO = arc(ro, CA0, CA1, NSEG), AI = arc(ri, CA0, CA1, NSEG);
    var BO = arc(rob, CA0 + dO, CA1 - dO, NSEG), BI = arc(rib, CA0 + dI, CA1 - dI, NSEG);
    var zt = ZC - BC;
    for (j = 0; j < NSEG; j++) {
      t = CA0 + (CA1 - CA0) * (j + 0.5) / NSEG; c = Math.cos(t); s = Math.sin(t);
      face([P(AO[j][0], AO[j][1], ZP), P(AO[j + 1][0], AO[j + 1][1], ZP), P(AO[j + 1][0], AO[j + 1][1], zt), P(AO[j][0], AO[j][1], zt)],
        P(c, s, 0), 'm', L, 'C', false);
      face([P(AI[j][0], AI[j][1], ZP), P(AI[j + 1][0], AI[j + 1][1], ZP), P(AI[j + 1][0], AI[j + 1][1], zt), P(AI[j][0], AI[j][1], zt)],
        P(-c, -s, 0), 'm', L, 'C', false);
      face([P(AO[j][0], AO[j][1], zt), P(AO[j + 1][0], AO[j + 1][1], zt), P(BO[j + 1][0], BO[j + 1][1], ZC), P(BO[j][0], BO[j][1], ZC)],
        P(c, s, 1.05), 'm', L, 'Cb', false);
      face([P(AI[j][0], AI[j][1], zt), P(AI[j + 1][0], AI[j + 1][1], zt), P(BI[j + 1][0], BI[j + 1][1], ZC), P(BI[j][0], BI[j][1], ZC)],
        P(-c, -s, 1.05), 'm', L, 'Cb', false);
    }
    // торцы буквы
    th0 = CA0; th1 = CA1;
    var e0 = [Math.sin(th0), -Math.cos(th0), 0], e1 = [-Math.sin(th1), Math.cos(th1), 0];
    face([P(AI[0][0], AI[0][1], ZP), P(AO[0][0], AO[0][1], ZP), P(AO[0][0], AO[0][1], zt), P(AI[0][0], AI[0][1], zt)],
      P(e0[0], e0[1], 0), 'm', L, 'C');
    face([P(AO[NSEG][0], AO[NSEG][1], ZP), P(AI[NSEG][0], AI[NSEG][1], ZP), P(AI[NSEG][0], AI[NSEG][1], zt), P(AO[NSEG][0], AO[NSEG][1], zt)],
      P(e1[0], e1[1], 0), 'm', L, 'C');
    face([P(AI[0][0], AI[0][1], zt), P(AO[0][0], AO[0][1], zt), P(BO[0][0], BO[0][1], ZC), P(BI[0][0], BI[0][1], ZC)],
      P(e0[0], e0[1], 1.05), 'm', L, 'Cb');
    face([P(AO[NSEG][0], AO[NSEG][1], zt), P(AI[NSEG][0], AI[NSEG][1], zt), P(BI[NSEG][0], BI[NSEG][1], ZC), P(BO[NSEG][0], BO[NSEG][1], ZC)],
      P(e1[0], e1[1], 1.05), 'm', L, 'Cb');
    var top = [];
    for (j = 0; j <= NSEG; j++) top.push(P(BO[j][0], BO[j][1], ZC));
    for (j = NSEG; j >= 0; j--) top.push(P(BI[j][0], BI[j][1], ZC));
    face(top, P(0, 0, 1), 'm', L, 'Ct', true, [P(CCX - CRO, 0.2, ZC), P(CCX + CRO * 0.8, -0.2, ZC)]);

    // ромб
    var dv = [[DX + DA, 0], [DX, DH], [DX - DA, 0], [DX, -DH]];
    var dd = DA * DH / Math.sqrt(DA * DA + DH * DH), kk = (dd - BC) / dd;
    var di = dv.map(function (v) { return [DX + (v[0] - DX) * kk, v[1] * kk]; });
    for (i = 0; i < 4; i++) {
      i2 = (i + 1) % 4;
      var ex = dv[i2][0] - dv[i][0], ey = dv[i2][1] - dv[i][1];
      var nx = ey, ny = -ex;                           // наружу от ромба (обход против часовой)
      var mx = (dv[i][0] + dv[i2][0]) / 2 - DX, my = (dv[i][1] + dv[i2][1]) / 2;
      if (nx * mx + ny * my < 0) { nx = -nx; ny = -ny; }
      face([P(dv[i][0], dv[i][1], ZP), P(dv[i2][0], dv[i2][1], ZP), P(dv[i2][0], dv[i2][1], zt), P(dv[i][0], dv[i][1], zt)],
        P(nx, ny, 0), 'm', L, 'D');
      face([P(dv[i][0], dv[i][1], zt), P(dv[i2][0], dv[i2][1], zt), P(di[i2][0], di[i2][1], ZC), P(di[i][0], di[i][1], ZC)],
        P(nx, ny, Math.sqrt(nx * nx + ny * ny) * 1.05), 'm', L, 'Db');
    }
    face(di.map(function (v) { return P(v[0], v[1], ZC); }), P(0, 0, 1), 'm', L, 'Dt', true,
      [P(DX - DA, 0.12, ZC), P(DX + DA, -0.12, ZC)]);
  }

  function build() {
    FACES = [];
    // наружная стенка общая для лица и оборота
    for (var i = 0; i < 6; i++) {
      var i2 = (i + 1) % 6, a = (i * 60 + 30) * D2R, o0 = hexPt(RO, i), o1 = hexPt(RO, i2);
      face([[o0[0], o0[1], -(ZR - BR)], [o1[0], o1[1], -(ZR - BR)], [o1[0], o1[1], ZR - BR], [o0[0], o0[1], ZR - BR]],
        [Math.cos(a), Math.sin(a), 0], 'm', 'A', 'wall');
    }
    buildSide(1);
    buildSide(-1);
  }

  // ── свет ──────────────────────────────────────────────────────────────
  var LKEY = nrm([-0.5, 0.62, 0.68]);
  var SOFT = [   // полосы студии: направление, полуширина по азимуту, по высоте, сила
    { d: nrm([-0.62, 0.30, 0.72]), w: 0.16, h: 0.70, e: 1.35 },
    { d: nrm([0.30, 0.86, 0.40]), w: 0.85, h: 0.13, e: 0.60 },
    { d: nrm([0.86, 0.06, -0.50]), w: 0.14, h: 0.55, e: 1.00 },
    { d: nrm([0.55, -0.15, 0.82]), w: 0.10, h: 0.35, e: 0.45 }
  ];
  function sstep(a, b, x) { var t = (x - a) / (b - a); t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }
  function env(r) {
    var v = 0.035 + 0.09 * Math.max(0, r[1]) + 0.02 * Math.max(0, -r[1]);
    var ra = Math.atan2(r[0], r[2]), re = Math.asin(Math.max(-1, Math.min(1, r[1])));
    for (var i = 0; i < SOFT.length; i++) {
      var S = SOFT[i], da = ra - Math.atan2(S.d[0], S.d[2]);
      while (da > Math.PI) da -= 2 * Math.PI;
      while (da < -Math.PI) da += 2 * Math.PI;
      var de = re - Math.asin(S.d[1]);
      v += S.e * sstep(1, 0.55, Math.abs(da) / S.w) * sstep(1, 0.5, Math.abs(de) / S.h);
    }
    return v;
  }
  function clamp8(x) { return x < 0 ? 0 : x > 255 ? 255 : x | 0; }
  var litBoost = 0;
  function shade(mat, n, P) {
    var vx = -P[0], vy = -P[1], vz = CAM - P[2], vl = Math.sqrt(vx * vx + vy * vy + vz * vz);
    vx /= vl; vy /= vl; vz /= vl;
    var nd = n[0] * vx + n[1] * vy + n[2] * vz;
    var rx = 2 * nd * n[0] - vx, ry = 2 * nd * n[1] - vy, rz = 2 * nd * n[2] - vz;
    var e = env([rx, ry, rz]);
    var dif = Math.max(0, n[0] * LKEY[0] + n[1] * LKEY[1] + n[2] * LKEY[2]);
    var fr = Math.pow(1 - Math.max(0, nd), 3);
    var r, g, b;
    if (mat === 'm') {
      var base = 0.10 + 0.52 * dif + litBoost, sp = 0.78 * e, hot = Math.pow(e, 2.4) * 0.55 + fr * 0.10;
      r = EM[0] * (base + sp) + 255 * hot; g = EM[1] * (base + sp) + 255 * hot; b = EM[2] * (base + sp) + 255 * hot;
    } else if (mat === 'e') {
      var cc = e * 0.26 + fr * 0.05;
      r = ENAMEL[0] + 220 * cc + EM[0] * e * 0.05; g = ENAMEL[1] + 230 * cc + EM[1] * e * 0.07; b = ENAMEL[2] + 225 * cc + EM[2] * e * 0.05;
    } else {
      var lb = 0.75 + 0.5 * dif + litBoost;
      r = LINEC[0] * lb + 40 * e; g = LINEC[1] * lb + 60 * e; b = LINEC[2] * lb + 45 * e;
    }
    return 'rgb(' + clamp8(r) + ',' + clamp8(g) + ',' + clamp8(b) + ')';
  }

  // ── проекция ──────────────────────────────────────────────────────────
  var CAM = 4.6;
  var R = { cy: 1, sy: 0, cp: 1, sp: 0, cr: 1, sr: 0, dz: 1 };
  function rot(v, out) {
    var x = v[0], y = v[1], z = v[2] * R.dz;
    var x1 = x * R.cy + z * R.sy, z1 = -x * R.sy + z * R.cy;          // рысканье (Y)
    var y2 = y * R.cp - z1 * R.sp, z2 = y * R.sp + z1 * R.cp;          // тангаж (X)
    out[0] = x1 * R.cr - y2 * R.sr; out[1] = x1 * R.sr + y2 * R.cr; out[2] = z2;   // крен (Z)
    return out;
  }
  function rotN(v, out) {
    var x = v[0], y = v[1], z = v[2];
    var x1 = x * R.cy + z * R.sy, z1 = -x * R.sy + z * R.cy;
    var y2 = y * R.cp - z1 * R.sp, z2 = y * R.sp + z1 * R.cp;
    out[0] = x1 * R.cr - y2 * R.sr; out[1] = x1 * R.sr + y2 * R.cr; out[2] = z2;
    return out;
  }
  var tmp = [0, 0, 0];
  function proj(v) { // повернутая точка -> [sx, sy]
    var f = CAM / (CAM - v[2]);
    return [CXS + v[0] * SCALE * f, CYS - v[1] * SCALE * f];
  }

  function prep() {
    for (var i = 0; i < FACES.length; i++) {
      var F = FACES[i], p = F.p, n = p.length, cx = 0, cy = 0, cz = 0;
      if (F.q.length !== n) { F.q = []; F.r = []; for (var j0 = 0; j0 < n; j0++) { F.q.push([0, 0]); F.r.push([0, 0, 0]); } }
      for (var j = 0; j < n; j++) {
        rot(p[j], F.r[j]);
        var f = CAM / (CAM - F.r[j][2]);
        F.q[j][0] = CXS + F.r[j][0] * SCALE * f; F.q[j][1] = CYS - F.r[j][1] * SCALE * f;
        cx += F.r[j][0]; cy += F.r[j][1]; cz += F.r[j][2];
      }
      F.rc[0] = cx / n; F.rc[1] = cy / n; F.rc[2] = cz / n;
      rotN(F.n, F.rn);
      var vx = -F.rc[0], vy = -F.rc[1], vz = CAM - F.rc[2];
      F.vis = (F.rn[0] * vx + F.rn[1] * vy + F.rn[2] * vz) > 1e-4;
      F.d = CAM - F.rc[2];
      // плоская грань без высоты (знак ещё не выдавлен) - не рисуем стенки
      if (R.dz < 0.02 && Math.abs(F.n[2]) < 0.5) F.vis = false;
    }
  }

  function poly(F, style) {
    var q = F.q;
    ctx.beginPath();
    ctx.moveTo(q[0][0], q[0][1]);
    for (var j = 1; j < q.length; j++) ctx.lineTo(q[j][0], q[j][1]);
    ctx.closePath();
    ctx.fillStyle = style;
    ctx.fill();
    ctx.strokeStyle = style;
    ctx.stroke();
  }
  function paint(F) {
    if (!F.vis) return;
    if (F.g && F.ax) {
      var a = rot(F.ax[0], [0, 0, 0]), b = rot(F.ax[1], [0, 0, 0]);
      var pa = proj(a), pb = proj(b);
      var gr = ctx.createLinearGradient(pa[0], pa[1], pb[0], pb[1]);
      for (var s = 0; s <= 6; s++) {
        var t = s / 6, P = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
        gr.addColorStop(t, shade(F.m, F.rn, P));
      }
      poly(F, gr);
    } else {
      poly(F, shade(F.m, F.rn, F.rc));
    }
  }
  function byDepth(a, b) { return b.d - a.d; }

  var cache = { A: [], S1: [], S_1: [] };
  function draw3d() {
    prep();
    ctx.lineWidth = 0.9;
    ctx.lineJoin = 'round';
    var A = [], side = [], i;
    // какая сторона смотрит в камеру: нормаль эмали лица
    var front = rotN([0, 0, 1], [0, 0, 0]);
    var face1 = (front[2] * CAM - 0) > 0 ? 1 : -1;
    var key = 'S' + face1;
    for (i = 0; i < FACES.length; i++) {
      var F = FACES[i];
      if (F.L === 'A') A.push(F); else if (F.L === key) side.push(F);
    }
    A.sort(byDepth);
    for (i = 0; i < A.length; i++) paint(A[i]);
    var plate = null, line = [], rimFar = [], rimNear = [], C = [], Cb = [], Ct = null, D = [], Db = [], Dt = null;
    var cd = CAM - rot([0, 0, 0], [0, 0, 0])[2];
    for (i = 0; i < side.length; i++) {
      F = side[i];
      if (F.o === 'plate') plate = F;
      else if (F.o === 'line') line.push(F);
      else if (F.o === 'rim') (F.d > cd ? rimFar : rimNear).push(F);
      else if (F.o === 'C') C.push(F);
      else if (F.o === 'Cb') Cb.push(F);
      else if (F.o === 'Ct') Ct = F;
      else if (F.o === 'D') D.push(F);
      else if (F.o === 'Db') Db.push(F);
      else if (F.o === 'Dt') Dt = F;
    }
    if (plate) paint(plate);
    for (i = 0; i < line.length; i++) paint(line[i]);
    rimFar.sort(byDepth);
    for (i = 0; i < rimFar.length; i++) paint(rimFar[i]);
    var objs = [[C, Cb, Ct], [D, Db, Dt]];
    var dC = Ct ? Ct.d : 0, dD = Dt ? Dt.d : 0;
    if (dD > dC) objs.reverse();
    for (var o = 0; o < 2; o++) {
      var w = objs[o][0], bv = objs[o][1];
      w.sort(byDepth); bv.sort(byDepth);
      for (i = 0; i < w.length; i++) paint(w[i]);
      for (i = 0; i < bv.length; i++) paint(bv[i]);
      if (objs[o][2]) paint(objs[o][2]);
    }
    rimNear.sort(byDepth);
    for (i = 0; i < rimNear.length; i++) paint(rimNear[i]);
  }

  // ── плоский рисунок вступления ─────────────────────────────────────────
  function sx(x) { return CXS + x * SCALE; }
  function sy(y) { return CYS - y * SCALE; }
  function halfHex(r, t, dir) { // от левой вершины вверх (dir=1) или вниз (-1), доля t пути
    var pts = [], seq = dir > 0 ? [3, 2, 1, 0] : [3, 4, 5, 0], total = 3 * t;
    var p0 = hexPt(r, seq[0]);
    pts.push([sx(p0[0]), sy(p0[1])]);
    for (var e = 0; e < 3 && total > 0; e++) {
      var a = hexPt(r, seq[e]), b = hexPt(r, seq[e + 1]), f = Math.min(1, total);
      pts.push([sx(a[0] + (b[0] - a[0]) * f), sy(a[1] + (b[1] - a[1]) * f)]);
      total -= 1;
    }
    return pts;
  }
  function strokePts(pts, w, style, closed) {
    if (pts.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    if (closed) ctx.closePath();
    ctx.lineWidth = w; ctx.strokeStyle = style; ctx.lineJoin = 'miter'; ctx.lineCap = 'butt';
    ctx.stroke();
  }
  // обе половины рамки - ОДНОЙ линией: левая вершина становится изломом линии (острый стык),
  // а не двумя торцами встык (между торцами под 120° оставалась щель); целая рамка замыкается
  function hexRun(r, t) {
    var dn = halfHex(r, t, -1).reverse(), up = halfHex(r, t, 1);
    return { pts: dn.concat(up.slice(1)), ends: [dn[0], up[up.length - 1]], closed: t >= 1 };
  }
  function spark(p, a) {
    var g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 26);
    g.addColorStop(0, 'rgba(235,255,242,' + a + ')');
    g.addColorStop(0.25, 'rgba(46,204,113,' + a * 0.55 + ')');
    g.addColorStop(1, 'rgba(46,204,113,0)');
    ctx.fillStyle = g;
    ctx.fillRect(p[0] - 26, p[1] - 26, 52, 52);
  }
  function drawFlat(st) {
    var i, h;
    if (st.plate > 0) {
      ctx.beginPath();
      for (i = 0; i < 6; i++) { h = hexPt(RI, i); if (i) ctx.lineTo(sx(h[0]), sy(h[1])); else ctx.moveTo(sx(h[0]), sy(h[1])); }
      ctx.closePath();
      ctx.fillStyle = 'rgba(10,12,11,' + st.plate + ')';
      ctx.fill();
    }
    var rm = (RO + RI) / 2, wr = (RO - RI) * COS30 * SCALE;
    if (st.o > 0) {
      var run = hexRun(rm, st.o);
      if (run.closed) run.pts.pop();                       // последняя точка = первая: замкнёт closePath
      strokePts(run.pts, wr * 3.2, 'rgba(46,204,113,.10)', run.closed);
      strokePts(run.pts, wr, 'rgb(46,204,113)', run.closed);
      if (st.o < 1) { spark(run.ends[0], 1); spark(run.ends[1], 1); }
    }
    if (st.l > 0) {
      var lm = (LR0 + LR1) / 2, wl = (LR0 - LR1) * COS30 * SCALE;
      var lr = hexRun(lm, st.l);
      if (lr.closed) lr.pts.pop();
      strokePts(lr.pts, wl, 'rgb(20,62,39)', lr.closed);
    }
    if (st.c > 0) {
      var g = st.c * 144 * D2R, m = Math.PI;
      ctx.beginPath();
      ctx.arc(sx(CCX), sy(0), CRO * SCALE, m - g, m + g, false);
      ctx.arc(sx(CCX), sy(0), CRI * SCALE, m + g, m - g, true);
      ctx.closePath();
      ctx.fillStyle = 'rgb(46,204,113)';
      ctx.fill();
      if (st.c < 1) {
        spark([sx(CCX + (CRO + CRI) / 2 * Math.cos(m - g)), sy((CRO + CRI) / 2 * Math.sin(m - g))], 0.9);
        spark([sx(CCX + (CRO + CRI) / 2 * Math.cos(m + g)), sy((CRO + CRI) / 2 * Math.sin(m + g))], 0.9);
      }
    }
    if (st.d > 0) {
      var ds = st.d;
      ctx.beginPath();
      ctx.moveTo(sx(DX + DA * ds), sy(0));
      ctx.lineTo(sx(DX), sy(DH * ds));
      ctx.lineTo(sx(DX - DA * ds), sy(0));
      ctx.lineTo(sx(DX), sy(-DH * ds));
      ctx.closePath();
      ctx.fillStyle = 'rgb(46,204,113)';
      ctx.fill();
    }
  }
  function flash(a, rr) {
    if (a <= 0) return;
    var x = sx(DX), y = sy(0);
    var g = ctx.createRadialGradient(x, y, 0, x, y, 190);
    g.addColorStop(0, 'rgba(240,255,246,' + (0.85 * a) + ')');
    g.addColorStop(0.18, 'rgba(120,240,170,' + (0.35 * a) + ')');
    g.addColorStop(1, 'rgba(46,204,113,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - 190, y - 190, 380, 380);
    if (rr > 0) {
      ctx.beginPath();
      ctx.arc(CXS, CYS, 60 + rr * 220, 0, Math.PI * 2);
      ctx.lineWidth = 2 + 6 * (1 - rr);
      ctx.strokeStyle = 'rgba(46,204,113,' + (0.55 * (1 - rr)) + ')';
      ctx.stroke();
    }
  }
  function glow(a) {
    var g = ctx.createRadialGradient(CXS, CYS, 30, CXS, CYS, 270);
    g.addColorStop(0, 'rgba(46,204,113,' + (0.20 * a) + ')');
    g.addColorStop(0.45, 'rgba(46,204,113,' + (0.07 * a) + ')');
    g.addColorStop(1, 'rgba(46,204,113,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, W);
  }

  // ── время ─────────────────────────────────────────────────────────────
  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function span(t, a, b) { return clamp((t - a) / (b - a)); }
  function eio(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function eout(t) { return 1 - Math.pow(1 - t, 3); }
  function eback(t) { var c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }

  var t0 = 0, last = 0, lastDraw = 0, yaw = 0, kickV = 0, running = false, introOn = true;
  var OMEGA0 = 26 * D2R, SWITCH = 1850;

  function frame(now) {
    if (!running) return;
    requestAnimationFrame(frame);
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    var t = introOn ? now - t0 : 1e9;
    if (!introOn) {
      kickV *= Math.exp(-dt / 0.42);
      yaw += (OMEGA0 + kickV) * dt;
      // в покое 30 кадров в секунду: знак крутится медленно, а кадр объёма
      // в игре (рисует процессор) стоит ~5 мс
      if (kickV < 0.4 && now - lastDraw < 30) return;
    }
    lastDraw = now;
    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.clearRect(0, 0, W, W);
    var st = {
      o: eio(span(t, 120, 1150)), l: eio(span(t, 520, 1320)), c: eout(span(t, 860, 1560)),
      d: eback(span(t, 1430, 1800)), plate: span(t, 250, 1500)
    };
    var fl = t > 1650 ? Math.max(0, 1 - (t - 1650) / 750) : 0;
    var rr = span(t, 1650, 2500);
    if (t < SWITCH) {
      drawFlat(st);
      flash(fl, rr);
      return;
    }
    // объём
    var zt = eout(span(t, SWITCH, SWITCH + 1100));
    var spin = eout(span(t, SWITCH, SWITCH + 1900));
    var ts = now / 1000;
    if (t < SWITCH + 1900) yaw = spin * (Math.PI * 2 + 24 * D2R);
    else if (introOn && t > SWITCH + 1900) introOn = false;
    var pit = (9 + 5 * Math.sin(ts * 0.55)) * D2R * zt;
    var rol = 2.2 * Math.sin(ts * 0.37) * D2R * zt;
    R.cy = Math.cos(yaw); R.sy = Math.sin(yaw);
    R.cp = Math.cos(pit); R.sp = Math.sin(pit);
    R.cr = Math.cos(rol); R.sr = Math.sin(rol);
    R.dz = 0.001 + zt;
    litBoost = 0.35 * fl;
    draw3d();
    flash(fl, rr);
  }

  var KMAX = 1.7;   // заставка во весь экран поднимает потолок на время (site.js, splash)
  function resize(scale) {
    // потолок 1.7: на 4K холст знака иначе вырос бы до 1120 px и кадр объёма
    // стоил бы ~12 мс процессора; лёгкое растяжение там незаметно
    k = Math.max(0.5, Math.min(KMAX, scale));
    var px = Math.round(W * k);
    if (cv.width !== px) { cv.width = px; cv.height = px; }
  }

  return {
    init: function (canvas) {
      cv = canvas; ctx = cv.getContext('2d');
      build();
    },
    resize: resize,
    cap: function (c) { KMAX = c; },
    started: function () { return running; },
    start: function (skipIntro) {
      running = true;
      last = performance.now();
      t0 = last - (skipIntro ? 99999 : 0);
      if (skipIntro) { introOn = false; yaw = 20 * D2R; }
      requestAnimationFrame(frame);
    },
    stop: function () { running = false; },
    kick: function (v) { kickV += (v || 560) * D2R; },
    bench: function (n) { // замер кадра знака в объёме
      var t0 = performance.now();
      for (var i = 0; i < n; i++) {
        yaw = i * 0.21; R.cy = Math.cos(yaw); R.sy = Math.sin(yaw); R.cp = Math.cos(0.15); R.sp = Math.sin(0.15); R.cr = 1; R.sr = 0; R.dz = 1;
        ctx.setTransform(k, 0, 0, k, 0, 0); ctx.clearRect(0, 0, W, W); draw3d(); ctx.getImageData(0, 0, 1, 1);
      }
      return (performance.now() - t0) / n;
    },
    faces: function () { return FACES.length; }
  };
})();
